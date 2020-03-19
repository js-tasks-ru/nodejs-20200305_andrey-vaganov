const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.currentSize = 0;
    this.limit = options.limit;
  }

  _transform(chunk, _, callback) {
    this.currentSize = this.currentSize + chunk.length;

    if (this.currentSize > this.limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
