const db = require('../models');

async function searchProducts(query) {
  if (!query) {
    throw new Error('Search query is required.');
  }

  const products = await db.products.findAll({


    include: [
      {
        model: db.productImages,
        attributes: ['image'],
        where: { isMain: true, id: db.sequelize.col('productImages.productId') },
        required: false
      }
    ],
    where: {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${query}%` } },
        { shortDescription: { [db.Sequelize.Op.like]: `%${query}%` } }
      ]
    }
  });

  return products;
}

async function searchFilterProducts({ q, qfCategory, qfBrand, qfSize, minPrice, maxPrice, sortBy }) {

  const min = minPrice ? parseFloat(minPrice) : 0;
  const max = maxPrice ? parseFloat(maxPrice) : 99999;

  const sortOptions = {
    htl: ['realPrice', 'DESC'],
    lth: ['realPrice', 'ASC'],
    newest: ['createdAt', 'DESC'],
    oldest: ['createdAt', 'ASC'],
  };

  const sort = sortBy ? sortOptions[sortBy] || ['id', 'ASC'] : ['id', 'ASC'];
  const categoryIds = qfCategory ? (Array.isArray(qfCategory) ? qfCategory : qfCategory.split(',')) : [];
  const brandIds = qfBrand ? (Array.isArray(qfBrand) ? qfBrand : qfBrand.split(',')) : [];
  const sizeIds = qfSize ? (Array.isArray(qfSize) ? qfSize : qfSize.split(',')) : [];

  const whereClause = {};
  if (q) {
    whereClause[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.like]: `%${q}%` } },
      { shortDescription: { [db.Sequelize.Op.like]: `%${q}%` } }
    ];
  }

  if (categoryIds.length > 0) {
    whereClause.categoryId = {
      [db.Sequelize.Op.in]: categoryIds,
    };
  }

  if (brandIds.length > 0) {
    whereClause.brandId = {
      [db.Sequelize.Op.in]: brandIds,
    };
  }

  if (minPrice || maxPrice) {
    whereClause.realPrice = {
      [db.Sequelize.Op.between]: [parseFloat(min), parseFloat(max)],
    };
  }



  const products = await db.products.findAll({
    where: whereClause,

    include: [
      {
        model: db.categories,
        required: true,
      },
      {
        model: db.brands,
        required: true,
      },
      {
        model: db.sizes,
        where: sizeIds.length > 0 ? { id: { [db.Sequelize.Op.in]: sizeIds } } : {},
        through: {
          attributes: [],
        },
        required: sizeIds.length > 0,
      },
      {
        model: db.productImages,
        where: { isMain: true },
        required: false,
      },

    ],
    order: [sort],

  });
  return products;

}
async function searchProductsByField({ productId, limit }) {
  try {

    const product = await db.products.findOne({
      where: {
        id: productId,
        id: { [db.Sequelize.Op.ne]: productId },
      },
      attributes: ['categoryId'],
    });

    if (!product) {
      throw new Error('Product not found.');
    }

    const categoryId = product.categoryId;


    const similarProducts = await db.products.findAll({
      where: { categoryId },
      limit: limit || 10,
      include: [
        {
          model: db.productImages,
          attributes: ['image'],
          where: { isMain: true },
          required: false,
        },
      ],
    });
    
    return similarProducts;
  } catch (error) {
    console.error('Error finding similar products:', error);
    throw error;
  }
}

module.exports = { searchProducts, searchFilterProducts, searchProductsByField };
