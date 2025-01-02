async function renderAccountPage(req, res,User) {
  res.render('account-page', {
    title: 'Account Page',
    user_db: User
  });
};

async function renderProfileInformation(req, res) {
  res.render('profile-information', {
    title: 'Profile Information',
  });
};

async function renderManageAddress(req, res) {
  res.render('manage-address', {
    title: 'Manage Address',
  });
};

async function renderChangePassword(req, res) {
  res.render('change-password', {
    title: 'Change Password',
  });
};

async function renderMyOrderHistory(req, res) {
  res.render('my-order-history', {
    title: 'My order history',
  });
};

async function renderOrderOverview(req, res) {
  res.render('order-overview', {
    title: 'Order overview',
  });
};

module.exports = {
  renderAccountPage, renderProfileInformation, renderManageAddress, renderChangePassword, renderMyOrderHistory, renderOrderOverview
};
