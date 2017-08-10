'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Double = undefined;

var _lodash = require('lodash');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Double = exports.Double = {
  read: function read(io) {
    return io.readDoubleBE();
  },
  write: function write(value, io) {
    if (!(0, _lodash.isNumber)(value)) {
      throw new Error("XDR Write Error: not a number");
    }

    io.writeDoubleBE(value);
  },
  isValid: function isValid(value) {
    return (0, _lodash.isNumber)(value);
  }
};

(0, _ioMixin2.default)(Double);