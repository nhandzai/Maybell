const { fetchAllProducts, fetchProducts,fetchAllCategories, fetchAllBrands, fetchAllSizes } = require('./search-model')
const { renderSearchPage } = require('./search-view');
const db = require('../../library/models');
async function getSearch(req, res, next) {
 
  try {
    if (!req.query.q) {
      return res.redirect('/catalog');
    }
    const page = req.query.page || 1;
    const limit = 4;

    const queryParams = req.query;
   
    const categories = await fetchAllCategories();
    const brands = await fetchAllBrands();
    const sizes = await fetchAllSizes();
    const products = await fetchProducts(queryParams);
    const LProduct = products.slice((page - 1) * limit, page * limit);
    const totalPage =Math.ceil(products.length / limit); 
 
    renderSearchPage(res, categories, brands, sizes, LProduct,page,totalPage);
  } catch (error) {
    next(error);
  }
}



module.exports = { getSearch };
