const db = require('../../library/models');
const client = require('../redis/redis.js'); 

async function addProduct(productId, quantity, userId, sessionKey) {
    try {
        
        if(userId){
        const [cart] = await db.carts.findOrCreate({
            where: { userId, productId },
            defaults: { quantity },
        });
        console.log("cart",cart);
      
        if (!cart._options.isNewRecord) {
            await cart.update({
                quantity: cart.quantity + quantity,
            });
        }
    }else{
        let cart = await client.get(sessionKey).then(reply => reply ? JSON.parse(reply) : []);

            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({ id: productId, quantity: quantity});
            }

            await client.set(sessionKey, JSON.stringify(cart));
        };

    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
}



async function fetchCartProducts(userId, sessionKey) {
    try {
        // Nếu người dùng đã đăng nhập, lấy giỏ hàng từ cơ sở dữ liệu
        if (userId) {
            const cartItems = await db.carts.findAll({
                where: { userId },
                attributes: ['quantity', 'id'],
                include: [
                    {
                        model: db.products,
                        attributes: ['id', 'name', 'realPrice', 'price', 'promotion'],
                        include: [
                            {
                                model: db.productImages,
                                attributes: ['image'],
                            },
                        ],
                    },
                ],
            });

            if (cartItems.length === 0) {
                return { cartItems: [], totalCartPrice: 0 };
            }

            let totalCartPrice = 0;

            const cartWithTotalPrice = cartItems.map(item => {
                const product = item.product;
                const totalPrice = item.quantity * (product.realPrice || product.price);
                totalCartPrice += totalPrice;
                return {
                    ...item.get({ plain: true }),
                    totalPrice,
                };
            });

            return { cartItems: cartWithTotalPrice, totalCartPrice };
        }

        // Nếu người dùng chưa đăng nhập, lấy giỏ hàng từ Redis
        else {
            let cart = await client.get(sessionKey).then(reply => reply ? JSON.parse(reply) : []);
            if (cart.length === 0) {
                return { cartItems: [], totalCartPrice: 0 };
            }

            let totalCartPrice = 0;

            // Lấy thông tin sản phẩm từ Redis và tính toán giá trị
            const cartWithTotalPrice = await Promise.all(cart.map(async (item) => {
                const product = await db.products.findOne({
                    where: { id: item.id },
                    attributes: ['id', 'name', 'realPrice', 'price', 'promotion'],
                    include: [
                        {
                            model: db.productImages,
                            attributes: ['image'],
                        },
                    ],
                });

                if (!product) return null; // Nếu không tìm thấy sản phẩm, trả về null

                const totalPrice = item.quantity * (product.realPrice || product.price);
                totalCartPrice += totalPrice;

                return {
                    id: product.id,
                    quantity: item.quantity,
                    totalPrice,
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        realPrice: product.realPrice,
                        promotion: product.promotion,
                        productImages: product.productImages,
                    },
                };
            }));

            return { cartItems: cartWithTotalPrice.filter(item => item !== null), totalCartPrice };
        }

    } catch (error) {
        console.error('Error fetching cart products:', error);
        throw error;
    }
}



async function updateCartProduct(action, productCartId, userId, sessionKey) {
    try {
    
        if (userId) {
            const cartProduct = await db.carts.findOne({
                where: { id: productCartId },
            });

            if (!cartProduct) {
                return { success: false, message: 'Product not found in cart' };
            }

            if (action === 'increase') {
                cartProduct.quantity += 1;
            } else if (action === 'decrease' && cartProduct.quantity > 1) {
                cartProduct.quantity -= 1;
            } else if (action === 'delete') {
                await cartProduct.destroy();
                return { success: true, message: 'Product removed from cart' };
            } else {
                return { success: false, message: 'Invalid action' };
            }

            await cartProduct.save();
            const { cartItems, totalCartPrice } = await fetchCartProducts(userId);
            return { success: true, cartItems, totalCartPrice };
        }
  
        else {
            let cart = await client.get(sessionKey).then(reply => reply ? JSON.parse(reply) : []);
            if (cart.length === 0) {
                return { success: false, message: 'No products in cart' };
            }

            const productIndex = cart.findIndex(item => item.id === productCartId);
            if (productIndex === -1) {
                return { success: false, message: 'Product not found in cart' };
            }

            if (action === 'increase') {
                cart[productIndex].quantity += 1;
            } else if (action === 'decrease' && cart[productIndex].quantity > 1) {
                cart[productIndex].quantity -= 1;
            } else if (action === 'delete') {
                cart.splice(productIndex, 1); 
            } else {
                return { success: false, message: 'Invalid action' };
            }


            await client.set(sessionKey, JSON.stringify(cart));

      
            let totalCartPrice = 0;
            const cartWithTotalPrice = await Promise.all(cart.map(async (item) => {
                const product = await db.products.findOne({
                    where: { id: item.id },
                    attributes: ['id', 'name', 'realPrice', 'price', 'promotion'],
                    include: [{ model: db.productImages, attributes: ['image'] }],
                });

                if (!product) return null;

                const totalPrice = item.quantity * (product.realPrice || product.price);
                totalCartPrice += totalPrice;

                return {
                    id: product.id,
                    quantity: item.quantity,
                    totalPrice,
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        realPrice: product.realPrice,
                        promotion: product.promotion,
                        productImages: product.productImages,
                    },
                };
            }));

            return { success: true, cartItems: cartWithTotalPrice.filter(item => item !== null), totalCartPrice };
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        return { success: false, message: 'An error occurred while updating the cart' };
    }
}
async function mergeCart(userId, sessionKey) {
    try {
        console.log("userId",userId);
        console.log("sessionKey--",sessionKey);
        let cartFromRedis = await client.get(sessionKey).then(reply => reply ? JSON.parse(reply) : []);
        
        if (cartFromRedis.length === 0) {
            return { success: true, message: 'No products in cart to merge' };
        }
     
            for (let item of cartFromRedis) {
                const productId = item.id;
                const quantity = item.quantity;

              
                const [cart] = await db.carts.findOrCreate({
                    where: { userId, productId },
                    defaults: { quantity },
                });

                if (!cart._options.isNewRecord) {    
                    const currentQuantity = parseInt(cart.quantity, 10) || 0;
                    await cart.update({
                        quantity: currentQuantity + quantity,
                    });
                }
                console.log("cart",cart);
            }

            
            await client.del(sessionKey);

            return { success: true, message: 'Cart merged successfully from Redis to DB' };
        
    } catch (error) {
        console.error('Error merging cart:', error);
        return { success: false, message: 'An error occurred while merging the cart' };
    }
}



module.exports = { addProduct, fetchCartProducts, updateCartProduct, mergeCart };
