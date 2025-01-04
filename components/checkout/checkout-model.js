const db = require('../../library/models');
async function fetchUserById(id) {
    return await db.users.findByPk(id)
}
async function fetchPaymentMethod() {
    return await db.paymentMethods.findAll();
}
async function fetchCheckoutProducts(userId) {
    try {

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




    } catch (error) {
        console.error('Error fetching cart products:', error);
        throw error;
    }
}
async function handleCheckout(userId, paymentMethodId, address, country, city) {
    const cartItems = await fetchCheckoutProducts(userId);

    if (cartItems.cartItems.length === 0) {
        return { success: false, message: 'Cart is empty' };
    }

    for (const item of cartItems.cartItems) {
        const product = await db.products.findByPk(item.product.id);
        if (!product) {
            return { success: false, message: `Product ID ${item.product.id} not found` };
        }

        if (product.stockQuantity < item.quantity) {
            return {
                success: false,
                message: `Product "${item.product.name}" is out of stock or does not have enough quantity`,
            };
        }
    }

    const order = await db.orders.create({
        userId,
        paymentMethodId,
        address,
        country,
        city,
        total: cartItems.totalCartPrice,
        status: 'inProcess',
    });

    for (const item of cartItems.cartItems) {
        await db.orderProducts.create({
            orderId: order.id,
            productId: item.product.id,
            quantity: item.quantity,
        });

        await db.products.update(
            { stockQuantity: db.sequelize.literal(`stockQuantity - ${item.quantity}`) },
            { where: { id: item.product.id } }
        );
    }

    return { success: true, orderId: order.id, totalCartPrice: cartItems.totalCartPrice };
}




module.exports = {
    fetchCheckoutProducts,
    fetchUserById,
    fetchPaymentMethod,
    handleCheckout
};

