"use strict";

var _classCallCheck = require("../node_modules/babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("../node_modules/babel-runtime/helpers/inherits")["default"];

var _createClass = require("../node_modules/babel-runtime/helpers/create-class")["default"];

var _interopRequire = require("../node_modules/babel-runtime/helpers/interop-require")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var BaseCursor = _interopRequire(require("cursor"));

var calculatePadding = require("./util").calculatePadding;

var Cursor = exports.Cursor = (function (_BaseCursor) {
  function Cursor() {
    _classCallCheck(this, Cursor);

    if (_BaseCursor != null) {
      _BaseCursor.apply(this, arguments);
    }
  }

  _inherits(Cursor, _BaseCursor);

  _createClass(Cursor, {
    writeBufferPadded: {
      value: function writeBufferPadded(buffer) {
        var padding = calculatePadding(buffer.length);
        var paddingBuffer = new Buffer(padding);
        paddingBuffer.fill(0);

        return this.copyFrom(new Cursor(buffer)).copyFrom(new Cursor(paddingBuffer));
      }
    }
  });

  return Cursor;
})(BaseCursor);