
const { addProduct, fetchCartProducts, updateCartProduct,mergeCart } = require("./cart-model");
const { renderCartPage } = require("./cart-view");

// Get Cart Page
const getCartPage = async (req, res) => {
    const userId = req.user?.id;

    const sessionKey = `cart:${req.sessionID}`;
    let products = [];

    try {

        products = await fetchCartProducts(userId, sessionKey);

        console.log("products", products);

        renderCartPage(req, res, products);
    } catch (error) {
        console.error('Error fetching cart page:', error);
        res.status(500).json({ message: 'An error occurred while fetching the cart page.' });
    }
};

// Add Product to Cart
async function addToCart(req, res) {
    try {
        const { quantity, id } = req.body;
        const quantityValue = parseInt(quantity) || 1;
        const productId = id;
        const sessionKey = `cart:${req.sessionID}`;
        const userId = req.user?.id;
        await addProduct(productId, quantityValue, userId, sessionKey);
        console.log("ss",sessionKey);
        return res.json({ message: "Product added to cart successfully!" });
        
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ message: "An error occurred while adding the product to the cart." });
    }
}

// Update Cart
async function updateCart(req, res) {
    const { action, productCartId } = req.body;
    const userId = req.user ? req.user.id : null;
    const sessionKey = `cart:${req.sessionID}`;

    try {
        let result;
            result = await updateCartProduct(action, productCartId, userId, sessionKey);
        

        return res.json({
            success: true,
            cart: {
                cartItems: result.cartItems,
                totalCartPrice: result.totalCartPrice || 0
            }
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the cart' });
    }
}



module.exports = {
    getCartPage,
    addToCart,
    updateCart


};
