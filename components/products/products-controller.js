const { fetchProductById, fetchProductsByField, createReview } = require('./products_model');
const { renderProductPage } = require('./products-view');
const db = require('../../library/models');

async function getProduct(req, res, next) {
  try {
    const productId = +req.query.id;
    const product = await fetchProductById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    const relatedProducts = await fetchProductsByField({
      productId: productId,
      limit: 4,

    });

    renderProductPage(res, product, relatedProducts);
  } catch (error) {
    next(error);
  }
}
const addReview  = async (req, res) => {
  const { message, productId } = req.body;
  try {
      if (!message || !productId) {
          return res.status(400).json({ message: 'Review is required' });
      }
      
      createReview(req,res,{ message, productId })
  
      res.status(201).json({ message: 'Review added' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

module.exports = { getProduct, addReview };