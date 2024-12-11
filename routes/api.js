
const express = require('express');
const router = express.Router();
const userController = require('../components/users/users-controller');
const catalogController = require('../components/catalog/catalog-controller')
const productController = require('../components/products/products-controller')

const { isAuthenticated } = require('../components/middleware/middleware');

router.post('/register', userController.createUser);
router.post('/login', userController.authenticateUser);
router.get('/products',catalogController.filterProduct);
router.post('/review',isAuthenticated,productController.addReview)


module.exports = router;

