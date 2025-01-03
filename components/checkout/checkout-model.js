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
async function handleCheckout(userId, paymentMethodId, address, country, city, phone) {
    try {
     
        const { cartItems, totalCartPrice } = await fetchCheckoutProducts(userId);

        if (cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

       
        const newOrder = await db.orders.create({
            userId,
            paymentMethodId,
            status: 'Pending',
            address,
            country,
            city,
            phone,
            total: totalCartPrice,
        });

        const orderProducts = cartItems.map(item => ({
            orderId: newOrder.id,
            productId: item.product.id,
            quantity: item.quantity,
        }));

    
        await db.orderProducts.bulkCreate(orderProducts);


        await db.carts.destroy({
            where: { userId },
        });

        return { orderId: newOrder.id, totalCartPrice };
    } catch (error) {
        console.error('Error during checkout:', error);
        throw error;
    }
}



module.exports = {
    fetchCheckoutProducts,
    fetchUserById,
    fetchPaymentMethod,
    handleCheckout
};

