const User = require('../../models/User');

module.exports = async (strategy, email, displayName, done) => {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  let user = await User.findOne({email});

  if (!user) {
    try {
      user = await User.create({email, displayName});
    } catch (error) {
      done(error, false, 'Некорректный email');
      return;
    }
  }

  done(null, user);
};
