"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Union = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _void = require("./void");

var _config = require("./config");

var _ioMixin = require("./io-mixin");

var _ioMixin2 = _interopRequireDefault(_ioMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Union = exports.Union = function () {
  function Union(aSwitch, value) {
    _classCallCheck(this, Union);

    this.set(aSwitch, value);
  }

  _createClass(Union, [{
    key: "set",
    value: function set(aSwitch, value) {
      if ((0, _lodash.isString)(aSwitch)) {
        aSwitch = this.constructor._switchOn.fromName(aSwitch);
      }

      this._switch = aSwitch;
      this._arm = this.constructor.armForSwitch(this._switch);
      this._armType = this.constructor.armTypeForArm(this._arm);
      this._value = value;
    }
  }, {
    key: "get",
    value: function get() {
      var armName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._arm;

      if (this._arm !== _void.Void && this._arm !== armName) {
        throw new Error(armName + " not set");
      }
      return this._value;
    }
  }, {
    key: "switch",
    value: function _switch() {
      return this._switch;
    }
  }, {
    key: "arm",
    value: function arm() {
      return this._arm;
    }
  }, {
    key: "armType",
    value: function armType() {
      return this._armType;
    }
  }, {
    key: "value",
    value: function value() {
      return this._value;
    }
  }], [{
    key: "armForSwitch",
    value: function armForSwitch(aSwitch) {
      if (this._switches.has(aSwitch)) {
        return this._switches.get(aSwitch);
      } else if (this._defaultArm) {
        return this._defaultArm;
      } else {
        throw new Error("Bad union switch: " + aSwitch);
      }
    }
  }, {
    key: "armTypeForArm",
    value: function armTypeForArm(arm) {
      if (arm === _void.Void) {
        return _void.Void;
      } else {
        return this._arms[arm];
      }
    }
  }, {
    key: "read",
    value: function read(io) {
      var aSwitch = this._switchOn.read(io);
      var arm = this.armForSwitch(aSwitch);
      var armType = this.armTypeForArm(arm);
      var value = armType.read(io);
      return new this(aSwitch, value);
    }
  }, {
    key: "write",
    value: function write(value, io) {
      if (!(value instanceof this)) {
        throw new Error("XDR Write Error: " + value + " is not a " + this.unionName);
      }

      this._switchOn.write(value.switch(), io);
      value.armType().write(value.value(), io);
    }
  }, {
    key: "isValid",
    value: function isValid(value) {
      return value instanceof this;
    }
  }, {
    key: "create",
    value: function create(context, name, config) {
      var ChildUnion = function (_Union) {
        _inherits(ChildUnion, _Union);

        function ChildUnion() {
          var _ref;

          _classCallCheck(this, ChildUnion);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _possibleConstructorReturn(this, (_ref = ChildUnion.__proto__ || Object.getPrototypeOf(ChildUnion)).call.apply(_ref, [this].concat(args)));
        }

        return ChildUnion;
      }(Union);

      ChildUnion.unionName = name;
      context.results[name] = ChildUnion;

      if (config.switchOn instanceof _config.Reference) {
        ChildUnion._switchOn = config.switchOn.resolve(context);
      } else {
        ChildUnion._switchOn = config.switchOn;
      }

      ChildUnion._switches = new Map();
      ChildUnion._arms = {};

      (0, _lodash.each)(config.arms, function (value, name) {
        if (value instanceof _config.Reference) {
          value = value.resolve(context);
        }

        ChildUnion._arms[name] = value;
      });

      // resolve default arm
      var defaultArm = config.defaultArm;
      if (defaultArm instanceof _config.Reference) {
        defaultArm = defaultArm.resolve(context);
      }

      ChildUnion._defaultArm = defaultArm;

      (0, _lodash.each)(config.switches, function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            aSwitch = _ref3[0],
            armName = _ref3[1];

        if ((0, _lodash.isString)(aSwitch)) {
          aSwitch = ChildUnion._switchOn.fromName(aSwitch);
        }

        ChildUnion._switches.set(aSwitch, armName);
      });

      // add enum-based helpers
      // NOTE: we don't have good notation for "is a subclass of XDR.Enum",
      //  and so we use the following check (does _switchOn have a `values`
      //  attribute) to approximate the intent.
      if (!(0, _lodash.isUndefined)(ChildUnion._switchOn.values)) {
        (0, _lodash.each)(ChildUnion._switchOn.values(), function (aSwitch) {
          // Add enum-based constrocutors
          ChildUnion[aSwitch.name] = function (value) {
            return new ChildUnion(aSwitch, value);
          };

          // Add enum-based "set" helpers
          ChildUnion.prototype[aSwitch.name] = function (value) {
            return this.set(aSwitch, value);
          };
        });
      }

      // Add arm accessor helpers
      (0, _lodash.each)(ChildUnion._arms, function (type, name) {
        if (type === _void.Void) {
          return;
        }

        ChildUnion.prototype[name] = function () {
          return this.get(name);
        };
      });

      return ChildUnion;
    }
  }]);

  return Union;
}();

(0, _ioMixin2.default)(Union);