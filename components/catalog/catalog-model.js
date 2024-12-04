const db = require('../../library/models');
const { searchProducts, searchFilterProducts } = require('../../library/search');

async function fetchAllProducts() {
  const products = await db.products.findAll({
    include: [
      {
        model: db.productImages,
        attributes: ['image'],
        where: { isMain: true, id: db.sequelize.col('productImages.productId') }, 
        required: false 
      }
    ]
  });
  return products;
}

async function fetchProducts(query) {
  if (!query) {
    throw new Error('Search query is required.');
  }
  const products = await searchProducts(query); 
  return products;
}

async function fetchFilterProducts(minPrice, maxPrice, queries) {

  const products = await searchFilterProducts(minPrice, maxPrice, queries);
  return products;
}

module.exports = { fetchAllProducts, fetchProducts, fetchFilterProducts };