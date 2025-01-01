const express = require('express');
const router = express.Router();
const passport = require('passport');

// Controllers
const homeController = require('../components/home/home-controller');
const catalogController = require('../components/catalog/catalog-controller');
const productsController = require('../components/products/products-controller');
const aboutUsController = require('../components/about-us/about-us-controller');
const contactUsController = require('../components/contact-us/contact-us-controller');
const userController = require('../components/users/users-controller');
const searchController = require('../components/search/search-controller');
const accountPageController = require('../components/account-page/account-page-controller')
const cartController = require('../components/cart/cart-controller')

//middleware
const { isAuthenticated } = require('../components/middleware/middleware');

router.get('/', homeController.getHome);

router.get('/home', homeController.getHome);

router.get('/catalog', catalogController.getCatalog);

router.get('/product', productsController.getProduct);

router.get('/about-us', aboutUsController.getAboutUs);

router.get('/contact-us', contactUsController.getContactUs);

router.get('/sign-up', userController.getSignUp);

router.get('/log-in', userController.getLogin);

router.get('/search', searchController.getSearch);

router.get('/log-out', userController.getLogout);

router.get('/account-page', isAuthenticated, accountPageController.getAccountPage);

router.get('/profile-information', isAuthenticated, accountPageController.getProfileInformation);

router.get('/manage-address', isAuthenticated, accountPageController.getManageAddress);

router.get('/change-password', isAuthenticated, accountPageController.getChangePassword);

router.get('/cart', isAuthenticated, cartController.getCartPage);



router.get('/google-login', passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account',
    state: 'login', 
}));

// Đăng ký với Google
router.get('/google-register', passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account',
    state: 'register',
}));

// Callback

router.get('/google/callback', userController.handleGoogleCallback);
router.get('/auth/verify-email', userController.verifyEmail);




module.exports = router;