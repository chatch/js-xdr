"use strict";

var _classCallCheck = require("../node_modules/babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("../node_modules/babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("../node_modules/babel-runtime/helpers/interop-require")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var calculatePadding = require("./util").calculatePadding;

var includeIoMixin = _interopRequire(require("./io-mixin"));

var Opaque = exports.Opaque = (function () {
  function Opaque(length) {
    _classCallCheck(this, Opaque);

    this._length = length;
    this._padding = calculatePadding(length);
  }

  _createClass(Opaque, {
    read: {
      value: function read(io) {
        var result = io.slice(this._length);
        io.slice(this._padding); //consume padding
        return result.buffer();
      }
    },
    write: {
      value: function write(value, io) {
        if (value.length !== this._length) {
          throw new Error("XDR Write Error: Got " + value.length + " bytes, expected " + this._length);
        }

        io.writeBufferPadded(value);
      }
    },
    isValid: {
      value: function isValid(value) {
        return Buffer.isBuffer(value) && value.length === this._length;
      }
    }
  });

  return Opaque;
})();

includeIoMixin(Opaque.prototype);