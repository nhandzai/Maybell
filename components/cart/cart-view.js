async function renderCartPage(req, res) {
    res.render('cart', {
        title: 'Cart',
    });
}
module.exports = { renderCartPage };