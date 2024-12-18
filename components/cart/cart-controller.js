const { renderCartPage } = require("./cart-view")
const { addProduct, fetchCartProducts, updateCartProduct } = require("./cart-model")
const db = require('../../library/models'); 
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

        res.json("Product added to cart successfullyyy!");
    } catch (error) {
        res.json("An error occurred while adding the product to the cart.");
    }
}
async function updateCart(req, res) {
    const { action, productCartId } = req.body;
        const userId = req.user.id;

        updateCartProduct(action, productCartId, userId, res);
        const updatedCart = await updateCartProduct(action, productCartId, userId, res);
        res.json({ success: true, cart: updatedCart });
    
}

module.exports = {
    getCartPage, addToCart,updateCart
};