const db = require('../../library/models');
const { searchProductsByField } = require('../../library/search');
async function fetchProductById(productId) {
  const product = await db.products.findByPk(productId, {
    include: [
      {
        model: db.productImages,
        attributes: ['image'],
        where: { isMain: true },
        required: false
      },
      {
        model: db.sizes,
        through: { attributes: [] }, 
        attributes: [ 'size'],  
      },
      {
        model: db.categories,
        attributes: ['category'],
        where: { id: db.Sequelize.col('products.categoryId')},
        required: false
      },
      {
        model: db.brands,
        attributes: ['brand'],
        where: { id:  db.Sequelize.col('products.categoryId') },
        required: false
      }
    ]
  });
  console.log(product)
  return product;
}



async function fetchProductsByField({ productId, limit }) {
  return await searchProductsByField({ productId, limit });
}


module.exports = { fetchProductById, fetchProductsByField };