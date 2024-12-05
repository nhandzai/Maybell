const { fetchAllProducts, fetchFilterProducts, fetchAllCategories, fetchAllBrands, fetchAllSizes } = require('./catalog-model');
const { renderCatalogPage } = require('./catalog-view');
const db = require('../../library/models');
async function getCatalog(req, res, next) {
  try {
   
    let products = await fetchAllProducts();
    const categories = await fetchAllCategories();
    const brands = await fetchAllBrands();
    const sizes = await fetchAllSizes();

   
    if (req.query.qfCategory || req.query.minPrice || req.query.maxPrice || req.query.qfBrand || req.query.qfSize) {
      products = await getFilterProducts(req, res);
    }

    renderCatalogPage(res, products, categories, brands, sizes);
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


module.exports = { getCatalog, getFilterProducts };
