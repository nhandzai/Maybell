const { renderCheckoutPage } = require("./checkout-view");
const { fetchCheckoutProducts,fetchPaymentMethod, fetchUserById,handleCheckout } = require("./checkout-model");

const getCheckoutPage = async (req, res) => {
    const userId = req.user?.id;
    try {
        const user = await fetchUserById(userId);
        const paymentMethods = await fetchPaymentMethod();

        const products = await fetchCheckoutProducts(userId);

        console.log("products", products);

        renderCheckoutPage(req, res, products, user, paymentMethods);
    } catch (error) {
        console.error('Error fetching cart page:', error);
        res.status(500).json({ message: 'An error occurred while fetching the cart page.' });
    }
};
const checkout = async (req, res) => {
    const userId = req.user?.id;
    const { paymentMethod, address, country, city, phone } = req.body;

  
    if (!paymentMethod || !address || !country || !city || !phone) {
        return res.status(400).json({ 
            message: 'Payment method, address, country, city, and phone are required.' 
        });
    }

    try {
       
        const result = await handleCheckout(userId, paymentMethod, address, country, city, phone);
        res.status(200).json({ 
            message: 'Checkout successful.', 
            orderId: result.orderId, 
            totalCartPrice: result.totalCartPrice 
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'An error occurred during checkout.' });
    }
};


module.exports = {
    getCheckoutPage,checkout
};