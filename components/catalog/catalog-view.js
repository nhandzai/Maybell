const products = require("../../library/models/products");

async function renderCatalogPage(res, categories, brands, sizes, LProduct,page,totalPage) {
  res.render('catalog', {
    title: 'Catalog',
  
    categories: categories,
    brands: brands,
    sizes: sizes,
    products: LProduct,
    pageCount: page,
    totalPage: totalPage,
  

  });
}
module.exports = { renderCatalogPage };