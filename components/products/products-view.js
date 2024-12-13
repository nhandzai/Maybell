
async function renderProductPage(res, product,relatedProducts,pageCount) {
  console.log('Similar Products:', relatedProducts);
  res.render('product', {
    title: 'Product Details',
    product: product,
    relatedProducts: relatedProducts,
    pageCount:pageCount
 
  });
}

module.exports = { renderProductPage };
