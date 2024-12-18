const { fetchAllProducts, fetchProducts, fetchFilterProducts,fetchAllCategories, fetchAllBrands, fetchAllSizes } = require('./search-model')
const { renderSearchPage } = require('./search-view');
const db = require('../../library/models');
async function getSearch(req, res, next) {
 
  try {
    if (!req.query.q) {
      return res.redirect('/catalog');
    }
   
    const categories = await fetchAllCategories();
    const brands = await fetchAllBrands();
    const sizes = await fetchAllSizes();
 
    
    renderSearchPage(res, categories, brands, sizes);
  } catch (error) {
    next(error);
  }
}



module.exports = { getSearch };
