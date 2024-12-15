const { renderCartPage } = require("./cart-view")
const getCartPage = (req, res) => {
    renderCartPage(req, res);
};
module.exports = {
    getCartPage,
};