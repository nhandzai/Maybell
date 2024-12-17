const { renderCartPage } = require("./cart-view")
const { addProduct, fetchCartProducts } = require("./cart-model")
const getCartPage = async (req, res) => {
    const userId = req.user.id;
    const products = await fetchCartProducts(userId);

    renderCartPage(req, res, products);
};

async function addToCart(req, res) {
    try {
        const { quantity, id } = req.body;
        const quantityValue = parseInt(quantity) || 1;
        const userId = req.user.id;
        const productId = id;

        addProduct(productId, quantityValue, userId);

        res.json({ message: "Product added to cart successfully!" });
    } catch (error) {

        res.json({ message: "An error occurred while adding the product to the cart." });
    }
}

module.exports = {
    getCartPage, addToCart
};