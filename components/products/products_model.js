
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
        where: { id:  db.Sequelize.col('products.brandId') },
        required: false
      },
      {
        model: db.reviews,
        attributes: [ 'userId','comment', 'updatedAt'],
        where: { productId: productId },
        required: false ,
        include: [
          {
            model: db.users,
            attributes: ['fullName'],
            where: { id: db.Sequelize.col('reviews.userId')},
            required: false
          }
        ]
      }
    
    ]
  });
 
  return product;
}



async function fetchProductsByField({ productId, limit }) {
  return await searchProductsByField({ productId, limit });
}
async function createReview ( req,res,{ message, productId })
{
  const review = await db.reviews.create({
    comment: message,
    productId: productId,
    userId: req.user.id,
});
}

module.exports = { fetchProductById, fetchProductsByField, createReview };
