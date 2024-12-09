async function renderSearchPage(res, LProduct, categories, brands, sizes, pageCount) {
  res.render('catalog', {
    title: 'Search',
    products: LProduct,
    categories: categories,
    brands: brands,
    sizes: sizes,
    pageCount: pageCount,
  });
}
module.exports = { renderSearchPage };