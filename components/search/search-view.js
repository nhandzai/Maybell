async function renderSearchPage(res, products, categories, brands, sizes) {
    res.render('catalog', {
      title: 'Search',
      products: products,
      categories: categories,
      brands: brands,
      sizes: sizes,
    });
  }
  module.exports = { renderSearchPage };