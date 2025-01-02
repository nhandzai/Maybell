async function renderSearchPage(res, categories, brands, sizes, LProduct,page,totalPage) {
  res.render('catalog', {
    title: 'Search',
    categories: categories,
    brands: brands,
    sizes: sizes,
    products: LProduct,
    pageCount: page,
    totalPage: totalPage,
 
  });
}
module.exports = { renderSearchPage };