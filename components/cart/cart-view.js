async function renderCartPage(req, res,products) {
    res.render('cart', {
        title: 'Cart',
        products: products,

    });
}
module.exports = { renderCartPage };