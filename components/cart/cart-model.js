const db = require('../../library/models');
async function addProduct(productId, quantity, userId) {

    db.carts.findOrCreate({
        where: {
            userId,
            productId
        },
        defaults: {
            quantity
        }
    }).then(([cart, created]) => {
        if (!created) {
            cart.update({
                quantity: cart.quantity + quantity
            })
        }
    })
};
async function fetchCartProducts(userId) {
    const products=  await db.carts.findAll({
        where: {
            userId
        },
        attributes: ['quantity'],
        include: [{
            model: db.products,
            attributes: ['id', 'name', 'realPrice','price','promotion' ],
            include: [{
                model: db.productImages,
                attributes: ['image']
            }]
        }]
    })

    return products;
}
module.exports = { addProduct , fetchCartProducts};