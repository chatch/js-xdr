"use strict";

var _classCallCheck = require("../node_modules/babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("../node_modules/babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("../node_modules/babel-runtime/helpers/interop-require")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Int = require("./int").Int;

var UnsignedInt = require("./unsigned-int").UnsignedInt;

var calculatePadding = require("./util").calculatePadding;

var isString = require("lodash").isString;

var includeIoMixin = _interopRequire(require("./io-mixin"));

var String = exports.String = (function () {
  function String() {
    var maxLength = arguments[0] === undefined ? UnsignedInt.MAX_VALUE : arguments[0];

    _classCallCheck(this, String);

    this._maxLength = maxLength;
  }

  _createClass(String, {
    read: {
      value: function read(io) {
        var length = Int.read(io);

        if (length > this._maxLength) {
          throw new Error("XDR Read Error: Saw " + length + " length String," + ("max allowed is " + this._maxLength));
        }
        var padding = calculatePadding(length);
        var result = io.slice(length);
        io.slice(padding); //consume padding
        return result.buffer().toString("utf8");
      }
    },
    write: {
      value: function write(value, io) {
        if (value.length > this._maxLength) {
          throw new Error("XDR Write Error: Got " + value.length + " bytes," + ("max allows is " + this._maxLength));
        }

        if (!isString(value)) {
          throw new Error("XDR Write Error: " + value + " is not a string,");
        }
        var buffer = new Buffer(value, "utf8");

        Int.write(buffer.length, io);
        io.writeBufferPadded(buffer);
      }
    },
    isValid: {
      value: function isValid(value) {
        if (!isString(value)) {
          return false;
        }
        var buffer = new Buffer(value, "utf8");
        return buffer.length <= this._maxLength;
      }
    }
  });

  return String;
})();

includeIoMixin(String.prototype);