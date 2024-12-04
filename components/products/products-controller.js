const { fetchProductById, fetchProductsByField } = require('./products_model');
const { renderProductPage } = require('./products-view');

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
    console.log("aaa",relatedProducts)
    renderProductPage(res, product, relatedProducts);
  } catch (error) {
    next(error);
  }
}

module.exports = { getProduct };