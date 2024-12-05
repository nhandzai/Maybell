const { fetchAllProducts, fetchProducts, fetchFilterProducts,fetchAllCategories, fetchAllBrands, fetchAllSizes } = require('./search-model')
const { renderSearchPage } = require('./search-view');
async function getSearch(req, res, next) {
  try {
    if (!req.query.q) {
      return res.redirect('/catalog');
    }
    const categories = await fetchAllCategories();
    const brands = await fetchAllBrands();
    const sizes = await fetchAllSizes();
    const query = req.query.q;
    let products = await fetchProducts(query);
    if (req.query.qfCategory || req.query.minPrice || req.query.maxPrice || req.query.qfBrand || req.query.qfSize) {
      products = await getFilterProducts(req, res,products);
    }
    renderSearchPage(res, products, categories, brands, sizes);
  } catch (error) {
    next(error);
  }
}
async function getFilterProducts(req, res) {
  try {
    const queryParams = req.query;

    const products = await fetchFilterProducts(queryParams);

    return products;
  } catch (error) {
    throw error;
  }
}
async function getFilterProducts(req, res, allProducts) {
  try {
    const queryParams = req.query;

    const filteredProducts = await fetchFilterProducts(queryParams);
    
    const filteredAndSearchedProducts = allProducts.filter(product =>
      filteredProducts.some(filteredProduct => filteredProduct.id === product.id)
    );

    return filteredAndSearchedProducts;
  } catch (error) {
    throw error;
  }
}
module.exports = { getSearch, getFilterProducts };