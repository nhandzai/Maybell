async function renderHomePage(res, products, categories) {
  res.render('home', {
    title: 'Home',
    products: products,
    categories: categories,
  });
}

module.exports = { renderHomePage };
