const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const {token} = socket.handshake.query;

    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
      return;
    }

    const session = await Session.findOne({token});

    if (!session) {
      next(new Error('wrong or expired session token'));
      return;
    }

    const {user} = await session.populate('user').execPopulate();

    socket.user = user;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      Message.create({
        date: new Date(),
        text: msg,
        chat: socket.user._id,
        user: socket.user.displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
