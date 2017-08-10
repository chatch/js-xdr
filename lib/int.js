'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Int = undefined;

var _lodash = require('lodash');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Int = exports.Int = {
  read: function read(io) {
    return io.readInt32BE();
  },
  write: function write(value, io) {
    if (!(0, _lodash.isNumber)(value)) {
      throw new Error("XDR Write Error: not a number");
    }

    if (Math.floor(value) !== value) {
      throw new Error("XDR Write Error: not an integer");
    }

    io.writeInt32BE(value);
  },
  isValid: function isValid(value) {
    if (!(0, _lodash.isNumber)(value)) {
      return false;
    }
    if (Math.floor(value) !== value) {
      return false;
    }

    return value >= Int.MIN_VALUE && value <= Int.MAX_VALUE;
  }
};

Int.MAX_VALUE = Math.pow(2, 31) - 1;
Int.MIN_VALUE = -Math.pow(2, 31);

(0, _ioMixin2.default)(Int);