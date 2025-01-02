const db = require('../../library/models');
const bcrypt = require('bcryptjs');
async function fetchUserById(id) {
  return await db.users.findByPk(id)
}
async function updateUserInfo(userId, fullName, sex, phone, bio) {
  const updateFields = {};
  if (fullName) updateFields.fullName = fullName;
  if (sex) updateFields.sex = sex;
  if (phone) updateFields.phone = phone;
  if (bio) updateFields.bio = bio;
  return await db.users.update(
    updateFields,
    { where: { id: userId } }
  );
}
async function updateUserAddress(userId, country, city) {
  const address = {};
  if (country) address.country = country;
  if (city) address.city = city;

  return await db.users.update(address, { where: { id: userId } });
}
async function updateUserPassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await db.users.update(
    { password: hashedPassword },
    { where: { id: userId } }
  );
}
async function comparePassword(password,userID) {
  const user = await db.users.findByPk(userID);
  return await bcrypt.compare(password, user.password);

  
}
module.exports = { fetchUserById, updateUserAddress, updateUserInfo, updateUserPassword, comparePassword };
