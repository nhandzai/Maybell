async function renderSearchPage(res, categories, brands, sizes) {
  res.render('catalog', {
    title: 'Search',
    categories: categories,
    brands: brands,
    sizes: sizes,
 
  });
}
module.exports = { renderSearchPage };