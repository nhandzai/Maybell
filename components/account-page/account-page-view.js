async function renderAccountPage(req, res,User) {
  res.render('account-page', {
    title: 'Account Page',
    user_db: User
  });
};

async function renderProfileInformation(req, res,User) {
  res.render('profile-information', {
    title: 'Profile Information',
    user_db: User
  });
};

async function renderManageAddress(req, res,User) {
  res.render('manage-address', {
    title: 'Manage Address',
    user_db: User
  });
};

async function renderChangePassword(req, res,User) {
  res.render('change-password', {
    title: 'Change Password',
    user_db: User
  });
};

async function renderMyOrderHistory(req, res,Order ,User) {
  res.render('my-order-history', {
    title: 'My order history',
    orders: Order,
    user_db: User
  });
};

async function renderOrderOverview(req, res,Order,User) {
  res.render('order-overview', {
    title: 'Order overview',
    orders: Order,
    user_db: User
  });
};

module.exports = {
  renderAccountPage, renderProfileInformation, renderManageAddress, renderChangePassword, renderMyOrderHistory, renderOrderOverview
};
