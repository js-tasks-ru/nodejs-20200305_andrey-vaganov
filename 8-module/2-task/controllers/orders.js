const Order = require('../models/Order');
const Product = require('../models/Product');
const productMapper = require('../mappers/product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const user = ctx.user;
  const order = await Order.create({
    user: user._id,
    product,
    phone,
    address,
  });

  if (!order) {
    ctx.status = 404;
    return;
  }

  const productModel = await Product.findById(product);

  await sendMail({
    to: user.email,
    subject: 'Подтверждение заказа',
    locals: {
      id: productModel._id,
      product: {
        title: productModel.title,
      },
    },
    template: 'order-confirmation',
  });

  ctx.body = {
    order: order._id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;
  const orders = await Order.find({
    user: user._id,
  }).populate('product');

  const res = orders.map(({phone, address, id, product}) => ({
    id: id,
    phone: phone,
    address: address,
    product: productMapper(product),
    user: user._id,
  }));

  ctx.body = {
    orders: res,
  };
};
