const db = require('../../library/models');
const { searchProducts, searchFilterProducts } = require('../../library/search');

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

async function fetchFilterProducts(queryParams) {
  const products = await searchFilterProducts(queryParams);
  return products;
}

module.exports = { fetchAllProducts, fetchProducts, fetchFilterProducts ,fetchAllCategories, fetchAllBrands, fetchAllSizes};