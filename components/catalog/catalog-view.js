async function renderCatalogPage(res,  categories, brands, sizes) {
  res.render('catalog', {
    title: 'Catalog',
  
    categories: categories,
    brands: brands,
    sizes: sizes,
  

  });
}
module.exports = { renderCatalogPage };