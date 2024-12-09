const { fetchAllProducts, fetchProducts, fetchFilterProducts,fetchAllCategories, fetchAllBrands, fetchAllSizes } = require('./search-model')
const { renderSearchPage } = require('./search-view');
const db = require('../../library/models');
async function getSearch(req, res, next) {
 
  try {
    if (!req.query.q) {
      return res.redirect('/catalog');
    }
    const limit = 4;
    const page = req.query.page || 1;
    const categories = await fetchAllCategories();
    const brands = await fetchAllBrands();
    const sizes = await fetchAllSizes();
    const query = req.query.q;
    const pageCount = Math.ceil(await db.products.count() / limit);
    let products = await fetchProducts(query,limit,page);
    
    renderSearchPage(res, products, categories, brands, sizes, pageCount);
  } catch (error) {
    next(error);
  }
}


async function getFilterProducts(req, res, allProducts) {
  try {
    const page= req.query.page || 1;
    const limit = 4;
    const queryParams = req.query;

    const filteredProducts = await fetchFilterProducts(queryParams);
    
    const filteredAndSearchedProducts = allProducts.filter(product =>
      filteredProducts.some(filteredProduct => filteredProduct.id === product.id)
    );
    const LProduct = filteredAndSearchedProducts.slice((page - 1) * limit, page * limit);

    res.json({ products: LProduct, pageCount: page, totalPage: Math.ceil(filteredAndSearchedProducts.length / limit) });
  } catch (error) {
    throw error;
  }
}
module.exports = { getSearch, getFilterProducts };
