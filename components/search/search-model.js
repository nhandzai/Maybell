const db = require('../../library/models');
const { searchProducts } = require('../../library/search');

async function fetchAllProducts() {
  return await db.products.findAll();
}
async function fetchAllCategories() {
  const categories = await db.categories.findAll();
  return categories;
}
async function fetchAllBrands() {
  const brands = await db.brands.findAll();
  return brands;
}
async function fetchAllSizes() {
  const sizes = await db.sizes.findAll();
  return sizes;
}
async function fetchProducts(query,limit,page) {
  if (!query) {
    throw new Error('Search query is required.');
  }
  const products = await searchProducts(query,limit,page); 
  return products;
}



module.exports = { fetchAllProducts, fetchProducts ,fetchAllCategories, fetchAllBrands, fetchAllSizes};