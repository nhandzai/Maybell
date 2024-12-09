
const express = require('express');
const router = express.Router();
const userController = require('../components/users/users-controller');
const catalogController = require('../components/catalog/catalog-controller')

router.post('/register', userController.createUser);
router.post('/login', userController.authenticateUser);
router.get('/products',catalogController.filterProduct)


module.exports = router;

