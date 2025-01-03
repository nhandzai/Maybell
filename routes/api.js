
const express = require('express');
const router = express.Router();
const userController = require('../components/users/users-controller');
const accoutController = require('../components/account-page/account-page-controller')
const catalogController = require('../components/catalog/catalog-controller')
const productsController = require('../components/products/products-controller')
const cartController = require('../components/cart/cart-controller')

const { isAuthenticated } = require('../components/middleware/middleware');

router.post('/register', userController.createUser);
router.post('/login', userController.authenticateUser);
router.get('/products',catalogController.filterProduct);
router.post('/review',isAuthenticated,productsController.addReview);
router.get('/pagingReview',productsController.pagingReviews);
router.post('/add-to-cart',cartController.addToCart);
router.post('/update-cart',cartController.updateCart);
router.post('/change-password',accoutController.changePassword);
router.post('/update-profile',accoutController.updateInfo);
router.post('/update-address',accoutController.updateAddress);



module.exports = router;