const { sortProductsByPrice, fetchLimitCategory } = require('./home-model');
const { renderHomePage } = require('./home-view');


async function getHome(req, res, next) {
  try {
   
    const products = await sortProductsByPrice(4);
    const categories = await fetchLimitCategory();
    renderHomePage(res, products, categories);
  } catch (error) {
    next(error);
  }
}

module.exports = { getHome };

