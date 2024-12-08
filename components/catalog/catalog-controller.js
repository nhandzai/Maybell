const { fetchAllProducts, fetchFilterProducts, fetchAllCategories, fetchAllBrands, fetchAllSizes } = require('./catalog-model');
const { renderCatalogPage } = require('./catalog-view');
const db = require('../../library/models');
// Khi gọi lần đầu
async function getCatalog(req, res, next) {
  try {
   
    
    const categories = await fetchAllCategories();
    const brands = await fetchAllBrands();
    const sizes = await fetchAllSizes();
    const limit = 1;
    const page = req.query.page || 1;
    const products = await fetchAllProducts(limit,page);
    const pageCount = Math.ceil(await db.products.count() / limit);
    console.log("test",products)
    renderCatalogPage(res, products, categories, brands, sizes,pageCount);
  } catch (error) {
    next(error);
  }
}
// khi filter hay chuyển trang
async function filterProduct(req, res, next) {
 
  try {
    const page= req.query.page || 1;
    const limit = 1;

    const queryParams = req.query;

    const products = await fetchFilterProducts(queryParams);
  const LProduct = products.slice((page - 1) * limit, page * limit);
  res.json({ products: LProduct, pageCount: page, totalPage: Math.ceil(products.length / limit) });

  } catch (error) {
    console.error("Error:", error);
    next(error);
    console.log("error",error)
  }
}

/*async function getFilterProducts(req, res) {
  try {
    const queryParams = req.query;

    const products = await fetchFilterProducts(queryParams);

    return products;
  } catch (error) {
    throw error;
  }
}
  */


module.exports = { getCatalog,filterProduct};//,getFilterProducts };
