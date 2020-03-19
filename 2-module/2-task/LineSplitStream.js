const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.buffer = '';
  }

  _transform(chunk, _, callback) {
    const separator = os.EOL;
    const chunkString = chunk.toString();

    for (const char of chunkString) {
      if (char === separator) {
        this.push(this.buffer);
        this.buffer = '';
      } else {
        this.buffer = this.buffer + char;
      }
    }

    callback(null);
  }

  _flush(callback) {
    callback(null, this.buffer);
  }
}

module.exports = LineSplitStream;
