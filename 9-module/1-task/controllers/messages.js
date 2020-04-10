const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  if (!ctx.user) {
    ctx.status = 404;
    return;
  }

  const messages = await Message
      .find({chat: ctx.user._id})
      .sort('-date')
      .limit(20);

  const res = messages.map(({_id, date, text, user}) => ({
    date,
    id: _id,
    text,
    user,
  }));

  ctx.body = {messages: res};
};
