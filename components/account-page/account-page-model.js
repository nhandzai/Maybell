const db = require('../../library/models');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { uploadFile, deleteFile } = require('../cloudinary/cloudinary.js');
const fs = require('fs/promises');
async function fetchUserById(id) {
  return await db.users.findByPk(id)
}
async function updateUserInfo(userId, fullName, sex, phone, bio, avatar) {
  const user = await db.users.findByPk(userId);
  const oldAvatar = user.avatar;

  const updateFields = {};

  if (fullName) updateFields.fullName = fullName;
  if (sex) updateFields.sex = sex;
  if (phone) updateFields.phone = phone;
  if (bio) updateFields.bio = bio;
  if (phone && !/^\d{10}$/.test(phone)) {
    throw new Error('Phone number is invalid.');
  }
  let newAvatar = oldAvatar;
  if (avatar) {

    try {
      const result = await uploadFile(avatar.path, 'avatars');
      newAvatar = result.secure_url;
      console.log(newAvatar);

      await db.users.update({ avatar: newAvatar }, { where: { id: userId } });

      if (oldAvatar) {
        const publicId = oldAvatar.split('/').pop().split('.')[0];
        await deleteFile(publicId);
      }

      await fs.unlink(avatar.path);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('An error occurred while uploading avatar.');
    }
  }

  try {
    await db.users.update(updateFields, { where: { id: userId } });
  } catch (error) {
    console.error('Error updating user info:', error);
    throw new Error('An error occurred while updating user information.');
  }

  return { message: 'User information and avatar updated successfully!' };
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
async function comparePassword(password, userID) {
  const user = await db.users.findByPk(userID);
  return await bcrypt.compare(password, user.password);
}
async function fetchOrderByUser(userId) {
  const order = await db.orders.findAll({ where: { userId } });
  console.log('order', order);
  return order;


}
async function fetchDetailOrder(orderId, userId) {
  const order = await db.orders.findOne({
    where: { 
      id: orderId, 
      userId: userId  
    },
    include: [
      {
        model: db.orderProducts,
        as: 'orderProducts',
        include: [
          {
            model: db.products,
            as: 'product',
            attributes: ['id', 'name', 'realPrice'],
            include: [
              {
                model: db.productImages,
                attributes: ['image'],
              },
            ],
          },
          
        ],
      },
      {
        model: db.paymentMethods,
        attributes: ['methodName'],
      },
    ],
   
  });

  console.log('order', order);
  return order;
}


module.exports = { fetchUserById, updateUserAddress, updateUserInfo, updateUserPassword, comparePassword, fetchOrderByUser, fetchDetailOrder };
