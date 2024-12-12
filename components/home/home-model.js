const db = require('../../library/models');

async function fetchAllProducts() {
  return await db.products.findAll();
}
async function fetchLimitCategory(limit) {
  const brands = await db.categories.findAll({
    limit: limit || 6,
  });
  return brands;
}
async function sortProductsByPrice(limit) {
  const products = await db.products.findAll({
    order: [[db.sequelize.literal('(price - realPrice) / price'), 'DESC']],
    limit: limit || 8,
    include: [
      {
        model: db.productImages,
        attributes: ['image'],
        where: { isMain: true, id: db.sequelize.col('productImages.productId') }, 
        required: false 
      }
    ]
  });
  return products

}

module.exports = { fetchAllProducts, sortProductsByPrice, fetchLimitCategory };
