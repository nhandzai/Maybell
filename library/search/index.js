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

async function searchFilterProducts(minPrice, maxPrice, queries) {

  const whereClause = {};
  const include = [];
  if (minPrice != null && maxPrice != null) {
    whereClause.realPrice = {
      [db.Sequelize.Op.between]: [minPrice, maxPrice],
    };
  } else if (minPrice != null) {
    whereClause.realPrice = {
      [db.Sequelize.Op.gte]: minPrice,
    };
  } else if (maxPrice != null) {
    whereClause.realPrice = {
      [db.Sequelize.Op.lte]: maxPrice,
    };
  }


  if (queries && queries.length > 0) {
    const categoryQueries = queries.filter(query =>
      ['bedroom', 'sofa', 'matrass', 'outdoor', 'kitchen', 'living room'].includes(query)
    );
    const brandQueries = queries.filter(query =>
      ['APEX', 'Cof', 'Puff B&G', 'Fornighte'].includes(query)
    );
    const sizeQueries = queries.filter(query =>
      ['XS', 'S', 'M', 'L', 'XL'].includes(query)
    );



    if (brandQueries.length > 0) {
      whereClause.brand = {
        [db.Sequelize.Op.in]: brandQueries,
      };
    }
    if (categoryQueries.length > 0) {
      include.push({
        model: db.categories,

        where: {
          category: {
            [db.Sequelize.Op.in]: categoryQueries,
          }
        },
        required: true,
      });
    }


    if (sizeQueries.length > 0) {
      include.push({
        model: db.productSizes,

        where: {
          size: {
            [db.Sequelize.Op.in]: sizeQueries,
          }
        },
        required: true,
      });
    }
  }
  include.push({
    model: db.productImages,


    where: { isMain: true },
    required: false,
  })

  const products = await db.products.findAll({
    where: whereClause,
    include: include,
  });

  return products;

}
async function searchProductsByField({ 
  productId,
  limit,
}) {
 

const productCategories = await db.categories.findAll({
  where: { productId },
  attributes: ['category'], 
});

const categoryIds = productCategories.map(item => item.category);


const queryOptions = {
  where: {
    id: {
      [db.Sequelize.Op.ne]: productId, 
    },
  },
  include: [
    {
      model: db.categories,
      where: {
        category: {
          [db.Sequelize.Op.in]: categoryIds, 
        },
      },
      required: true,
    },
    {
      model: db.productImages,
      attributes: ['image'],
      where: { isMain: true },
      required: false,
    },
  ],
  limit: limit || 10, 
};
  queryOptions.include.push({
    model: db.productImages,
    attributes: ['image'],
    where: { isMain: true },
    required: false,
  });

  const relatedProducts = await db.products.findAll(queryOptions);

  return relatedProducts;
}






module.exports = { searchProducts, searchFilterProducts, searchProductsByField };
