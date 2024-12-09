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
   
    let products = await fetchProducts(query);
    const LProduct = products.slice((page - 1) * limit, page * limit);

    const pageCount = Math.ceil(products.length/ limit);
    
    renderSearchPage(res, LProduct, categories, brands, sizes, pageCount);
  } catch (error) {
    next(error);
  }
}



module.exports = { getSearch };
