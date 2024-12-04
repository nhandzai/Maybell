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
        model: db.productSizes,
        attributes: ['size'],
        where: { productId: productId },
        required: false
      },
      {
        model: db.categories,
        attributes: ['category'],
        where: { productId: productId },
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