const { fetchProductById, fetchProductsByField, createReview } = require('./products_model');
const { renderProductPage } = require('./products-view');
const db = require('../../library/models');

async function getProduct(req, res, next) {
  try {
    const productId = +req.query.id;
    //const page = req.query.page || 1;
    const reviewLimit = 4;
    const product = await fetchProductById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    const relatedProducts = await fetchProductsByField({
      productId: productId,
      limit: 4,

    });
    const pageCount = Math.ceil(await db.products.count() / reviewLimit);

    renderProductPage(res, product, relatedProducts, pageCount);
  } catch (error) {
    next(error);
  }
}
const addReview = async (req, res) => {
  const { message, productId } = req.body;
  try {
    if (!message || !productId) {
      return res.status(400).json({ message: 'Review is required' });
    }

    createReview(req, res, { message, productId })

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
async function pagingReviews(req, res, next) {
  const { reviewPage, id } = req.query;
  const page = reviewPage || 1;


  limit = 4;
  try {

    const reviews = await db.reviews.findAll(
      {
        where: { productId: id },
        include: [
          {
            model: db.users,
            attributes: ['fullName'],
            where: { id: db.Sequelize.col('reviews.userId') },
            required: false
          }
        ],
        order: [['id', 'DESC']]

      });
   
    const LReview = reviews.slice((page - 1) * limit, page * limit)
  
    res.json({ reviews: LReview, pageCount: page, totalPage: Math.ceil(reviews.length / limit) });

  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
}

async function addToCart(req, res, next) {
  try {
    console.log(req.body)
    // cái này là api lấy json ra
    // json này chứa bao gồm id và quantity
    // dùng nó để gắn vào thông tin vào database ở bảng cart hay j đó để hiển thị ở trang cart
  } catch (error) {
    next(error);
  }
}

module.exports = { getProduct, addReview, pagingReviews, addToCart };