'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Void = undefined;

var _lodash = require('lodash');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Void = exports.Void = {
  /* jshint unused: false */

  read: function read(io) {
    return undefined;
  },
  write: function write(value, io) {
    if (!(0, _lodash.isUndefined)(value)) {
      throw new Error("XDR Write Error: trying to write value to a void slot");
    }
  },
  isValid: function isValid(value) {
    return (0, _lodash.isUndefined)(value);
  }
};

(0, _ioMixin2.default)(Void);