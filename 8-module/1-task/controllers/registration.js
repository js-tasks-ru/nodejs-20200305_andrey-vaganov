const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {
    email,
    displayName,
    password,
  } = ctx.request.body;

  let user = await User.findOne({email});

  if (user) {
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };

    ctx.status = 400;
    return;
  }

  const verificationToken = uuid();
  user = await User.create({email, displayName, verificationToken});
  await user.setPassword(password);

  await User.update({_id: user._id}, {
    passwordHash: user.passwordHash,
    salt: user.salt,
  });

  await sendMail({
    template: 'confirmation',
    to: email,
    locals: {token: verificationToken},
    subject: 'Подтвердите почту',
  });

  ctx.body = {
    status: 'ok',
  };

  ctx.status = 200;
};

module.exports.confirm = async (ctx, next) => {
  const {
    verificationToken,
  } = ctx.request.body;

  const user = await User.findOne({verificationToken});

  if (!user) {
    ctx.body = {
      error: 'Ссылка подтверждения недействительна или устарела',
    };

    ctx.status = 404;
    return;
  }

  user.verificationToken = undefined;
  await user.save();

  ctx.body = {token: verificationToken};
  ctx.status = 200;
};
