"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.String = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _int = require("./int");

var _unsignedInt = require("./unsigned-int");

var _util = require("./util");

var _isString = require("lodash/isString");

var _isString2 = _interopRequireDefault(_isString);

var _ioMixin = require("./io-mixin");

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var String = exports.String = function () {
  function String() {
    var maxLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _unsignedInt.UnsignedInt.MAX_VALUE;

    _classCallCheck(this, String);

    this._maxLength = maxLength;
  }

  _createClass(String, [{
    key: "read",
    value: function read(io) {
      var length = _int.Int.read(io);

      if (length > this._maxLength) {
        throw new Error("XDR Read Error: Saw " + length + " length String," + ("max allowed is " + this._maxLength));
      }
      var padding = (0, _util.calculatePadding)(length);
      var result = io.slice(length);
      io.slice(padding); //consume padding
      return result.buffer().toString('utf8');
    }
  }, {
    key: "write",
    value: function write(value, io) {
      if (value.length > this._maxLength) {
        throw new Error("XDR Write Error: Got " + value.length + " bytes," + ("max allows is " + this._maxLength));
      }

      if (!(0, _isString2.default)(value)) {
        throw new Error("XDR Write Error: " + value + " is not a string,");
      }
      var buffer = new Buffer(value, 'utf8');

      _int.Int.write(buffer.length, io);
      io.writeBufferPadded(buffer);
    }
  }, {
    key: "isValid",
    value: function isValid(value) {
      if (!(0, _isString2.default)(value)) {
        return false;
      }
      var buffer = new Buffer(value, 'utf8');
      return buffer.length <= this._maxLength;
    }
  }]);

  return String;
}();

(0, _ioMixin2.default)(String.prototype);