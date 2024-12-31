const { renderCartPage } = require("./cart-view")
const { addProduct, fetchCartProducts, updateCartProduct } = require("./cart-model")
const getCartPage = async (req, res) => {
    const userId = req.user.id;
    const products = await fetchCartProducts(userId);
    console.log("products",products);
    renderCartPage(req, res, products);
};

async function addToCart(req, res) {
    try {
        const { quantity, id } = req.body;
        const quantityValue = parseInt(quantity) || 1;
        const userId = req.user.id;
        const productId = id;
        console.log("productId",productId);

        addProduct(productId, quantityValue, userId);

        res.json({ message: "Product added to cart successfully!" });
    } catch (error) {
        res.json({ message: "An error occurred while adding the product to the cart." });
    }
}
async function updateCart(req, res) {
    const { action, productCartId } = req.body;
    const userId = req.user.id;

    try {
      
        const result = await updateCartProduct(action, productCartId, userId);

      
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }

      
        return res.json({
            success: true,
            cart: {
                cartItems: result.cartItems,
                totalCartPrice: result.totalCartPrice
            }
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the cart' });
    }
}

module.exports = {
    getCartPage, addToCart,updateCart
};