const db = require('../../library/models');

async function fetchUserById(id) {
  return await db.users.findByPk(id)
}

module.exports = { fetchUserById};
