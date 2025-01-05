async function renderCheckoutPage(req, res,products, user, paymentMethods) {
    res.render('checkout', {
        title: 'Check Out',
        products: products,
        user_db: user,
        paymentMethods: paymentMethods

    });
}
module.exports = { renderCheckoutPage };