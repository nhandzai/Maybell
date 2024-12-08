async function renderSearchPage(res, products, categories, brands, sizes, pageCount) {
    res.render('catalog', {
      title: 'Search',
      products: products,
      categories: categories,
      brands: brands,
      sizes: sizes,
      pageCount: pageCount,
    });
  }
  module.exports = { renderSearchPage };