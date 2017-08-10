'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Option = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bool = require('./bool');

var _lodash = require('lodash');

var _ioMixin = require('./io-mixin');

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Option = exports.Option = function () {
  function Option(childType) {
    _classCallCheck(this, Option);

    this._childType = childType;
  }

  _createClass(Option, [{
    key: 'read',
    value: function read(io) {
      if (_bool.Bool.read(io)) {
        return this._childType.read(io);
      }
    }
  }, {
    key: 'write',
    value: function write(value, io) {
      var isPresent = !((0, _lodash.isNull)(value) || (0, _lodash.isUndefined)(value));

      _bool.Bool.write(isPresent, io);

      if (isPresent) {
        this._childType.write(value, io);
      }
    }
  }, {
    key: 'isValid',
    value: function isValid(value) {
      if ((0, _lodash.isNull)(value)) {
        return true;
      }
      if ((0, _lodash.isUndefined)(value)) {
        return true;
      }

      return this._childType.isValid(value);
    }
  }]);

  return Option;
}();

(0, _ioMixin2.default)(Option.prototype);