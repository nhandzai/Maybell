async function renderCatalogPage(res, products, categories, brands, sizes,pageCount) {
  res.render('catalog', {
    title: 'Catalog',
    products: products,
    categories: categories,
    brands: brands,
    sizes: sizes,
    pageCount: pageCount

  });
}
module.exports = { renderCatalogPage };