const getCheckoutPage = (req, res) => {
    res.render('checkout', { title: 'Checkout' })
};

module.exports = {
    getCheckoutPage
};