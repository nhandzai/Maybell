const db = require('../../library/models');


async function addProduct(productId, quantity, userId) {
    try {
        console.log("productId",productId);
        
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
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
}



async function fetchCartProducts(userId) {
    console.log("userId", userId);

    try {
        const cartItems = await db.carts.findAll({
            where: { userId },
            attributes: [
                'quantity','id',
            ],
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

    } catch (error) {
        console.error('Error fetching cart products:', error);
        throw error;
    }
}


async function updateCartProduct(action, productCartId, userId) {
    try {
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

    } catch (error) {
        console.error('Error updating cart:', error);
        return { success: false, message: 'An error occurred while updating the cart' };
    }
}

module.exports = { addProduct, fetchCartProducts, updateCartProduct };
