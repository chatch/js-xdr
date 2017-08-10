"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = includeIoMixin;

var _cursor = require("./cursor");

var _lodash = require("lodash");

//TODO: build a system to grow a buffer as we write to it
var BUFFER_SIZE = Math.pow(2, 16);

var staticMethods = {
  toXDR: function toXDR(val) {
    var cursor = new _cursor.Cursor(BUFFER_SIZE);
    this.write(val, cursor);
    var bytesWritten = cursor.tell();
    cursor.rewind();

    return cursor.slice(bytesWritten).buffer();
  },
  fromXDR: function fromXDR(input) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "raw";

    var buffer = void 0;
    switch (format) {
      case "raw":
        buffer = input;break;
      case "hex":
        buffer = new Buffer(input, "hex");break;
      case "base64":
        buffer = new Buffer(input, "base64");break;
      default:
        throw new Error("Invalid format " + format + ", must be \"raw\", \"hex\", \"base64\"");
    }

    var cursor = new _cursor.Cursor(buffer);
    var result = this.read(cursor);

    //TODO: error out if the entire buffer isn't consumed

    return result;
  }
};

var instanceMethods = {
  toXDR: function toXDR() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "raw";

    var buffer = this.constructor.toXDR(this);
    switch (format) {
      case "raw":
        return buffer;
      case "hex":
        return buffer.toString('hex');
      case "base64":
        return buffer.toString('base64');
      default:
        throw new Error("Invalid format " + format + ", must be \"raw\", \"hex\", \"base64\"");
    }
  }
};

function includeIoMixin(obj) {
  (0, _lodash.extend)(obj, staticMethods);

  if ((0, _lodash.isFunction)(obj)) {
    (0, _lodash.extend)(obj.prototype, instanceMethods);
  }
}