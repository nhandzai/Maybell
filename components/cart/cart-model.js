const db = require('../../library/models');


async function addProduct(productId, quantity, userId) {
    try {

        const [cart] = await db.carts.findOrCreate({
            where: { userId },
            defaults: { status: true }
        });

        const [cartProduct, created] = await db.cartProducts.findOrCreate({
            where: {
                cartId: cart.id,
                productId
            },
            defaults: { quantity }
        });

        if (!created) {

            await cartProduct.update({
                quantity: cartProduct.quantity + quantity
            });
        }


        const cartProducts = await db.cartProducts.findAll({
            where: { cartId: cart.id },
            include: [
                {
                    model: db.products,
                    attributes: ['realPrice']
                }
            ]
        });
        let totalPrice = 0;
        cartProducts.forEach(item => {
            totalPrice += item.quantity * item.product.realPrice;
        });

        await cart.update({
            totalPrice
        });

    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error;
    }
}



async function fetchCartProducts(userId) {

    try {
        const cart = await db.carts.findOne({
            where: {
                userId,
                status: true
            },
            attributes: ['id', 'totalPrice'],
            include: [{
                model: db.cartProducts,
                where: { cartId: db.Sequelize.col('carts.id') },
                include: [{
                    model: db.products,
                    attributes: ['id', 'name', 'realPrice', 'price', 'promotion'],
                    include: [{
                        model: db.productImages,
                        attributes: ['image']
                    }]
                }]
            }]
        });

        if (!cart) {
            return [];
        }
        return cart;

    } catch (error) {
        console.error('Error fetching cart products:', error);
        throw error;
    }
}
async function updateCartProduct(action, productCartId, userId, res) {
    try {

        const cartProduct = await db.cartProducts.findOne({
            where: { id: productCartId },
            include: [{
                model: db.carts,
                where: { userId }
            }]
        });

        if (!cartProduct) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }


        if (action === 'increase') {
            cartProduct.quantity += 1;
        } else if (action === 'decrease' && cartProduct.quantity > 1) {
            cartProduct.quantity -= 1;
        } else if (action === 'delete') {
            await cartProduct.destroy();
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action' });
        }


        await cartProduct.save();


        const cart = await db.carts.findOne({ where: { userId } });
        const cartProducts = await db.cartProducts.findAll({
            where: { cartId: cart.id },
            include: [{
                model: db.products,
                attributes: ['realPrice']
            }]
        });

        let totalPrice = 0;
        cartProducts.forEach(item => {
            totalPrice += item.quantity * item.product.realPrice;
        });

        await cart.update({ totalPrice });


        const updatedCart = await fetchCartProducts(userId);
        return updatedCart;

    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the cart' });
    }
}

module.exports = { addProduct, fetchCartProducts, updateCartProduct };
