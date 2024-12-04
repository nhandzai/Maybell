async function renderProductPage(res, product,relatedProducts) {
  res.render('product', {
    title: 'Product Details',
    product: product,
    relatedProducts: relatedProducts,
 
  });
}

module.exports = { renderProductPage };