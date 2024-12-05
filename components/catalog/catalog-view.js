async function renderCatalogPage(res, products, categories, brands, sizes) {
  res.render('catalog', {
    title: 'Catalog',
    products: products,
    categories: categories,
    brands: brands,
    sizes: sizes,
  });
}
module.exports = { renderCatalogPage };