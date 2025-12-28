import { AsyncLocalStorage } from "node:async_hooks";
import { Readable, PassThrough } from "node:stream";
import require$$1 from "stream";
import require$$0 from "util";
import { ReadableStream as ReadableStream$1 } from "node:stream/web";
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
var hasRequiredReact_production_min;
function requireReact_production_min() {
  if (hasRequiredReact_production_min) return react_production_min;
  hasRequiredReact_production_min = 1;
  var l = /* @__PURE__ */ Symbol.for("react.element"), n = /* @__PURE__ */ Symbol.for("react.portal"), p2 = /* @__PURE__ */ Symbol.for("react.fragment"), q2 = /* @__PURE__ */ Symbol.for("react.strict_mode"), r = /* @__PURE__ */ Symbol.for("react.profiler"), t = /* @__PURE__ */ Symbol.for("react.provider"), u2 = /* @__PURE__ */ Symbol.for("react.context"), v2 = /* @__PURE__ */ Symbol.for("react.forward_ref"), w3 = /* @__PURE__ */ Symbol.for("react.suspense"), x2 = /* @__PURE__ */ Symbol.for("react.memo"), y2 = /* @__PURE__ */ Symbol.for("react.lazy"), z2 = Symbol.iterator;
  function A2(a) {
    if (null === a || "object" !== typeof a) return null;
    a = z2 && a[z2] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var B2 = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C2 = Object.assign, D2 = {};
  function E2(a, b2, e) {
    this.props = a;
    this.context = b2;
    this.refs = D2;
    this.updater = e || B2;
  }
  E2.prototype.isReactComponent = {};
  E2.prototype.setState = function(a, b2) {
    if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b2, "setState");
  };
  E2.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F2() {
  }
  F2.prototype = E2.prototype;
  function G2(a, b2, e) {
    this.props = a;
    this.context = b2;
    this.refs = D2;
    this.updater = e || B2;
  }
  var H = G2.prototype = new F2();
  H.constructor = G2;
  C2(H, E2.prototype);
  H.isPureReactComponent = true;
  var I2 = Array.isArray, J = Object.prototype.hasOwnProperty, K2 = { current: null }, L2 = { key: true, ref: true, __self: true, __source: true };
  function M2(a, b2, e) {
    var d, c2 = {}, k2 = null, h2 = null;
    if (null != b2) for (d in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2) J.call(b2, d) && !L2.hasOwnProperty(d) && (c2[d] = b2[d]);
    var g = arguments.length - 2;
    if (1 === g) c2.children = e;
    else if (1 < g) {
      for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
      c2.children = f2;
    }
    if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c2[d] && (c2[d] = g[d]);
    return { $$typeof: l, type: a, key: k2, ref: h2, props: c2, _owner: K2.current };
  }
  function N2(a, b2) {
    return { $$typeof: l, type: a.type, key: b2, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function O2(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l;
  }
  function escape(a) {
    var b2 = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b2[a2];
    });
  }
  var P2 = /\/+/g;
  function Q2(a, b2) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b2.toString(36);
  }
  function R2(a, b2, e, d, c2) {
    var k2 = typeof a;
    if ("undefined" === k2 || "boolean" === k2) a = null;
    var h2 = false;
    if (null === a) h2 = true;
    else switch (k2) {
      case "string":
      case "number":
        h2 = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l:
          case n:
            h2 = true;
        }
    }
    if (h2) return h2 = a, c2 = c2(h2), a = "" === d ? "." + Q2(h2, 0) : d, I2(c2) ? (e = "", null != a && (e = a.replace(P2, "$&/") + "/"), R2(c2, b2, e, "", function(a2) {
      return a2;
    })) : null != c2 && (O2(c2) && (c2 = N2(c2, e + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P2, "$&/") + "/") + a)), b2.push(c2)), 1;
    h2 = 0;
    d = "" === d ? "." : d + ":";
    if (I2(a)) for (var g = 0; g < a.length; g++) {
      k2 = a[g];
      var f2 = d + Q2(k2, g);
      h2 += R2(k2, b2, e, f2, c2);
    }
    else if (f2 = A2(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q2(k2, g++), h2 += R2(k2, b2, e, f2, c2);
    else if ("object" === k2) throw b2 = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
    return h2;
  }
  function S(a, b2, e) {
    if (null == a) return a;
    var d = [], c2 = 0;
    R2(a, d, "", "", function(a2) {
      return b2.call(e, a2, c2++);
    });
    return d;
  }
  function T2(a) {
    if (-1 === a._status) {
      var b2 = a._result;
      b2 = b2();
      b2.then(function(b3) {
        if (0 === a._status || -1 === a._status) a._status = 1, a._result = b3;
      }, function(b3) {
        if (0 === a._status || -1 === a._status) a._status = 2, a._result = b3;
      });
      -1 === a._status && (a._status = 0, a._result = b2);
    }
    if (1 === a._status) return a._result.default;
    throw a._result;
  }
  var U2 = { current: null }, V2 = { transition: null }, W2 = { ReactCurrentDispatcher: U2, ReactCurrentBatchConfig: V2, ReactCurrentOwner: K2 };
  function X2() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  react_production_min.Children = { map: S, forEach: function(a, b2, e) {
    S(a, function() {
      b2.apply(this, arguments);
    }, e);
  }, count: function(a) {
    var b2 = 0;
    S(a, function() {
      b2++;
    });
    return b2;
  }, toArray: function(a) {
    return S(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O2(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E2;
  react_production_min.Fragment = p2;
  react_production_min.Profiler = r;
  react_production_min.PureComponent = G2;
  react_production_min.StrictMode = q2;
  react_production_min.Suspense = w3;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W2;
  react_production_min.act = X2;
  react_production_min.cloneElement = function(a, b2, e) {
    if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d = C2({}, a.props), c2 = a.key, k2 = a.ref, h2 = a._owner;
    if (null != b2) {
      void 0 !== b2.ref && (k2 = b2.ref, h2 = K2.current);
      void 0 !== b2.key && (c2 = "" + b2.key);
      if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
      for (f2 in b2) J.call(b2, f2) && !L2.hasOwnProperty(f2) && (d[f2] = void 0 === b2[f2] && void 0 !== g ? g[f2] : b2[f2]);
    }
    var f2 = arguments.length - 2;
    if (1 === f2) d.children = e;
    else if (1 < f2) {
      g = Array(f2);
      for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
      d.children = g;
    }
    return { $$typeof: l, type: a.type, key: c2, ref: k2, props: d, _owner: h2 };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u2, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M2;
  react_production_min.createFactory = function(a) {
    var b2 = M2.bind(null, a);
    b2.type = a;
    return b2;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v2, render: a };
  };
  react_production_min.isValidElement = O2;
  react_production_min.lazy = function(a) {
    return { $$typeof: y2, _payload: { _status: -1, _result: a }, _init: T2 };
  };
  react_production_min.memo = function(a, b2) {
    return { $$typeof: x2, type: a, compare: void 0 === b2 ? null : b2 };
  };
  react_production_min.startTransition = function(a) {
    var b2 = V2.transition;
    V2.transition = {};
    try {
      a();
    } finally {
      V2.transition = b2;
    }
  };
  react_production_min.unstable_act = X2;
  react_production_min.useCallback = function(a, b2) {
    return U2.current.useCallback(a, b2);
  };
  react_production_min.useContext = function(a) {
    return U2.current.useContext(a);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a) {
    return U2.current.useDeferredValue(a);
  };
  react_production_min.useEffect = function(a, b2) {
    return U2.current.useEffect(a, b2);
  };
  react_production_min.useId = function() {
    return U2.current.useId();
  };
  react_production_min.useImperativeHandle = function(a, b2, e) {
    return U2.current.useImperativeHandle(a, b2, e);
  };
  react_production_min.useInsertionEffect = function(a, b2) {
    return U2.current.useInsertionEffect(a, b2);
  };
  react_production_min.useLayoutEffect = function(a, b2) {
    return U2.current.useLayoutEffect(a, b2);
  };
  react_production_min.useMemo = function(a, b2) {
    return U2.current.useMemo(a, b2);
  };
  react_production_min.useReducer = function(a, b2, e) {
    return U2.current.useReducer(a, b2, e);
  };
  react_production_min.useRef = function(a) {
    return U2.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U2.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b2, e) {
    return U2.current.useSyncExternalStore(a, b2, e);
  };
  react_production_min.useTransition = function() {
    return U2.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  return react_production_min;
}
var react_development = { exports: {} };
react_development.exports;
var hasRequiredReact_development;
function requireReact_development() {
  if (hasRequiredReact_development) return react_development.exports;
  hasRequiredReact_development = 1;
  (function(module, exports$1) {
    if (process.env.NODE_ENV !== "production") {
      (function() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var ReactVersion = "18.3.1";
        var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element");
        var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = /* @__PURE__ */ Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
        var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = /* @__PURE__ */ Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactCurrentDispatcher = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactCurrentBatchConfig = {
          transition: null
        };
        var ReactCurrentActQueue = {
          current: null,
          // Used to reproduce behavior of `batchedUpdates` in legacy mode.
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false
        };
        var ReactCurrentOwner = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactDebugCurrentFrame = {};
        var currentExtraStackFrame = null;
        function setExtraStackFrame(stack) {
          {
            currentExtraStackFrame = stack;
          }
        }
        {
          ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
            {
              currentExtraStackFrame = stack;
            }
          };
          ReactDebugCurrentFrame.getCurrentStack = null;
          ReactDebugCurrentFrame.getStackAddendum = function() {
            var stack = "";
            if (currentExtraStackFrame) {
              stack += currentExtraStackFrame;
            }
            var impl = ReactDebugCurrentFrame.getCurrentStack;
            if (impl) {
              stack += impl() || "";
            }
            return stack;
          };
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var ReactSharedInternals = {
          ReactCurrentDispatcher,
          ReactCurrentBatchConfig,
          ReactCurrentOwner
        };
        {
          ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
          ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
        }
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var didWarnStateUpdateForUnmountedComponent = {};
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
              return;
            }
            error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
            didWarnStateUpdateForUnmountedComponent[warningKey] = true;
          }
        }
        var ReactNoopUpdateQueue = {
          /**
           * Checks whether or not this composite component is mounted.
           * @param {ReactClass} publicInstance The instance we want to test.
           * @return {boolean} True if mounted, false otherwise.
           * @protected
           * @final
           */
          isMounted: function(publicInstance) {
            return false;
          },
          /**
           * Forces an update. This should only be invoked when it is known with
           * certainty that we are **not** in a DOM transaction.
           *
           * You may want to call this when you know that some deeper aspect of the
           * component's state has changed but `setState` was not called.
           *
           * This will not invoke `shouldComponentUpdate`, but it will invoke
           * `componentWillUpdate` and `componentDidUpdate`.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueForceUpdate: function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
          },
          /**
           * Replaces all of the state. Always use this or `setState` to mutate state.
           * You should treat `this.state` as immutable.
           *
           * There is no guarantee that `this.state` will be immediately updated, so
           * accessing `this.state` after calling this method may return the old value.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} completeState Next state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, "replaceState");
          },
          /**
           * Sets a subset of the state. This only exists because _pendingState is
           * internal. This provides a merging strategy that is not available to deep
           * properties which is confusing. TODO: Expose pendingState or don't use it
           * during the merge.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} partialState Next partial state to be merged with state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} Name of the calling function in the public API.
           * @internal
           */
          enqueueSetState: function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, "setState");
          }
        };
        var assign = Object.assign;
        var emptyObject = {};
        {
          Object.freeze(emptyObject);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
            throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          }
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        {
          var deprecatedAPIs = {
            isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
            replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
          };
          var defineDeprecationWarning = function(methodName, info) {
            Object.defineProperty(Component.prototype, methodName, {
              get: function() {
                warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                return void 0;
              }
            });
          };
          for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
              defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
          }
        }
        function ComponentDummy() {
        }
        ComponentDummy.prototype = Component.prototype;
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
        pureComponentPrototype.constructor = PureComponent;
        assign(pureComponentPrototype, Component.prototype);
        pureComponentPrototype.isPureReactComponent = true;
        function createRef() {
          var refObject = {
            current: null
          };
          {
            Object.seal(refObject);
          }
          return refObject;
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x2) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          var warnAboutAccessingKey = function() {
            {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function defineRefPropWarningGetter(props, displayName) {
          var warnAboutAccessingRef = function() {
            {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
        function warnIfStringRefCannotBeAutoConverted(config) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        var ReactElement = function(type, key, ref, self2, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self2
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function createElement(type, config, children) {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          var self2 = null;
          var source = null;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              {
                warnIfStringRefCannotBeAutoConverted(config);
              }
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            self2 = config.__self === void 0 ? null : config.__self;
            source = config.__source === void 0 ? null : config.__source;
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            {
              if (Object.freeze) {
                Object.freeze(childArray);
              }
            }
            props.children = childArray;
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          {
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
          return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
          return newElement;
        }
        function cloneElement(element, config, children) {
          if (element === null || element === void 0) {
            throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
          }
          var propName;
          var props = assign({}, element.props);
          var key = element.key;
          var ref = element.ref;
          var self2 = element._self;
          var source = element._source;
          var owner = element._owner;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
              defaultProps = element.type.defaultProps;
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                if (config[propName] === void 0 && defaultProps !== void 0) {
                  props[propName] = defaultProps[propName];
                } else {
                  props[propName] = config[propName];
                }
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
          }
          return ReactElement(element.type, key, ref, self2, source, owner, props);
        }
        function isValidElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var SEPARATOR = ".";
        var SUBSEPARATOR = ":";
        function escape(key) {
          var escapeRegex = /[=:]/g;
          var escaperLookup = {
            "=": "=0",
            ":": "=2"
          };
          var escapedString = key.replace(escapeRegex, function(match) {
            return escaperLookup[match];
          });
          return "$" + escapedString;
        }
        var didWarnAboutMaps = false;
        var userProvidedKeyEscapeRegex = /\/+/g;
        function escapeUserProvidedKey(text) {
          return text.replace(userProvidedKeyEscapeRegex, "$&/");
        }
        function getElementKey(element, index) {
          if (typeof element === "object" && element !== null && element.key != null) {
            {
              checkKeyStringCoercion(element.key);
            }
            return escape("" + element.key);
          }
          return index.toString(36);
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if (type === "undefined" || type === "boolean") {
            children = null;
          }
          var invokeCallback = false;
          if (children === null) {
            invokeCallback = true;
          } else {
            switch (type) {
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                }
            }
          }
          if (invokeCallback) {
            var _child = children;
            var mappedChild = callback(_child);
            var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
            if (isArray(mappedChild)) {
              var escapedChildKey = "";
              if (childKey != null) {
                escapedChildKey = escapeUserProvidedKey(childKey) + "/";
              }
              mapIntoArray(mappedChild, array, escapedChildKey, "", function(c2) {
                return c2;
              });
            } else if (mappedChild != null) {
              if (isValidElement(mappedChild)) {
                {
                  if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                    checkKeyStringCoercion(mappedChild.key);
                  }
                }
                mappedChild = cloneAndReplaceKey(
                  mappedChild,
                  // Keep both the (mapped) and old keys if they differ, just as
                  // traverseAllChildren used to do for objects as children
                  escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                  (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? (
                    // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                    // eslint-disable-next-line react-internal/safe-string-coercion
                    escapeUserProvidedKey("" + mappedChild.key) + "/"
                  ) : "") + childKey
                );
              }
              array.push(mappedChild);
            }
            return 1;
          }
          var child;
          var nextName;
          var subtreeCount = 0;
          var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              child = children[i];
              nextName = nextNamePrefix + getElementKey(child, i);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else {
            var iteratorFn = getIteratorFn(children);
            if (typeof iteratorFn === "function") {
              var iterableChildren = children;
              {
                if (iteratorFn === iterableChildren.entries) {
                  if (!didWarnAboutMaps) {
                    warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                  }
                  didWarnAboutMaps = true;
                }
              }
              var iterator = iteratorFn.call(iterableChildren);
              var step;
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getElementKey(child, ii++);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else if (type === "object") {
              var childrenString = String(children);
              throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
            }
          }
          return subtreeCount;
        }
        function mapChildren(children, func, context) {
          if (children == null) {
            return children;
          }
          var result = [];
          var count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function countChildren(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        }
        function forEachChildren(children, forEachFunc, forEachContext) {
          mapChildren(children, function() {
            forEachFunc.apply(this, arguments);
          }, forEachContext);
        }
        function toArray(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        }
        function onlyChild(children) {
          if (!isValidElement(children)) {
            throw new Error("React.Children.only expected to receive a single React element child.");
          }
          return children;
        }
        function createContext(defaultValue) {
          var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            // As a workaround to support multiple concurrent renderers, we categorize
            // some renderers as primary and others as secondary. We only expect
            // there to be two concurrent renderers at most: React Native (primary) and
            // Fabric (secondary); React DOM (primary) and React ART (secondary).
            // Secondary renderers store their context values on separate fields.
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            // Used to track how many concurrent renderers this context currently
            // supports within in a single renderer. Such as parallel server rendering.
            _threadCount: 0,
            // These are circular
            Provider: null,
            Consumer: null,
            // Add these to use same hidden class in VM as ServerContext
            _defaultValue: null,
            _globalName: null
          };
          context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context
          };
          var hasWarnedAboutUsingNestedContextConsumers = false;
          var hasWarnedAboutUsingConsumerProvider = false;
          var hasWarnedAboutDisplayNameOnConsumer = false;
          {
            var Consumer = {
              $$typeof: REACT_CONTEXT_TYPE,
              _context: context
            };
            Object.defineProperties(Consumer, {
              Provider: {
                get: function() {
                  if (!hasWarnedAboutUsingConsumerProvider) {
                    hasWarnedAboutUsingConsumerProvider = true;
                    error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                  }
                  return context.Provider;
                },
                set: function(_Provider) {
                  context.Provider = _Provider;
                }
              },
              _currentValue: {
                get: function() {
                  return context._currentValue;
                },
                set: function(_currentValue) {
                  context._currentValue = _currentValue;
                }
              },
              _currentValue2: {
                get: function() {
                  return context._currentValue2;
                },
                set: function(_currentValue2) {
                  context._currentValue2 = _currentValue2;
                }
              },
              _threadCount: {
                get: function() {
                  return context._threadCount;
                },
                set: function(_threadCount) {
                  context._threadCount = _threadCount;
                }
              },
              Consumer: {
                get: function() {
                  if (!hasWarnedAboutUsingNestedContextConsumers) {
                    hasWarnedAboutUsingNestedContextConsumers = true;
                    error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                  return context.Consumer;
                }
              },
              displayName: {
                get: function() {
                  return context.displayName;
                },
                set: function(displayName) {
                  if (!hasWarnedAboutDisplayNameOnConsumer) {
                    warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                    hasWarnedAboutDisplayNameOnConsumer = true;
                  }
                }
              }
            });
            context.Consumer = Consumer;
          }
          {
            context._currentRenderer = null;
            context._currentRenderer2 = null;
          }
          return context;
        }
        var Uninitialized = -1;
        var Pending = 0;
        var Resolved = 1;
        var Rejected = 2;
        function lazyInitializer(payload) {
          if (payload._status === Uninitialized) {
            var ctor = payload._result;
            var thenable = ctor();
            thenable.then(function(moduleObject2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var resolved = payload;
                resolved._status = Resolved;
                resolved._result = moduleObject2;
              }
            }, function(error2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var rejected = payload;
                rejected._status = Rejected;
                rejected._result = error2;
              }
            });
            if (payload._status === Uninitialized) {
              var pending = payload;
              pending._status = Pending;
              pending._result = thenable;
            }
          }
          if (payload._status === Resolved) {
            var moduleObject = payload._result;
            {
              if (moduleObject === void 0) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
              }
            }
            {
              if (!("default" in moduleObject)) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            return moduleObject.default;
          } else {
            throw payload._result;
          }
        }
        function lazy(ctor) {
          var payload = {
            // We use these fields to store the result.
            _status: Uninitialized,
            _result: ctor
          };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: payload,
            _init: lazyInitializer
          };
          {
            var defaultProps;
            var propTypes;
            Object.defineProperties(lazyType, {
              defaultProps: {
                configurable: true,
                get: function() {
                  return defaultProps;
                },
                set: function(newDefaultProps) {
                  error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  defaultProps = newDefaultProps;
                  Object.defineProperty(lazyType, "defaultProps", {
                    enumerable: true
                  });
                }
              },
              propTypes: {
                configurable: true,
                get: function() {
                  return propTypes;
                },
                set: function(newPropTypes) {
                  error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  propTypes = newPropTypes;
                  Object.defineProperty(lazyType, "propTypes", {
                    enumerable: true
                  });
                }
              }
            });
          }
          return lazyType;
        }
        function forwardRef(render) {
          {
            if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
              error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
            } else if (typeof render !== "function") {
              error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
            } else {
              if (render.length !== 0 && render.length !== 2) {
                error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
              }
            }
            if (render != null) {
              if (render.defaultProps != null || render.propTypes != null) {
                error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
              }
            }
          }
          var elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!render.name && !render.displayName) {
                  render.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = /* @__PURE__ */ Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function memo(type, compare) {
          {
            if (!isValidElementType(type)) {
              error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
            }
          }
          var elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: compare === void 0 ? null : compare
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!type.name && !type.displayName) {
                  type.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        function resolveDispatcher() {
          var dispatcher = ReactCurrentDispatcher.current;
          {
            if (dispatcher === null) {
              error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
          }
          return dispatcher;
        }
        function useContext(Context) {
          var dispatcher = resolveDispatcher();
          {
            if (Context._context !== void 0) {
              var realContext = Context._context;
              if (realContext.Consumer === Context) {
                error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
              } else if (realContext.Provider === Context) {
                error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
              }
            }
          }
          return dispatcher.useContext(Context);
        }
        function useState(initialState) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useState(initialState);
        }
        function useReducer(reducer, initialArg, init) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useReducer(reducer, initialArg, init);
        }
        function useRef(initialValue) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useRef(initialValue);
        }
        function useEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useEffect(create, deps);
        }
        function useInsertionEffect(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useInsertionEffect(create, deps);
        }
        function useLayoutEffect2(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useLayoutEffect(create, deps);
        }
        function useCallback(callback, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useCallback(callback, deps);
        }
        function useMemo(create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useMemo(create, deps);
        }
        function useImperativeHandle(ref, create, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useImperativeHandle(ref, create, deps);
        }
        function useDebugValue(value, formatterFn) {
          {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDebugValue(value, formatterFn);
          }
        }
        function useTransition() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useTransition();
        }
        function useDeferredValue(value) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDeferredValue(value);
        }
        function useId() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useId();
        }
        function useSyncExternalStore(subscribe2, getSnapshot, getServerSnapshot) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useSyncExternalStore(subscribe2, getSnapshot, getServerSnapshot);
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix2;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix2 === void 0) {
              try {
                throw Error();
              } catch (x2) {
                var match = x2.stack.trim().match(/\n( *(at )?)/);
                prefix2 = match && match[1] || "";
              }
            }
            return "\n" + prefix2 + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn2, construct) {
          if (!fn2 || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn2);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x2) {
                  control = x2;
                }
                Reflect.construct(fn2, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x2) {
                  control = x2;
                }
                fn2.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x2) {
                control = x2;
              }
              fn2();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c2 = controlLines.length - 1;
              while (s >= 1 && c2 >= 0 && sampleLines[s] !== controlLines[c2]) {
                c2--;
              }
              for (; s >= 1 && c2 >= 0; s--, c2--) {
                if (sampleLines[s] !== controlLines[c2]) {
                  if (s !== 1 || c2 !== 1) {
                    do {
                      s--;
                      c2--;
                      if (c2 < 0 || sampleLines[s] !== controlLines[c2]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn2.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn2.displayName);
                        }
                        {
                          if (typeof fn2 === "function") {
                            componentFrameCache.set(fn2, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c2 >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher$1.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn2 ? fn2.displayName || fn2.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn2 === "function") {
              componentFrameCache.set(fn2, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn2, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn2, false);
          }
        }
        function shouldConstruct(Component2) {
          var prototype = Component2.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x2) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              setExtraStackFrame(stack);
            } else {
              setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function getDeclarationErrorAddendum() {
          if (ReactCurrentOwner.current) {
            var name = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
        function getSourceInfoErrorAddendum(source) {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
        function getSourceInfoErrorAddendumForProps(elementProps) {
          if (elementProps !== null && elementProps !== void 0) {
            return getSourceInfoErrorAddendum(elementProps.__source);
          }
          return "";
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
        function validateExplicitKey(element, parentType) {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          {
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function createElementWithValidation(type, props, children) {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendumForProps(props);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            {
              error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
          }
          var element = createElement.apply(this, arguments);
          if (element == null) {
            return element;
          }
          if (validType) {
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], type);
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
        var didWarnAboutDeprecatedCreateFactory = false;
        function createFactoryWithValidation(type) {
          var validatedFactory = createElementWithValidation.bind(null, type);
          validatedFactory.type = type;
          {
            if (!didWarnAboutDeprecatedCreateFactory) {
              didWarnAboutDeprecatedCreateFactory = true;
              warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
            }
            Object.defineProperty(validatedFactory, "type", {
              enumerable: false,
              get: function() {
                warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                Object.defineProperty(this, "type", {
                  value: type
                });
                return type;
              }
            });
          }
          return validatedFactory;
        }
        function cloneElementWithValidation(element, props, children) {
          var newElement = cloneElement.apply(this, arguments);
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }
        function startTransition(scope, options) {
          var prevTransition = ReactCurrentBatchConfig.transition;
          ReactCurrentBatchConfig.transition = {};
          var currentTransition = ReactCurrentBatchConfig.transition;
          {
            ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
          }
          try {
            scope();
          } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
            {
              if (prevTransition === null && currentTransition._updatedFibers) {
                var updatedFibersCount = currentTransition._updatedFibers.size;
                if (updatedFibersCount > 10) {
                  warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                }
                currentTransition._updatedFibers.clear();
              }
            }
          }
        }
        var didWarnAboutMessageChannel = false;
        var enqueueTaskImpl = null;
        function enqueueTask(task) {
          if (enqueueTaskImpl === null) {
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              var nodeRequire = module && module[requireString];
              enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                {
                  if (didWarnAboutMessageChannel === false) {
                    didWarnAboutMessageChannel = true;
                    if (typeof MessageChannel === "undefined") {
                      error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                    }
                  }
                }
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          }
          return enqueueTaskImpl(task);
        }
        var actScopeDepth = 0;
        var didWarnNoAwaitAct = false;
        function act(callback) {
          {
            var prevActScopeDepth = actScopeDepth;
            actScopeDepth++;
            if (ReactCurrentActQueue.current === null) {
              ReactCurrentActQueue.current = [];
            }
            var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
            var result;
            try {
              ReactCurrentActQueue.isBatchingLegacy = true;
              result = callback();
              if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                var queue = ReactCurrentActQueue.current;
                if (queue !== null) {
                  ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                  flushActQueue(queue);
                }
              }
            } catch (error2) {
              popActScope(prevActScopeDepth);
              throw error2;
            } finally {
              ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
            }
            if (result !== null && typeof result === "object" && typeof result.then === "function") {
              var thenableResult = result;
              var wasAwaited = false;
              var thenable = {
                then: function(resolve, reject) {
                  wasAwaited = true;
                  thenableResult.then(function(returnValue2) {
                    popActScope(prevActScopeDepth);
                    if (actScopeDepth === 0) {
                      recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                    } else {
                      resolve(returnValue2);
                    }
                  }, function(error2) {
                    popActScope(prevActScopeDepth);
                    reject(error2);
                  });
                }
              };
              {
                if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                  Promise.resolve().then(function() {
                  }).then(function() {
                    if (!wasAwaited) {
                      didWarnNoAwaitAct = true;
                      error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                    }
                  });
                }
              }
              return thenable;
            } else {
              var returnValue = result;
              popActScope(prevActScopeDepth);
              if (actScopeDepth === 0) {
                var _queue = ReactCurrentActQueue.current;
                if (_queue !== null) {
                  flushActQueue(_queue);
                  ReactCurrentActQueue.current = null;
                }
                var _thenable = {
                  then: function(resolve, reject) {
                    if (ReactCurrentActQueue.current === null) {
                      ReactCurrentActQueue.current = [];
                      recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                    } else {
                      resolve(returnValue);
                    }
                  }
                };
                return _thenable;
              } else {
                var _thenable2 = {
                  then: function(resolve, reject) {
                    resolve(returnValue);
                  }
                };
                return _thenable2;
              }
            }
          }
        }
        function popActScope(prevActScopeDepth) {
          {
            if (prevActScopeDepth !== actScopeDepth - 1) {
              error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
            }
            actScopeDepth = prevActScopeDepth;
          }
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          {
            var queue = ReactCurrentActQueue.current;
            if (queue !== null) {
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  if (queue.length === 0) {
                    ReactCurrentActQueue.current = null;
                    resolve(returnValue);
                  } else {
                    recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  }
                });
              } catch (error2) {
                reject(error2);
              }
            } else {
              resolve(returnValue);
            }
          }
        }
        var isFlushing = false;
        function flushActQueue(queue) {
          {
            if (!isFlushing) {
              isFlushing = true;
              var i = 0;
              try {
                for (; i < queue.length; i++) {
                  var callback = queue[i];
                  do {
                    callback = callback(true);
                  } while (callback !== null);
                }
                queue.length = 0;
              } catch (error2) {
                queue = queue.slice(i + 1);
                throw error2;
              } finally {
                isFlushing = false;
              }
            }
          }
        }
        var createElement$1 = createElementWithValidation;
        var cloneElement$1 = cloneElementWithValidation;
        var createFactory = createFactoryWithValidation;
        var Children = {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray,
          only: onlyChild
        };
        exports$1.Children = Children;
        exports$1.Component = Component;
        exports$1.Fragment = REACT_FRAGMENT_TYPE;
        exports$1.Profiler = REACT_PROFILER_TYPE;
        exports$1.PureComponent = PureComponent;
        exports$1.StrictMode = REACT_STRICT_MODE_TYPE;
        exports$1.Suspense = REACT_SUSPENSE_TYPE;
        exports$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
        exports$1.act = act;
        exports$1.cloneElement = cloneElement$1;
        exports$1.createContext = createContext;
        exports$1.createElement = createElement$1;
        exports$1.createFactory = createFactory;
        exports$1.createRef = createRef;
        exports$1.forwardRef = forwardRef;
        exports$1.isValidElement = isValidElement;
        exports$1.lazy = lazy;
        exports$1.memo = memo;
        exports$1.startTransition = startTransition;
        exports$1.unstable_act = act;
        exports$1.useCallback = useCallback;
        exports$1.useContext = useContext;
        exports$1.useDebugValue = useDebugValue;
        exports$1.useDeferredValue = useDeferredValue;
        exports$1.useEffect = useEffect;
        exports$1.useId = useId;
        exports$1.useImperativeHandle = useImperativeHandle;
        exports$1.useInsertionEffect = useInsertionEffect;
        exports$1.useLayoutEffect = useLayoutEffect2;
        exports$1.useMemo = useMemo;
        exports$1.useReducer = useReducer;
        exports$1.useRef = useRef;
        exports$1.useState = useState;
        exports$1.useSyncExternalStore = useSyncExternalStore;
        exports$1.useTransition = useTransition;
        exports$1.version = ReactVersion;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  })(react_development, react_development.exports);
  return react_development.exports;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact) return react.exports;
  hasRequiredReact = 1;
  if (process.env.NODE_ENV === "production") {
    react.exports = requireReact_production_min();
  } else {
    react.exports = requireReact_development();
  }
  return react.exports;
}
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f2 = requireReact(), k2 = /* @__PURE__ */ Symbol.for("react.element"), l = /* @__PURE__ */ Symbol.for("react.fragment"), m2 = Object.prototype.hasOwnProperty, n = f2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p2 = { key: true, ref: true, __self: true, __source: true };
  function q2(c2, a, g) {
    var b2, d = {}, e = null, h2 = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h2 = a.ref);
    for (b2 in a) m2.call(a, b2) && !p2.hasOwnProperty(b2) && (d[b2] = a[b2]);
    if (c2 && c2.defaultProps) for (b2 in a = c2.defaultProps, a) void 0 === d[b2] && (d[b2] = a[b2]);
    return { $$typeof: k2, type: c2, key: e, ref: h2, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q2;
  reactJsxRuntime_production_min.jsxs = q2;
  return reactJsxRuntime_production_min;
}
var reactJsxRuntime_development = {};
var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
  hasRequiredReactJsxRuntime_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var React = requireReact();
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element");
      var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = /* @__PURE__ */ Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
      var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = /* @__PURE__ */ Symbol.for("react.offscreen");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = /* @__PURE__ */ Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
            return true;
          }
        }
        return false;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x2) {
                return null;
              }
            }
          }
        }
        return null;
      }
      var assign = Object.assign;
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix2;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix2 === void 0) {
            try {
              throw Error();
            } catch (x2) {
              var match = x2.stack.trim().match(/\n( *(at )?)/);
              prefix2 = match && match[1] || "";
            }
          }
          return "\n" + prefix2 + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn2, construct) {
        if (!fn2 || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn2);
          if (frame !== void 0) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x2) {
                control = x2;
              }
              Reflect.construct(fn2, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x2) {
                control = x2;
              }
              fn2.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x2) {
              control = x2;
            }
            fn2();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c2 = controlLines.length - 1;
            while (s >= 1 && c2 >= 0 && sampleLines[s] !== controlLines[c2]) {
              c2--;
            }
            for (; s >= 1 && c2 >= 0; s--, c2--) {
              if (sampleLines[s] !== controlLines[c2]) {
                if (s !== 1 || c2 !== 1) {
                  do {
                    s--;
                    c2--;
                    if (c2 < 0 || sampleLines[s] !== controlLines[c2]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn2.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn2.displayName);
                      }
                      {
                        if (typeof fn2 === "function") {
                          componentFrameCache.set(fn2, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c2 >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn2 ? fn2.displayName || fn2.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn2 === "function") {
            componentFrameCache.set(fn2, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeFunctionComponentFrame(fn2, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn2, false);
        }
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x2) {
              }
            }
          }
        }
        return "";
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error("Failed %s type: %s", location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown;
      var specialPropRefWarningShown;
      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, "ref")) {
            var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== void 0;
      }
      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== void 0;
      }
      function warnIfStringRefCannotBeAutoConverted(config, self2) {
        {
          if (typeof config.ref === "string" && ReactCurrentOwner.current && self2) ;
        }
      }
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = function() {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
      }
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = function() {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
      }
      var ReactElement = function(type, key, ref, self2, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type,
          key,
          ref,
          props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          element._store = {};
          Object.defineProperty(element._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          Object.defineProperty(element, "_self", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self2
          });
          Object.defineProperty(element, "_source", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      function jsxDEV(type, config, maybeKey, source, self2) {
        {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          if (maybeKey !== void 0) {
            {
              checkKeyStringCoercion(maybeKey);
            }
            key = "" + maybeKey;
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = "" + config.key;
          }
          if (hasValidRef(config)) {
            ref = config.ref;
            warnIfStringRefCannotBeAutoConverted(config, self2);
          }
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          if (key || ref) {
            var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
          return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
        }
      }
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null);
          }
        }
      }
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      function isValidElement(object) {
        {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
      }
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
      }
      function getSourceInfoErrorAddendum(source) {
        {
          return "";
        }
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
      }
      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          setCurrentlyValidatingElement$1(element);
          error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement$1(null);
        }
      }
      function validateChildKeys(node, parentType) {
        {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === void 0 || typeof type === "string") {
            return;
          }
          var propTypes;
          if (typeof type === "function") {
            propTypes = type.propTypes;
          } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var _name = getComponentNameFromType(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
          }
        }
      }
      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
              setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
          }
        }
      }
      var didWarnAboutKeySpread = {};
      function jsxWithValidation(type, props, key, isStaticChildren, source, self2) {
        {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendum();
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
          var element = jsxDEV(type, props, key, source, self2);
          if (element == null) {
            return element;
          }
          if (validType) {
            var children = props.children;
            if (children !== void 0) {
              if (isStaticChildren) {
                if (isArray(children)) {
                  for (var i = 0; i < children.length; i++) {
                    validateChildKeys(children[i], type);
                  }
                  if (Object.freeze) {
                    Object.freeze(children);
                  }
                } else {
                  error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                }
              } else {
                validateChildKeys(children, type);
              }
            }
          }
          {
            if (hasOwnProperty.call(props, "key")) {
              var componentName = getComponentNameFromType(type);
              var keys = Object.keys(props).filter(function(k2) {
                return k2 !== "key";
              });
              var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
              if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                didWarnAboutKeySpread[componentName + beforeExample] = true;
              }
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
      }
      function jsxWithValidationStatic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, true);
        }
      }
      function jsxWithValidationDynamic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, false);
        }
      }
      var jsx = jsxWithValidationDynamic;
      var jsxs = jsxWithValidationStatic;
      reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
      reactJsxRuntime_development.jsx = jsx;
      reactJsxRuntime_development.jsxs = jsxs;
    })();
  }
  return reactJsxRuntime_development;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime) return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  if (process.env.NODE_ENV === "production") {
    jsxRuntime.exports = requireReactJsxRuntime_production_min();
  } else {
    jsxRuntime.exports = requireReactJsxRuntime_development();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
const __storeToDerived = /* @__PURE__ */ new WeakMap();
const __derivedToStore = /* @__PURE__ */ new WeakMap();
const __depsThatHaveWrittenThisTick = {
  current: []
};
let __isFlushing = false;
let __batchDepth = 0;
const __pendingUpdates = /* @__PURE__ */ new Set();
const __initialBatchValues = /* @__PURE__ */ new Map();
function __flush_internals(relatedVals) {
  for (const derived of relatedVals) {
    if (__depsThatHaveWrittenThisTick.current.includes(derived)) {
      continue;
    }
    __depsThatHaveWrittenThisTick.current.push(derived);
    derived.recompute();
    const stores = __derivedToStore.get(derived);
    if (stores) {
      for (const store of stores) {
        const relatedLinkedDerivedVals = __storeToDerived.get(store);
        if (!(relatedLinkedDerivedVals == null ? void 0 : relatedLinkedDerivedVals.length)) continue;
        __flush_internals(relatedLinkedDerivedVals);
      }
    }
  }
}
function __notifyListeners(store) {
  const value = {
    prevVal: store.prevState,
    currentVal: store.state
  };
  for (const listener of store.listeners) {
    listener(value);
  }
}
function __notifyDerivedListeners(derived) {
  const value = {
    prevVal: derived.prevState,
    currentVal: derived.state
  };
  for (const listener of derived.listeners) {
    listener(value);
  }
}
function __flush(store) {
  if (__batchDepth > 0 && !__initialBatchValues.has(store)) {
    __initialBatchValues.set(store, store.prevState);
  }
  __pendingUpdates.add(store);
  if (__batchDepth > 0) return;
  if (__isFlushing) return;
  try {
    __isFlushing = true;
    while (__pendingUpdates.size > 0) {
      const stores = Array.from(__pendingUpdates);
      __pendingUpdates.clear();
      for (const store2 of stores) {
        const prevState = __initialBatchValues.get(store2) ?? store2.prevState;
        store2.prevState = prevState;
        __notifyListeners(store2);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        __depsThatHaveWrittenThisTick.current.push(store2);
        __flush_internals(derivedVals);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        for (const derived of derivedVals) {
          __notifyDerivedListeners(derived);
        }
      }
    }
  } finally {
    __isFlushing = false;
    __depsThatHaveWrittenThisTick.current = [];
    __initialBatchValues.clear();
  }
}
function batch(fn2) {
  __batchDepth++;
  try {
    fn2();
  } finally {
    __batchDepth--;
    if (__batchDepth === 0) {
      const pendingUpdateToFlush = __pendingUpdates.values().next().value;
      if (pendingUpdateToFlush) {
        __flush(pendingUpdateToFlush);
      }
    }
  }
}
function isUpdaterFunction(updater) {
  return typeof updater === "function";
}
class Store {
  constructor(initialState, options) {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = (listener) => {
      var _a, _b;
      this.listeners.add(listener);
      const unsub = (_b = (_a = this.options) == null ? void 0 : _a.onSubscribe) == null ? void 0 : _b.call(_a, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.prevState = initialState;
    this.state = initialState;
    this.options = options;
  }
  setState(updater) {
    var _a, _b, _c;
    this.prevState = this.state;
    if ((_a = this.options) == null ? void 0 : _a.updateFn) {
      this.state = this.options.updateFn(this.prevState)(updater);
    } else {
      if (isUpdaterFunction(updater)) {
        this.state = updater(this.prevState);
      } else {
        this.state = updater;
      }
    }
    (_c = (_b = this.options) == null ? void 0 : _b.onUpdate) == null ? void 0 : _c.call(_b);
    __flush(this);
  }
}
const stateIndexKey = "__TSR_index";
const popStateEvent = "popstate";
const beforeUnloadEvent = "beforeunload";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    const ignoreBlocker = navigateOpts?.ignoreBlocker ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = opts.getBlockers?.() ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          opts.onBlocked?.();
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index);
          handleIndexChange({ type: "GO", index });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back(navigateOpts?.ignoreBlocker ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward(navigateOpts?.ignoreBlocker ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      if (!opts.setBlockers) return () => {
      };
      const blockers = opts.getBlockers?.() ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        const blockers2 = opts.getBlockers?.() ?? [];
        opts.setBlockers?.(blockers2.filter((b2) => b2 !== blocker));
      };
    },
    flush: () => opts.flush?.(),
    destroy: () => opts.destroy?.(),
    notify
  };
}
function assignKeyAndIndex(index, state) {
  if (!state) {
    state = {};
  }
  const key = createRandomKey();
  return {
    ...state,
    key,
    // TODO: Remove in v2 - use __TSR_key instead
    __TSR_key: key,
    [stateIndexKey]: index
  };
}
function createBrowserHistory(opts) {
  const win = typeof document !== "undefined" ? window : void 0;
  const originalPushState = win.history.pushState;
  const originalReplaceState = win.history.replaceState;
  let blockers = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers) => blockers = newBlockers;
  const createHref = ((path) => path);
  const parseLocation = (() => parseHref(
    `${win.location.pathname}${win.location.search}${win.location.hash}`,
    win.history.state
  ));
  if (!win.history.state?.__TSR_key && !win.history.state?.key) {
    const addedKey = createRandomKey();
    win.history.replaceState(
      {
        [stateIndexKey]: 0,
        key: addedKey,
        // TODO: Remove in v2 - use __TSR_key instead
        __TSR_key: addedKey
      },
      ""
    );
  }
  let currentLocation = parseLocation();
  let rollbackLocation;
  let nextPopIsGo = false;
  let ignoreNextPop = false;
  let skipBlockerNextPop = false;
  let ignoreNextBeforeUnload = false;
  const getLocation = () => currentLocation;
  let next;
  let scheduled;
  const flush = () => {
    if (!next) {
      return;
    }
    history._ignoreSubscribers = true;
    (next.isPush ? win.history.pushState : win.history.replaceState)(
      next.state,
      "",
      next.href
    );
    history._ignoreSubscribers = false;
    next = void 0;
    scheduled = void 0;
    rollbackLocation = void 0;
  };
  const queueHistoryAction = (type, destHref, state) => {
    const href = createHref(destHref);
    if (!scheduled) {
      rollbackLocation = currentLocation;
    }
    currentLocation = parseHref(destHref, state);
    next = {
      href,
      state,
      isPush: next?.isPush || type === "push"
    };
    if (!scheduled) {
      scheduled = Promise.resolve().then(() => flush());
    }
  };
  const onPushPop = (type) => {
    currentLocation = parseLocation();
    history.notify({ type });
  };
  const onPushPopEvent = async () => {
    if (ignoreNextPop) {
      ignoreNextPop = false;
      return;
    }
    const nextLocation = parseLocation();
    const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
    const isForward = delta === 1;
    const isBack = delta === -1;
    const isGo = !isForward && !isBack || nextPopIsGo;
    nextPopIsGo = false;
    const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
    const notify = isGo ? {
      type: "GO",
      index: delta
    } : {
      type: isBack ? "BACK" : "FORWARD"
    };
    if (skipBlockerNextPop) {
      skipBlockerNextPop = false;
    } else {
      const blockers2 = _getBlockers();
      if (typeof document !== "undefined" && blockers2.length) {
        for (const blocker of blockers2) {
          const isBlocked = await blocker.blockerFn({
            currentLocation,
            nextLocation,
            action
          });
          if (isBlocked) {
            ignoreNextPop = true;
            win.history.go(1);
            history.notify(notify);
            return;
          }
        }
      }
    }
    currentLocation = parseLocation();
    history.notify(notify);
  };
  const onBeforeUnload = (e) => {
    if (ignoreNextBeforeUnload) {
      ignoreNextBeforeUnload = false;
      return;
    }
    let shouldBlock = false;
    const blockers2 = _getBlockers();
    if (typeof document !== "undefined" && blockers2.length) {
      for (const blocker of blockers2) {
        const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
        if (shouldHaveBeforeUnload === true) {
          shouldBlock = true;
          break;
        }
        if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
          shouldBlock = true;
          break;
        }
      }
    }
    if (shouldBlock) {
      e.preventDefault();
      return e.returnValue = "";
    }
    return;
  };
  const history = createHistory({
    getLocation,
    getLength: () => win.history.length,
    pushState: (href, state) => queueHistoryAction("push", href, state),
    replaceState: (href, state) => queueHistoryAction("replace", href, state),
    back: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      return win.history.back();
    },
    forward: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      win.history.forward();
    },
    go: (n) => {
      nextPopIsGo = true;
      win.history.go(n);
    },
    createHref: (href) => createHref(href),
    flush,
    destroy: () => {
      win.history.pushState = originalPushState;
      win.history.replaceState = originalReplaceState;
      win.removeEventListener(beforeUnloadEvent, onBeforeUnload, {
        capture: true
      });
      win.removeEventListener(popStateEvent, onPushPopEvent);
    },
    onBlocked: () => {
      if (rollbackLocation && currentLocation !== rollbackLocation) {
        currentLocation = rollbackLocation;
      }
    },
    getBlockers: _getBlockers,
    setBlockers: _setBlockers,
    notifyOnIndexChange: false
  });
  win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
  win.addEventListener(popStateEvent, onPushPopEvent);
  win.history.pushState = function(...args) {
    const res = originalPushState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("PUSH");
    return res;
  };
  win.history.replaceState = function(...args) {
    const res = originalReplaceState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("REPLACE");
    return res;
  };
  return history;
}
function createMemoryHistory(opts = {
  initialEntries: ["/"]
}) {
  const entries = opts.initialEntries;
  let index = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
  const states = entries.map(
    (_entry, index2) => assignKeyAndIndex(index2, void 0)
  );
  const getLocation = () => parseHref(entries[index], states[index]);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index < entries.length - 1) {
        entries.splice(index + 1);
        states.splice(index + 1);
      }
      states.push(state);
      entries.push(path);
      index = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index] = state;
      entries[index] = path;
    },
    back: () => {
      index = Math.max(index - 1, 0);
    },
    forward: () => {
      index = Math.min(index + 1, entries.length - 1);
    },
    go: (n) => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: (path) => path
  });
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  const addedKey = createRandomKey();
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
    state: state || { [stateIndexKey]: 0, key: addedKey, __TSR_key: addedKey }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function last(arr) {
  return arr[arr.length - 1];
}
function isFunction(d) {
  return typeof d === "function";
}
function functionalUpdate(updater, previous) {
  if (isFunction(updater)) {
    return updater(previous);
  }
  return updater;
}
const hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(prev, _next) {
  if (prev === _next) {
    return prev;
  }
  const next = _next;
  const array = isPlainArray(prev) && isPlainArray(next);
  if (!array && !(isPlainObject(prev) && isPlainObject(next))) return next;
  const prevItems = array ? prev : getEnumerableOwnKeys(prev);
  if (!prevItems) return next;
  const nextItems = array ? next : getEnumerableOwnKeys(next);
  if (!nextItems) return next;
  const prevSize = prevItems.length;
  const nextSize = nextItems.length;
  const copy = array ? new Array(nextSize) : {};
  let equalItems = 0;
  for (let i = 0; i < nextSize; i++) {
    const key = array ? i : nextItems[i];
    const p2 = prev[key];
    const n = next[key];
    if (p2 === n) {
      copy[key] = p2;
      if (array ? i < prevSize : hasOwn.call(prev, key)) equalItems++;
      continue;
    }
    if (p2 === null || n === null || typeof p2 !== "object" || typeof n !== "object") {
      copy[key] = n;
      continue;
    }
    const v2 = replaceEqualDeep(p2, n);
    copy[key] = v2;
    if (v2 === p2) equalItems++;
  }
  return prevSize === nextSize && equalItems === prevSize ? prev : copy;
}
function getEnumerableOwnKeys(o2) {
  const keys = [];
  const names = Object.getOwnPropertyNames(o2);
  for (const name of names) {
    if (!Object.prototype.propertyIsEnumerable.call(o2, name)) return false;
    keys.push(name);
  }
  const symbols = Object.getOwnPropertySymbols(o2);
  for (const symbol of symbols) {
    if (!Object.prototype.propertyIsEnumerable.call(o2, symbol)) return false;
    keys.push(symbol);
  }
  return keys;
}
function isPlainObject(o2) {
  if (!hasObjectPrototype(o2)) {
    return false;
  }
  const ctor = o2.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o2) {
  return Object.prototype.toString.call(o2) === "[object Object]";
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function deepEqual(a, b2, opts) {
  if (a === b2) {
    return true;
  }
  if (typeof a !== typeof b2) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b2)) {
    if (a.length !== b2.length) return false;
    for (let i = 0, l = a.length; i < l; i++) {
      if (!deepEqual(a[i], b2[i], opts)) return false;
    }
    return true;
  }
  if (isPlainObject(a) && isPlainObject(b2)) {
    const ignoreUndefined = opts?.ignoreUndefined ?? true;
    if (opts?.partial) {
      for (const k2 in b2) {
        if (!ignoreUndefined || b2[k2] !== void 0) {
          if (!deepEqual(a[k2], b2[k2], opts)) return false;
        }
      }
      return true;
    }
    let aCount = 0;
    if (!ignoreUndefined) {
      aCount = Object.keys(a).length;
    } else {
      for (const k2 in a) {
        if (a[k2] !== void 0) aCount++;
      }
    }
    let bCount = 0;
    for (const k2 in b2) {
      if (!ignoreUndefined || b2[k2] !== void 0) {
        bCount++;
        if (bCount > aCount || !deepEqual(a[k2], b2[k2], opts)) return false;
      }
    }
    return aCount === bCount;
  }
  return false;
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
    onResolve?.(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
function isModuleNotFoundError(error) {
  if (typeof error?.message !== "string") return false;
  return error.message.startsWith("Failed to fetch dynamically imported module") || error.message.startsWith("error loading dynamically imported module") || error.message.startsWith("Importing a module script failed");
}
function isPromise(value) {
  return Boolean(
    value && typeof value === "object" && typeof value.then === "function"
  );
}
function findLast(array, predicate) {
  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i];
    if (predicate(item)) return item;
  }
  return void 0;
}
function decodeSegment(segment) {
  try {
    return decodeURI(segment);
  } catch {
    return segment.replaceAll(/%[0-9A-F]{2}/gi, (match) => {
      try {
        return decodeURI(match);
      } catch {
        return match;
      }
    });
  }
}
function decodePath(path, decodeIgnore) {
  if (!path) return path;
  const re2 = /%25|%5C/gi;
  let cursor = 0;
  let result = "";
  let match;
  while (null !== (match = re2.exec(path))) {
    result += decodeSegment(path.slice(cursor, match.index)) + match[0];
    cursor = re2.lastIndex;
  }
  return result + decodeSegment(cursor ? path.slice(cursor) : path);
}
var isProduction$1 = process.env.NODE_ENV === "production";
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction$1) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}
function createLRUCache(max) {
  const cache = /* @__PURE__ */ new Map();
  let oldest;
  let newest;
  const touch = (entry) => {
    if (!entry.next) return;
    if (!entry.prev) {
      entry.next.prev = void 0;
      oldest = entry.next;
      entry.next = void 0;
      if (newest) {
        entry.prev = newest;
        newest.next = entry;
      }
    } else {
      entry.prev.next = entry.next;
      entry.next.prev = entry.prev;
      entry.next = void 0;
      if (newest) {
        newest.next = entry;
        entry.prev = newest;
      }
    }
    newest = entry;
  };
  return {
    get(key) {
      const entry = cache.get(key);
      if (!entry) return void 0;
      touch(entry);
      return entry.value;
    },
    set(key, value) {
      if (cache.size >= max && oldest) {
        const toDelete = oldest;
        cache.delete(toDelete.key);
        if (toDelete.next) {
          oldest = toDelete.next;
          toDelete.next.prev = void 0;
        }
        if (toDelete === newest) {
          newest = void 0;
        }
      }
      const existing = cache.get(key);
      if (existing) {
        existing.value = value;
        touch(existing);
      } else {
        const entry = { key, value, prev: newest };
        if (newest) newest.next = entry;
        newest = entry;
        if (!oldest) oldest = entry;
        cache.set(key, entry);
      }
    },
    clear() {
      cache.clear();
      oldest = void 0;
      newest = void 0;
    }
  };
}
const SEGMENT_TYPE_PATHNAME = 0;
const SEGMENT_TYPE_PARAM = 1;
const SEGMENT_TYPE_WILDCARD = 2;
const SEGMENT_TYPE_OPTIONAL_PARAM = 3;
const SEGMENT_TYPE_INDEX = 4;
const PARAM_W_CURLY_BRACES_RE = /^([^{]*)\{\$([a-zA-Z_$][a-zA-Z0-9_$]*)\}([^}]*)$/;
const OPTIONAL_PARAM_W_CURLY_BRACES_RE = /^([^{]*)\{-\$([a-zA-Z_$][a-zA-Z0-9_$]*)\}([^}]*)$/;
const WILDCARD_W_CURLY_BRACES_RE = /^([^{]*)\{\$\}([^}]*)$/;
function parseSegment(path, start, output = new Uint16Array(6)) {
  const next = path.indexOf("/", start);
  const end = next === -1 ? path.length : next;
  const part = path.substring(start, end);
  if (!part || !part.includes("$")) {
    output[0] = SEGMENT_TYPE_PATHNAME;
    output[1] = start;
    output[2] = start;
    output[3] = end;
    output[4] = end;
    output[5] = end;
    return output;
  }
  if (part === "$") {
    const total = path.length;
    output[0] = SEGMENT_TYPE_WILDCARD;
    output[1] = start;
    output[2] = start;
    output[3] = total;
    output[4] = total;
    output[5] = total;
    return output;
  }
  if (part.charCodeAt(0) === 36) {
    output[0] = SEGMENT_TYPE_PARAM;
    output[1] = start;
    output[2] = start + 1;
    output[3] = end;
    output[4] = end;
    output[5] = end;
    return output;
  }
  const wildcardBracesMatch = part.match(WILDCARD_W_CURLY_BRACES_RE);
  if (wildcardBracesMatch) {
    const prefix2 = wildcardBracesMatch[1];
    const pLength = prefix2.length;
    output[0] = SEGMENT_TYPE_WILDCARD;
    output[1] = start + pLength;
    output[2] = start + pLength + 1;
    output[3] = start + pLength + 2;
    output[4] = start + pLength + 3;
    output[5] = path.length;
    return output;
  }
  const optionalParamBracesMatch = part.match(OPTIONAL_PARAM_W_CURLY_BRACES_RE);
  if (optionalParamBracesMatch) {
    const prefix2 = optionalParamBracesMatch[1];
    const paramName = optionalParamBracesMatch[2];
    const suffix = optionalParamBracesMatch[3];
    const pLength = prefix2.length;
    output[0] = SEGMENT_TYPE_OPTIONAL_PARAM;
    output[1] = start + pLength;
    output[2] = start + pLength + 3;
    output[3] = start + pLength + 3 + paramName.length;
    output[4] = end - suffix.length;
    output[5] = end;
    return output;
  }
  const paramBracesMatch = part.match(PARAM_W_CURLY_BRACES_RE);
  if (paramBracesMatch) {
    const prefix2 = paramBracesMatch[1];
    const paramName = paramBracesMatch[2];
    const suffix = paramBracesMatch[3];
    const pLength = prefix2.length;
    output[0] = SEGMENT_TYPE_PARAM;
    output[1] = start + pLength;
    output[2] = start + pLength + 2;
    output[3] = start + pLength + 2 + paramName.length;
    output[4] = end - suffix.length;
    output[5] = end;
    return output;
  }
  output[0] = SEGMENT_TYPE_PATHNAME;
  output[1] = start;
  output[2] = start;
  output[3] = end;
  output[4] = end;
  output[5] = end;
  return output;
}
function parseSegments(defaultCaseSensitive, data, route, start, node, depth, onRoute) {
  onRoute?.(route);
  let cursor = start;
  {
    const path = route.fullPath ?? route.from;
    const length = path.length;
    const caseSensitive = route.options?.caseSensitive ?? defaultCaseSensitive;
    while (cursor < length) {
      const segment = parseSegment(path, cursor, data);
      let nextNode;
      const start2 = cursor;
      const end = segment[5];
      cursor = end + 1;
      depth++;
      const kind = segment[0];
      switch (kind) {
        case SEGMENT_TYPE_PATHNAME: {
          const value = path.substring(segment[2], segment[3]);
          if (caseSensitive) {
            const existingNode = node.static?.get(value);
            if (existingNode) {
              nextNode = existingNode;
            } else {
              node.static ??= /* @__PURE__ */ new Map();
              const next = createStaticNode(
                route.fullPath ?? route.from
              );
              next.parent = node;
              next.depth = depth;
              nextNode = next;
              node.static.set(value, next);
            }
          } else {
            const name = value.toLowerCase();
            const existingNode = node.staticInsensitive?.get(name);
            if (existingNode) {
              nextNode = existingNode;
            } else {
              node.staticInsensitive ??= /* @__PURE__ */ new Map();
              const next = createStaticNode(
                route.fullPath ?? route.from
              );
              next.parent = node;
              next.depth = depth;
              nextNode = next;
              node.staticInsensitive.set(name, next);
            }
          }
          break;
        }
        case SEGMENT_TYPE_PARAM: {
          const prefix_raw = path.substring(start2, segment[1]);
          const suffix_raw = path.substring(segment[4], end);
          const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
          const prefix2 = !prefix_raw ? void 0 : actuallyCaseSensitive ? prefix_raw : prefix_raw.toLowerCase();
          const suffix = !suffix_raw ? void 0 : actuallyCaseSensitive ? suffix_raw : suffix_raw.toLowerCase();
          const existingNode = node.dynamic?.find(
            (s) => s.caseSensitive === actuallyCaseSensitive && s.prefix === prefix2 && s.suffix === suffix
          );
          if (existingNode) {
            nextNode = existingNode;
          } else {
            const next = createDynamicNode(
              SEGMENT_TYPE_PARAM,
              route.fullPath ?? route.from,
              actuallyCaseSensitive,
              prefix2,
              suffix
            );
            nextNode = next;
            next.depth = depth;
            next.parent = node;
            node.dynamic ??= [];
            node.dynamic.push(next);
          }
          break;
        }
        case SEGMENT_TYPE_OPTIONAL_PARAM: {
          const prefix_raw = path.substring(start2, segment[1]);
          const suffix_raw = path.substring(segment[4], end);
          const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
          const prefix2 = !prefix_raw ? void 0 : actuallyCaseSensitive ? prefix_raw : prefix_raw.toLowerCase();
          const suffix = !suffix_raw ? void 0 : actuallyCaseSensitive ? suffix_raw : suffix_raw.toLowerCase();
          const existingNode = node.optional?.find(
            (s) => s.caseSensitive === actuallyCaseSensitive && s.prefix === prefix2 && s.suffix === suffix
          );
          if (existingNode) {
            nextNode = existingNode;
          } else {
            const next = createDynamicNode(
              SEGMENT_TYPE_OPTIONAL_PARAM,
              route.fullPath ?? route.from,
              actuallyCaseSensitive,
              prefix2,
              suffix
            );
            nextNode = next;
            next.parent = node;
            next.depth = depth;
            node.optional ??= [];
            node.optional.push(next);
          }
          break;
        }
        case SEGMENT_TYPE_WILDCARD: {
          const prefix_raw = path.substring(start2, segment[1]);
          const suffix_raw = path.substring(segment[4], end);
          const actuallyCaseSensitive = caseSensitive && !!(prefix_raw || suffix_raw);
          const prefix2 = !prefix_raw ? void 0 : actuallyCaseSensitive ? prefix_raw : prefix_raw.toLowerCase();
          const suffix = !suffix_raw ? void 0 : actuallyCaseSensitive ? suffix_raw : suffix_raw.toLowerCase();
          const next = createDynamicNode(
            SEGMENT_TYPE_WILDCARD,
            route.fullPath ?? route.from,
            actuallyCaseSensitive,
            prefix2,
            suffix
          );
          nextNode = next;
          next.parent = node;
          next.depth = depth;
          node.wildcard ??= [];
          node.wildcard.push(next);
        }
      }
      node = nextNode;
    }
    const isLeaf = (route.path || !route.children) && !route.isRoot;
    if (isLeaf && path.endsWith("/")) {
      const indexNode = createStaticNode(
        route.fullPath ?? route.from
      );
      indexNode.kind = SEGMENT_TYPE_INDEX;
      indexNode.parent = node;
      depth++;
      indexNode.depth = depth;
      node.index = indexNode;
      node = indexNode;
    }
    if (isLeaf && !node.route) {
      node.route = route;
      node.fullPath = route.fullPath ?? route.from;
    }
  }
  if (route.children)
    for (const child of route.children) {
      parseSegments(
        defaultCaseSensitive,
        data,
        child,
        cursor,
        node,
        depth,
        onRoute
      );
    }
}
function sortDynamic(a, b2) {
  if (a.prefix && b2.prefix && a.prefix !== b2.prefix) {
    if (a.prefix.startsWith(b2.prefix)) return -1;
    if (b2.prefix.startsWith(a.prefix)) return 1;
  }
  if (a.suffix && b2.suffix && a.suffix !== b2.suffix) {
    if (a.suffix.endsWith(b2.suffix)) return -1;
    if (b2.suffix.endsWith(a.suffix)) return 1;
  }
  if (a.prefix && !b2.prefix) return -1;
  if (!a.prefix && b2.prefix) return 1;
  if (a.suffix && !b2.suffix) return -1;
  if (!a.suffix && b2.suffix) return 1;
  if (a.caseSensitive && !b2.caseSensitive) return -1;
  if (!a.caseSensitive && b2.caseSensitive) return 1;
  return 0;
}
function sortTreeNodes(node) {
  if (node.static) {
    for (const child of node.static.values()) {
      sortTreeNodes(child);
    }
  }
  if (node.staticInsensitive) {
    for (const child of node.staticInsensitive.values()) {
      sortTreeNodes(child);
    }
  }
  if (node.dynamic?.length) {
    node.dynamic.sort(sortDynamic);
    for (const child of node.dynamic) {
      sortTreeNodes(child);
    }
  }
  if (node.optional?.length) {
    node.optional.sort(sortDynamic);
    for (const child of node.optional) {
      sortTreeNodes(child);
    }
  }
  if (node.wildcard?.length) {
    node.wildcard.sort(sortDynamic);
    for (const child of node.wildcard) {
      sortTreeNodes(child);
    }
  }
}
function createStaticNode(fullPath) {
  return {
    kind: SEGMENT_TYPE_PATHNAME,
    depth: 0,
    index: null,
    static: null,
    staticInsensitive: null,
    dynamic: null,
    optional: null,
    wildcard: null,
    route: null,
    fullPath,
    parent: null
  };
}
function createDynamicNode(kind, fullPath, caseSensitive, prefix2, suffix) {
  return {
    kind,
    depth: 0,
    index: null,
    static: null,
    staticInsensitive: null,
    dynamic: null,
    optional: null,
    wildcard: null,
    route: null,
    fullPath,
    parent: null,
    caseSensitive,
    prefix: prefix2,
    suffix
  };
}
function processRouteMasks(routeList, processedTree) {
  const segmentTree = createStaticNode("/");
  const data = new Uint16Array(6);
  for (const route of routeList) {
    parseSegments(false, data, route, 1, segmentTree, 0);
  }
  sortTreeNodes(segmentTree);
  processedTree.masksTree = segmentTree;
  processedTree.flatCache = createLRUCache(1e3);
}
function findFlatMatch(path, processedTree) {
  path ||= "/";
  const cached = processedTree.flatCache.get(path);
  if (cached) return cached;
  const result = findMatch(path, processedTree.masksTree);
  processedTree.flatCache.set(path, result);
  return result;
}
function findSingleMatch(from, caseSensitive, fuzzy, path, processedTree) {
  from ||= "/";
  path ||= "/";
  const key = caseSensitive ? `case\0${from}` : from;
  let tree = processedTree.singleCache.get(key);
  if (!tree) {
    tree = createStaticNode("/");
    const data = new Uint16Array(6);
    parseSegments(caseSensitive, data, { from }, 1, tree, 0);
    processedTree.singleCache.set(key, tree);
  }
  return findMatch(path, tree, fuzzy);
}
function findRouteMatch(path, processedTree, fuzzy = false) {
  const key = fuzzy ? path : `nofuzz\0${path}`;
  const cached = processedTree.matchCache.get(key);
  if (cached !== void 0) return cached;
  path ||= "/";
  const result = findMatch(
    path,
    processedTree.segmentTree,
    fuzzy
  );
  if (result) result.branch = buildRouteBranch(result.route);
  processedTree.matchCache.set(key, result);
  return result;
}
function trimPathRight$1(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function processRouteTree(routeTree, caseSensitive = false, initRoute) {
  const segmentTree = createStaticNode(routeTree.fullPath);
  const data = new Uint16Array(6);
  const routesById = {};
  const routesByPath = {};
  let index = 0;
  parseSegments(caseSensitive, data, routeTree, 1, segmentTree, 0, (route) => {
    initRoute?.(route, index);
    invariant(
      !(route.id in routesById),
      `Duplicate routes found with id: ${String(route.id)}`
    );
    routesById[route.id] = route;
    if (index !== 0 && route.path) {
      const trimmedFullPath = trimPathRight$1(route.fullPath);
      if (!routesByPath[trimmedFullPath] || route.fullPath.endsWith("/")) {
        routesByPath[trimmedFullPath] = route;
      }
    }
    index++;
  });
  sortTreeNodes(segmentTree);
  const processedTree = {
    segmentTree,
    singleCache: createLRUCache(1e3),
    matchCache: createLRUCache(1e3),
    flatCache: null,
    masksTree: null
  };
  return {
    processedTree,
    routesById,
    routesByPath
  };
}
function findMatch(path, segmentTree, fuzzy = false) {
  const parts = path.split("/");
  const leaf = getNodeMatch(path, parts, segmentTree, fuzzy);
  if (!leaf) return null;
  const params = extractParams(path, parts, leaf);
  if ("**" in leaf) params["**"] = leaf["**"];
  const route = leaf.node.route;
  return {
    route,
    params
  };
}
function extractParams(path, parts, leaf) {
  const list = buildBranch(leaf.node);
  let nodeParts = null;
  const params = {};
  for (let partIndex = 0, nodeIndex = 0, pathIndex = 0; nodeIndex < list.length; partIndex++, nodeIndex++, pathIndex++) {
    const node = list[nodeIndex];
    const part = parts[partIndex];
    const currentPathIndex = pathIndex;
    if (part) pathIndex += part.length;
    if (node.kind === SEGMENT_TYPE_PARAM) {
      nodeParts ??= leaf.node.fullPath.split("/");
      const nodePart = nodeParts[nodeIndex];
      const preLength = node.prefix?.length ?? 0;
      const isCurlyBraced = nodePart.charCodeAt(preLength) === 123;
      if (isCurlyBraced) {
        const sufLength = node.suffix?.length ?? 0;
        const name = nodePart.substring(
          preLength + 2,
          nodePart.length - sufLength - 1
        );
        const value = part.substring(preLength, part.length - sufLength);
        params[name] = decodeURIComponent(value);
      } else {
        const name = nodePart.substring(1);
        params[name] = decodeURIComponent(part);
      }
    } else if (node.kind === SEGMENT_TYPE_OPTIONAL_PARAM) {
      if (leaf.skipped & 1 << nodeIndex) {
        partIndex--;
        continue;
      }
      nodeParts ??= leaf.node.fullPath.split("/");
      const nodePart = nodeParts[nodeIndex];
      const preLength = node.prefix?.length ?? 0;
      const sufLength = node.suffix?.length ?? 0;
      const name = nodePart.substring(
        preLength + 3,
        nodePart.length - sufLength - 1
      );
      const value = node.suffix || node.prefix ? part.substring(preLength, part.length - sufLength) : part;
      if (value) params[name] = decodeURIComponent(value);
    } else if (node.kind === SEGMENT_TYPE_WILDCARD) {
      const n = node;
      const value = path.substring(
        currentPathIndex + (n.prefix?.length ?? 0),
        path.length - (n.suffix?.length ?? 0)
      );
      const splat = decodeURIComponent(value);
      params["*"] = splat;
      params._splat = splat;
      break;
    }
  }
  return params;
}
function buildRouteBranch(route) {
  const list = [route];
  while (route.parentRoute) {
    route = route.parentRoute;
    list.push(route);
  }
  list.reverse();
  return list;
}
function buildBranch(node) {
  const list = Array(node.depth + 1);
  do {
    list[node.depth] = node;
    node = node.parent;
  } while (node);
  return list;
}
function getNodeMatch(path, parts, segmentTree, fuzzy) {
  if (path === "/" && segmentTree.index)
    return { node: segmentTree.index, skipped: 0 };
  const trailingSlash = !last(parts);
  const pathIsIndex = trailingSlash && path !== "/";
  const partsLength = parts.length - (trailingSlash ? 1 : 0);
  const stack = [
    {
      node: segmentTree,
      index: 1,
      skipped: 0,
      depth: 1,
      statics: 1,
      dynamics: 0,
      optionals: 0
    }
  ];
  let wildcardMatch = null;
  let bestFuzzy = null;
  let bestMatch = null;
  while (stack.length) {
    const frame = stack.pop();
    let { node, index, skipped, depth, statics, dynamics, optionals } = frame;
    if (fuzzy && node.route && node.kind !== SEGMENT_TYPE_INDEX && isFrameMoreSpecific(bestFuzzy, frame)) {
      bestFuzzy = frame;
    }
    const isBeyondPath = index === partsLength;
    if (isBeyondPath) {
      if (node.route && !pathIsIndex && isFrameMoreSpecific(bestMatch, frame)) {
        bestMatch = frame;
      }
      if (!node.optional && !node.wildcard && !node.index) continue;
    }
    const part = isBeyondPath ? void 0 : parts[index];
    let lowerPart;
    if (isBeyondPath && node.index) {
      const indexFrame = {
        node: node.index,
        index,
        skipped,
        depth: depth + 1,
        statics,
        dynamics,
        optionals
      };
      if (statics === partsLength && !dynamics && !optionals && !skipped) {
        return indexFrame;
      }
      if (isFrameMoreSpecific(bestMatch, indexFrame)) {
        bestMatch = indexFrame;
      }
    }
    if (node.wildcard && isFrameMoreSpecific(wildcardMatch, frame)) {
      for (const segment of node.wildcard) {
        const { prefix: prefix2, suffix } = segment;
        if (prefix2) {
          if (isBeyondPath) continue;
          const casePart = segment.caseSensitive ? part : lowerPart ??= part.toLowerCase();
          if (!casePart.startsWith(prefix2)) continue;
        }
        if (suffix) {
          if (isBeyondPath) continue;
          const end = parts.slice(index).join("/").slice(-suffix.length);
          const casePart = segment.caseSensitive ? end : end.toLowerCase();
          if (casePart !== suffix) continue;
        }
        wildcardMatch = {
          node: segment,
          index: partsLength,
          skipped,
          depth,
          statics,
          dynamics,
          optionals
        };
        break;
      }
    }
    if (node.optional) {
      const nextSkipped = skipped | 1 << depth;
      const nextDepth = depth + 1;
      for (let i = node.optional.length - 1; i >= 0; i--) {
        const segment = node.optional[i];
        stack.push({
          node: segment,
          index,
          skipped: nextSkipped,
          depth: nextDepth,
          statics,
          dynamics,
          optionals
        });
      }
      if (!isBeyondPath) {
        for (let i = node.optional.length - 1; i >= 0; i--) {
          const segment = node.optional[i];
          const { prefix: prefix2, suffix } = segment;
          if (prefix2 || suffix) {
            const casePart = segment.caseSensitive ? part : lowerPart ??= part.toLowerCase();
            if (prefix2 && !casePart.startsWith(prefix2)) continue;
            if (suffix && !casePart.endsWith(suffix)) continue;
          }
          stack.push({
            node: segment,
            index: index + 1,
            skipped,
            depth: nextDepth,
            statics,
            dynamics,
            optionals: optionals + 1
          });
        }
      }
    }
    if (!isBeyondPath && node.dynamic && part) {
      for (let i = node.dynamic.length - 1; i >= 0; i--) {
        const segment = node.dynamic[i];
        const { prefix: prefix2, suffix } = segment;
        if (prefix2 || suffix) {
          const casePart = segment.caseSensitive ? part : lowerPart ??= part.toLowerCase();
          if (prefix2 && !casePart.startsWith(prefix2)) continue;
          if (suffix && !casePart.endsWith(suffix)) continue;
        }
        stack.push({
          node: segment,
          index: index + 1,
          skipped,
          depth: depth + 1,
          statics,
          dynamics: dynamics + 1,
          optionals
        });
      }
    }
    if (!isBeyondPath && node.staticInsensitive) {
      const match = node.staticInsensitive.get(
        lowerPart ??= part.toLowerCase()
      );
      if (match) {
        stack.push({
          node: match,
          index: index + 1,
          skipped,
          depth: depth + 1,
          statics: statics + 1,
          dynamics,
          optionals
        });
      }
    }
    if (!isBeyondPath && node.static) {
      const match = node.static.get(part);
      if (match) {
        stack.push({
          node: match,
          index: index + 1,
          skipped,
          depth: depth + 1,
          statics: statics + 1,
          dynamics,
          optionals
        });
      }
    }
  }
  if (bestMatch && wildcardMatch) {
    return isFrameMoreSpecific(wildcardMatch, bestMatch) ? bestMatch : wildcardMatch;
  }
  if (bestMatch) return bestMatch;
  if (wildcardMatch) return wildcardMatch;
  if (fuzzy && bestFuzzy) {
    let sliceIndex = bestFuzzy.index;
    for (let i = 0; i < bestFuzzy.index; i++) {
      sliceIndex += parts[i].length;
    }
    const splat = sliceIndex === path.length ? "/" : path.slice(sliceIndex);
    return {
      node: bestFuzzy.node,
      skipped: bestFuzzy.skipped,
      "**": decodeURIComponent(splat)
    };
  }
  return null;
}
function isFrameMoreSpecific(prev, next) {
  if (!prev) return true;
  return next.statics > prev.statics || next.statics === prev.statics && (next.dynamics > prev.dynamics || next.dynamics === prev.dynamics && (next.optionals > prev.optionals || next.optionals === prev.optionals && ((next.node.kind === SEGMENT_TYPE_INDEX) > (prev.node.kind === SEGMENT_TYPE_INDEX) || next.node.kind === SEGMENT_TYPE_INDEX === (prev.node.kind === SEGMENT_TYPE_INDEX) && next.depth > prev.depth)));
}
function joinPaths(paths) {
  return cleanPath(
    paths.filter((val) => {
      return val !== void 0;
    }).join("/")
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  const len = path.length;
  return len > 1 && path[len - 1] === "/" ? path.replace(/\/{1,}$/, "") : path;
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
function removeTrailingSlash(value, basepath) {
  if (value?.endsWith("/") && value !== "/" && value !== `${basepath}/`) {
    return value.slice(0, -1);
  }
  return value;
}
function exactPathTest(pathName1, pathName2, basepath) {
  return removeTrailingSlash(pathName1, basepath) === removeTrailingSlash(pathName2, basepath);
}
function resolvePath({
  base,
  to: to2,
  trailingSlash = "never",
  cache
}) {
  const isAbsolute = to2.startsWith("/");
  const isBase = !isAbsolute && to2 === ".";
  let key;
  if (cache) {
    key = isAbsolute ? to2 : isBase ? base : base + "\0" + to2;
    const cached = cache.get(key);
    if (cached) return cached;
  }
  let baseSegments;
  if (isBase) {
    baseSegments = base.split("/");
  } else if (isAbsolute) {
    baseSegments = to2.split("/");
  } else {
    baseSegments = base.split("/");
    while (baseSegments.length > 1 && last(baseSegments) === "") {
      baseSegments.pop();
    }
    const toSegments = to2.split("/");
    for (let index = 0, length = toSegments.length; index < length; index++) {
      const value = toSegments[index];
      if (value === "") {
        if (!index) {
          baseSegments = [value];
        } else if (index === length - 1) {
          baseSegments.push(value);
        } else ;
      } else if (value === "..") {
        baseSegments.pop();
      } else if (value === ".") ;
      else {
        baseSegments.push(value);
      }
    }
  }
  if (baseSegments.length > 1) {
    if (last(baseSegments) === "") {
      if (trailingSlash === "never") {
        baseSegments.pop();
      }
    } else if (trailingSlash === "always") {
      baseSegments.push("");
    }
  }
  let segment;
  let joined = "";
  for (let i = 0; i < baseSegments.length; i++) {
    if (i > 0) joined += "/";
    const part = baseSegments[i];
    if (!part) continue;
    segment = parseSegment(part, 0, segment);
    const kind = segment[0];
    if (kind === SEGMENT_TYPE_PATHNAME) {
      joined += part;
      continue;
    }
    const end = segment[5];
    const prefix2 = part.substring(0, segment[1]);
    const suffix = part.substring(segment[4], end);
    const value = part.substring(segment[2], segment[3]);
    if (kind === SEGMENT_TYPE_PARAM) {
      joined += prefix2 || suffix ? `${prefix2}{$${value}}${suffix}` : `$${value}`;
    } else if (kind === SEGMENT_TYPE_WILDCARD) {
      joined += prefix2 || suffix ? `${prefix2}{$}${suffix}` : "$";
    } else {
      joined += `${prefix2}{-$${value}}${suffix}`;
    }
  }
  joined = cleanPath(joined);
  const result = joined || "/";
  if (key && cache) cache.set(key, result);
  return result;
}
function encodeParam(key, params, decodeCharMap) {
  const value = params[key];
  if (typeof value !== "string") return value;
  if (key === "_splat") {
    return encodeURI(value);
  } else {
    return encodePathParam(value, decodeCharMap);
  }
}
function interpolatePath({
  path,
  params,
  decodeCharMap
}) {
  let isMissingParams = false;
  const usedParams = {};
  if (!path || path === "/")
    return { interpolatedPath: "/", usedParams, isMissingParams };
  if (!path.includes("$"))
    return { interpolatedPath: path, usedParams, isMissingParams };
  const length = path.length;
  let cursor = 0;
  let segment;
  let joined = "";
  while (cursor < length) {
    const start = cursor;
    segment = parseSegment(path, start, segment);
    const end = segment[5];
    cursor = end + 1;
    if (start === end) continue;
    const kind = segment[0];
    if (kind === SEGMENT_TYPE_PATHNAME) {
      joined += "/" + path.substring(start, end);
      continue;
    }
    if (kind === SEGMENT_TYPE_WILDCARD) {
      const splat = params._splat;
      usedParams._splat = splat;
      usedParams["*"] = splat;
      const prefix2 = path.substring(start, segment[1]);
      const suffix = path.substring(segment[4], end);
      if (!splat) {
        isMissingParams = true;
        if (prefix2 || suffix) {
          joined += "/" + prefix2 + suffix;
        }
        continue;
      }
      const value = encodeParam("_splat", params, decodeCharMap);
      joined += "/" + prefix2 + value + suffix;
      continue;
    }
    if (kind === SEGMENT_TYPE_PARAM) {
      const key = path.substring(segment[2], segment[3]);
      if (!isMissingParams && !(key in params)) {
        isMissingParams = true;
      }
      usedParams[key] = params[key];
      const prefix2 = path.substring(start, segment[1]);
      const suffix = path.substring(segment[4], end);
      const value = encodeParam(key, params, decodeCharMap) ?? "undefined";
      joined += "/" + prefix2 + value + suffix;
      continue;
    }
    if (kind === SEGMENT_TYPE_OPTIONAL_PARAM) {
      const key = path.substring(segment[2], segment[3]);
      const valueRaw = params[key];
      if (valueRaw == null) continue;
      usedParams[key] = valueRaw;
      const prefix2 = path.substring(start, segment[1]);
      const suffix = path.substring(segment[4], end);
      const value = encodeParam(key, params, decodeCharMap) ?? "";
      joined += "/" + prefix2 + value + suffix;
      continue;
    }
  }
  if (path.endsWith("/")) joined += "/";
  const interpolatedPath = joined || "/";
  return { usedParams, interpolatedPath, isMissingParams };
}
function encodePathParam(value, decodeCharMap) {
  let encoded = encodeURIComponent(value);
  if (decodeCharMap) {
    for (const [encodedChar, char] of decodeCharMap) {
      encoded = encoded.replaceAll(encodedChar, char);
    }
  }
  return encoded;
}
function isNotFound(obj) {
  return !!obj?.isNotFound;
}
function getSafeSessionStorage() {
  try {
    if (typeof window !== "undefined" && typeof window.sessionStorage === "object") {
      return window.sessionStorage;
    }
  } catch {
  }
  return void 0;
}
const storageKey = "tsr-scroll-restoration-v1_3";
const throttle = (fn2, wait) => {
  let timeout;
  return (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn2(...args);
        timeout = null;
      }, wait);
    }
  };
};
function createScrollRestorationCache() {
  const safeSessionStorage = getSafeSessionStorage();
  if (!safeSessionStorage) {
    return null;
  }
  const persistedState = safeSessionStorage.getItem(storageKey);
  let state = persistedState ? JSON.parse(persistedState) : {};
  return {
    state,
    // This setter is simply to make sure that we set the sessionStorage right
    // after the state is updated. It doesn't necessarily need to be a functional
    // update.
    set: (updater) => (state = functionalUpdate(updater, state) || state, safeSessionStorage.setItem(storageKey, JSON.stringify(state)))
  };
}
const scrollRestorationCache = createScrollRestorationCache();
const defaultGetScrollRestorationKey = (location) => {
  return location.state.__TSR_key || location.href;
};
function getCssSelector(el) {
  const path = [];
  let parent;
  while (parent = el.parentNode) {
    path.push(
      `${el.tagName}:nth-child(${Array.prototype.indexOf.call(parent.children, el) + 1})`
    );
    el = parent;
  }
  return `${path.reverse().join(" > ")}`.toLowerCase();
}
let ignoreScroll = false;
function restoreScroll({
  storageKey: storageKey2,
  key,
  behavior,
  shouldScrollRestoration,
  scrollToTopSelectors,
  location
}) {
  let byKey;
  try {
    byKey = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
  } catch (error) {
    console.error(error);
    return;
  }
  const resolvedKey = key || window.history.state?.__TSR_key;
  const elementEntries = byKey[resolvedKey];
  ignoreScroll = true;
  scroll: {
    if (shouldScrollRestoration && elementEntries && Object.keys(elementEntries).length > 0) {
      for (const elementSelector in elementEntries) {
        const entry = elementEntries[elementSelector];
        if (elementSelector === "window") {
          window.scrollTo({
            top: entry.scrollY,
            left: entry.scrollX,
            behavior
          });
        } else if (elementSelector) {
          const element = document.querySelector(elementSelector);
          if (element) {
            element.scrollLeft = entry.scrollX;
            element.scrollTop = entry.scrollY;
          }
        }
      }
      break scroll;
    }
    const hash = (location ?? window.location).hash.split("#", 2)[1];
    if (hash) {
      const hashScrollIntoViewOptions = window.history.state?.__hashScrollIntoViewOptions ?? true;
      if (hashScrollIntoViewOptions) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView(hashScrollIntoViewOptions);
        }
      }
      break scroll;
    }
    const scrollOptions = { top: 0, left: 0, behavior };
    window.scrollTo(scrollOptions);
    if (scrollToTopSelectors) {
      for (const selector of scrollToTopSelectors) {
        if (selector === "window") continue;
        const element = typeof selector === "function" ? selector() : document.querySelector(selector);
        if (element) element.scrollTo(scrollOptions);
      }
    }
  }
  ignoreScroll = false;
}
function setupScrollRestoration(router, force) {
  if (!scrollRestorationCache && !router.isServer) {
    return;
  }
  const shouldScrollRestoration = router.options.scrollRestoration ?? false;
  if (shouldScrollRestoration) {
    router.isScrollRestoring = true;
  }
  if (router.isServer || router.isScrollRestorationSetup || !scrollRestorationCache) {
    return;
  }
  router.isScrollRestorationSetup = true;
  ignoreScroll = false;
  const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  window.history.scrollRestoration = "manual";
  const onScroll = (event) => {
    if (ignoreScroll || !router.isScrollRestoring) {
      return;
    }
    let elementSelector = "";
    if (event.target === document || event.target === window) {
      elementSelector = "window";
    } else {
      const attrId = event.target.getAttribute(
        "data-scroll-restoration-id"
      );
      if (attrId) {
        elementSelector = `[data-scroll-restoration-id="${attrId}"]`;
      } else {
        elementSelector = getCssSelector(event.target);
      }
    }
    const restoreKey = getKey(router.state.location);
    scrollRestorationCache.set((state) => {
      const keyEntry = state[restoreKey] ||= {};
      const elementEntry = keyEntry[elementSelector] ||= {};
      if (elementSelector === "window") {
        elementEntry.scrollX = window.scrollX || 0;
        elementEntry.scrollY = window.scrollY || 0;
      } else if (elementSelector) {
        const element = document.querySelector(elementSelector);
        if (element) {
          elementEntry.scrollX = element.scrollLeft || 0;
          elementEntry.scrollY = element.scrollTop || 0;
        }
      }
      return state;
    });
  };
  if (typeof document !== "undefined") {
    document.addEventListener("scroll", throttle(onScroll, 100), true);
  }
  router.subscribe("onRendered", (event) => {
    const cacheKey = getKey(event.toLocation);
    if (!router.resetNextScroll) {
      router.resetNextScroll = true;
      return;
    }
    if (typeof router.options.scrollRestoration === "function") {
      const shouldRestore = router.options.scrollRestoration({
        location: router.latestLocation
      });
      if (!shouldRestore) {
        return;
      }
    }
    restoreScroll({
      storageKey,
      key: cacheKey,
      behavior: router.options.scrollRestorationBehavior,
      shouldScrollRestoration: router.isScrollRestoring,
      scrollToTopSelectors: router.options.scrollToTopSelectors,
      location: router.history.location
    });
    if (router.isScrollRestoring) {
      scrollRestorationCache.set((state) => {
        state[cacheKey] ||= {};
        return state;
      });
    }
  });
}
function handleHashScroll(router) {
  if (typeof document !== "undefined" && document.querySelector) {
    const hashScrollIntoViewOptions = router.state.location.state.__hashScrollIntoViewOptions ?? true;
    if (hashScrollIntoViewOptions && router.state.location.hash !== "") {
      const el = document.getElementById(router.state.location.hash);
      if (el) {
        el.scrollIntoView(hashScrollIntoViewOptions);
      }
    }
  }
}
function encode(obj, stringify = String) {
  const result = new URLSearchParams();
  for (const key in obj) {
    const val = obj[key];
    if (val !== void 0) {
      result.set(key, stringify(val));
    }
  }
  return result.toString();
}
function toValue(str) {
  if (!str) return "";
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str) {
  const searchParams = new URLSearchParams(str);
  const result = {};
  for (const [key, value] of searchParams.entries()) {
    const previousValue = result[key];
    if (previousValue == null) {
      result[key] = toValue(value);
    } else if (Array.isArray(previousValue)) {
      previousValue.push(toValue(value));
    } else {
      result[key] = [previousValue, toValue(value)];
    }
  }
  return result;
}
const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(
  JSON.stringify,
  JSON.parse
);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr[0] === "?") {
      searchStr = searchStr.substring(1);
    }
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") {
        try {
          query[key] = parser(value);
        } catch (_err) {
        }
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  const hasParser = typeof parser === "function";
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) {
      try {
        return stringify(val);
      } catch (_err) {
      }
    } else if (hasParser && typeof val === "string") {
      try {
        parser(val);
        return stringify(val);
      } catch (_err) {
      }
    }
    return val;
  }
  return (search) => {
    const searchStr = encode(search, stringifyValue);
    return searchStr ? `?${searchStr}` : "";
  };
}
const rootRouteId = "__root__";
function redirect(opts) {
  opts.statusCode = opts.statusCode || opts.code || 307;
  if (!opts.reloadDocument && typeof opts.href === "string") {
    try {
      new URL(opts.href);
      opts.reloadDocument = true;
    } catch {
    }
  }
  const headers = new Headers(opts.headers);
  if (opts.href && headers.get("Location") === null) {
    headers.set("Location", opts.href);
  }
  const response = new Response(null, {
    status: opts.statusCode,
    headers
  });
  response.options = opts;
  if (opts.throw) {
    throw response;
  }
  return response;
}
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function isResolvedRedirect(obj) {
  return isRedirect(obj) && !!obj.options.href;
}
const triggerOnReady = (inner) => {
  if (!inner.rendered) {
    inner.rendered = true;
    return inner.onReady?.();
  }
};
const resolvePreload = (inner, matchId) => {
  return !!(inner.preload && !inner.router.state.matches.some((d) => d.id === matchId));
};
const buildMatchContext = (inner, index, includeCurrentMatch = true) => {
  const context = {
    ...inner.router.options.context ?? {}
  };
  const end = includeCurrentMatch ? index : index - 1;
  for (let i = 0; i <= end; i++) {
    const innerMatch = inner.matches[i];
    if (!innerMatch) continue;
    const m2 = inner.router.getMatch(innerMatch.id);
    if (!m2) continue;
    Object.assign(context, m2.__routeContext, m2.__beforeLoadContext);
  }
  return context;
};
const _handleNotFound = (inner, err) => {
  const routeCursor = inner.router.routesById[err.routeId ?? ""] ?? inner.router.routeTree;
  if (!routeCursor.options.notFoundComponent && inner.router.options?.defaultNotFoundComponent) {
    routeCursor.options.notFoundComponent = inner.router.options.defaultNotFoundComponent;
  }
  invariant(
    routeCursor.options.notFoundComponent,
    "No notFoundComponent found. Please set a notFoundComponent on your route or provide a defaultNotFoundComponent to the router."
  );
  const matchForRoute = inner.matches.find((m2) => m2.routeId === routeCursor.id);
  invariant(matchForRoute, "Could not find match for route: " + routeCursor.id);
  inner.updateMatch(matchForRoute.id, (prev) => ({
    ...prev,
    status: "notFound",
    error: err,
    isFetching: false
  }));
  if (err.routerCode === "BEFORE_LOAD" && routeCursor.parentRoute) {
    err.routeId = routeCursor.parentRoute.id;
    _handleNotFound(inner, err);
  }
};
const handleRedirectAndNotFound = (inner, match, err) => {
  if (!isRedirect(err) && !isNotFound(err)) return;
  if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) {
    throw err;
  }
  if (match) {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    match._nonReactive.loaderPromise = void 0;
    const status = isRedirect(err) ? "redirected" : "notFound";
    match._nonReactive.error = err;
    inner.updateMatch(match.id, (prev) => ({
      ...prev,
      status,
      isFetching: false,
      error: err
    }));
    if (isNotFound(err) && !err.routeId) {
      err.routeId = match.routeId;
    }
    match._nonReactive.loadPromise?.resolve();
  }
  if (isRedirect(err)) {
    inner.rendered = true;
    err.options._fromLocation = inner.location;
    err.redirectHandled = true;
    err = inner.router.resolveRedirect(err);
    throw err;
  } else {
    _handleNotFound(inner, err);
    throw err;
  }
};
const shouldSkipLoader = (inner, matchId) => {
  const match = inner.router.getMatch(matchId);
  if (!inner.router.isServer && match._nonReactive.dehydrated) {
    return true;
  }
  if (inner.router.isServer && match.ssr === false) {
    return true;
  }
  return false;
};
const handleSerialError = (inner, index, err, routerCode) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  if (err instanceof Promise) {
    throw err;
  }
  err.routerCode = routerCode;
  inner.firstBadMatchIndex ??= index;
  handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  try {
    route.options.onError?.(err);
  } catch (errorHandlerErr) {
    err = errorHandlerErr;
    handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  }
  inner.updateMatch(matchId, (prev) => {
    prev._nonReactive.beforeLoadPromise?.resolve();
    prev._nonReactive.beforeLoadPromise = void 0;
    prev._nonReactive.loadPromise?.resolve();
    return {
      ...prev,
      error: err,
      status: "error",
      isFetching: false,
      updatedAt: Date.now(),
      abortController: new AbortController()
    };
  });
};
const isBeforeLoadSsr = (inner, matchId, index, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  if (inner.router.isShell()) {
    existingMatch.ssr = route.id === rootRouteId;
    return;
  }
  if (parentMatch?.ssr === false) {
    existingMatch.ssr = false;
    return;
  }
  const parentOverride = (tempSsr2) => {
    if (tempSsr2 === true && parentMatch?.ssr === "data-only") {
      return "data-only";
    }
    return tempSsr2;
  };
  const defaultSsr = inner.router.options.defaultSsr ?? true;
  if (route.options.ssr === void 0) {
    existingMatch.ssr = parentOverride(defaultSsr);
    return;
  }
  if (typeof route.options.ssr !== "function") {
    existingMatch.ssr = parentOverride(route.options.ssr);
    return;
  }
  const { search, params } = existingMatch;
  const ssrFnContext = {
    search: makeMaybe(search, existingMatch.searchError),
    params: makeMaybe(params, existingMatch.paramsError),
    location: inner.location,
    matches: inner.matches.map((match) => ({
      index: match.index,
      pathname: match.pathname,
      fullPath: match.fullPath,
      staticData: match.staticData,
      id: match.id,
      routeId: match.routeId,
      search: makeMaybe(match.search, match.searchError),
      params: makeMaybe(match.params, match.paramsError),
      ssr: match.ssr
    }))
  };
  const tempSsr = route.options.ssr(ssrFnContext);
  if (isPromise(tempSsr)) {
    return tempSsr.then((ssr) => {
      existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
    });
  }
  existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
  return;
};
const setupPendingTimeout = (inner, matchId, route, match) => {
  if (match._nonReactive.pendingTimeout !== void 0) return;
  const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
  const shouldPending = !!(inner.onReady && !inner.router.isServer && !resolvePreload(inner, matchId) && (route.options.loader || route.options.beforeLoad || routeNeedsPreload(route)) && typeof pendingMs === "number" && pendingMs !== Infinity && (route.options.pendingComponent ?? inner.router.options?.defaultPendingComponent));
  if (shouldPending) {
    const pendingTimeout = setTimeout(() => {
      triggerOnReady(inner);
    }, pendingMs);
    match._nonReactive.pendingTimeout = pendingTimeout;
  }
};
const preBeforeLoadSetup = (inner, matchId, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise)
    return;
  setupPendingTimeout(inner, matchId, route, existingMatch);
  const then = () => {
    const match = inner.router.getMatch(matchId);
    if (match.preload && (match.status === "redirected" || match.status === "notFound")) {
      handleRedirectAndNotFound(inner, match, match.error);
    }
  };
  return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
const executeBeforeLoad = (inner, matchId, index, route) => {
  const match = inner.router.getMatch(matchId);
  const prevLoadPromise = match._nonReactive.loadPromise;
  match._nonReactive.loadPromise = createControlledPromise(() => {
    prevLoadPromise?.resolve();
  });
  const { paramsError, searchError } = match;
  if (paramsError) {
    handleSerialError(inner, index, paramsError, "PARSE_PARAMS");
  }
  if (searchError) {
    handleSerialError(inner, index, searchError, "VALIDATE_SEARCH");
  }
  setupPendingTimeout(inner, matchId, route, match);
  const abortController = new AbortController();
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  parentMatch?.context ?? inner.router.options.context ?? void 0;
  let isPending = false;
  const pending = () => {
    if (isPending) return;
    isPending = true;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: "beforeLoad",
      fetchCount: prev.fetchCount + 1,
      abortController
      // Note: We intentionally don't update context here.
      // Context should only be updated after beforeLoad resolves to avoid
      // components seeing incomplete context during async beforeLoad execution.
    }));
  };
  const resolve = () => {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: false
    }));
  };
  if (!route.options.beforeLoad) {
    batch(() => {
      pending();
      resolve();
    });
    return;
  }
  match._nonReactive.beforeLoadPromise = createControlledPromise();
  const context = {
    ...buildMatchContext(inner, index, false),
    ...match.__routeContext
  };
  const { search, params, cause } = match;
  const preload = resolvePreload(inner, matchId);
  const beforeLoadFnContext = {
    search,
    abortController,
    params,
    preload,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    buildLocation: inner.router.buildLocation,
    cause: preload ? "preload" : cause,
    matches: inner.matches,
    ...inner.router.options.additionalContext
  };
  const updateContext = (beforeLoadContext2) => {
    if (beforeLoadContext2 === void 0) {
      batch(() => {
        pending();
        resolve();
      });
      return;
    }
    if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
      pending();
      handleSerialError(inner, index, beforeLoadContext2, "BEFORE_LOAD");
    }
    batch(() => {
      pending();
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        __beforeLoadContext: beforeLoadContext2
      }));
      resolve();
    });
  };
  let beforeLoadContext;
  try {
    beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
    if (isPromise(beforeLoadContext)) {
      pending();
      return beforeLoadContext.catch((err) => {
        handleSerialError(inner, index, err, "BEFORE_LOAD");
      }).then(updateContext);
    }
  } catch (err) {
    pending();
    handleSerialError(inner, index, err, "BEFORE_LOAD");
  }
  updateContext(beforeLoadContext);
  return;
};
const handleBeforeLoad = (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  const serverSsr = () => {
    if (inner.router.isServer) {
      const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
      if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
    }
    return queueExecution();
  };
  const execute = () => executeBeforeLoad(inner, matchId, index, route);
  const queueExecution = () => {
    if (shouldSkipLoader(inner, matchId)) return;
    const result = preBeforeLoadSetup(inner, matchId, route);
    return isPromise(result) ? result.then(execute) : execute();
  };
  return serverSsr();
};
const executeHead = (inner, matchId, route) => {
  const match = inner.router.getMatch(matchId);
  if (!match) {
    return;
  }
  if (!route.options.head && !route.options.scripts && !route.options.headers) {
    return;
  }
  const assetContext = {
    matches: inner.matches,
    match,
    params: match.params,
    loaderData: match.loaderData
  };
  return Promise.all([
    route.options.head?.(assetContext),
    route.options.scripts?.(assetContext),
    route.options.headers?.(assetContext)
  ]).then(([headFnContent, scripts, headers]) => {
    const meta = headFnContent?.meta;
    const links = headFnContent?.links;
    const headScripts = headFnContent?.scripts;
    const styles = headFnContent?.styles;
    return {
      meta,
      links,
      headScripts,
      headers,
      scripts,
      styles
    };
  });
};
const getLoaderContext = (inner, matchId, index, route) => {
  const parentMatchPromise = inner.matchPromises[index - 1];
  const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
  const context = buildMatchContext(inner, index);
  const preload = resolvePreload(inner, matchId);
  return {
    params,
    deps: loaderDeps,
    preload: !!preload,
    parentMatchPromise,
    abortController,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    cause: preload ? "preload" : cause,
    route,
    ...inner.router.options.additionalContext
  };
};
const runLoader = async (inner, matchId, index, route) => {
  try {
    const match = inner.router.getMatch(matchId);
    try {
      if (!inner.router.isServer || match.ssr === true) {
        loadRouteChunk(route);
      }
      const loaderResult = route.options.loader?.(
        getLoaderContext(inner, matchId, index, route)
      );
      const loaderResultIsPromise = route.options.loader && isPromise(loaderResult);
      const willLoadSomething = !!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise);
      if (willLoadSomething) {
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          isFetching: "loader"
        }));
      }
      if (route.options.loader) {
        const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
        handleRedirectAndNotFound(
          inner,
          inner.router.getMatch(matchId),
          loaderData
        );
        if (loaderData !== void 0) {
          inner.updateMatch(matchId, (prev) => ({
            ...prev,
            loaderData
          }));
        }
      }
      if (route._lazyPromise) await route._lazyPromise;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (route._componentsPromise) await route._componentsPromise;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error: void 0,
        status: "success",
        isFetching: false,
        updatedAt: Date.now()
      }));
    } catch (e) {
      let error = e;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (isNotFound(e)) {
        await route.options.notFoundComponent?.preload?.();
      }
      handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
      try {
        route.options.onError?.(e);
      } catch (onErrorError) {
        error = onErrorError;
        handleRedirectAndNotFound(
          inner,
          inner.router.getMatch(matchId),
          onErrorError
        );
      }
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error,
        status: "error",
        isFetching: false
      }));
    }
  } catch (err) {
    const match = inner.router.getMatch(matchId);
    if (match) {
      match._nonReactive.loaderPromise = void 0;
    }
    handleRedirectAndNotFound(inner, match, err);
  }
};
const loadRouteMatch = async (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  let loaderShouldRunAsync = false;
  let loaderIsRunningAsync = false;
  const route = inner.router.looseRoutesById[routeId];
  const commitContext = () => {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      context: buildMatchContext(inner, index)
    }));
  };
  if (shouldSkipLoader(inner, matchId)) {
    if (inner.router.isServer) {
      return inner.router.getMatch(matchId);
    }
  } else {
    const prevMatch = inner.router.getMatch(matchId);
    if (prevMatch._nonReactive.loaderPromise) {
      if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload) {
        return prevMatch;
      }
      await prevMatch._nonReactive.loaderPromise;
      const match2 = inner.router.getMatch(matchId);
      const error = match2._nonReactive.error || match2.error;
      if (error) {
        handleRedirectAndNotFound(inner, match2, error);
      }
    } else {
      const age = Date.now() - prevMatch.updatedAt;
      const preload = resolvePreload(inner, matchId);
      const staleAge = preload ? route.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
      const shouldReloadOption = route.options.shouldReload;
      const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchId, index, route)) : shouldReloadOption;
      const nextPreload = !!preload && !inner.router.state.matches.some((d) => d.id === matchId);
      const match2 = inner.router.getMatch(matchId);
      match2._nonReactive.loaderPromise = createControlledPromise();
      if (nextPreload !== match2.preload) {
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          preload: nextPreload
        }));
      }
      const { status, invalid } = match2;
      loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? age > staleAge));
      if (preload && route.options.preload === false) ;
      else if (loaderShouldRunAsync && !inner.sync) {
        loaderIsRunningAsync = true;
        (async () => {
          try {
            await runLoader(inner, matchId, index, route);
            commitContext();
            const match3 = inner.router.getMatch(matchId);
            match3._nonReactive.loaderPromise?.resolve();
            match3._nonReactive.loadPromise?.resolve();
            match3._nonReactive.loaderPromise = void 0;
          } catch (err) {
            if (isRedirect(err)) {
              await inner.router.navigate(err.options);
            }
          }
        })();
      } else if (status !== "success" || loaderShouldRunAsync && inner.sync) {
        await runLoader(inner, matchId, index, route);
      }
    }
  }
  const match = inner.router.getMatch(matchId);
  if (!loaderIsRunningAsync) {
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.loadPromise?.resolve();
  }
  clearTimeout(match._nonReactive.pendingTimeout);
  match._nonReactive.pendingTimeout = void 0;
  if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
  match._nonReactive.dehydrated = void 0;
  if (!loaderIsRunningAsync) {
    commitContext();
  }
  const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
  if (nextIsFetching !== match.isFetching || match.invalid !== false) {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: nextIsFetching,
      invalid: false
    }));
    return inner.router.getMatch(matchId);
  } else {
    return match;
  }
};
async function loadMatches(arg) {
  const inner = Object.assign(arg, {
    matchPromises: []
  });
  if (!inner.router.isServer && inner.router.state.matches.some((d) => d._forcePending)) {
    triggerOnReady(inner);
  }
  try {
    for (let i = 0; i < inner.matches.length; i++) {
      const beforeLoad = handleBeforeLoad(inner, i);
      if (isPromise(beforeLoad)) await beforeLoad;
    }
    const max = inner.firstBadMatchIndex ?? inner.matches.length;
    for (let i = 0; i < max; i++) {
      inner.matchPromises.push(loadRouteMatch(inner, i));
    }
    const results = await Promise.allSettled(inner.matchPromises);
    const failures = results.filter(
      (result) => result.status === "rejected"
    ).map((result) => result.reason);
    let firstNotFound;
    for (const err of failures) {
      if (isRedirect(err)) {
        throw err;
      }
      if (!firstNotFound && isNotFound(err)) {
        firstNotFound = err;
      }
    }
    for (const match of inner.matches) {
      const { id: matchId, routeId } = match;
      const route = inner.router.looseRoutesById[routeId];
      try {
        const headResult = executeHead(inner, matchId, route);
        if (headResult) {
          const head = await headResult;
          inner.updateMatch(matchId, (prev) => ({
            ...prev,
            ...head
          }));
        }
      } catch (err) {
        console.error(`Error executing head for route ${routeId}:`, err);
      }
    }
    if (firstNotFound) {
      throw firstNotFound;
    }
    const readyPromise = triggerOnReady(inner);
    if (isPromise(readyPromise)) await readyPromise;
  } catch (err) {
    if (isNotFound(err) && !inner.preload) {
      const readyPromise = triggerOnReady(inner);
      if (isPromise(readyPromise)) await readyPromise;
      throw err;
    }
    if (isRedirect(err)) {
      throw err;
    }
  }
  return inner.matches;
}
async function loadRouteChunk(route) {
  if (!route._lazyLoaded && route._lazyPromise === void 0) {
    if (route.lazyFn) {
      route._lazyPromise = route.lazyFn().then((lazyRoute) => {
        const { id: _id, ...options } = lazyRoute.options;
        Object.assign(route.options, options);
        route._lazyLoaded = true;
        route._lazyPromise = void 0;
      });
    } else {
      route._lazyLoaded = true;
    }
  }
  if (!route._componentsLoaded && route._componentsPromise === void 0) {
    const loadComponents = () => {
      const preloads = [];
      for (const type of componentTypes) {
        const preload = route.options[type]?.preload;
        if (preload) preloads.push(preload());
      }
      if (preloads.length)
        return Promise.all(preloads).then(() => {
          route._componentsLoaded = true;
          route._componentsPromise = void 0;
        });
      route._componentsLoaded = true;
      route._componentsPromise = void 0;
      return;
    };
    route._componentsPromise = route._lazyPromise ? route._lazyPromise.then(loadComponents) : loadComponents();
  }
  return route._componentsPromise;
}
function makeMaybe(value, error) {
  if (error) {
    return { status: "error", error };
  }
  return { status: "success", value };
}
function routeNeedsPreload(route) {
  for (const componentType of componentTypes) {
    if (route.options[componentType]?.preload) {
      return true;
    }
  }
  return false;
}
const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function composeRewrites(rewrites) {
  return {
    input: ({ url }) => {
      for (const rewrite of rewrites) {
        url = executeRewriteInput(rewrite, url);
      }
      return url;
    },
    output: ({ url }) => {
      for (let i = rewrites.length - 1; i >= 0; i--) {
        url = executeRewriteOutput(rewrites[i], url);
      }
      return url;
    }
  };
}
function rewriteBasepath(opts) {
  const trimmedBasepath = trimPath(opts.basepath);
  const normalizedBasepath = `/${trimmedBasepath}`;
  const normalizedBasepathWithSlash = `${normalizedBasepath}/`;
  const checkBasepath = opts.caseSensitive ? normalizedBasepath : normalizedBasepath.toLowerCase();
  const checkBasepathWithSlash = opts.caseSensitive ? normalizedBasepathWithSlash : normalizedBasepathWithSlash.toLowerCase();
  return {
    input: ({ url }) => {
      const pathname = opts.caseSensitive ? url.pathname : url.pathname.toLowerCase();
      if (pathname === checkBasepath) {
        url.pathname = "/";
      } else if (pathname.startsWith(checkBasepathWithSlash)) {
        url.pathname = url.pathname.slice(normalizedBasepath.length);
      }
      return url;
    },
    output: ({ url }) => {
      url.pathname = joinPaths(["/", trimmedBasepath, url.pathname]);
      return url;
    }
  };
}
function executeRewriteInput(rewrite, url) {
  const res = rewrite?.input?.({ url });
  if (res) {
    if (typeof res === "string") {
      return new URL(res);
    } else if (res instanceof URL) {
      return res;
    }
  }
  return url;
}
function executeRewriteOutput(rewrite, url) {
  const res = rewrite?.output?.({ url });
  if (res) {
    if (typeof res === "string") {
      return new URL(res);
    } else if (res instanceof URL) {
      return res;
    }
  }
  return url;
}
function getLocationChangeInfo(routerState) {
  const fromLocation = routerState.resolvedLocation;
  const toLocation = routerState.location;
  const pathChanged = fromLocation?.pathname !== toLocation.pathname;
  const hrefChanged = fromLocation?.href !== toLocation.href;
  const hashChanged = fromLocation?.hash !== toLocation.hash;
  return { fromLocation, toLocation, pathChanged, hrefChanged, hashChanged };
}
class RouterCore {
  /**
   * @deprecated Use the `createRouter` function instead
   */
  constructor(options) {
    this.tempLocationKey = `${Math.round(
      Math.random() * 1e7
    )}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.isScrollRestoring = false;
    this.isScrollRestorationSetup = false;
    this.startTransition = (fn2) => fn2();
    this.update = (newOptions) => {
      if (newOptions.notFoundRoute) {
        console.warn(
          "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info."
        );
      }
      const prevOptions = this.options;
      const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
      const basepathWasUnset = this.basepath === void 0;
      const prevRewriteOption = prevOptions?.rewrite;
      this.options = {
        ...prevOptions,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters ? new Map(
        this.options.pathParamsAllowedCharacters.map((char) => [
          encodeURIComponent(char),
          char
        ])
      ) : void 0;
      if (!this.history || this.options.history && this.options.history !== this.history) {
        if (!this.options.history) {
          if (!this.isServer) {
            this.history = createBrowserHistory();
          }
        } else {
          this.history = this.options.history;
        }
      }
      this.origin = this.options.origin;
      if (!this.origin) {
        if (!this.isServer && window?.origin && window.origin !== "null") {
          this.origin = window.origin;
        } else {
          this.origin = "http://localhost";
        }
      }
      if (this.history) {
        this.updateLatestLocation();
      }
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        this.buildRouteTree();
      }
      if (!this.__store && this.latestLocation) {
        this.__store = new Store(getInitialRouterState(this.latestLocation), {
          onUpdate: () => {
            this.__store.state = {
              ...this.state,
              cachedMatches: this.state.cachedMatches.filter(
                (d) => !["redirected"].includes(d.status)
              )
            };
          }
        });
        setupScrollRestoration(this);
      }
      let needsLocationUpdate = false;
      const nextBasepath = this.options.basepath ?? "/";
      const nextRewriteOption = this.options.rewrite;
      const basepathChanged = basepathWasUnset || prevBasepath !== nextBasepath;
      const rewriteChanged = prevRewriteOption !== nextRewriteOption;
      if (basepathChanged || rewriteChanged) {
        this.basepath = nextBasepath;
        const rewrites = [];
        if (trimPath(nextBasepath) !== "") {
          rewrites.push(
            rewriteBasepath({
              basepath: nextBasepath
            })
          );
        }
        if (nextRewriteOption) {
          rewrites.push(nextRewriteOption);
        }
        this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
        if (this.history) {
          this.updateLatestLocation();
        }
        needsLocationUpdate = true;
      }
      if (needsLocationUpdate && this.__store) {
        this.__store.state = {
          ...this.state,
          location: this.latestLocation
        };
      }
      if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") {
        this.isViewTransitionTypesSupported = window.CSS.supports(
          "selector(:active-view-transition-type(a)"
        );
      }
    };
    this.updateLatestLocation = () => {
      this.latestLocation = this.parseLocation(
        this.history.location,
        this.latestLocation
      );
    };
    this.buildRouteTree = () => {
      const { routesById, routesByPath, processedTree } = processRouteTree(
        this.routeTree,
        this.options.caseSensitive,
        (route, i) => {
          route.init({
            originalIndex: i
          });
        }
      );
      if (this.options.routeMasks) {
        processRouteMasks(this.options.routeMasks, processedTree);
      }
      this.routesById = routesById;
      this.routesByPath = routesByPath;
      this.processedTree = processedTree;
      const notFoundRoute = this.options.notFoundRoute;
      if (notFoundRoute) {
        notFoundRoute.init({
          originalIndex: 99999999999
        });
        this.routesById[notFoundRoute.id] = notFoundRoute;
      }
    };
    this.subscribe = (eventType, fn2) => {
      const listener = {
        eventType,
        fn: fn2
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) {
          listener.fn(routerEvent);
        }
      });
    };
    this.parseLocation = (locationToParse, previousLocation) => {
      const parse = ({
        href,
        state
      }) => {
        const fullUrl = new URL(href, this.origin);
        const url = executeRewriteInput(this.rewrite, fullUrl);
        const parsedSearch = this.options.parseSearch(url.search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        url.search = searchStr;
        const fullPath = url.href.replace(url.origin, "");
        return {
          href: fullPath,
          publicHref: href,
          url,
          pathname: decodePath(url.pathname),
          searchStr,
          search: replaceEqualDeep(previousLocation?.search, parsedSearch),
          hash: url.hash.split("#").reverse()[0] ?? "",
          state: replaceEqualDeep(previousLocation?.state, state)
        };
      };
      const location = parse(locationToParse);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathCache = createLRUCache(1e3);
    this.resolvePathWithBase = (from, path) => {
      const resolvedPath = resolvePath({
        base: from,
        to: cleanPath(path),
        trailingSlash: this.options.trailingSlash,
        cache: this.resolvePathCache
      });
      return resolvedPath;
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") {
        return this.matchRoutesInternal(
          {
            pathname: pathnameOrNext,
            search: locationSearchOrOpts
          },
          opts
        );
      }
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.getMatchedRoutes = (pathname) => {
      return getMatchedRoutes({
        pathname,
        routesById: this.routesById,
        processedTree: this.processedTree
      });
    };
    this.cancelMatch = (id) => {
      const match = this.getMatch(id);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match._nonReactive.pendingTimeout);
      match._nonReactive.pendingTimeout = void 0;
    };
    this.cancelMatches = () => {
      const currentPendingMatches = this.state.matches.filter(
        (match) => match.status === "pending"
      );
      const currentLoadingMatches = this.state.matches.filter(
        (match) => match.isFetching === "loader"
      );
      const matchesToCancelArray = /* @__PURE__ */ new Set([
        ...this.state.pendingMatches ?? [],
        ...currentPendingMatches,
        ...currentLoadingMatches
      ]);
      matchesToCancelArray.forEach((match) => {
        this.cancelMatch(match.id);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        const currentLocation = dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
        const allCurrentLocationMatches = this.matchRoutes(currentLocation, {
          _buildLocation: true
        });
        const lastMatch = last(allCurrentLocationMatches);
        if (dest.from && process.env.NODE_ENV !== "production" && dest._isNavigate) {
          const allFromMatches = this.getMatchedRoutes(dest.from).matchedRoutes;
          const matchedFrom = findLast(allCurrentLocationMatches, (d) => {
            return comparePaths(d.fullPath, dest.from);
          });
          const matchedCurrent = findLast(allFromMatches, (d) => {
            return comparePaths(d.fullPath, lastMatch.fullPath);
          });
          if (!matchedFrom && !matchedCurrent) {
            console.warn(`Could not find match for from: ${dest.from}`);
          }
        }
        const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lastMatch.fullPath;
        const fromPath = this.resolvePathWithBase(defaultedFromPath, ".");
        const fromSearch = lastMatch.search;
        const fromParams = { ...lastMatch.params };
        const nextTo = dest.to ? this.resolvePathWithBase(fromPath, `${dest.to}`) : this.resolvePathWithBase(fromPath, ".");
        const nextParams = dest.params === false || dest.params === null ? {} : (dest.params ?? true) === true ? fromParams : Object.assign(
          fromParams,
          functionalUpdate(dest.params, fromParams)
        );
        const interpolatedNextTo = interpolatePath({
          path: nextTo,
          params: nextParams
        }).interpolatedPath;
        const destRoutes = this.matchRoutes(interpolatedNextTo, void 0, {
          _buildLocation: true
        }).map((d) => this.looseRoutesById[d.routeId]);
        if (Object.keys(nextParams).length > 0) {
          for (const route of destRoutes) {
            const fn2 = route.options.params?.stringify ?? route.options.stringifyParams;
            if (fn2) {
              Object.assign(nextParams, fn2(nextParams));
            }
          }
        }
        const nextPathname = opts.leaveParams ? (
          // Use the original template path for interpolation
          // This preserves the original parameter syntax including optional parameters
          nextTo
        ) : decodePath(
          interpolatePath({
            path: nextTo,
            params: nextParams,
            decodeCharMap: this.pathParamsDecodeCharMap
          }).interpolatedPath
        );
        let nextSearch = fromSearch;
        if (opts._includeValidateSearch && this.options.search?.strict) {
          const validatedSearch = {};
          destRoutes.forEach((route) => {
            if (route.options.validateSearch) {
              try {
                Object.assign(
                  validatedSearch,
                  validateSearch(route.options.validateSearch, {
                    ...validatedSearch,
                    ...nextSearch
                  })
                );
              } catch {
              }
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch
        });
        nextSearch = replaceEqualDeep(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate(dest.hash, currentLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate(dest.state, currentLocation.state) : {};
        nextState = replaceEqualDeep(currentLocation.state, nextState);
        const fullPath = `${nextPathname}${searchStr}${hashStr}`;
        const url = new URL(fullPath, this.origin);
        const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
        return {
          publicHref: rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash,
          href: fullPath,
          url: rewrittenUrl,
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          const params = {};
          if (this.options.routeMasks) {
            const match = findFlatMatch(
              next.pathname,
              this.processedTree
            );
            if (match) {
              Object.assign(params, match.params);
              const {
                from: _from,
                params: maskParams,
                ...maskProps
              } = match.route;
              const nextParams = maskParams === false || maskParams === null ? {} : (maskParams ?? true) === true ? params : Object.assign(params, functionalUpdate(maskParams, params));
              maskedDest = {
                from: opts.from,
                ...maskProps,
                params: nextParams
              };
              maskedNext = build(maskedDest);
            }
          }
        }
        if (maskedNext) {
          next.maskedLocation = maskedNext;
        }
        return next;
      };
      if (opts.mask) {
        return buildWithMatches(opts, {
          from: opts.from,
          ...opts.mask
        });
      }
      return buildWithMatches(opts);
    };
    this.commitLocation = ({
      viewTransition,
      ignoreBlocker,
      ...next
    }) => {
      const isSameState = () => {
        const ignoredProps = [
          "key",
          // TODO: Remove in v2 - use __TSR_key instead
          "__TSR_key",
          "__TSR_index",
          "__hashScrollIntoViewOptions"
        ];
        ignoredProps.forEach((prop) => {
          next.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
      const previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise?.resolve();
      });
      if (isSameUrl && isSameState()) {
        this.load();
      } else {
        let {
          // eslint-disable-next-line prefer-const
          maskedLocation,
          // eslint-disable-next-line prefer-const
          hashScrollIntoView,
          // don't pass url into history since it is a URL instance that cannot be serialized
          // eslint-disable-next-line prefer-const
          url: _url,
          ...nextHistory
        } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  __TSR_key: void 0,
                  key: void 0
                  // TODO: Remove in v2 - use __TSR_key instead
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) {
            nextHistory.state.__tempKey = this.tempLocationKey;
          }
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        this.history[next.replace ? "replace" : "push"](
          nextHistory.publicHref,
          nextHistory.state,
          { ignoreBlocker }
        );
      }
      this.resetNextScroll = next.resetScroll ?? true;
      if (!this.history.subscribers.size) {
        this.load();
      }
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({
      replace,
      resetScroll,
      hashScrollIntoView,
      viewTransition,
      ignoreBlocker,
      href,
      ...rest
    } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, {
          __TSR_index: replace ? currentIndex : currentIndex + 1
        });
        rest.to = parsed.pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      this.pendingBuiltLocation = location;
      const commitPromise = this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
      Promise.resolve().then(() => {
        if (this.pendingBuiltLocation === location) {
          this.pendingBuiltLocation = void 0;
        }
      });
      return commitPromise;
    };
    this.navigate = async ({
      to: to2,
      reloadDocument,
      href,
      publicHref,
      ...rest
    }) => {
      let hrefIsUrl = false;
      if (href) {
        try {
          new URL(`${href}`);
          hrefIsUrl = true;
        } catch {
        }
      }
      if (hrefIsUrl && !reloadDocument) {
        reloadDocument = true;
      }
      if (reloadDocument) {
        if (!href || !publicHref && !hrefIsUrl) {
          const location = this.buildLocation({ to: to2, ...rest });
          href = href ?? location.url.href;
          publicHref = publicHref ?? location.url.href;
        }
        const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
        if (!rest.ignoreBlocker) {
          const historyWithBlockers = this.history;
          const blockers = historyWithBlockers.getBlockers?.() ?? [];
          for (const blocker of blockers) {
            if (blocker?.blockerFn) {
              const shouldBlock = await blocker.blockerFn({
                currentLocation: this.latestLocation,
                nextLocation: this.latestLocation,
                // External URLs don't have a next location in our router
                action: "PUSH"
              });
              if (shouldBlock) {
                return Promise.resolve();
              }
            }
          }
        }
        if (rest.replace) {
          window.location.replace(reloadHref);
        } else {
          window.location.href = reloadHref;
        }
        return Promise.resolve();
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to: to2,
        _isNavigate: true
      });
    };
    this.beforeLoad = () => {
      this.cancelMatches();
      this.updateLatestLocation();
      if (this.isServer) {
        const nextLocation = this.buildLocation({
          to: this.latestLocation.pathname,
          search: true,
          params: true,
          hash: true,
          state: true,
          _includeValidateSearch: true
        });
        if (this.latestLocation.publicHref !== nextLocation.publicHref || nextLocation.url.origin !== this.origin) {
          const href = this.getParsedLocationHref(nextLocation);
          throw redirect({ href });
        }
      }
      const pendingMatches = this.matchRoutes(this.latestLocation);
      this.__store.setState((s) => ({
        ...s,
        status: "pending",
        statusCode: 200,
        isLoading: true,
        location: this.latestLocation,
        pendingMatches,
        // If a cached moved to pendingMatches, remove it from cachedMatches
        cachedMatches: s.cachedMatches.filter(
          (d) => !pendingMatches.some((e) => e.id === d.id)
        )
      }));
    };
    this.load = async (opts) => {
      let redirect2;
      let notFound;
      let loadPromise;
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          try {
            this.beforeLoad();
            const next = this.latestLocation;
            const prevLocation = this.state.resolvedLocation;
            if (!this.state.redirect) {
              this.emit({
                type: "onBeforeNavigate",
                ...getLocationChangeInfo({
                  resolvedLocation: prevLocation,
                  location: next
                })
              });
            }
            this.emit({
              type: "onBeforeLoad",
              ...getLocationChangeInfo({
                resolvedLocation: prevLocation,
                location: next
              })
            });
            await loadMatches({
              router: this,
              sync: opts?.sync,
              matches: this.state.pendingMatches,
              location: next,
              updateMatch: this.updateMatch,
              // eslint-disable-next-line @typescript-eslint/require-await
              onReady: async () => {
                this.startTransition(() => {
                  this.startViewTransition(async () => {
                    let exitingMatches = [];
                    let enteringMatches = [];
                    let stayingMatches = [];
                    batch(() => {
                      this.__store.setState((s) => {
                        const previousMatches = s.matches;
                        const newMatches = s.pendingMatches || s.matches;
                        exitingMatches = previousMatches.filter(
                          (match) => !newMatches.some((d) => d.id === match.id)
                        );
                        enteringMatches = newMatches.filter(
                          (match) => !previousMatches.some((d) => d.id === match.id)
                        );
                        stayingMatches = newMatches.filter(
                          (match) => previousMatches.some((d) => d.id === match.id)
                        );
                        return {
                          ...s,
                          isLoading: false,
                          loadedAt: Date.now(),
                          matches: newMatches,
                          pendingMatches: void 0,
                          /**
                           * When committing new matches, cache any exiting matches that are still usable.
                           * Routes that resolved with `status: 'error'` or `status: 'notFound'` are
                           * deliberately excluded from `cachedMatches` so that subsequent invalidations
                           * or reloads re-run their loaders instead of reusing the failed/not-found data.
                           */
                          cachedMatches: [
                            ...s.cachedMatches,
                            ...exitingMatches.filter(
                              (d) => d.status !== "error" && d.status !== "notFound"
                            )
                          ]
                        };
                      });
                      this.clearExpiredCache();
                    });
                    [
                      [exitingMatches, "onLeave"],
                      [enteringMatches, "onEnter"],
                      [stayingMatches, "onStay"]
                    ].forEach(([matches, hook]) => {
                      matches.forEach((match) => {
                        this.looseRoutesById[match.routeId].options[hook]?.(
                          match
                        );
                      });
                    });
                  });
                });
              }
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect2 = err;
              if (!this.isServer) {
                this.navigate({
                  ...redirect2.options,
                  replace: true,
                  ignoreBlocker: true
                });
              }
            } else if (isNotFound(err)) {
              notFound = err;
            }
            this.__store.setState((s) => ({
              ...s,
              statusCode: redirect2 ? redirect2.status : notFound ? 404 : s.matches.some((d) => d.status === "error") ? 500 : 200,
              redirect: redirect2
            }));
          }
          if (this.latestLoadPromise === loadPromise) {
            this.commitLocationPromise?.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) {
        await this.latestLoadPromise;
      }
      let newStatusCode = void 0;
      if (this.hasNotFoundMatch()) {
        newStatusCode = 404;
      } else if (this.__store.state.matches.some((d) => d.status === "error")) {
        newStatusCode = 500;
      }
      if (newStatusCode !== void 0) {
        this.__store.setState((s) => ({
          ...s,
          statusCode: newStatusCode
        }));
      }
    };
    this.startViewTransition = (fn2) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      delete this.shouldViewTransition;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next = this.latestLocation;
          const prevLocation = this.state.resolvedLocation;
          const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(
            getLocationChangeInfo({
              resolvedLocation: prevLocation,
              location: next
            })
          ) : shouldViewTransition.types;
          if (resolvedViewTransitionTypes === false) {
            fn2();
            return;
          }
          startViewTransitionParams = {
            update: fn2,
            types: resolvedViewTransitionTypes
          };
        } else {
          startViewTransitionParams = fn2;
        }
        document.startViewTransition(startViewTransitionParams);
      } else {
        fn2();
      }
    };
    this.updateMatch = (id, updater) => {
      this.startTransition(() => {
        const matchesKey = this.state.pendingMatches?.some((d) => d.id === id) ? "pendingMatches" : this.state.matches.some((d) => d.id === id) ? "matches" : this.state.cachedMatches.some((d) => d.id === id) ? "cachedMatches" : "";
        if (matchesKey) {
          this.__store.setState((s) => ({
            ...s,
            [matchesKey]: s[matchesKey]?.map(
              (d) => d.id === id ? updater(d) : d
            )
          }));
        }
      });
    };
    this.getMatch = (matchId) => {
      const findFn = (d) => d.id === matchId;
      return this.state.cachedMatches.find(findFn) ?? this.state.pendingMatches?.find(findFn) ?? this.state.matches.find(findFn);
    };
    this.invalidate = (opts) => {
      const invalidate = (d) => {
        if (opts?.filter?.(d) ?? true) {
          return {
            ...d,
            invalid: true,
            ...opts?.forcePending || d.status === "error" || d.status === "notFound" ? { status: "pending", error: void 0 } : void 0
          };
        }
        return d;
      };
      this.__store.setState((s) => ({
        ...s,
        matches: s.matches.map(invalidate),
        cachedMatches: s.cachedMatches.map(invalidate),
        pendingMatches: s.pendingMatches?.map(invalidate)
      }));
      this.shouldViewTransition = false;
      return this.load({ sync: opts?.sync });
    };
    this.getParsedLocationHref = (location) => {
      let href = location.url.href;
      if (this.origin && location.url.origin === this.origin) {
        href = href.replace(this.origin, "") || "/";
      }
      return href;
    };
    this.resolveRedirect = (redirect2) => {
      if (!redirect2.options.href) {
        const location = this.buildLocation(redirect2.options);
        const href = this.getParsedLocationHref(location);
        redirect2.options.href = location.href;
        redirect2.headers.set("Location", href);
      }
      if (!redirect2.headers.get("Location")) {
        redirect2.headers.set("Location", redirect2.options.href);
      }
      return redirect2;
    };
    this.clearCache = (opts) => {
      const filter = opts?.filter;
      if (filter !== void 0) {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: s.cachedMatches.filter(
              (m2) => !filter(m2)
            )
          };
        });
      } else {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: []
          };
        });
      }
    };
    this.clearExpiredCache = () => {
      const filter = (d) => {
        const route = this.looseRoutesById[d.routeId];
        if (!route.options.loader) {
          return true;
        }
        const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 5 * 60 * 1e3;
        const isError = d.status === "error";
        if (isError) return true;
        const gcEligible = Date.now() - d.updatedAt >= gcTime;
        return gcEligible;
      };
      this.clearCache({ filter });
    };
    this.loadRouteChunk = loadRouteChunk;
    this.preloadRoute = async (opts) => {
      const next = this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = new Set(
        [...this.state.matches, ...this.state.pendingMatches ?? []].map(
          (d) => d.id
        )
      );
      const loadedMatchIds = /* @__PURE__ */ new Set([
        ...activeMatchIds,
        ...this.state.cachedMatches.map((d) => d.id)
      ]);
      batch(() => {
        matches.forEach((match) => {
          if (!loadedMatchIds.has(match.id)) {
            this.__store.setState((s) => ({
              ...s,
              cachedMatches: [...s.cachedMatches, match]
            }));
          }
        });
      });
      try {
        matches = await loadMatches({
          router: this,
          matches,
          location: next,
          preload: true,
          updateMatch: (id, updater) => {
            if (activeMatchIds.has(id)) {
              matches = matches.map((d) => d.id === id ? updater(d) : d);
            } else {
              this.updateMatch(id, updater);
            }
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) {
            return void 0;
          }
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next
          });
        }
        if (!isNotFound(err)) {
          console.error(err);
        }
        return void 0;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(
          location.from || "",
          location.to
        ) : void 0,
        params: location.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if (opts?.pending && this.state.status !== "pending") {
        return false;
      }
      const pending = opts?.pending === void 0 ? !this.state.isLoading : opts.pending;
      const baseLocation = pending ? this.latestLocation : this.state.resolvedLocation || this.state.location;
      const match = findSingleMatch(
        next.pathname,
        opts?.caseSensitive ?? false,
        opts?.fuzzy ?? false,
        baseLocation.pathname,
        this.processedTree
      );
      if (!match) {
        return false;
      }
      if (location.params) {
        if (!deepEqual(match.params, location.params, { partial: true })) {
          return false;
        }
      }
      if (opts?.includeSearch ?? true) {
        return deepEqual(baseLocation.search, next.search, { partial: true }) ? match.params : false;
      }
      return match.params;
    };
    this.hasNotFoundMatch = () => {
      return this.__store.state.matches.some(
        (d) => d.status === "notFound" || d.globalNotFound
      );
    };
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch
    });
    if (typeof document !== "undefined") {
      self.__TSR_ROUTER__ = this;
    }
  }
  isShell() {
    return !!this.options.isShell;
  }
  isPrerendering() {
    return !!this.options.isPrerendering;
  }
  get state() {
    return this.__store.state;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  matchRoutesInternal(next, opts) {
    const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
    const { foundRoute, routeParams } = matchedRoutesResult;
    let { matchedRoutes } = matchedRoutesResult;
    let isGlobalNotFound = false;
    if (
      // If we found a route, and it's not an index route and we have left over path
      foundRoute ? foundRoute.path !== "/" && routeParams["**"] : (
        // Or if we didn't find a route and we have left over path
        trimPathRight(next.pathname)
      )
    ) {
      if (this.options.notFoundRoute) {
        matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
      } else {
        isGlobalNotFound = true;
      }
    }
    const globalNotFoundRouteId = (() => {
      if (!isGlobalNotFound) {
        return void 0;
      }
      if (this.options.notFoundMode !== "root") {
        for (let i = matchedRoutes.length - 1; i >= 0; i--) {
          const route = matchedRoutes[i];
          if (route.children) {
            return route.id;
          }
        }
      }
      return rootRouteId;
    })();
    const matches = [];
    const getParentContext = (parentMatch) => {
      const parentMatchId = parentMatch?.id;
      const parentContext = !parentMatchId ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
      return parentContext;
    };
    matchedRoutes.forEach((route, index) => {
      const parentMatch = matches[index - 1];
      const [preMatchSearch, strictMatchSearch, searchError] = (() => {
        const parentSearch = parentMatch?.search ?? next.search;
        const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
        try {
          const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
          return [
            {
              ...parentSearch,
              ...strictSearch
            },
            { ...parentStrictSearch, ...strictSearch },
            void 0
          ];
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) {
            searchParamError = new SearchParamError(err.message, {
              cause: err
            });
          }
          if (opts?.throwOnError) {
            throw searchParamError;
          }
          return [parentSearch, {}, searchParamError];
        }
      })();
      const loaderDeps = route.options.loaderDeps?.({
        search: preMatchSearch
      }) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { interpolatedPath, usedParams } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decodeCharMap: this.pathParamsDecodeCharMap
      });
      const matchId = (
        // route.id for disambiguation
        route.id + // interpolatedPath for param changes
        interpolatedPath + // explicit deps
        loaderDepsHash
      );
      const existingMatch = this.getMatch(matchId);
      const previousMatch = this.state.matches.find(
        (d) => d.routeId === route.id
      );
      const strictParams = existingMatch?._strictParams ?? usedParams;
      let paramsError = void 0;
      if (!existingMatch) {
        const strictParseParams = route.options.params?.parse ?? route.options.parseParams;
        if (strictParseParams) {
          try {
            Object.assign(
              strictParams,
              strictParseParams(strictParams)
            );
          } catch (err) {
            if (isNotFound(err) || isRedirect(err)) {
              paramsError = err;
            } else {
              paramsError = new PathParamError(err.message, {
                cause: err
              });
            }
            if (opts?.throwOnError) {
              throw paramsError;
            }
          }
        }
      }
      Object.assign(routeParams, strictParams);
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) {
        match = {
          ...existingMatch,
          cause,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          _strictParams: strictParams,
          search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : replaceEqualDeep(existingMatch.search, preMatchSearch),
          _strictSearch: strictMatchSearch
        };
      } else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          ssr: this.isServer ? void 0 : route.options.ssr,
          index,
          routeId: route.id,
          params: previousMatch ? replaceEqualDeep(previousMatch.params, routeParams) : routeParams,
          _strictParams: strictParams,
          pathname: interpolatedPath,
          updatedAt: Date.now(),
          search: previousMatch ? replaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError,
          __routeContext: void 0,
          _nonReactive: {
            loadPromise: createControlledPromise()
          },
          __beforeLoadContext: void 0,
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          fullPath: route.fullPath
        };
      }
      if (!opts?.preload) {
        match.globalNotFound = globalNotFoundRouteId === route.id;
      }
      match.searchError = searchError;
      const parentContext = getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches.push(match);
    });
    matches.forEach((match, index) => {
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      if (!existingMatch && opts?._buildLocation !== true) {
        const parentMatch = matches[index - 1];
        const parentContext = getParentContext(parentMatch);
        if (route.options.context) {
          const contextFnContext = {
            deps: match.loaderDeps,
            params: match.params,
            context: parentContext ?? {},
            location: next,
            navigate: (opts2) => this.navigate({ ...opts2, _fromLocation: next }),
            buildLocation: this.buildLocation,
            cause: match.cause,
            abortController: match.abortController,
            preload: !!match.preload,
            matches
          };
          match.__routeContext = route.options.context(contextFnContext) ?? void 0;
        }
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
    });
    return matches;
  }
}
class SearchParamError extends Error {
}
class PathParamError extends Error {
}
const normalize = (str) => str.endsWith("/") && str.length > 1 ? str.slice(0, -1) : str;
function comparePaths(a, b2) {
  return normalize(a) === normalize(b2);
}
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise)
      throw new SearchParamError("Async validation not supported");
    if (result.issues)
      throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), {
        cause: result
      });
    return result.value;
  }
  if ("parse" in validateSearch2) {
    return validateSearch2.parse(input);
  }
  if (typeof validateSearch2 === "function") {
    return validateSearch2(input);
  }
  return {};
}
function getMatchedRoutes({
  pathname,
  routesById,
  processedTree
}) {
  const routeParams = {};
  const trimmedPath = trimPathRight(pathname);
  let foundRoute = void 0;
  const match = findRouteMatch(trimmedPath, processedTree, true);
  if (match) {
    foundRoute = match.route;
    Object.assign(routeParams, match.params);
  }
  const matchedRoutes = match?.branch || [routesById[rootRouteId]];
  return { matchedRoutes, routeParams, foundRoute };
}
function applySearchMiddleware({
  search,
  dest,
  destRoutes,
  _includeValidateSearch
}) {
  const allMiddlewares = destRoutes.reduce(
    (acc, route) => {
      const middlewares = [];
      if ("search" in route.options) {
        if (route.options.search?.middlewares) {
          middlewares.push(...route.options.search.middlewares);
        }
      } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
        const legacyMiddleware = ({
          search: search2,
          next
        }) => {
          let nextSearch = search2;
          if ("preSearchFilters" in route.options && route.options.preSearchFilters) {
            nextSearch = route.options.preSearchFilters.reduce(
              (prev, next2) => next2(prev),
              search2
            );
          }
          const result = next(nextSearch);
          if ("postSearchFilters" in route.options && route.options.postSearchFilters) {
            return route.options.postSearchFilters.reduce(
              (prev, next2) => next2(prev),
              result
            );
          }
          return result;
        };
        middlewares.push(legacyMiddleware);
      }
      if (_includeValidateSearch && route.options.validateSearch) {
        const validate = ({ search: search2, next }) => {
          const result = next(search2);
          try {
            const validatedSearch = {
              ...result,
              ...validateSearch(route.options.validateSearch, result) ?? void 0
            };
            return validatedSearch;
          } catch {
            return result;
          }
        };
        middlewares.push(validate);
      }
      return acc.concat(middlewares);
    },
    []
  ) ?? [];
  const final = ({ search: search2 }) => {
    if (!dest.search) {
      return {};
    }
    if (dest.search === true) {
      return search2;
    }
    return functionalUpdate(dest.search, search2);
  };
  allMiddlewares.push(final);
  const applyNext = (index, currentSearch) => {
    if (index >= allMiddlewares.length) {
      return currentSearch;
    }
    const middleware = allMiddlewares[index];
    const next = (newSearch) => {
      return applyNext(index + 1, newSearch);
    };
    return middleware({ search: currentSearch, next });
  };
  return applyNext(0, search);
}
var L = ((i) => (i[i.AggregateError = 1] = "AggregateError", i[i.ArrowFunction = 2] = "ArrowFunction", i[i.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i[i.ObjectAssign = 8] = "ObjectAssign", i[i.BigIntTypedArray = 16] = "BigIntTypedArray", i[i.RegExp = 32] = "RegExp", i))(L || {});
var N = Symbol.asyncIterator, fr = Symbol.hasInstance, I = Symbol.isConcatSpreadable, b = Symbol.iterator, Sr = Symbol.match, mr = Symbol.matchAll, pr = Symbol.replace, dr = Symbol.search, gr = Symbol.species, yr = Symbol.split, Nr = Symbol.toPrimitive, P$1 = Symbol.toStringTag, br = Symbol.unscopables;
var qr = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, Ce = { [N]: 0, [fr]: 1, [I]: 2, [b]: 3, [Sr]: 4, [mr]: 5, [pr]: 6, [dr]: 7, [gr]: 8, [yr]: 9, [Nr]: 10, [P$1]: 11, [br]: 12 }, Xr = { 0: N, 1: fr, 2: I, 3: b, 4: Sr, 5: mr, 6: pr, 7: dr, 8: gr, 9: yr, 10: Nr, 11: P$1, 12: br }, Qr = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, o = void 0, et = { 2: true, 3: false, 1: o, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN };
var ve = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, rt = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError };
function c(e, r, t, n, a, s, i, u2, l, g, S, d) {
  return { t: e, i: r, s: t, c: n, m: a, p: s, e: i, a: u2, f: l, b: g, o: S, l: d };
}
function D(e) {
  return c(2, o, e, o, o, o, o, o, o, o, o, o);
}
var Z = D(2), $ = D(3), Ae = D(1), Re = D(0), tt = D(4), nt = D(5), ot = D(6), at = D(7);
function sn(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return o;
  }
}
function y(e) {
  let r = "", t = 0, n;
  for (let a = 0, s = e.length; a < s; a++) n = sn(e[a]), n && (r += e.slice(t, a) + n, t = a + 1);
  return t === 0 ? r = e : r += e.slice(t), r;
}
function un(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function F(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, un);
}
var U = "__SEROVAL_REFS__", ce = "$R", Ee = `self.${ce}`;
function ln(e) {
  return e == null ? `${Ee}=${Ee}||[]` : `(${Ee}=${Ee}||{})["${y(e)}"]=[]`;
}
var Cr = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map();
function vr(e) {
  return Cr.has(e);
}
function fn(e) {
  return j.has(e);
}
function st(e) {
  if (vr(e)) return Cr.get(e);
  throw new Ie(e);
}
function it(e) {
  if (fn(e)) return j.get(e);
  throw new Pe(e);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U, { value: j, configurable: true, writable: false, enumerable: false }) : typeof window != "undefined" ? Object.defineProperty(window, U, { value: j, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, U, { value: j, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, U, { value: j, configurable: true, writable: false, enumerable: false });
function xe(e) {
  return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function Sn(e) {
  let r = ve[xe(e)];
  return e.name !== r ? { name: e.name } : e.constructor.name !== r ? { name: e.constructor.name } : {};
}
function q(e, r) {
  let t = Sn(e), n = Object.getOwnPropertyNames(e);
  for (let a = 0, s = n.length, i; a < s; a++) i = n[a], i !== "name" && i !== "message" && (i === "stack" ? r & 4 && (t = t || {}, t[i] = e[i]) : (t = t || {}, t[i] = e[i]));
  return t;
}
function Te(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function Oe(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return nt;
    case Number.NEGATIVE_INFINITY:
      return ot;
  }
  return e !== e ? at : Object.is(e, -0) ? tt : c(0, o, e, o, o, o, o, o, o, o, o, o);
}
function X(e) {
  return c(1, o, y(e), o, o, o, o, o, o, o, o, o);
}
function we(e) {
  return c(3, o, "" + e, o, o, o, o, o, o, o, o, o);
}
function lt(e) {
  return c(4, e, o, o, o, o, o, o, o, o, o, o);
}
function he(e, r) {
  let t = r.valueOf();
  return c(5, e, t !== t ? "" : r.toISOString(), o, o, o, o, o, o, o, o, o);
}
function ze(e, r) {
  return c(6, e, o, y(r.source), r.flags, o, o, o, o, o, o, o);
}
function ct(e, r) {
  return c(17, e, Ce[r], o, o, o, o, o, o, o, o, o);
}
function ft(e, r) {
  return c(18, e, y(st(r)), o, o, o, o, o, o, o, o, o);
}
function fe(e, r, t) {
  return c(25, e, t, y(r), o, o, o, o, o, o, o, o);
}
function _e(e, r, t) {
  return c(9, e, o, o, o, o, o, t, o, o, Te(r), o);
}
function ke(e, r) {
  return c(21, e, o, o, o, o, o, o, r, o, o, o);
}
function De(e, r, t) {
  return c(15, e, o, r.constructor.name, o, o, o, o, t, r.byteOffset, o, r.length);
}
function Fe(e, r, t) {
  return c(16, e, o, r.constructor.name, o, o, o, o, t, r.byteOffset, o, r.byteLength);
}
function Be(e, r, t) {
  return c(20, e, o, o, o, o, o, o, t, r.byteOffset, o, r.byteLength);
}
function Me(e, r, t) {
  return c(13, e, xe(r), o, y(r.message), t, o, o, o, o, o, o);
}
function Ve(e, r, t) {
  return c(14, e, xe(r), o, y(r.message), t, o, o, o, o, o, o);
}
function Le(e, r) {
  return c(7, e, o, o, o, o, o, r, o, o, o, o);
}
function Ue(e, r) {
  return c(28, o, o, o, o, o, o, [e, r], o, o, o, o);
}
function je(e, r) {
  return c(30, o, o, o, o, o, o, [e, r], o, o, o, o);
}
function Ye(e, r, t) {
  return c(31, e, o, o, o, o, o, t, r, o, o, o);
}
function We(e, r) {
  return c(32, e, o, o, o, o, o, o, r, o, o, o);
}
function Ge(e, r) {
  return c(33, e, o, o, o, o, o, o, r, o, o, o);
}
function Ke(e, r) {
  return c(34, e, o, o, o, o, o, o, r, o, o, o);
}
var mn = { parsing: 1, serialization: 2, deserialization: 3 };
function pn(e) {
  return `Seroval Error (step: ${mn[e]})`;
}
var dn = (e, r) => pn(e), Se = class extends Error {
  constructor(t, n) {
    super(dn(t));
    this.cause = n;
  }
}, z = class extends Se {
  constructor(r) {
    super("parsing", r);
  }
}, He = class extends Se {
  constructor(r) {
    super("deserialization", r);
  }
};
function _(e) {
  return `Seroval Error (specific: ${e})`;
}
var x = class extends Error {
  constructor(t) {
    super(_(1));
    this.value = t;
  }
}, O = class extends Error {
  constructor(r) {
    super(_(2));
  }
}, Q = class extends Error {
  constructor(r) {
    super(_(3));
  }
}, B = class extends Error {
  constructor(r) {
    super(_(4));
  }
}, Ie = class extends Error {
  constructor(t) {
    super(_(5));
    this.value = t;
  }
}, Pe = class extends Error {
  constructor(r) {
    super(_(6));
  }
}, Je = class extends Error {
  constructor(r) {
    super(_(7));
  }
}, w$1 = class w extends Error {
  constructor(r) {
    super(_(8));
  }
}, ee$1 = class ee extends Error {
  constructor(r) {
    super(_(9));
  }
};
var Y = class {
  constructor(r, t) {
    this.value = r;
    this.replacement = t;
  }
};
var re$1 = () => {
  let e = { p: 0, s: 0, f: 0 };
  return e.p = new Promise((r, t) => {
    e.s = r, e.f = t;
  }), e;
}, gn = (e, r) => {
  e.s(r), e.p.s = 1, e.p.v = r;
}, yn = (e, r) => {
  e.f(r), e.p.s = 2, e.p.v = r;
}, mt = re$1.toString(), pt = gn.toString(), dt = yn.toString(), Rr = () => {
  let e = [], r = [], t = true, n = false, a = 0, s = (l, g, S) => {
    for (S = 0; S < a; S++) r[S] && r[S][g](l);
  }, i = (l, g, S, d) => {
    for (g = 0, S = e.length; g < S; g++) d = e[g], !t && g === S - 1 ? l[n ? "return" : "throw"](d) : l.next(d);
  }, u2 = (l, g) => (t && (g = a++, r[g] = l), i(l), () => {
    t && (r[g] = r[a], r[a--] = void 0);
  });
  return { __SEROVAL_STREAM__: true, on: (l) => u2(l), next: (l) => {
    t && (e.push(l), s(l, "next"));
  }, throw: (l) => {
    t && (e.push(l), s(l, "throw"), t = false, n = false, r.length = 0);
  }, return: (l) => {
    t && (e.push(l), s(l, "return"), t = false, n = true, r.length = 0);
  } };
}, gt = Rr.toString(), Er = (e) => (r) => () => {
  let t = 0, n = { [e]: () => n, next: () => {
    if (t > r.d) return { done: true, value: void 0 };
    let a = t++, s = r.v[a];
    if (a === r.t) throw s;
    return { done: a === r.d, value: s };
  } };
  return n;
}, yt = Er.toString(), Ir = (e, r) => (t) => () => {
  let n = 0, a = -1, s = false, i = [], u2 = [], l = (S = 0, d = u2.length) => {
    for (; S < d; S++) u2[S].s({ done: true, value: void 0 });
  };
  t.on({ next: (S) => {
    let d = u2.shift();
    d && d.s({ done: false, value: S }), i.push(S);
  }, throw: (S) => {
    let d = u2.shift();
    d && d.f(S), l(), a = i.length, s = true, i.push(S);
  }, return: (S) => {
    let d = u2.shift();
    d && d.s({ done: true, value: S }), l(), a = i.length, i.push(S);
  } });
  let g = { [e]: () => g, next: () => {
    if (a === -1) {
      let H = n++;
      if (H >= i.length) {
        let $r = r();
        return u2.push($r), $r.p;
      }
      return { done: false, value: i[H] };
    }
    if (n > a) return { done: true, value: void 0 };
    let S = n++, d = i[S];
    if (S !== a) return { done: false, value: d };
    if (s) throw d;
    return { done: true, value: d };
  } };
  return g;
}, Nt = Ir.toString(), Pr = (e) => {
  let r = atob(e), t = r.length, n = new Uint8Array(t);
  for (let a = 0; a < t; a++) n[a] = r.charCodeAt(a);
  return n.buffer;
}, bt = Pr.toString();
var Ct = {}, vt = {};
var At = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, Rt = { 0: "[]", 1: mt, 2: pt, 3: dt, 4: gt, 5: bt };
function M(e) {
  return "__SEROVAL_STREAM__" in e;
}
function te() {
  return Rr();
}
function Ze(e) {
  let r = te(), t = e[N]();
  async function n() {
    try {
      let a = await t.next();
      a.done ? r.return(a.value) : (r.next(a.value), await n());
    } catch (a) {
      r.throw(a);
    }
  }
  return n().catch(() => {
  }), r;
}
var Nn = Ir(N, re$1);
function Et(e) {
  return Nn(e);
}
function $e(e) {
  let r = [], t = -1, n = -1, a = e[b]();
  for (; ; ) try {
    let s = a.next();
    if (r.push(s.value), s.done) {
      n = r.length - 1;
      break;
    }
  } catch (s) {
    t = r.length, r.push(s);
  }
  return { v: r, t, d: n };
}
var bn = Er(b);
function It(e) {
  return bn(e);
}
async function xr(e) {
  try {
    return [1, await e];
  } catch (r) {
    return [0, r];
  }
}
function pe(e, r) {
  return { plugins: r.plugins, mode: e, marked: /* @__PURE__ */ new Set(), features: 63 ^ (r.disabledFeatures || 0), refs: r.refs || /* @__PURE__ */ new Map(), depthLimit: r.depthLimit || 1e3 };
}
function de(e, r) {
  e.marked.add(r);
}
function Tr(e, r) {
  let t = e.refs.size;
  return e.refs.set(r, t), t;
}
function qe(e, r) {
  let t = e.refs.get(r);
  return t != null ? (de(e, t), { type: 1, value: lt(t) }) : { type: 0, value: Tr(e, r) };
}
function W(e, r) {
  let t = qe(e, r);
  return t.type === 1 ? t : vr(r) ? { type: 2, value: ft(t.value, r) } : t;
}
function E(e, r) {
  let t = W(e, r);
  if (t.type !== 0) return t.value;
  if (r in Ce) return ct(t.value, r);
  throw new x(r);
}
function k(e, r) {
  let t = qe(e, At[r]);
  return t.type === 1 ? t.value : c(26, t.value, r, o, o, o, o, o, o, o, o, o);
}
function Xe(e) {
  let r = qe(e, Ct);
  return r.type === 1 ? r.value : c(27, r.value, o, o, o, o, o, o, E(e, b), o, o, o);
}
function Qe(e) {
  let r = qe(e, vt);
  return r.type === 1 ? r.value : c(29, r.value, o, o, o, o, o, [k(e, 1), E(e, N)], o, o, o, o);
}
function er(e, r, t, n) {
  return c(t ? 11 : 10, e, o, o, o, n, o, o, o, o, Te(r), o);
}
function rr(e, r, t, n) {
  return c(8, r, o, o, o, o, { k: t, v: n }, o, k(e, 0), o, o, o);
}
function xt(e, r, t) {
  return c(22, r, t, o, o, o, o, o, k(e, 1), o, o, o);
}
function tr(e, r, t) {
  let n = new Uint8Array(t), a = "";
  for (let s = 0, i = n.length; s < i; s++) a += String.fromCharCode(n[s]);
  return c(19, r, y(btoa(a)), o, o, o, o, o, k(e, 5), o, o, o);
}
function ne(e, r) {
  return { base: pe(e, r), child: void 0 };
}
var wr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return C(this._p, this.depth, r);
  }
};
async function vn(e, r, t) {
  let n = [];
  for (let a = 0, s = t.length; a < s; a++) a in t ? n[a] = await C(e, r, t[a]) : n[a] = 0;
  return n;
}
async function An(e, r, t, n) {
  return _e(t, n, await vn(e, r, n));
}
async function hr(e, r, t) {
  let n = Object.entries(t), a = [], s = [];
  for (let i = 0, u2 = n.length; i < u2; i++) a.push(y(n[i][0])), s.push(await C(e, r, n[i][1]));
  return b in t && (a.push(E(e.base, b)), s.push(Ue(Xe(e.base), await C(e, r, $e(t))))), N in t && (a.push(E(e.base, N)), s.push(je(Qe(e.base), await C(e, r, Ze(t))))), P$1 in t && (a.push(E(e.base, P$1)), s.push(X(t[P$1]))), I in t && (a.push(E(e.base, I)), s.push(t[I] ? Z : $)), { k: a, v: s };
}
async function Or(e, r, t, n, a) {
  return er(t, n, a, await hr(e, r, n));
}
async function Rn(e, r, t, n) {
  return ke(t, await C(e, r, n.valueOf()));
}
async function En(e, r, t, n) {
  return De(t, n, await C(e, r, n.buffer));
}
async function In(e, r, t, n) {
  return Fe(t, n, await C(e, r, n.buffer));
}
async function Pn(e, r, t, n) {
  return Be(t, n, await C(e, r, n.buffer));
}
async function Tt(e, r, t, n) {
  let a = q(n, e.base.features);
  return Me(t, n, a ? await hr(e, r, a) : o);
}
async function xn(e, r, t, n) {
  let a = q(n, e.base.features);
  return Ve(t, n, a ? await hr(e, r, a) : o);
}
async function Tn(e, r, t, n) {
  let a = [], s = [];
  for (let [i, u2] of n.entries()) a.push(await C(e, r, i)), s.push(await C(e, r, u2));
  return rr(e.base, t, a, s);
}
async function On(e, r, t, n) {
  let a = [];
  for (let s of n.keys()) a.push(await C(e, r, s));
  return Le(t, a);
}
async function Ot(e, r, t, n) {
  let a = e.base.plugins;
  if (a) for (let s = 0, i = a.length; s < i; s++) {
    let u2 = a[s];
    if (u2.parse.async && u2.test(n)) return fe(t, u2.tag, await u2.parse.async(n, new wr(e, r), { id: t }));
  }
  return o;
}
async function wn(e, r, t, n) {
  let [a, s] = await xr(n);
  return c(12, t, a, o, o, o, o, o, await C(e, r, s), o, o, o);
}
function hn(e, r, t, n, a) {
  let s = [], i = t.on({ next: (u2) => {
    de(this.base, r), C(this, e, u2).then((l) => {
      s.push(We(r, l));
    }, (l) => {
      a(l), i();
    });
  }, throw: (u2) => {
    de(this.base, r), C(this, e, u2).then((l) => {
      s.push(Ge(r, l)), n(s), i();
    }, (l) => {
      a(l), i();
    });
  }, return: (u2) => {
    de(this.base, r), C(this, e, u2).then((l) => {
      s.push(Ke(r, l)), n(s), i();
    }, (l) => {
      a(l), i();
    });
  } });
}
async function zn(e, r, t, n) {
  return Ye(t, k(e.base, 4), await new Promise(hn.bind(e, r, t, n)));
}
async function _n(e, r, t, n) {
  if (Array.isArray(n)) return An(e, r, t, n);
  if (M(n)) return zn(e, r, t, n);
  let a = n.constructor;
  if (a === Y) return C(e, r, n.replacement);
  let s = await Ot(e, r, t, n);
  if (s) return s;
  switch (a) {
    case Object:
      return Or(e, r, t, n, false);
    case o:
      return Or(e, r, t, n, true);
    case Date:
      return he(t, n);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return Tt(e, r, t, n);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return Rn(e, r, t, n);
    case ArrayBuffer:
      return tr(e.base, t, n);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return En(e, r, t, n);
    case DataView:
      return Pn(e, r, t, n);
    case Map:
      return Tn(e, r, t, n);
    case Set:
      return On(e, r, t, n);
  }
  if (a === Promise || n instanceof Promise) return wn(e, r, t, n);
  let i = e.base.features;
  if (i & 32 && a === RegExp) return ze(t, n);
  if (i & 16) switch (a) {
    case BigInt64Array:
    case BigUint64Array:
      return In(e, r, t, n);
  }
  if (i & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n instanceof AggregateError)) return xn(e, r, t, n);
  if (n instanceof Error) return Tt(e, r, t, n);
  if (b in n || N in n) return Or(e, r, t, n, !!a);
  throw new x(n);
}
async function kn(e, r, t) {
  let n = W(e.base, t);
  if (n.type !== 0) return n.value;
  let a = await Ot(e, r, n.value, t);
  if (a) return a;
  throw new x(t);
}
async function C(e, r, t) {
  switch (typeof t) {
    case "boolean":
      return t ? Z : $;
    case "undefined":
      return Ae;
    case "string":
      return X(t);
    case "number":
      return Oe(t);
    case "bigint":
      return we(t);
    case "object": {
      if (t) {
        let n = W(e.base, t);
        return n.type === 0 ? await _n(e, r + 1, n.value, t) : n.value;
      }
      return Re;
    }
    case "symbol":
      return E(e.base, t);
    case "function":
      return kn(e, r, t);
    default:
      throw new x(t);
  }
}
async function oe(e, r) {
  try {
    return await C(e, 0, r);
  } catch (t) {
    throw t instanceof z ? t : new z(t);
  }
}
var ae = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(ae || {});
function Js(e) {
  return e;
}
function wt(e, r) {
  for (let t = 0, n = r.length; t < n; t++) {
    let a = r[t];
    e.has(a) || (e.add(a), a.extends && wt(e, a.extends));
  }
}
function A(e) {
  if (e) {
    let r = /* @__PURE__ */ new Set();
    return wt(r, e), [...r];
  }
}
function ht(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new Je(e);
  }
}
var Dn = 1e6, Fn = 1e4, Bn = 2e4;
function _t(e, r) {
  switch (r) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var Mn = 1e3;
function kt(e, r) {
  var t;
  return { mode: e, plugins: r.plugins, refs: r.refs || /* @__PURE__ */ new Map(), features: (t = r.features) != null ? t : 63 ^ (r.disabledFeatures || 0), depthLimit: r.depthLimit || Mn };
}
function Dt(e) {
  return { mode: 1, base: kt(1, e), child: o, state: { marked: new Set(e.markedRefs) } };
}
var zr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  deserialize(r) {
    return p$1(this._p, this.depth, r);
  }
};
function Bt(e, r) {
  if (r < 0 || !Number.isFinite(r) || !Number.isInteger(r)) throw new w$1({ t: 4, i: r });
  if (e.refs.has(r)) throw new Error("Conflicted ref id: " + r);
}
function Vn(e, r, t) {
  return Bt(e.base, r), e.state.marked.has(r) && e.base.refs.set(r, t), t;
}
function Ln(e, r, t) {
  return Bt(e.base, r), e.base.refs.set(r, t), t;
}
function v(e, r, t) {
  return e.mode === 1 ? Vn(e, r, t) : Ln(e, r, t);
}
function _r(e, r, t) {
  if (Object.hasOwn(r, t)) return r[t];
  throw new w$1(e);
}
function Un(e, r) {
  return v(e, r.i, it(F(r.s)));
}
function jn(e, r, t) {
  let n = t.a, a = n.length, s = v(e, t.i, new Array(a));
  for (let i = 0, u2; i < a; i++) u2 = n[i], u2 && (s[i] = p$1(e, r, u2));
  return _t(s, t.o), s;
}
function Yn(e) {
  switch (e) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function Wn(e) {
  switch (e) {
    case N:
    case I:
    case P$1:
    case b:
      return true;
    default:
      return false;
  }
}
function zt(e, r, t) {
  Yn(r) ? e[r] = t : Object.defineProperty(e, r, { value: t, configurable: true, enumerable: true, writable: true });
}
function Gn(e, r, t, n, a) {
  if (typeof n == "string") zt(t, n, p$1(e, r, a));
  else {
    let s = p$1(e, r, n);
    switch (typeof s) {
      case "string":
        zt(t, s, p$1(e, r, a));
        break;
      case "symbol":
        Wn(s) && (t[s] = p$1(e, r, a));
        break;
      default:
        throw new w$1(n);
    }
  }
}
function Mt(e, r, t, n) {
  let a = t.k;
  if (a.length > 0) for (let i = 0, u2 = t.v, l = a.length; i < l; i++) Gn(e, r, n, a[i], u2[i]);
  return n;
}
function Kn(e, r, t) {
  let n = v(e, t.i, t.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
  return Mt(e, r, t.p, n), _t(n, t.o), n;
}
function Hn(e, r) {
  return v(e, r.i, new Date(r.s));
}
function Jn(e, r) {
  if (e.base.features & 32) {
    let t = F(r.c);
    if (t.length > Bn) throw new w$1(r);
    return v(e, r.i, new RegExp(t, r.m));
  }
  throw new O(r);
}
function Zn(e, r, t) {
  let n = v(e, t.i, /* @__PURE__ */ new Set());
  for (let a = 0, s = t.a, i = s.length; a < i; a++) n.add(p$1(e, r, s[a]));
  return n;
}
function $n(e, r, t) {
  let n = v(e, t.i, /* @__PURE__ */ new Map());
  for (let a = 0, s = t.e.k, i = t.e.v, u2 = s.length; a < u2; a++) n.set(p$1(e, r, s[a]), p$1(e, r, i[a]));
  return n;
}
function qn(e, r) {
  if (r.s.length > Dn) throw new w$1(r);
  return v(e, r.i, Pr(F(r.s)));
}
function Xn(e, r, t) {
  var u2;
  let n = ht(t.c), a = p$1(e, r, t.f), s = (u2 = t.b) != null ? u2 : 0;
  if (s < 0 || s > a.byteLength) throw new w$1(t);
  return v(e, t.i, new n(a, s, t.l));
}
function Qn(e, r, t) {
  var i;
  let n = p$1(e, r, t.f), a = (i = t.b) != null ? i : 0;
  if (a < 0 || a > n.byteLength) throw new w$1(t);
  return v(e, t.i, new DataView(n, a, t.l));
}
function Vt(e, r, t, n) {
  if (t.p) {
    let a = Mt(e, r, t.p, {});
    Object.defineProperties(n, Object.getOwnPropertyDescriptors(a));
  }
  return n;
}
function eo(e, r, t) {
  let n = v(e, t.i, new AggregateError([], F(t.m)));
  return Vt(e, r, t, n);
}
function ro(e, r, t) {
  let n = _r(t, rt, t.s), a = v(e, t.i, new n(F(t.m)));
  return Vt(e, r, t, a);
}
function to(e, r, t) {
  let n = re$1(), a = v(e, t.i, n.p), s = p$1(e, r, t.f);
  return t.s ? n.s(s) : n.f(s), a;
}
function no(e, r, t) {
  return v(e, t.i, Object(p$1(e, r, t.f)));
}
function oo(e, r, t) {
  let n = e.base.plugins;
  if (n) {
    let a = F(t.c);
    for (let s = 0, i = n.length; s < i; s++) {
      let u2 = n[s];
      if (u2.tag === a) return v(e, t.i, u2.deserialize(t.s, new zr(e, r), { id: t.i }));
    }
  }
  throw new Q(t.c);
}
function ao(e, r) {
  return v(e, r.i, v(e, r.s, re$1()).p);
}
function so(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n) return n.s(p$1(e, r, t.a[1])), o;
  throw new B("Promise");
}
function io(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n) return n.f(p$1(e, r, t.a[1])), o;
  throw new B("Promise");
}
function uo(e, r, t) {
  p$1(e, r, t.a[0]);
  let n = p$1(e, r, t.a[1]);
  return It(n);
}
function lo(e, r, t) {
  p$1(e, r, t.a[0]);
  let n = p$1(e, r, t.a[1]);
  return Et(n);
}
function co(e, r, t) {
  let n = v(e, t.i, te()), a = t.a, s = a.length;
  if (s) for (let i = 0; i < s; i++) p$1(e, r, a[i]);
  return n;
}
function fo(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n && M(n)) return n.next(p$1(e, r, t.f)), o;
  throw new B("Stream");
}
function So(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n && M(n)) return n.throw(p$1(e, r, t.f)), o;
  throw new B("Stream");
}
function mo(e, r, t) {
  let n = e.base.refs.get(t.i);
  if (n && M(n)) return n.return(p$1(e, r, t.f)), o;
  throw new B("Stream");
}
function po(e, r, t) {
  return p$1(e, r, t.f), o;
}
function go(e, r, t) {
  return p$1(e, r, t.a[1]), o;
}
function p$1(e, r, t) {
  if (r > e.base.depthLimit) throw new ee$1(e.base.depthLimit);
  switch (r += 1, t.t) {
    case 2:
      return _r(t, et, t.s);
    case 0:
      return Number(t.s);
    case 1:
      return F(String(t.s));
    case 3:
      if (String(t.s).length > Fn) throw new w$1(t);
      return BigInt(t.s);
    case 4:
      return e.base.refs.get(t.i);
    case 18:
      return Un(e, t);
    case 9:
      return jn(e, r, t);
    case 10:
    case 11:
      return Kn(e, r, t);
    case 5:
      return Hn(e, t);
    case 6:
      return Jn(e, t);
    case 7:
      return Zn(e, r, t);
    case 8:
      return $n(e, r, t);
    case 19:
      return qn(e, t);
    case 16:
    case 15:
      return Xn(e, r, t);
    case 20:
      return Qn(e, r, t);
    case 14:
      return eo(e, r, t);
    case 13:
      return ro(e, r, t);
    case 12:
      return to(e, r, t);
    case 17:
      return _r(t, Xr, t.s);
    case 21:
      return no(e, r, t);
    case 25:
      return oo(e, r, t);
    case 22:
      return ao(e, t);
    case 23:
      return so(e, r, t);
    case 24:
      return io(e, r, t);
    case 28:
      return uo(e, r, t);
    case 30:
      return lo(e, r, t);
    case 31:
      return co(e, r, t);
    case 32:
      return fo(e, r, t);
    case 33:
      return So(e, r, t);
    case 34:
      return mo(e, r, t);
    case 27:
      return po(e, r, t);
    case 29:
      return go(e, r, t);
    default:
      throw new O(t);
  }
}
function nr(e, r) {
  try {
    return p$1(e, 0, r);
  } catch (t) {
    throw new He(t);
  }
}
var yo = () => T, No = yo.toString(), Lt = /=>/.test(No);
function or(e, r) {
  return Lt ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function Ut(e, r) {
  return Lt ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var Wt = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_", jt = Wt.length, Gt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_", Yt = Gt.length;
function kr(e) {
  let r = e % jt, t = Wt[r];
  for (e = (e - r) / jt; e > 0; ) r = e % Yt, t += Gt[r], e = (e - r) / Yt;
  return t;
}
var bo = /^[$A-Z_][0-9A-Z_$]*$/i;
function Dr(e) {
  let r = e[0];
  return (r === "$" || r === "_" || r >= "A" && r <= "Z" || r >= "a" && r <= "z") && bo.test(e);
}
function ye(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
  }
}
function Co(e) {
  let r = [], t = e[0];
  for (let n = 1, a = e.length, s, i = t; n < a; n++) s = e[n], s.t === 0 && s.v === i.v ? t = { t: 0, s: s.s, k: o, v: ye(t) } : s.t === 2 && s.s === i.s ? t = { t: 2, s: ye(t), k: s.k, v: s.v } : s.t === 1 && s.s === i.s ? t = { t: 1, s: ye(t), k: o, v: s.v } : s.t === 3 && s.s === i.s ? t = { t: 3, s: ye(t), k: s.k, v: o } : (r.push(t), t = s), i = s;
  return r.push(t), r;
}
function qt(e) {
  if (e.length) {
    let r = "", t = Co(e);
    for (let n = 0, a = t.length; n < a; n++) r += ye(t[n]) + ",";
    return r;
  }
  return o;
}
var vo = "Object.create(null)", Ao = "new Set", Ro = "new Map", Eo = "Promise.resolve", Io = "Promise.reject", Po = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: o };
function Xt(e, r) {
  return { mode: e, plugins: r.plugins, features: r.features, marked: new Set(r.markedRefs), stack: [], flags: [], assignments: [] };
}
function sr(e) {
  return { mode: 2, base: Xt(2, e), state: e, child: o };
}
var Fr = class {
  constructor(r) {
    this._p = r;
  }
  serialize(r) {
    return f(this._p, r);
  }
};
function To(e, r) {
  let t = e.valid.get(r);
  t == null && (t = e.valid.size, e.valid.set(r, t));
  let n = e.vars[t];
  return n == null && (n = kr(t), e.vars[t] = n), n;
}
function Oo(e) {
  return ce + "[" + e + "]";
}
function m(e, r) {
  return e.mode === 1 ? To(e.state, r) : Oo(r);
}
function h(e, r) {
  e.marked.add(r);
}
function Br(e, r) {
  return e.marked.has(r);
}
function Vr(e, r, t) {
  r !== 0 && (h(e.base, t), e.base.flags.push({ type: r, value: m(e, t) }));
}
function wo(e) {
  let r = "";
  for (let t = 0, n = e.flags, a = n.length; t < a; t++) {
    let s = n[t];
    r += Po[s.type] + "(" + s.value + "),";
  }
  return r;
}
function Qt(e) {
  let r = qt(e.assignments), t = wo(e);
  return r ? t ? r + t : r : t;
}
function en(e, r, t) {
  e.assignments.push({ t: 0, s: r, k: o, v: t });
}
function ho(e, r, t) {
  e.base.assignments.push({ t: 1, s: m(e, r), k: o, v: t });
}
function ge(e, r, t, n) {
  e.base.assignments.push({ t: 2, s: m(e, r), k: t, v: n });
}
function Kt(e, r, t) {
  e.base.assignments.push({ t: 3, s: m(e, r), k: t, v: o });
}
function Ne(e, r, t, n) {
  en(e.base, m(e, r) + "[" + t + "]", n);
}
function Mr(e, r, t, n) {
  en(e.base, m(e, r) + "." + t, n);
}
function V(e, r) {
  return r.t === 4 && e.stack.includes(r.i);
}
function se(e, r, t) {
  return e.mode === 1 && !Br(e.base, r) ? t : m(e, r) + "=" + t;
}
function zo(e) {
  return U + '.get("' + e.s + '")';
}
function Ht(e, r, t, n) {
  return t ? V(e.base, t) ? (h(e.base, r), Ne(e, r, n, m(e, t.i)), "") : f(e, t) : "";
}
function _o(e, r) {
  let t = r.i, n = r.a, a = n.length;
  if (a > 0) {
    e.base.stack.push(t);
    let s = Ht(e, t, n[0], 0), i = s === "";
    for (let u2 = 1, l; u2 < a; u2++) l = Ht(e, t, n[u2], u2), s += "," + l, i = l === "";
    return e.base.stack.pop(), Vr(e, r.o, r.i), "[" + s + (i ? ",]" : "]");
  }
  return "[]";
}
function Jt(e, r, t, n) {
  if (typeof t == "string") {
    let a = Number(t), s = a >= 0 && a.toString() === t || Dr(t);
    if (V(e.base, n)) {
      let i = m(e, n.i);
      return h(e.base, r.i), s && a !== a ? Mr(e, r.i, t, i) : Ne(e, r.i, s ? t : '"' + t + '"', i), "";
    }
    return (s ? t : '"' + t + '"') + ":" + f(e, n);
  }
  return "[" + f(e, t) + "]:" + f(e, n);
}
function rn(e, r, t) {
  let n = t.k, a = n.length;
  if (a > 0) {
    let s = t.v;
    e.base.stack.push(r.i);
    let i = Jt(e, r, n[0], s[0]);
    for (let u2 = 1, l = i; u2 < a; u2++) l = Jt(e, r, n[u2], s[u2]), i += (l && i && ",") + l;
    return e.base.stack.pop(), "{" + i + "}";
  }
  return "{}";
}
function ko(e, r) {
  return Vr(e, r.o, r.i), rn(e, r, r.p);
}
function Do(e, r, t, n) {
  let a = rn(e, r, t);
  return a !== "{}" ? "Object.assign(" + n + "," + a + ")" : n;
}
function Fo(e, r, t, n, a) {
  let s = e.base, i = f(e, a), u2 = Number(n), l = u2 >= 0 && u2.toString() === n || Dr(n);
  if (V(s, a)) l && u2 !== u2 ? Mr(e, r.i, n, i) : Ne(e, r.i, l ? n : '"' + n + '"', i);
  else {
    let g = s.assignments;
    s.assignments = t, l && u2 !== u2 ? Mr(e, r.i, n, i) : Ne(e, r.i, l ? n : '"' + n + '"', i), s.assignments = g;
  }
}
function Bo(e, r, t, n, a) {
  if (typeof n == "string") Fo(e, r, t, n, a);
  else {
    let s = e.base, i = s.stack;
    s.stack = [];
    let u2 = f(e, a);
    s.stack = i;
    let l = s.assignments;
    s.assignments = t, Ne(e, r.i, f(e, n), u2), s.assignments = l;
  }
}
function Mo(e, r, t) {
  let n = t.k, a = n.length;
  if (a > 0) {
    let s = [], i = t.v;
    e.base.stack.push(r.i);
    for (let u2 = 0; u2 < a; u2++) Bo(e, r, s, n[u2], i[u2]);
    return e.base.stack.pop(), qt(s);
  }
  return o;
}
function Lr(e, r, t) {
  if (r.p) {
    let n = e.base;
    if (n.features & 8) t = Do(e, r, r.p, t);
    else {
      h(n, r.i);
      let a = Mo(e, r, r.p);
      if (a) return "(" + se(e, r.i, t) + "," + a + m(e, r.i) + ")";
    }
  }
  return t;
}
function Vo(e, r) {
  return Vr(e, r.o, r.i), Lr(e, r, vo);
}
function Lo(e) {
  return 'new Date("' + e.s + '")';
}
function Uo(e, r) {
  if (e.base.features & 32) return "/" + r.c + "/" + r.m;
  throw new O(r);
}
function Zt(e, r, t) {
  let n = e.base;
  return V(n, t) ? (h(n, r), ho(e, r, m(e, t.i)), "") : f(e, t);
}
function jo(e, r) {
  let t = Ao, n = r.a, a = n.length, s = r.i;
  if (a > 0) {
    e.base.stack.push(s);
    let i = Zt(e, s, n[0]);
    for (let u2 = 1, l = i; u2 < a; u2++) l = Zt(e, s, n[u2]), i += (l && i && ",") + l;
    e.base.stack.pop(), i && (t += "([" + i + "])");
  }
  return t;
}
function $t(e, r, t, n, a) {
  let s = e.base;
  if (V(s, t)) {
    let i = m(e, t.i);
    if (h(s, r), V(s, n)) {
      let l = m(e, n.i);
      return ge(e, r, i, l), "";
    }
    if (n.t !== 4 && n.i != null && Br(s, n.i)) {
      let l = "(" + f(e, n) + ",[" + a + "," + a + "])";
      return ge(e, r, i, m(e, n.i)), Kt(e, r, a), l;
    }
    let u2 = s.stack;
    return s.stack = [], ge(e, r, i, f(e, n)), s.stack = u2, "";
  }
  if (V(s, n)) {
    let i = m(e, n.i);
    if (h(s, r), t.t !== 4 && t.i != null && Br(s, t.i)) {
      let l = "(" + f(e, t) + ",[" + a + "," + a + "])";
      return ge(e, r, m(e, t.i), i), Kt(e, r, a), l;
    }
    let u2 = s.stack;
    return s.stack = [], ge(e, r, f(e, t), i), s.stack = u2, "";
  }
  return "[" + f(e, t) + "," + f(e, n) + "]";
}
function Yo(e, r) {
  let t = Ro, n = r.e.k, a = n.length, s = r.i, i = r.f, u2 = m(e, i.i), l = e.base;
  if (a > 0) {
    let g = r.e.v;
    l.stack.push(s);
    let S = $t(e, s, n[0], g[0], u2);
    for (let d = 1, H = S; d < a; d++) H = $t(e, s, n[d], g[d], u2), S += (H && S && ",") + H;
    l.stack.pop(), S && (t += "([" + S + "])");
  }
  return i.t === 26 && (h(l, i.i), t = "(" + f(e, i) + "," + t + ")"), t;
}
function Wo(e, r) {
  return G(e, r.f) + '("' + r.s + '")';
}
function Go(e, r) {
  return "new " + r.c + "(" + f(e, r.f) + "," + r.b + "," + r.l + ")";
}
function Ko(e, r) {
  return "new DataView(" + f(e, r.f) + "," + r.b + "," + r.l + ")";
}
function Ho(e, r) {
  let t = r.i;
  e.base.stack.push(t);
  let n = Lr(e, r, 'new AggregateError([],"' + r.m + '")');
  return e.base.stack.pop(), n;
}
function Jo(e, r) {
  return Lr(e, r, "new " + ve[r.s] + '("' + r.m + '")');
}
function Zo(e, r) {
  let t, n = r.f, a = r.i, s = r.s ? Eo : Io, i = e.base;
  if (V(i, n)) {
    let u2 = m(e, n.i);
    t = s + (r.s ? "().then(" + or([], u2) + ")" : "().catch(" + Ut([], "throw " + u2) + ")");
  } else {
    i.stack.push(a);
    let u2 = f(e, n);
    i.stack.pop(), t = s + "(" + u2 + ")";
  }
  return t;
}
function $o(e, r) {
  return "Object(" + f(e, r.f) + ")";
}
function G(e, r) {
  let t = f(e, r);
  return r.t === 4 ? t : "(" + t + ")";
}
function qo(e, r) {
  if (e.mode === 1) throw new O(r);
  return "(" + se(e, r.s, G(e, r.f) + "()") + ").p";
}
function Xo(e, r) {
  if (e.mode === 1) throw new O(r);
  return G(e, r.a[0]) + "(" + m(e, r.i) + "," + f(e, r.a[1]) + ")";
}
function Qo(e, r) {
  if (e.mode === 1) throw new O(r);
  return G(e, r.a[0]) + "(" + m(e, r.i) + "," + f(e, r.a[1]) + ")";
}
function ea(e, r) {
  let t = e.base.plugins;
  if (t) for (let n = 0, a = t.length; n < a; n++) {
    let s = t[n];
    if (s.tag === r.c) return e.child == null && (e.child = new Fr(e)), s.serialize(r.s, e.child, { id: r.i });
  }
  throw new Q(r.c);
}
function ra(e, r) {
  let t = "", n = false;
  return r.f.t !== 4 && (h(e.base, r.f.i), t = "(" + f(e, r.f) + ",", n = true), t += se(e, r.i, "(" + yt + ")(" + m(e, r.f.i) + ")"), n && (t += ")"), t;
}
function ta(e, r) {
  return G(e, r.a[0]) + "(" + f(e, r.a[1]) + ")";
}
function na(e, r) {
  let t = r.a[0], n = r.a[1], a = e.base, s = "";
  t.t !== 4 && (h(a, t.i), s += "(" + f(e, t)), n.t !== 4 && (h(a, n.i), s += (s ? "," : "(") + f(e, n)), s && (s += ",");
  let i = se(e, r.i, "(" + Nt + ")(" + m(e, n.i) + "," + m(e, t.i) + ")");
  return s ? s + i + ")" : i;
}
function oa(e, r) {
  return G(e, r.a[0]) + "(" + f(e, r.a[1]) + ")";
}
function aa(e, r) {
  let t = se(e, r.i, G(e, r.f) + "()"), n = r.a.length;
  if (n) {
    let a = f(e, r.a[0]);
    for (let s = 1; s < n; s++) a += "," + f(e, r.a[s]);
    return "(" + t + "," + a + "," + m(e, r.i) + ")";
  }
  return t;
}
function sa(e, r) {
  return m(e, r.i) + ".next(" + f(e, r.f) + ")";
}
function ia(e, r) {
  return m(e, r.i) + ".throw(" + f(e, r.f) + ")";
}
function ua(e, r) {
  return m(e, r.i) + ".return(" + f(e, r.f) + ")";
}
function la(e, r) {
  switch (r.t) {
    case 17:
      return qr[r.s];
    case 18:
      return zo(r);
    case 9:
      return _o(e, r);
    case 10:
      return ko(e, r);
    case 11:
      return Vo(e, r);
    case 5:
      return Lo(r);
    case 6:
      return Uo(e, r);
    case 7:
      return jo(e, r);
    case 8:
      return Yo(e, r);
    case 19:
      return Wo(e, r);
    case 16:
    case 15:
      return Go(e, r);
    case 20:
      return Ko(e, r);
    case 14:
      return Ho(e, r);
    case 13:
      return Jo(e, r);
    case 12:
      return Zo(e, r);
    case 21:
      return $o(e, r);
    case 22:
      return qo(e, r);
    case 25:
      return ea(e, r);
    case 26:
      return Rt[r.s];
    default:
      throw new O(r);
  }
}
function f(e, r) {
  switch (r.t) {
    case 2:
      return Qr[r.s];
    case 0:
      return "" + r.s;
    case 1:
      return '"' + r.s + '"';
    case 3:
      return r.s + "n";
    case 4:
      return m(e, r.i);
    case 23:
      return Xo(e, r);
    case 24:
      return Qo(e, r);
    case 27:
      return ra(e, r);
    case 28:
      return ta(e, r);
    case 29:
      return na(e, r);
    case 30:
      return oa(e, r);
    case 31:
      return aa(e, r);
    case 32:
      return sa(e, r);
    case 33:
      return ia(e, r);
    case 34:
      return ua(e, r);
    default:
      return se(e, r.i, la(e, r));
  }
}
function ur(e, r) {
  let t = f(e, r), n = r.i;
  if (n == null) return t;
  let a = Qt(e.base), s = m(e, n), i = e.state.scopeId, u2 = i == null ? "" : ce, l = a ? "(" + t + "," + a + s + ")" : t;
  if (u2 === "") return r.t === 10 && !a ? "(" + l + ")" : l;
  let g = i == null ? "()" : "(" + ce + '["' + y(i) + '"])';
  return "(" + or([u2], l) + ")" + g;
}
var jr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return R(this._p, this.depth, r);
  }
}, Yr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return R(this._p, this.depth, r);
  }
  parseWithError(r) {
    return K(this._p, this.depth, r);
  }
  isAlive() {
    return this._p.state.alive;
  }
  pushPendingState() {
    Jr(this._p);
  }
  popPendingState() {
    be(this._p);
  }
  onParse(r) {
    ie(this._p, r);
  }
  onError(r) {
    Kr(this._p, r);
  }
};
function ca(e) {
  return { alive: true, pending: 0, initial: true, buffer: [], onParse: e.onParse, onError: e.onError, onDone: e.onDone };
}
function Wr(e) {
  return { type: 2, base: pe(2, e), state: ca(e) };
}
function fa(e, r, t) {
  let n = [];
  for (let a = 0, s = t.length; a < s; a++) a in t ? n[a] = R(e, r, t[a]) : n[a] = 0;
  return n;
}
function Sa(e, r, t, n) {
  return _e(t, n, fa(e, r, n));
}
function Gr(e, r, t) {
  let n = Object.entries(t), a = [], s = [];
  for (let i = 0, u2 = n.length; i < u2; i++) a.push(y(n[i][0])), s.push(R(e, r, n[i][1]));
  return b in t && (a.push(E(e.base, b)), s.push(Ue(Xe(e.base), R(e, r, $e(t))))), N in t && (a.push(E(e.base, N)), s.push(je(Qe(e.base), R(e, r, e.type === 1 ? te() : Ze(t))))), P$1 in t && (a.push(E(e.base, P$1)), s.push(X(t[P$1]))), I in t && (a.push(E(e.base, I)), s.push(t[I] ? Z : $)), { k: a, v: s };
}
function Ur(e, r, t, n, a) {
  return er(t, n, a, Gr(e, r, n));
}
function ma(e, r, t, n) {
  return ke(t, R(e, r, n.valueOf()));
}
function pa(e, r, t, n) {
  return De(t, n, R(e, r, n.buffer));
}
function da(e, r, t, n) {
  return Fe(t, n, R(e, r, n.buffer));
}
function ga(e, r, t, n) {
  return Be(t, n, R(e, r, n.buffer));
}
function tn(e, r, t, n) {
  let a = q(n, e.base.features);
  return Me(t, n, a ? Gr(e, r, a) : o);
}
function ya(e, r, t, n) {
  let a = q(n, e.base.features);
  return Ve(t, n, a ? Gr(e, r, a) : o);
}
function Na(e, r, t, n) {
  let a = [], s = [];
  for (let [i, u2] of n.entries()) a.push(R(e, r, i)), s.push(R(e, r, u2));
  return rr(e.base, t, a, s);
}
function ba(e, r, t, n) {
  let a = [];
  for (let s of n.keys()) a.push(R(e, r, s));
  return Le(t, a);
}
function Ca(e, r, t, n) {
  let a = Ye(t, k(e.base, 4), []);
  return e.type === 1 || (Jr(e), n.on({ next: (s) => {
    if (e.state.alive) {
      let i = K(e, r, s);
      i && ie(e, We(t, i));
    }
  }, throw: (s) => {
    if (e.state.alive) {
      let i = K(e, r, s);
      i && ie(e, Ge(t, i));
    }
    be(e);
  }, return: (s) => {
    if (e.state.alive) {
      let i = K(e, r, s);
      i && ie(e, Ke(t, i));
    }
    be(e);
  } })), a;
}
function va(e, r, t) {
  if (this.state.alive) {
    let n = K(this, r, t);
    n && ie(this, c(23, e, o, o, o, o, o, [k(this.base, 2), n], o, o, o, o)), be(this);
  }
}
function Aa(e, r, t) {
  if (this.state.alive) {
    let n = K(this, r, t);
    n && ie(this, c(24, e, o, o, o, o, o, [k(this.base, 3), n], o, o, o, o));
  }
  be(this);
}
function Ra(e, r, t, n) {
  let a = Tr(e.base, {});
  return e.type === 2 && (Jr(e), n.then(va.bind(e, a, r), Aa.bind(e, a, r))), xt(e.base, t, a);
}
function Ea(e, r, t, n, a) {
  for (let s = 0, i = a.length; s < i; s++) {
    let u2 = a[s];
    if (u2.parse.sync && u2.test(n)) return fe(t, u2.tag, u2.parse.sync(n, new jr(e, r), { id: t }));
  }
  return o;
}
function Ia(e, r, t, n, a) {
  for (let s = 0, i = a.length; s < i; s++) {
    let u2 = a[s];
    if (u2.parse.stream && u2.test(n)) return fe(t, u2.tag, u2.parse.stream(n, new Yr(e, r), { id: t }));
  }
  return o;
}
function nn(e, r, t, n) {
  let a = e.base.plugins;
  return a ? e.type === 1 ? Ea(e, r, t, n, a) : Ia(e, r, t, n, a) : o;
}
function Pa(e, r, t, n, a) {
  switch (a) {
    case Object:
      return Ur(e, r, t, n, false);
    case o:
      return Ur(e, r, t, n, true);
    case Date:
      return he(t, n);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return tn(e, r, t, n);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return ma(e, r, t, n);
    case ArrayBuffer:
      return tr(e.base, t, n);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return pa(e, r, t, n);
    case DataView:
      return ga(e, r, t, n);
    case Map:
      return Na(e, r, t, n);
    case Set:
      return ba(e, r, t, n);
  }
  if (a === Promise || n instanceof Promise) return Ra(e, r, t, n);
  let s = e.base.features;
  if (s & 32 && a === RegExp) return ze(t, n);
  if (s & 16) switch (a) {
    case BigInt64Array:
    case BigUint64Array:
      return da(e, r, t, n);
  }
  if (s & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n instanceof AggregateError)) return ya(e, r, t, n);
  if (n instanceof Error) return tn(e, r, t, n);
  if (b in n || N in n) return Ur(e, r, t, n, !!a);
  throw new x(n);
}
function xa(e, r, t, n) {
  if (Array.isArray(n)) return Sa(e, r, t, n);
  if (M(n)) return Ca(e, r, t, n);
  let a = n.constructor;
  if (a === Y) return R(e, r, n.replacement);
  let s = nn(e, r, t, n);
  return s || Pa(e, r, t, n, a);
}
function Ta(e, r, t) {
  let n = W(e.base, t);
  if (n.type !== 0) return n.value;
  let a = nn(e, r, n.value, t);
  if (a) return a;
  throw new x(t);
}
function R(e, r, t) {
  if (r >= e.base.depthLimit) throw new ee$1(e.base.depthLimit);
  switch (typeof t) {
    case "boolean":
      return t ? Z : $;
    case "undefined":
      return Ae;
    case "string":
      return X(t);
    case "number":
      return Oe(t);
    case "bigint":
      return we(t);
    case "object": {
      if (t) {
        let n = W(e.base, t);
        return n.type === 0 ? xa(e, r + 1, n.value, t) : n.value;
      }
      return Re;
    }
    case "symbol":
      return E(e.base, t);
    case "function":
      return Ta(e, r, t);
    default:
      throw new x(t);
  }
}
function ie(e, r) {
  e.state.initial ? e.state.buffer.push(r) : Hr(e, r, false);
}
function Kr(e, r) {
  if (e.state.onError) e.state.onError(r);
  else throw r instanceof z ? r : new z(r);
}
function on(e) {
  e.state.onDone && e.state.onDone();
}
function Hr(e, r, t) {
  try {
    e.state.onParse(r, t);
  } catch (n) {
    Kr(e, n);
  }
}
function Jr(e) {
  e.state.pending++;
}
function be(e) {
  --e.state.pending <= 0 && on(e);
}
function K(e, r, t) {
  try {
    return R(e, r, t);
  } catch (n) {
    return Kr(e, n), o;
  }
}
function Zr(e, r) {
  let t = K(e, 0, r);
  t && (Hr(e, t, true), e.state.initial = false, Oa(e, e.state), e.state.pending <= 0 && lr(e));
}
function Oa(e, r) {
  for (let t = 0, n = r.buffer.length; t < n; t++) Hr(e, r.buffer[t], false);
}
function lr(e) {
  e.state.alive && (on(e), e.state.alive = false);
}
async function Zi(e, r = {}) {
  let t = A(r.plugins), n = ne(2, { plugins: t, disabledFeatures: r.disabledFeatures, refs: r.refs });
  return await oe(n, e);
}
function an(e, r) {
  let t = A(r.plugins), n = Wr({ plugins: t, refs: r.refs, disabledFeatures: r.disabledFeatures, onParse(a, s) {
    let i = sr({ plugins: t, features: n.base.features, scopeId: r.scopeId, markedRefs: n.base.marked }), u2;
    try {
      u2 = ur(i, a);
    } catch (l) {
      r.onError && r.onError(l);
      return;
    }
    r.onSerialize(u2, s);
  }, onError: r.onError, onDone: r.onDone });
  return Zr(n, e), lr.bind(null, n);
}
function $i(e, r) {
  let t = A(r.plugins), n = Wr({ plugins: t, refs: r.refs, disabledFeatures: r.disabledFeatures, onParse: r.onParse, onError: r.onError, onDone: r.onDone });
  return Zr(n, e), lr.bind(null, n);
}
function du(e, r = {}) {
  var i;
  let t = A(r.plugins), n = r.disabledFeatures || 0, a = (i = e.f) != null ? i : 63, s = Dt({ plugins: t, markedRefs: e.m, features: a & ~n, disabledFeatures: n });
  return nr(s, e.t);
}
const GLOBAL_TSR = "$_TSR";
const TSR_SCRIPT_BARRIER_ID = "$tsr-stream-barrier";
function createSerializationAdapter(opts) {
  return opts;
}
function makeSsrSerovalPlugin(serializationAdapter, options) {
  return Js({
    tag: "$TSR/t/" + serializationAdapter.key,
    test: serializationAdapter.test,
    parse: {
      stream(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      }
    },
    serialize(node, ctx) {
      options.didRun = true;
      return GLOBAL_TSR + '.t.get("' + serializationAdapter.key + '")(' + ctx.serialize(node) + ")";
    },
    // we never deserialize on the server during SSR
    deserialize: void 0
  });
}
function makeSerovalPlugin(serializationAdapter) {
  return Js({
    tag: "$TSR/t/" + serializationAdapter.key,
    test: serializationAdapter.test,
    parse: {
      sync(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      },
      async async(value, ctx) {
        return await ctx.parse(serializationAdapter.toSerializable(value));
      },
      stream(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      }
    },
    // we don't generate JS code outside of SSR (for now)
    serialize: void 0,
    deserialize(node, ctx) {
      return serializationAdapter.fromSerializable(ctx.deserialize(node));
    }
  });
}
var p = {}, P = (e) => new ReadableStream({ start: (r) => {
  e.on({ next: (a) => {
    try {
      r.enqueue(a);
    } catch (t) {
    }
  }, throw: (a) => {
    r.error(a);
  }, return: () => {
    try {
      r.close();
    } catch (a) {
    }
  } });
} }), ee2 = Js({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === p;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize() {
  return P.toString();
}, deserialize() {
  return p;
} });
function w2(e) {
  let r = te(), a = e.getReader();
  async function t() {
    try {
      let n = await a.read();
      n.done ? r.return(n.value) : (r.next(n.value), await t());
    } catch (n) {
      r.throw(n);
    }
  }
  return t().catch(() => {
  }), r;
}
var re = Js({ tag: "seroval/plugins/web/ReadableStream", extends: [ee2], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(p), stream: r.parse(te()) };
}, async async(e, r) {
  return { factory: await r.parse(p), stream: await r.parse(w2(e)) };
}, stream(e, r) {
  return { factory: r.parse(p), stream: r.parse(w2(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a = r.deserialize(e.stream);
  return P(a);
} }), u = re;
const ShallowErrorPlugin = /* @__PURE__ */ Js({
  tag: "$TSR/Error",
  test(value) {
    return value instanceof Error;
  },
  parse: {
    sync(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    },
    async async(value, ctx) {
      return {
        message: await ctx.parse(value.message)
      };
    },
    stream(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    }
  },
  serialize(node, ctx) {
    return "new Error(" + ctx.serialize(node.message) + ")";
  },
  deserialize(node, ctx) {
    return new Error(ctx.deserialize(node.message));
  }
});
class RawStream {
  constructor(stream, options) {
    this.stream = stream;
    this.hint = options?.hint ?? "binary";
  }
}
const BufferCtor = globalThis.Buffer;
const hasNodeBuffer = !!BufferCtor && typeof BufferCtor.from === "function";
function uint8ArrayToBase64(bytes) {
  if (bytes.length === 0) return "";
  if (hasNodeBuffer) {
    return BufferCtor.from(bytes).toString("base64");
  }
  const CHUNK_SIZE = 32768;
  const chunks = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    chunks.push(String.fromCharCode.apply(null, chunk));
  }
  return btoa(chunks.join(""));
}
function base64ToUint8Array(base64) {
  if (base64.length === 0) return new Uint8Array(0);
  if (hasNodeBuffer) {
    const buf = BufferCtor.from(base64, "base64");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
const RAW_STREAM_FACTORY_BINARY = /* @__PURE__ */ Object.create(null);
const RAW_STREAM_FACTORY_TEXT = /* @__PURE__ */ Object.create(null);
const RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY = (stream) => new ReadableStream({
  start(controller) {
    stream.on({
      next(base64) {
        try {
          controller.enqueue(base64ToUint8Array(base64));
        } catch {
        }
      },
      throw(error) {
        controller.error(error);
      },
      return() {
        try {
          controller.close();
        } catch {
        }
      }
    });
  }
});
const textEncoderForFactory = new TextEncoder();
const RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT = (stream) => {
  return new ReadableStream({
    start(controller) {
      stream.on({
        next(value) {
          try {
            if (typeof value === "string") {
              controller.enqueue(textEncoderForFactory.encode(value));
            } else {
              controller.enqueue(base64ToUint8Array(value.$b64));
            }
          } catch {
          }
        },
        throw(error) {
          controller.error(error);
        },
        return() {
          try {
            controller.close();
          } catch {
          }
        }
      });
    }
  });
};
const FACTORY_BINARY = `(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))`;
const FACTORY_TEXT = `(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})`;
function toBinaryStream(readable) {
  const stream = te();
  const reader = readable.getReader();
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          stream.return(void 0);
          break;
        }
        stream.next(uint8ArrayToBase64(value));
      }
    } catch (error) {
      stream.throw(error);
    } finally {
      reader.releaseLock();
    }
  })();
  return stream;
}
function toTextStream(readable) {
  const stream = te();
  const reader = readable.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          try {
            const remaining = decoder.decode();
            if (remaining.length > 0) {
              stream.next(remaining);
            }
          } catch {
          }
          stream.return(void 0);
          break;
        }
        try {
          const text = decoder.decode(value, { stream: true });
          if (text.length > 0) {
            stream.next(text);
          }
        } catch {
          stream.next({ $b64: uint8ArrayToBase64(value) });
        }
      }
    } catch (error) {
      stream.throw(error);
    } finally {
      reader.releaseLock();
    }
  })();
  return stream;
}
const RawStreamFactoryBinaryPlugin = Js({
  tag: "tss/RawStreamFactory",
  test(value) {
    return value === RAW_STREAM_FACTORY_BINARY;
  },
  parse: {
    sync() {
      return void 0;
    },
    async() {
      return Promise.resolve(void 0);
    },
    stream() {
      return void 0;
    }
  },
  serialize() {
    return FACTORY_BINARY;
  },
  deserialize() {
    return RAW_STREAM_FACTORY_BINARY;
  }
});
const RawStreamFactoryTextPlugin = Js({
  tag: "tss/RawStreamFactoryText",
  test(value) {
    return value === RAW_STREAM_FACTORY_TEXT;
  },
  parse: {
    sync() {
      return void 0;
    },
    async() {
      return Promise.resolve(void 0);
    },
    stream() {
      return void 0;
    }
  },
  serialize() {
    return FACTORY_TEXT;
  },
  deserialize() {
    return RAW_STREAM_FACTORY_TEXT;
  }
});
const RawStreamSSRPlugin = Js({
  tag: "tss/RawStream",
  extends: [RawStreamFactoryBinaryPlugin, RawStreamFactoryTextPlugin],
  test(value) {
    return value instanceof RawStream;
  },
  parse: {
    sync(value, ctx) {
      const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
      return {
        hint: value.hint,
        factory: ctx.parse(factory),
        stream: ctx.parse(te())
      };
    },
    async async(value, ctx) {
      const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
      const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
      return {
        hint: value.hint,
        factory: await ctx.parse(factory),
        stream: await ctx.parse(encodedStream)
      };
    },
    stream(value, ctx) {
      const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
      const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
      return {
        hint: value.hint,
        factory: ctx.parse(factory),
        stream: ctx.parse(encodedStream)
      };
    }
  },
  serialize(node, ctx) {
    return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.stream) + ")";
  },
  deserialize(node, ctx) {
    const stream = ctx.deserialize(node.stream);
    return node.hint === "text" ? RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT(stream) : RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY(stream);
  }
});
function createRawStreamRPCPlugin(onRawStream) {
  let nextStreamId = 1;
  return Js({
    tag: "tss/RawStream",
    test(value) {
      return value instanceof RawStream;
    },
    parse: {
      async(value) {
        const streamId = nextStreamId++;
        onRawStream(streamId, value.stream);
        return Promise.resolve({ streamId });
      },
      stream(value) {
        const streamId = nextStreamId++;
        onRawStream(streamId, value.stream);
        return { streamId };
      }
    },
    serialize() {
      throw new Error(
        "RawStreamRPCPlugin.serialize should not be called. RPC uses JSON serialization, not JS code generation."
      );
    },
    deserialize() {
      throw new Error(
        "RawStreamRPCPlugin.deserialize should not be called. Use createRawStreamDeserializePlugin on client."
      );
    }
  });
}
const defaultSerovalPlugins = [
  ShallowErrorPlugin,
  // RawStreamSSRPlugin must come before ReadableStreamPlugin to match first
  RawStreamSSRPlugin,
  // ReadableStreamNode is not exported by seroval
  u
];
var reactExports = requireReact();
const React__default = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
function CatchBoundary(props) {
  const errorComponent = props.errorComponent ?? ErrorComponent;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundaryImpl,
    {
      getResetKey: props.getResetKey,
      onCatch: props.onCatch,
      children: ({ error, reset }) => {
        if (error) {
          return reactExports.createElement(errorComponent, {
            error,
            reset
          });
        }
        return props.children;
      }
    }
  );
}
class CatchBoundaryImpl extends reactExports.Component {
  constructor() {
    super(...arguments);
    this.state = { error: null };
  }
  static getDerivedStateFromProps(props) {
    return { resetKey: props.getResetKey() };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  reset() {
    this.setState({ error: null });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.error && prevState.resetKey !== this.state.resetKey) {
      this.reset();
    }
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }
  render() {
    return this.props.children({
      error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
      reset: () => {
        this.reset();
      }
    });
  }
}
function ErrorComponent({ error }) {
  const [show, setShow] = reactExports.useState(process.env.NODE_ENV !== "production");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: ".5rem", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: ".5rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { fontSize: "1rem" }, children: "Something went wrong!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          style: {
            appearance: "none",
            fontSize: ".6em",
            border: "1px solid currentColor",
            padding: ".1rem .2rem",
            fontWeight: "bold",
            borderRadius: ".25rem"
          },
          onClick: () => setShow((d) => !d),
          children: show ? "Hide Error" : "Show Error"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: ".25rem" } }),
    show ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "pre",
      {
        style: {
          fontSize: ".7em",
          border: "1px solid red",
          borderRadius: ".25rem",
          padding: ".3rem",
          color: "red",
          overflow: "auto"
        },
        children: error.message ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: error.message }) : null
      }
    ) }) : null
  ] });
}
function ClientOnly({ children, fallback = null }) {
  return useHydrated() ? /* @__PURE__ */ jsxRuntimeExports.jsx(React__default.Fragment, { children }) : /* @__PURE__ */ jsxRuntimeExports.jsx(React__default.Fragment, { children: fallback });
}
function useHydrated() {
  return React__default.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
function subscribe() {
  return () => {
  };
}
var isProduction = process.env.NODE_ENV === "production";
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }
    var text = "Warning: " + message;
    if (typeof console !== "undefined") {
      console.warn(text);
    }
    try {
      throw Error(text);
    } catch (x2) {
    }
  }
}
var withSelector = { exports: {} };
var withSelector_production = {};
var shim = { exports: {} };
var useSyncExternalStoreShim_production = {};
var hasRequiredUseSyncExternalStoreShim_production;
function requireUseSyncExternalStoreShim_production() {
  if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
  hasRequiredUseSyncExternalStoreShim_production = 1;
  var React = requireReact();
  function is(x2, y2) {
    return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect2 = React.useLayoutEffect, useDebugValue = React.useDebugValue;
  function useSyncExternalStore$2(subscribe2, getSnapshot) {
    var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
    useLayoutEffect2(
      function() {
        inst.value = value;
        inst.getSnapshot = getSnapshot;
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      },
      [subscribe2, value, getSnapshot]
    );
    useEffect(
      function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        return subscribe2(function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        });
      },
      [subscribe2]
    );
    useDebugValue(value);
    return value;
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function useSyncExternalStore$1(subscribe2, getSnapshot) {
    return getSnapshot();
  }
  var shim2 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
  useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim2;
  return useSyncExternalStoreShim_production;
}
var useSyncExternalStoreShim_development = {};
var hasRequiredUseSyncExternalStoreShim_development;
function requireUseSyncExternalStoreShim_development() {
  if (hasRequiredUseSyncExternalStoreShim_development) return useSyncExternalStoreShim_development;
  hasRequiredUseSyncExternalStoreShim_development = 1;
  "production" !== process.env.NODE_ENV && (function() {
    function is(x2, y2) {
      return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
    }
    function useSyncExternalStore$2(subscribe2, getSnapshot) {
      didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = true, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var value = getSnapshot();
      if (!didWarnUncachedGetSnapshot) {
        var cachedValue = getSnapshot();
        objectIs(value, cachedValue) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), didWarnUncachedGetSnapshot = true);
      }
      cachedValue = useState({
        inst: { value, getSnapshot }
      });
      var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
      useLayoutEffect2(
        function() {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        },
        [subscribe2, value, getSnapshot]
      );
      useEffect(
        function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          return subscribe2(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          });
        },
        [subscribe2]
      );
      useDebugValue(value);
      return value;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function useSyncExternalStore$1(subscribe2, getSnapshot) {
      return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = requireReact(), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect2 = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = false, didWarnUncachedGetSnapshot = false, shim2 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    useSyncExternalStoreShim_development.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim2;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();
  return useSyncExternalStoreShim_development;
}
var hasRequiredShim;
function requireShim() {
  if (hasRequiredShim) return shim.exports;
  hasRequiredShim = 1;
  if (process.env.NODE_ENV === "production") {
    shim.exports = requireUseSyncExternalStoreShim_production();
  } else {
    shim.exports = requireUseSyncExternalStoreShim_development();
  }
  return shim.exports;
}
var hasRequiredWithSelector_production;
function requireWithSelector_production() {
  if (hasRequiredWithSelector_production) return withSelector_production;
  hasRequiredWithSelector_production = 1;
  var React = requireReact(), shim2 = requireShim();
  function is(x2, y2) {
    return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim2.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
  withSelector_production.useSyncExternalStoreWithSelector = function(subscribe2, getSnapshot, getServerSnapshot, selector, isEqual) {
    var instRef = useRef(null);
    if (null === instRef.current) {
      var inst = { hasValue: false, value: null };
      instRef.current = inst;
    } else inst = instRef.current;
    instRef = useMemo(
      function() {
        function memoizedSelector(nextSnapshot) {
          if (!hasMemo) {
            hasMemo = true;
            memoizedSnapshot = nextSnapshot;
            nextSnapshot = selector(nextSnapshot);
            if (void 0 !== isEqual && inst.hasValue) {
              var currentSelection = inst.value;
              if (isEqual(currentSelection, nextSnapshot))
                return memoizedSelection = currentSelection;
            }
            return memoizedSelection = nextSnapshot;
          }
          currentSelection = memoizedSelection;
          if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
          var nextSelection = selector(nextSnapshot);
          if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
            return memoizedSnapshot = nextSnapshot, currentSelection;
          memoizedSnapshot = nextSnapshot;
          return memoizedSelection = nextSelection;
        }
        var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
        return [
          function() {
            return memoizedSelector(getSnapshot());
          },
          null === maybeGetServerSnapshot ? void 0 : function() {
            return memoizedSelector(maybeGetServerSnapshot());
          }
        ];
      },
      [getSnapshot, getServerSnapshot, selector, isEqual]
    );
    var value = useSyncExternalStore(subscribe2, instRef[0], instRef[1]);
    useEffect(
      function() {
        inst.hasValue = true;
        inst.value = value;
      },
      [value]
    );
    useDebugValue(value);
    return value;
  };
  return withSelector_production;
}
var withSelector_development = {};
var hasRequiredWithSelector_development;
function requireWithSelector_development() {
  if (hasRequiredWithSelector_development) return withSelector_development;
  hasRequiredWithSelector_development = 1;
  "production" !== process.env.NODE_ENV && (function() {
    function is(x2, y2) {
      return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = requireReact(), shim2 = requireShim(), objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim2.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
    withSelector_development.useSyncExternalStoreWithSelector = function(subscribe2, getSnapshot, getServerSnapshot, selector, isEqual) {
      var instRef = useRef(null);
      if (null === instRef.current) {
        var inst = { hasValue: false, value: null };
        instRef.current = inst;
      } else inst = instRef.current;
      instRef = useMemo(
        function() {
          function memoizedSelector(nextSnapshot) {
            if (!hasMemo) {
              hasMemo = true;
              memoizedSnapshot = nextSnapshot;
              nextSnapshot = selector(nextSnapshot);
              if (void 0 !== isEqual && inst.hasValue) {
                var currentSelection = inst.value;
                if (isEqual(currentSelection, nextSnapshot))
                  return memoizedSelection = currentSelection;
              }
              return memoizedSelection = nextSnapshot;
            }
            currentSelection = memoizedSelection;
            if (objectIs(memoizedSnapshot, nextSnapshot))
              return currentSelection;
            var nextSelection = selector(nextSnapshot);
            if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
              return memoizedSnapshot = nextSnapshot, currentSelection;
            memoizedSnapshot = nextSnapshot;
            return memoizedSelection = nextSelection;
          }
          var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
          return [
            function() {
              return memoizedSelector(getSnapshot());
            },
            null === maybeGetServerSnapshot ? void 0 : function() {
              return memoizedSelector(maybeGetServerSnapshot());
            }
          ];
        },
        [getSnapshot, getServerSnapshot, selector, isEqual]
      );
      var value = useSyncExternalStore(subscribe2, instRef[0], instRef[1]);
      useEffect(
        function() {
          inst.hasValue = true;
          inst.value = value;
        },
        [value]
      );
      useDebugValue(value);
      return value;
    };
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();
  return withSelector_development;
}
var hasRequiredWithSelector;
function requireWithSelector() {
  if (hasRequiredWithSelector) return withSelector.exports;
  hasRequiredWithSelector = 1;
  if (process.env.NODE_ENV === "production") {
    withSelector.exports = requireWithSelector_production();
  } else {
    withSelector.exports = requireWithSelector_development();
  }
  return withSelector.exports;
}
var withSelectorExports = requireWithSelector();
function useStore(store, selector = (d) => d, options = {}) {
  const equal = options.equal ?? shallow;
  const slice = withSelectorExports.useSyncExternalStoreWithSelector(
    store.subscribe,
    () => store.state,
    () => store.state,
    selector,
    equal
  );
  return slice;
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k2, v2] of objA) {
      if (!objB.has(k2) || !Object.is(v2, objB.get(k2))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v2 of objA) {
      if (!objB.has(v2)) return false;
    }
    return true;
  }
  if (objA instanceof Date && objB instanceof Date) {
    if (objA.getTime() !== objB.getTime()) return false;
    return true;
  }
  const keysA = getOwnKeys(objA);
  if (keysA.length !== getOwnKeys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
function getOwnKeys(obj) {
  return Object.keys(obj).concat(
    Object.getOwnPropertySymbols(obj)
  );
}
const routerContext = reactExports.createContext(null);
function getRouterContext() {
  if (typeof document === "undefined") {
    return routerContext;
  }
  if (window.__TSR_ROUTER_CONTEXT__) {
    return window.__TSR_ROUTER_CONTEXT__;
  }
  window.__TSR_ROUTER_CONTEXT__ = routerContext;
  return routerContext;
}
function useRouter(opts) {
  const value = reactExports.useContext(getRouterContext());
  warning(
    !((opts?.warn ?? true) && !value),
    "useRouter must be used inside a <RouterProvider> component!"
  );
  return value;
}
function useRouterState(opts) {
  const contextRouter = useRouter({
    warn: opts?.router === void 0
  });
  const router = opts?.router || contextRouter;
  const previousResult = reactExports.useRef(void 0);
  return useStore(router.__store, (state) => {
    if (opts?.select) {
      if (opts.structuralSharing ?? router.options.defaultStructuralSharing) {
        const newSlice = replaceEqualDeep(
          previousResult.current,
          opts.select(state)
        );
        previousResult.current = newSlice;
        return newSlice;
      }
      return opts.select(state);
    }
    return state;
  });
}
const matchContext = reactExports.createContext(void 0);
const dummyMatchContext = reactExports.createContext(
  void 0
);
const useLayoutEffect = typeof window !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function usePrevious(value) {
  const ref = reactExports.useRef({
    value,
    prev: null
  });
  const current = ref.current.value;
  if (value !== current) {
    ref.current = {
      value,
      prev: current
    };
  }
  return ref.current.prev;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
  reactExports.useEffect(() => {
    if (!ref.current || options.disabled || typeof IntersectionObserver !== "function") {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, intersectionObserverOptions);
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [callback, intersectionObserverOptions, options.disabled, ref]);
}
function useForwardedRef(ref) {
  const innerRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function Transitioner() {
  const router = useRouter();
  const mountLoadForRouter = reactExports.useRef({ router, mounted: false });
  const [isTransitioning, setIsTransitioning] = reactExports.useState(false);
  const { hasPendingMatches, isLoading } = useRouterState({
    select: (s) => ({
      isLoading: s.isLoading,
      hasPendingMatches: s.matches.some((d) => d.status === "pending")
    }),
    structuralSharing: true
  });
  const previousIsLoading = usePrevious(isLoading);
  const isAnyPending = isLoading || isTransitioning || hasPendingMatches;
  const previousIsAnyPending = usePrevious(isAnyPending);
  const isPagePending = isLoading || hasPendingMatches;
  const previousIsPagePending = usePrevious(isPagePending);
  router.startTransition = (fn2) => {
    setIsTransitioning(true);
    reactExports.startTransition(() => {
      fn2();
      setIsTransitioning(false);
    });
  };
  reactExports.useEffect(() => {
    const unsub = router.history.subscribe(router.load);
    const nextLocation = router.buildLocation({
      to: router.latestLocation.pathname,
      search: true,
      params: true,
      hash: true,
      state: true,
      _includeValidateSearch: true
    });
    if (trimPathRight(router.latestLocation.publicHref) !== trimPathRight(nextLocation.publicHref)) {
      router.commitLocation({ ...nextLocation, replace: true });
    }
    return () => {
      unsub();
    };
  }, [router, router.history]);
  useLayoutEffect(() => {
    if (
      // if we are hydrating from SSR, loading is triggered in ssr-client
      typeof window !== "undefined" && router.ssr || mountLoadForRouter.current.router === router && mountLoadForRouter.current.mounted
    ) {
      return;
    }
    mountLoadForRouter.current = { router, mounted: true };
    const tryLoad = async () => {
      try {
        await router.load();
      } catch (err) {
        console.error(err);
      }
    };
    tryLoad();
  }, [router]);
  useLayoutEffect(() => {
    if (previousIsLoading && !isLoading) {
      router.emit({
        type: "onLoad",
        // When the new URL has committed, when the new matches have been loaded into state.matches
        ...getLocationChangeInfo(router.state)
      });
    }
  }, [previousIsLoading, router, isLoading]);
  useLayoutEffect(() => {
    if (previousIsPagePending && !isPagePending) {
      router.emit({
        type: "onBeforeRouteMount",
        ...getLocationChangeInfo(router.state)
      });
    }
  }, [isPagePending, previousIsPagePending, router]);
  useLayoutEffect(() => {
    if (previousIsAnyPending && !isAnyPending) {
      const changeInfo = getLocationChangeInfo(router.state);
      router.emit({
        type: "onResolved",
        ...changeInfo
      });
      router.__store.setState((s) => ({
        ...s,
        status: "idle",
        resolvedLocation: s.location
      }));
      if (changeInfo.hrefChanged) {
        handleHashScroll(router);
      }
    }
  }, [isAnyPending, previousIsAnyPending, router]);
  return null;
}
function CatchNotFound(props) {
  const resetKey = useRouterState({
    select: (s) => `not-found-${s.location.pathname}-${s.status}`
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      onCatch: (error, errorInfo) => {
        if (isNotFound(error)) {
          props.onCatch?.(error, errorInfo);
        } else {
          throw error;
        }
      },
      errorComponent: ({ error }) => {
        if (isNotFound(error)) {
          return props.fallback?.(error);
        } else {
          throw error;
        }
      },
      children: props.children
    }
  );
}
function DefaultGlobalNotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Not Found" });
}
function SafeFragment(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: props.children });
}
function renderRouteNotFound(router, route, data) {
  if (!route.options.notFoundComponent) {
    if (router.options.defaultNotFoundComponent) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.defaultNotFoundComponent, { ...data });
    }
    if (process.env.NODE_ENV === "development") {
      warning(
        route.options.notFoundComponent,
        `A notFoundError was encountered on the route with ID "${route.id}", but a notFoundComponent option was not configured, nor was a router level defaultNotFoundComponent configured. Consider configuring at least one of these to avoid TanStack Router's overly generic defaultNotFoundComponent (<p>Not Found</p>)`
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultGlobalNotFound, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(route.options.notFoundComponent, { ...data });
}
function ScriptOnce({ children }) {
  const router = useRouter();
  if (!router.isServer) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "script",
    {
      nonce: router.options.ssr?.nonce,
      dangerouslySetInnerHTML: {
        __html: children + ";document.currentScript.remove()"
      }
    }
  );
}
function ScrollRestoration() {
  const router = useRouter();
  if (!router.isScrollRestoring || !router.isServer) {
    return null;
  }
  if (typeof router.options.scrollRestoration === "function") {
    const shouldRestore = router.options.scrollRestoration({
      location: router.latestLocation
    });
    if (!shouldRestore) {
      return null;
    }
  }
  const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  const userKey = getKey(router.latestLocation);
  const resolvedKey = userKey !== defaultGetScrollRestorationKey(router.latestLocation) ? userKey : void 0;
  const restoreScrollOptions = {
    storageKey,
    shouldScrollRestoration: true
  };
  if (resolvedKey) {
    restoreScrollOptions.key = resolvedKey;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScriptOnce,
    {
      children: `(${restoreScroll.toString()})(${JSON.stringify(restoreScrollOptions)})`
    }
  );
}
const Match = reactExports.memo(function MatchImpl({
  matchId
}) {
  const router = useRouter();
  const matchState = useRouterState({
    select: (s) => {
      const match = s.matches.find((d) => d.id === matchId);
      invariant(
        match,
        `Could not find match for matchId "${matchId}". Please file an issue!`
      );
      return {
        routeId: match.routeId,
        ssr: match.ssr,
        _displayPending: match._displayPending
      };
    },
    structuralSharing: true
  });
  const route = router.routesById[matchState.routeId];
  const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent;
  const pendingElement = PendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(PendingComponent, {}) : null;
  const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
  const routeOnCatch = route.options.onCatch ?? router.options.defaultOnCatch;
  const routeNotFoundComponent = route.isRoot ? (
    // If it's the root route, use the globalNotFound option, with fallback to the notFoundRoute's component
    route.options.notFoundComponent ?? router.options.notFoundRoute?.options.component
  ) : route.options.notFoundComponent;
  const resolvedNoSsr = matchState.ssr === false || matchState.ssr === "data-only";
  const ResolvedSuspenseBoundary = (
    // If we're on the root route, allow forcefully wrapping in suspense
    (!route.isRoot || route.options.wrapInSuspense || resolvedNoSsr) && (route.options.wrapInSuspense ?? PendingComponent ?? (route.options.errorComponent?.preload || resolvedNoSsr)) ? reactExports.Suspense : SafeFragment
  );
  const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment;
  const ResolvedNotFoundBoundary = routeNotFoundComponent ? CatchNotFound : SafeFragment;
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  const parentRouteId = useRouterState({
    select: (s) => {
      const index = s.matches.findIndex((d) => d.id === matchId);
      return s.matches[index - 1]?.routeId;
    }
  });
  const ShellComponent = route.isRoot ? route.options.shellComponent ?? SafeFragment : SafeFragment;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ShellComponent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolvedSuspenseBoundary, { fallback: pendingElement, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResolvedCatchBoundary,
      {
        getResetKey: () => resetKey,
        errorComponent: routeErrorComponent || ErrorComponent,
        onCatch: (error, errorInfo) => {
          if (isNotFound(error)) throw error;
          warning(false, `Error in route match: ${matchId}`);
          routeOnCatch?.(error, errorInfo);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ResolvedNotFoundBoundary,
          {
            fallback: (error) => {
              if (!routeNotFoundComponent || error.routeId && error.routeId !== matchState.routeId || !error.routeId && !route.isRoot)
                throw error;
              return reactExports.createElement(routeNotFoundComponent, error);
            },
            children: resolvedNoSsr || matchState._displayPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClientOnly, { fallback: pendingElement, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatchInner, { matchId }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MatchInner, { matchId })
          }
        )
      }
    ) }) }),
    parentRouteId === rootRouteId && router.options.scrollRestoration ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OnRendered, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollRestoration, {})
    ] }) : null
  ] });
});
function OnRendered() {
  const router = useRouter();
  const prevLocationRef = reactExports.useRef(
    void 0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "script",
    {
      suppressHydrationWarning: true,
      ref: (el) => {
        if (el && (prevLocationRef.current === void 0 || prevLocationRef.current.href !== router.latestLocation.href)) {
          router.emit({
            type: "onRendered",
            ...getLocationChangeInfo(router.state)
          });
          prevLocationRef.current = router.latestLocation;
        }
      }
    },
    router.latestLocation.state.__TSR_key
  );
}
const MatchInner = reactExports.memo(function MatchInnerImpl({
  matchId
}) {
  const router = useRouter();
  const { match, key, routeId } = useRouterState({
    select: (s) => {
      const match2 = s.matches.find((d) => d.id === matchId);
      const routeId2 = match2.routeId;
      const remountFn = router.routesById[routeId2].options.remountDeps ?? router.options.defaultRemountDeps;
      const remountDeps = remountFn?.({
        routeId: routeId2,
        loaderDeps: match2.loaderDeps,
        params: match2._strictParams,
        search: match2._strictSearch
      });
      const key2 = remountDeps ? JSON.stringify(remountDeps) : void 0;
      return {
        key: key2,
        routeId: routeId2,
        match: {
          id: match2.id,
          status: match2.status,
          error: match2.error,
          invalid: match2.invalid,
          _forcePending: match2._forcePending,
          _displayPending: match2._displayPending
        }
      };
    },
    structuralSharing: true
  });
  const route = router.routesById[routeId];
  const out = reactExports.useMemo(() => {
    const Comp = route.options.component ?? router.options.defaultComponent;
    if (Comp) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {}, key);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }, [key, route.options.component, router.options.defaultComponent]);
  if (match._displayPending) {
    throw router.getMatch(match.id)?._nonReactive.displayPendingPromise;
  }
  if (match._forcePending) {
    throw router.getMatch(match.id)?._nonReactive.minPendingPromise;
  }
  if (match.status === "pending") {
    const pendingMinMs = route.options.pendingMinMs ?? router.options.defaultPendingMinMs;
    if (pendingMinMs) {
      const routerMatch = router.getMatch(match.id);
      if (routerMatch && !routerMatch._nonReactive.minPendingPromise) {
        if (!router.isServer) {
          const minPendingPromise = createControlledPromise();
          routerMatch._nonReactive.minPendingPromise = minPendingPromise;
          setTimeout(() => {
            minPendingPromise.resolve();
            routerMatch._nonReactive.minPendingPromise = void 0;
          }, pendingMinMs);
        }
      }
    }
    throw router.getMatch(match.id)?._nonReactive.loadPromise;
  }
  if (match.status === "notFound") {
    invariant(isNotFound(match.error), "Expected a notFound error");
    return renderRouteNotFound(router, route, match.error);
  }
  if (match.status === "redirected") {
    invariant(isRedirect(match.error), "Expected a redirect error");
    throw router.getMatch(match.id)?._nonReactive.loadPromise;
  }
  if (match.status === "error") {
    if (router.isServer) {
      const RouteErrorComponent = (route.options.errorComponent ?? router.options.defaultErrorComponent) || ErrorComponent;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        RouteErrorComponent,
        {
          error: match.error,
          reset: void 0,
          info: {
            componentStack: ""
          }
        }
      );
    }
    throw match.error;
  }
  return out;
});
const Outlet = reactExports.memo(function OutletImpl() {
  const router = useRouter();
  const matchId = reactExports.useContext(matchContext);
  const routeId = useRouterState({
    select: (s) => s.matches.find((d) => d.id === matchId)?.routeId
  });
  const route = router.routesById[routeId];
  const parentGlobalNotFound = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const parentMatch = matches.find((d) => d.id === matchId);
      invariant(
        parentMatch,
        `Could not find parent match for matchId "${matchId}"`
      );
      return parentMatch.globalNotFound;
    }
  });
  const childMatchId = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const index = matches.findIndex((d) => d.id === matchId);
      return matches[index + 1]?.id;
    }
  });
  const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.defaultPendingComponent, {}) : null;
  if (parentGlobalNotFound) {
    return renderRouteNotFound(router, route, void 0);
  }
  if (!childMatchId) {
    return null;
  }
  const nextMatch = /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId: childMatchId });
  if (routeId === rootRouteId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: pendingElement, children: nextMatch });
  }
  return nextMatch;
});
function Matches() {
  const router = useRouter();
  const rootRoute = router.routesById[rootRouteId];
  const PendingComponent = rootRoute.options.pendingComponent ?? router.options.defaultPendingComponent;
  const pendingElement = PendingComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(PendingComponent, {}) : null;
  const ResolvedSuspense = router.isServer || typeof document !== "undefined" && router.ssr ? SafeFragment : reactExports.Suspense;
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs(ResolvedSuspense, { fallback: pendingElement, children: [
    !router.isServer && /* @__PURE__ */ jsxRuntimeExports.jsx(Transitioner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MatchesInner, {})
  ] });
  return router.options.InnerWrap ? /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.InnerWrap, { children: inner }) : inner;
}
function MatchesInner() {
  const router = useRouter();
  const matchId = useRouterState({
    select: (s) => {
      return s.matches[0]?.id;
    }
  });
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  const matchComponent = matchId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Match, { matchId }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(matchContext.Provider, { value: matchId, children: router.options.disableGlobalCatchBoundary ? matchComponent : /* @__PURE__ */ jsxRuntimeExports.jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      errorComponent: ErrorComponent,
      onCatch: (error) => {
        warning(
          false,
          `The following error wasn't caught by any route! At the very least, consider setting an 'errorComponent' in your RootRoute!`
        );
        warning(false, error.message || error.toString());
      },
      children: matchComponent
    }
  ) });
}
function RouterContextProvider({
  router,
  children,
  ...rest
}) {
  if (Object.keys(rest).length > 0) {
    router.update({
      ...router.options,
      ...rest,
      context: {
        ...router.options.context,
        ...rest.context
      }
    });
  }
  const routerContext2 = getRouterContext();
  const provider = /* @__PURE__ */ jsxRuntimeExports.jsx(routerContext2.Provider, { value: router, children });
  if (router.options.Wrap) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(router.options.Wrap, { children: provider });
  }
  return provider;
}
function RouterProvider({ router, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterContextProvider, { router, ...rest, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Matches, {}) });
}
function StartServer(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router: props.router });
}
function splitSetCookieString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c2) => splitSetCookieString(c2));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
function toHeadersInstance(init) {
  if (init instanceof Headers) {
    return new Headers(init);
  } else if (Array.isArray(init)) {
    return new Headers(init);
  } else if (typeof init === "object") {
    return new Headers(init);
  } else {
    return new Headers();
  }
}
function mergeHeaders(...headers) {
  return headers.reduce((acc, header) => {
    const headersInstance = toHeadersInstance(header);
    for (const [key, value] of headersInstance.entries()) {
      if (key === "set-cookie") {
        const splitCookies = splitSetCookieString(value);
        splitCookies.forEach((cookie) => acc.append("set-cookie", cookie));
      } else {
        acc.set(key, value);
      }
    }
    return acc;
  }, new Headers());
}
const minifiedTsrBootStrapScript = "self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};\n";
const SCOPE_ID = "tsr";
function dehydrateMatch(match) {
  const dehydratedMatch = {
    i: match.id,
    u: match.updatedAt,
    s: match.status
  };
  const properties = [
    ["__beforeLoadContext", "b"],
    ["loaderData", "l"],
    ["error", "e"],
    ["ssr", "ssr"]
  ];
  for (const [key, shorthand] of properties) {
    if (match[key] !== void 0) {
      dehydratedMatch[shorthand] = match[key];
    }
  }
  return dehydratedMatch;
}
const INITIAL_SCRIPTS = [
  ln(SCOPE_ID),
  minifiedTsrBootStrapScript
];
class ScriptBuffer {
  constructor(router) {
    this._scriptBarrierLifted = false;
    this._cleanedUp = false;
    this._pendingMicrotask = false;
    this.router = router;
    this._queue = INITIAL_SCRIPTS.slice();
  }
  enqueue(script) {
    if (this._cleanedUp) return;
    this._queue.push(script);
    if (this._scriptBarrierLifted && !this._pendingMicrotask) {
      this._pendingMicrotask = true;
      queueMicrotask(() => {
        this._pendingMicrotask = false;
        this.injectBufferedScripts();
      });
    }
  }
  liftBarrier() {
    if (this._scriptBarrierLifted || this._cleanedUp) return;
    this._scriptBarrierLifted = true;
    if (this._queue.length > 0 && !this._pendingMicrotask) {
      this._pendingMicrotask = true;
      queueMicrotask(() => {
        this._pendingMicrotask = false;
        this.injectBufferedScripts();
      });
    }
  }
  /**
   * Flushes any pending scripts synchronously.
   * Call this before emitting onSerializationFinished to ensure all scripts are injected.
   *
   * IMPORTANT: Only injects if the barrier has been lifted. Before the barrier is lifted,
   * scripts should remain in the queue so takeBufferedScripts() can retrieve them
   */
  flush() {
    if (!this._scriptBarrierLifted) return;
    if (this._cleanedUp) return;
    this._pendingMicrotask = false;
    const scriptsToInject = this.takeAll();
    if (scriptsToInject && this.router?.serverSsr) {
      this.router.serverSsr.injectScript(scriptsToInject);
    }
  }
  takeAll() {
    const bufferedScripts = this._queue;
    this._queue = [];
    if (bufferedScripts.length === 0) {
      return void 0;
    }
    return bufferedScripts.join(";") + ";document.currentScript.remove()";
  }
  injectBufferedScripts() {
    if (this._cleanedUp) return;
    if (this._queue.length === 0) return;
    const scriptsToInject = this.takeAll();
    if (scriptsToInject && this.router?.serverSsr) {
      this.router.serverSsr.injectScript(scriptsToInject);
    }
  }
  cleanup() {
    this._cleanedUp = true;
    this._queue = [];
    this.router = void 0;
  }
}
function attachRouterServerSsrUtils({
  router,
  manifest: manifest2
}) {
  router.ssr = {
    manifest: manifest2
  };
  let _dehydrated = false;
  let _serializationFinished = false;
  const renderFinishedListeners = [];
  const serializationFinishedListeners = [];
  const scriptBuffer = new ScriptBuffer(router);
  let injectedHtmlBuffer = [];
  router.serverSsr = {
    injectHtml: (html) => {
      if (!html) return;
      injectedHtmlBuffer.push(html);
      router.emit({
        type: "onInjectedHtml"
      });
    },
    injectScript: (script) => {
      if (!script) return;
      const html = `<script${router.options.ssr?.nonce ? ` nonce='${router.options.ssr.nonce}'` : ""}>${script}<\/script>`;
      router.serverSsr.injectHtml(html);
    },
    dehydrate: async () => {
      invariant(!_dehydrated, "router is already dehydrated!");
      let matchesToDehydrate = router.state.matches;
      if (router.isShell()) {
        matchesToDehydrate = matchesToDehydrate.slice(0, 1);
      }
      const matches = matchesToDehydrate.map(dehydrateMatch);
      let manifestToDehydrate = void 0;
      if (manifest2) {
        const currentRouteIds = new Set(
          router.state.matches.map((k2) => k2.routeId)
        );
        const filteredRoutes = Object.fromEntries(
          Object.entries(manifest2.routes).flatMap(
            ([routeId, routeManifest]) => {
              if (currentRouteIds.has(routeId)) {
                return [[routeId, routeManifest]];
              } else if (routeManifest.assets && routeManifest.assets.length > 0) {
                return [
                  [
                    routeId,
                    {
                      assets: routeManifest.assets
                    }
                  ]
                ];
              }
              return [];
            }
          )
        );
        manifestToDehydrate = {
          routes: filteredRoutes
        };
      }
      const dehydratedRouter = {
        manifest: manifestToDehydrate,
        matches
      };
      const lastMatchId = matchesToDehydrate[matchesToDehydrate.length - 1]?.id;
      if (lastMatchId) {
        dehydratedRouter.lastMatchId = lastMatchId;
      }
      const dehydratedData = await router.options.dehydrate?.();
      if (dehydratedData) {
        dehydratedRouter.dehydratedData = dehydratedData;
      }
      _dehydrated = true;
      const trackPlugins = { didRun: false };
      const serializationAdapters = router.options.serializationAdapters;
      const plugins = serializationAdapters ? serializationAdapters.map((t) => makeSsrSerovalPlugin(t, trackPlugins)).concat(defaultSerovalPlugins) : defaultSerovalPlugins;
      const signalSerializationComplete = () => {
        _serializationFinished = true;
        try {
          serializationFinishedListeners.forEach((l) => l());
          router.emit({ type: "onSerializationFinished" });
        } catch (err) {
          console.error("Serialization listener error:", err);
        } finally {
          serializationFinishedListeners.length = 0;
          renderFinishedListeners.length = 0;
        }
      };
      an(dehydratedRouter, {
        refs: /* @__PURE__ */ new Map(),
        plugins,
        onSerialize: (data, initial) => {
          let serialized = initial ? GLOBAL_TSR + ".router=" + data : data;
          if (trackPlugins.didRun) {
            serialized = GLOBAL_TSR + ".p(()=>" + serialized + ")";
          }
          scriptBuffer.enqueue(serialized);
        },
        scopeId: SCOPE_ID,
        onDone: () => {
          scriptBuffer.enqueue(GLOBAL_TSR + ".e()");
          scriptBuffer.flush();
          signalSerializationComplete();
        },
        onError: (err) => {
          console.error("Serialization error:", err);
          signalSerializationComplete();
        }
      });
    },
    isDehydrated() {
      return _dehydrated;
    },
    isSerializationFinished() {
      return _serializationFinished;
    },
    onRenderFinished: (listener) => renderFinishedListeners.push(listener),
    onSerializationFinished: (listener) => serializationFinishedListeners.push(listener),
    setRenderFinished: () => {
      try {
        renderFinishedListeners.forEach((l) => l());
      } catch (err) {
        console.error("Error in render finished listener:", err);
      } finally {
        renderFinishedListeners.length = 0;
      }
      scriptBuffer.liftBarrier();
    },
    takeBufferedScripts() {
      const scripts = scriptBuffer.takeAll();
      const serverBufferedScript = {
        tag: "script",
        attrs: {
          nonce: router.options.ssr?.nonce,
          className: "$tsr",
          id: TSR_SCRIPT_BARRIER_ID
        },
        children: scripts
      };
      return serverBufferedScript;
    },
    liftScriptBarrier() {
      scriptBuffer.liftBarrier();
    },
    takeBufferedHtml() {
      if (injectedHtmlBuffer.length === 0) {
        return void 0;
      }
      const buffered = injectedHtmlBuffer.join("");
      injectedHtmlBuffer = [];
      return buffered;
    },
    cleanup() {
      if (!router.serverSsr) return;
      renderFinishedListeners.length = 0;
      serializationFinishedListeners.length = 0;
      injectedHtmlBuffer = [];
      scriptBuffer.cleanup();
      router.serverSsr = void 0;
    }
  };
}
function getOrigin(request) {
  const originHeader = request.headers.get("Origin");
  if (originHeader) {
    try {
      new URL(originHeader);
      return originHeader;
    } catch {
    }
  }
  try {
    return new URL(request.url).origin;
  } catch {
  }
  return "http://localhost";
}
function defineHandlerCallback(handler) {
  return handler;
}
function transformReadableStreamWithRouter(router, routerStream) {
  return transformStreamWithRouter(router, routerStream);
}
function transformPipeableStreamWithRouter(router, routerStream) {
  return Readable.fromWeb(
    transformStreamWithRouter(router, Readable.toWeb(routerStream))
  );
}
const BODY_END_TAG = "</body>";
const HTML_END_TAG = "</html>";
const MIN_CLOSING_TAG_LENGTH = 4;
const DEFAULT_SERIALIZATION_TIMEOUT_MS = 6e4;
const DEFAULT_LIFETIME_TIMEOUT_MS = 6e4;
const textEncoder$2 = new TextEncoder();
function findLastClosingTagEnd(str) {
  const len = str.length;
  if (len < MIN_CLOSING_TAG_LENGTH) return -1;
  let i = len - 1;
  while (i >= MIN_CLOSING_TAG_LENGTH - 1) {
    if (str.charCodeAt(i) === 62) {
      let j2 = i - 1;
      while (j2 >= 1) {
        const code = str.charCodeAt(j2);
        if (code >= 97 && code <= 122 || // a-z
        code >= 65 && code <= 90 || // A-Z
        code >= 48 && code <= 57 || // 0-9
        code === 95 || // _
        code === 58 || // :
        code === 46 || // .
        code === 45) {
          j2--;
        } else {
          break;
        }
      }
      const tagNameStart = j2 + 1;
      if (tagNameStart < i) {
        const startCode = str.charCodeAt(tagNameStart);
        if (startCode >= 97 && startCode <= 122 || startCode >= 65 && startCode <= 90) {
          if (j2 >= 1 && str.charCodeAt(j2) === 47 && str.charCodeAt(j2 - 1) === 60) {
            return i + 1;
          }
        }
      }
    }
    i--;
  }
  return -1;
}
function transformStreamWithRouter(router, appStream, opts) {
  let stopListeningToInjectedHtml;
  let stopListeningToSerializationFinished;
  let serializationTimeoutHandle;
  let lifetimeTimeoutHandle;
  let cleanedUp = false;
  let controller;
  let isStreamClosed = false;
  const serializationAlreadyFinished = router.serverSsr?.isSerializationFinished() ?? false;
  function cleanup() {
    if (cleanedUp) return;
    cleanedUp = true;
    try {
      stopListeningToInjectedHtml?.();
      stopListeningToSerializationFinished?.();
    } catch (e) {
    }
    stopListeningToInjectedHtml = void 0;
    stopListeningToSerializationFinished = void 0;
    if (serializationTimeoutHandle !== void 0) {
      clearTimeout(serializationTimeoutHandle);
      serializationTimeoutHandle = void 0;
    }
    if (lifetimeTimeoutHandle !== void 0) {
      clearTimeout(lifetimeTimeoutHandle);
      lifetimeTimeoutHandle = void 0;
    }
    pendingRouterHtmlParts = [];
    leftover = "";
    pendingClosingTags = "";
    router.serverSsr?.cleanup();
  }
  const textDecoder = new TextDecoder();
  function safeEnqueue(chunk) {
    if (isStreamClosed) return;
    if (typeof chunk === "string") {
      controller.enqueue(textEncoder$2.encode(chunk));
    } else {
      controller.enqueue(chunk);
    }
  }
  function safeClose() {
    if (isStreamClosed) return;
    isStreamClosed = true;
    try {
      controller.close();
    } catch {
    }
  }
  function safeError(error) {
    if (isStreamClosed) return;
    isStreamClosed = true;
    try {
      controller.error(error);
    } catch {
    }
  }
  const stream = new ReadableStream$1({
    start(c2) {
      controller = c2;
    },
    cancel() {
      isStreamClosed = true;
      cleanup();
    }
  });
  let isAppRendering = true;
  let streamBarrierLifted = false;
  let leftover = "";
  let pendingClosingTags = "";
  let serializationFinished = serializationAlreadyFinished;
  let pendingRouterHtmlParts = [];
  const bufferedHtml = router.serverSsr?.takeBufferedHtml();
  if (bufferedHtml) {
    pendingRouterHtmlParts.push(bufferedHtml);
  }
  function flushPendingRouterHtml() {
    if (pendingRouterHtmlParts.length > 0) {
      safeEnqueue(pendingRouterHtmlParts.join(""));
      pendingRouterHtmlParts = [];
    }
  }
  function tryFinish() {
    if (isAppRendering || !serializationFinished) return;
    if (cleanedUp || isStreamClosed) return;
    if (serializationTimeoutHandle !== void 0) {
      clearTimeout(serializationTimeoutHandle);
      serializationTimeoutHandle = void 0;
    }
    const decoderRemainder = textDecoder.decode();
    if (leftover) safeEnqueue(leftover);
    if (decoderRemainder) safeEnqueue(decoderRemainder);
    flushPendingRouterHtml();
    if (pendingClosingTags) safeEnqueue(pendingClosingTags);
    safeClose();
    cleanup();
  }
  const lifetimeMs = DEFAULT_LIFETIME_TIMEOUT_MS;
  lifetimeTimeoutHandle = setTimeout(() => {
    if (!cleanedUp && !isStreamClosed) {
      console.warn(
        `SSR stream transform exceeded maximum lifetime (${lifetimeMs}ms), forcing cleanup`
      );
      safeError(new Error("Stream lifetime exceeded"));
      cleanup();
    }
  }, lifetimeMs);
  if (!serializationAlreadyFinished) {
    stopListeningToInjectedHtml = router.subscribe("onInjectedHtml", () => {
      if (cleanedUp || isStreamClosed) return;
      const html = router.serverSsr?.takeBufferedHtml();
      if (!html) return;
      if (isAppRendering) {
        pendingRouterHtmlParts.push(html);
      } else {
        safeEnqueue(html);
      }
    });
    stopListeningToSerializationFinished = router.subscribe(
      "onSerializationFinished",
      () => {
        serializationFinished = true;
        tryFinish();
      }
    );
  }
  (async () => {
    const reader = appStream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (cleanedUp || isStreamClosed) return;
        const text = value instanceof Uint8Array ? textDecoder.decode(value, { stream: true }) : String(value);
        const chunkString = leftover + text;
        if (!streamBarrierLifted) {
          if (chunkString.includes(TSR_SCRIPT_BARRIER_ID)) {
            streamBarrierLifted = true;
            router.serverSsr?.liftScriptBarrier();
          }
        }
        const bodyEndIndex = chunkString.indexOf(BODY_END_TAG);
        const htmlEndIndex = chunkString.indexOf(HTML_END_TAG);
        if (bodyEndIndex !== -1 && htmlEndIndex !== -1 && bodyEndIndex < htmlEndIndex) {
          pendingClosingTags = chunkString.slice(bodyEndIndex);
          safeEnqueue(chunkString.slice(0, bodyEndIndex));
          flushPendingRouterHtml();
          leftover = "";
          continue;
        }
        const lastClosingTagEnd = findLastClosingTagEnd(chunkString);
        if (lastClosingTagEnd > 0) {
          safeEnqueue(chunkString.slice(0, lastClosingTagEnd));
          flushPendingRouterHtml();
          leftover = chunkString.slice(lastClosingTagEnd);
        } else {
          leftover = chunkString;
        }
      }
      if (cleanedUp || isStreamClosed) return;
      isAppRendering = false;
      router.serverSsr?.setRenderFinished();
      if (serializationFinished) {
        tryFinish();
      } else {
        const timeoutMs = opts?.timeoutMs ?? DEFAULT_SERIALIZATION_TIMEOUT_MS;
        serializationTimeoutHandle = setTimeout(() => {
          if (!cleanedUp && !isStreamClosed) {
            console.error("Serialization timeout after app render finished");
            safeError(
              new Error("Serialization timeout after app render finished")
            );
            cleanup();
          }
        }, timeoutMs);
      }
    } catch (error) {
      if (cleanedUp) return;
      console.error("Error reading appStream:", error);
      isAppRendering = false;
      router.serverSsr?.setRenderFinished();
      safeError(error);
      cleanup();
    } finally {
      reader.releaseLock();
    }
  })().catch((error) => {
    if (cleanedUp) return;
    console.error("Error in stream transform:", error);
    safeError(error);
    cleanup();
  });
  return stream;
}
var server_node = {};
var reactDomServerLegacy_node_production_min = {};
var hasRequiredReactDomServerLegacy_node_production_min;
function requireReactDomServerLegacy_node_production_min() {
  if (hasRequiredReactDomServerLegacy_node_production_min) return reactDomServerLegacy_node_production_min;
  hasRequiredReactDomServerLegacy_node_production_min = 1;
  var ea2 = requireReact(), fa2 = require$$1, n = Object.prototype.hasOwnProperty, ha = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ia2 = {}, ja = {};
  function ka(a) {
    if (n.call(ja, a)) return true;
    if (n.call(ia2, a)) return false;
    if (ha.test(a)) return ja[a] = true;
    ia2[a] = true;
    return false;
  }
  function q2(a, b2, c2, d, f2, e, g) {
    this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
    this.attributeName = d;
    this.attributeNamespace = f2;
    this.mustUseProperty = c2;
    this.propertyName = a;
    this.type = b2;
    this.sanitizeURL = e;
    this.removeEmptyString = g;
  }
  var r = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    r[a] = new q2(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b2 = a[0];
    r[b2] = new q2(b2, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    r[a] = new q2(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    r[a] = new q2(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    r[a] = new q2(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    r[a] = new q2(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    r[a] = new q2(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    r[a] = new q2(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    r[a] = new q2(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var la2 = /[\-:]([a-z])/g;
  function ma2(a) {
    return a[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b2 = a.replace(
      la2,
      ma2
    );
    r[b2] = new q2(b2, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b2 = a.replace(la2, ma2);
    r[b2] = new q2(b2, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b2 = a.replace(la2, ma2);
    r[b2] = new q2(b2, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    r[a] = new q2(a, 1, false, a.toLowerCase(), null, false, false);
  });
  r.xlinkHref = new q2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    r[a] = new q2(a, 1, false, a.toLowerCase(), null, true, true);
  });
  var t = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, na2 = ["Webkit", "ms", "Moz", "O"];
  Object.keys(t).forEach(function(a) {
    na2.forEach(function(b2) {
      b2 = b2 + a.charAt(0).toUpperCase() + a.substring(1);
      t[b2] = t[a];
    });
  });
  var oa2 = /["'&<>]/;
  function u2(a) {
    if ("boolean" === typeof a || "number" === typeof a) return "" + a;
    a = "" + a;
    var b2 = oa2.exec(a);
    if (b2) {
      var c2 = "", d, f2 = 0;
      for (d = b2.index; d < a.length; d++) {
        switch (a.charCodeAt(d)) {
          case 34:
            b2 = "&quot;";
            break;
          case 38:
            b2 = "&amp;";
            break;
          case 39:
            b2 = "&#x27;";
            break;
          case 60:
            b2 = "&lt;";
            break;
          case 62:
            b2 = "&gt;";
            break;
          default:
            continue;
        }
        f2 !== d && (c2 += a.substring(f2, d));
        f2 = d + 1;
        c2 += b2;
      }
      a = f2 !== d ? c2 + a.substring(f2, d) : c2;
    }
    return a;
  }
  var pa2 = /([A-Z])/g, qa = /^ms-/, ra2 = Array.isArray;
  function v2(a, b2) {
    return { insertionMode: a, selectedValue: b2 };
  }
  function sa2(a, b2, c2) {
    switch (b2) {
      case "select":
        return v2(1, null != c2.value ? c2.value : c2.defaultValue);
      case "svg":
        return v2(2, null);
      case "math":
        return v2(3, null);
      case "foreignObject":
        return v2(1, null);
      case "table":
        return v2(4, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return v2(5, null);
      case "colgroup":
        return v2(7, null);
      case "tr":
        return v2(6, null);
    }
    return 4 <= a.insertionMode || 0 === a.insertionMode ? v2(1, null) : a;
  }
  var ta2 = /* @__PURE__ */ new Map();
  function ua2(a, b2, c2) {
    if ("object" !== typeof c2) throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
    b2 = true;
    for (var d in c2) if (n.call(c2, d)) {
      var f2 = c2[d];
      if (null != f2 && "boolean" !== typeof f2 && "" !== f2) {
        if (0 === d.indexOf("--")) {
          var e = u2(d);
          f2 = u2(("" + f2).trim());
        } else {
          e = d;
          var g = ta2.get(e);
          void 0 !== g ? e = g : (g = u2(e.replace(pa2, "-$1").toLowerCase().replace(qa, "-ms-")), ta2.set(e, g), e = g);
          f2 = "number" === typeof f2 ? 0 === f2 || n.call(
            t,
            d
          ) ? "" + f2 : f2 + "px" : u2(("" + f2).trim());
        }
        b2 ? (b2 = false, a.push(' style="', e, ":", f2)) : a.push(";", e, ":", f2);
      }
    }
    b2 || a.push('"');
  }
  function w3(a, b2, c2, d) {
    switch (c2) {
      case "style":
        ua2(a, b2, d);
        return;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
        return;
    }
    if (!(2 < c2.length) || "o" !== c2[0] && "O" !== c2[0] || "n" !== c2[1] && "N" !== c2[1]) {
      if (b2 = r.hasOwnProperty(c2) ? r[c2] : null, null !== b2) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (!b2.acceptsBooleans) return;
        }
        c2 = b2.attributeName;
        switch (b2.type) {
          case 3:
            d && a.push(" ", c2, '=""');
            break;
          case 4:
            true === d ? a.push(" ", c2, '=""') : false !== d && a.push(" ", c2, '="', u2(d), '"');
            break;
          case 5:
            isNaN(d) || a.push(" ", c2, '="', u2(d), '"');
            break;
          case 6:
            !isNaN(d) && 1 <= d && a.push(" ", c2, '="', u2(d), '"');
            break;
          default:
            b2.sanitizeURL && (d = "" + d), a.push(" ", c2, '="', u2(d), '"');
        }
      } else if (ka(c2)) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (b2 = c2.toLowerCase().slice(0, 5), "data-" !== b2 && "aria-" !== b2) return;
        }
        a.push(" ", c2, '="', u2(d), '"');
      }
    }
  }
  function x2(a, b2, c2) {
    if (null != b2) {
      if (null != c2) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
      if ("object" !== typeof b2 || !("__html" in b2)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
      b2 = b2.__html;
      null !== b2 && void 0 !== b2 && a.push("" + b2);
    }
  }
  function va2(a) {
    var b2 = "";
    ea2.Children.forEach(a, function(a2) {
      null != a2 && (b2 += a2);
    });
    return b2;
  }
  function wa(a, b2, c2, d) {
    a.push(z2(c2));
    var f2 = c2 = null, e;
    for (e in b2) if (n.call(b2, e)) {
      var g = b2[e];
      if (null != g) switch (e) {
        case "children":
          c2 = g;
          break;
        case "dangerouslySetInnerHTML":
          f2 = g;
          break;
        default:
          w3(a, d, e, g);
      }
    }
    a.push(">");
    x2(a, f2, c2);
    return "string" === typeof c2 ? (a.push(u2(c2)), null) : c2;
  }
  var xa2 = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, ya2 = /* @__PURE__ */ new Map();
  function z2(a) {
    var b2 = ya2.get(a);
    if (void 0 === b2) {
      if (!xa2.test(a)) throw Error("Invalid tag: " + a);
      b2 = "<" + a;
      ya2.set(a, b2);
    }
    return b2;
  }
  function za(a, b2, c2, d, f2) {
    switch (b2) {
      case "select":
        a.push(z2("select"));
        var e = null, g = null;
        for (l in c2) if (n.call(c2, l)) {
          var h2 = c2[l];
          if (null != h2) switch (l) {
            case "children":
              e = h2;
              break;
            case "dangerouslySetInnerHTML":
              g = h2;
              break;
            case "defaultValue":
            case "value":
              break;
            default:
              w3(a, d, l, h2);
          }
        }
        a.push(">");
        x2(a, g, e);
        return e;
      case "option":
        g = f2.selectedValue;
        a.push(z2("option"));
        var k2 = h2 = null, m2 = null;
        var l = null;
        for (e in c2) if (n.call(c2, e)) {
          var p2 = c2[e];
          if (null != p2) switch (e) {
            case "children":
              h2 = p2;
              break;
            case "selected":
              m2 = p2;
              break;
            case "dangerouslySetInnerHTML":
              l = p2;
              break;
            case "value":
              k2 = p2;
            default:
              w3(a, d, e, p2);
          }
        }
        if (null != g) if (c2 = null !== k2 ? "" + k2 : va2(h2), ra2(g)) for (d = 0; d < g.length; d++) {
          if ("" + g[d] === c2) {
            a.push(' selected=""');
            break;
          }
        }
        else "" + g === c2 && a.push(' selected=""');
        else m2 && a.push(' selected=""');
        a.push(">");
        x2(a, l, h2);
        return h2;
      case "textarea":
        a.push(z2("textarea"));
        l = g = e = null;
        for (h2 in c2) if (n.call(c2, h2) && (k2 = c2[h2], null != k2)) switch (h2) {
          case "children":
            l = k2;
            break;
          case "value":
            e = k2;
            break;
          case "defaultValue":
            g = k2;
            break;
          case "dangerouslySetInnerHTML":
            throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
          default:
            w3(a, d, h2, k2);
        }
        null === e && null !== g && (e = g);
        a.push(">");
        if (null != l) {
          if (null != e) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
          if (ra2(l) && 1 < l.length) throw Error("<textarea> can only have at most one child.");
          e = "" + l;
        }
        "string" === typeof e && "\n" === e[0] && a.push("\n");
        null !== e && a.push(u2("" + e));
        return null;
      case "input":
        a.push(z2("input"));
        k2 = l = h2 = e = null;
        for (g in c2) if (n.call(c2, g) && (m2 = c2[g], null != m2)) switch (g) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
          case "defaultChecked":
            k2 = m2;
            break;
          case "defaultValue":
            h2 = m2;
            break;
          case "checked":
            l = m2;
            break;
          case "value":
            e = m2;
            break;
          default:
            w3(a, d, g, m2);
        }
        null !== l ? w3(a, d, "checked", l) : null !== k2 && w3(a, d, "checked", k2);
        null !== e ? w3(a, d, "value", e) : null !== h2 && w3(a, d, "value", h2);
        a.push("/>");
        return null;
      case "menuitem":
        a.push(z2("menuitem"));
        for (var B2 in c2) if (n.call(c2, B2) && (e = c2[B2], null != e)) switch (B2) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
          default:
            w3(
              a,
              d,
              B2,
              e
            );
        }
        a.push(">");
        return null;
      case "title":
        a.push(z2("title"));
        e = null;
        for (p2 in c2) if (n.call(c2, p2) && (g = c2[p2], null != g)) switch (p2) {
          case "children":
            e = g;
            break;
          case "dangerouslySetInnerHTML":
            throw Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
          default:
            w3(a, d, p2, g);
        }
        a.push(">");
        return e;
      case "listing":
      case "pre":
        a.push(z2(b2));
        g = e = null;
        for (k2 in c2) if (n.call(c2, k2) && (h2 = c2[k2], null != h2)) switch (k2) {
          case "children":
            e = h2;
            break;
          case "dangerouslySetInnerHTML":
            g = h2;
            break;
          default:
            w3(a, d, k2, h2);
        }
        a.push(">");
        if (null != g) {
          if (null != e) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if ("object" !== typeof g || !("__html" in g)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
          c2 = g.__html;
          null !== c2 && void 0 !== c2 && ("string" === typeof c2 && 0 < c2.length && "\n" === c2[0] ? a.push("\n", c2) : a.push("" + c2));
        }
        "string" === typeof e && "\n" === e[0] && a.push("\n");
        return e;
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "keygen":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
        a.push(z2(b2));
        for (var C2 in c2) if (n.call(c2, C2) && (e = c2[C2], null != e)) switch (C2) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(b2 + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
          default:
            w3(a, d, C2, e);
        }
        a.push("/>");
        return null;
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return wa(a, c2, b2, d);
      case "html":
        return 0 === f2.insertionMode && a.push("<!DOCTYPE html>"), wa(a, c2, b2, d);
      default:
        if (-1 === b2.indexOf("-") && "string" !== typeof c2.is) return wa(a, c2, b2, d);
        a.push(z2(b2));
        g = e = null;
        for (m2 in c2) if (n.call(c2, m2) && (h2 = c2[m2], null != h2)) switch (m2) {
          case "children":
            e = h2;
            break;
          case "dangerouslySetInnerHTML":
            g = h2;
            break;
          case "style":
            ua2(a, d, h2);
            break;
          case "suppressContentEditableWarning":
          case "suppressHydrationWarning":
            break;
          default:
            ka(m2) && "function" !== typeof h2 && "symbol" !== typeof h2 && a.push(" ", m2, '="', u2(h2), '"');
        }
        a.push(">");
        x2(a, g, e);
        return e;
    }
  }
  function Aa2(a, b2, c2) {
    a.push('<!--$?--><template id="');
    if (null === c2) throw Error("An ID must have been assigned before we can complete the boundary.");
    a.push(c2);
    return a.push('"></template>');
  }
  function Ba(a, b2, c2, d) {
    switch (c2.insertionMode) {
      case 0:
      case 1:
        return a.push('<div hidden id="'), a.push(b2.segmentPrefix), b2 = d.toString(16), a.push(b2), a.push('">');
      case 2:
        return a.push('<svg aria-hidden="true" style="display:none" id="'), a.push(b2.segmentPrefix), b2 = d.toString(16), a.push(b2), a.push('">');
      case 3:
        return a.push('<math aria-hidden="true" style="display:none" id="'), a.push(b2.segmentPrefix), b2 = d.toString(16), a.push(b2), a.push('">');
      case 4:
        return a.push('<table hidden id="'), a.push(b2.segmentPrefix), b2 = d.toString(16), a.push(b2), a.push('">');
      case 5:
        return a.push('<table hidden><tbody id="'), a.push(b2.segmentPrefix), b2 = d.toString(16), a.push(b2), a.push('">');
      case 6:
        return a.push('<table hidden><tr id="'), a.push(b2.segmentPrefix), b2 = d.toString(16), a.push(b2), a.push('">');
      case 7:
        return a.push('<table hidden><colgroup id="'), a.push(b2.segmentPrefix), b2 = d.toString(16), a.push(b2), a.push('">');
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  function Ca2(a, b2) {
    switch (b2.insertionMode) {
      case 0:
      case 1:
        return a.push("</div>");
      case 2:
        return a.push("</svg>");
      case 3:
        return a.push("</math>");
      case 4:
        return a.push("</table>");
      case 5:
        return a.push("</tbody></table>");
      case 6:
        return a.push("</tr></table>");
      case 7:
        return a.push("</colgroup></table>");
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  var Da = /[<\u2028\u2029]/g;
  function Ea2(a) {
    return JSON.stringify(a).replace(Da, function(a2) {
      switch (a2) {
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
      }
    });
  }
  function Fa(a, b2) {
    b2 = void 0 === b2 ? "" : b2;
    return { bootstrapChunks: [], startInlineScript: "<script>", placeholderPrefix: b2 + "P:", segmentPrefix: b2 + "S:", boundaryPrefix: b2 + "B:", idPrefix: b2, nextSuspenseID: 0, sentCompleteSegmentFunction: false, sentCompleteBoundaryFunction: false, sentClientRenderFunction: false, generateStaticMarkup: a };
  }
  function Ga() {
    return { insertionMode: 1, selectedValue: null };
  }
  function Ha(a, b2, c2, d) {
    if (c2.generateStaticMarkup) return a.push(u2(b2)), false;
    "" === b2 ? a = d : (d && a.push("<!-- -->"), a.push(u2(b2)), a = true);
    return a;
  }
  var A2 = Object.assign, Ia2 = /* @__PURE__ */ Symbol.for("react.element"), Ja = /* @__PURE__ */ Symbol.for("react.portal"), Ka = /* @__PURE__ */ Symbol.for("react.fragment"), La = /* @__PURE__ */ Symbol.for("react.strict_mode"), Ma = /* @__PURE__ */ Symbol.for("react.profiler"), Na2 = /* @__PURE__ */ Symbol.for("react.provider"), Oa2 = /* @__PURE__ */ Symbol.for("react.context"), Pa2 = /* @__PURE__ */ Symbol.for("react.forward_ref"), Qa = /* @__PURE__ */ Symbol.for("react.suspense"), Ra2 = /* @__PURE__ */ Symbol.for("react.suspense_list"), Sa2 = /* @__PURE__ */ Symbol.for("react.memo"), Ta2 = /* @__PURE__ */ Symbol.for("react.lazy"), Ua = /* @__PURE__ */ Symbol.for("react.scope"), Va = /* @__PURE__ */ Symbol.for("react.debug_trace_mode"), Wa = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), Xa = /* @__PURE__ */ Symbol.for("react.default_value"), Ya = Symbol.iterator;
  function Za(a) {
    if (null == a) return null;
    if ("function" === typeof a) return a.displayName || a.name || null;
    if ("string" === typeof a) return a;
    switch (a) {
      case Ka:
        return "Fragment";
      case Ja:
        return "Portal";
      case Ma:
        return "Profiler";
      case La:
        return "StrictMode";
      case Qa:
        return "Suspense";
      case Ra2:
        return "SuspenseList";
    }
    if ("object" === typeof a) switch (a.$$typeof) {
      case Oa2:
        return (a.displayName || "Context") + ".Consumer";
      case Na2:
        return (a._context.displayName || "Context") + ".Provider";
      case Pa2:
        var b2 = a.render;
        a = a.displayName;
        a || (a = b2.displayName || b2.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Sa2:
        return b2 = a.displayName || null, null !== b2 ? b2 : Za(a.type) || "Memo";
      case Ta2:
        b2 = a._payload;
        a = a._init;
        try {
          return Za(a(b2));
        } catch (c2) {
        }
    }
    return null;
  }
  var $a = {};
  function ab(a, b2) {
    a = a.contextTypes;
    if (!a) return $a;
    var c2 = {}, d;
    for (d in a) c2[d] = b2[d];
    return c2;
  }
  var D2 = null;
  function E2(a, b2) {
    if (a !== b2) {
      a.context._currentValue2 = a.parentValue;
      a = a.parent;
      var c2 = b2.parent;
      if (null === a) {
        if (null !== c2) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
      } else {
        if (null === c2) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
        E2(a, c2);
      }
      b2.context._currentValue2 = b2.value;
    }
  }
  function bb(a) {
    a.context._currentValue2 = a.parentValue;
    a = a.parent;
    null !== a && bb(a);
  }
  function cb(a) {
    var b2 = a.parent;
    null !== b2 && cb(b2);
    a.context._currentValue2 = a.value;
  }
  function db(a, b2) {
    a.context._currentValue2 = a.parentValue;
    a = a.parent;
    if (null === a) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
    a.depth === b2.depth ? E2(a, b2) : db(a, b2);
  }
  function eb(a, b2) {
    var c2 = b2.parent;
    if (null === c2) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
    a.depth === c2.depth ? E2(a, c2) : eb(a, c2);
    b2.context._currentValue2 = b2.value;
  }
  function F2(a) {
    var b2 = D2;
    b2 !== a && (null === b2 ? cb(a) : null === a ? bb(b2) : b2.depth === a.depth ? E2(b2, a) : b2.depth > a.depth ? db(b2, a) : eb(b2, a), D2 = a);
  }
  var fb = { isMounted: function() {
    return false;
  }, enqueueSetState: function(a, b2) {
    a = a._reactInternals;
    null !== a.queue && a.queue.push(b2);
  }, enqueueReplaceState: function(a, b2) {
    a = a._reactInternals;
    a.replace = true;
    a.queue = [b2];
  }, enqueueForceUpdate: function() {
  } };
  function gb(a, b2, c2, d) {
    var f2 = void 0 !== a.state ? a.state : null;
    a.updater = fb;
    a.props = c2;
    a.state = f2;
    var e = { queue: [], replace: false };
    a._reactInternals = e;
    var g = b2.contextType;
    a.context = "object" === typeof g && null !== g ? g._currentValue2 : d;
    g = b2.getDerivedStateFromProps;
    "function" === typeof g && (g = g(c2, f2), f2 = null === g || void 0 === g ? f2 : A2({}, f2, g), a.state = f2);
    if ("function" !== typeof b2.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount)) if (b2 = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b2 !== a.state && fb.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length) if (b2 = e.queue, g = e.replace, e.queue = null, e.replace = false, g && 1 === b2.length) a.state = b2[0];
    else {
      e = g ? b2[0] : a.state;
      f2 = true;
      for (g = g ? 1 : 0; g < b2.length; g++) {
        var h2 = b2[g];
        h2 = "function" === typeof h2 ? h2.call(a, e, c2, d) : h2;
        null != h2 && (f2 ? (f2 = false, e = A2({}, e, h2)) : A2(e, h2));
      }
      a.state = e;
    }
    else e.queue = null;
  }
  var hb = { id: 1, overflow: "" };
  function ib(a, b2, c2) {
    var d = a.id;
    a = a.overflow;
    var f2 = 32 - G2(d) - 1;
    d &= ~(1 << f2);
    c2 += 1;
    var e = 32 - G2(b2) + f2;
    if (30 < e) {
      var g = f2 - f2 % 5;
      e = (d & (1 << g) - 1).toString(32);
      d >>= g;
      f2 -= g;
      return { id: 1 << 32 - G2(b2) + f2 | c2 << f2 | d, overflow: e + a };
    }
    return { id: 1 << e | c2 << f2 | d, overflow: a };
  }
  var G2 = Math.clz32 ? Math.clz32 : jb, kb = Math.log, lb = Math.LN2;
  function jb(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (kb(a) / lb | 0) | 0;
  }
  function mb(a, b2) {
    return a === b2 && (0 !== a || 1 / a === 1 / b2) || a !== a && b2 !== b2;
  }
  var nb = "function" === typeof Object.is ? Object.is : mb, H = null, ob = null, I2 = null, J = null, K2 = false, L2 = false, M2 = 0, N2 = null, O2 = 0;
  function P2() {
    if (null === H) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
    return H;
  }
  function rb() {
    if (0 < O2) throw Error("Rendered more hooks than during the previous render");
    return { memoizedState: null, queue: null, next: null };
  }
  function sb() {
    null === J ? null === I2 ? (K2 = false, I2 = J = rb()) : (K2 = true, J = I2) : null === J.next ? (K2 = false, J = J.next = rb()) : (K2 = true, J = J.next);
    return J;
  }
  function tb() {
    ob = H = null;
    L2 = false;
    I2 = null;
    O2 = 0;
    J = N2 = null;
  }
  function ub(a, b2) {
    return "function" === typeof b2 ? b2(a) : b2;
  }
  function vb(a, b2, c2) {
    H = P2();
    J = sb();
    if (K2) {
      var d = J.queue;
      b2 = d.dispatch;
      if (null !== N2 && (c2 = N2.get(d), void 0 !== c2)) {
        N2.delete(d);
        d = J.memoizedState;
        do
          d = a(d, c2.action), c2 = c2.next;
        while (null !== c2);
        J.memoizedState = d;
        return [d, b2];
      }
      return [J.memoizedState, b2];
    }
    a = a === ub ? "function" === typeof b2 ? b2() : b2 : void 0 !== c2 ? c2(b2) : b2;
    J.memoizedState = a;
    a = J.queue = { last: null, dispatch: null };
    a = a.dispatch = wb.bind(null, H, a);
    return [J.memoizedState, a];
  }
  function xb(a, b2) {
    H = P2();
    J = sb();
    b2 = void 0 === b2 ? null : b2;
    if (null !== J) {
      var c2 = J.memoizedState;
      if (null !== c2 && null !== b2) {
        var d = c2[1];
        a: if (null === d) d = false;
        else {
          for (var f2 = 0; f2 < d.length && f2 < b2.length; f2++) if (!nb(b2[f2], d[f2])) {
            d = false;
            break a;
          }
          d = true;
        }
        if (d) return c2[0];
      }
    }
    a = a();
    J.memoizedState = [a, b2];
    return a;
  }
  function wb(a, b2, c2) {
    if (25 <= O2) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
    if (a === H) if (L2 = true, a = { action: c2, next: null }, null === N2 && (N2 = /* @__PURE__ */ new Map()), c2 = N2.get(b2), void 0 === c2) N2.set(b2, a);
    else {
      for (b2 = c2; null !== b2.next; ) b2 = b2.next;
      b2.next = a;
    }
  }
  function yb() {
    throw Error("startTransition cannot be called during server rendering.");
  }
  function Q2() {
  }
  var zb = { readContext: function(a) {
    return a._currentValue2;
  }, useContext: function(a) {
    P2();
    return a._currentValue2;
  }, useMemo: xb, useReducer: vb, useRef: function(a) {
    H = P2();
    J = sb();
    var b2 = J.memoizedState;
    return null === b2 ? (a = { current: a }, J.memoizedState = a) : b2;
  }, useState: function(a) {
    return vb(ub, a);
  }, useInsertionEffect: Q2, useLayoutEffect: function() {
  }, useCallback: function(a, b2) {
    return xb(function() {
      return a;
    }, b2);
  }, useImperativeHandle: Q2, useEffect: Q2, useDebugValue: Q2, useDeferredValue: function(a) {
    P2();
    return a;
  }, useTransition: function() {
    P2();
    return [false, yb];
  }, useId: function() {
    var a = ob.treeContext;
    var b2 = a.overflow;
    a = a.id;
    a = (a & ~(1 << 32 - G2(a) - 1)).toString(32) + b2;
    var c2 = R2;
    if (null === c2) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
    b2 = M2++;
    a = ":" + c2.idPrefix + "R" + a;
    0 < b2 && (a += "H" + b2.toString(32));
    return a + ":";
  }, useMutableSource: function(a, b2) {
    P2();
    return b2(a._source);
  }, useSyncExternalStore: function(a, b2, c2) {
    if (void 0 === c2) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
    return c2();
  } }, R2 = null, Ab = ea2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
  function Bb(a) {
    console.error(a);
    return null;
  }
  function S() {
  }
  function Cb(a, b2, c2, d, f2, e, g, h2, k2) {
    var m2 = [], l = /* @__PURE__ */ new Set();
    b2 = { destination: null, responseState: b2, progressiveChunkSize: void 0 === d ? 12800 : d, status: 0, fatalError: null, nextSegmentId: 0, allPendingTasks: 0, pendingRootTasks: 0, completedRootSegment: null, abortableTasks: l, pingedTasks: m2, clientRenderedBoundaries: [], completedBoundaries: [], partialBoundaries: [], onError: void 0 === f2 ? Bb : f2, onAllReady: void 0 === e ? S : e, onShellReady: void 0 === g ? S : g, onShellError: S, onFatalError: S };
    c2 = T2(b2, 0, null, c2, false, false);
    c2.parentFlushed = true;
    a = Db(b2, a, null, c2, l, $a, null, hb);
    m2.push(a);
    return b2;
  }
  function Db(a, b2, c2, d, f2, e, g, h2) {
    a.allPendingTasks++;
    null === c2 ? a.pendingRootTasks++ : c2.pendingTasks++;
    var k2 = { node: b2, ping: function() {
      var b3 = a.pingedTasks;
      b3.push(k2);
      1 === b3.length && Eb(a);
    }, blockedBoundary: c2, blockedSegment: d, abortSet: f2, legacyContext: e, context: g, treeContext: h2 };
    f2.add(k2);
    return k2;
  }
  function T2(a, b2, c2, d, f2, e) {
    return { status: 0, id: -1, index: b2, parentFlushed: false, chunks: [], children: [], formatContext: d, boundary: c2, lastPushedText: f2, textEmbedded: e };
  }
  function U2(a, b2) {
    a = a.onError(b2);
    if (null != a && "string" !== typeof a) throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof a + '" instead');
    return a;
  }
  function V2(a, b2) {
    var c2 = a.onShellError;
    c2(b2);
    c2 = a.onFatalError;
    c2(b2);
    null !== a.destination ? (a.status = 2, a.destination.destroy(b2)) : (a.status = 1, a.fatalError = b2);
  }
  function Fb(a, b2, c2, d, f2) {
    H = {};
    ob = b2;
    M2 = 0;
    for (a = c2(d, f2); L2; ) L2 = false, M2 = 0, O2 += 1, J = null, a = c2(d, f2);
    tb();
    return a;
  }
  function Gb(a, b2, c2, d) {
    var f2 = c2.render(), e = d.childContextTypes;
    if (null !== e && void 0 !== e) {
      var g = b2.legacyContext;
      if ("function" !== typeof c2.getChildContext) d = g;
      else {
        c2 = c2.getChildContext();
        for (var h2 in c2) if (!(h2 in e)) throw Error((Za(d) || "Unknown") + '.getChildContext(): key "' + h2 + '" is not defined in childContextTypes.');
        d = A2({}, g, c2);
      }
      b2.legacyContext = d;
      W2(a, b2, f2);
      b2.legacyContext = g;
    } else W2(a, b2, f2);
  }
  function Hb(a, b2) {
    if (a && a.defaultProps) {
      b2 = A2({}, b2);
      a = a.defaultProps;
      for (var c2 in a) void 0 === b2[c2] && (b2[c2] = a[c2]);
      return b2;
    }
    return b2;
  }
  function Ib(a, b2, c2, d, f2) {
    if ("function" === typeof c2) if (c2.prototype && c2.prototype.isReactComponent) {
      f2 = ab(c2, b2.legacyContext);
      var e = c2.contextType;
      e = new c2(d, "object" === typeof e && null !== e ? e._currentValue2 : f2);
      gb(e, c2, d, f2);
      Gb(a, b2, e, c2);
    } else {
      e = ab(c2, b2.legacyContext);
      f2 = Fb(a, b2, c2, d, e);
      var g = 0 !== M2;
      if ("object" === typeof f2 && null !== f2 && "function" === typeof f2.render && void 0 === f2.$$typeof) gb(f2, c2, d, e), Gb(a, b2, f2, c2);
      else if (g) {
        d = b2.treeContext;
        b2.treeContext = ib(d, 1, 0);
        try {
          W2(a, b2, f2);
        } finally {
          b2.treeContext = d;
        }
      } else W2(a, b2, f2);
    }
    else if ("string" === typeof c2) {
      f2 = b2.blockedSegment;
      e = za(f2.chunks, c2, d, a.responseState, f2.formatContext);
      f2.lastPushedText = false;
      g = f2.formatContext;
      f2.formatContext = sa2(g, c2, d);
      Jb(a, b2, e);
      f2.formatContext = g;
      switch (c2) {
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "img":
        case "input":
        case "keygen":
        case "link":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
          break;
        default:
          f2.chunks.push("</", c2, ">");
      }
      f2.lastPushedText = false;
    } else {
      switch (c2) {
        case Wa:
        case Va:
        case La:
        case Ma:
        case Ka:
          W2(a, b2, d.children);
          return;
        case Ra2:
          W2(a, b2, d.children);
          return;
        case Ua:
          throw Error("ReactDOMServer does not yet support scope components.");
        case Qa:
          a: {
            c2 = b2.blockedBoundary;
            f2 = b2.blockedSegment;
            e = d.fallback;
            d = d.children;
            g = /* @__PURE__ */ new Set();
            var h2 = { id: null, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, forceClientRender: false, completedSegments: [], byteSize: 0, fallbackAbortableTasks: g, errorDigest: null }, k2 = T2(a, f2.chunks.length, h2, f2.formatContext, false, false);
            f2.children.push(k2);
            f2.lastPushedText = false;
            var m2 = T2(a, 0, null, f2.formatContext, false, false);
            m2.parentFlushed = true;
            b2.blockedBoundary = h2;
            b2.blockedSegment = m2;
            try {
              if (Jb(a, b2, d), a.responseState.generateStaticMarkup || m2.lastPushedText && m2.textEmbedded && m2.chunks.push("<!-- -->"), m2.status = 1, X2(h2, m2), 0 === h2.pendingTasks) break a;
            } catch (l) {
              m2.status = 4, h2.forceClientRender = true, h2.errorDigest = U2(a, l);
            } finally {
              b2.blockedBoundary = c2, b2.blockedSegment = f2;
            }
            b2 = Db(a, e, c2, k2, g, b2.legacyContext, b2.context, b2.treeContext);
            a.pingedTasks.push(b2);
          }
          return;
      }
      if ("object" === typeof c2 && null !== c2) switch (c2.$$typeof) {
        case Pa2:
          d = Fb(a, b2, c2.render, d, f2);
          if (0 !== M2) {
            c2 = b2.treeContext;
            b2.treeContext = ib(c2, 1, 0);
            try {
              W2(a, b2, d);
            } finally {
              b2.treeContext = c2;
            }
          } else W2(a, b2, d);
          return;
        case Sa2:
          c2 = c2.type;
          d = Hb(c2, d);
          Ib(a, b2, c2, d, f2);
          return;
        case Na2:
          f2 = d.children;
          c2 = c2._context;
          d = d.value;
          e = c2._currentValue2;
          c2._currentValue2 = d;
          g = D2;
          D2 = d = { parent: g, depth: null === g ? 0 : g.depth + 1, context: c2, parentValue: e, value: d };
          b2.context = d;
          W2(a, b2, f2);
          a = D2;
          if (null === a) throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
          d = a.parentValue;
          a.context._currentValue2 = d === Xa ? a.context._defaultValue : d;
          a = D2 = a.parent;
          b2.context = a;
          return;
        case Oa2:
          d = d.children;
          d = d(c2._currentValue2);
          W2(a, b2, d);
          return;
        case Ta2:
          f2 = c2._init;
          c2 = f2(c2._payload);
          d = Hb(c2, d);
          Ib(a, b2, c2, d, void 0);
          return;
      }
      throw Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == c2 ? c2 : typeof c2) + "."));
    }
  }
  function W2(a, b2, c2) {
    b2.node = c2;
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case Ia2:
          Ib(a, b2, c2.type, c2.props, c2.ref);
          return;
        case Ja:
          throw Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
        case Ta2:
          var d = c2._init;
          c2 = d(c2._payload);
          W2(a, b2, c2);
          return;
      }
      if (ra2(c2)) {
        Kb(a, b2, c2);
        return;
      }
      null === c2 || "object" !== typeof c2 ? d = null : (d = Ya && c2[Ya] || c2["@@iterator"], d = "function" === typeof d ? d : null);
      if (d && (d = d.call(c2))) {
        c2 = d.next();
        if (!c2.done) {
          var f2 = [];
          do
            f2.push(c2.value), c2 = d.next();
          while (!c2.done);
          Kb(a, b2, f2);
        }
        return;
      }
      a = Object.prototype.toString.call(c2);
      throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === a ? "object with keys {" + Object.keys(c2).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    "string" === typeof c2 ? (d = b2.blockedSegment, d.lastPushedText = Ha(b2.blockedSegment.chunks, c2, a.responseState, d.lastPushedText)) : "number" === typeof c2 && (d = b2.blockedSegment, d.lastPushedText = Ha(
      b2.blockedSegment.chunks,
      "" + c2,
      a.responseState,
      d.lastPushedText
    ));
  }
  function Kb(a, b2, c2) {
    for (var d = c2.length, f2 = 0; f2 < d; f2++) {
      var e = b2.treeContext;
      b2.treeContext = ib(e, d, f2);
      try {
        Jb(a, b2, c2[f2]);
      } finally {
        b2.treeContext = e;
      }
    }
  }
  function Jb(a, b2, c2) {
    var d = b2.blockedSegment.formatContext, f2 = b2.legacyContext, e = b2.context;
    try {
      return W2(a, b2, c2);
    } catch (k2) {
      if (tb(), "object" === typeof k2 && null !== k2 && "function" === typeof k2.then) {
        c2 = k2;
        var g = b2.blockedSegment, h2 = T2(a, g.chunks.length, null, g.formatContext, g.lastPushedText, true);
        g.children.push(h2);
        g.lastPushedText = false;
        a = Db(a, b2.node, b2.blockedBoundary, h2, b2.abortSet, b2.legacyContext, b2.context, b2.treeContext).ping;
        c2.then(a, a);
        b2.blockedSegment.formatContext = d;
        b2.legacyContext = f2;
        b2.context = e;
        F2(e);
      } else throw b2.blockedSegment.formatContext = d, b2.legacyContext = f2, b2.context = e, F2(e), k2;
    }
  }
  function Lb(a) {
    var b2 = a.blockedBoundary;
    a = a.blockedSegment;
    a.status = 3;
    Mb(this, b2, a);
  }
  function Nb(a, b2, c2) {
    var d = a.blockedBoundary;
    a.blockedSegment.status = 3;
    null === d ? (b2.allPendingTasks--, 2 !== b2.status && (b2.status = 2, null !== b2.destination && b2.destination.push(null))) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = true, d.errorDigest = b2.onError(void 0 === c2 ? Error("The render was aborted by the server without a reason.") : c2), d.parentFlushed && b2.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a2) {
      return Nb(a2, b2, c2);
    }), d.fallbackAbortableTasks.clear(), b2.allPendingTasks--, 0 === b2.allPendingTasks && (a = b2.onAllReady, a()));
  }
  function X2(a, b2) {
    if (0 === b2.chunks.length && 1 === b2.children.length && null === b2.children[0].boundary) {
      var c2 = b2.children[0];
      c2.id = b2.id;
      c2.parentFlushed = true;
      1 === c2.status && X2(a, c2);
    } else a.completedSegments.push(b2);
  }
  function Mb(a, b2, c2) {
    if (null === b2) {
      if (c2.parentFlushed) {
        if (null !== a.completedRootSegment) throw Error("There can only be one root segment. This is a bug in React.");
        a.completedRootSegment = c2;
      }
      a.pendingRootTasks--;
      0 === a.pendingRootTasks && (a.onShellError = S, b2 = a.onShellReady, b2());
    } else b2.pendingTasks--, b2.forceClientRender || (0 === b2.pendingTasks ? (c2.parentFlushed && 1 === c2.status && X2(b2, c2), b2.parentFlushed && a.completedBoundaries.push(b2), b2.fallbackAbortableTasks.forEach(Lb, a), b2.fallbackAbortableTasks.clear()) : c2.parentFlushed && 1 === c2.status && (X2(b2, c2), 1 === b2.completedSegments.length && b2.parentFlushed && a.partialBoundaries.push(b2)));
    a.allPendingTasks--;
    0 === a.allPendingTasks && (a = a.onAllReady, a());
  }
  function Eb(a) {
    if (2 !== a.status) {
      var b2 = D2, c2 = Ab.current;
      Ab.current = zb;
      var d = R2;
      R2 = a.responseState;
      try {
        var f2 = a.pingedTasks, e;
        for (e = 0; e < f2.length; e++) {
          var g = f2[e];
          var h2 = a, k2 = g.blockedSegment;
          if (0 === k2.status) {
            F2(g.context);
            try {
              W2(h2, g, g.node), h2.responseState.generateStaticMarkup || k2.lastPushedText && k2.textEmbedded && k2.chunks.push("<!-- -->"), g.abortSet.delete(g), k2.status = 1, Mb(h2, g.blockedBoundary, k2);
            } catch (y2) {
              if (tb(), "object" === typeof y2 && null !== y2 && "function" === typeof y2.then) {
                var m2 = g.ping;
                y2.then(m2, m2);
              } else {
                g.abortSet.delete(g);
                k2.status = 4;
                var l = g.blockedBoundary, p2 = y2, B2 = U2(h2, p2);
                null === l ? V2(h2, p2) : (l.pendingTasks--, l.forceClientRender || (l.forceClientRender = true, l.errorDigest = B2, l.parentFlushed && h2.clientRenderedBoundaries.push(l)));
                h2.allPendingTasks--;
                if (0 === h2.allPendingTasks) {
                  var C2 = h2.onAllReady;
                  C2();
                }
              }
            } finally {
            }
          }
        }
        f2.splice(0, e);
        null !== a.destination && Ob(a, a.destination);
      } catch (y2) {
        U2(a, y2), V2(a, y2);
      } finally {
        R2 = d, Ab.current = c2, c2 === zb && F2(b2);
      }
    }
  }
  function Y2(a, b2, c2) {
    c2.parentFlushed = true;
    switch (c2.status) {
      case 0:
        var d = c2.id = a.nextSegmentId++;
        c2.lastPushedText = false;
        c2.textEmbedded = false;
        a = a.responseState;
        b2.push('<template id="');
        b2.push(a.placeholderPrefix);
        a = d.toString(16);
        b2.push(a);
        return b2.push('"></template>');
      case 1:
        c2.status = 2;
        var f2 = true;
        d = c2.chunks;
        var e = 0;
        c2 = c2.children;
        for (var g = 0; g < c2.length; g++) {
          for (f2 = c2[g]; e < f2.index; e++) b2.push(d[e]);
          f2 = Z2(a, b2, f2);
        }
        for (; e < d.length - 1; e++) b2.push(d[e]);
        e < d.length && (f2 = b2.push(d[e]));
        return f2;
      default:
        throw Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
    }
  }
  function Z2(a, b2, c2) {
    var d = c2.boundary;
    if (null === d) return Y2(a, b2, c2);
    d.parentFlushed = true;
    if (d.forceClientRender) return a.responseState.generateStaticMarkup || (d = d.errorDigest, b2.push("<!--$!-->"), b2.push("<template"), d && (b2.push(' data-dgst="'), d = u2(d), b2.push(d), b2.push('"')), b2.push("></template>")), Y2(a, b2, c2), a = a.responseState.generateStaticMarkup ? true : b2.push("<!--/$-->"), a;
    if (0 < d.pendingTasks) {
      d.rootSegmentID = a.nextSegmentId++;
      0 < d.completedSegments.length && a.partialBoundaries.push(d);
      var f2 = a.responseState;
      var e = f2.nextSuspenseID++;
      f2 = f2.boundaryPrefix + e.toString(16);
      d = d.id = f2;
      Aa2(b2, a.responseState, d);
      Y2(a, b2, c2);
      return b2.push("<!--/$-->");
    }
    if (d.byteSize > a.progressiveChunkSize) return d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), Aa2(b2, a.responseState, d.id), Y2(a, b2, c2), b2.push("<!--/$-->");
    a.responseState.generateStaticMarkup || b2.push("<!--$-->");
    c2 = d.completedSegments;
    if (1 !== c2.length) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
    Z2(a, b2, c2[0]);
    a = a.responseState.generateStaticMarkup ? true : b2.push("<!--/$-->");
    return a;
  }
  function Pb(a, b2, c2) {
    Ba(b2, a.responseState, c2.formatContext, c2.id);
    Z2(a, b2, c2);
    return Ca2(b2, c2.formatContext);
  }
  function Qb(a, b2, c2) {
    for (var d = c2.completedSegments, f2 = 0; f2 < d.length; f2++) Rb(a, b2, c2, d[f2]);
    d.length = 0;
    a = a.responseState;
    d = c2.id;
    c2 = c2.rootSegmentID;
    b2.push(a.startInlineScript);
    a.sentCompleteBoundaryFunction ? b2.push('$RC("') : (a.sentCompleteBoundaryFunction = true, b2.push('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'));
    if (null === d) throw Error("An ID must have been assigned before we can complete the boundary.");
    c2 = c2.toString(16);
    b2.push(d);
    b2.push('","');
    b2.push(a.segmentPrefix);
    b2.push(c2);
    return b2.push('")<\/script>');
  }
  function Rb(a, b2, c2, d) {
    if (2 === d.status) return true;
    var f2 = d.id;
    if (-1 === f2) {
      if (-1 === (d.id = c2.rootSegmentID)) throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
      return Pb(a, b2, d);
    }
    Pb(a, b2, d);
    a = a.responseState;
    b2.push(a.startInlineScript);
    a.sentCompleteSegmentFunction ? b2.push('$RS("') : (a.sentCompleteSegmentFunction = true, b2.push('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'));
    b2.push(a.segmentPrefix);
    f2 = f2.toString(16);
    b2.push(f2);
    b2.push('","');
    b2.push(a.placeholderPrefix);
    b2.push(f2);
    return b2.push('")<\/script>');
  }
  function Ob(a, b2) {
    try {
      var c2 = a.completedRootSegment;
      if (null !== c2 && 0 === a.pendingRootTasks) {
        Z2(a, b2, c2);
        a.completedRootSegment = null;
        var d = a.responseState.bootstrapChunks;
        for (c2 = 0; c2 < d.length - 1; c2++) b2.push(d[c2]);
        c2 < d.length && b2.push(d[c2]);
      }
      var f2 = a.clientRenderedBoundaries, e;
      for (e = 0; e < f2.length; e++) {
        var g = f2[e];
        d = b2;
        var h2 = a.responseState, k2 = g.id, m2 = g.errorDigest, l = g.errorMessage, p2 = g.errorComponentStack;
        d.push(h2.startInlineScript);
        h2.sentClientRenderFunction ? d.push('$RX("') : (h2.sentClientRenderFunction = true, d.push('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'));
        if (null === k2) throw Error("An ID must have been assigned before we can complete the boundary.");
        d.push(k2);
        d.push('"');
        if (m2 || l || p2) {
          d.push(",");
          var B2 = Ea2(m2 || "");
          d.push(B2);
        }
        if (l || p2) {
          d.push(",");
          var C2 = Ea2(l || "");
          d.push(C2);
        }
        if (p2) {
          d.push(",");
          var y2 = Ea2(p2);
          d.push(y2);
        }
        if (!d.push(")<\/script>")) {
          a.destination = null;
          e++;
          f2.splice(0, e);
          return;
        }
      }
      f2.splice(0, e);
      var aa2 = a.completedBoundaries;
      for (e = 0; e < aa2.length; e++) if (!Qb(a, b2, aa2[e])) {
        a.destination = null;
        e++;
        aa2.splice(0, e);
        return;
      }
      aa2.splice(0, e);
      var ba2 = a.partialBoundaries;
      for (e = 0; e < ba2.length; e++) {
        var pb = ba2[e];
        a: {
          f2 = a;
          g = b2;
          var ca2 = pb.completedSegments;
          for (h2 = 0; h2 < ca2.length; h2++) if (!Rb(f2, g, pb, ca2[h2])) {
            h2++;
            ca2.splice(0, h2);
            var qb = false;
            break a;
          }
          ca2.splice(0, h2);
          qb = true;
        }
        if (!qb) {
          a.destination = null;
          e++;
          ba2.splice(0, e);
          return;
        }
      }
      ba2.splice(0, e);
      var da2 = a.completedBoundaries;
      for (e = 0; e < da2.length; e++) if (!Qb(a, b2, da2[e])) {
        a.destination = null;
        e++;
        da2.splice(0, e);
        return;
      }
      da2.splice(0, e);
    } finally {
      0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b2.push(null);
    }
  }
  function Sb(a, b2) {
    if (1 === a.status) a.status = 2, b2.destroy(a.fatalError);
    else if (2 !== a.status && null === a.destination) {
      a.destination = b2;
      try {
        Ob(a, b2);
      } catch (c2) {
        U2(a, c2), V2(a, c2);
      }
    }
  }
  function Tb(a, b2) {
    try {
      var c2 = a.abortableTasks;
      c2.forEach(function(c3) {
        return Nb(c3, a, b2);
      });
      c2.clear();
      null !== a.destination && Ob(a, a.destination);
    } catch (d) {
      U2(a, d), V2(a, d);
    }
  }
  function Ub() {
  }
  function Vb(a, b2, c2, d) {
    var f2 = false, e = null, g = "", h2 = false;
    a = Cb(a, Fa(c2, b2 ? b2.identifierPrefix : void 0), Ga(), Infinity, Ub, void 0, function() {
      h2 = true;
    });
    Eb(a);
    Tb(a, d);
    Sb(a, { push: function(a2) {
      null !== a2 && (g += a2);
      return true;
    }, destroy: function(a2) {
      f2 = true;
      e = a2;
    } });
    if (f2) throw e;
    if (!h2) throw Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
    return g;
  }
  function Wb(a, b2) {
    a.prototype = Object.create(b2.prototype);
    a.prototype.constructor = a;
    a.__proto__ = b2;
  }
  var Xb = (function(a) {
    function b2() {
      var b3 = a.call(this, {}) || this;
      b3.request = null;
      b3.startedFlowing = false;
      return b3;
    }
    Wb(b2, a);
    var c2 = b2.prototype;
    c2._destroy = function(a2, b3) {
      Tb(this.request);
      b3(a2);
    };
    c2._read = function() {
      this.startedFlowing && Sb(this.request, this);
    };
    return b2;
  })(fa2.Readable);
  function Yb() {
  }
  function Zb(a, b2) {
    var c2 = new Xb(), d = Cb(a, Fa(false, b2 ? b2.identifierPrefix : void 0), Ga(), Infinity, Yb, function() {
      c2.startedFlowing = true;
      Sb(d, c2);
    }, void 0);
    c2.request = d;
    Eb(d);
    return c2;
  }
  reactDomServerLegacy_node_production_min.renderToNodeStream = function(a, b2) {
    return Zb(a, b2);
  };
  reactDomServerLegacy_node_production_min.renderToStaticMarkup = function(a, b2) {
    return Vb(a, b2, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server');
  };
  reactDomServerLegacy_node_production_min.renderToStaticNodeStream = function(a, b2) {
    return Zb(a, b2);
  };
  reactDomServerLegacy_node_production_min.renderToString = function(a, b2) {
    return Vb(a, b2, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server');
  };
  reactDomServerLegacy_node_production_min.version = "18.3.1";
  return reactDomServerLegacy_node_production_min;
}
var reactDomServer_node_production_min = {};
var hasRequiredReactDomServer_node_production_min;
function requireReactDomServer_node_production_min() {
  if (hasRequiredReactDomServer_node_production_min) return reactDomServer_node_production_min;
  hasRequiredReactDomServer_node_production_min = 1;
  var aa2 = require$$0, ba2 = requireReact(), k2 = null, l = 0, q2 = true;
  function r(a, b2) {
    if ("string" === typeof b2) {
      if (0 !== b2.length) if (2048 < 3 * b2.length) 0 < l && (t(a, k2.subarray(0, l)), k2 = new Uint8Array(2048), l = 0), t(a, u2.encode(b2));
      else {
        var c2 = k2;
        0 < l && (c2 = k2.subarray(l));
        c2 = u2.encodeInto(b2, c2);
        var d = c2.read;
        l += c2.written;
        d < b2.length && (t(a, k2), k2 = new Uint8Array(2048), l = u2.encodeInto(b2.slice(d), k2).written);
        2048 === l && (t(a, k2), k2 = new Uint8Array(2048), l = 0);
      }
    } else 0 !== b2.byteLength && (2048 < b2.byteLength ? (0 < l && (t(a, k2.subarray(0, l)), k2 = new Uint8Array(2048), l = 0), t(a, b2)) : (c2 = k2.length - l, c2 < b2.byteLength && (0 === c2 ? t(
      a,
      k2
    ) : (k2.set(b2.subarray(0, c2), l), l += c2, t(a, k2), b2 = b2.subarray(c2)), k2 = new Uint8Array(2048), l = 0), k2.set(b2, l), l += b2.byteLength, 2048 === l && (t(a, k2), k2 = new Uint8Array(2048), l = 0)));
  }
  function t(a, b2) {
    a = a.write(b2);
    q2 = q2 && a;
  }
  function w3(a, b2) {
    r(a, b2);
    return q2;
  }
  function ca2(a) {
    k2 && 0 < l && a.write(k2.subarray(0, l));
    k2 = null;
    l = 0;
    q2 = true;
  }
  var u2 = new aa2.TextEncoder();
  function x2(a) {
    return u2.encode(a);
  }
  var y2 = Object.prototype.hasOwnProperty, da2 = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ea2 = {}, fa2 = {};
  function ha(a) {
    if (y2.call(fa2, a)) return true;
    if (y2.call(ea2, a)) return false;
    if (da2.test(a)) return fa2[a] = true;
    ea2[a] = true;
    return false;
  }
  function z2(a, b2, c2, d, f2, e, g) {
    this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
    this.attributeName = d;
    this.attributeNamespace = f2;
    this.mustUseProperty = c2;
    this.propertyName = a;
    this.type = b2;
    this.sanitizeURL = e;
    this.removeEmptyString = g;
  }
  var A2 = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    A2[a] = new z2(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b2 = a[0];
    A2[b2] = new z2(b2, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    A2[a] = new z2(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    A2[a] = new z2(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    A2[a] = new z2(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    A2[a] = new z2(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    A2[a] = new z2(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    A2[a] = new z2(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    A2[a] = new z2(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var ia2 = /[\-:]([a-z])/g;
  function ja(a) {
    return a[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b2 = a.replace(
      ia2,
      ja
    );
    A2[b2] = new z2(b2, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b2 = a.replace(ia2, ja);
    A2[b2] = new z2(b2, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b2 = a.replace(ia2, ja);
    A2[b2] = new z2(b2, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    A2[a] = new z2(a, 1, false, a.toLowerCase(), null, false, false);
  });
  A2.xlinkHref = new z2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    A2[a] = new z2(a, 1, false, a.toLowerCase(), null, true, true);
  });
  var B2 = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, ka = ["Webkit", "ms", "Moz", "O"];
  Object.keys(B2).forEach(function(a) {
    ka.forEach(function(b2) {
      b2 = b2 + a.charAt(0).toUpperCase() + a.substring(1);
      B2[b2] = B2[a];
    });
  });
  var la2 = /["'&<>]/;
  function F2(a) {
    if ("boolean" === typeof a || "number" === typeof a) return "" + a;
    a = "" + a;
    var b2 = la2.exec(a);
    if (b2) {
      var c2 = "", d, f2 = 0;
      for (d = b2.index; d < a.length; d++) {
        switch (a.charCodeAt(d)) {
          case 34:
            b2 = "&quot;";
            break;
          case 38:
            b2 = "&amp;";
            break;
          case 39:
            b2 = "&#x27;";
            break;
          case 60:
            b2 = "&lt;";
            break;
          case 62:
            b2 = "&gt;";
            break;
          default:
            continue;
        }
        f2 !== d && (c2 += a.substring(f2, d));
        f2 = d + 1;
        c2 += b2;
      }
      a = f2 !== d ? c2 + a.substring(f2, d) : c2;
    }
    return a;
  }
  var ma2 = /([A-Z])/g, pa2 = /^ms-/, qa = Array.isArray, ra2 = x2("<script>"), sa2 = x2("<\/script>"), ta2 = x2('<script src="'), ua2 = x2('<script type="module" src="'), va2 = x2('" async=""><\/script>'), wa = /(<\/|<)(s)(cript)/gi;
  function xa2(a, b2, c2, d) {
    return "" + b2 + ("s" === c2 ? "\\u0073" : "\\u0053") + d;
  }
  function G2(a, b2) {
    return { insertionMode: a, selectedValue: b2 };
  }
  function ya2(a, b2, c2) {
    switch (b2) {
      case "select":
        return G2(1, null != c2.value ? c2.value : c2.defaultValue);
      case "svg":
        return G2(2, null);
      case "math":
        return G2(3, null);
      case "foreignObject":
        return G2(1, null);
      case "table":
        return G2(4, null);
      case "thead":
      case "tbody":
      case "tfoot":
        return G2(5, null);
      case "colgroup":
        return G2(7, null);
      case "tr":
        return G2(6, null);
    }
    return 4 <= a.insertionMode || 0 === a.insertionMode ? G2(1, null) : a;
  }
  var za = x2("<!-- -->");
  function Aa2(a, b2, c2, d) {
    if ("" === b2) return d;
    d && a.push(za);
    a.push(F2(b2));
    return true;
  }
  var Ba = /* @__PURE__ */ new Map(), Ca2 = x2(' style="'), Da = x2(":"), Ea2 = x2(";");
  function Fa(a, b2, c2) {
    if ("object" !== typeof c2) throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
    b2 = true;
    for (var d in c2) if (y2.call(c2, d)) {
      var f2 = c2[d];
      if (null != f2 && "boolean" !== typeof f2 && "" !== f2) {
        if (0 === d.indexOf("--")) {
          var e = F2(d);
          f2 = F2(("" + f2).trim());
        } else {
          e = d;
          var g = Ba.get(e);
          void 0 !== g ? e = g : (g = x2(F2(e.replace(ma2, "-$1").toLowerCase().replace(pa2, "-ms-"))), Ba.set(e, g), e = g);
          f2 = "number" === typeof f2 ? 0 === f2 || y2.call(
            B2,
            d
          ) ? "" + f2 : f2 + "px" : F2(("" + f2).trim());
        }
        b2 ? (b2 = false, a.push(Ca2, e, Da, f2)) : a.push(Ea2, e, Da, f2);
      }
    }
    b2 || a.push(H);
  }
  var I2 = x2(" "), J = x2('="'), H = x2('"'), Ga = x2('=""');
  function K2(a, b2, c2, d) {
    switch (c2) {
      case "style":
        Fa(a, b2, d);
        return;
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
        return;
    }
    if (!(2 < c2.length) || "o" !== c2[0] && "O" !== c2[0] || "n" !== c2[1] && "N" !== c2[1]) {
      if (b2 = A2.hasOwnProperty(c2) ? A2[c2] : null, null !== b2) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (!b2.acceptsBooleans) return;
        }
        c2 = b2.attributeName;
        switch (b2.type) {
          case 3:
            d && a.push(I2, c2, Ga);
            break;
          case 4:
            true === d ? a.push(I2, c2, Ga) : false !== d && a.push(I2, c2, J, F2(d), H);
            break;
          case 5:
            isNaN(d) || a.push(I2, c2, J, F2(d), H);
            break;
          case 6:
            !isNaN(d) && 1 <= d && a.push(I2, c2, J, F2(d), H);
            break;
          default:
            b2.sanitizeURL && (d = "" + d), a.push(I2, c2, J, F2(d), H);
        }
      } else if (ha(c2)) {
        switch (typeof d) {
          case "function":
          case "symbol":
            return;
          case "boolean":
            if (b2 = c2.toLowerCase().slice(0, 5), "data-" !== b2 && "aria-" !== b2) return;
        }
        a.push(I2, c2, J, F2(d), H);
      }
    }
  }
  var L2 = x2(">"), Ha = x2("/>");
  function M2(a, b2, c2) {
    if (null != b2) {
      if (null != c2) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
      if ("object" !== typeof b2 || !("__html" in b2)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
      b2 = b2.__html;
      null !== b2 && void 0 !== b2 && a.push("" + b2);
    }
  }
  function Ia2(a) {
    var b2 = "";
    ba2.Children.forEach(a, function(a2) {
      null != a2 && (b2 += a2);
    });
    return b2;
  }
  var Ja = x2(' selected=""');
  function Ka(a, b2, c2, d) {
    a.push(N2(c2));
    var f2 = c2 = null, e;
    for (e in b2) if (y2.call(b2, e)) {
      var g = b2[e];
      if (null != g) switch (e) {
        case "children":
          c2 = g;
          break;
        case "dangerouslySetInnerHTML":
          f2 = g;
          break;
        default:
          K2(a, d, e, g);
      }
    }
    a.push(L2);
    M2(a, f2, c2);
    return "string" === typeof c2 ? (a.push(F2(c2)), null) : c2;
  }
  var La = x2("\n"), Ma = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/, Na2 = /* @__PURE__ */ new Map();
  function N2(a) {
    var b2 = Na2.get(a);
    if (void 0 === b2) {
      if (!Ma.test(a)) throw Error("Invalid tag: " + a);
      b2 = x2("<" + a);
      Na2.set(a, b2);
    }
    return b2;
  }
  var Oa2 = x2("<!DOCTYPE html>");
  function Pa2(a, b2, c2, d, f2) {
    switch (b2) {
      case "select":
        a.push(N2("select"));
        var e = null, g = null;
        for (p2 in c2) if (y2.call(c2, p2)) {
          var h2 = c2[p2];
          if (null != h2) switch (p2) {
            case "children":
              e = h2;
              break;
            case "dangerouslySetInnerHTML":
              g = h2;
              break;
            case "defaultValue":
            case "value":
              break;
            default:
              K2(a, d, p2, h2);
          }
        }
        a.push(L2);
        M2(a, g, e);
        return e;
      case "option":
        g = f2.selectedValue;
        a.push(N2("option"));
        var m2 = h2 = null, n = null;
        var p2 = null;
        for (e in c2) if (y2.call(c2, e)) {
          var v2 = c2[e];
          if (null != v2) switch (e) {
            case "children":
              h2 = v2;
              break;
            case "selected":
              n = v2;
              break;
            case "dangerouslySetInnerHTML":
              p2 = v2;
              break;
            case "value":
              m2 = v2;
            default:
              K2(a, d, e, v2);
          }
        }
        if (null != g) if (c2 = null !== m2 ? "" + m2 : Ia2(h2), qa(g)) for (d = 0; d < g.length; d++) {
          if ("" + g[d] === c2) {
            a.push(Ja);
            break;
          }
        }
        else "" + g === c2 && a.push(Ja);
        else n && a.push(Ja);
        a.push(L2);
        M2(a, p2, h2);
        return h2;
      case "textarea":
        a.push(N2("textarea"));
        p2 = g = e = null;
        for (h2 in c2) if (y2.call(c2, h2) && (m2 = c2[h2], null != m2)) switch (h2) {
          case "children":
            p2 = m2;
            break;
          case "value":
            e = m2;
            break;
          case "defaultValue":
            g = m2;
            break;
          case "dangerouslySetInnerHTML":
            throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
          default:
            K2(a, d, h2, m2);
        }
        null === e && null !== g && (e = g);
        a.push(L2);
        if (null != p2) {
          if (null != e) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
          if (qa(p2) && 1 < p2.length) throw Error("<textarea> can only have at most one child.");
          e = "" + p2;
        }
        "string" === typeof e && "\n" === e[0] && a.push(La);
        null !== e && a.push(F2("" + e));
        return null;
      case "input":
        a.push(N2("input"));
        m2 = p2 = h2 = e = null;
        for (g in c2) if (y2.call(c2, g) && (n = c2[g], null != n)) switch (g) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
          case "defaultChecked":
            m2 = n;
            break;
          case "defaultValue":
            h2 = n;
            break;
          case "checked":
            p2 = n;
            break;
          case "value":
            e = n;
            break;
          default:
            K2(a, d, g, n);
        }
        null !== p2 ? K2(a, d, "checked", p2) : null !== m2 && K2(a, d, "checked", m2);
        null !== e ? K2(a, d, "value", e) : null !== h2 && K2(a, d, "value", h2);
        a.push(Ha);
        return null;
      case "menuitem":
        a.push(N2("menuitem"));
        for (var C2 in c2) if (y2.call(c2, C2) && (e = c2[C2], null != e)) switch (C2) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
          default:
            K2(a, d, C2, e);
        }
        a.push(L2);
        return null;
      case "title":
        a.push(N2("title"));
        e = null;
        for (v2 in c2) if (y2.call(c2, v2) && (g = c2[v2], null != g)) switch (v2) {
          case "children":
            e = g;
            break;
          case "dangerouslySetInnerHTML":
            throw Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
          default:
            K2(a, d, v2, g);
        }
        a.push(L2);
        return e;
      case "listing":
      case "pre":
        a.push(N2(b2));
        g = e = null;
        for (m2 in c2) if (y2.call(c2, m2) && (h2 = c2[m2], null != h2)) switch (m2) {
          case "children":
            e = h2;
            break;
          case "dangerouslySetInnerHTML":
            g = h2;
            break;
          default:
            K2(a, d, m2, h2);
        }
        a.push(L2);
        if (null != g) {
          if (null != e) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if ("object" !== typeof g || !("__html" in g)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
          c2 = g.__html;
          null !== c2 && void 0 !== c2 && ("string" === typeof c2 && 0 < c2.length && "\n" === c2[0] ? a.push(La, c2) : a.push("" + c2));
        }
        "string" === typeof e && "\n" === e[0] && a.push(La);
        return e;
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "img":
      case "keygen":
      case "link":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
        a.push(N2(b2));
        for (var D2 in c2) if (y2.call(c2, D2) && (e = c2[D2], null != e)) switch (D2) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(b2 + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
          default:
            K2(a, d, D2, e);
        }
        a.push(Ha);
        return null;
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return Ka(a, c2, b2, d);
      case "html":
        return 0 === f2.insertionMode && a.push(Oa2), Ka(
          a,
          c2,
          b2,
          d
        );
      default:
        if (-1 === b2.indexOf("-") && "string" !== typeof c2.is) return Ka(a, c2, b2, d);
        a.push(N2(b2));
        g = e = null;
        for (n in c2) if (y2.call(c2, n) && (h2 = c2[n], null != h2)) switch (n) {
          case "children":
            e = h2;
            break;
          case "dangerouslySetInnerHTML":
            g = h2;
            break;
          case "style":
            Fa(a, d, h2);
            break;
          case "suppressContentEditableWarning":
          case "suppressHydrationWarning":
            break;
          default:
            ha(n) && "function" !== typeof h2 && "symbol" !== typeof h2 && a.push(I2, n, J, F2(h2), H);
        }
        a.push(L2);
        M2(a, g, e);
        return e;
    }
  }
  var Qa = x2("</"), Ra2 = x2(">"), Sa2 = x2('<template id="'), Ta2 = x2('"></template>'), Ua = x2("<!--$-->"), Va = x2('<!--$?--><template id="'), Wa = x2('"></template>'), Xa = x2("<!--$!-->"), Ya = x2("<!--/$-->"), Za = x2("<template"), $a = x2('"'), ab = x2(' data-dgst="');
  x2(' data-msg="');
  x2(' data-stck="');
  var bb = x2("></template>");
  function cb(a, b2, c2) {
    r(a, Va);
    if (null === c2) throw Error("An ID must have been assigned before we can complete the boundary.");
    r(a, c2);
    return w3(a, Wa);
  }
  var db = x2('<div hidden id="'), eb = x2('">'), fb = x2("</div>"), gb = x2('<svg aria-hidden="true" style="display:none" id="'), hb = x2('">'), ib = x2("</svg>"), jb = x2('<math aria-hidden="true" style="display:none" id="'), kb = x2('">'), lb = x2("</math>"), mb = x2('<table hidden id="'), nb = x2('">'), ob = x2("</table>"), pb = x2('<table hidden><tbody id="'), qb = x2('">'), rb = x2("</tbody></table>"), sb = x2('<table hidden><tr id="'), tb = x2('">'), ub = x2("</tr></table>"), vb = x2('<table hidden><colgroup id="'), wb = x2('">'), xb = x2("</colgroup></table>");
  function yb(a, b2, c2, d) {
    switch (c2.insertionMode) {
      case 0:
      case 1:
        return r(a, db), r(a, b2.segmentPrefix), r(a, d.toString(16)), w3(a, eb);
      case 2:
        return r(a, gb), r(a, b2.segmentPrefix), r(a, d.toString(16)), w3(a, hb);
      case 3:
        return r(a, jb), r(a, b2.segmentPrefix), r(a, d.toString(16)), w3(a, kb);
      case 4:
        return r(a, mb), r(a, b2.segmentPrefix), r(a, d.toString(16)), w3(a, nb);
      case 5:
        return r(a, pb), r(a, b2.segmentPrefix), r(a, d.toString(16)), w3(a, qb);
      case 6:
        return r(a, sb), r(a, b2.segmentPrefix), r(a, d.toString(16)), w3(a, tb);
      case 7:
        return r(a, vb), r(
          a,
          b2.segmentPrefix
        ), r(a, d.toString(16)), w3(a, wb);
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  function zb(a, b2) {
    switch (b2.insertionMode) {
      case 0:
      case 1:
        return w3(a, fb);
      case 2:
        return w3(a, ib);
      case 3:
        return w3(a, lb);
      case 4:
        return w3(a, ob);
      case 5:
        return w3(a, rb);
      case 6:
        return w3(a, ub);
      case 7:
        return w3(a, xb);
      default:
        throw Error("Unknown insertion mode. This is a bug in React.");
    }
  }
  var Ab = x2('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'), Bb = x2('$RS("'), Cb = x2('","'), Db = x2('")<\/script>'), Fb = x2('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'), Gb = x2('$RC("'), Hb = x2('","'), Ib = x2('")<\/script>'), Jb = x2('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'), Kb = x2('$RX("'), Lb = x2('"'), Mb = x2(")<\/script>"), Nb = x2(","), Ob = /[<\u2028\u2029]/g;
  function Pb(a) {
    return JSON.stringify(a).replace(Ob, function(a2) {
      switch (a2) {
        case "<":
          return "\\u003c";
        case "\u2028":
          return "\\u2028";
        case "\u2029":
          return "\\u2029";
        default:
          throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
      }
    });
  }
  var O2 = Object.assign, Qb = /* @__PURE__ */ Symbol.for("react.element"), Rb = /* @__PURE__ */ Symbol.for("react.portal"), Sb = /* @__PURE__ */ Symbol.for("react.fragment"), Tb = /* @__PURE__ */ Symbol.for("react.strict_mode"), Ub = /* @__PURE__ */ Symbol.for("react.profiler"), Vb = /* @__PURE__ */ Symbol.for("react.provider"), Wb = /* @__PURE__ */ Symbol.for("react.context"), Xb = /* @__PURE__ */ Symbol.for("react.forward_ref"), Yb = /* @__PURE__ */ Symbol.for("react.suspense"), Zb = /* @__PURE__ */ Symbol.for("react.suspense_list"), $b = /* @__PURE__ */ Symbol.for("react.memo"), ac = /* @__PURE__ */ Symbol.for("react.lazy"), bc = /* @__PURE__ */ Symbol.for("react.scope"), cc = /* @__PURE__ */ Symbol.for("react.debug_trace_mode"), dc = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), ec = /* @__PURE__ */ Symbol.for("react.default_value"), fc = Symbol.iterator;
  function gc(a) {
    if (null == a) return null;
    if ("function" === typeof a) return a.displayName || a.name || null;
    if ("string" === typeof a) return a;
    switch (a) {
      case Sb:
        return "Fragment";
      case Rb:
        return "Portal";
      case Ub:
        return "Profiler";
      case Tb:
        return "StrictMode";
      case Yb:
        return "Suspense";
      case Zb:
        return "SuspenseList";
    }
    if ("object" === typeof a) switch (a.$$typeof) {
      case Wb:
        return (a.displayName || "Context") + ".Consumer";
      case Vb:
        return (a._context.displayName || "Context") + ".Provider";
      case Xb:
        var b2 = a.render;
        a = a.displayName;
        a || (a = b2.displayName || b2.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case $b:
        return b2 = a.displayName || null, null !== b2 ? b2 : gc(a.type) || "Memo";
      case ac:
        b2 = a._payload;
        a = a._init;
        try {
          return gc(a(b2));
        } catch (c2) {
        }
    }
    return null;
  }
  var hc = {};
  function ic(a, b2) {
    a = a.contextTypes;
    if (!a) return hc;
    var c2 = {}, d;
    for (d in a) c2[d] = b2[d];
    return c2;
  }
  var P2 = null;
  function Q2(a, b2) {
    if (a !== b2) {
      a.context._currentValue = a.parentValue;
      a = a.parent;
      var c2 = b2.parent;
      if (null === a) {
        if (null !== c2) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
      } else {
        if (null === c2) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
        Q2(a, c2);
      }
      b2.context._currentValue = b2.value;
    }
  }
  function jc(a) {
    a.context._currentValue = a.parentValue;
    a = a.parent;
    null !== a && jc(a);
  }
  function kc(a) {
    var b2 = a.parent;
    null !== b2 && kc(b2);
    a.context._currentValue = a.value;
  }
  function lc(a, b2) {
    a.context._currentValue = a.parentValue;
    a = a.parent;
    if (null === a) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
    a.depth === b2.depth ? Q2(a, b2) : lc(a, b2);
  }
  function mc(a, b2) {
    var c2 = b2.parent;
    if (null === c2) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
    a.depth === c2.depth ? Q2(a, c2) : mc(a, c2);
    b2.context._currentValue = b2.value;
  }
  function nc(a) {
    var b2 = P2;
    b2 !== a && (null === b2 ? kc(a) : null === a ? jc(b2) : b2.depth === a.depth ? Q2(b2, a) : b2.depth > a.depth ? lc(b2, a) : mc(b2, a), P2 = a);
  }
  var oc = { isMounted: function() {
    return false;
  }, enqueueSetState: function(a, b2) {
    a = a._reactInternals;
    null !== a.queue && a.queue.push(b2);
  }, enqueueReplaceState: function(a, b2) {
    a = a._reactInternals;
    a.replace = true;
    a.queue = [b2];
  }, enqueueForceUpdate: function() {
  } };
  function pc(a, b2, c2, d) {
    var f2 = void 0 !== a.state ? a.state : null;
    a.updater = oc;
    a.props = c2;
    a.state = f2;
    var e = { queue: [], replace: false };
    a._reactInternals = e;
    var g = b2.contextType;
    a.context = "object" === typeof g && null !== g ? g._currentValue : d;
    g = b2.getDerivedStateFromProps;
    "function" === typeof g && (g = g(c2, f2), f2 = null === g || void 0 === g ? f2 : O2({}, f2, g), a.state = f2);
    if ("function" !== typeof b2.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount)) if (b2 = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b2 !== a.state && oc.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length) if (b2 = e.queue, g = e.replace, e.queue = null, e.replace = false, g && 1 === b2.length) a.state = b2[0];
    else {
      e = g ? b2[0] : a.state;
      f2 = true;
      for (g = g ? 1 : 0; g < b2.length; g++) {
        var h2 = b2[g];
        h2 = "function" === typeof h2 ? h2.call(a, e, c2, d) : h2;
        null != h2 && (f2 ? (f2 = false, e = O2({}, e, h2)) : O2(e, h2));
      }
      a.state = e;
    }
    else e.queue = null;
  }
  var qc = { id: 1, overflow: "" };
  function rc(a, b2, c2) {
    var d = a.id;
    a = a.overflow;
    var f2 = 32 - sc(d) - 1;
    d &= ~(1 << f2);
    c2 += 1;
    var e = 32 - sc(b2) + f2;
    if (30 < e) {
      var g = f2 - f2 % 5;
      e = (d & (1 << g) - 1).toString(32);
      d >>= g;
      f2 -= g;
      return { id: 1 << 32 - sc(b2) + f2 | c2 << f2 | d, overflow: e + a };
    }
    return { id: 1 << e | c2 << f2 | d, overflow: a };
  }
  var sc = Math.clz32 ? Math.clz32 : tc, uc = Math.log, vc = Math.LN2;
  function tc(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (uc(a) / vc | 0) | 0;
  }
  function wc(a, b2) {
    return a === b2 && (0 !== a || 1 / a === 1 / b2) || a !== a && b2 !== b2;
  }
  var xc = "function" === typeof Object.is ? Object.is : wc, R2 = null, yc = null, zc = null, S = null, T2 = false, Ac = false, U2 = 0, V2 = null, Bc = 0;
  function W2() {
    if (null === R2) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
    return R2;
  }
  function Cc() {
    if (0 < Bc) throw Error("Rendered more hooks than during the previous render");
    return { memoizedState: null, queue: null, next: null };
  }
  function Dc() {
    null === S ? null === zc ? (T2 = false, zc = S = Cc()) : (T2 = true, S = zc) : null === S.next ? (T2 = false, S = S.next = Cc()) : (T2 = true, S = S.next);
    return S;
  }
  function Ec() {
    yc = R2 = null;
    Ac = false;
    zc = null;
    Bc = 0;
    S = V2 = null;
  }
  function Fc(a, b2) {
    return "function" === typeof b2 ? b2(a) : b2;
  }
  function Gc(a, b2, c2) {
    R2 = W2();
    S = Dc();
    if (T2) {
      var d = S.queue;
      b2 = d.dispatch;
      if (null !== V2 && (c2 = V2.get(d), void 0 !== c2)) {
        V2.delete(d);
        d = S.memoizedState;
        do
          d = a(d, c2.action), c2 = c2.next;
        while (null !== c2);
        S.memoizedState = d;
        return [d, b2];
      }
      return [S.memoizedState, b2];
    }
    a = a === Fc ? "function" === typeof b2 ? b2() : b2 : void 0 !== c2 ? c2(b2) : b2;
    S.memoizedState = a;
    a = S.queue = { last: null, dispatch: null };
    a = a.dispatch = Hc.bind(null, R2, a);
    return [S.memoizedState, a];
  }
  function Ic(a, b2) {
    R2 = W2();
    S = Dc();
    b2 = void 0 === b2 ? null : b2;
    if (null !== S) {
      var c2 = S.memoizedState;
      if (null !== c2 && null !== b2) {
        var d = c2[1];
        a: if (null === d) d = false;
        else {
          for (var f2 = 0; f2 < d.length && f2 < b2.length; f2++) if (!xc(b2[f2], d[f2])) {
            d = false;
            break a;
          }
          d = true;
        }
        if (d) return c2[0];
      }
    }
    a = a();
    S.memoizedState = [a, b2];
    return a;
  }
  function Hc(a, b2, c2) {
    if (25 <= Bc) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
    if (a === R2) if (Ac = true, a = { action: c2, next: null }, null === V2 && (V2 = /* @__PURE__ */ new Map()), c2 = V2.get(b2), void 0 === c2) V2.set(b2, a);
    else {
      for (b2 = c2; null !== b2.next; ) b2 = b2.next;
      b2.next = a;
    }
  }
  function Jc() {
    throw Error("startTransition cannot be called during server rendering.");
  }
  function Kc() {
  }
  var Mc = { readContext: function(a) {
    return a._currentValue;
  }, useContext: function(a) {
    W2();
    return a._currentValue;
  }, useMemo: Ic, useReducer: Gc, useRef: function(a) {
    R2 = W2();
    S = Dc();
    var b2 = S.memoizedState;
    return null === b2 ? (a = { current: a }, S.memoizedState = a) : b2;
  }, useState: function(a) {
    return Gc(Fc, a);
  }, useInsertionEffect: Kc, useLayoutEffect: function() {
  }, useCallback: function(a, b2) {
    return Ic(function() {
      return a;
    }, b2);
  }, useImperativeHandle: Kc, useEffect: Kc, useDebugValue: Kc, useDeferredValue: function(a) {
    W2();
    return a;
  }, useTransition: function() {
    W2();
    return [false, Jc];
  }, useId: function() {
    var a = yc.treeContext;
    var b2 = a.overflow;
    a = a.id;
    a = (a & ~(1 << 32 - sc(a) - 1)).toString(32) + b2;
    var c2 = Lc;
    if (null === c2) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
    b2 = U2++;
    a = ":" + c2.idPrefix + "R" + a;
    0 < b2 && (a += "H" + b2.toString(32));
    return a + ":";
  }, useMutableSource: function(a, b2) {
    W2();
    return b2(a._source);
  }, useSyncExternalStore: function(a, b2, c2) {
    if (void 0 === c2) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
    return c2();
  } }, Lc = null, Nc = ba2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
  function Oc(a) {
    console.error(a);
    return null;
  }
  function X2() {
  }
  function Pc(a, b2) {
    var c2 = a.pingedTasks;
    c2.push(b2);
    1 === c2.length && setImmediate(function() {
      return Qc(a);
    });
  }
  function Rc(a, b2, c2, d, f2, e, g, h2) {
    a.allPendingTasks++;
    null === c2 ? a.pendingRootTasks++ : c2.pendingTasks++;
    var m2 = { node: b2, ping: function() {
      return Pc(a, m2);
    }, blockedBoundary: c2, blockedSegment: d, abortSet: f2, legacyContext: e, context: g, treeContext: h2 };
    f2.add(m2);
    return m2;
  }
  function Sc(a, b2, c2, d, f2, e) {
    return { status: 0, id: -1, index: b2, parentFlushed: false, chunks: [], children: [], formatContext: d, boundary: c2, lastPushedText: f2, textEmbedded: e };
  }
  function Y2(a, b2) {
    a = a.onError(b2);
    if (null != a && "string" !== typeof a) throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof a + '" instead');
    return a;
  }
  function Tc(a, b2) {
    var c2 = a.onShellError;
    c2(b2);
    c2 = a.onFatalError;
    c2(b2);
    null !== a.destination ? (a.status = 2, a.destination.destroy(b2)) : (a.status = 1, a.fatalError = b2);
  }
  function Uc(a, b2, c2, d, f2) {
    R2 = {};
    yc = b2;
    U2 = 0;
    for (a = c2(d, f2); Ac; ) Ac = false, U2 = 0, Bc += 1, S = null, a = c2(d, f2);
    Ec();
    return a;
  }
  function Vc(a, b2, c2, d) {
    var f2 = c2.render(), e = d.childContextTypes;
    if (null !== e && void 0 !== e) {
      var g = b2.legacyContext;
      if ("function" !== typeof c2.getChildContext) d = g;
      else {
        c2 = c2.getChildContext();
        for (var h2 in c2) if (!(h2 in e)) throw Error((gc(d) || "Unknown") + '.getChildContext(): key "' + h2 + '" is not defined in childContextTypes.');
        d = O2({}, g, c2);
      }
      b2.legacyContext = d;
      Z2(a, b2, f2);
      b2.legacyContext = g;
    } else Z2(a, b2, f2);
  }
  function Wc(a, b2) {
    if (a && a.defaultProps) {
      b2 = O2({}, b2);
      a = a.defaultProps;
      for (var c2 in a) void 0 === b2[c2] && (b2[c2] = a[c2]);
      return b2;
    }
    return b2;
  }
  function Xc(a, b2, c2, d, f2) {
    if ("function" === typeof c2) if (c2.prototype && c2.prototype.isReactComponent) {
      f2 = ic(c2, b2.legacyContext);
      var e = c2.contextType;
      e = new c2(d, "object" === typeof e && null !== e ? e._currentValue : f2);
      pc(e, c2, d, f2);
      Vc(a, b2, e, c2);
    } else {
      e = ic(c2, b2.legacyContext);
      f2 = Uc(a, b2, c2, d, e);
      var g = 0 !== U2;
      if ("object" === typeof f2 && null !== f2 && "function" === typeof f2.render && void 0 === f2.$$typeof) pc(f2, c2, d, e), Vc(a, b2, f2, c2);
      else if (g) {
        d = b2.treeContext;
        b2.treeContext = rc(d, 1, 0);
        try {
          Z2(a, b2, f2);
        } finally {
          b2.treeContext = d;
        }
      } else Z2(a, b2, f2);
    }
    else if ("string" === typeof c2) {
      f2 = b2.blockedSegment;
      e = Pa2(f2.chunks, c2, d, a.responseState, f2.formatContext);
      f2.lastPushedText = false;
      g = f2.formatContext;
      f2.formatContext = ya2(g, c2, d);
      Yc(a, b2, e);
      f2.formatContext = g;
      switch (c2) {
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "img":
        case "input":
        case "keygen":
        case "link":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
          break;
        default:
          f2.chunks.push(Qa, c2, Ra2);
      }
      f2.lastPushedText = false;
    } else {
      switch (c2) {
        case dc:
        case cc:
        case Tb:
        case Ub:
        case Sb:
          Z2(a, b2, d.children);
          return;
        case Zb:
          Z2(
            a,
            b2,
            d.children
          );
          return;
        case bc:
          throw Error("ReactDOMServer does not yet support scope components.");
        case Yb:
          a: {
            c2 = b2.blockedBoundary;
            f2 = b2.blockedSegment;
            e = d.fallback;
            d = d.children;
            g = /* @__PURE__ */ new Set();
            var h2 = { id: null, rootSegmentID: -1, parentFlushed: false, pendingTasks: 0, forceClientRender: false, completedSegments: [], byteSize: 0, fallbackAbortableTasks: g, errorDigest: null }, m2 = Sc(a, f2.chunks.length, h2, f2.formatContext, false, false);
            f2.children.push(m2);
            f2.lastPushedText = false;
            var n = Sc(a, 0, null, f2.formatContext, false, false);
            n.parentFlushed = true;
            b2.blockedBoundary = h2;
            b2.blockedSegment = n;
            try {
              if (Yc(a, b2, d), n.lastPushedText && n.textEmbedded && n.chunks.push(za), n.status = 1, Zc(h2, n), 0 === h2.pendingTasks) break a;
            } catch (p2) {
              n.status = 4, h2.forceClientRender = true, h2.errorDigest = Y2(a, p2);
            } finally {
              b2.blockedBoundary = c2, b2.blockedSegment = f2;
            }
            b2 = Rc(a, e, c2, m2, g, b2.legacyContext, b2.context, b2.treeContext);
            a.pingedTasks.push(b2);
          }
          return;
      }
      if ("object" === typeof c2 && null !== c2) switch (c2.$$typeof) {
        case Xb:
          d = Uc(a, b2, c2.render, d, f2);
          if (0 !== U2) {
            c2 = b2.treeContext;
            b2.treeContext = rc(c2, 1, 0);
            try {
              Z2(a, b2, d);
            } finally {
              b2.treeContext = c2;
            }
          } else Z2(
            a,
            b2,
            d
          );
          return;
        case $b:
          c2 = c2.type;
          d = Wc(c2, d);
          Xc(a, b2, c2, d, f2);
          return;
        case Vb:
          f2 = d.children;
          c2 = c2._context;
          d = d.value;
          e = c2._currentValue;
          c2._currentValue = d;
          g = P2;
          P2 = d = { parent: g, depth: null === g ? 0 : g.depth + 1, context: c2, parentValue: e, value: d };
          b2.context = d;
          Z2(a, b2, f2);
          a = P2;
          if (null === a) throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
          d = a.parentValue;
          a.context._currentValue = d === ec ? a.context._defaultValue : d;
          a = P2 = a.parent;
          b2.context = a;
          return;
        case Wb:
          d = d.children;
          d = d(c2._currentValue);
          Z2(a, b2, d);
          return;
        case ac:
          f2 = c2._init;
          c2 = f2(c2._payload);
          d = Wc(c2, d);
          Xc(a, b2, c2, d, void 0);
          return;
      }
      throw Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == c2 ? c2 : typeof c2) + "."));
    }
  }
  function Z2(a, b2, c2) {
    b2.node = c2;
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case Qb:
          Xc(a, b2, c2.type, c2.props, c2.ref);
          return;
        case Rb:
          throw Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
        case ac:
          var d = c2._init;
          c2 = d(c2._payload);
          Z2(a, b2, c2);
          return;
      }
      if (qa(c2)) {
        $c(a, b2, c2);
        return;
      }
      null === c2 || "object" !== typeof c2 ? d = null : (d = fc && c2[fc] || c2["@@iterator"], d = "function" === typeof d ? d : null);
      if (d && (d = d.call(c2))) {
        c2 = d.next();
        if (!c2.done) {
          var f2 = [];
          do
            f2.push(c2.value), c2 = d.next();
          while (!c2.done);
          $c(a, b2, f2);
        }
        return;
      }
      a = Object.prototype.toString.call(c2);
      throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === a ? "object with keys {" + Object.keys(c2).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    "string" === typeof c2 ? (d = b2.blockedSegment, d.lastPushedText = Aa2(b2.blockedSegment.chunks, c2, a.responseState, d.lastPushedText)) : "number" === typeof c2 && (d = b2.blockedSegment, d.lastPushedText = Aa2(
      b2.blockedSegment.chunks,
      "" + c2,
      a.responseState,
      d.lastPushedText
    ));
  }
  function $c(a, b2, c2) {
    for (var d = c2.length, f2 = 0; f2 < d; f2++) {
      var e = b2.treeContext;
      b2.treeContext = rc(e, d, f2);
      try {
        Yc(a, b2, c2[f2]);
      } finally {
        b2.treeContext = e;
      }
    }
  }
  function Yc(a, b2, c2) {
    var d = b2.blockedSegment.formatContext, f2 = b2.legacyContext, e = b2.context;
    try {
      return Z2(a, b2, c2);
    } catch (m2) {
      if (Ec(), "object" === typeof m2 && null !== m2 && "function" === typeof m2.then) {
        c2 = m2;
        var g = b2.blockedSegment, h2 = Sc(a, g.chunks.length, null, g.formatContext, g.lastPushedText, true);
        g.children.push(h2);
        g.lastPushedText = false;
        a = Rc(a, b2.node, b2.blockedBoundary, h2, b2.abortSet, b2.legacyContext, b2.context, b2.treeContext).ping;
        c2.then(a, a);
        b2.blockedSegment.formatContext = d;
        b2.legacyContext = f2;
        b2.context = e;
        nc(e);
      } else throw b2.blockedSegment.formatContext = d, b2.legacyContext = f2, b2.context = e, nc(e), m2;
    }
  }
  function ad(a) {
    var b2 = a.blockedBoundary;
    a = a.blockedSegment;
    a.status = 3;
    bd(this, b2, a);
  }
  function cd(a, b2, c2) {
    var d = a.blockedBoundary;
    a.blockedSegment.status = 3;
    null === d ? (b2.allPendingTasks--, 2 !== b2.status && (b2.status = 2, null !== b2.destination && b2.destination.end())) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = true, d.errorDigest = b2.onError(void 0 === c2 ? Error("The render was aborted by the server without a reason.") : c2), d.parentFlushed && b2.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a2) {
      return cd(a2, b2, c2);
    }), d.fallbackAbortableTasks.clear(), b2.allPendingTasks--, 0 === b2.allPendingTasks && (a = b2.onAllReady, a()));
  }
  function Zc(a, b2) {
    if (0 === b2.chunks.length && 1 === b2.children.length && null === b2.children[0].boundary) {
      var c2 = b2.children[0];
      c2.id = b2.id;
      c2.parentFlushed = true;
      1 === c2.status && Zc(a, c2);
    } else a.completedSegments.push(b2);
  }
  function bd(a, b2, c2) {
    if (null === b2) {
      if (c2.parentFlushed) {
        if (null !== a.completedRootSegment) throw Error("There can only be one root segment. This is a bug in React.");
        a.completedRootSegment = c2;
      }
      a.pendingRootTasks--;
      0 === a.pendingRootTasks && (a.onShellError = X2, b2 = a.onShellReady, b2());
    } else b2.pendingTasks--, b2.forceClientRender || (0 === b2.pendingTasks ? (c2.parentFlushed && 1 === c2.status && Zc(b2, c2), b2.parentFlushed && a.completedBoundaries.push(b2), b2.fallbackAbortableTasks.forEach(ad, a), b2.fallbackAbortableTasks.clear()) : c2.parentFlushed && 1 === c2.status && (Zc(b2, c2), 1 === b2.completedSegments.length && b2.parentFlushed && a.partialBoundaries.push(b2)));
    a.allPendingTasks--;
    0 === a.allPendingTasks && (a = a.onAllReady, a());
  }
  function Qc(a) {
    if (2 !== a.status) {
      var b2 = P2, c2 = Nc.current;
      Nc.current = Mc;
      var d = Lc;
      Lc = a.responseState;
      try {
        var f2 = a.pingedTasks, e;
        for (e = 0; e < f2.length; e++) {
          var g = f2[e];
          var h2 = a, m2 = g.blockedSegment;
          if (0 === m2.status) {
            nc(g.context);
            try {
              Z2(h2, g, g.node), m2.lastPushedText && m2.textEmbedded && m2.chunks.push(za), g.abortSet.delete(g), m2.status = 1, bd(h2, g.blockedBoundary, m2);
            } catch (E2) {
              if (Ec(), "object" === typeof E2 && null !== E2 && "function" === typeof E2.then) {
                var n = g.ping;
                E2.then(n, n);
              } else {
                g.abortSet.delete(g);
                m2.status = 4;
                var p2 = g.blockedBoundary, v2 = E2, C2 = Y2(h2, v2);
                null === p2 ? Tc(h2, v2) : (p2.pendingTasks--, p2.forceClientRender || (p2.forceClientRender = true, p2.errorDigest = C2, p2.parentFlushed && h2.clientRenderedBoundaries.push(p2)));
                h2.allPendingTasks--;
                if (0 === h2.allPendingTasks) {
                  var D2 = h2.onAllReady;
                  D2();
                }
              }
            } finally {
            }
          }
        }
        f2.splice(0, e);
        null !== a.destination && dd(a, a.destination);
      } catch (E2) {
        Y2(a, E2), Tc(a, E2);
      } finally {
        Lc = d, Nc.current = c2, c2 === Mc && nc(b2);
      }
    }
  }
  function ed(a, b2, c2) {
    c2.parentFlushed = true;
    switch (c2.status) {
      case 0:
        var d = c2.id = a.nextSegmentId++;
        c2.lastPushedText = false;
        c2.textEmbedded = false;
        a = a.responseState;
        r(b2, Sa2);
        r(b2, a.placeholderPrefix);
        a = d.toString(16);
        r(b2, a);
        return w3(b2, Ta2);
      case 1:
        c2.status = 2;
        var f2 = true;
        d = c2.chunks;
        var e = 0;
        c2 = c2.children;
        for (var g = 0; g < c2.length; g++) {
          for (f2 = c2[g]; e < f2.index; e++) r(b2, d[e]);
          f2 = fd(a, b2, f2);
        }
        for (; e < d.length - 1; e++) r(b2, d[e]);
        e < d.length && (f2 = w3(b2, d[e]));
        return f2;
      default:
        throw Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
    }
  }
  function fd(a, b2, c2) {
    var d = c2.boundary;
    if (null === d) return ed(a, b2, c2);
    d.parentFlushed = true;
    if (d.forceClientRender) d = d.errorDigest, w3(b2, Xa), r(b2, Za), d && (r(b2, ab), r(b2, F2(d)), r(b2, $a)), w3(b2, bb), ed(a, b2, c2);
    else if (0 < d.pendingTasks) {
      d.rootSegmentID = a.nextSegmentId++;
      0 < d.completedSegments.length && a.partialBoundaries.push(d);
      var f2 = a.responseState;
      var e = f2.nextSuspenseID++;
      f2 = x2(f2.boundaryPrefix + e.toString(16));
      d = d.id = f2;
      cb(b2, a.responseState, d);
      ed(a, b2, c2);
    } else if (d.byteSize > a.progressiveChunkSize) d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), cb(b2, a.responseState, d.id), ed(a, b2, c2);
    else {
      w3(b2, Ua);
      c2 = d.completedSegments;
      if (1 !== c2.length) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
      fd(a, b2, c2[0]);
    }
    return w3(b2, Ya);
  }
  function gd(a, b2, c2) {
    yb(b2, a.responseState, c2.formatContext, c2.id);
    fd(a, b2, c2);
    return zb(b2, c2.formatContext);
  }
  function hd(a, b2, c2) {
    for (var d = c2.completedSegments, f2 = 0; f2 < d.length; f2++) id(a, b2, c2, d[f2]);
    d.length = 0;
    a = a.responseState;
    d = c2.id;
    c2 = c2.rootSegmentID;
    r(b2, a.startInlineScript);
    a.sentCompleteBoundaryFunction ? r(b2, Gb) : (a.sentCompleteBoundaryFunction = true, r(b2, Fb));
    if (null === d) throw Error("An ID must have been assigned before we can complete the boundary.");
    c2 = c2.toString(16);
    r(b2, d);
    r(b2, Hb);
    r(b2, a.segmentPrefix);
    r(b2, c2);
    return w3(b2, Ib);
  }
  function id(a, b2, c2, d) {
    if (2 === d.status) return true;
    var f2 = d.id;
    if (-1 === f2) {
      if (-1 === (d.id = c2.rootSegmentID)) throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
      return gd(a, b2, d);
    }
    gd(a, b2, d);
    a = a.responseState;
    r(b2, a.startInlineScript);
    a.sentCompleteSegmentFunction ? r(b2, Bb) : (a.sentCompleteSegmentFunction = true, r(b2, Ab));
    r(b2, a.segmentPrefix);
    f2 = f2.toString(16);
    r(b2, f2);
    r(b2, Cb);
    r(b2, a.placeholderPrefix);
    r(b2, f2);
    return w3(b2, Db);
  }
  function dd(a, b2) {
    k2 = new Uint8Array(2048);
    l = 0;
    q2 = true;
    try {
      var c2 = a.completedRootSegment;
      if (null !== c2 && 0 === a.pendingRootTasks) {
        fd(a, b2, c2);
        a.completedRootSegment = null;
        var d = a.responseState.bootstrapChunks;
        for (c2 = 0; c2 < d.length - 1; c2++) r(b2, d[c2]);
        c2 < d.length && w3(b2, d[c2]);
      }
      var f2 = a.clientRenderedBoundaries, e;
      for (e = 0; e < f2.length; e++) {
        var g = f2[e];
        d = b2;
        var h2 = a.responseState, m2 = g.id, n = g.errorDigest, p2 = g.errorMessage, v2 = g.errorComponentStack;
        r(d, h2.startInlineScript);
        h2.sentClientRenderFunction ? r(d, Kb) : (h2.sentClientRenderFunction = true, r(d, Jb));
        if (null === m2) throw Error("An ID must have been assigned before we can complete the boundary.");
        r(d, m2);
        r(d, Lb);
        if (n || p2 || v2) r(d, Nb), r(d, Pb(n || ""));
        if (p2 || v2) r(d, Nb), r(d, Pb(p2 || ""));
        v2 && (r(d, Nb), r(d, Pb(v2)));
        if (!w3(d, Mb)) {
          a.destination = null;
          e++;
          f2.splice(0, e);
          return;
        }
      }
      f2.splice(0, e);
      var C2 = a.completedBoundaries;
      for (e = 0; e < C2.length; e++) if (!hd(a, b2, C2[e])) {
        a.destination = null;
        e++;
        C2.splice(0, e);
        return;
      }
      C2.splice(0, e);
      ca2(b2);
      k2 = new Uint8Array(2048);
      l = 0;
      q2 = true;
      var D2 = a.partialBoundaries;
      for (e = 0; e < D2.length; e++) {
        var E2 = D2[e];
        a: {
          f2 = a;
          g = b2;
          var na2 = E2.completedSegments;
          for (h2 = 0; h2 < na2.length; h2++) if (!id(f2, g, E2, na2[h2])) {
            h2++;
            na2.splice(0, h2);
            var Eb = false;
            break a;
          }
          na2.splice(0, h2);
          Eb = true;
        }
        if (!Eb) {
          a.destination = null;
          e++;
          D2.splice(0, e);
          return;
        }
      }
      D2.splice(0, e);
      var oa2 = a.completedBoundaries;
      for (e = 0; e < oa2.length; e++) if (!hd(a, b2, oa2[e])) {
        a.destination = null;
        e++;
        oa2.splice(0, e);
        return;
      }
      oa2.splice(0, e);
    } finally {
      ca2(b2), "function" === typeof b2.flush && b2.flush(), 0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b2.end();
    }
  }
  function jd(a) {
    setImmediate(function() {
      return Qc(a);
    });
  }
  function kd(a, b2) {
    if (1 === a.status) a.status = 2, b2.destroy(a.fatalError);
    else if (2 !== a.status && null === a.destination) {
      a.destination = b2;
      try {
        dd(a, b2);
      } catch (c2) {
        Y2(a, c2), Tc(a, c2);
      }
    }
  }
  function ld(a, b2) {
    try {
      var c2 = a.abortableTasks;
      c2.forEach(function(c3) {
        return cd(c3, a, b2);
      });
      c2.clear();
      null !== a.destination && dd(a, a.destination);
    } catch (d) {
      Y2(a, d), Tc(a, d);
    }
  }
  function md(a, b2) {
    return function() {
      return kd(b2, a);
    };
  }
  function nd(a, b2) {
    return function() {
      return ld(a, b2);
    };
  }
  function od(a, b2) {
    var c2 = b2 ? b2.identifierPrefix : void 0, d = b2 ? b2.nonce : void 0, f2 = b2 ? b2.bootstrapScriptContent : void 0, e = b2 ? b2.bootstrapScripts : void 0;
    var g = b2 ? b2.bootstrapModules : void 0;
    c2 = void 0 === c2 ? "" : c2;
    d = void 0 === d ? ra2 : x2('<script nonce="' + F2(d) + '">');
    var h2 = [];
    void 0 !== f2 && h2.push(d, ("" + f2).replace(wa, xa2), sa2);
    if (void 0 !== e) for (f2 = 0; f2 < e.length; f2++) h2.push(ta2, F2(e[f2]), va2);
    if (void 0 !== g) for (e = 0; e < g.length; e++) h2.push(ua2, F2(g[e]), va2);
    g = {
      bootstrapChunks: h2,
      startInlineScript: d,
      placeholderPrefix: x2(c2 + "P:"),
      segmentPrefix: x2(c2 + "S:"),
      boundaryPrefix: c2 + "B:",
      idPrefix: c2,
      nextSuspenseID: 0,
      sentCompleteSegmentFunction: false,
      sentCompleteBoundaryFunction: false,
      sentClientRenderFunction: false
    };
    e = b2 ? b2.namespaceURI : void 0;
    e = G2("http://www.w3.org/2000/svg" === e ? 2 : "http://www.w3.org/1998/Math/MathML" === e ? 3 : 0, null);
    f2 = b2 ? b2.progressiveChunkSize : void 0;
    d = b2 ? b2.onError : void 0;
    h2 = b2 ? b2.onAllReady : void 0;
    var m2 = b2 ? b2.onShellReady : void 0, n = b2 ? b2.onShellError : void 0;
    b2 = [];
    c2 = /* @__PURE__ */ new Set();
    g = {
      destination: null,
      responseState: g,
      progressiveChunkSize: void 0 === f2 ? 12800 : f2,
      status: 0,
      fatalError: null,
      nextSegmentId: 0,
      allPendingTasks: 0,
      pendingRootTasks: 0,
      completedRootSegment: null,
      abortableTasks: c2,
      pingedTasks: b2,
      clientRenderedBoundaries: [],
      completedBoundaries: [],
      partialBoundaries: [],
      onError: void 0 === d ? Oc : d,
      onAllReady: void 0 === h2 ? X2 : h2,
      onShellReady: void 0 === m2 ? X2 : m2,
      onShellError: void 0 === n ? X2 : n,
      onFatalError: X2
    };
    e = Sc(g, 0, null, e, false, false);
    e.parentFlushed = true;
    a = Rc(g, a, null, e, c2, hc, null, qc);
    b2.push(a);
    return g;
  }
  reactDomServer_node_production_min.renderToPipeableStream = function(a, b2) {
    var c2 = od(a, b2), d = false;
    jd(c2);
    return { pipe: function(a2) {
      if (d) throw Error("React currently only supports piping to one writable stream.");
      d = true;
      kd(c2, a2);
      a2.on("drain", md(a2, c2));
      a2.on("error", nd(c2, Error("The destination stream errored while writing data.")));
      a2.on("close", nd(c2, Error("The destination stream closed early.")));
      return a2;
    }, abort: function(a2) {
      ld(c2, a2);
    } };
  };
  reactDomServer_node_production_min.version = "18.3.1";
  return reactDomServer_node_production_min;
}
var reactDomServerLegacy_node_development = {};
var hasRequiredReactDomServerLegacy_node_development;
function requireReactDomServerLegacy_node_development() {
  if (hasRequiredReactDomServerLegacy_node_development) return reactDomServerLegacy_node_development;
  hasRequiredReactDomServerLegacy_node_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var React = requireReact();
      var stream = require$$1;
      var ReactVersion = "18.3.1";
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function warn(format) {
        {
          {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            printWarning("warn", format, args);
          }
        }
      }
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      function scheduleWork(callback) {
        callback();
      }
      function beginWriting(destination) {
      }
      function writeChunk(destination, chunk) {
        writeChunkAndReturn(destination, chunk);
      }
      function writeChunkAndReturn(destination, chunk) {
        return destination.push(chunk);
      }
      function completeWriting(destination) {
      }
      function close(destination) {
        destination.push(null);
      }
      function stringToChunk(content) {
        return content;
      }
      function stringToPrecomputedChunk(content) {
        return content;
      }
      function closeWithError(destination, error2) {
        destination.destroy(error2);
      }
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkAttributeStringCoercion(value, attributeName) {
        {
          if (willCoercionThrow(value)) {
            error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      function checkCSSPropertyStringCoercion(value, propName) {
        {
          if (willCoercionThrow(value)) {
            error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      function checkHtmlStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var RESERVED = 0;
      var STRING = 1;
      var BOOLEANISH_STRING = 2;
      var BOOLEAN = 3;
      var OVERLOADED_BOOLEAN = 4;
      var NUMERIC = 5;
      var POSITIVE_NUMERIC = 6;
      var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
      var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
      var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
      var illegalAttributeNameCache = {};
      var validatedAttributeNameCache = {};
      function isAttributeNameSafe(attributeName) {
        if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
          return true;
        }
        if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
          return false;
        }
        if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
          validatedAttributeNameCache[attributeName] = true;
          return true;
        }
        illegalAttributeNameCache[attributeName] = true;
        {
          error("Invalid attribute name: `%s`", attributeName);
        }
        return false;
      }
      function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
        if (propertyInfo !== null && propertyInfo.type === RESERVED) {
          return false;
        }
        switch (typeof value) {
          case "function":
          // $FlowIssue symbol is perfectly valid here
          case "symbol":
            return true;
          case "boolean": {
            if (propertyInfo !== null) {
              return !propertyInfo.acceptsBooleans;
            } else {
              var prefix3 = name.toLowerCase().slice(0, 5);
              return prefix3 !== "data-" && prefix3 !== "aria-";
            }
          }
          default:
            return false;
        }
      }
      function getPropertyInfo(name) {
        return properties.hasOwnProperty(name) ? properties[name] : null;
      }
      function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
        this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
        this.attributeName = attributeName;
        this.attributeNamespace = attributeNamespace;
        this.mustUseProperty = mustUseProperty;
        this.propertyName = name;
        this.type = type;
        this.sanitizeURL = sanitizeURL2;
        this.removeEmptyString = removeEmptyString;
      }
      var properties = {};
      var reservedProps = [
        "children",
        "dangerouslySetInnerHTML",
        // TODO: This prevents the assignment of defaultValue to regular
        // elements (not just inputs). Now that ReactDOMInput assigns to the
        // defaultValue property -- do we need this?
        "defaultValue",
        "defaultChecked",
        "innerHTML",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
        "style"
      ];
      reservedProps.forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          RESERVED,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
        var name = _ref[0], attributeName = _ref[1];
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          false,
          // mustUseProperty
          name.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "allowFullScreen",
        "async",
        // Note: there is a special case that prevents it from being written to the DOM
        // on the client side because the browsers are inconsistent. Instead we call focus().
        "autoFocus",
        "autoPlay",
        "controls",
        "default",
        "defer",
        "disabled",
        "disablePictureInPicture",
        "disableRemotePlayback",
        "formNoValidate",
        "hidden",
        "loop",
        "noModule",
        "noValidate",
        "open",
        "playsInline",
        "readOnly",
        "required",
        "reversed",
        "scoped",
        "seamless",
        // Microdata
        "itemScope"
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          false,
          // mustUseProperty
          name.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "checked",
        // Note: `option.selected` is not updated if `select.multiple` is
        // disabled with `removeAttribute`. We have special logic for handling this.
        "multiple",
        "muted",
        "selected"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          true,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "capture",
        "download"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          OVERLOADED_BOOLEAN,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "cols",
        "rows",
        "size",
        "span"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          POSITIVE_NUMERIC,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      ["rowSpan", "start"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          NUMERIC,
          false,
          // mustUseProperty
          name.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      var CAMELIZE = /[\-\:]([a-z])/g;
      var capitalize = function(token) {
        return token[1].toUpperCase();
      };
      [
        "accent-height",
        "alignment-baseline",
        "arabic-form",
        "baseline-shift",
        "cap-height",
        "clip-path",
        "clip-rule",
        "color-interpolation",
        "color-interpolation-filters",
        "color-profile",
        "color-rendering",
        "dominant-baseline",
        "enable-background",
        "fill-opacity",
        "fill-rule",
        "flood-color",
        "flood-opacity",
        "font-family",
        "font-size",
        "font-size-adjust",
        "font-stretch",
        "font-style",
        "font-variant",
        "font-weight",
        "glyph-name",
        "glyph-orientation-horizontal",
        "glyph-orientation-vertical",
        "horiz-adv-x",
        "horiz-origin-x",
        "image-rendering",
        "letter-spacing",
        "lighting-color",
        "marker-end",
        "marker-mid",
        "marker-start",
        "overline-position",
        "overline-thickness",
        "paint-order",
        "panose-1",
        "pointer-events",
        "rendering-intent",
        "shape-rendering",
        "stop-color",
        "stop-opacity",
        "strikethrough-position",
        "strikethrough-thickness",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "text-anchor",
        "text-decoration",
        "text-rendering",
        "underline-position",
        "underline-thickness",
        "unicode-bidi",
        "unicode-range",
        "units-per-em",
        "v-alphabetic",
        "v-hanging",
        "v-ideographic",
        "v-mathematical",
        "vector-effect",
        "vert-adv-y",
        "vert-origin-x",
        "vert-origin-y",
        "word-spacing",
        "writing-mode",
        "xmlns:xlink",
        "x-height"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "xlink:actuate",
        "xlink:arcrole",
        "xlink:role",
        "xlink:show",
        "xlink:title",
        "xlink:type"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          "http://www.w3.org/1999/xlink",
          false,
          // sanitizeURL
          false
        );
      });
      [
        "xml:base",
        "xml:lang",
        "xml:space"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          "http://www.w3.org/XML/1998/namespace",
          false,
          // sanitizeURL
          false
        );
      });
      ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(
          attributeName,
          STRING,
          false,
          // mustUseProperty
          attributeName.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      var xlinkHref = "xlinkHref";
      properties[xlinkHref] = new PropertyInfoRecord(
        "xlinkHref",
        STRING,
        false,
        // mustUseProperty
        "xlink:href",
        "http://www.w3.org/1999/xlink",
        true,
        // sanitizeURL
        false
      );
      ["src", "href", "action", "formAction"].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(
          attributeName,
          STRING,
          false,
          // mustUseProperty
          attributeName.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          true,
          // sanitizeURL
          true
        );
      });
      var isUnitlessNumber = {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridArea: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        // SVG-related properties
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };
      function prefixKey(prefix3, key) {
        return prefix3 + key.charAt(0).toUpperCase() + key.substring(1);
      }
      var prefixes = ["Webkit", "ms", "Moz", "O"];
      Object.keys(isUnitlessNumber).forEach(function(prop) {
        prefixes.forEach(function(prefix3) {
          isUnitlessNumber[prefixKey(prefix3, prop)] = isUnitlessNumber[prop];
        });
      });
      var hasReadOnlyValue = {
        button: true,
        checkbox: true,
        image: true,
        hidden: true,
        radio: true,
        reset: true,
        submit: true
      };
      function checkControlledValueProps(tagName, props) {
        {
          if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
            error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
          }
          if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
            error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
          }
        }
      }
      function isCustomComponent(tagName, props) {
        if (tagName.indexOf("-") === -1) {
          return typeof props.is === "string";
        }
        switch (tagName) {
          // These are reserved SVG and MathML elements.
          // We don't mind this list too much because we expect it to never grow.
          // The alternative is to track the namespace in a few places which is convoluted.
          // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return false;
          default:
            return true;
        }
      }
      var ariaProperties = {
        "aria-current": 0,
        // state
        "aria-description": 0,
        "aria-details": 0,
        "aria-disabled": 0,
        // state
        "aria-hidden": 0,
        // state
        "aria-invalid": 0,
        // state
        "aria-keyshortcuts": 0,
        "aria-label": 0,
        "aria-roledescription": 0,
        // Widget Attributes
        "aria-autocomplete": 0,
        "aria-checked": 0,
        "aria-expanded": 0,
        "aria-haspopup": 0,
        "aria-level": 0,
        "aria-modal": 0,
        "aria-multiline": 0,
        "aria-multiselectable": 0,
        "aria-orientation": 0,
        "aria-placeholder": 0,
        "aria-pressed": 0,
        "aria-readonly": 0,
        "aria-required": 0,
        "aria-selected": 0,
        "aria-sort": 0,
        "aria-valuemax": 0,
        "aria-valuemin": 0,
        "aria-valuenow": 0,
        "aria-valuetext": 0,
        // Live Region Attributes
        "aria-atomic": 0,
        "aria-busy": 0,
        "aria-live": 0,
        "aria-relevant": 0,
        // Drag-and-Drop Attributes
        "aria-dropeffect": 0,
        "aria-grabbed": 0,
        // Relationship Attributes
        "aria-activedescendant": 0,
        "aria-colcount": 0,
        "aria-colindex": 0,
        "aria-colspan": 0,
        "aria-controls": 0,
        "aria-describedby": 0,
        "aria-errormessage": 0,
        "aria-flowto": 0,
        "aria-labelledby": 0,
        "aria-owns": 0,
        "aria-posinset": 0,
        "aria-rowcount": 0,
        "aria-rowindex": 0,
        "aria-rowspan": 0,
        "aria-setsize": 0
      };
      var warnedProperties = {};
      var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
      var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
      function validateProperty(tagName, name) {
        {
          if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
            return true;
          }
          if (rARIACamel.test(name)) {
            var ariaName = "aria-" + name.slice(4).toLowerCase();
            var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
            if (correctName == null) {
              error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
              warnedProperties[name] = true;
              return true;
            }
            if (name !== correctName) {
              error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
              warnedProperties[name] = true;
              return true;
            }
          }
          if (rARIA.test(name)) {
            var lowerCasedName = name.toLowerCase();
            var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
            if (standardName == null) {
              warnedProperties[name] = true;
              return false;
            }
            if (name !== standardName) {
              error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
              warnedProperties[name] = true;
              return true;
            }
          }
        }
        return true;
      }
      function warnInvalidARIAProps(type, props) {
        {
          var invalidProps = [];
          for (var key in props) {
            var isValid = validateProperty(type, key);
            if (!isValid) {
              invalidProps.push(key);
            }
          }
          var unknownPropString = invalidProps.map(function(prop) {
            return "`" + prop + "`";
          }).join(", ");
          if (invalidProps.length === 1) {
            error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
          } else if (invalidProps.length > 1) {
            error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
          }
        }
      }
      function validateProperties(type, props) {
        if (isCustomComponent(type, props)) {
          return;
        }
        warnInvalidARIAProps(type, props);
      }
      var didWarnValueNull = false;
      function validateProperties$1(type, props) {
        {
          if (type !== "input" && type !== "textarea" && type !== "select") {
            return;
          }
          if (props != null && props.value === null && !didWarnValueNull) {
            didWarnValueNull = true;
            if (type === "select" && props.multiple) {
              error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
            } else {
              error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
            }
          }
        }
      }
      var possibleStandardNames = {
        // HTML
        accept: "accept",
        acceptcharset: "acceptCharset",
        "accept-charset": "acceptCharset",
        accesskey: "accessKey",
        action: "action",
        allowfullscreen: "allowFullScreen",
        alt: "alt",
        as: "as",
        async: "async",
        autocapitalize: "autoCapitalize",
        autocomplete: "autoComplete",
        autocorrect: "autoCorrect",
        autofocus: "autoFocus",
        autoplay: "autoPlay",
        autosave: "autoSave",
        capture: "capture",
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        challenge: "challenge",
        charset: "charSet",
        checked: "checked",
        children: "children",
        cite: "cite",
        class: "className",
        classid: "classID",
        classname: "className",
        cols: "cols",
        colspan: "colSpan",
        content: "content",
        contenteditable: "contentEditable",
        contextmenu: "contextMenu",
        controls: "controls",
        controlslist: "controlsList",
        coords: "coords",
        crossorigin: "crossOrigin",
        dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
        data: "data",
        datetime: "dateTime",
        default: "default",
        defaultchecked: "defaultChecked",
        defaultvalue: "defaultValue",
        defer: "defer",
        dir: "dir",
        disabled: "disabled",
        disablepictureinpicture: "disablePictureInPicture",
        disableremoteplayback: "disableRemotePlayback",
        download: "download",
        draggable: "draggable",
        enctype: "encType",
        enterkeyhint: "enterKeyHint",
        for: "htmlFor",
        form: "form",
        formmethod: "formMethod",
        formaction: "formAction",
        formenctype: "formEncType",
        formnovalidate: "formNoValidate",
        formtarget: "formTarget",
        frameborder: "frameBorder",
        headers: "headers",
        height: "height",
        hidden: "hidden",
        high: "high",
        href: "href",
        hreflang: "hrefLang",
        htmlfor: "htmlFor",
        httpequiv: "httpEquiv",
        "http-equiv": "httpEquiv",
        icon: "icon",
        id: "id",
        imagesizes: "imageSizes",
        imagesrcset: "imageSrcSet",
        innerhtml: "innerHTML",
        inputmode: "inputMode",
        integrity: "integrity",
        is: "is",
        itemid: "itemID",
        itemprop: "itemProp",
        itemref: "itemRef",
        itemscope: "itemScope",
        itemtype: "itemType",
        keyparams: "keyParams",
        keytype: "keyType",
        kind: "kind",
        label: "label",
        lang: "lang",
        list: "list",
        loop: "loop",
        low: "low",
        manifest: "manifest",
        marginwidth: "marginWidth",
        marginheight: "marginHeight",
        max: "max",
        maxlength: "maxLength",
        media: "media",
        mediagroup: "mediaGroup",
        method: "method",
        min: "min",
        minlength: "minLength",
        multiple: "multiple",
        muted: "muted",
        name: "name",
        nomodule: "noModule",
        nonce: "nonce",
        novalidate: "noValidate",
        open: "open",
        optimum: "optimum",
        pattern: "pattern",
        placeholder: "placeholder",
        playsinline: "playsInline",
        poster: "poster",
        preload: "preload",
        profile: "profile",
        radiogroup: "radioGroup",
        readonly: "readOnly",
        referrerpolicy: "referrerPolicy",
        rel: "rel",
        required: "required",
        reversed: "reversed",
        role: "role",
        rows: "rows",
        rowspan: "rowSpan",
        sandbox: "sandbox",
        scope: "scope",
        scoped: "scoped",
        scrolling: "scrolling",
        seamless: "seamless",
        selected: "selected",
        shape: "shape",
        size: "size",
        sizes: "sizes",
        span: "span",
        spellcheck: "spellCheck",
        src: "src",
        srcdoc: "srcDoc",
        srclang: "srcLang",
        srcset: "srcSet",
        start: "start",
        step: "step",
        style: "style",
        summary: "summary",
        tabindex: "tabIndex",
        target: "target",
        title: "title",
        type: "type",
        usemap: "useMap",
        value: "value",
        width: "width",
        wmode: "wmode",
        wrap: "wrap",
        // SVG
        about: "about",
        accentheight: "accentHeight",
        "accent-height": "accentHeight",
        accumulate: "accumulate",
        additive: "additive",
        alignmentbaseline: "alignmentBaseline",
        "alignment-baseline": "alignmentBaseline",
        allowreorder: "allowReorder",
        alphabetic: "alphabetic",
        amplitude: "amplitude",
        arabicform: "arabicForm",
        "arabic-form": "arabicForm",
        ascent: "ascent",
        attributename: "attributeName",
        attributetype: "attributeType",
        autoreverse: "autoReverse",
        azimuth: "azimuth",
        basefrequency: "baseFrequency",
        baselineshift: "baselineShift",
        "baseline-shift": "baselineShift",
        baseprofile: "baseProfile",
        bbox: "bbox",
        begin: "begin",
        bias: "bias",
        by: "by",
        calcmode: "calcMode",
        capheight: "capHeight",
        "cap-height": "capHeight",
        clip: "clip",
        clippath: "clipPath",
        "clip-path": "clipPath",
        clippathunits: "clipPathUnits",
        cliprule: "clipRule",
        "clip-rule": "clipRule",
        color: "color",
        colorinterpolation: "colorInterpolation",
        "color-interpolation": "colorInterpolation",
        colorinterpolationfilters: "colorInterpolationFilters",
        "color-interpolation-filters": "colorInterpolationFilters",
        colorprofile: "colorProfile",
        "color-profile": "colorProfile",
        colorrendering: "colorRendering",
        "color-rendering": "colorRendering",
        contentscripttype: "contentScriptType",
        contentstyletype: "contentStyleType",
        cursor: "cursor",
        cx: "cx",
        cy: "cy",
        d: "d",
        datatype: "datatype",
        decelerate: "decelerate",
        descent: "descent",
        diffuseconstant: "diffuseConstant",
        direction: "direction",
        display: "display",
        divisor: "divisor",
        dominantbaseline: "dominantBaseline",
        "dominant-baseline": "dominantBaseline",
        dur: "dur",
        dx: "dx",
        dy: "dy",
        edgemode: "edgeMode",
        elevation: "elevation",
        enablebackground: "enableBackground",
        "enable-background": "enableBackground",
        end: "end",
        exponent: "exponent",
        externalresourcesrequired: "externalResourcesRequired",
        fill: "fill",
        fillopacity: "fillOpacity",
        "fill-opacity": "fillOpacity",
        fillrule: "fillRule",
        "fill-rule": "fillRule",
        filter: "filter",
        filterres: "filterRes",
        filterunits: "filterUnits",
        floodopacity: "floodOpacity",
        "flood-opacity": "floodOpacity",
        floodcolor: "floodColor",
        "flood-color": "floodColor",
        focusable: "focusable",
        fontfamily: "fontFamily",
        "font-family": "fontFamily",
        fontsize: "fontSize",
        "font-size": "fontSize",
        fontsizeadjust: "fontSizeAdjust",
        "font-size-adjust": "fontSizeAdjust",
        fontstretch: "fontStretch",
        "font-stretch": "fontStretch",
        fontstyle: "fontStyle",
        "font-style": "fontStyle",
        fontvariant: "fontVariant",
        "font-variant": "fontVariant",
        fontweight: "fontWeight",
        "font-weight": "fontWeight",
        format: "format",
        from: "from",
        fx: "fx",
        fy: "fy",
        g1: "g1",
        g2: "g2",
        glyphname: "glyphName",
        "glyph-name": "glyphName",
        glyphorientationhorizontal: "glyphOrientationHorizontal",
        "glyph-orientation-horizontal": "glyphOrientationHorizontal",
        glyphorientationvertical: "glyphOrientationVertical",
        "glyph-orientation-vertical": "glyphOrientationVertical",
        glyphref: "glyphRef",
        gradienttransform: "gradientTransform",
        gradientunits: "gradientUnits",
        hanging: "hanging",
        horizadvx: "horizAdvX",
        "horiz-adv-x": "horizAdvX",
        horizoriginx: "horizOriginX",
        "horiz-origin-x": "horizOriginX",
        ideographic: "ideographic",
        imagerendering: "imageRendering",
        "image-rendering": "imageRendering",
        in2: "in2",
        in: "in",
        inlist: "inlist",
        intercept: "intercept",
        k1: "k1",
        k2: "k2",
        k3: "k3",
        k4: "k4",
        k: "k",
        kernelmatrix: "kernelMatrix",
        kernelunitlength: "kernelUnitLength",
        kerning: "kerning",
        keypoints: "keyPoints",
        keysplines: "keySplines",
        keytimes: "keyTimes",
        lengthadjust: "lengthAdjust",
        letterspacing: "letterSpacing",
        "letter-spacing": "letterSpacing",
        lightingcolor: "lightingColor",
        "lighting-color": "lightingColor",
        limitingconeangle: "limitingConeAngle",
        local: "local",
        markerend: "markerEnd",
        "marker-end": "markerEnd",
        markerheight: "markerHeight",
        markermid: "markerMid",
        "marker-mid": "markerMid",
        markerstart: "markerStart",
        "marker-start": "markerStart",
        markerunits: "markerUnits",
        markerwidth: "markerWidth",
        mask: "mask",
        maskcontentunits: "maskContentUnits",
        maskunits: "maskUnits",
        mathematical: "mathematical",
        mode: "mode",
        numoctaves: "numOctaves",
        offset: "offset",
        opacity: "opacity",
        operator: "operator",
        order: "order",
        orient: "orient",
        orientation: "orientation",
        origin: "origin",
        overflow: "overflow",
        overlineposition: "overlinePosition",
        "overline-position": "overlinePosition",
        overlinethickness: "overlineThickness",
        "overline-thickness": "overlineThickness",
        paintorder: "paintOrder",
        "paint-order": "paintOrder",
        panose1: "panose1",
        "panose-1": "panose1",
        pathlength: "pathLength",
        patterncontentunits: "patternContentUnits",
        patterntransform: "patternTransform",
        patternunits: "patternUnits",
        pointerevents: "pointerEvents",
        "pointer-events": "pointerEvents",
        points: "points",
        pointsatx: "pointsAtX",
        pointsaty: "pointsAtY",
        pointsatz: "pointsAtZ",
        prefix: "prefix",
        preservealpha: "preserveAlpha",
        preserveaspectratio: "preserveAspectRatio",
        primitiveunits: "primitiveUnits",
        property: "property",
        r: "r",
        radius: "radius",
        refx: "refX",
        refy: "refY",
        renderingintent: "renderingIntent",
        "rendering-intent": "renderingIntent",
        repeatcount: "repeatCount",
        repeatdur: "repeatDur",
        requiredextensions: "requiredExtensions",
        requiredfeatures: "requiredFeatures",
        resource: "resource",
        restart: "restart",
        result: "result",
        results: "results",
        rotate: "rotate",
        rx: "rx",
        ry: "ry",
        scale: "scale",
        security: "security",
        seed: "seed",
        shaperendering: "shapeRendering",
        "shape-rendering": "shapeRendering",
        slope: "slope",
        spacing: "spacing",
        specularconstant: "specularConstant",
        specularexponent: "specularExponent",
        speed: "speed",
        spreadmethod: "spreadMethod",
        startoffset: "startOffset",
        stddeviation: "stdDeviation",
        stemh: "stemh",
        stemv: "stemv",
        stitchtiles: "stitchTiles",
        stopcolor: "stopColor",
        "stop-color": "stopColor",
        stopopacity: "stopOpacity",
        "stop-opacity": "stopOpacity",
        strikethroughposition: "strikethroughPosition",
        "strikethrough-position": "strikethroughPosition",
        strikethroughthickness: "strikethroughThickness",
        "strikethrough-thickness": "strikethroughThickness",
        string: "string",
        stroke: "stroke",
        strokedasharray: "strokeDasharray",
        "stroke-dasharray": "strokeDasharray",
        strokedashoffset: "strokeDashoffset",
        "stroke-dashoffset": "strokeDashoffset",
        strokelinecap: "strokeLinecap",
        "stroke-linecap": "strokeLinecap",
        strokelinejoin: "strokeLinejoin",
        "stroke-linejoin": "strokeLinejoin",
        strokemiterlimit: "strokeMiterlimit",
        "stroke-miterlimit": "strokeMiterlimit",
        strokewidth: "strokeWidth",
        "stroke-width": "strokeWidth",
        strokeopacity: "strokeOpacity",
        "stroke-opacity": "strokeOpacity",
        suppresscontenteditablewarning: "suppressContentEditableWarning",
        suppresshydrationwarning: "suppressHydrationWarning",
        surfacescale: "surfaceScale",
        systemlanguage: "systemLanguage",
        tablevalues: "tableValues",
        targetx: "targetX",
        targety: "targetY",
        textanchor: "textAnchor",
        "text-anchor": "textAnchor",
        textdecoration: "textDecoration",
        "text-decoration": "textDecoration",
        textlength: "textLength",
        textrendering: "textRendering",
        "text-rendering": "textRendering",
        to: "to",
        transform: "transform",
        typeof: "typeof",
        u1: "u1",
        u2: "u2",
        underlineposition: "underlinePosition",
        "underline-position": "underlinePosition",
        underlinethickness: "underlineThickness",
        "underline-thickness": "underlineThickness",
        unicode: "unicode",
        unicodebidi: "unicodeBidi",
        "unicode-bidi": "unicodeBidi",
        unicoderange: "unicodeRange",
        "unicode-range": "unicodeRange",
        unitsperem: "unitsPerEm",
        "units-per-em": "unitsPerEm",
        unselectable: "unselectable",
        valphabetic: "vAlphabetic",
        "v-alphabetic": "vAlphabetic",
        values: "values",
        vectoreffect: "vectorEffect",
        "vector-effect": "vectorEffect",
        version: "version",
        vertadvy: "vertAdvY",
        "vert-adv-y": "vertAdvY",
        vertoriginx: "vertOriginX",
        "vert-origin-x": "vertOriginX",
        vertoriginy: "vertOriginY",
        "vert-origin-y": "vertOriginY",
        vhanging: "vHanging",
        "v-hanging": "vHanging",
        videographic: "vIdeographic",
        "v-ideographic": "vIdeographic",
        viewbox: "viewBox",
        viewtarget: "viewTarget",
        visibility: "visibility",
        vmathematical: "vMathematical",
        "v-mathematical": "vMathematical",
        vocab: "vocab",
        widths: "widths",
        wordspacing: "wordSpacing",
        "word-spacing": "wordSpacing",
        writingmode: "writingMode",
        "writing-mode": "writingMode",
        x1: "x1",
        x2: "x2",
        x: "x",
        xchannelselector: "xChannelSelector",
        xheight: "xHeight",
        "x-height": "xHeight",
        xlinkactuate: "xlinkActuate",
        "xlink:actuate": "xlinkActuate",
        xlinkarcrole: "xlinkArcrole",
        "xlink:arcrole": "xlinkArcrole",
        xlinkhref: "xlinkHref",
        "xlink:href": "xlinkHref",
        xlinkrole: "xlinkRole",
        "xlink:role": "xlinkRole",
        xlinkshow: "xlinkShow",
        "xlink:show": "xlinkShow",
        xlinktitle: "xlinkTitle",
        "xlink:title": "xlinkTitle",
        xlinktype: "xlinkType",
        "xlink:type": "xlinkType",
        xmlbase: "xmlBase",
        "xml:base": "xmlBase",
        xmllang: "xmlLang",
        "xml:lang": "xmlLang",
        xmlns: "xmlns",
        "xml:space": "xmlSpace",
        xmlnsxlink: "xmlnsXlink",
        "xmlns:xlink": "xmlnsXlink",
        xmlspace: "xmlSpace",
        y1: "y1",
        y2: "y2",
        y: "y",
        ychannelselector: "yChannelSelector",
        z: "z",
        zoomandpan: "zoomAndPan"
      };
      var validateProperty$1 = function() {
      };
      {
        var warnedProperties$1 = {};
        var EVENT_NAME_REGEX = /^on./;
        var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
        var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
        var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
        validateProperty$1 = function(tagName, name, value, eventRegistry) {
          if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
            return true;
          }
          var lowerCasedName = name.toLowerCase();
          if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
            error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
            warnedProperties$1[name] = true;
            return true;
          }
          if (eventRegistry != null) {
            var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
            if (registrationNameDependencies.hasOwnProperty(name)) {
              return true;
            }
            var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
            if (registrationName != null) {
              error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
              warnedProperties$1[name] = true;
              return true;
            }
            if (EVENT_NAME_REGEX.test(name)) {
              error("Unknown event handler property `%s`. It will be ignored.", name);
              warnedProperties$1[name] = true;
              return true;
            }
          } else if (EVENT_NAME_REGEX.test(name)) {
            if (INVALID_EVENT_NAME_REGEX.test(name)) {
              error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
            }
            warnedProperties$1[name] = true;
            return true;
          }
          if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
            return true;
          }
          if (lowerCasedName === "innerhtml") {
            error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName === "aria") {
            error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
            error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
            warnedProperties$1[name] = true;
            return true;
          }
          if (typeof value === "number" && isNaN(value)) {
            error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
            warnedProperties$1[name] = true;
            return true;
          }
          var propertyInfo = getPropertyInfo(name);
          var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
          if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
            var standardName = possibleStandardNames[lowerCasedName];
            if (standardName !== name) {
              error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
              warnedProperties$1[name] = true;
              return true;
            }
          } else if (!isReserved && name !== lowerCasedName) {
            error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
            warnedProperties$1[name] = true;
            return true;
          }
          if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo)) {
            if (value) {
              error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
            } else {
              error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
            }
            warnedProperties$1[name] = true;
            return true;
          }
          if (isReserved) {
            return true;
          }
          if (shouldRemoveAttributeWithWarning(name, value, propertyInfo)) {
            warnedProperties$1[name] = true;
            return false;
          }
          if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
            error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
            warnedProperties$1[name] = true;
            return true;
          }
          return true;
        };
      }
      var warnUnknownProperties = function(type, props, eventRegistry) {
        {
          var unknownProps = [];
          for (var key in props) {
            var isValid = validateProperty$1(type, key, props[key], eventRegistry);
            if (!isValid) {
              unknownProps.push(key);
            }
          }
          var unknownPropString = unknownProps.map(function(prop) {
            return "`" + prop + "`";
          }).join(", ");
          if (unknownProps.length === 1) {
            error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
          } else if (unknownProps.length > 1) {
            error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
          }
        }
      };
      function validateProperties$2(type, props, eventRegistry) {
        if (isCustomComponent(type, props)) {
          return;
        }
        warnUnknownProperties(type, props, eventRegistry);
      }
      var warnValidStyle = function() {
      };
      {
        var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
        var msPattern = /^-ms-/;
        var hyphenPattern = /-(.)/g;
        var badStyleValueWithSemicolonPattern = /;\s*$/;
        var warnedStyleNames = {};
        var warnedStyleValues = {};
        var warnedForNaNValue = false;
        var warnedForInfinityValue = false;
        var camelize = function(string) {
          return string.replace(hyphenPattern, function(_2, character) {
            return character.toUpperCase();
          });
        };
        var warnHyphenatedStyleName = function(name) {
          if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
            return;
          }
          warnedStyleNames[name] = true;
          error(
            "Unsupported style property %s. Did you mean %s?",
            name,
            // As Andi Smith suggests
            // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
            // is converted to lowercase `ms`.
            camelize(name.replace(msPattern, "ms-"))
          );
        };
        var warnBadVendoredStyleName = function(name) {
          if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
            return;
          }
          warnedStyleNames[name] = true;
          error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
        };
        var warnStyleValueWithSemicolon = function(name, value) {
          if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
            return;
          }
          warnedStyleValues[value] = true;
          error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
        };
        var warnStyleValueIsNaN = function(name, value) {
          if (warnedForNaNValue) {
            return;
          }
          warnedForNaNValue = true;
          error("`NaN` is an invalid value for the `%s` css style property.", name);
        };
        var warnStyleValueIsInfinity = function(name, value) {
          if (warnedForInfinityValue) {
            return;
          }
          warnedForInfinityValue = true;
          error("`Infinity` is an invalid value for the `%s` css style property.", name);
        };
        warnValidStyle = function(name, value) {
          if (name.indexOf("-") > -1) {
            warnHyphenatedStyleName(name);
          } else if (badVendoredStyleNamePattern.test(name)) {
            warnBadVendoredStyleName(name);
          } else if (badStyleValueWithSemicolonPattern.test(value)) {
            warnStyleValueWithSemicolon(name, value);
          }
          if (typeof value === "number") {
            if (isNaN(value)) {
              warnStyleValueIsNaN(name, value);
            } else if (!isFinite(value)) {
              warnStyleValueIsInfinity(name, value);
            }
          }
        };
      }
      var warnValidStyle$1 = warnValidStyle;
      var matchHtmlRegExp = /["'&<>]/;
      function escapeHtml(string) {
        {
          checkHtmlStringCoercion(string);
        }
        var str = "" + string;
        var match = matchHtmlRegExp.exec(str);
        if (!match) {
          return str;
        }
        var escape;
        var html = "";
        var index;
        var lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escape = "&quot;";
              break;
            case 38:
              escape = "&amp;";
              break;
            case 39:
              escape = "&#x27;";
              break;
            case 60:
              escape = "&lt;";
              break;
            case 62:
              escape = "&gt;";
              break;
            default:
              continue;
          }
          if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
          }
          lastIndex = index + 1;
          html += escape;
        }
        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      }
      function escapeTextForBrowser(text) {
        if (typeof text === "boolean" || typeof text === "number") {
          return "" + text;
        }
        return escapeHtml(text);
      }
      var uppercasePattern = /([A-Z])/g;
      var msPattern$1 = /^ms-/;
      function hyphenateStyleName(name) {
        return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
      }
      var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
      var didWarn = false;
      function sanitizeURL(url) {
        {
          if (!didWarn && isJavaScriptProtocol.test(url)) {
            didWarn = true;
            error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
          }
        }
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      var startInlineScript = stringToPrecomputedChunk("<script>");
      function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
        var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
        var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
        var bootstrapChunks = [];
        return {
          bootstrapChunks,
          startInlineScript: inlineScriptWithNonce,
          placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
          segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
          boundaryPrefix: idPrefix + "B:",
          idPrefix,
          nextSuspenseID: 0,
          sentCompleteSegmentFunction: false,
          sentCompleteBoundaryFunction: false,
          sentClientRenderFunction: false
        };
      }
      var ROOT_HTML_MODE = 0;
      var HTML_MODE = 1;
      var SVG_MODE = 2;
      var MATHML_MODE = 3;
      var HTML_TABLE_MODE = 4;
      var HTML_TABLE_BODY_MODE = 5;
      var HTML_TABLE_ROW_MODE = 6;
      var HTML_COLGROUP_MODE = 7;
      function createFormatContext(insertionMode, selectedValue) {
        return {
          insertionMode,
          selectedValue
        };
      }
      function getChildFormatContext(parentContext, type, props) {
        switch (type) {
          case "select":
            return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
          case "svg":
            return createFormatContext(SVG_MODE, null);
          case "math":
            return createFormatContext(MATHML_MODE, null);
          case "foreignObject":
            return createFormatContext(HTML_MODE, null);
          // Table parents are special in that their children can only be created at all if they're
          // wrapped in a table parent. So we need to encode that we're entering this mode.
          case "table":
            return createFormatContext(HTML_TABLE_MODE, null);
          case "thead":
          case "tbody":
          case "tfoot":
            return createFormatContext(HTML_TABLE_BODY_MODE, null);
          case "colgroup":
            return createFormatContext(HTML_COLGROUP_MODE, null);
          case "tr":
            return createFormatContext(HTML_TABLE_ROW_MODE, null);
        }
        if (parentContext.insertionMode >= HTML_TABLE_MODE) {
          return createFormatContext(HTML_MODE, null);
        }
        if (parentContext.insertionMode === ROOT_HTML_MODE) {
          return createFormatContext(HTML_MODE, null);
        }
        return parentContext;
      }
      var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
      function assignSuspenseBoundaryID(responseState) {
        var generatedID = responseState.nextSuspenseID++;
        return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
      }
      function makeId(responseState, treeId, localId) {
        var idPrefix = responseState.idPrefix;
        var id = ":" + idPrefix + "R" + treeId;
        if (localId > 0) {
          id += "H" + localId.toString(32);
        }
        return id + ":";
      }
      function encodeHTMLTextNode(text) {
        return escapeTextForBrowser(text);
      }
      var textSeparator = stringToPrecomputedChunk("<!-- -->");
      function pushTextInstance(target, text, responseState, textEmbedded) {
        if (text === "") {
          return textEmbedded;
        }
        if (textEmbedded) {
          target.push(textSeparator);
        }
        target.push(stringToChunk(encodeHTMLTextNode(text)));
        return true;
      }
      function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
        if (lastPushedText && textEmbedded) {
          target.push(textSeparator);
        }
      }
      var styleNameCache = /* @__PURE__ */ new Map();
      function processStyleName(styleName) {
        var chunk = styleNameCache.get(styleName);
        if (chunk !== void 0) {
          return chunk;
        }
        var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
        styleNameCache.set(styleName, result);
        return result;
      }
      var styleAttributeStart = stringToPrecomputedChunk(' style="');
      var styleAssign = stringToPrecomputedChunk(":");
      var styleSeparator = stringToPrecomputedChunk(";");
      function pushStyle(target, responseState, style) {
        if (typeof style !== "object") {
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
        }
        var isFirst = true;
        for (var styleName in style) {
          if (!hasOwnProperty.call(style, styleName)) {
            continue;
          }
          var styleValue = style[styleName];
          if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
            continue;
          }
          var nameChunk = void 0;
          var valueChunk = void 0;
          var isCustomProperty = styleName.indexOf("--") === 0;
          if (isCustomProperty) {
            nameChunk = stringToChunk(escapeTextForBrowser(styleName));
            {
              checkCSSPropertyStringCoercion(styleValue, styleName);
            }
            valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
          } else {
            {
              warnValidStyle$1(styleName, styleValue);
            }
            nameChunk = processStyleName(styleName);
            if (typeof styleValue === "number") {
              if (styleValue !== 0 && !hasOwnProperty.call(isUnitlessNumber, styleName)) {
                valueChunk = stringToChunk(styleValue + "px");
              } else {
                valueChunk = stringToChunk("" + styleValue);
              }
            } else {
              {
                checkCSSPropertyStringCoercion(styleValue, styleName);
              }
              valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
            }
          }
          if (isFirst) {
            isFirst = false;
            target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
          } else {
            target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
          }
        }
        if (!isFirst) {
          target.push(attributeEnd);
        }
      }
      var attributeSeparator = stringToPrecomputedChunk(" ");
      var attributeAssign = stringToPrecomputedChunk('="');
      var attributeEnd = stringToPrecomputedChunk('"');
      var attributeEmptyString = stringToPrecomputedChunk('=""');
      function pushAttribute(target, responseState, name, value) {
        switch (name) {
          case "style": {
            pushStyle(target, responseState, value);
            return;
          }
          case "defaultValue":
          case "defaultChecked":
          // These shouldn't be set as attributes on generic HTML elements.
          case "innerHTML":
          // Must use dangerouslySetInnerHTML instead.
          case "suppressContentEditableWarning":
          case "suppressHydrationWarning":
            return;
        }
        if (
          // shouldIgnoreAttribute
          // We have already filtered out null/undefined and reserved words.
          name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")
        ) {
          return;
        }
        var propertyInfo = getPropertyInfo(name);
        if (propertyInfo !== null) {
          switch (typeof value) {
            case "function":
            // $FlowIssue symbol is perfectly valid here
            case "symbol":
              return;
            case "boolean": {
              if (!propertyInfo.acceptsBooleans) {
                return;
              }
            }
          }
          var attributeName = propertyInfo.attributeName;
          var attributeNameChunk = stringToChunk(attributeName);
          switch (propertyInfo.type) {
            case BOOLEAN:
              if (value) {
                target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
              }
              return;
            case OVERLOADED_BOOLEAN:
              if (value === true) {
                target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
              } else if (value === false) ;
              else {
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
              return;
            case NUMERIC:
              if (!isNaN(value)) {
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
              break;
            case POSITIVE_NUMERIC:
              if (!isNaN(value) && value >= 1) {
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
              break;
            default:
              if (propertyInfo.sanitizeURL) {
                {
                  checkAttributeStringCoercion(value, attributeName);
                }
                value = "" + value;
                sanitizeURL(value);
              }
              target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
          }
        } else if (isAttributeNameSafe(name)) {
          switch (typeof value) {
            case "function":
            // $FlowIssue symbol is perfectly valid here
            case "symbol":
              return;
            case "boolean": {
              var prefix3 = name.toLowerCase().slice(0, 5);
              if (prefix3 !== "data-" && prefix3 !== "aria-") {
                return;
              }
            }
          }
          target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
        }
      }
      var endOfStartTag = stringToPrecomputedChunk(">");
      var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
      function pushInnerHTML(target, innerHTML, children) {
        if (innerHTML != null) {
          if (children != null) {
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          }
          if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
          }
          var html = innerHTML.__html;
          if (html !== null && html !== void 0) {
            {
              checkHtmlStringCoercion(html);
            }
            target.push(stringToChunk("" + html));
          }
        }
      }
      var didWarnDefaultInputValue = false;
      var didWarnDefaultChecked = false;
      var didWarnDefaultSelectValue = false;
      var didWarnDefaultTextareaValue = false;
      var didWarnInvalidOptionChildren = false;
      var didWarnInvalidOptionInnerHTML = false;
      var didWarnSelectedSetOnOption = false;
      function checkSelectProp(props, propName) {
        {
          var value = props[propName];
          if (value != null) {
            var array = isArray(value);
            if (props.multiple && !array) {
              error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
            } else if (!props.multiple && array) {
              error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
            }
          }
        }
      }
      function pushStartSelect(target, props, responseState) {
        {
          checkControlledValueProps("select", props);
          checkSelectProp(props, "value");
          checkSelectProp(props, "defaultValue");
          if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
            error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
            didWarnDefaultSelectValue = true;
          }
        }
        target.push(startChunkForTag("select"));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              case "defaultValue":
              case "value":
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        return children;
      }
      function flattenOptionChildren(children) {
        var content = "";
        React.Children.forEach(children, function(child) {
          if (child == null) {
            return;
          }
          content += child;
          {
            if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
              didWarnInvalidOptionChildren = true;
              error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
            }
          }
        });
        return content;
      }
      var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
      function pushStartOption(target, props, responseState, formatContext) {
        var selectedValue = formatContext.selectedValue;
        target.push(startChunkForTag("option"));
        var children = null;
        var value = null;
        var selected = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "selected":
                selected = propValue;
                {
                  if (!didWarnSelectedSetOnOption) {
                    error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                    didWarnSelectedSetOnOption = true;
                  }
                }
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              // eslint-disable-next-line-no-fallthrough
              case "value":
                value = propValue;
              // We intentionally fallthrough to also set the attribute on the node.
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        if (selectedValue != null) {
          var stringValue;
          if (value !== null) {
            {
              checkAttributeStringCoercion(value, "value");
            }
            stringValue = "" + value;
          } else {
            {
              if (innerHTML !== null) {
                if (!didWarnInvalidOptionInnerHTML) {
                  didWarnInvalidOptionInnerHTML = true;
                  error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                }
              }
            }
            stringValue = flattenOptionChildren(children);
          }
          if (isArray(selectedValue)) {
            for (var i = 0; i < selectedValue.length; i++) {
              {
                checkAttributeStringCoercion(selectedValue[i], "value");
              }
              var v2 = "" + selectedValue[i];
              if (v2 === stringValue) {
                target.push(selectedMarkerAttribute);
                break;
              }
            }
          } else {
            {
              checkAttributeStringCoercion(selectedValue, "select.value");
            }
            if ("" + selectedValue === stringValue) {
              target.push(selectedMarkerAttribute);
            }
          }
        } else if (selected) {
          target.push(selectedMarkerAttribute);
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        return children;
      }
      function pushInput(target, props, responseState) {
        {
          checkControlledValueProps("input", props);
          if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
            error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
            didWarnDefaultChecked = true;
          }
          if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
            error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
            didWarnDefaultInputValue = true;
          }
        }
        target.push(startChunkForTag("input"));
        var value = null;
        var defaultValue = null;
        var checked = null;
        var defaultChecked = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
              // eslint-disable-next-line-no-fallthrough
              case "defaultChecked":
                defaultChecked = propValue;
                break;
              case "defaultValue":
                defaultValue = propValue;
                break;
              case "checked":
                checked = propValue;
                break;
              case "value":
                value = propValue;
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        if (checked !== null) {
          pushAttribute(target, responseState, "checked", checked);
        } else if (defaultChecked !== null) {
          pushAttribute(target, responseState, "checked", defaultChecked);
        }
        if (value !== null) {
          pushAttribute(target, responseState, "value", value);
        } else if (defaultValue !== null) {
          pushAttribute(target, responseState, "value", defaultValue);
        }
        target.push(endOfStartTagSelfClosing);
        return null;
      }
      function pushStartTextArea(target, props, responseState) {
        {
          checkControlledValueProps("textarea", props);
          if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
            error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
            didWarnDefaultTextareaValue = true;
          }
        }
        target.push(startChunkForTag("textarea"));
        var value = null;
        var defaultValue = null;
        var children = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "value":
                value = propValue;
                break;
              case "defaultValue":
                defaultValue = propValue;
                break;
              case "dangerouslySetInnerHTML":
                throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        if (value === null && defaultValue !== null) {
          value = defaultValue;
        }
        target.push(endOfStartTag);
        if (children != null) {
          {
            error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          }
          if (value != null) {
            throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
          }
          if (isArray(children)) {
            if (children.length > 1) {
              throw new Error("<textarea> can only have at most one child.");
            }
            {
              checkHtmlStringCoercion(children[0]);
            }
            value = "" + children[0];
          }
          {
            checkHtmlStringCoercion(children);
          }
          value = "" + children;
        }
        if (typeof value === "string" && value[0] === "\n") {
          target.push(leadingNewline);
        }
        if (value !== null) {
          {
            checkAttributeStringCoercion(value, "value");
          }
          target.push(stringToChunk(encodeHTMLTextNode("" + value)));
        }
        return null;
      }
      function pushSelfClosing(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTagSelfClosing);
        return null;
      }
      function pushStartMenuItem(target, props, responseState) {
        target.push(startChunkForTag("menuitem"));
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        return null;
      }
      function pushStartTitle(target, props, responseState) {
        target.push(startChunkForTag("title"));
        var children = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        {
          var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
          if (Array.isArray(children) && children.length > 1) {
            error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
          } else if (child != null && child.$$typeof != null) {
            error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
          } else if (child != null && typeof child !== "string" && typeof child !== "number") {
            error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
          }
        }
        return children;
      }
      function pushStartGenericElement(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        if (typeof children === "string") {
          target.push(stringToChunk(encodeHTMLTextNode(children)));
          return null;
        }
        return children;
      }
      function pushStartCustomElement(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              case "style":
                pushStyle(target, responseState, propValue);
                break;
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
                break;
              default:
                if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                  target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                }
                break;
            }
          }
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        return children;
      }
      var leadingNewline = stringToPrecomputedChunk("\n");
      function pushStartPreformattedElement(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        if (innerHTML != null) {
          if (children != null) {
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          }
          if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
          }
          var html = innerHTML.__html;
          if (html !== null && html !== void 0) {
            if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
              target.push(leadingNewline, stringToChunk(html));
            } else {
              {
                checkHtmlStringCoercion(html);
              }
              target.push(stringToChunk("" + html));
            }
          }
        }
        if (typeof children === "string" && children[0] === "\n") {
          target.push(leadingNewline);
        }
        return children;
      }
      var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
      var validatedTagCache = /* @__PURE__ */ new Map();
      function startChunkForTag(tag) {
        var tagStartChunk = validatedTagCache.get(tag);
        if (tagStartChunk === void 0) {
          if (!VALID_TAG_REGEX.test(tag)) {
            throw new Error("Invalid tag: " + tag);
          }
          tagStartChunk = stringToPrecomputedChunk("<" + tag);
          validatedTagCache.set(tag, tagStartChunk);
        }
        return tagStartChunk;
      }
      var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
      function pushStartInstance(target, type, props, responseState, formatContext) {
        {
          validateProperties(type, props);
          validateProperties$1(type, props);
          validateProperties$2(type, props, null);
          if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
            error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
          }
          if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
            if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
              error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
            }
          }
        }
        switch (type) {
          // Special tags
          case "select":
            return pushStartSelect(target, props, responseState);
          case "option":
            return pushStartOption(target, props, responseState, formatContext);
          case "textarea":
            return pushStartTextArea(target, props, responseState);
          case "input":
            return pushInput(target, props, responseState);
          case "menuitem":
            return pushStartMenuItem(target, props, responseState);
          case "title":
            return pushStartTitle(target, props, responseState);
          // Newline eating tags
          case "listing":
          case "pre": {
            return pushStartPreformattedElement(target, props, type, responseState);
          }
          // Omitted close tags
          case "area":
          case "base":
          case "br":
          case "col":
          case "embed":
          case "hr":
          case "img":
          case "keygen":
          case "link":
          case "meta":
          case "param":
          case "source":
          case "track":
          case "wbr": {
            return pushSelfClosing(target, props, type, responseState);
          }
          // These are reserved SVG and MathML elements, that are never custom elements.
          // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph": {
            return pushStartGenericElement(target, props, type, responseState);
          }
          case "html": {
            if (formatContext.insertionMode === ROOT_HTML_MODE) {
              target.push(DOCTYPE);
            }
            return pushStartGenericElement(target, props, type, responseState);
          }
          default: {
            if (type.indexOf("-") === -1 && typeof props.is !== "string") {
              return pushStartGenericElement(target, props, type, responseState);
            } else {
              return pushStartCustomElement(target, props, type, responseState);
            }
          }
        }
      }
      var endTag1 = stringToPrecomputedChunk("</");
      var endTag2 = stringToPrecomputedChunk(">");
      function pushEndInstance(target, type, props) {
        switch (type) {
          // Omitted close tags
          // TODO: Instead of repeating this switch we could try to pass a flag from above.
          // That would require returning a tuple. Which might be ok if it gets inlined.
          case "area":
          case "base":
          case "br":
          case "col":
          case "embed":
          case "hr":
          case "img":
          case "input":
          case "keygen":
          case "link":
          case "meta":
          case "param":
          case "source":
          case "track":
          case "wbr": {
            break;
          }
          default: {
            target.push(endTag1, stringToChunk(type), endTag2);
          }
        }
      }
      function writeCompletedRoot(destination, responseState) {
        var bootstrapChunks = responseState.bootstrapChunks;
        var i = 0;
        for (; i < bootstrapChunks.length - 1; i++) {
          writeChunk(destination, bootstrapChunks[i]);
        }
        if (i < bootstrapChunks.length) {
          return writeChunkAndReturn(destination, bootstrapChunks[i]);
        }
        return true;
      }
      var placeholder1 = stringToPrecomputedChunk('<template id="');
      var placeholder2 = stringToPrecomputedChunk('"></template>');
      function writePlaceholder(destination, responseState, id) {
        writeChunk(destination, placeholder1);
        writeChunk(destination, responseState.placeholderPrefix);
        var formattedID = stringToChunk(id.toString(16));
        writeChunk(destination, formattedID);
        return writeChunkAndReturn(destination, placeholder2);
      }
      var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
      var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
      var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
      var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
      var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
      var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
      var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
      var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
      var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
      var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
      var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
      function writeStartCompletedSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
      }
      function writeStartPendingSuspenseBoundary(destination, responseState, id) {
        writeChunk(destination, startPendingSuspenseBoundary1);
        if (id === null) {
          throw new Error("An ID must have been assigned before we can complete the boundary.");
        }
        writeChunk(destination, id);
        return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
      }
      function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
        var result;
        result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
        writeChunk(destination, clientRenderedSuspenseBoundaryError1);
        if (errorDigest) {
          writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
          writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
          writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
        }
        {
          if (errorMesssage) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
          if (errorComponentStack) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
        }
        result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
        return result;
      }
      function writeEndCompletedSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, endSuspenseBoundary);
      }
      function writeEndPendingSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, endSuspenseBoundary);
      }
      function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, endSuspenseBoundary);
      }
      var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
      var startSegmentHTML2 = stringToPrecomputedChunk('">');
      var endSegmentHTML = stringToPrecomputedChunk("</div>");
      var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
      var startSegmentSVG2 = stringToPrecomputedChunk('">');
      var endSegmentSVG = stringToPrecomputedChunk("</svg>");
      var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
      var startSegmentMathML2 = stringToPrecomputedChunk('">');
      var endSegmentMathML = stringToPrecomputedChunk("</math>");
      var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
      var startSegmentTable2 = stringToPrecomputedChunk('">');
      var endSegmentTable = stringToPrecomputedChunk("</table>");
      var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
      var startSegmentTableBody2 = stringToPrecomputedChunk('">');
      var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
      var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
      var startSegmentTableRow2 = stringToPrecomputedChunk('">');
      var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
      var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
      var startSegmentColGroup2 = stringToPrecomputedChunk('">');
      var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
      function writeStartSegment(destination, responseState, formatContext, id) {
        switch (formatContext.insertionMode) {
          case ROOT_HTML_MODE:
          case HTML_MODE: {
            writeChunk(destination, startSegmentHTML);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentHTML2);
          }
          case SVG_MODE: {
            writeChunk(destination, startSegmentSVG);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentSVG2);
          }
          case MATHML_MODE: {
            writeChunk(destination, startSegmentMathML);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentMathML2);
          }
          case HTML_TABLE_MODE: {
            writeChunk(destination, startSegmentTable);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentTable2);
          }
          // TODO: For the rest of these, there will be extra wrapper nodes that never
          // get deleted from the document. We need to delete the table too as part
          // of the injected scripts. They are invisible though so it's not too terrible
          // and it's kind of an edge case to suspend in a table. Totally supported though.
          case HTML_TABLE_BODY_MODE: {
            writeChunk(destination, startSegmentTableBody);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentTableBody2);
          }
          case HTML_TABLE_ROW_MODE: {
            writeChunk(destination, startSegmentTableRow);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentTableRow2);
          }
          case HTML_COLGROUP_MODE: {
            writeChunk(destination, startSegmentColGroup);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentColGroup2);
          }
          default: {
            throw new Error("Unknown insertion mode. This is a bug in React.");
          }
        }
      }
      function writeEndSegment(destination, formatContext) {
        switch (formatContext.insertionMode) {
          case ROOT_HTML_MODE:
          case HTML_MODE: {
            return writeChunkAndReturn(destination, endSegmentHTML);
          }
          case SVG_MODE: {
            return writeChunkAndReturn(destination, endSegmentSVG);
          }
          case MATHML_MODE: {
            return writeChunkAndReturn(destination, endSegmentMathML);
          }
          case HTML_TABLE_MODE: {
            return writeChunkAndReturn(destination, endSegmentTable);
          }
          case HTML_TABLE_BODY_MODE: {
            return writeChunkAndReturn(destination, endSegmentTableBody);
          }
          case HTML_TABLE_ROW_MODE: {
            return writeChunkAndReturn(destination, endSegmentTableRow);
          }
          case HTML_COLGROUP_MODE: {
            return writeChunkAndReturn(destination, endSegmentColGroup);
          }
          default: {
            throw new Error("Unknown insertion mode. This is a bug in React.");
          }
        }
      }
      var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
      var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
      var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
      var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
      var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
      var completeSegmentScript2 = stringToPrecomputedChunk('","');
      var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
      function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
        writeChunk(destination, responseState.startInlineScript);
        if (!responseState.sentCompleteSegmentFunction) {
          responseState.sentCompleteSegmentFunction = true;
          writeChunk(destination, completeSegmentScript1Full);
        } else {
          writeChunk(destination, completeSegmentScript1Partial);
        }
        writeChunk(destination, responseState.segmentPrefix);
        var formattedID = stringToChunk(contentSegmentID.toString(16));
        writeChunk(destination, formattedID);
        writeChunk(destination, completeSegmentScript2);
        writeChunk(destination, responseState.placeholderPrefix);
        writeChunk(destination, formattedID);
        return writeChunkAndReturn(destination, completeSegmentScript3);
      }
      var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
      var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
      var completeBoundaryScript2 = stringToPrecomputedChunk('","');
      var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
      function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
        writeChunk(destination, responseState.startInlineScript);
        if (!responseState.sentCompleteBoundaryFunction) {
          responseState.sentCompleteBoundaryFunction = true;
          writeChunk(destination, completeBoundaryScript1Full);
        } else {
          writeChunk(destination, completeBoundaryScript1Partial);
        }
        if (boundaryID === null) {
          throw new Error("An ID must have been assigned before we can complete the boundary.");
        }
        var formattedContentID = stringToChunk(contentSegmentID.toString(16));
        writeChunk(destination, boundaryID);
        writeChunk(destination, completeBoundaryScript2);
        writeChunk(destination, responseState.segmentPrefix);
        writeChunk(destination, formattedContentID);
        return writeChunkAndReturn(destination, completeBoundaryScript3);
      }
      var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
      var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
      var clientRenderScript1A = stringToPrecomputedChunk('"');
      var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
      var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
      function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
        writeChunk(destination, responseState.startInlineScript);
        if (!responseState.sentClientRenderFunction) {
          responseState.sentClientRenderFunction = true;
          writeChunk(destination, clientRenderScript1Full);
        } else {
          writeChunk(destination, clientRenderScript1Partial);
        }
        if (boundaryID === null) {
          throw new Error("An ID must have been assigned before we can complete the boundary.");
        }
        writeChunk(destination, boundaryID);
        writeChunk(destination, clientRenderScript1A);
        if (errorDigest || errorMessage || errorComponentStack) {
          writeChunk(destination, clientRenderErrorScriptArgInterstitial);
          writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
        }
        if (errorMessage || errorComponentStack) {
          writeChunk(destination, clientRenderErrorScriptArgInterstitial);
          writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
        }
        if (errorComponentStack) {
          writeChunk(destination, clientRenderErrorScriptArgInterstitial);
          writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
        }
        return writeChunkAndReturn(destination, clientRenderScript2);
      }
      var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
      function escapeJSStringsForInstructionScripts(input) {
        var escaped = JSON.stringify(input);
        return escaped.replace(regexForJSStringsInScripts, function(match) {
          switch (match) {
            // santizing breaking out of strings and script tags
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default: {
              throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
            }
          }
        });
      }
      function createResponseState$1(generateStaticMarkup, identifierPrefix) {
        var responseState = createResponseState(identifierPrefix, void 0);
        return {
          // Keep this in sync with ReactDOMServerFormatConfig
          bootstrapChunks: responseState.bootstrapChunks,
          startInlineScript: responseState.startInlineScript,
          placeholderPrefix: responseState.placeholderPrefix,
          segmentPrefix: responseState.segmentPrefix,
          boundaryPrefix: responseState.boundaryPrefix,
          idPrefix: responseState.idPrefix,
          nextSuspenseID: responseState.nextSuspenseID,
          sentCompleteSegmentFunction: responseState.sentCompleteSegmentFunction,
          sentCompleteBoundaryFunction: responseState.sentCompleteBoundaryFunction,
          sentClientRenderFunction: responseState.sentClientRenderFunction,
          // This is an extra field for the legacy renderer
          generateStaticMarkup
        };
      }
      function createRootFormatContext() {
        return {
          insertionMode: HTML_MODE,
          // We skip the root mode because we don't want to emit the DOCTYPE in legacy mode.
          selectedValue: null
        };
      }
      function pushTextInstance$1(target, text, responseState, textEmbedded) {
        if (responseState.generateStaticMarkup) {
          target.push(stringToChunk(escapeTextForBrowser(text)));
          return false;
        } else {
          return pushTextInstance(target, text, responseState, textEmbedded);
        }
      }
      function pushSegmentFinale$1(target, responseState, lastPushedText, textEmbedded) {
        if (responseState.generateStaticMarkup) {
          return;
        } else {
          return pushSegmentFinale(target, responseState, lastPushedText, textEmbedded);
        }
      }
      function writeStartCompletedSuspenseBoundary$1(destination, responseState) {
        if (responseState.generateStaticMarkup) {
          return true;
        }
        return writeStartCompletedSuspenseBoundary(destination);
      }
      function writeStartClientRenderedSuspenseBoundary$1(destination, responseState, errorDigest, errorMessage, errorComponentStack) {
        if (responseState.generateStaticMarkup) {
          return true;
        }
        return writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMessage, errorComponentStack);
      }
      function writeEndCompletedSuspenseBoundary$1(destination, responseState) {
        if (responseState.generateStaticMarkup) {
          return true;
        }
        return writeEndCompletedSuspenseBoundary(destination);
      }
      function writeEndClientRenderedSuspenseBoundary$1(destination, responseState) {
        if (responseState.generateStaticMarkup) {
          return true;
        }
        return writeEndClientRenderedSuspenseBoundary(destination);
      }
      var assign = Object.assign;
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element");
      var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = /* @__PURE__ */ Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
      var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
      var REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope");
      var REACT_DEBUG_TRACING_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.debug_trace_mode");
      var REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden");
      var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = /* @__PURE__ */ Symbol.for("react.default_value");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x2) {
                return null;
              }
            }
          }
        }
        return null;
      }
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix2;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix2 === void 0) {
            try {
              throw Error();
            } catch (x2) {
              var match = x2.stack.trim().match(/\n( *(at )?)/);
              prefix2 = match && match[1] || "";
            }
          }
          return "\n" + prefix2 + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn2, construct) {
        if (!fn2 || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn2);
          if (frame !== void 0) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x2) {
                control = x2;
              }
              Reflect.construct(fn2, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x2) {
                control = x2;
              }
              fn2.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x2) {
              control = x2;
            }
            fn2();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c2 = controlLines.length - 1;
            while (s >= 1 && c2 >= 0 && sampleLines[s] !== controlLines[c2]) {
              c2--;
            }
            for (; s >= 1 && c2 >= 0; s--, c2--) {
              if (sampleLines[s] !== controlLines[c2]) {
                if (s !== 1 || c2 !== 1) {
                  do {
                    s--;
                    c2--;
                    if (c2 < 0 || sampleLines[s] !== controlLines[c2]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn2.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn2.displayName);
                      }
                      {
                        if (typeof fn2 === "function") {
                          componentFrameCache.set(fn2, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c2 >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn2 ? fn2.displayName || fn2.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn2 === "function") {
            componentFrameCache.set(fn2, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeClassComponentFrame(ctor, source, ownerFn) {
        {
          return describeNativeComponentFrame(ctor, true);
        }
      }
      function describeFunctionComponentFrame(fn2, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn2, false);
        }
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x2) {
              }
            }
          }
        }
        return "";
      }
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error("Failed %s type: %s", location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      var warnedAboutMissingGetChildContext;
      {
        warnedAboutMissingGetChildContext = {};
      }
      var emptyContextObject = {};
      {
        Object.freeze(emptyContextObject);
      }
      function getMaskedContext(type, unmaskedContext) {
        {
          var contextTypes = type.contextTypes;
          if (!contextTypes) {
            return emptyContextObject;
          }
          var context = {};
          for (var key in contextTypes) {
            context[key] = unmaskedContext[key];
          }
          {
            var name = getComponentNameFromType(type) || "Unknown";
            checkPropTypes(contextTypes, context, "context", name);
          }
          return context;
        }
      }
      function processChildContext(instance, type, parentContext, childContextTypes) {
        {
          if (typeof instance.getChildContext !== "function") {
            {
              var componentName = getComponentNameFromType(type) || "Unknown";
              if (!warnedAboutMissingGetChildContext[componentName]) {
                warnedAboutMissingGetChildContext[componentName] = true;
                error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
              }
            }
            return parentContext;
          }
          var childContext = instance.getChildContext();
          for (var contextKey in childContext) {
            if (!(contextKey in childContextTypes)) {
              throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
            }
          }
          {
            var name = getComponentNameFromType(type) || "Unknown";
            checkPropTypes(childContextTypes, childContext, "child context", name);
          }
          return assign({}, parentContext, childContext);
        }
      }
      var rendererSigil;
      {
        rendererSigil = {};
      }
      var rootContextSnapshot = null;
      var currentActiveSnapshot = null;
      function popNode(prev) {
        {
          prev.context._currentValue2 = prev.parentValue;
        }
      }
      function pushNode(next) {
        {
          next.context._currentValue2 = next.value;
        }
      }
      function popToNearestCommonAncestor(prev, next) {
        if (prev === next) ;
        else {
          popNode(prev);
          var parentPrev = prev.parent;
          var parentNext = next.parent;
          if (parentPrev === null) {
            if (parentNext !== null) {
              throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
            }
          } else {
            if (parentNext === null) {
              throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
            }
            popToNearestCommonAncestor(parentPrev, parentNext);
          }
          pushNode(next);
        }
      }
      function popAllPrevious(prev) {
        popNode(prev);
        var parentPrev = prev.parent;
        if (parentPrev !== null) {
          popAllPrevious(parentPrev);
        }
      }
      function pushAllNext(next) {
        var parentNext = next.parent;
        if (parentNext !== null) {
          pushAllNext(parentNext);
        }
        pushNode(next);
      }
      function popPreviousToCommonLevel(prev, next) {
        popNode(prev);
        var parentPrev = prev.parent;
        if (parentPrev === null) {
          throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
        }
        if (parentPrev.depth === next.depth) {
          popToNearestCommonAncestor(parentPrev, next);
        } else {
          popPreviousToCommonLevel(parentPrev, next);
        }
      }
      function popNextToCommonLevel(prev, next) {
        var parentNext = next.parent;
        if (parentNext === null) {
          throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
        }
        if (prev.depth === parentNext.depth) {
          popToNearestCommonAncestor(prev, parentNext);
        } else {
          popNextToCommonLevel(prev, parentNext);
        }
        pushNode(next);
      }
      function switchContext(newSnapshot) {
        var prev = currentActiveSnapshot;
        var next = newSnapshot;
        if (prev !== next) {
          if (prev === null) {
            pushAllNext(next);
          } else if (next === null) {
            popAllPrevious(prev);
          } else if (prev.depth === next.depth) {
            popToNearestCommonAncestor(prev, next);
          } else if (prev.depth > next.depth) {
            popPreviousToCommonLevel(prev, next);
          } else {
            popNextToCommonLevel(prev, next);
          }
          currentActiveSnapshot = next;
        }
      }
      function pushProvider(context, nextValue) {
        var prevValue;
        {
          prevValue = context._currentValue2;
          context._currentValue2 = nextValue;
          {
            if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
              error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
            }
            context._currentRenderer2 = rendererSigil;
          }
        }
        var prevNode = currentActiveSnapshot;
        var newNode = {
          parent: prevNode,
          depth: prevNode === null ? 0 : prevNode.depth + 1,
          context,
          parentValue: prevValue,
          value: nextValue
        };
        currentActiveSnapshot = newNode;
        return newNode;
      }
      function popProvider(context) {
        var prevSnapshot = currentActiveSnapshot;
        if (prevSnapshot === null) {
          throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
        }
        {
          if (prevSnapshot.context !== context) {
            error("The parent context is not the expected context. This is probably a bug in React.");
          }
        }
        {
          var _value = prevSnapshot.parentValue;
          if (_value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
            prevSnapshot.context._currentValue2 = prevSnapshot.context._defaultValue;
          } else {
            prevSnapshot.context._currentValue2 = _value;
          }
          {
            if (context._currentRenderer2 !== void 0 && context._currentRenderer2 !== null && context._currentRenderer2 !== rendererSigil) {
              error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
            }
            context._currentRenderer2 = rendererSigil;
          }
        }
        return currentActiveSnapshot = prevSnapshot.parent;
      }
      function getActiveContext() {
        return currentActiveSnapshot;
      }
      function readContext(context) {
        var value = context._currentValue2;
        return value;
      }
      function get(key) {
        return key._reactInternals;
      }
      function set(key, value) {
        key._reactInternals = value;
      }
      var didWarnAboutNoopUpdateForComponent = {};
      var didWarnAboutDeprecatedWillMount = {};
      var didWarnAboutUninitializedState;
      var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
      var didWarnAboutLegacyLifecyclesAndDerivedState;
      var didWarnAboutUndefinedDerivedState;
      var warnOnUndefinedDerivedState;
      var warnOnInvalidCallback;
      var didWarnAboutDirectlyAssigningPropsToState;
      var didWarnAboutContextTypeAndContextTypes;
      var didWarnAboutInvalidateContextType;
      {
        didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
        didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
        didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
        didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
        didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
        didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
        didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
        var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
        warnOnInvalidCallback = function(callback, callerName) {
          if (callback === null || typeof callback === "function") {
            return;
          }
          var key = callerName + "_" + callback;
          if (!didWarnOnInvalidCallback.has(key)) {
            didWarnOnInvalidCallback.add(key);
            error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
          }
        };
        warnOnUndefinedDerivedState = function(type, partialState) {
          if (partialState === void 0) {
            var componentName = getComponentNameFromType(type) || "Component";
            if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
              didWarnAboutUndefinedDerivedState.add(componentName);
              error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
            }
          }
        };
      }
      function warnNoop(publicInstance, callerName) {
        {
          var _constructor = publicInstance.constructor;
          var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
          var warningKey = componentName + "." + callerName;
          if (didWarnAboutNoopUpdateForComponent[warningKey]) {
            return;
          }
          error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
          didWarnAboutNoopUpdateForComponent[warningKey] = true;
        }
      }
      var classComponentUpdater = {
        isMounted: function(inst) {
          return false;
        },
        enqueueSetState: function(inst, payload, callback) {
          var internals = get(inst);
          if (internals.queue === null) {
            warnNoop(inst, "setState");
          } else {
            internals.queue.push(payload);
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          }
        },
        enqueueReplaceState: function(inst, payload, callback) {
          var internals = get(inst);
          internals.replace = true;
          internals.queue = [payload];
          {
            if (callback !== void 0 && callback !== null) {
              warnOnInvalidCallback(callback, "setState");
            }
          }
        },
        enqueueForceUpdate: function(inst, callback) {
          var internals = get(inst);
          if (internals.queue === null) {
            warnNoop(inst, "forceUpdate");
          } else {
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          }
        }
      };
      function applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, prevState, nextProps) {
        var partialState = getDerivedStateFromProps(nextProps, prevState);
        {
          warnOnUndefinedDerivedState(ctor, partialState);
        }
        var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
        return newState;
      }
      function constructClassInstance(ctor, props, maskedLegacyContext) {
        var context = emptyContextObject;
        var contextType = ctor.contextType;
        {
          if ("contextType" in ctor) {
            var isValid = (
              // Allow null for conditional declaration
              contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0
            );
            if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
              didWarnAboutInvalidateContextType.add(ctor);
              var addendum = "";
              if (contextType === void 0) {
                addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
              } else if (typeof contextType !== "object") {
                addendum = " However, it is set to a " + typeof contextType + ".";
              } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                addendum = " Did you accidentally pass the Context.Provider instead?";
              } else if (contextType._context !== void 0) {
                addendum = " Did you accidentally pass the Context.Consumer instead?";
              } else {
                addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
              }
              error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
            }
          }
        }
        if (typeof contextType === "object" && contextType !== null) {
          context = readContext(contextType);
        } else {
          context = maskedLegacyContext;
        }
        var instance = new ctor(props, context);
        {
          if (typeof ctor.getDerivedStateFromProps === "function" && (instance.state === null || instance.state === void 0)) {
            var componentName = getComponentNameFromType(ctor) || "Component";
            if (!didWarnAboutUninitializedState.has(componentName)) {
              didWarnAboutUninitializedState.add(componentName);
              error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance.state === null ? "null" : "undefined", componentName);
            }
          }
          if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function") {
            var foundWillMountName = null;
            var foundWillReceivePropsName = null;
            var foundWillUpdateName = null;
            if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
              foundWillMountName = "componentWillMount";
            } else if (typeof instance.UNSAFE_componentWillMount === "function") {
              foundWillMountName = "UNSAFE_componentWillMount";
            }
            if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
              foundWillReceivePropsName = "componentWillReceiveProps";
            } else if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
              foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
            }
            if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
              foundWillUpdateName = "componentWillUpdate";
            } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
              foundWillUpdateName = "UNSAFE_componentWillUpdate";
            }
            if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
              var _componentName = getComponentNameFromType(ctor) || "Component";
              var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
              if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
              }
            }
          }
        }
        return instance;
      }
      function checkClassInstance(instance, ctor, newProps) {
        {
          var name = getComponentNameFromType(ctor) || "Component";
          var renderPresent = instance.render;
          if (!renderPresent) {
            if (ctor.prototype && typeof ctor.prototype.render === "function") {
              error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
            } else {
              error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
            }
          }
          if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
            error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
          }
          if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
          }
          if (instance.propTypes) {
            error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
          }
          if (instance.contextType) {
            error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
          }
          {
            if (instance.contextTypes) {
              error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
            }
            if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
              didWarnAboutContextTypeAndContextTypes.add(ctor);
              error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
            }
          }
          if (typeof instance.componentShouldUpdate === "function") {
            error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
          }
          if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== "undefined") {
            error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
          }
          if (typeof instance.componentDidUnmount === "function") {
            error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
          }
          if (typeof instance.componentDidReceiveProps === "function") {
            error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
          }
          if (typeof instance.componentWillRecieveProps === "function") {
            error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
          }
          if (typeof instance.UNSAFE_componentWillRecieveProps === "function") {
            error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
          }
          var hasMutatedProps = instance.props !== newProps;
          if (instance.props !== void 0 && hasMutatedProps) {
            error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
          }
          if (instance.defaultProps) {
            error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
          }
          if (typeof instance.getSnapshotBeforeUpdate === "function" && typeof instance.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
            didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
            error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
          }
          if (typeof instance.getDerivedStateFromProps === "function") {
            error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
          }
          if (typeof instance.getDerivedStateFromError === "function") {
            error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
          }
          if (typeof ctor.getSnapshotBeforeUpdate === "function") {
            error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
          }
          var _state = instance.state;
          if (_state && (typeof _state !== "object" || isArray(_state))) {
            error("%s.state: must be set to an object or null", name);
          }
          if (typeof instance.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
            error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
          }
        }
      }
      function callComponentWillMount(type, instance) {
        var oldState = instance.state;
        if (typeof instance.componentWillMount === "function") {
          {
            if (instance.componentWillMount.__suppressDeprecationWarning !== true) {
              var componentName = getComponentNameFromType(type) || "Unknown";
              if (!didWarnAboutDeprecatedWillMount[componentName]) {
                warn(
                  // keep this warning in sync with ReactStrictModeWarning.js
                  "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                  componentName
                );
                didWarnAboutDeprecatedWillMount[componentName] = true;
              }
            }
          }
          instance.componentWillMount();
        }
        if (typeof instance.UNSAFE_componentWillMount === "function") {
          instance.UNSAFE_componentWillMount();
        }
        if (oldState !== instance.state) {
          {
            error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
          }
          classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
        }
      }
      function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
        if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
          var oldQueue = internalInstance.queue;
          var oldReplace = internalInstance.replace;
          internalInstance.queue = null;
          internalInstance.replace = false;
          if (oldReplace && oldQueue.length === 1) {
            inst.state = oldQueue[0];
          } else {
            var nextState = oldReplace ? oldQueue[0] : inst.state;
            var dontMutate = true;
            for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
              var partial = oldQueue[i];
              var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
              if (partialState != null) {
                if (dontMutate) {
                  dontMutate = false;
                  nextState = assign({}, nextState, partialState);
                } else {
                  assign(nextState, partialState);
                }
              }
            }
            inst.state = nextState;
          }
        } else {
          internalInstance.queue = null;
        }
      }
      function mountClassInstance(instance, ctor, newProps, maskedLegacyContext) {
        {
          checkClassInstance(instance, ctor, newProps);
        }
        var initialState = instance.state !== void 0 ? instance.state : null;
        instance.updater = classComponentUpdater;
        instance.props = newProps;
        instance.state = initialState;
        var internalInstance = {
          queue: [],
          replace: false
        };
        set(instance, internalInstance);
        var contextType = ctor.contextType;
        if (typeof contextType === "object" && contextType !== null) {
          instance.context = readContext(contextType);
        } else {
          instance.context = maskedLegacyContext;
        }
        {
          if (instance.state === newProps) {
            var componentName = getComponentNameFromType(ctor) || "Component";
            if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
              didWarnAboutDirectlyAssigningPropsToState.add(componentName);
              error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
            }
          }
        }
        var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
        if (typeof getDerivedStateFromProps === "function") {
          instance.state = applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, initialState, newProps);
        }
        if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
          callComponentWillMount(ctor, instance);
          processUpdateQueue(internalInstance, instance, newProps, maskedLegacyContext);
        }
      }
      var emptyTreeContext = {
        id: 1,
        overflow: ""
      };
      function getTreeId(context) {
        var overflow = context.overflow;
        var idWithLeadingBit = context.id;
        var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
        return id.toString(32) + overflow;
      }
      function pushTreeContext(baseContext, totalChildren, index) {
        var baseIdWithLeadingBit = baseContext.id;
        var baseOverflow = baseContext.overflow;
        var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
        var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
        var slot = index + 1;
        var length = getBitLength(totalChildren) + baseLength;
        if (length > 30) {
          var numberOfOverflowBits = baseLength - baseLength % 5;
          var newOverflowBits = (1 << numberOfOverflowBits) - 1;
          var newOverflow = (baseId & newOverflowBits).toString(32);
          var restOfBaseId = baseId >> numberOfOverflowBits;
          var restOfBaseLength = baseLength - numberOfOverflowBits;
          var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
          var restOfNewBits = slot << restOfBaseLength;
          var id = restOfNewBits | restOfBaseId;
          var overflow = newOverflow + baseOverflow;
          return {
            id: 1 << restOfLength | id,
            overflow
          };
        } else {
          var newBits = slot << baseLength;
          var _id = newBits | baseId;
          var _overflow = baseOverflow;
          return {
            id: 1 << length | _id,
            overflow: _overflow
          };
        }
      }
      function getBitLength(number) {
        return 32 - clz32(number);
      }
      function getLeadingBit(id) {
        return 1 << getBitLength(id) - 1;
      }
      var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
      var log = Math.log;
      var LN2 = Math.LN2;
      function clz32Fallback(x2) {
        var asUint = x2 >>> 0;
        if (asUint === 0) {
          return 32;
        }
        return 31 - (log(asUint) / LN2 | 0) | 0;
      }
      function is(x2, y2) {
        return x2 === y2 && (x2 !== 0 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
      }
      var objectIs = typeof Object.is === "function" ? Object.is : is;
      var currentlyRenderingComponent = null;
      var currentlyRenderingTask = null;
      var firstWorkInProgressHook = null;
      var workInProgressHook = null;
      var isReRender = false;
      var didScheduleRenderPhaseUpdate = false;
      var localIdCounter = 0;
      var renderPhaseUpdates = null;
      var numberOfReRenders = 0;
      var RE_RENDER_LIMIT = 25;
      var isInHookUserCodeInDev = false;
      var currentHookNameInDev;
      function resolveCurrentlyRenderingComponent() {
        if (currentlyRenderingComponent === null) {
          throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
        }
        {
          if (isInHookUserCodeInDev) {
            error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
          }
        }
        return currentlyRenderingComponent;
      }
      function areHookInputsEqual(nextDeps, prevDeps) {
        if (prevDeps === null) {
          {
            error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
          }
          return false;
        }
        {
          if (nextDeps.length !== prevDeps.length) {
            error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
          }
        }
        for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
          if (objectIs(nextDeps[i], prevDeps[i])) {
            continue;
          }
          return false;
        }
        return true;
      }
      function createHook() {
        if (numberOfReRenders > 0) {
          throw new Error("Rendered more hooks than during the previous render");
        }
        return {
          memoizedState: null,
          queue: null,
          next: null
        };
      }
      function createWorkInProgressHook() {
        if (workInProgressHook === null) {
          if (firstWorkInProgressHook === null) {
            isReRender = false;
            firstWorkInProgressHook = workInProgressHook = createHook();
          } else {
            isReRender = true;
            workInProgressHook = firstWorkInProgressHook;
          }
        } else {
          if (workInProgressHook.next === null) {
            isReRender = false;
            workInProgressHook = workInProgressHook.next = createHook();
          } else {
            isReRender = true;
            workInProgressHook = workInProgressHook.next;
          }
        }
        return workInProgressHook;
      }
      function prepareToUseHooks(task, componentIdentity) {
        currentlyRenderingComponent = componentIdentity;
        currentlyRenderingTask = task;
        {
          isInHookUserCodeInDev = false;
        }
        localIdCounter = 0;
      }
      function finishHooks(Component, props, children, refOrContext) {
        while (didScheduleRenderPhaseUpdate) {
          didScheduleRenderPhaseUpdate = false;
          localIdCounter = 0;
          numberOfReRenders += 1;
          workInProgressHook = null;
          children = Component(props, refOrContext);
        }
        resetHooksState();
        return children;
      }
      function checkDidRenderIdHook() {
        var didRenderIdHook = localIdCounter !== 0;
        return didRenderIdHook;
      }
      function resetHooksState() {
        {
          isInHookUserCodeInDev = false;
        }
        currentlyRenderingComponent = null;
        currentlyRenderingTask = null;
        didScheduleRenderPhaseUpdate = false;
        firstWorkInProgressHook = null;
        numberOfReRenders = 0;
        renderPhaseUpdates = null;
        workInProgressHook = null;
      }
      function readContext$1(context) {
        {
          if (isInHookUserCodeInDev) {
            error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          }
        }
        return readContext(context);
      }
      function useContext(context) {
        {
          currentHookNameInDev = "useContext";
        }
        resolveCurrentlyRenderingComponent();
        return readContext(context);
      }
      function basicStateReducer(state, action) {
        return typeof action === "function" ? action(state) : action;
      }
      function useState(initialState) {
        {
          currentHookNameInDev = "useState";
        }
        return useReducer(
          basicStateReducer,
          // useReducer has a special case to support lazy useState initializers
          initialState
        );
      }
      function useReducer(reducer, initialArg, init) {
        {
          if (reducer !== basicStateReducer) {
            currentHookNameInDev = "useReducer";
          }
        }
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        if (isReRender) {
          var queue = workInProgressHook.queue;
          var dispatch = queue.dispatch;
          if (renderPhaseUpdates !== null) {
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
            if (firstRenderPhaseUpdate !== void 0) {
              renderPhaseUpdates.delete(queue);
              var newState = workInProgressHook.memoizedState;
              var update = firstRenderPhaseUpdate;
              do {
                var action = update.action;
                {
                  isInHookUserCodeInDev = true;
                }
                newState = reducer(newState, action);
                {
                  isInHookUserCodeInDev = false;
                }
                update = update.next;
              } while (update !== null);
              workInProgressHook.memoizedState = newState;
              return [newState, dispatch];
            }
          }
          return [workInProgressHook.memoizedState, dispatch];
        } else {
          {
            isInHookUserCodeInDev = true;
          }
          var initialState;
          if (reducer === basicStateReducer) {
            initialState = typeof initialArg === "function" ? initialArg() : initialArg;
          } else {
            initialState = init !== void 0 ? init(initialArg) : initialArg;
          }
          {
            isInHookUserCodeInDev = false;
          }
          workInProgressHook.memoizedState = initialState;
          var _queue = workInProgressHook.queue = {
            last: null,
            dispatch: null
          };
          var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
          return [workInProgressHook.memoizedState, _dispatch];
        }
      }
      function useMemo(nextCreate, deps) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var nextDeps = deps === void 0 ? null : deps;
        if (workInProgressHook !== null) {
          var prevState = workInProgressHook.memoizedState;
          if (prevState !== null) {
            if (nextDeps !== null) {
              var prevDeps = prevState[1];
              if (areHookInputsEqual(nextDeps, prevDeps)) {
                return prevState[0];
              }
            }
          }
        }
        {
          isInHookUserCodeInDev = true;
        }
        var nextValue = nextCreate();
        {
          isInHookUserCodeInDev = false;
        }
        workInProgressHook.memoizedState = [nextValue, nextDeps];
        return nextValue;
      }
      function useRef(initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        if (previousRef === null) {
          var ref = {
            current: initialValue
          };
          {
            Object.seal(ref);
          }
          workInProgressHook.memoizedState = ref;
          return ref;
        } else {
          return previousRef;
        }
      }
      function useLayoutEffect2(create, inputs) {
        {
          currentHookNameInDev = "useLayoutEffect";
          error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
        }
      }
      function dispatchAction(componentIdentity, queue, action) {
        if (numberOfReRenders >= RE_RENDER_LIMIT) {
          throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
        }
        if (componentIdentity === currentlyRenderingComponent) {
          didScheduleRenderPhaseUpdate = true;
          var update = {
            action,
            next: null
          };
          if (renderPhaseUpdates === null) {
            renderPhaseUpdates = /* @__PURE__ */ new Map();
          }
          var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
          if (firstRenderPhaseUpdate === void 0) {
            renderPhaseUpdates.set(queue, update);
          } else {
            var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
            while (lastRenderPhaseUpdate.next !== null) {
              lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
            }
            lastRenderPhaseUpdate.next = update;
          }
        }
      }
      function useCallback(callback, deps) {
        return useMemo(function() {
          return callback;
        }, deps);
      }
      function useMutableSource(source, getSnapshot, subscribe2) {
        resolveCurrentlyRenderingComponent();
        return getSnapshot(source._source);
      }
      function useSyncExternalStore(subscribe2, getSnapshot, getServerSnapshot) {
        if (getServerSnapshot === void 0) {
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        }
        return getServerSnapshot();
      }
      function useDeferredValue(value) {
        resolveCurrentlyRenderingComponent();
        return value;
      }
      function unsupportedStartTransition() {
        throw new Error("startTransition cannot be called during server rendering.");
      }
      function useTransition() {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      }
      function useId() {
        var task = currentlyRenderingTask;
        var treeId = getTreeId(task.treeContext);
        var responseState = currentResponseState;
        if (responseState === null) {
          throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
        }
        var localId = localIdCounter++;
        return makeId(responseState, treeId, localId);
      }
      function noop() {
      }
      var Dispatcher = {
        readContext: readContext$1,
        useContext,
        useMemo,
        useReducer,
        useRef,
        useState,
        useInsertionEffect: noop,
        useLayoutEffect: useLayoutEffect2,
        useCallback,
        // useImperativeHandle is not run in the server environment
        useImperativeHandle: noop,
        // Effects are not run in the server environment.
        useEffect: noop,
        // Debugging effect
        useDebugValue: noop,
        useDeferredValue,
        useTransition,
        useId,
        // Subscriptions are not setup in a server environment.
        useMutableSource,
        useSyncExternalStore
      };
      var currentResponseState = null;
      function setCurrentResponseState(responseState) {
        currentResponseState = responseState;
      }
      function getStackByComponentStackNode(componentStack) {
        try {
          var info = "";
          var node = componentStack;
          do {
            switch (node.tag) {
              case 0:
                info += describeBuiltInComponentFrame(node.type, null, null);
                break;
              case 1:
                info += describeFunctionComponentFrame(node.type, null, null);
                break;
              case 2:
                info += describeClassComponentFrame(node.type, null, null);
                break;
            }
            node = node.parent;
          } while (node);
          return info;
        } catch (x2) {
          return "\nError generating stack: " + x2.message + "\n" + x2.stack;
        }
      }
      var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      var PENDING = 0;
      var COMPLETED = 1;
      var FLUSHED = 2;
      var ABORTED = 3;
      var ERRORED = 4;
      var OPEN = 0;
      var CLOSING = 1;
      var CLOSED = 2;
      var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
      function defaultErrorHandler(error2) {
        console["error"](error2);
        return null;
      }
      function noop$1() {
      }
      function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError2, onAllReady, onShellReady, onShellError, onFatalError) {
        var pingedTasks = [];
        var abortSet = /* @__PURE__ */ new Set();
        var request = {
          destination: null,
          responseState,
          progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
          status: OPEN,
          fatalError: null,
          nextSegmentId: 0,
          allPendingTasks: 0,
          pendingRootTasks: 0,
          completedRootSegment: null,
          abortableTasks: abortSet,
          pingedTasks,
          clientRenderedBoundaries: [],
          completedBoundaries: [],
          partialBoundaries: [],
          onError: onError2 === void 0 ? defaultErrorHandler : onError2,
          onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
          onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
          onShellError: noop$1,
          onFatalError: noop$1
        };
        var rootSegment = createPendingSegment(
          request,
          0,
          null,
          rootFormatContext,
          // Root segments are never embedded in Text on either edge
          false,
          false
        );
        rootSegment.parentFlushed = true;
        var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
        pingedTasks.push(rootTask);
        return request;
      }
      function pingTask(request, task) {
        var pingedTasks = request.pingedTasks;
        pingedTasks.push(task);
        if (pingedTasks.length === 1) {
          scheduleWork(function() {
            return performWork(request);
          });
        }
      }
      function createSuspenseBoundary(request, fallbackAbortableTasks) {
        return {
          id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
          rootSegmentID: -1,
          parentFlushed: false,
          pendingTasks: 0,
          forceClientRender: false,
          completedSegments: [],
          byteSize: 0,
          fallbackAbortableTasks,
          errorDigest: null
        };
      }
      function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
        request.allPendingTasks++;
        if (blockedBoundary === null) {
          request.pendingRootTasks++;
        } else {
          blockedBoundary.pendingTasks++;
        }
        var task = {
          node,
          ping: function() {
            return pingTask(request, task);
          },
          blockedBoundary,
          blockedSegment,
          abortSet,
          legacyContext,
          context,
          treeContext
        };
        {
          task.componentStack = null;
        }
        abortSet.add(task);
        return task;
      }
      function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
        return {
          status: PENDING,
          id: -1,
          // lazily assigned later
          index,
          parentFlushed: false,
          chunks: [],
          children: [],
          formatContext,
          boundary,
          lastPushedText,
          textEmbedded
        };
      }
      var currentTaskInDEV = null;
      function getCurrentStackInDEV() {
        {
          if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
            return "";
          }
          return getStackByComponentStackNode(currentTaskInDEV.componentStack);
        }
      }
      function pushBuiltInComponentStackInDEV(task, type) {
        {
          task.componentStack = {
            tag: 0,
            parent: task.componentStack,
            type
          };
        }
      }
      function pushFunctionComponentStackInDEV(task, type) {
        {
          task.componentStack = {
            tag: 1,
            parent: task.componentStack,
            type
          };
        }
      }
      function pushClassComponentStackInDEV(task, type) {
        {
          task.componentStack = {
            tag: 2,
            parent: task.componentStack,
            type
          };
        }
      }
      function popComponentStackInDEV(task) {
        {
          if (task.componentStack === null) {
            error("Unexpectedly popped too many stack frames. This is a bug in React.");
          } else {
            task.componentStack = task.componentStack.parent;
          }
        }
      }
      var lastBoundaryErrorComponentStackDev = null;
      function captureBoundaryErrorDetailsDev(boundary, error2) {
        {
          var errorMessage;
          if (typeof error2 === "string") {
            errorMessage = error2;
          } else if (error2 && typeof error2.message === "string") {
            errorMessage = error2.message;
          } else {
            errorMessage = String(error2);
          }
          var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
          lastBoundaryErrorComponentStackDev = null;
          boundary.errorMessage = errorMessage;
          boundary.errorComponentStack = errorComponentStack;
        }
      }
      function logRecoverableError(request, error2) {
        var errorDigest = request.onError(error2);
        if (errorDigest != null && typeof errorDigest !== "string") {
          throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
        }
        return errorDigest;
      }
      function fatalError(request, error2) {
        var onShellError = request.onShellError;
        onShellError(error2);
        var onFatalError = request.onFatalError;
        onFatalError(error2);
        if (request.destination !== null) {
          request.status = CLOSED;
          closeWithError(request.destination, error2);
        } else {
          request.status = CLOSING;
          request.fatalError = error2;
        }
      }
      function renderSuspenseBoundary(request, task, props) {
        pushBuiltInComponentStackInDEV(task, "Suspense");
        var parentBoundary = task.blockedBoundary;
        var parentSegment = task.blockedSegment;
        var fallback = props.fallback;
        var content = props.children;
        var fallbackAbortSet = /* @__PURE__ */ new Set();
        var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
        var insertionIndex = parentSegment.chunks.length;
        var boundarySegment = createPendingSegment(
          request,
          insertionIndex,
          newBoundary,
          parentSegment.formatContext,
          // boundaries never require text embedding at their edges because comment nodes bound them
          false,
          false
        );
        parentSegment.children.push(boundarySegment);
        parentSegment.lastPushedText = false;
        var contentRootSegment = createPendingSegment(
          request,
          0,
          null,
          parentSegment.formatContext,
          // boundaries never require text embedding at their edges because comment nodes bound them
          false,
          false
        );
        contentRootSegment.parentFlushed = true;
        task.blockedBoundary = newBoundary;
        task.blockedSegment = contentRootSegment;
        try {
          renderNode(request, task, content);
          pushSegmentFinale$1(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
          contentRootSegment.status = COMPLETED;
          queueCompletedSegment(newBoundary, contentRootSegment);
          if (newBoundary.pendingTasks === 0) {
            popComponentStackInDEV(task);
            return;
          }
        } catch (error2) {
          contentRootSegment.status = ERRORED;
          newBoundary.forceClientRender = true;
          newBoundary.errorDigest = logRecoverableError(request, error2);
          {
            captureBoundaryErrorDetailsDev(newBoundary, error2);
          }
        } finally {
          task.blockedBoundary = parentBoundary;
          task.blockedSegment = parentSegment;
        }
        var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
        {
          suspendedFallbackTask.componentStack = task.componentStack;
        }
        request.pingedTasks.push(suspendedFallbackTask);
        popComponentStackInDEV(task);
      }
      function renderHostElement(request, task, type, props) {
        pushBuiltInComponentStackInDEV(task, type);
        var segment = task.blockedSegment;
        var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
        segment.lastPushedText = false;
        var prevContext = segment.formatContext;
        segment.formatContext = getChildFormatContext(prevContext, type, props);
        renderNode(request, task, children);
        segment.formatContext = prevContext;
        pushEndInstance(segment.chunks, type);
        segment.lastPushedText = false;
        popComponentStackInDEV(task);
      }
      function shouldConstruct$1(Component) {
        return Component.prototype && Component.prototype.isReactComponent;
      }
      function renderWithHooks(request, task, Component, props, secondArg) {
        var componentIdentity = {};
        prepareToUseHooks(task, componentIdentity);
        var result = Component(props, secondArg);
        return finishHooks(Component, props, result, secondArg);
      }
      function finishClassComponent(request, task, instance, Component, props) {
        var nextChildren = instance.render();
        {
          if (instance.props !== props) {
            if (!didWarnAboutReassigningProps) {
              error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
            }
            didWarnAboutReassigningProps = true;
          }
        }
        {
          var childContextTypes = Component.childContextTypes;
          if (childContextTypes !== null && childContextTypes !== void 0) {
            var previousContext = task.legacyContext;
            var mergedContext = processChildContext(instance, Component, previousContext, childContextTypes);
            task.legacyContext = mergedContext;
            renderNodeDestructive(request, task, nextChildren);
            task.legacyContext = previousContext;
            return;
          }
        }
        renderNodeDestructive(request, task, nextChildren);
      }
      function renderClassComponent(request, task, Component, props) {
        pushClassComponentStackInDEV(task, Component);
        var maskedContext = getMaskedContext(Component, task.legacyContext);
        var instance = constructClassInstance(Component, props, maskedContext);
        mountClassInstance(instance, Component, props, maskedContext);
        finishClassComponent(request, task, instance, Component, props);
        popComponentStackInDEV(task);
      }
      var didWarnAboutBadClass = {};
      var didWarnAboutModulePatternComponent = {};
      var didWarnAboutContextTypeOnFunctionComponent = {};
      var didWarnAboutGetDerivedStateOnFunctionComponent = {};
      var didWarnAboutReassigningProps = false;
      var didWarnAboutDefaultPropsOnFunctionComponent = {};
      var didWarnAboutGenerators = false;
      var didWarnAboutMaps = false;
      var hasWarnedAboutUsingContextAsConsumer = false;
      function renderIndeterminateComponent(request, task, Component, props) {
        var legacyContext;
        {
          legacyContext = getMaskedContext(Component, task.legacyContext);
        }
        pushFunctionComponentStackInDEV(task, Component);
        {
          if (Component.prototype && typeof Component.prototype.render === "function") {
            var componentName = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutBadClass[componentName]) {
              error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
              didWarnAboutBadClass[componentName] = true;
            }
          }
        }
        var value = renderWithHooks(request, task, Component, props, legacyContext);
        var hasId = checkDidRenderIdHook();
        {
          if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
            var _componentName = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutModulePatternComponent[_componentName]) {
              error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
              didWarnAboutModulePatternComponent[_componentName] = true;
            }
          }
        }
        if (
          // Run these checks in production only if the flag is off.
          // Eventually we'll delete this branch altogether.
          typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0
        ) {
          {
            var _componentName2 = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutModulePatternComponent[_componentName2]) {
              error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
              didWarnAboutModulePatternComponent[_componentName2] = true;
            }
          }
          mountClassInstance(value, Component, props, legacyContext);
          finishClassComponent(request, task, value, Component, props);
        } else {
          {
            validateFunctionComponentInDev(Component);
          }
          if (hasId) {
            var prevTreeContext = task.treeContext;
            var totalChildren = 1;
            var index = 0;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
            try {
              renderNodeDestructive(request, task, value);
            } finally {
              task.treeContext = prevTreeContext;
            }
          } else {
            renderNodeDestructive(request, task, value);
          }
        }
        popComponentStackInDEV(task);
      }
      function validateFunctionComponentInDev(Component) {
        {
          if (Component) {
            if (Component.childContextTypes) {
              error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
            }
          }
          if (Component.defaultProps !== void 0) {
            var componentName = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutDefaultPropsOnFunctionComponent[componentName]) {
              error("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", componentName);
              didWarnAboutDefaultPropsOnFunctionComponent[componentName] = true;
            }
          }
          if (typeof Component.getDerivedStateFromProps === "function") {
            var _componentName3 = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
              error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
              didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
            }
          }
          if (typeof Component.contextType === "object" && Component.contextType !== null) {
            var _componentName4 = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
              error("%s: Function components do not support contextType.", _componentName4);
              didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
            }
          }
        }
      }
      function resolveDefaultProps(Component, baseProps) {
        if (Component && Component.defaultProps) {
          var props = assign({}, baseProps);
          var defaultProps = Component.defaultProps;
          for (var propName in defaultProps) {
            if (props[propName] === void 0) {
              props[propName] = defaultProps[propName];
            }
          }
          return props;
        }
        return baseProps;
      }
      function renderForwardRef(request, task, type, props, ref) {
        pushFunctionComponentStackInDEV(task, type.render);
        var children = renderWithHooks(request, task, type.render, props, ref);
        var hasId = checkDidRenderIdHook();
        if (hasId) {
          var prevTreeContext = task.treeContext;
          var totalChildren = 1;
          var index = 0;
          task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
          try {
            renderNodeDestructive(request, task, children);
          } finally {
            task.treeContext = prevTreeContext;
          }
        } else {
          renderNodeDestructive(request, task, children);
        }
        popComponentStackInDEV(task);
      }
      function renderMemo(request, task, type, props, ref) {
        var innerType = type.type;
        var resolvedProps = resolveDefaultProps(innerType, props);
        renderElement(request, task, innerType, resolvedProps, ref);
      }
      function renderContextConsumer(request, task, context, props) {
        {
          if (context._context === void 0) {
            if (context !== context.Consumer) {
              if (!hasWarnedAboutUsingContextAsConsumer) {
                hasWarnedAboutUsingContextAsConsumer = true;
                error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
              }
            }
          } else {
            context = context._context;
          }
        }
        var render = props.children;
        {
          if (typeof render !== "function") {
            error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
          }
        }
        var newValue = readContext(context);
        var newChildren = render(newValue);
        renderNodeDestructive(request, task, newChildren);
      }
      function renderContextProvider(request, task, type, props) {
        var context = type._context;
        var value = props.value;
        var children = props.children;
        var prevSnapshot;
        {
          prevSnapshot = task.context;
        }
        task.context = pushProvider(context, value);
        renderNodeDestructive(request, task, children);
        task.context = popProvider(context);
        {
          if (prevSnapshot !== task.context) {
            error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
          }
        }
      }
      function renderLazyComponent(request, task, lazyComponent, props, ref) {
        pushBuiltInComponentStackInDEV(task, "Lazy");
        var payload = lazyComponent._payload;
        var init = lazyComponent._init;
        var Component = init(payload);
        var resolvedProps = resolveDefaultProps(Component, props);
        renderElement(request, task, Component, resolvedProps, ref);
        popComponentStackInDEV(task);
      }
      function renderElement(request, task, type, props, ref) {
        if (typeof type === "function") {
          if (shouldConstruct$1(type)) {
            renderClassComponent(request, task, type, props);
            return;
          } else {
            renderIndeterminateComponent(request, task, type, props);
            return;
          }
        }
        if (typeof type === "string") {
          renderHostElement(request, task, type, props);
          return;
        }
        switch (type) {
          // TODO: LegacyHidden acts the same as a fragment. This only works
          // because we currently assume that every instance of LegacyHidden is
          // accompanied by a host component wrapper. In the hidden mode, the host
          // component is given a `hidden` attribute, which ensures that the
          // initial HTML is not visible. To support the use of LegacyHidden as a
          // true fragment, without an extra DOM node, we would have to hide the
          // initial HTML in some other way.
          // TODO: Add REACT_OFFSCREEN_TYPE here too with the same capability.
          case REACT_LEGACY_HIDDEN_TYPE:
          case REACT_DEBUG_TRACING_MODE_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_FRAGMENT_TYPE: {
            renderNodeDestructive(request, task, props.children);
            return;
          }
          case REACT_SUSPENSE_LIST_TYPE: {
            pushBuiltInComponentStackInDEV(task, "SuspenseList");
            renderNodeDestructive(request, task, props.children);
            popComponentStackInDEV(task);
            return;
          }
          case REACT_SCOPE_TYPE: {
            throw new Error("ReactDOMServer does not yet support scope components.");
          }
          // eslint-disable-next-line-no-fallthrough
          case REACT_SUSPENSE_TYPE: {
            {
              renderSuspenseBoundary(request, task, props);
            }
            return;
          }
        }
        if (typeof type === "object" && type !== null) {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE: {
              renderForwardRef(request, task, type, props, ref);
              return;
            }
            case REACT_MEMO_TYPE: {
              renderMemo(request, task, type, props, ref);
              return;
            }
            case REACT_PROVIDER_TYPE: {
              renderContextProvider(request, task, type, props);
              return;
            }
            case REACT_CONTEXT_TYPE: {
              renderContextConsumer(request, task, type, props);
              return;
            }
            case REACT_LAZY_TYPE: {
              renderLazyComponent(request, task, type, props);
              return;
            }
          }
        }
        var info = "";
        {
          if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
            info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
          }
        }
        throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
      }
      function validateIterable(iterable, iteratorFn) {
        {
          if (typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
          iterable[Symbol.toStringTag] === "Generator") {
            if (!didWarnAboutGenerators) {
              error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
            }
            didWarnAboutGenerators = true;
          }
          if (iterable.entries === iteratorFn) {
            if (!didWarnAboutMaps) {
              error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
            }
            didWarnAboutMaps = true;
          }
        }
      }
      function renderNodeDestructive(request, task, node) {
        {
          try {
            return renderNodeDestructiveImpl(request, task, node);
          } catch (x2) {
            if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") ;
            else {
              lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
            }
            throw x2;
          }
        }
      }
      function renderNodeDestructiveImpl(request, task, node) {
        task.node = node;
        if (typeof node === "object" && node !== null) {
          switch (node.$$typeof) {
            case REACT_ELEMENT_TYPE: {
              var element = node;
              var type = element.type;
              var props = element.props;
              var ref = element.ref;
              renderElement(request, task, type, props, ref);
              return;
            }
            case REACT_PORTAL_TYPE:
              throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
            // eslint-disable-next-line-no-fallthrough
            case REACT_LAZY_TYPE: {
              var lazyNode = node;
              var payload = lazyNode._payload;
              var init = lazyNode._init;
              var resolvedNode;
              {
                try {
                  resolvedNode = init(payload);
                } catch (x2) {
                  if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") {
                    pushBuiltInComponentStackInDEV(task, "Lazy");
                  }
                  throw x2;
                }
              }
              renderNodeDestructive(request, task, resolvedNode);
              return;
            }
          }
          if (isArray(node)) {
            renderChildrenArray(request, task, node);
            return;
          }
          var iteratorFn = getIteratorFn(node);
          if (iteratorFn) {
            {
              validateIterable(node, iteratorFn);
            }
            var iterator = iteratorFn.call(node);
            if (iterator) {
              var step = iterator.next();
              if (!step.done) {
                var children = [];
                do {
                  children.push(step.value);
                  step = iterator.next();
                } while (!step.done);
                renderChildrenArray(request, task, children);
                return;
              }
              return;
            }
          }
          var childString = Object.prototype.toString.call(node);
          throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
        }
        if (typeof node === "string") {
          var segment = task.blockedSegment;
          segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
          return;
        }
        if (typeof node === "number") {
          var _segment = task.blockedSegment;
          _segment.lastPushedText = pushTextInstance$1(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
          return;
        }
        {
          if (typeof node === "function") {
            error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
          }
        }
      }
      function renderChildrenArray(request, task, children) {
        var totalChildren = children.length;
        for (var i = 0; i < totalChildren; i++) {
          var prevTreeContext = task.treeContext;
          task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
          try {
            renderNode(request, task, children[i]);
          } finally {
            task.treeContext = prevTreeContext;
          }
        }
      }
      function spawnNewSuspendedTask(request, task, x2) {
        var segment = task.blockedSegment;
        var insertionIndex = segment.chunks.length;
        var newSegment = createPendingSegment(
          request,
          insertionIndex,
          null,
          segment.formatContext,
          // Adopt the parent segment's leading text embed
          segment.lastPushedText,
          // Assume we are text embedded at the trailing edge
          true
        );
        segment.children.push(newSegment);
        segment.lastPushedText = false;
        var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
        {
          if (task.componentStack !== null) {
            newTask.componentStack = task.componentStack.parent;
          }
        }
        var ping = newTask.ping;
        x2.then(ping, ping);
      }
      function renderNode(request, task, node) {
        var previousFormatContext = task.blockedSegment.formatContext;
        var previousLegacyContext = task.legacyContext;
        var previousContext = task.context;
        var previousComponentStack = null;
        {
          previousComponentStack = task.componentStack;
        }
        try {
          return renderNodeDestructive(request, task, node);
        } catch (x2) {
          resetHooksState();
          if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") {
            spawnNewSuspendedTask(request, task, x2);
            task.blockedSegment.formatContext = previousFormatContext;
            task.legacyContext = previousLegacyContext;
            task.context = previousContext;
            switchContext(previousContext);
            {
              task.componentStack = previousComponentStack;
            }
            return;
          } else {
            task.blockedSegment.formatContext = previousFormatContext;
            task.legacyContext = previousLegacyContext;
            task.context = previousContext;
            switchContext(previousContext);
            {
              task.componentStack = previousComponentStack;
            }
            throw x2;
          }
        }
      }
      function erroredTask(request, boundary, segment, error2) {
        var errorDigest = logRecoverableError(request, error2);
        if (boundary === null) {
          fatalError(request, error2);
        } else {
          boundary.pendingTasks--;
          if (!boundary.forceClientRender) {
            boundary.forceClientRender = true;
            boundary.errorDigest = errorDigest;
            {
              captureBoundaryErrorDetailsDev(boundary, error2);
            }
            if (boundary.parentFlushed) {
              request.clientRenderedBoundaries.push(boundary);
            }
          }
        }
        request.allPendingTasks--;
        if (request.allPendingTasks === 0) {
          var onAllReady = request.onAllReady;
          onAllReady();
        }
      }
      function abortTaskSoft(task) {
        var request = this;
        var boundary = task.blockedBoundary;
        var segment = task.blockedSegment;
        segment.status = ABORTED;
        finishedTask(request, boundary, segment);
      }
      function abortTask(task, request, reason) {
        var boundary = task.blockedBoundary;
        var segment = task.blockedSegment;
        segment.status = ABORTED;
        if (boundary === null) {
          request.allPendingTasks--;
          if (request.status !== CLOSED) {
            request.status = CLOSED;
            if (request.destination !== null) {
              close(request.destination);
            }
          }
        } else {
          boundary.pendingTasks--;
          if (!boundary.forceClientRender) {
            boundary.forceClientRender = true;
            var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
            boundary.errorDigest = request.onError(_error);
            {
              var errorPrefix = "The server did not finish this Suspense boundary: ";
              if (_error && typeof _error.message === "string") {
                _error = errorPrefix + _error.message;
              } else {
                _error = errorPrefix + String(_error);
              }
              var previousTaskInDev = currentTaskInDEV;
              currentTaskInDEV = task;
              try {
                captureBoundaryErrorDetailsDev(boundary, _error);
              } finally {
                currentTaskInDEV = previousTaskInDev;
              }
            }
            if (boundary.parentFlushed) {
              request.clientRenderedBoundaries.push(boundary);
            }
          }
          boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
            return abortTask(fallbackTask, request, reason);
          });
          boundary.fallbackAbortableTasks.clear();
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
      }
      function queueCompletedSegment(boundary, segment) {
        if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
          var childSegment = segment.children[0];
          childSegment.id = segment.id;
          childSegment.parentFlushed = true;
          if (childSegment.status === COMPLETED) {
            queueCompletedSegment(boundary, childSegment);
          }
        } else {
          var completedSegments = boundary.completedSegments;
          completedSegments.push(segment);
        }
      }
      function finishedTask(request, boundary, segment) {
        if (boundary === null) {
          if (segment.parentFlushed) {
            if (request.completedRootSegment !== null) {
              throw new Error("There can only be one root segment. This is a bug in React.");
            }
            request.completedRootSegment = segment;
          }
          request.pendingRootTasks--;
          if (request.pendingRootTasks === 0) {
            request.onShellError = noop$1;
            var onShellReady = request.onShellReady;
            onShellReady();
          }
        } else {
          boundary.pendingTasks--;
          if (boundary.forceClientRender) ;
          else if (boundary.pendingTasks === 0) {
            if (segment.parentFlushed) {
              if (segment.status === COMPLETED) {
                queueCompletedSegment(boundary, segment);
              }
            }
            if (boundary.parentFlushed) {
              request.completedBoundaries.push(boundary);
            }
            boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
            boundary.fallbackAbortableTasks.clear();
          } else {
            if (segment.parentFlushed) {
              if (segment.status === COMPLETED) {
                queueCompletedSegment(boundary, segment);
                var completedSegments = boundary.completedSegments;
                if (completedSegments.length === 1) {
                  if (boundary.parentFlushed) {
                    request.partialBoundaries.push(boundary);
                  }
                }
              }
            }
          }
        }
        request.allPendingTasks--;
        if (request.allPendingTasks === 0) {
          var onAllReady = request.onAllReady;
          onAllReady();
        }
      }
      function retryTask(request, task) {
        var segment = task.blockedSegment;
        if (segment.status !== PENDING) {
          return;
        }
        switchContext(task.context);
        var prevTaskInDEV = null;
        {
          prevTaskInDEV = currentTaskInDEV;
          currentTaskInDEV = task;
        }
        try {
          renderNodeDestructive(request, task, task.node);
          pushSegmentFinale$1(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
          task.abortSet.delete(task);
          segment.status = COMPLETED;
          finishedTask(request, task.blockedBoundary, segment);
        } catch (x2) {
          resetHooksState();
          if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") {
            var ping = task.ping;
            x2.then(ping, ping);
          } else {
            task.abortSet.delete(task);
            segment.status = ERRORED;
            erroredTask(request, task.blockedBoundary, segment, x2);
          }
        } finally {
          {
            currentTaskInDEV = prevTaskInDEV;
          }
        }
      }
      function performWork(request) {
        if (request.status === CLOSED) {
          return;
        }
        var prevContext = getActiveContext();
        var prevDispatcher = ReactCurrentDispatcher$1.current;
        ReactCurrentDispatcher$1.current = Dispatcher;
        var prevGetCurrentStackImpl;
        {
          prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
          ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
        }
        var prevResponseState = currentResponseState;
        setCurrentResponseState(request.responseState);
        try {
          var pingedTasks = request.pingedTasks;
          var i;
          for (i = 0; i < pingedTasks.length; i++) {
            var task = pingedTasks[i];
            retryTask(request, task);
          }
          pingedTasks.splice(0, i);
          if (request.destination !== null) {
            flushCompletedQueues(request, request.destination);
          }
        } catch (error2) {
          logRecoverableError(request, error2);
          fatalError(request, error2);
        } finally {
          setCurrentResponseState(prevResponseState);
          ReactCurrentDispatcher$1.current = prevDispatcher;
          {
            ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
          }
          if (prevDispatcher === Dispatcher) {
            switchContext(prevContext);
          }
        }
      }
      function flushSubtree(request, destination, segment) {
        segment.parentFlushed = true;
        switch (segment.status) {
          case PENDING: {
            var segmentID = segment.id = request.nextSegmentId++;
            segment.lastPushedText = false;
            segment.textEmbedded = false;
            return writePlaceholder(destination, request.responseState, segmentID);
          }
          case COMPLETED: {
            segment.status = FLUSHED;
            var r = true;
            var chunks = segment.chunks;
            var chunkIdx = 0;
            var children = segment.children;
            for (var childIdx = 0; childIdx < children.length; childIdx++) {
              var nextChild = children[childIdx];
              for (; chunkIdx < nextChild.index; chunkIdx++) {
                writeChunk(destination, chunks[chunkIdx]);
              }
              r = flushSegment(request, destination, nextChild);
            }
            for (; chunkIdx < chunks.length - 1; chunkIdx++) {
              writeChunk(destination, chunks[chunkIdx]);
            }
            if (chunkIdx < chunks.length) {
              r = writeChunkAndReturn(destination, chunks[chunkIdx]);
            }
            return r;
          }
          default: {
            throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
          }
        }
      }
      function flushSegment(request, destination, segment) {
        var boundary = segment.boundary;
        if (boundary === null) {
          return flushSubtree(request, destination, segment);
        }
        boundary.parentFlushed = true;
        if (boundary.forceClientRender) {
          writeStartClientRenderedSuspenseBoundary$1(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
          flushSubtree(request, destination, segment);
          return writeEndClientRenderedSuspenseBoundary$1(destination, request.responseState);
        } else if (boundary.pendingTasks > 0) {
          boundary.rootSegmentID = request.nextSegmentId++;
          if (boundary.completedSegments.length > 0) {
            request.partialBoundaries.push(boundary);
          }
          var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
          writeStartPendingSuspenseBoundary(destination, request.responseState, id);
          flushSubtree(request, destination, segment);
          return writeEndPendingSuspenseBoundary(destination, request.responseState);
        } else if (boundary.byteSize > request.progressiveChunkSize) {
          boundary.rootSegmentID = request.nextSegmentId++;
          request.completedBoundaries.push(boundary);
          writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
          flushSubtree(request, destination, segment);
          return writeEndPendingSuspenseBoundary(destination, request.responseState);
        } else {
          writeStartCompletedSuspenseBoundary$1(destination, request.responseState);
          var completedSegments = boundary.completedSegments;
          if (completedSegments.length !== 1) {
            throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
          }
          var contentSegment = completedSegments[0];
          flushSegment(request, destination, contentSegment);
          return writeEndCompletedSuspenseBoundary$1(destination, request.responseState);
        }
      }
      function flushClientRenderedBoundary(request, destination, boundary) {
        return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
      }
      function flushSegmentContainer(request, destination, segment) {
        writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
        flushSegment(request, destination, segment);
        return writeEndSegment(destination, segment.formatContext);
      }
      function flushCompletedBoundary(request, destination, boundary) {
        var completedSegments = boundary.completedSegments;
        var i = 0;
        for (; i < completedSegments.length; i++) {
          var segment = completedSegments[i];
          flushPartiallyCompletedSegment(request, destination, boundary, segment);
        }
        completedSegments.length = 0;
        return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
      }
      function flushPartialBoundary(request, destination, boundary) {
        var completedSegments = boundary.completedSegments;
        var i = 0;
        for (; i < completedSegments.length; i++) {
          var segment = completedSegments[i];
          if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
            i++;
            completedSegments.splice(0, i);
            return false;
          }
        }
        completedSegments.splice(0, i);
        return true;
      }
      function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
        if (segment.status === FLUSHED) {
          return true;
        }
        var segmentID = segment.id;
        if (segmentID === -1) {
          var rootSegmentID = segment.id = boundary.rootSegmentID;
          if (rootSegmentID === -1) {
            throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
          }
          return flushSegmentContainer(request, destination, segment);
        } else {
          flushSegmentContainer(request, destination, segment);
          return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
        }
      }
      function flushCompletedQueues(request, destination) {
        try {
          var completedRootSegment = request.completedRootSegment;
          if (completedRootSegment !== null && request.pendingRootTasks === 0) {
            flushSegment(request, destination, completedRootSegment);
            request.completedRootSegment = null;
            writeCompletedRoot(destination, request.responseState);
          }
          var clientRenderedBoundaries = request.clientRenderedBoundaries;
          var i;
          for (i = 0; i < clientRenderedBoundaries.length; i++) {
            var boundary = clientRenderedBoundaries[i];
            if (!flushClientRenderedBoundary(request, destination, boundary)) {
              request.destination = null;
              i++;
              clientRenderedBoundaries.splice(0, i);
              return;
            }
          }
          clientRenderedBoundaries.splice(0, i);
          var completedBoundaries = request.completedBoundaries;
          for (i = 0; i < completedBoundaries.length; i++) {
            var _boundary = completedBoundaries[i];
            if (!flushCompletedBoundary(request, destination, _boundary)) {
              request.destination = null;
              i++;
              completedBoundaries.splice(0, i);
              return;
            }
          }
          completedBoundaries.splice(0, i);
          completeWriting(destination);
          beginWriting(destination);
          var partialBoundaries = request.partialBoundaries;
          for (i = 0; i < partialBoundaries.length; i++) {
            var _boundary2 = partialBoundaries[i];
            if (!flushPartialBoundary(request, destination, _boundary2)) {
              request.destination = null;
              i++;
              partialBoundaries.splice(0, i);
              return;
            }
          }
          partialBoundaries.splice(0, i);
          var largeBoundaries = request.completedBoundaries;
          for (i = 0; i < largeBoundaries.length; i++) {
            var _boundary3 = largeBoundaries[i];
            if (!flushCompletedBoundary(request, destination, _boundary3)) {
              request.destination = null;
              i++;
              largeBoundaries.splice(0, i);
              return;
            }
          }
          largeBoundaries.splice(0, i);
        } finally {
          if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
            {
              if (request.abortableTasks.size !== 0) {
                error("There was still abortable task at the root when we closed. This is a bug in React.");
              }
            }
            close(destination);
          }
        }
      }
      function startWork(request) {
        scheduleWork(function() {
          return performWork(request);
        });
      }
      function startFlowing(request, destination) {
        if (request.status === CLOSING) {
          request.status = CLOSED;
          closeWithError(destination, request.fatalError);
          return;
        }
        if (request.status === CLOSED) {
          return;
        }
        if (request.destination !== null) {
          return;
        }
        request.destination = destination;
        try {
          flushCompletedQueues(request, destination);
        } catch (error2) {
          logRecoverableError(request, error2);
          fatalError(request, error2);
        }
      }
      function abort(request, reason) {
        try {
          var abortableTasks = request.abortableTasks;
          abortableTasks.forEach(function(task) {
            return abortTask(task, request, reason);
          });
          abortableTasks.clear();
          if (request.destination !== null) {
            flushCompletedQueues(request, request.destination);
          }
        } catch (error2) {
          logRecoverableError(request, error2);
          fatalError(request, error2);
        }
      }
      function onError() {
      }
      function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
        var didFatal = false;
        var fatalError2 = null;
        var result = "";
        var destination = {
          push: function(chunk) {
            if (chunk !== null) {
              result += chunk;
            }
            return true;
          },
          destroy: function(error2) {
            didFatal = true;
            fatalError2 = error2;
          }
        };
        var readyToStream = false;
        function onShellReady() {
          readyToStream = true;
        }
        var request = createRequest(children, createResponseState$1(generateStaticMarkup, options ? options.identifierPrefix : void 0), createRootFormatContext(), Infinity, onError, void 0, onShellReady);
        startWork(request);
        abort(request, abortReason);
        startFlowing(request, destination);
        if (didFatal) {
          throw fatalError2;
        }
        if (!readyToStream) {
          throw new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
        }
        return result;
      }
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
      }
      var ReactMarkupReadableStream = /* @__PURE__ */ (function(_Readable) {
        _inheritsLoose(ReactMarkupReadableStream2, _Readable);
        function ReactMarkupReadableStream2() {
          var _this;
          _this = _Readable.call(this, {}) || this;
          _this.request = null;
          _this.startedFlowing = false;
          return _this;
        }
        var _proto = ReactMarkupReadableStream2.prototype;
        _proto._destroy = function _destroy(err, callback) {
          abort(this.request);
          callback(err);
        };
        _proto._read = function _read(size) {
          if (this.startedFlowing) {
            startFlowing(this.request, this);
          }
        };
        return ReactMarkupReadableStream2;
      })(stream.Readable);
      function onError$1() {
      }
      function renderToNodeStreamImpl(children, options, generateStaticMarkup) {
        function onAllReady() {
          destination.startedFlowing = true;
          startFlowing(request, destination);
        }
        var destination = new ReactMarkupReadableStream();
        var request = createRequest(children, createResponseState$1(false, options ? options.identifierPrefix : void 0), createRootFormatContext(), Infinity, onError$1, onAllReady, void 0);
        destination.request = request;
        startWork(request);
        return destination;
      }
      function renderToNodeStream(children, options) {
        {
          error("renderToNodeStream is deprecated. Use renderToPipeableStream instead.");
        }
        return renderToNodeStreamImpl(children, options);
      }
      function renderToStaticNodeStream(children, options) {
        {
          error("ReactDOMServer.renderToStaticNodeStream() is deprecated. Use ReactDOMServer.renderToPipeableStream() and wait to `pipe` until the `onAllReady` callback has been called instead.");
        }
        return renderToNodeStreamImpl(children, options);
      }
      function renderToString(children, options) {
        return renderToStringImpl(children, options, false, 'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server');
      }
      function renderToStaticMarkup(children, options) {
        return renderToStringImpl(children, options, true, 'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToPipeableStream" which supports Suspense on the server');
      }
      reactDomServerLegacy_node_development.renderToNodeStream = renderToNodeStream;
      reactDomServerLegacy_node_development.renderToStaticMarkup = renderToStaticMarkup;
      reactDomServerLegacy_node_development.renderToStaticNodeStream = renderToStaticNodeStream;
      reactDomServerLegacy_node_development.renderToString = renderToString;
      reactDomServerLegacy_node_development.version = ReactVersion;
    })();
  }
  return reactDomServerLegacy_node_development;
}
var reactDomServer_node_development = {};
var hasRequiredReactDomServer_node_development;
function requireReactDomServer_node_development() {
  if (hasRequiredReactDomServer_node_development) return reactDomServer_node_development;
  hasRequiredReactDomServer_node_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var React = requireReact();
      var util = require$$0;
      var ReactVersion = "18.3.1";
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function warn(format) {
        {
          {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            printWarning("warn", format, args);
          }
        }
      }
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      function scheduleWork(callback) {
        setImmediate(callback);
      }
      function flushBuffered(destination) {
        if (typeof destination.flush === "function") {
          destination.flush();
        }
      }
      var VIEW_SIZE = 2048;
      var currentView = null;
      var writtenBytes = 0;
      var destinationHasCapacity = true;
      function beginWriting(destination) {
        currentView = new Uint8Array(VIEW_SIZE);
        writtenBytes = 0;
        destinationHasCapacity = true;
      }
      function writeStringChunk(destination, stringChunk) {
        if (stringChunk.length === 0) {
          return;
        }
        if (stringChunk.length * 3 > VIEW_SIZE) {
          if (writtenBytes > 0) {
            writeToDestination(destination, currentView.subarray(0, writtenBytes));
            currentView = new Uint8Array(VIEW_SIZE);
            writtenBytes = 0;
          }
          writeToDestination(destination, textEncoder2.encode(stringChunk));
          return;
        }
        var target = currentView;
        if (writtenBytes > 0) {
          target = currentView.subarray(writtenBytes);
        }
        var _textEncoder$encodeIn = textEncoder2.encodeInto(stringChunk, target), read = _textEncoder$encodeIn.read, written = _textEncoder$encodeIn.written;
        writtenBytes += written;
        if (read < stringChunk.length) {
          writeToDestination(destination, currentView);
          currentView = new Uint8Array(VIEW_SIZE);
          writtenBytes = textEncoder2.encodeInto(stringChunk.slice(read), currentView).written;
        }
        if (writtenBytes === VIEW_SIZE) {
          writeToDestination(destination, currentView);
          currentView = new Uint8Array(VIEW_SIZE);
          writtenBytes = 0;
        }
      }
      function writeViewChunk(destination, chunk) {
        if (chunk.byteLength === 0) {
          return;
        }
        if (chunk.byteLength > VIEW_SIZE) {
          if (writtenBytes > 0) {
            writeToDestination(destination, currentView.subarray(0, writtenBytes));
            currentView = new Uint8Array(VIEW_SIZE);
            writtenBytes = 0;
          }
          writeToDestination(destination, chunk);
          return;
        }
        var bytesToWrite = chunk;
        var allowableBytes = currentView.length - writtenBytes;
        if (allowableBytes < bytesToWrite.byteLength) {
          if (allowableBytes === 0) {
            writeToDestination(destination, currentView);
          } else {
            currentView.set(bytesToWrite.subarray(0, allowableBytes), writtenBytes);
            writtenBytes += allowableBytes;
            writeToDestination(destination, currentView);
            bytesToWrite = bytesToWrite.subarray(allowableBytes);
          }
          currentView = new Uint8Array(VIEW_SIZE);
          writtenBytes = 0;
        }
        currentView.set(bytesToWrite, writtenBytes);
        writtenBytes += bytesToWrite.byteLength;
        if (writtenBytes === VIEW_SIZE) {
          writeToDestination(destination, currentView);
          currentView = new Uint8Array(VIEW_SIZE);
          writtenBytes = 0;
        }
      }
      function writeChunk(destination, chunk) {
        if (typeof chunk === "string") {
          writeStringChunk(destination, chunk);
        } else {
          writeViewChunk(destination, chunk);
        }
      }
      function writeToDestination(destination, view) {
        var currentHasCapacity = destination.write(view);
        destinationHasCapacity = destinationHasCapacity && currentHasCapacity;
      }
      function writeChunkAndReturn(destination, chunk) {
        writeChunk(destination, chunk);
        return destinationHasCapacity;
      }
      function completeWriting(destination) {
        if (currentView && writtenBytes > 0) {
          destination.write(currentView.subarray(0, writtenBytes));
        }
        currentView = null;
        writtenBytes = 0;
        destinationHasCapacity = true;
      }
      function close(destination) {
        destination.end();
      }
      var textEncoder2 = new util.TextEncoder();
      function stringToChunk(content) {
        return content;
      }
      function stringToPrecomputedChunk(content) {
        return textEncoder2.encode(content);
      }
      function closeWithError(destination, error2) {
        destination.destroy(error2);
      }
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkAttributeStringCoercion(value, attributeName) {
        {
          if (willCoercionThrow(value)) {
            error("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", attributeName, typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      function checkCSSPropertyStringCoercion(value, propName) {
        {
          if (willCoercionThrow(value)) {
            error("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", propName, typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      function checkHtmlStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var RESERVED = 0;
      var STRING = 1;
      var BOOLEANISH_STRING = 2;
      var BOOLEAN = 3;
      var OVERLOADED_BOOLEAN = 4;
      var NUMERIC = 5;
      var POSITIVE_NUMERIC = 6;
      var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
      var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
      var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
      var illegalAttributeNameCache = {};
      var validatedAttributeNameCache = {};
      function isAttributeNameSafe(attributeName) {
        if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
          return true;
        }
        if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
          return false;
        }
        if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
          validatedAttributeNameCache[attributeName] = true;
          return true;
        }
        illegalAttributeNameCache[attributeName] = true;
        {
          error("Invalid attribute name: `%s`", attributeName);
        }
        return false;
      }
      function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
        if (propertyInfo !== null && propertyInfo.type === RESERVED) {
          return false;
        }
        switch (typeof value) {
          case "function":
          // $FlowIssue symbol is perfectly valid here
          case "symbol":
            return true;
          case "boolean": {
            if (propertyInfo !== null) {
              return !propertyInfo.acceptsBooleans;
            } else {
              var prefix3 = name.toLowerCase().slice(0, 5);
              return prefix3 !== "data-" && prefix3 !== "aria-";
            }
          }
          default:
            return false;
        }
      }
      function getPropertyInfo(name) {
        return properties.hasOwnProperty(name) ? properties[name] : null;
      }
      function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL2, removeEmptyString) {
        this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
        this.attributeName = attributeName;
        this.attributeNamespace = attributeNamespace;
        this.mustUseProperty = mustUseProperty;
        this.propertyName = name;
        this.type = type;
        this.sanitizeURL = sanitizeURL2;
        this.removeEmptyString = removeEmptyString;
      }
      var properties = {};
      var reservedProps = [
        "children",
        "dangerouslySetInnerHTML",
        // TODO: This prevents the assignment of defaultValue to regular
        // elements (not just inputs). Now that ReactDOMInput assigns to the
        // defaultValue property -- do we need this?
        "defaultValue",
        "defaultChecked",
        "innerHTML",
        "suppressContentEditableWarning",
        "suppressHydrationWarning",
        "style"
      ];
      reservedProps.forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          RESERVED,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(_ref) {
        var name = _ref[0], attributeName = _ref[1];
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          false,
          // mustUseProperty
          name.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEANISH_STRING,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "allowFullScreen",
        "async",
        // Note: there is a special case that prevents it from being written to the DOM
        // on the client side because the browsers are inconsistent. Instead we call focus().
        "autoFocus",
        "autoPlay",
        "controls",
        "default",
        "defer",
        "disabled",
        "disablePictureInPicture",
        "disableRemotePlayback",
        "formNoValidate",
        "hidden",
        "loop",
        "noModule",
        "noValidate",
        "open",
        "playsInline",
        "readOnly",
        "required",
        "reversed",
        "scoped",
        "seamless",
        // Microdata
        "itemScope"
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          false,
          // mustUseProperty
          name.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "checked",
        // Note: `option.selected` is not updated if `select.multiple` is
        // disabled with `removeAttribute`. We have special logic for handling this.
        "multiple",
        "muted",
        "selected"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          BOOLEAN,
          true,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "capture",
        "download"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          OVERLOADED_BOOLEAN,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "cols",
        "rows",
        "size",
        "span"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          POSITIVE_NUMERIC,
          false,
          // mustUseProperty
          name,
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      ["rowSpan", "start"].forEach(function(name) {
        properties[name] = new PropertyInfoRecord(
          name,
          NUMERIC,
          false,
          // mustUseProperty
          name.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      var CAMELIZE = /[\-\:]([a-z])/g;
      var capitalize = function(token) {
        return token[1].toUpperCase();
      };
      [
        "accent-height",
        "alignment-baseline",
        "arabic-form",
        "baseline-shift",
        "cap-height",
        "clip-path",
        "clip-rule",
        "color-interpolation",
        "color-interpolation-filters",
        "color-profile",
        "color-rendering",
        "dominant-baseline",
        "enable-background",
        "fill-opacity",
        "fill-rule",
        "flood-color",
        "flood-opacity",
        "font-family",
        "font-size",
        "font-size-adjust",
        "font-stretch",
        "font-style",
        "font-variant",
        "font-weight",
        "glyph-name",
        "glyph-orientation-horizontal",
        "glyph-orientation-vertical",
        "horiz-adv-x",
        "horiz-origin-x",
        "image-rendering",
        "letter-spacing",
        "lighting-color",
        "marker-end",
        "marker-mid",
        "marker-start",
        "overline-position",
        "overline-thickness",
        "paint-order",
        "panose-1",
        "pointer-events",
        "rendering-intent",
        "shape-rendering",
        "stop-color",
        "stop-opacity",
        "strikethrough-position",
        "strikethrough-thickness",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "text-anchor",
        "text-decoration",
        "text-rendering",
        "underline-position",
        "underline-thickness",
        "unicode-bidi",
        "unicode-range",
        "units-per-em",
        "v-alphabetic",
        "v-hanging",
        "v-ideographic",
        "v-mathematical",
        "vector-effect",
        "vert-adv-y",
        "vert-origin-x",
        "vert-origin-y",
        "word-spacing",
        "writing-mode",
        "xmlns:xlink",
        "x-height"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      [
        "xlink:actuate",
        "xlink:arcrole",
        "xlink:role",
        "xlink:show",
        "xlink:title",
        "xlink:type"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          "http://www.w3.org/1999/xlink",
          false,
          // sanitizeURL
          false
        );
      });
      [
        "xml:base",
        "xml:lang",
        "xml:space"
        // NOTE: if you add a camelCased prop to this list,
        // you'll need to set attributeName to name.toLowerCase()
        // instead in the assignment below.
      ].forEach(function(attributeName) {
        var name = attributeName.replace(CAMELIZE, capitalize);
        properties[name] = new PropertyInfoRecord(
          name,
          STRING,
          false,
          // mustUseProperty
          attributeName,
          "http://www.w3.org/XML/1998/namespace",
          false,
          // sanitizeURL
          false
        );
      });
      ["tabIndex", "crossOrigin"].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(
          attributeName,
          STRING,
          false,
          // mustUseProperty
          attributeName.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          false,
          // sanitizeURL
          false
        );
      });
      var xlinkHref = "xlinkHref";
      properties[xlinkHref] = new PropertyInfoRecord(
        "xlinkHref",
        STRING,
        false,
        // mustUseProperty
        "xlink:href",
        "http://www.w3.org/1999/xlink",
        true,
        // sanitizeURL
        false
      );
      ["src", "href", "action", "formAction"].forEach(function(attributeName) {
        properties[attributeName] = new PropertyInfoRecord(
          attributeName,
          STRING,
          false,
          // mustUseProperty
          attributeName.toLowerCase(),
          // attributeName
          null,
          // attributeNamespace
          true,
          // sanitizeURL
          true
        );
      });
      var isUnitlessNumber = {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridArea: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        // SVG-related properties
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };
      function prefixKey(prefix3, key) {
        return prefix3 + key.charAt(0).toUpperCase() + key.substring(1);
      }
      var prefixes = ["Webkit", "ms", "Moz", "O"];
      Object.keys(isUnitlessNumber).forEach(function(prop) {
        prefixes.forEach(function(prefix3) {
          isUnitlessNumber[prefixKey(prefix3, prop)] = isUnitlessNumber[prop];
        });
      });
      var hasReadOnlyValue = {
        button: true,
        checkbox: true,
        image: true,
        hidden: true,
        radio: true,
        reset: true,
        submit: true
      };
      function checkControlledValueProps(tagName, props) {
        {
          if (!(hasReadOnlyValue[props.type] || props.onChange || props.onInput || props.readOnly || props.disabled || props.value == null)) {
            error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
          }
          if (!(props.onChange || props.readOnly || props.disabled || props.checked == null)) {
            error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
          }
        }
      }
      function isCustomComponent(tagName, props) {
        if (tagName.indexOf("-") === -1) {
          return typeof props.is === "string";
        }
        switch (tagName) {
          // These are reserved SVG and MathML elements.
          // We don't mind this list too much because we expect it to never grow.
          // The alternative is to track the namespace in a few places which is convoluted.
          // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return false;
          default:
            return true;
        }
      }
      var ariaProperties = {
        "aria-current": 0,
        // state
        "aria-description": 0,
        "aria-details": 0,
        "aria-disabled": 0,
        // state
        "aria-hidden": 0,
        // state
        "aria-invalid": 0,
        // state
        "aria-keyshortcuts": 0,
        "aria-label": 0,
        "aria-roledescription": 0,
        // Widget Attributes
        "aria-autocomplete": 0,
        "aria-checked": 0,
        "aria-expanded": 0,
        "aria-haspopup": 0,
        "aria-level": 0,
        "aria-modal": 0,
        "aria-multiline": 0,
        "aria-multiselectable": 0,
        "aria-orientation": 0,
        "aria-placeholder": 0,
        "aria-pressed": 0,
        "aria-readonly": 0,
        "aria-required": 0,
        "aria-selected": 0,
        "aria-sort": 0,
        "aria-valuemax": 0,
        "aria-valuemin": 0,
        "aria-valuenow": 0,
        "aria-valuetext": 0,
        // Live Region Attributes
        "aria-atomic": 0,
        "aria-busy": 0,
        "aria-live": 0,
        "aria-relevant": 0,
        // Drag-and-Drop Attributes
        "aria-dropeffect": 0,
        "aria-grabbed": 0,
        // Relationship Attributes
        "aria-activedescendant": 0,
        "aria-colcount": 0,
        "aria-colindex": 0,
        "aria-colspan": 0,
        "aria-controls": 0,
        "aria-describedby": 0,
        "aria-errormessage": 0,
        "aria-flowto": 0,
        "aria-labelledby": 0,
        "aria-owns": 0,
        "aria-posinset": 0,
        "aria-rowcount": 0,
        "aria-rowindex": 0,
        "aria-rowspan": 0,
        "aria-setsize": 0
      };
      var warnedProperties = {};
      var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
      var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
      function validateProperty(tagName, name) {
        {
          if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
            return true;
          }
          if (rARIACamel.test(name)) {
            var ariaName = "aria-" + name.slice(4).toLowerCase();
            var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
            if (correctName == null) {
              error("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
              warnedProperties[name] = true;
              return true;
            }
            if (name !== correctName) {
              error("Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
              warnedProperties[name] = true;
              return true;
            }
          }
          if (rARIA.test(name)) {
            var lowerCasedName = name.toLowerCase();
            var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
            if (standardName == null) {
              warnedProperties[name] = true;
              return false;
            }
            if (name !== standardName) {
              error("Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
              warnedProperties[name] = true;
              return true;
            }
          }
        }
        return true;
      }
      function warnInvalidARIAProps(type, props) {
        {
          var invalidProps = [];
          for (var key in props) {
            var isValid = validateProperty(type, key);
            if (!isValid) {
              invalidProps.push(key);
            }
          }
          var unknownPropString = invalidProps.map(function(prop) {
            return "`" + prop + "`";
          }).join(", ");
          if (invalidProps.length === 1) {
            error("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
          } else if (invalidProps.length > 1) {
            error("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", unknownPropString, type);
          }
        }
      }
      function validateProperties(type, props) {
        if (isCustomComponent(type, props)) {
          return;
        }
        warnInvalidARIAProps(type, props);
      }
      var didWarnValueNull = false;
      function validateProperties$1(type, props) {
        {
          if (type !== "input" && type !== "textarea" && type !== "select") {
            return;
          }
          if (props != null && props.value === null && !didWarnValueNull) {
            didWarnValueNull = true;
            if (type === "select" && props.multiple) {
              error("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
            } else {
              error("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
            }
          }
        }
      }
      var possibleStandardNames = {
        // HTML
        accept: "accept",
        acceptcharset: "acceptCharset",
        "accept-charset": "acceptCharset",
        accesskey: "accessKey",
        action: "action",
        allowfullscreen: "allowFullScreen",
        alt: "alt",
        as: "as",
        async: "async",
        autocapitalize: "autoCapitalize",
        autocomplete: "autoComplete",
        autocorrect: "autoCorrect",
        autofocus: "autoFocus",
        autoplay: "autoPlay",
        autosave: "autoSave",
        capture: "capture",
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        challenge: "challenge",
        charset: "charSet",
        checked: "checked",
        children: "children",
        cite: "cite",
        class: "className",
        classid: "classID",
        classname: "className",
        cols: "cols",
        colspan: "colSpan",
        content: "content",
        contenteditable: "contentEditable",
        contextmenu: "contextMenu",
        controls: "controls",
        controlslist: "controlsList",
        coords: "coords",
        crossorigin: "crossOrigin",
        dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
        data: "data",
        datetime: "dateTime",
        default: "default",
        defaultchecked: "defaultChecked",
        defaultvalue: "defaultValue",
        defer: "defer",
        dir: "dir",
        disabled: "disabled",
        disablepictureinpicture: "disablePictureInPicture",
        disableremoteplayback: "disableRemotePlayback",
        download: "download",
        draggable: "draggable",
        enctype: "encType",
        enterkeyhint: "enterKeyHint",
        for: "htmlFor",
        form: "form",
        formmethod: "formMethod",
        formaction: "formAction",
        formenctype: "formEncType",
        formnovalidate: "formNoValidate",
        formtarget: "formTarget",
        frameborder: "frameBorder",
        headers: "headers",
        height: "height",
        hidden: "hidden",
        high: "high",
        href: "href",
        hreflang: "hrefLang",
        htmlfor: "htmlFor",
        httpequiv: "httpEquiv",
        "http-equiv": "httpEquiv",
        icon: "icon",
        id: "id",
        imagesizes: "imageSizes",
        imagesrcset: "imageSrcSet",
        innerhtml: "innerHTML",
        inputmode: "inputMode",
        integrity: "integrity",
        is: "is",
        itemid: "itemID",
        itemprop: "itemProp",
        itemref: "itemRef",
        itemscope: "itemScope",
        itemtype: "itemType",
        keyparams: "keyParams",
        keytype: "keyType",
        kind: "kind",
        label: "label",
        lang: "lang",
        list: "list",
        loop: "loop",
        low: "low",
        manifest: "manifest",
        marginwidth: "marginWidth",
        marginheight: "marginHeight",
        max: "max",
        maxlength: "maxLength",
        media: "media",
        mediagroup: "mediaGroup",
        method: "method",
        min: "min",
        minlength: "minLength",
        multiple: "multiple",
        muted: "muted",
        name: "name",
        nomodule: "noModule",
        nonce: "nonce",
        novalidate: "noValidate",
        open: "open",
        optimum: "optimum",
        pattern: "pattern",
        placeholder: "placeholder",
        playsinline: "playsInline",
        poster: "poster",
        preload: "preload",
        profile: "profile",
        radiogroup: "radioGroup",
        readonly: "readOnly",
        referrerpolicy: "referrerPolicy",
        rel: "rel",
        required: "required",
        reversed: "reversed",
        role: "role",
        rows: "rows",
        rowspan: "rowSpan",
        sandbox: "sandbox",
        scope: "scope",
        scoped: "scoped",
        scrolling: "scrolling",
        seamless: "seamless",
        selected: "selected",
        shape: "shape",
        size: "size",
        sizes: "sizes",
        span: "span",
        spellcheck: "spellCheck",
        src: "src",
        srcdoc: "srcDoc",
        srclang: "srcLang",
        srcset: "srcSet",
        start: "start",
        step: "step",
        style: "style",
        summary: "summary",
        tabindex: "tabIndex",
        target: "target",
        title: "title",
        type: "type",
        usemap: "useMap",
        value: "value",
        width: "width",
        wmode: "wmode",
        wrap: "wrap",
        // SVG
        about: "about",
        accentheight: "accentHeight",
        "accent-height": "accentHeight",
        accumulate: "accumulate",
        additive: "additive",
        alignmentbaseline: "alignmentBaseline",
        "alignment-baseline": "alignmentBaseline",
        allowreorder: "allowReorder",
        alphabetic: "alphabetic",
        amplitude: "amplitude",
        arabicform: "arabicForm",
        "arabic-form": "arabicForm",
        ascent: "ascent",
        attributename: "attributeName",
        attributetype: "attributeType",
        autoreverse: "autoReverse",
        azimuth: "azimuth",
        basefrequency: "baseFrequency",
        baselineshift: "baselineShift",
        "baseline-shift": "baselineShift",
        baseprofile: "baseProfile",
        bbox: "bbox",
        begin: "begin",
        bias: "bias",
        by: "by",
        calcmode: "calcMode",
        capheight: "capHeight",
        "cap-height": "capHeight",
        clip: "clip",
        clippath: "clipPath",
        "clip-path": "clipPath",
        clippathunits: "clipPathUnits",
        cliprule: "clipRule",
        "clip-rule": "clipRule",
        color: "color",
        colorinterpolation: "colorInterpolation",
        "color-interpolation": "colorInterpolation",
        colorinterpolationfilters: "colorInterpolationFilters",
        "color-interpolation-filters": "colorInterpolationFilters",
        colorprofile: "colorProfile",
        "color-profile": "colorProfile",
        colorrendering: "colorRendering",
        "color-rendering": "colorRendering",
        contentscripttype: "contentScriptType",
        contentstyletype: "contentStyleType",
        cursor: "cursor",
        cx: "cx",
        cy: "cy",
        d: "d",
        datatype: "datatype",
        decelerate: "decelerate",
        descent: "descent",
        diffuseconstant: "diffuseConstant",
        direction: "direction",
        display: "display",
        divisor: "divisor",
        dominantbaseline: "dominantBaseline",
        "dominant-baseline": "dominantBaseline",
        dur: "dur",
        dx: "dx",
        dy: "dy",
        edgemode: "edgeMode",
        elevation: "elevation",
        enablebackground: "enableBackground",
        "enable-background": "enableBackground",
        end: "end",
        exponent: "exponent",
        externalresourcesrequired: "externalResourcesRequired",
        fill: "fill",
        fillopacity: "fillOpacity",
        "fill-opacity": "fillOpacity",
        fillrule: "fillRule",
        "fill-rule": "fillRule",
        filter: "filter",
        filterres: "filterRes",
        filterunits: "filterUnits",
        floodopacity: "floodOpacity",
        "flood-opacity": "floodOpacity",
        floodcolor: "floodColor",
        "flood-color": "floodColor",
        focusable: "focusable",
        fontfamily: "fontFamily",
        "font-family": "fontFamily",
        fontsize: "fontSize",
        "font-size": "fontSize",
        fontsizeadjust: "fontSizeAdjust",
        "font-size-adjust": "fontSizeAdjust",
        fontstretch: "fontStretch",
        "font-stretch": "fontStretch",
        fontstyle: "fontStyle",
        "font-style": "fontStyle",
        fontvariant: "fontVariant",
        "font-variant": "fontVariant",
        fontweight: "fontWeight",
        "font-weight": "fontWeight",
        format: "format",
        from: "from",
        fx: "fx",
        fy: "fy",
        g1: "g1",
        g2: "g2",
        glyphname: "glyphName",
        "glyph-name": "glyphName",
        glyphorientationhorizontal: "glyphOrientationHorizontal",
        "glyph-orientation-horizontal": "glyphOrientationHorizontal",
        glyphorientationvertical: "glyphOrientationVertical",
        "glyph-orientation-vertical": "glyphOrientationVertical",
        glyphref: "glyphRef",
        gradienttransform: "gradientTransform",
        gradientunits: "gradientUnits",
        hanging: "hanging",
        horizadvx: "horizAdvX",
        "horiz-adv-x": "horizAdvX",
        horizoriginx: "horizOriginX",
        "horiz-origin-x": "horizOriginX",
        ideographic: "ideographic",
        imagerendering: "imageRendering",
        "image-rendering": "imageRendering",
        in2: "in2",
        in: "in",
        inlist: "inlist",
        intercept: "intercept",
        k1: "k1",
        k2: "k2",
        k3: "k3",
        k4: "k4",
        k: "k",
        kernelmatrix: "kernelMatrix",
        kernelunitlength: "kernelUnitLength",
        kerning: "kerning",
        keypoints: "keyPoints",
        keysplines: "keySplines",
        keytimes: "keyTimes",
        lengthadjust: "lengthAdjust",
        letterspacing: "letterSpacing",
        "letter-spacing": "letterSpacing",
        lightingcolor: "lightingColor",
        "lighting-color": "lightingColor",
        limitingconeangle: "limitingConeAngle",
        local: "local",
        markerend: "markerEnd",
        "marker-end": "markerEnd",
        markerheight: "markerHeight",
        markermid: "markerMid",
        "marker-mid": "markerMid",
        markerstart: "markerStart",
        "marker-start": "markerStart",
        markerunits: "markerUnits",
        markerwidth: "markerWidth",
        mask: "mask",
        maskcontentunits: "maskContentUnits",
        maskunits: "maskUnits",
        mathematical: "mathematical",
        mode: "mode",
        numoctaves: "numOctaves",
        offset: "offset",
        opacity: "opacity",
        operator: "operator",
        order: "order",
        orient: "orient",
        orientation: "orientation",
        origin: "origin",
        overflow: "overflow",
        overlineposition: "overlinePosition",
        "overline-position": "overlinePosition",
        overlinethickness: "overlineThickness",
        "overline-thickness": "overlineThickness",
        paintorder: "paintOrder",
        "paint-order": "paintOrder",
        panose1: "panose1",
        "panose-1": "panose1",
        pathlength: "pathLength",
        patterncontentunits: "patternContentUnits",
        patterntransform: "patternTransform",
        patternunits: "patternUnits",
        pointerevents: "pointerEvents",
        "pointer-events": "pointerEvents",
        points: "points",
        pointsatx: "pointsAtX",
        pointsaty: "pointsAtY",
        pointsatz: "pointsAtZ",
        prefix: "prefix",
        preservealpha: "preserveAlpha",
        preserveaspectratio: "preserveAspectRatio",
        primitiveunits: "primitiveUnits",
        property: "property",
        r: "r",
        radius: "radius",
        refx: "refX",
        refy: "refY",
        renderingintent: "renderingIntent",
        "rendering-intent": "renderingIntent",
        repeatcount: "repeatCount",
        repeatdur: "repeatDur",
        requiredextensions: "requiredExtensions",
        requiredfeatures: "requiredFeatures",
        resource: "resource",
        restart: "restart",
        result: "result",
        results: "results",
        rotate: "rotate",
        rx: "rx",
        ry: "ry",
        scale: "scale",
        security: "security",
        seed: "seed",
        shaperendering: "shapeRendering",
        "shape-rendering": "shapeRendering",
        slope: "slope",
        spacing: "spacing",
        specularconstant: "specularConstant",
        specularexponent: "specularExponent",
        speed: "speed",
        spreadmethod: "spreadMethod",
        startoffset: "startOffset",
        stddeviation: "stdDeviation",
        stemh: "stemh",
        stemv: "stemv",
        stitchtiles: "stitchTiles",
        stopcolor: "stopColor",
        "stop-color": "stopColor",
        stopopacity: "stopOpacity",
        "stop-opacity": "stopOpacity",
        strikethroughposition: "strikethroughPosition",
        "strikethrough-position": "strikethroughPosition",
        strikethroughthickness: "strikethroughThickness",
        "strikethrough-thickness": "strikethroughThickness",
        string: "string",
        stroke: "stroke",
        strokedasharray: "strokeDasharray",
        "stroke-dasharray": "strokeDasharray",
        strokedashoffset: "strokeDashoffset",
        "stroke-dashoffset": "strokeDashoffset",
        strokelinecap: "strokeLinecap",
        "stroke-linecap": "strokeLinecap",
        strokelinejoin: "strokeLinejoin",
        "stroke-linejoin": "strokeLinejoin",
        strokemiterlimit: "strokeMiterlimit",
        "stroke-miterlimit": "strokeMiterlimit",
        strokewidth: "strokeWidth",
        "stroke-width": "strokeWidth",
        strokeopacity: "strokeOpacity",
        "stroke-opacity": "strokeOpacity",
        suppresscontenteditablewarning: "suppressContentEditableWarning",
        suppresshydrationwarning: "suppressHydrationWarning",
        surfacescale: "surfaceScale",
        systemlanguage: "systemLanguage",
        tablevalues: "tableValues",
        targetx: "targetX",
        targety: "targetY",
        textanchor: "textAnchor",
        "text-anchor": "textAnchor",
        textdecoration: "textDecoration",
        "text-decoration": "textDecoration",
        textlength: "textLength",
        textrendering: "textRendering",
        "text-rendering": "textRendering",
        to: "to",
        transform: "transform",
        typeof: "typeof",
        u1: "u1",
        u2: "u2",
        underlineposition: "underlinePosition",
        "underline-position": "underlinePosition",
        underlinethickness: "underlineThickness",
        "underline-thickness": "underlineThickness",
        unicode: "unicode",
        unicodebidi: "unicodeBidi",
        "unicode-bidi": "unicodeBidi",
        unicoderange: "unicodeRange",
        "unicode-range": "unicodeRange",
        unitsperem: "unitsPerEm",
        "units-per-em": "unitsPerEm",
        unselectable: "unselectable",
        valphabetic: "vAlphabetic",
        "v-alphabetic": "vAlphabetic",
        values: "values",
        vectoreffect: "vectorEffect",
        "vector-effect": "vectorEffect",
        version: "version",
        vertadvy: "vertAdvY",
        "vert-adv-y": "vertAdvY",
        vertoriginx: "vertOriginX",
        "vert-origin-x": "vertOriginX",
        vertoriginy: "vertOriginY",
        "vert-origin-y": "vertOriginY",
        vhanging: "vHanging",
        "v-hanging": "vHanging",
        videographic: "vIdeographic",
        "v-ideographic": "vIdeographic",
        viewbox: "viewBox",
        viewtarget: "viewTarget",
        visibility: "visibility",
        vmathematical: "vMathematical",
        "v-mathematical": "vMathematical",
        vocab: "vocab",
        widths: "widths",
        wordspacing: "wordSpacing",
        "word-spacing": "wordSpacing",
        writingmode: "writingMode",
        "writing-mode": "writingMode",
        x1: "x1",
        x2: "x2",
        x: "x",
        xchannelselector: "xChannelSelector",
        xheight: "xHeight",
        "x-height": "xHeight",
        xlinkactuate: "xlinkActuate",
        "xlink:actuate": "xlinkActuate",
        xlinkarcrole: "xlinkArcrole",
        "xlink:arcrole": "xlinkArcrole",
        xlinkhref: "xlinkHref",
        "xlink:href": "xlinkHref",
        xlinkrole: "xlinkRole",
        "xlink:role": "xlinkRole",
        xlinkshow: "xlinkShow",
        "xlink:show": "xlinkShow",
        xlinktitle: "xlinkTitle",
        "xlink:title": "xlinkTitle",
        xlinktype: "xlinkType",
        "xlink:type": "xlinkType",
        xmlbase: "xmlBase",
        "xml:base": "xmlBase",
        xmllang: "xmlLang",
        "xml:lang": "xmlLang",
        xmlns: "xmlns",
        "xml:space": "xmlSpace",
        xmlnsxlink: "xmlnsXlink",
        "xmlns:xlink": "xmlnsXlink",
        xmlspace: "xmlSpace",
        y1: "y1",
        y2: "y2",
        y: "y",
        ychannelselector: "yChannelSelector",
        z: "z",
        zoomandpan: "zoomAndPan"
      };
      var validateProperty$1 = function() {
      };
      {
        var warnedProperties$1 = {};
        var EVENT_NAME_REGEX = /^on./;
        var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
        var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
        var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
        validateProperty$1 = function(tagName, name, value, eventRegistry) {
          if (hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
            return true;
          }
          var lowerCasedName = name.toLowerCase();
          if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
            error("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
            warnedProperties$1[name] = true;
            return true;
          }
          if (eventRegistry != null) {
            var registrationNameDependencies = eventRegistry.registrationNameDependencies, possibleRegistrationNames = eventRegistry.possibleRegistrationNames;
            if (registrationNameDependencies.hasOwnProperty(name)) {
              return true;
            }
            var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
            if (registrationName != null) {
              error("Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
              warnedProperties$1[name] = true;
              return true;
            }
            if (EVENT_NAME_REGEX.test(name)) {
              error("Unknown event handler property `%s`. It will be ignored.", name);
              warnedProperties$1[name] = true;
              return true;
            }
          } else if (EVENT_NAME_REGEX.test(name)) {
            if (INVALID_EVENT_NAME_REGEX.test(name)) {
              error("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
            }
            warnedProperties$1[name] = true;
            return true;
          }
          if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
            return true;
          }
          if (lowerCasedName === "innerhtml") {
            error("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName === "aria") {
            error("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
            error("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
            warnedProperties$1[name] = true;
            return true;
          }
          if (typeof value === "number" && isNaN(value)) {
            error("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
            warnedProperties$1[name] = true;
            return true;
          }
          var propertyInfo = getPropertyInfo(name);
          var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
          if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
            var standardName = possibleStandardNames[lowerCasedName];
            if (standardName !== name) {
              error("Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
              warnedProperties$1[name] = true;
              return true;
            }
          } else if (!isReserved && name !== lowerCasedName) {
            error("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
            warnedProperties$1[name] = true;
            return true;
          }
          if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo)) {
            if (value) {
              error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
            } else {
              error('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
            }
            warnedProperties$1[name] = true;
            return true;
          }
          if (isReserved) {
            return true;
          }
          if (shouldRemoveAttributeWithWarning(name, value, propertyInfo)) {
            warnedProperties$1[name] = true;
            return false;
          }
          if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
            error("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
            warnedProperties$1[name] = true;
            return true;
          }
          return true;
        };
      }
      var warnUnknownProperties = function(type, props, eventRegistry) {
        {
          var unknownProps = [];
          for (var key in props) {
            var isValid = validateProperty$1(type, key, props[key], eventRegistry);
            if (!isValid) {
              unknownProps.push(key);
            }
          }
          var unknownPropString = unknownProps.map(function(prop) {
            return "`" + prop + "`";
          }).join(", ");
          if (unknownProps.length === 1) {
            error("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
          } else if (unknownProps.length > 1) {
            error("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", unknownPropString, type);
          }
        }
      };
      function validateProperties$2(type, props, eventRegistry) {
        if (isCustomComponent(type, props)) {
          return;
        }
        warnUnknownProperties(type, props, eventRegistry);
      }
      var warnValidStyle = function() {
      };
      {
        var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
        var msPattern = /^-ms-/;
        var hyphenPattern = /-(.)/g;
        var badStyleValueWithSemicolonPattern = /;\s*$/;
        var warnedStyleNames = {};
        var warnedStyleValues = {};
        var warnedForNaNValue = false;
        var warnedForInfinityValue = false;
        var camelize = function(string) {
          return string.replace(hyphenPattern, function(_2, character) {
            return character.toUpperCase();
          });
        };
        var warnHyphenatedStyleName = function(name) {
          if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
            return;
          }
          warnedStyleNames[name] = true;
          error(
            "Unsupported style property %s. Did you mean %s?",
            name,
            // As Andi Smith suggests
            // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
            // is converted to lowercase `ms`.
            camelize(name.replace(msPattern, "ms-"))
          );
        };
        var warnBadVendoredStyleName = function(name) {
          if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
            return;
          }
          warnedStyleNames[name] = true;
          error("Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
        };
        var warnStyleValueWithSemicolon = function(name, value) {
          if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
            return;
          }
          warnedStyleValues[value] = true;
          error(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
        };
        var warnStyleValueIsNaN = function(name, value) {
          if (warnedForNaNValue) {
            return;
          }
          warnedForNaNValue = true;
          error("`NaN` is an invalid value for the `%s` css style property.", name);
        };
        var warnStyleValueIsInfinity = function(name, value) {
          if (warnedForInfinityValue) {
            return;
          }
          warnedForInfinityValue = true;
          error("`Infinity` is an invalid value for the `%s` css style property.", name);
        };
        warnValidStyle = function(name, value) {
          if (name.indexOf("-") > -1) {
            warnHyphenatedStyleName(name);
          } else if (badVendoredStyleNamePattern.test(name)) {
            warnBadVendoredStyleName(name);
          } else if (badStyleValueWithSemicolonPattern.test(value)) {
            warnStyleValueWithSemicolon(name, value);
          }
          if (typeof value === "number") {
            if (isNaN(value)) {
              warnStyleValueIsNaN(name, value);
            } else if (!isFinite(value)) {
              warnStyleValueIsInfinity(name, value);
            }
          }
        };
      }
      var warnValidStyle$1 = warnValidStyle;
      var matchHtmlRegExp = /["'&<>]/;
      function escapeHtml(string) {
        {
          checkHtmlStringCoercion(string);
        }
        var str = "" + string;
        var match = matchHtmlRegExp.exec(str);
        if (!match) {
          return str;
        }
        var escape;
        var html = "";
        var index;
        var lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escape = "&quot;";
              break;
            case 38:
              escape = "&amp;";
              break;
            case 39:
              escape = "&#x27;";
              break;
            case 60:
              escape = "&lt;";
              break;
            case 62:
              escape = "&gt;";
              break;
            default:
              continue;
          }
          if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
          }
          lastIndex = index + 1;
          html += escape;
        }
        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      }
      function escapeTextForBrowser(text) {
        if (typeof text === "boolean" || typeof text === "number") {
          return "" + text;
        }
        return escapeHtml(text);
      }
      var uppercasePattern = /([A-Z])/g;
      var msPattern$1 = /^ms-/;
      function hyphenateStyleName(name) {
        return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern$1, "-ms-");
      }
      var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;
      var didWarn = false;
      function sanitizeURL(url) {
        {
          if (!didWarn && isJavaScriptProtocol.test(url)) {
            didWarn = true;
            error("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(url));
          }
        }
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      var startInlineScript = stringToPrecomputedChunk("<script>");
      var endInlineScript = stringToPrecomputedChunk("<\/script>");
      var startScriptSrc = stringToPrecomputedChunk('<script src="');
      var startModuleSrc = stringToPrecomputedChunk('<script type="module" src="');
      var endAsyncScript = stringToPrecomputedChunk('" async=""><\/script>');
      function escapeBootstrapScriptContent(scriptText) {
        {
          checkHtmlStringCoercion(scriptText);
        }
        return ("" + scriptText).replace(scriptRegex, scriptReplacer);
      }
      var scriptRegex = /(<\/|<)(s)(cript)/gi;
      var scriptReplacer = function(match, prefix3, s, suffix) {
        return "" + prefix3 + (s === "s" ? "\\u0073" : "\\u0053") + suffix;
      };
      function createResponseState(identifierPrefix, nonce, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
        var idPrefix = identifierPrefix === void 0 ? "" : identifierPrefix;
        var inlineScriptWithNonce = nonce === void 0 ? startInlineScript : stringToPrecomputedChunk('<script nonce="' + escapeTextForBrowser(nonce) + '">');
        var bootstrapChunks = [];
        if (bootstrapScriptContent !== void 0) {
          bootstrapChunks.push(inlineScriptWithNonce, stringToChunk(escapeBootstrapScriptContent(bootstrapScriptContent)), endInlineScript);
        }
        if (bootstrapScripts !== void 0) {
          for (var i = 0; i < bootstrapScripts.length; i++) {
            bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts[i])), endAsyncScript);
          }
        }
        if (bootstrapModules !== void 0) {
          for (var _i = 0; _i < bootstrapModules.length; _i++) {
            bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapModules[_i])), endAsyncScript);
          }
        }
        return {
          bootstrapChunks,
          startInlineScript: inlineScriptWithNonce,
          placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
          segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
          boundaryPrefix: idPrefix + "B:",
          idPrefix,
          nextSuspenseID: 0,
          sentCompleteSegmentFunction: false,
          sentCompleteBoundaryFunction: false,
          sentClientRenderFunction: false
        };
      }
      var ROOT_HTML_MODE = 0;
      var HTML_MODE = 1;
      var SVG_MODE = 2;
      var MATHML_MODE = 3;
      var HTML_TABLE_MODE = 4;
      var HTML_TABLE_BODY_MODE = 5;
      var HTML_TABLE_ROW_MODE = 6;
      var HTML_COLGROUP_MODE = 7;
      function createFormatContext(insertionMode, selectedValue) {
        return {
          insertionMode,
          selectedValue
        };
      }
      function createRootFormatContext(namespaceURI) {
        var insertionMode = namespaceURI === "http://www.w3.org/2000/svg" ? SVG_MODE : namespaceURI === "http://www.w3.org/1998/Math/MathML" ? MATHML_MODE : ROOT_HTML_MODE;
        return createFormatContext(insertionMode, null);
      }
      function getChildFormatContext(parentContext, type, props) {
        switch (type) {
          case "select":
            return createFormatContext(HTML_MODE, props.value != null ? props.value : props.defaultValue);
          case "svg":
            return createFormatContext(SVG_MODE, null);
          case "math":
            return createFormatContext(MATHML_MODE, null);
          case "foreignObject":
            return createFormatContext(HTML_MODE, null);
          // Table parents are special in that their children can only be created at all if they're
          // wrapped in a table parent. So we need to encode that we're entering this mode.
          case "table":
            return createFormatContext(HTML_TABLE_MODE, null);
          case "thead":
          case "tbody":
          case "tfoot":
            return createFormatContext(HTML_TABLE_BODY_MODE, null);
          case "colgroup":
            return createFormatContext(HTML_COLGROUP_MODE, null);
          case "tr":
            return createFormatContext(HTML_TABLE_ROW_MODE, null);
        }
        if (parentContext.insertionMode >= HTML_TABLE_MODE) {
          return createFormatContext(HTML_MODE, null);
        }
        if (parentContext.insertionMode === ROOT_HTML_MODE) {
          return createFormatContext(HTML_MODE, null);
        }
        return parentContext;
      }
      var UNINITIALIZED_SUSPENSE_BOUNDARY_ID = null;
      function assignSuspenseBoundaryID(responseState) {
        var generatedID = responseState.nextSuspenseID++;
        return stringToPrecomputedChunk(responseState.boundaryPrefix + generatedID.toString(16));
      }
      function makeId(responseState, treeId, localId) {
        var idPrefix = responseState.idPrefix;
        var id = ":" + idPrefix + "R" + treeId;
        if (localId > 0) {
          id += "H" + localId.toString(32);
        }
        return id + ":";
      }
      function encodeHTMLTextNode(text) {
        return escapeTextForBrowser(text);
      }
      var textSeparator = stringToPrecomputedChunk("<!-- -->");
      function pushTextInstance(target, text, responseState, textEmbedded) {
        if (text === "") {
          return textEmbedded;
        }
        if (textEmbedded) {
          target.push(textSeparator);
        }
        target.push(stringToChunk(encodeHTMLTextNode(text)));
        return true;
      }
      function pushSegmentFinale(target, responseState, lastPushedText, textEmbedded) {
        if (lastPushedText && textEmbedded) {
          target.push(textSeparator);
        }
      }
      var styleNameCache = /* @__PURE__ */ new Map();
      function processStyleName(styleName) {
        var chunk = styleNameCache.get(styleName);
        if (chunk !== void 0) {
          return chunk;
        }
        var result = stringToPrecomputedChunk(escapeTextForBrowser(hyphenateStyleName(styleName)));
        styleNameCache.set(styleName, result);
        return result;
      }
      var styleAttributeStart = stringToPrecomputedChunk(' style="');
      var styleAssign = stringToPrecomputedChunk(":");
      var styleSeparator = stringToPrecomputedChunk(";");
      function pushStyle(target, responseState, style) {
        if (typeof style !== "object") {
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
        }
        var isFirst = true;
        for (var styleName in style) {
          if (!hasOwnProperty.call(style, styleName)) {
            continue;
          }
          var styleValue = style[styleName];
          if (styleValue == null || typeof styleValue === "boolean" || styleValue === "") {
            continue;
          }
          var nameChunk = void 0;
          var valueChunk = void 0;
          var isCustomProperty = styleName.indexOf("--") === 0;
          if (isCustomProperty) {
            nameChunk = stringToChunk(escapeTextForBrowser(styleName));
            {
              checkCSSPropertyStringCoercion(styleValue, styleName);
            }
            valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
          } else {
            {
              warnValidStyle$1(styleName, styleValue);
            }
            nameChunk = processStyleName(styleName);
            if (typeof styleValue === "number") {
              if (styleValue !== 0 && !hasOwnProperty.call(isUnitlessNumber, styleName)) {
                valueChunk = stringToChunk(styleValue + "px");
              } else {
                valueChunk = stringToChunk("" + styleValue);
              }
            } else {
              {
                checkCSSPropertyStringCoercion(styleValue, styleName);
              }
              valueChunk = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
            }
          }
          if (isFirst) {
            isFirst = false;
            target.push(styleAttributeStart, nameChunk, styleAssign, valueChunk);
          } else {
            target.push(styleSeparator, nameChunk, styleAssign, valueChunk);
          }
        }
        if (!isFirst) {
          target.push(attributeEnd);
        }
      }
      var attributeSeparator = stringToPrecomputedChunk(" ");
      var attributeAssign = stringToPrecomputedChunk('="');
      var attributeEnd = stringToPrecomputedChunk('"');
      var attributeEmptyString = stringToPrecomputedChunk('=""');
      function pushAttribute(target, responseState, name, value) {
        switch (name) {
          case "style": {
            pushStyle(target, responseState, value);
            return;
          }
          case "defaultValue":
          case "defaultChecked":
          // These shouldn't be set as attributes on generic HTML elements.
          case "innerHTML":
          // Must use dangerouslySetInnerHTML instead.
          case "suppressContentEditableWarning":
          case "suppressHydrationWarning":
            return;
        }
        if (
          // shouldIgnoreAttribute
          // We have already filtered out null/undefined and reserved words.
          name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")
        ) {
          return;
        }
        var propertyInfo = getPropertyInfo(name);
        if (propertyInfo !== null) {
          switch (typeof value) {
            case "function":
            // $FlowIssue symbol is perfectly valid here
            case "symbol":
              return;
            case "boolean": {
              if (!propertyInfo.acceptsBooleans) {
                return;
              }
            }
          }
          var attributeName = propertyInfo.attributeName;
          var attributeNameChunk = stringToChunk(attributeName);
          switch (propertyInfo.type) {
            case BOOLEAN:
              if (value) {
                target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
              }
              return;
            case OVERLOADED_BOOLEAN:
              if (value === true) {
                target.push(attributeSeparator, attributeNameChunk, attributeEmptyString);
              } else if (value === false) ;
              else {
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
              return;
            case NUMERIC:
              if (!isNaN(value)) {
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
              break;
            case POSITIVE_NUMERIC:
              if (!isNaN(value) && value >= 1) {
                target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
              }
              break;
            default:
              if (propertyInfo.sanitizeURL) {
                {
                  checkAttributeStringCoercion(value, attributeName);
                }
                value = "" + value;
                sanitizeURL(value);
              }
              target.push(attributeSeparator, attributeNameChunk, attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
          }
        } else if (isAttributeNameSafe(name)) {
          switch (typeof value) {
            case "function":
            // $FlowIssue symbol is perfectly valid here
            case "symbol":
              return;
            case "boolean": {
              var prefix3 = name.toLowerCase().slice(0, 5);
              if (prefix3 !== "data-" && prefix3 !== "aria-") {
                return;
              }
            }
          }
          target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
        }
      }
      var endOfStartTag = stringToPrecomputedChunk(">");
      var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
      function pushInnerHTML(target, innerHTML, children) {
        if (innerHTML != null) {
          if (children != null) {
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          }
          if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
          }
          var html = innerHTML.__html;
          if (html !== null && html !== void 0) {
            {
              checkHtmlStringCoercion(html);
            }
            target.push(stringToChunk("" + html));
          }
        }
      }
      var didWarnDefaultInputValue = false;
      var didWarnDefaultChecked = false;
      var didWarnDefaultSelectValue = false;
      var didWarnDefaultTextareaValue = false;
      var didWarnInvalidOptionChildren = false;
      var didWarnInvalidOptionInnerHTML = false;
      var didWarnSelectedSetOnOption = false;
      function checkSelectProp(props, propName) {
        {
          var value = props[propName];
          if (value != null) {
            var array = isArray(value);
            if (props.multiple && !array) {
              error("The `%s` prop supplied to <select> must be an array if `multiple` is true.", propName);
            } else if (!props.multiple && array) {
              error("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.", propName);
            }
          }
        }
      }
      function pushStartSelect(target, props, responseState) {
        {
          checkControlledValueProps("select", props);
          checkSelectProp(props, "value");
          checkSelectProp(props, "defaultValue");
          if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultSelectValue) {
            error("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components");
            didWarnDefaultSelectValue = true;
          }
        }
        target.push(startChunkForTag("select"));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              case "defaultValue":
              case "value":
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        return children;
      }
      function flattenOptionChildren(children) {
        var content = "";
        React.Children.forEach(children, function(child) {
          if (child == null) {
            return;
          }
          content += child;
          {
            if (!didWarnInvalidOptionChildren && typeof child !== "string" && typeof child !== "number") {
              didWarnInvalidOptionChildren = true;
              error("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.");
            }
          }
        });
        return content;
      }
      var selectedMarkerAttribute = stringToPrecomputedChunk(' selected=""');
      function pushStartOption(target, props, responseState, formatContext) {
        var selectedValue = formatContext.selectedValue;
        target.push(startChunkForTag("option"));
        var children = null;
        var value = null;
        var selected = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "selected":
                selected = propValue;
                {
                  if (!didWarnSelectedSetOnOption) {
                    error("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
                    didWarnSelectedSetOnOption = true;
                  }
                }
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              // eslint-disable-next-line-no-fallthrough
              case "value":
                value = propValue;
              // We intentionally fallthrough to also set the attribute on the node.
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        if (selectedValue != null) {
          var stringValue;
          if (value !== null) {
            {
              checkAttributeStringCoercion(value, "value");
            }
            stringValue = "" + value;
          } else {
            {
              if (innerHTML !== null) {
                if (!didWarnInvalidOptionInnerHTML) {
                  didWarnInvalidOptionInnerHTML = true;
                  error("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.");
                }
              }
            }
            stringValue = flattenOptionChildren(children);
          }
          if (isArray(selectedValue)) {
            for (var i = 0; i < selectedValue.length; i++) {
              {
                checkAttributeStringCoercion(selectedValue[i], "value");
              }
              var v2 = "" + selectedValue[i];
              if (v2 === stringValue) {
                target.push(selectedMarkerAttribute);
                break;
              }
            }
          } else {
            {
              checkAttributeStringCoercion(selectedValue, "select.value");
            }
            if ("" + selectedValue === stringValue) {
              target.push(selectedMarkerAttribute);
            }
          }
        } else if (selected) {
          target.push(selectedMarkerAttribute);
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        return children;
      }
      function pushInput(target, props, responseState) {
        {
          checkControlledValueProps("input", props);
          if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnDefaultChecked) {
            error("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
            didWarnDefaultChecked = true;
          }
          if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultInputValue) {
            error("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", "A component", props.type);
            didWarnDefaultInputValue = true;
          }
        }
        target.push(startChunkForTag("input"));
        var value = null;
        var defaultValue = null;
        var checked = null;
        var defaultChecked = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw new Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
              // eslint-disable-next-line-no-fallthrough
              case "defaultChecked":
                defaultChecked = propValue;
                break;
              case "defaultValue":
                defaultValue = propValue;
                break;
              case "checked":
                checked = propValue;
                break;
              case "value":
                value = propValue;
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        if (checked !== null) {
          pushAttribute(target, responseState, "checked", checked);
        } else if (defaultChecked !== null) {
          pushAttribute(target, responseState, "checked", defaultChecked);
        }
        if (value !== null) {
          pushAttribute(target, responseState, "value", value);
        } else if (defaultValue !== null) {
          pushAttribute(target, responseState, "value", defaultValue);
        }
        target.push(endOfStartTagSelfClosing);
        return null;
      }
      function pushStartTextArea(target, props, responseState) {
        {
          checkControlledValueProps("textarea", props);
          if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnDefaultTextareaValue) {
            error("Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components");
            didWarnDefaultTextareaValue = true;
          }
        }
        target.push(startChunkForTag("textarea"));
        var value = null;
        var defaultValue = null;
        var children = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "value":
                value = propValue;
                break;
              case "defaultValue":
                defaultValue = propValue;
                break;
              case "dangerouslySetInnerHTML":
                throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        if (value === null && defaultValue !== null) {
          value = defaultValue;
        }
        target.push(endOfStartTag);
        if (children != null) {
          {
            error("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          }
          if (value != null) {
            throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
          }
          if (isArray(children)) {
            if (children.length > 1) {
              throw new Error("<textarea> can only have at most one child.");
            }
            {
              checkHtmlStringCoercion(children[0]);
            }
            value = "" + children[0];
          }
          {
            checkHtmlStringCoercion(children);
          }
          value = "" + children;
        }
        if (typeof value === "string" && value[0] === "\n") {
          target.push(leadingNewline);
        }
        if (value !== null) {
          {
            checkAttributeStringCoercion(value, "value");
          }
          target.push(stringToChunk(encodeHTMLTextNode("" + value)));
        }
        return null;
      }
      function pushSelfClosing(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw new Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTagSelfClosing);
        return null;
      }
      function pushStartMenuItem(target, props, responseState) {
        target.push(startChunkForTag("menuitem"));
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw new Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        return null;
      }
      function pushStartTitle(target, props, responseState) {
        target.push(startChunkForTag("title"));
        var children = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                throw new Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
              // eslint-disable-next-line-no-fallthrough
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        {
          var child = Array.isArray(children) && children.length < 2 ? children[0] || null : children;
          if (Array.isArray(children) && children.length > 1) {
            error("A title element received an array with more than 1 element as children. In browsers title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
          } else if (child != null && child.$$typeof != null) {
            error("A title element received a React element for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
          } else if (child != null && typeof child !== "string" && typeof child !== "number") {
            error("A title element received a value that was not a string or number for children. In the browser title Elements can only have Text Nodes as children. If the children being rendered output more than a single text node in aggregate the browser will display markup and comments as text in the title and hydration will likely fail and fall back to client rendering");
          }
        }
        return children;
      }
      function pushStartGenericElement(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        if (typeof children === "string") {
          target.push(stringToChunk(encodeHTMLTextNode(children)));
          return null;
        }
        return children;
      }
      function pushStartCustomElement(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              case "style":
                pushStyle(target, responseState, propValue);
                break;
              case "suppressContentEditableWarning":
              case "suppressHydrationWarning":
                break;
              default:
                if (isAttributeNameSafe(propKey) && typeof propValue !== "function" && typeof propValue !== "symbol") {
                  target.push(attributeSeparator, stringToChunk(propKey), attributeAssign, stringToChunk(escapeTextForBrowser(propValue)), attributeEnd);
                }
                break;
            }
          }
        }
        target.push(endOfStartTag);
        pushInnerHTML(target, innerHTML, children);
        return children;
      }
      var leadingNewline = stringToPrecomputedChunk("\n");
      function pushStartPreformattedElement(target, props, tag, responseState) {
        target.push(startChunkForTag(tag));
        var children = null;
        var innerHTML = null;
        for (var propKey in props) {
          if (hasOwnProperty.call(props, propKey)) {
            var propValue = props[propKey];
            if (propValue == null) {
              continue;
            }
            switch (propKey) {
              case "children":
                children = propValue;
                break;
              case "dangerouslySetInnerHTML":
                innerHTML = propValue;
                break;
              default:
                pushAttribute(target, responseState, propKey, propValue);
                break;
            }
          }
        }
        target.push(endOfStartTag);
        if (innerHTML != null) {
          if (children != null) {
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          }
          if (typeof innerHTML !== "object" || !("__html" in innerHTML)) {
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
          }
          var html = innerHTML.__html;
          if (html !== null && html !== void 0) {
            if (typeof html === "string" && html.length > 0 && html[0] === "\n") {
              target.push(leadingNewline, stringToChunk(html));
            } else {
              {
                checkHtmlStringCoercion(html);
              }
              target.push(stringToChunk("" + html));
            }
          }
        }
        if (typeof children === "string" && children[0] === "\n") {
          target.push(leadingNewline);
        }
        return children;
      }
      var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
      var validatedTagCache = /* @__PURE__ */ new Map();
      function startChunkForTag(tag) {
        var tagStartChunk = validatedTagCache.get(tag);
        if (tagStartChunk === void 0) {
          if (!VALID_TAG_REGEX.test(tag)) {
            throw new Error("Invalid tag: " + tag);
          }
          tagStartChunk = stringToPrecomputedChunk("<" + tag);
          validatedTagCache.set(tag, tagStartChunk);
        }
        return tagStartChunk;
      }
      var DOCTYPE = stringToPrecomputedChunk("<!DOCTYPE html>");
      function pushStartInstance(target, type, props, responseState, formatContext) {
        {
          validateProperties(type, props);
          validateProperties$1(type, props);
          validateProperties$2(type, props, null);
          if (!props.suppressContentEditableWarning && props.contentEditable && props.children != null) {
            error("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.");
          }
          if (formatContext.insertionMode !== SVG_MODE && formatContext.insertionMode !== MATHML_MODE) {
            if (type.indexOf("-") === -1 && typeof props.is !== "string" && type.toLowerCase() !== type) {
              error("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type);
            }
          }
        }
        switch (type) {
          // Special tags
          case "select":
            return pushStartSelect(target, props, responseState);
          case "option":
            return pushStartOption(target, props, responseState, formatContext);
          case "textarea":
            return pushStartTextArea(target, props, responseState);
          case "input":
            return pushInput(target, props, responseState);
          case "menuitem":
            return pushStartMenuItem(target, props, responseState);
          case "title":
            return pushStartTitle(target, props, responseState);
          // Newline eating tags
          case "listing":
          case "pre": {
            return pushStartPreformattedElement(target, props, type, responseState);
          }
          // Omitted close tags
          case "area":
          case "base":
          case "br":
          case "col":
          case "embed":
          case "hr":
          case "img":
          case "keygen":
          case "link":
          case "meta":
          case "param":
          case "source":
          case "track":
          case "wbr": {
            return pushSelfClosing(target, props, type, responseState);
          }
          // These are reserved SVG and MathML elements, that are never custom elements.
          // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph": {
            return pushStartGenericElement(target, props, type, responseState);
          }
          case "html": {
            if (formatContext.insertionMode === ROOT_HTML_MODE) {
              target.push(DOCTYPE);
            }
            return pushStartGenericElement(target, props, type, responseState);
          }
          default: {
            if (type.indexOf("-") === -1 && typeof props.is !== "string") {
              return pushStartGenericElement(target, props, type, responseState);
            } else {
              return pushStartCustomElement(target, props, type, responseState);
            }
          }
        }
      }
      var endTag1 = stringToPrecomputedChunk("</");
      var endTag2 = stringToPrecomputedChunk(">");
      function pushEndInstance(target, type, props) {
        switch (type) {
          // Omitted close tags
          // TODO: Instead of repeating this switch we could try to pass a flag from above.
          // That would require returning a tuple. Which might be ok if it gets inlined.
          case "area":
          case "base":
          case "br":
          case "col":
          case "embed":
          case "hr":
          case "img":
          case "input":
          case "keygen":
          case "link":
          case "meta":
          case "param":
          case "source":
          case "track":
          case "wbr": {
            break;
          }
          default: {
            target.push(endTag1, stringToChunk(type), endTag2);
          }
        }
      }
      function writeCompletedRoot(destination, responseState) {
        var bootstrapChunks = responseState.bootstrapChunks;
        var i = 0;
        for (; i < bootstrapChunks.length - 1; i++) {
          writeChunk(destination, bootstrapChunks[i]);
        }
        if (i < bootstrapChunks.length) {
          return writeChunkAndReturn(destination, bootstrapChunks[i]);
        }
        return true;
      }
      var placeholder1 = stringToPrecomputedChunk('<template id="');
      var placeholder2 = stringToPrecomputedChunk('"></template>');
      function writePlaceholder(destination, responseState, id) {
        writeChunk(destination, placeholder1);
        writeChunk(destination, responseState.placeholderPrefix);
        var formattedID = stringToChunk(id.toString(16));
        writeChunk(destination, formattedID);
        return writeChunkAndReturn(destination, placeholder2);
      }
      var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
      var startPendingSuspenseBoundary1 = stringToPrecomputedChunk('<!--$?--><template id="');
      var startPendingSuspenseBoundary2 = stringToPrecomputedChunk('"></template>');
      var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
      var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
      var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
      var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk('"');
      var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(' data-dgst="');
      var clientRenderedSuspenseBoundaryError1B = stringToPrecomputedChunk(' data-msg="');
      var clientRenderedSuspenseBoundaryError1C = stringToPrecomputedChunk(' data-stck="');
      var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
      function writeStartCompletedSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
      }
      function writeStartPendingSuspenseBoundary(destination, responseState, id) {
        writeChunk(destination, startPendingSuspenseBoundary1);
        if (id === null) {
          throw new Error("An ID must have been assigned before we can complete the boundary.");
        }
        writeChunk(destination, id);
        return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
      }
      function writeStartClientRenderedSuspenseBoundary(destination, responseState, errorDigest, errorMesssage, errorComponentStack) {
        var result;
        result = writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
        writeChunk(destination, clientRenderedSuspenseBoundaryError1);
        if (errorDigest) {
          writeChunk(destination, clientRenderedSuspenseBoundaryError1A);
          writeChunk(destination, stringToChunk(escapeTextForBrowser(errorDigest)));
          writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
        }
        {
          if (errorMesssage) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1B);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorMesssage)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
          if (errorComponentStack) {
            writeChunk(destination, clientRenderedSuspenseBoundaryError1C);
            writeChunk(destination, stringToChunk(escapeTextForBrowser(errorComponentStack)));
            writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial);
          }
        }
        result = writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
        return result;
      }
      function writeEndCompletedSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, endSuspenseBoundary);
      }
      function writeEndPendingSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, endSuspenseBoundary);
      }
      function writeEndClientRenderedSuspenseBoundary(destination, responseState) {
        return writeChunkAndReturn(destination, endSuspenseBoundary);
      }
      var startSegmentHTML = stringToPrecomputedChunk('<div hidden id="');
      var startSegmentHTML2 = stringToPrecomputedChunk('">');
      var endSegmentHTML = stringToPrecomputedChunk("</div>");
      var startSegmentSVG = stringToPrecomputedChunk('<svg aria-hidden="true" style="display:none" id="');
      var startSegmentSVG2 = stringToPrecomputedChunk('">');
      var endSegmentSVG = stringToPrecomputedChunk("</svg>");
      var startSegmentMathML = stringToPrecomputedChunk('<math aria-hidden="true" style="display:none" id="');
      var startSegmentMathML2 = stringToPrecomputedChunk('">');
      var endSegmentMathML = stringToPrecomputedChunk("</math>");
      var startSegmentTable = stringToPrecomputedChunk('<table hidden id="');
      var startSegmentTable2 = stringToPrecomputedChunk('">');
      var endSegmentTable = stringToPrecomputedChunk("</table>");
      var startSegmentTableBody = stringToPrecomputedChunk('<table hidden><tbody id="');
      var startSegmentTableBody2 = stringToPrecomputedChunk('">');
      var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
      var startSegmentTableRow = stringToPrecomputedChunk('<table hidden><tr id="');
      var startSegmentTableRow2 = stringToPrecomputedChunk('">');
      var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
      var startSegmentColGroup = stringToPrecomputedChunk('<table hidden><colgroup id="');
      var startSegmentColGroup2 = stringToPrecomputedChunk('">');
      var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
      function writeStartSegment(destination, responseState, formatContext, id) {
        switch (formatContext.insertionMode) {
          case ROOT_HTML_MODE:
          case HTML_MODE: {
            writeChunk(destination, startSegmentHTML);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentHTML2);
          }
          case SVG_MODE: {
            writeChunk(destination, startSegmentSVG);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentSVG2);
          }
          case MATHML_MODE: {
            writeChunk(destination, startSegmentMathML);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentMathML2);
          }
          case HTML_TABLE_MODE: {
            writeChunk(destination, startSegmentTable);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentTable2);
          }
          // TODO: For the rest of these, there will be extra wrapper nodes that never
          // get deleted from the document. We need to delete the table too as part
          // of the injected scripts. They are invisible though so it's not too terrible
          // and it's kind of an edge case to suspend in a table. Totally supported though.
          case HTML_TABLE_BODY_MODE: {
            writeChunk(destination, startSegmentTableBody);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentTableBody2);
          }
          case HTML_TABLE_ROW_MODE: {
            writeChunk(destination, startSegmentTableRow);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentTableRow2);
          }
          case HTML_COLGROUP_MODE: {
            writeChunk(destination, startSegmentColGroup);
            writeChunk(destination, responseState.segmentPrefix);
            writeChunk(destination, stringToChunk(id.toString(16)));
            return writeChunkAndReturn(destination, startSegmentColGroup2);
          }
          default: {
            throw new Error("Unknown insertion mode. This is a bug in React.");
          }
        }
      }
      function writeEndSegment(destination, formatContext) {
        switch (formatContext.insertionMode) {
          case ROOT_HTML_MODE:
          case HTML_MODE: {
            return writeChunkAndReturn(destination, endSegmentHTML);
          }
          case SVG_MODE: {
            return writeChunkAndReturn(destination, endSegmentSVG);
          }
          case MATHML_MODE: {
            return writeChunkAndReturn(destination, endSegmentMathML);
          }
          case HTML_TABLE_MODE: {
            return writeChunkAndReturn(destination, endSegmentTable);
          }
          case HTML_TABLE_BODY_MODE: {
            return writeChunkAndReturn(destination, endSegmentTableBody);
          }
          case HTML_TABLE_ROW_MODE: {
            return writeChunkAndReturn(destination, endSegmentTableRow);
          }
          case HTML_COLGROUP_MODE: {
            return writeChunkAndReturn(destination, endSegmentColGroup);
          }
          default: {
            throw new Error("Unknown insertion mode. This is a bug in React.");
          }
        }
      }
      var completeSegmentFunction = "function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)}";
      var completeBoundaryFunction = 'function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}}';
      var clientRenderFunction = 'function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())}';
      var completeSegmentScript1Full = stringToPrecomputedChunk(completeSegmentFunction + ';$RS("');
      var completeSegmentScript1Partial = stringToPrecomputedChunk('$RS("');
      var completeSegmentScript2 = stringToPrecomputedChunk('","');
      var completeSegmentScript3 = stringToPrecomputedChunk('")<\/script>');
      function writeCompletedSegmentInstruction(destination, responseState, contentSegmentID) {
        writeChunk(destination, responseState.startInlineScript);
        if (!responseState.sentCompleteSegmentFunction) {
          responseState.sentCompleteSegmentFunction = true;
          writeChunk(destination, completeSegmentScript1Full);
        } else {
          writeChunk(destination, completeSegmentScript1Partial);
        }
        writeChunk(destination, responseState.segmentPrefix);
        var formattedID = stringToChunk(contentSegmentID.toString(16));
        writeChunk(destination, formattedID);
        writeChunk(destination, completeSegmentScript2);
        writeChunk(destination, responseState.placeholderPrefix);
        writeChunk(destination, formattedID);
        return writeChunkAndReturn(destination, completeSegmentScript3);
      }
      var completeBoundaryScript1Full = stringToPrecomputedChunk(completeBoundaryFunction + ';$RC("');
      var completeBoundaryScript1Partial = stringToPrecomputedChunk('$RC("');
      var completeBoundaryScript2 = stringToPrecomputedChunk('","');
      var completeBoundaryScript3 = stringToPrecomputedChunk('")<\/script>');
      function writeCompletedBoundaryInstruction(destination, responseState, boundaryID, contentSegmentID) {
        writeChunk(destination, responseState.startInlineScript);
        if (!responseState.sentCompleteBoundaryFunction) {
          responseState.sentCompleteBoundaryFunction = true;
          writeChunk(destination, completeBoundaryScript1Full);
        } else {
          writeChunk(destination, completeBoundaryScript1Partial);
        }
        if (boundaryID === null) {
          throw new Error("An ID must have been assigned before we can complete the boundary.");
        }
        var formattedContentID = stringToChunk(contentSegmentID.toString(16));
        writeChunk(destination, boundaryID);
        writeChunk(destination, completeBoundaryScript2);
        writeChunk(destination, responseState.segmentPrefix);
        writeChunk(destination, formattedContentID);
        return writeChunkAndReturn(destination, completeBoundaryScript3);
      }
      var clientRenderScript1Full = stringToPrecomputedChunk(clientRenderFunction + ';$RX("');
      var clientRenderScript1Partial = stringToPrecomputedChunk('$RX("');
      var clientRenderScript1A = stringToPrecomputedChunk('"');
      var clientRenderScript2 = stringToPrecomputedChunk(")<\/script>");
      var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
      function writeClientRenderBoundaryInstruction(destination, responseState, boundaryID, errorDigest, errorMessage, errorComponentStack) {
        writeChunk(destination, responseState.startInlineScript);
        if (!responseState.sentClientRenderFunction) {
          responseState.sentClientRenderFunction = true;
          writeChunk(destination, clientRenderScript1Full);
        } else {
          writeChunk(destination, clientRenderScript1Partial);
        }
        if (boundaryID === null) {
          throw new Error("An ID must have been assigned before we can complete the boundary.");
        }
        writeChunk(destination, boundaryID);
        writeChunk(destination, clientRenderScript1A);
        if (errorDigest || errorMessage || errorComponentStack) {
          writeChunk(destination, clientRenderErrorScriptArgInterstitial);
          writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || "")));
        }
        if (errorMessage || errorComponentStack) {
          writeChunk(destination, clientRenderErrorScriptArgInterstitial);
          writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorMessage || "")));
        }
        if (errorComponentStack) {
          writeChunk(destination, clientRenderErrorScriptArgInterstitial);
          writeChunk(destination, stringToChunk(escapeJSStringsForInstructionScripts(errorComponentStack)));
        }
        return writeChunkAndReturn(destination, clientRenderScript2);
      }
      var regexForJSStringsInScripts = /[<\u2028\u2029]/g;
      function escapeJSStringsForInstructionScripts(input) {
        var escaped = JSON.stringify(input);
        return escaped.replace(regexForJSStringsInScripts, function(match) {
          switch (match) {
            // santizing breaking out of strings and script tags
            case "<":
              return "\\u003c";
            case "\u2028":
              return "\\u2028";
            case "\u2029":
              return "\\u2029";
            default: {
              throw new Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
            }
          }
        });
      }
      var assign = Object.assign;
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element");
      var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = /* @__PURE__ */ Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
      var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
      var REACT_SCOPE_TYPE = /* @__PURE__ */ Symbol.for("react.scope");
      var REACT_DEBUG_TRACING_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.debug_trace_mode");
      var REACT_LEGACY_HIDDEN_TYPE = /* @__PURE__ */ Symbol.for("react.legacy_hidden");
      var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = /* @__PURE__ */ Symbol.for("react.default_value");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x2) {
                return null;
              }
            }
          }
        }
        return null;
      }
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix2;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix2 === void 0) {
            try {
              throw Error();
            } catch (x2) {
              var match = x2.stack.trim().match(/\n( *(at )?)/);
              prefix2 = match && match[1] || "";
            }
          }
          return "\n" + prefix2 + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn2, construct) {
        if (!fn2 || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn2);
          if (frame !== void 0) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x2) {
                control = x2;
              }
              Reflect.construct(fn2, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x2) {
                control = x2;
              }
              fn2.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x2) {
              control = x2;
            }
            fn2();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c2 = controlLines.length - 1;
            while (s >= 1 && c2 >= 0 && sampleLines[s] !== controlLines[c2]) {
              c2--;
            }
            for (; s >= 1 && c2 >= 0; s--, c2--) {
              if (sampleLines[s] !== controlLines[c2]) {
                if (s !== 1 || c2 !== 1) {
                  do {
                    s--;
                    c2--;
                    if (c2 < 0 || sampleLines[s] !== controlLines[c2]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn2.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn2.displayName);
                      }
                      {
                        if (typeof fn2 === "function") {
                          componentFrameCache.set(fn2, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c2 >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn2 ? fn2.displayName || fn2.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn2 === "function") {
            componentFrameCache.set(fn2, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeClassComponentFrame(ctor, source, ownerFn) {
        {
          return describeNativeComponentFrame(ctor, true);
        }
      }
      function describeFunctionComponentFrame(fn2, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn2, false);
        }
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x2) {
              }
            }
          }
        }
        return "";
      }
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error("Failed %s type: %s", location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      var warnedAboutMissingGetChildContext;
      {
        warnedAboutMissingGetChildContext = {};
      }
      var emptyContextObject = {};
      {
        Object.freeze(emptyContextObject);
      }
      function getMaskedContext(type, unmaskedContext) {
        {
          var contextTypes = type.contextTypes;
          if (!contextTypes) {
            return emptyContextObject;
          }
          var context = {};
          for (var key in contextTypes) {
            context[key] = unmaskedContext[key];
          }
          {
            var name = getComponentNameFromType(type) || "Unknown";
            checkPropTypes(contextTypes, context, "context", name);
          }
          return context;
        }
      }
      function processChildContext(instance, type, parentContext, childContextTypes) {
        {
          if (typeof instance.getChildContext !== "function") {
            {
              var componentName = getComponentNameFromType(type) || "Unknown";
              if (!warnedAboutMissingGetChildContext[componentName]) {
                warnedAboutMissingGetChildContext[componentName] = true;
                error("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
              }
            }
            return parentContext;
          }
          var childContext = instance.getChildContext();
          for (var contextKey in childContext) {
            if (!(contextKey in childContextTypes)) {
              throw new Error((getComponentNameFromType(type) || "Unknown") + '.getChildContext(): key "' + contextKey + '" is not defined in childContextTypes.');
            }
          }
          {
            var name = getComponentNameFromType(type) || "Unknown";
            checkPropTypes(childContextTypes, childContext, "child context", name);
          }
          return assign({}, parentContext, childContext);
        }
      }
      var rendererSigil;
      {
        rendererSigil = {};
      }
      var rootContextSnapshot = null;
      var currentActiveSnapshot = null;
      function popNode(prev) {
        {
          prev.context._currentValue = prev.parentValue;
        }
      }
      function pushNode(next) {
        {
          next.context._currentValue = next.value;
        }
      }
      function popToNearestCommonAncestor(prev, next) {
        if (prev === next) ;
        else {
          popNode(prev);
          var parentPrev = prev.parent;
          var parentNext = next.parent;
          if (parentPrev === null) {
            if (parentNext !== null) {
              throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
            }
          } else {
            if (parentNext === null) {
              throw new Error("The stacks must reach the root at the same time. This is a bug in React.");
            }
            popToNearestCommonAncestor(parentPrev, parentNext);
          }
          pushNode(next);
        }
      }
      function popAllPrevious(prev) {
        popNode(prev);
        var parentPrev = prev.parent;
        if (parentPrev !== null) {
          popAllPrevious(parentPrev);
        }
      }
      function pushAllNext(next) {
        var parentNext = next.parent;
        if (parentNext !== null) {
          pushAllNext(parentNext);
        }
        pushNode(next);
      }
      function popPreviousToCommonLevel(prev, next) {
        popNode(prev);
        var parentPrev = prev.parent;
        if (parentPrev === null) {
          throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
        }
        if (parentPrev.depth === next.depth) {
          popToNearestCommonAncestor(parentPrev, next);
        } else {
          popPreviousToCommonLevel(parentPrev, next);
        }
      }
      function popNextToCommonLevel(prev, next) {
        var parentNext = next.parent;
        if (parentNext === null) {
          throw new Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
        }
        if (prev.depth === parentNext.depth) {
          popToNearestCommonAncestor(prev, parentNext);
        } else {
          popNextToCommonLevel(prev, parentNext);
        }
        pushNode(next);
      }
      function switchContext(newSnapshot) {
        var prev = currentActiveSnapshot;
        var next = newSnapshot;
        if (prev !== next) {
          if (prev === null) {
            pushAllNext(next);
          } else if (next === null) {
            popAllPrevious(prev);
          } else if (prev.depth === next.depth) {
            popToNearestCommonAncestor(prev, next);
          } else if (prev.depth > next.depth) {
            popPreviousToCommonLevel(prev, next);
          } else {
            popNextToCommonLevel(prev, next);
          }
          currentActiveSnapshot = next;
        }
      }
      function pushProvider(context, nextValue) {
        var prevValue;
        {
          prevValue = context._currentValue;
          context._currentValue = nextValue;
          {
            if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
              error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
            }
            context._currentRenderer = rendererSigil;
          }
        }
        var prevNode = currentActiveSnapshot;
        var newNode = {
          parent: prevNode,
          depth: prevNode === null ? 0 : prevNode.depth + 1,
          context,
          parentValue: prevValue,
          value: nextValue
        };
        currentActiveSnapshot = newNode;
        return newNode;
      }
      function popProvider(context) {
        var prevSnapshot = currentActiveSnapshot;
        if (prevSnapshot === null) {
          throw new Error("Tried to pop a Context at the root of the app. This is a bug in React.");
        }
        {
          if (prevSnapshot.context !== context) {
            error("The parent context is not the expected context. This is probably a bug in React.");
          }
        }
        {
          var value = prevSnapshot.parentValue;
          if (value === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
            prevSnapshot.context._currentValue = prevSnapshot.context._defaultValue;
          } else {
            prevSnapshot.context._currentValue = value;
          }
          {
            if (context._currentRenderer !== void 0 && context._currentRenderer !== null && context._currentRenderer !== rendererSigil) {
              error("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.");
            }
            context._currentRenderer = rendererSigil;
          }
        }
        return currentActiveSnapshot = prevSnapshot.parent;
      }
      function getActiveContext() {
        return currentActiveSnapshot;
      }
      function readContext(context) {
        var value = context._currentValue;
        return value;
      }
      function get(key) {
        return key._reactInternals;
      }
      function set(key, value) {
        key._reactInternals = value;
      }
      var didWarnAboutNoopUpdateForComponent = {};
      var didWarnAboutDeprecatedWillMount = {};
      var didWarnAboutUninitializedState;
      var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate;
      var didWarnAboutLegacyLifecyclesAndDerivedState;
      var didWarnAboutUndefinedDerivedState;
      var warnOnUndefinedDerivedState;
      var warnOnInvalidCallback;
      var didWarnAboutDirectlyAssigningPropsToState;
      var didWarnAboutContextTypeAndContextTypes;
      var didWarnAboutInvalidateContextType;
      {
        didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
        didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
        didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
        didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
        didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
        didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
        didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
        var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
        warnOnInvalidCallback = function(callback, callerName) {
          if (callback === null || typeof callback === "function") {
            return;
          }
          var key = callerName + "_" + callback;
          if (!didWarnOnInvalidCallback.has(key)) {
            didWarnOnInvalidCallback.add(key);
            error("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
          }
        };
        warnOnUndefinedDerivedState = function(type, partialState) {
          if (partialState === void 0) {
            var componentName = getComponentNameFromType(type) || "Component";
            if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
              didWarnAboutUndefinedDerivedState.add(componentName);
              error("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
            }
          }
        };
      }
      function warnNoop(publicInstance, callerName) {
        {
          var _constructor = publicInstance.constructor;
          var componentName = _constructor && getComponentNameFromType(_constructor) || "ReactClass";
          var warningKey = componentName + "." + callerName;
          if (didWarnAboutNoopUpdateForComponent[warningKey]) {
            return;
          }
          error("%s(...): Can only update a mounting component. This usually means you called %s() outside componentWillMount() on the server. This is a no-op.\n\nPlease check the code for the %s component.", callerName, callerName, componentName);
          didWarnAboutNoopUpdateForComponent[warningKey] = true;
        }
      }
      var classComponentUpdater = {
        isMounted: function(inst) {
          return false;
        },
        enqueueSetState: function(inst, payload, callback) {
          var internals = get(inst);
          if (internals.queue === null) {
            warnNoop(inst, "setState");
          } else {
            internals.queue.push(payload);
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          }
        },
        enqueueReplaceState: function(inst, payload, callback) {
          var internals = get(inst);
          internals.replace = true;
          internals.queue = [payload];
          {
            if (callback !== void 0 && callback !== null) {
              warnOnInvalidCallback(callback, "setState");
            }
          }
        },
        enqueueForceUpdate: function(inst, callback) {
          var internals = get(inst);
          if (internals.queue === null) {
            warnNoop(inst, "forceUpdate");
          } else {
            {
              if (callback !== void 0 && callback !== null) {
                warnOnInvalidCallback(callback, "setState");
              }
            }
          }
        }
      };
      function applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, prevState, nextProps) {
        var partialState = getDerivedStateFromProps(nextProps, prevState);
        {
          warnOnUndefinedDerivedState(ctor, partialState);
        }
        var newState = partialState === null || partialState === void 0 ? prevState : assign({}, prevState, partialState);
        return newState;
      }
      function constructClassInstance(ctor, props, maskedLegacyContext) {
        var context = emptyContextObject;
        var contextType = ctor.contextType;
        {
          if ("contextType" in ctor) {
            var isValid = (
              // Allow null for conditional declaration
              contextType === null || contextType !== void 0 && contextType.$$typeof === REACT_CONTEXT_TYPE && contextType._context === void 0
            );
            if (!isValid && !didWarnAboutInvalidateContextType.has(ctor)) {
              didWarnAboutInvalidateContextType.add(ctor);
              var addendum = "";
              if (contextType === void 0) {
                addendum = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file.";
              } else if (typeof contextType !== "object") {
                addendum = " However, it is set to a " + typeof contextType + ".";
              } else if (contextType.$$typeof === REACT_PROVIDER_TYPE) {
                addendum = " Did you accidentally pass the Context.Provider instead?";
              } else if (contextType._context !== void 0) {
                addendum = " Did you accidentally pass the Context.Consumer instead?";
              } else {
                addendum = " However, it is set to an object with keys {" + Object.keys(contextType).join(", ") + "}.";
              }
              error("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", getComponentNameFromType(ctor) || "Component", addendum);
            }
          }
        }
        if (typeof contextType === "object" && contextType !== null) {
          context = readContext(contextType);
        } else {
          context = maskedLegacyContext;
        }
        var instance = new ctor(props, context);
        {
          if (typeof ctor.getDerivedStateFromProps === "function" && (instance.state === null || instance.state === void 0)) {
            var componentName = getComponentNameFromType(ctor) || "Component";
            if (!didWarnAboutUninitializedState.has(componentName)) {
              didWarnAboutUninitializedState.add(componentName);
              error("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance.state === null ? "null" : "undefined", componentName);
            }
          }
          if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function") {
            var foundWillMountName = null;
            var foundWillReceivePropsName = null;
            var foundWillUpdateName = null;
            if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
              foundWillMountName = "componentWillMount";
            } else if (typeof instance.UNSAFE_componentWillMount === "function") {
              foundWillMountName = "UNSAFE_componentWillMount";
            }
            if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
              foundWillReceivePropsName = "componentWillReceiveProps";
            } else if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
              foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
            }
            if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
              foundWillUpdateName = "componentWillUpdate";
            } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
              foundWillUpdateName = "UNSAFE_componentWillUpdate";
            }
            if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
              var _componentName = getComponentNameFromType(ctor) || "Component";
              var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
              if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
                didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
                error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://reactjs.org/link/unsafe-component-lifecycles", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
              }
            }
          }
        }
        return instance;
      }
      function checkClassInstance(instance, ctor, newProps) {
        {
          var name = getComponentNameFromType(ctor) || "Component";
          var renderPresent = instance.render;
          if (!renderPresent) {
            if (ctor.prototype && typeof ctor.prototype.render === "function") {
              error("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
            } else {
              error("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
            }
          }
          if (instance.getInitialState && !instance.getInitialState.isReactClassApproved && !instance.state) {
            error("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name);
          }
          if (instance.getDefaultProps && !instance.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name);
          }
          if (instance.propTypes) {
            error("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name);
          }
          if (instance.contextType) {
            error("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name);
          }
          {
            if (instance.contextTypes) {
              error("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name);
            }
            if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
              didWarnAboutContextTypeAndContextTypes.add(ctor);
              error("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
            }
          }
          if (typeof instance.componentShouldUpdate === "function") {
            error("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name);
          }
          if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== "undefined") {
            error("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentNameFromType(ctor) || "A pure component");
          }
          if (typeof instance.componentDidUnmount === "function") {
            error("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name);
          }
          if (typeof instance.componentDidReceiveProps === "function") {
            error("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name);
          }
          if (typeof instance.componentWillRecieveProps === "function") {
            error("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name);
          }
          if (typeof instance.UNSAFE_componentWillRecieveProps === "function") {
            error("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name);
          }
          var hasMutatedProps = instance.props !== newProps;
          if (instance.props !== void 0 && hasMutatedProps) {
            error("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name);
          }
          if (instance.defaultProps) {
            error("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name);
          }
          if (typeof instance.getSnapshotBeforeUpdate === "function" && typeof instance.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
            didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
            error("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentNameFromType(ctor));
          }
          if (typeof instance.getDerivedStateFromProps === "function") {
            error("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
          }
          if (typeof instance.getDerivedStateFromError === "function") {
            error("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name);
          }
          if (typeof ctor.getSnapshotBeforeUpdate === "function") {
            error("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name);
          }
          var _state = instance.state;
          if (_state && (typeof _state !== "object" || isArray(_state))) {
            error("%s.state: must be set to an object or null", name);
          }
          if (typeof instance.getChildContext === "function" && typeof ctor.childContextTypes !== "object") {
            error("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name);
          }
        }
      }
      function callComponentWillMount(type, instance) {
        var oldState = instance.state;
        if (typeof instance.componentWillMount === "function") {
          {
            if (instance.componentWillMount.__suppressDeprecationWarning !== true) {
              var componentName = getComponentNameFromType(type) || "Unknown";
              if (!didWarnAboutDeprecatedWillMount[componentName]) {
                warn(
                  // keep this warning in sync with ReactStrictModeWarning.js
                  "componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.\n\n* Move code from componentWillMount to componentDidMount (preferred in most cases) or the constructor.\n\nPlease update the following components: %s",
                  componentName
                );
                didWarnAboutDeprecatedWillMount[componentName] = true;
              }
            }
          }
          instance.componentWillMount();
        }
        if (typeof instance.UNSAFE_componentWillMount === "function") {
          instance.UNSAFE_componentWillMount();
        }
        if (oldState !== instance.state) {
          {
            error("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentNameFromType(type) || "Component");
          }
          classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
        }
      }
      function processUpdateQueue(internalInstance, inst, props, maskedLegacyContext) {
        if (internalInstance.queue !== null && internalInstance.queue.length > 0) {
          var oldQueue = internalInstance.queue;
          var oldReplace = internalInstance.replace;
          internalInstance.queue = null;
          internalInstance.replace = false;
          if (oldReplace && oldQueue.length === 1) {
            inst.state = oldQueue[0];
          } else {
            var nextState = oldReplace ? oldQueue[0] : inst.state;
            var dontMutate = true;
            for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
              var partial = oldQueue[i];
              var partialState = typeof partial === "function" ? partial.call(inst, nextState, props, maskedLegacyContext) : partial;
              if (partialState != null) {
                if (dontMutate) {
                  dontMutate = false;
                  nextState = assign({}, nextState, partialState);
                } else {
                  assign(nextState, partialState);
                }
              }
            }
            inst.state = nextState;
          }
        } else {
          internalInstance.queue = null;
        }
      }
      function mountClassInstance(instance, ctor, newProps, maskedLegacyContext) {
        {
          checkClassInstance(instance, ctor, newProps);
        }
        var initialState = instance.state !== void 0 ? instance.state : null;
        instance.updater = classComponentUpdater;
        instance.props = newProps;
        instance.state = initialState;
        var internalInstance = {
          queue: [],
          replace: false
        };
        set(instance, internalInstance);
        var contextType = ctor.contextType;
        if (typeof contextType === "object" && contextType !== null) {
          instance.context = readContext(contextType);
        } else {
          instance.context = maskedLegacyContext;
        }
        {
          if (instance.state === newProps) {
            var componentName = getComponentNameFromType(ctor) || "Component";
            if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
              didWarnAboutDirectlyAssigningPropsToState.add(componentName);
              error("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
            }
          }
        }
        var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
        if (typeof getDerivedStateFromProps === "function") {
          instance.state = applyDerivedStateFromProps(instance, ctor, getDerivedStateFromProps, initialState, newProps);
        }
        if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
          callComponentWillMount(ctor, instance);
          processUpdateQueue(internalInstance, instance, newProps, maskedLegacyContext);
        }
      }
      var emptyTreeContext = {
        id: 1,
        overflow: ""
      };
      function getTreeId(context) {
        var overflow = context.overflow;
        var idWithLeadingBit = context.id;
        var id = idWithLeadingBit & ~getLeadingBit(idWithLeadingBit);
        return id.toString(32) + overflow;
      }
      function pushTreeContext(baseContext, totalChildren, index) {
        var baseIdWithLeadingBit = baseContext.id;
        var baseOverflow = baseContext.overflow;
        var baseLength = getBitLength(baseIdWithLeadingBit) - 1;
        var baseId = baseIdWithLeadingBit & ~(1 << baseLength);
        var slot = index + 1;
        var length = getBitLength(totalChildren) + baseLength;
        if (length > 30) {
          var numberOfOverflowBits = baseLength - baseLength % 5;
          var newOverflowBits = (1 << numberOfOverflowBits) - 1;
          var newOverflow = (baseId & newOverflowBits).toString(32);
          var restOfBaseId = baseId >> numberOfOverflowBits;
          var restOfBaseLength = baseLength - numberOfOverflowBits;
          var restOfLength = getBitLength(totalChildren) + restOfBaseLength;
          var restOfNewBits = slot << restOfBaseLength;
          var id = restOfNewBits | restOfBaseId;
          var overflow = newOverflow + baseOverflow;
          return {
            id: 1 << restOfLength | id,
            overflow
          };
        } else {
          var newBits = slot << baseLength;
          var _id = newBits | baseId;
          var _overflow = baseOverflow;
          return {
            id: 1 << length | _id,
            overflow: _overflow
          };
        }
      }
      function getBitLength(number) {
        return 32 - clz32(number);
      }
      function getLeadingBit(id) {
        return 1 << getBitLength(id) - 1;
      }
      var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
      var log = Math.log;
      var LN2 = Math.LN2;
      function clz32Fallback(x2) {
        var asUint = x2 >>> 0;
        if (asUint === 0) {
          return 32;
        }
        return 31 - (log(asUint) / LN2 | 0) | 0;
      }
      function is(x2, y2) {
        return x2 === y2 && (x2 !== 0 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
      }
      var objectIs = typeof Object.is === "function" ? Object.is : is;
      var currentlyRenderingComponent = null;
      var currentlyRenderingTask = null;
      var firstWorkInProgressHook = null;
      var workInProgressHook = null;
      var isReRender = false;
      var didScheduleRenderPhaseUpdate = false;
      var localIdCounter = 0;
      var renderPhaseUpdates = null;
      var numberOfReRenders = 0;
      var RE_RENDER_LIMIT = 25;
      var isInHookUserCodeInDev = false;
      var currentHookNameInDev;
      function resolveCurrentlyRenderingComponent() {
        if (currentlyRenderingComponent === null) {
          throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
        }
        {
          if (isInHookUserCodeInDev) {
            error("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
          }
        }
        return currentlyRenderingComponent;
      }
      function areHookInputsEqual(nextDeps, prevDeps) {
        if (prevDeps === null) {
          {
            error("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", currentHookNameInDev);
          }
          return false;
        }
        {
          if (nextDeps.length !== prevDeps.length) {
            error("The final argument passed to %s changed size between renders. The order and size of this array must remain constant.\n\nPrevious: %s\nIncoming: %s", currentHookNameInDev, "[" + nextDeps.join(", ") + "]", "[" + prevDeps.join(", ") + "]");
          }
        }
        for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
          if (objectIs(nextDeps[i], prevDeps[i])) {
            continue;
          }
          return false;
        }
        return true;
      }
      function createHook() {
        if (numberOfReRenders > 0) {
          throw new Error("Rendered more hooks than during the previous render");
        }
        return {
          memoizedState: null,
          queue: null,
          next: null
        };
      }
      function createWorkInProgressHook() {
        if (workInProgressHook === null) {
          if (firstWorkInProgressHook === null) {
            isReRender = false;
            firstWorkInProgressHook = workInProgressHook = createHook();
          } else {
            isReRender = true;
            workInProgressHook = firstWorkInProgressHook;
          }
        } else {
          if (workInProgressHook.next === null) {
            isReRender = false;
            workInProgressHook = workInProgressHook.next = createHook();
          } else {
            isReRender = true;
            workInProgressHook = workInProgressHook.next;
          }
        }
        return workInProgressHook;
      }
      function prepareToUseHooks(task, componentIdentity) {
        currentlyRenderingComponent = componentIdentity;
        currentlyRenderingTask = task;
        {
          isInHookUserCodeInDev = false;
        }
        localIdCounter = 0;
      }
      function finishHooks(Component, props, children, refOrContext) {
        while (didScheduleRenderPhaseUpdate) {
          didScheduleRenderPhaseUpdate = false;
          localIdCounter = 0;
          numberOfReRenders += 1;
          workInProgressHook = null;
          children = Component(props, refOrContext);
        }
        resetHooksState();
        return children;
      }
      function checkDidRenderIdHook() {
        var didRenderIdHook = localIdCounter !== 0;
        return didRenderIdHook;
      }
      function resetHooksState() {
        {
          isInHookUserCodeInDev = false;
        }
        currentlyRenderingComponent = null;
        currentlyRenderingTask = null;
        didScheduleRenderPhaseUpdate = false;
        firstWorkInProgressHook = null;
        numberOfReRenders = 0;
        renderPhaseUpdates = null;
        workInProgressHook = null;
      }
      function readContext$1(context) {
        {
          if (isInHookUserCodeInDev) {
            error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          }
        }
        return readContext(context);
      }
      function useContext(context) {
        {
          currentHookNameInDev = "useContext";
        }
        resolveCurrentlyRenderingComponent();
        return readContext(context);
      }
      function basicStateReducer(state, action) {
        return typeof action === "function" ? action(state) : action;
      }
      function useState(initialState) {
        {
          currentHookNameInDev = "useState";
        }
        return useReducer(
          basicStateReducer,
          // useReducer has a special case to support lazy useState initializers
          initialState
        );
      }
      function useReducer(reducer, initialArg, init) {
        {
          if (reducer !== basicStateReducer) {
            currentHookNameInDev = "useReducer";
          }
        }
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        if (isReRender) {
          var queue = workInProgressHook.queue;
          var dispatch = queue.dispatch;
          if (renderPhaseUpdates !== null) {
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
            if (firstRenderPhaseUpdate !== void 0) {
              renderPhaseUpdates.delete(queue);
              var newState = workInProgressHook.memoizedState;
              var update = firstRenderPhaseUpdate;
              do {
                var action = update.action;
                {
                  isInHookUserCodeInDev = true;
                }
                newState = reducer(newState, action);
                {
                  isInHookUserCodeInDev = false;
                }
                update = update.next;
              } while (update !== null);
              workInProgressHook.memoizedState = newState;
              return [newState, dispatch];
            }
          }
          return [workInProgressHook.memoizedState, dispatch];
        } else {
          {
            isInHookUserCodeInDev = true;
          }
          var initialState;
          if (reducer === basicStateReducer) {
            initialState = typeof initialArg === "function" ? initialArg() : initialArg;
          } else {
            initialState = init !== void 0 ? init(initialArg) : initialArg;
          }
          {
            isInHookUserCodeInDev = false;
          }
          workInProgressHook.memoizedState = initialState;
          var _queue = workInProgressHook.queue = {
            last: null,
            dispatch: null
          };
          var _dispatch = _queue.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue);
          return [workInProgressHook.memoizedState, _dispatch];
        }
      }
      function useMemo(nextCreate, deps) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var nextDeps = deps === void 0 ? null : deps;
        if (workInProgressHook !== null) {
          var prevState = workInProgressHook.memoizedState;
          if (prevState !== null) {
            if (nextDeps !== null) {
              var prevDeps = prevState[1];
              if (areHookInputsEqual(nextDeps, prevDeps)) {
                return prevState[0];
              }
            }
          }
        }
        {
          isInHookUserCodeInDev = true;
        }
        var nextValue = nextCreate();
        {
          isInHookUserCodeInDev = false;
        }
        workInProgressHook.memoizedState = [nextValue, nextDeps];
        return nextValue;
      }
      function useRef(initialValue) {
        currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
        workInProgressHook = createWorkInProgressHook();
        var previousRef = workInProgressHook.memoizedState;
        if (previousRef === null) {
          var ref = {
            current: initialValue
          };
          {
            Object.seal(ref);
          }
          workInProgressHook.memoizedState = ref;
          return ref;
        } else {
          return previousRef;
        }
      }
      function useLayoutEffect2(create, inputs) {
        {
          currentHookNameInDev = "useLayoutEffect";
          error("useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://reactjs.org/link/uselayouteffect-ssr for common fixes.");
        }
      }
      function dispatchAction(componentIdentity, queue, action) {
        if (numberOfReRenders >= RE_RENDER_LIMIT) {
          throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
        }
        if (componentIdentity === currentlyRenderingComponent) {
          didScheduleRenderPhaseUpdate = true;
          var update = {
            action,
            next: null
          };
          if (renderPhaseUpdates === null) {
            renderPhaseUpdates = /* @__PURE__ */ new Map();
          }
          var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
          if (firstRenderPhaseUpdate === void 0) {
            renderPhaseUpdates.set(queue, update);
          } else {
            var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
            while (lastRenderPhaseUpdate.next !== null) {
              lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
            }
            lastRenderPhaseUpdate.next = update;
          }
        }
      }
      function useCallback(callback, deps) {
        return useMemo(function() {
          return callback;
        }, deps);
      }
      function useMutableSource(source, getSnapshot, subscribe2) {
        resolveCurrentlyRenderingComponent();
        return getSnapshot(source._source);
      }
      function useSyncExternalStore(subscribe2, getSnapshot, getServerSnapshot) {
        if (getServerSnapshot === void 0) {
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        }
        return getServerSnapshot();
      }
      function useDeferredValue(value) {
        resolveCurrentlyRenderingComponent();
        return value;
      }
      function unsupportedStartTransition() {
        throw new Error("startTransition cannot be called during server rendering.");
      }
      function useTransition() {
        resolveCurrentlyRenderingComponent();
        return [false, unsupportedStartTransition];
      }
      function useId() {
        var task = currentlyRenderingTask;
        var treeId = getTreeId(task.treeContext);
        var responseState = currentResponseState;
        if (responseState === null) {
          throw new Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
        }
        var localId = localIdCounter++;
        return makeId(responseState, treeId, localId);
      }
      function noop() {
      }
      var Dispatcher = {
        readContext: readContext$1,
        useContext,
        useMemo,
        useReducer,
        useRef,
        useState,
        useInsertionEffect: noop,
        useLayoutEffect: useLayoutEffect2,
        useCallback,
        // useImperativeHandle is not run in the server environment
        useImperativeHandle: noop,
        // Effects are not run in the server environment.
        useEffect: noop,
        // Debugging effect
        useDebugValue: noop,
        useDeferredValue,
        useTransition,
        useId,
        // Subscriptions are not setup in a server environment.
        useMutableSource,
        useSyncExternalStore
      };
      var currentResponseState = null;
      function setCurrentResponseState(responseState) {
        currentResponseState = responseState;
      }
      function getStackByComponentStackNode(componentStack) {
        try {
          var info = "";
          var node = componentStack;
          do {
            switch (node.tag) {
              case 0:
                info += describeBuiltInComponentFrame(node.type, null, null);
                break;
              case 1:
                info += describeFunctionComponentFrame(node.type, null, null);
                break;
              case 2:
                info += describeClassComponentFrame(node.type, null, null);
                break;
            }
            node = node.parent;
          } while (node);
          return info;
        } catch (x2) {
          return "\nError generating stack: " + x2.message + "\n" + x2.stack;
        }
      }
      var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      var PENDING = 0;
      var COMPLETED = 1;
      var FLUSHED = 2;
      var ABORTED = 3;
      var ERRORED = 4;
      var OPEN = 0;
      var CLOSING = 1;
      var CLOSED = 2;
      var DEFAULT_PROGRESSIVE_CHUNK_SIZE = 12800;
      function defaultErrorHandler(error2) {
        console["error"](error2);
        return null;
      }
      function noop$1() {
      }
      function createRequest(children, responseState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError) {
        var pingedTasks = [];
        var abortSet = /* @__PURE__ */ new Set();
        var request = {
          destination: null,
          responseState,
          progressiveChunkSize: progressiveChunkSize === void 0 ? DEFAULT_PROGRESSIVE_CHUNK_SIZE : progressiveChunkSize,
          status: OPEN,
          fatalError: null,
          nextSegmentId: 0,
          allPendingTasks: 0,
          pendingRootTasks: 0,
          completedRootSegment: null,
          abortableTasks: abortSet,
          pingedTasks,
          clientRenderedBoundaries: [],
          completedBoundaries: [],
          partialBoundaries: [],
          onError: onError === void 0 ? defaultErrorHandler : onError,
          onAllReady: onAllReady === void 0 ? noop$1 : onAllReady,
          onShellReady: onShellReady === void 0 ? noop$1 : onShellReady,
          onShellError: onShellError === void 0 ? noop$1 : onShellError,
          onFatalError: noop$1
        };
        var rootSegment = createPendingSegment(
          request,
          0,
          null,
          rootFormatContext,
          // Root segments are never embedded in Text on either edge
          false,
          false
        );
        rootSegment.parentFlushed = true;
        var rootTask = createTask(request, children, null, rootSegment, abortSet, emptyContextObject, rootContextSnapshot, emptyTreeContext);
        pingedTasks.push(rootTask);
        return request;
      }
      function pingTask(request, task) {
        var pingedTasks = request.pingedTasks;
        pingedTasks.push(task);
        if (pingedTasks.length === 1) {
          scheduleWork(function() {
            return performWork(request);
          });
        }
      }
      function createSuspenseBoundary(request, fallbackAbortableTasks) {
        return {
          id: UNINITIALIZED_SUSPENSE_BOUNDARY_ID,
          rootSegmentID: -1,
          parentFlushed: false,
          pendingTasks: 0,
          forceClientRender: false,
          completedSegments: [],
          byteSize: 0,
          fallbackAbortableTasks,
          errorDigest: null
        };
      }
      function createTask(request, node, blockedBoundary, blockedSegment, abortSet, legacyContext, context, treeContext) {
        request.allPendingTasks++;
        if (blockedBoundary === null) {
          request.pendingRootTasks++;
        } else {
          blockedBoundary.pendingTasks++;
        }
        var task = {
          node,
          ping: function() {
            return pingTask(request, task);
          },
          blockedBoundary,
          blockedSegment,
          abortSet,
          legacyContext,
          context,
          treeContext
        };
        {
          task.componentStack = null;
        }
        abortSet.add(task);
        return task;
      }
      function createPendingSegment(request, index, boundary, formatContext, lastPushedText, textEmbedded) {
        return {
          status: PENDING,
          id: -1,
          // lazily assigned later
          index,
          parentFlushed: false,
          chunks: [],
          children: [],
          formatContext,
          boundary,
          lastPushedText,
          textEmbedded
        };
      }
      var currentTaskInDEV = null;
      function getCurrentStackInDEV() {
        {
          if (currentTaskInDEV === null || currentTaskInDEV.componentStack === null) {
            return "";
          }
          return getStackByComponentStackNode(currentTaskInDEV.componentStack);
        }
      }
      function pushBuiltInComponentStackInDEV(task, type) {
        {
          task.componentStack = {
            tag: 0,
            parent: task.componentStack,
            type
          };
        }
      }
      function pushFunctionComponentStackInDEV(task, type) {
        {
          task.componentStack = {
            tag: 1,
            parent: task.componentStack,
            type
          };
        }
      }
      function pushClassComponentStackInDEV(task, type) {
        {
          task.componentStack = {
            tag: 2,
            parent: task.componentStack,
            type
          };
        }
      }
      function popComponentStackInDEV(task) {
        {
          if (task.componentStack === null) {
            error("Unexpectedly popped too many stack frames. This is a bug in React.");
          } else {
            task.componentStack = task.componentStack.parent;
          }
        }
      }
      var lastBoundaryErrorComponentStackDev = null;
      function captureBoundaryErrorDetailsDev(boundary, error2) {
        {
          var errorMessage;
          if (typeof error2 === "string") {
            errorMessage = error2;
          } else if (error2 && typeof error2.message === "string") {
            errorMessage = error2.message;
          } else {
            errorMessage = String(error2);
          }
          var errorComponentStack = lastBoundaryErrorComponentStackDev || getCurrentStackInDEV();
          lastBoundaryErrorComponentStackDev = null;
          boundary.errorMessage = errorMessage;
          boundary.errorComponentStack = errorComponentStack;
        }
      }
      function logRecoverableError(request, error2) {
        var errorDigest = request.onError(error2);
        if (errorDigest != null && typeof errorDigest !== "string") {
          throw new Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead');
        }
        return errorDigest;
      }
      function fatalError(request, error2) {
        var onShellError = request.onShellError;
        onShellError(error2);
        var onFatalError = request.onFatalError;
        onFatalError(error2);
        if (request.destination !== null) {
          request.status = CLOSED;
          closeWithError(request.destination, error2);
        } else {
          request.status = CLOSING;
          request.fatalError = error2;
        }
      }
      function renderSuspenseBoundary(request, task, props) {
        pushBuiltInComponentStackInDEV(task, "Suspense");
        var parentBoundary = task.blockedBoundary;
        var parentSegment = task.blockedSegment;
        var fallback = props.fallback;
        var content = props.children;
        var fallbackAbortSet = /* @__PURE__ */ new Set();
        var newBoundary = createSuspenseBoundary(request, fallbackAbortSet);
        var insertionIndex = parentSegment.chunks.length;
        var boundarySegment = createPendingSegment(
          request,
          insertionIndex,
          newBoundary,
          parentSegment.formatContext,
          // boundaries never require text embedding at their edges because comment nodes bound them
          false,
          false
        );
        parentSegment.children.push(boundarySegment);
        parentSegment.lastPushedText = false;
        var contentRootSegment = createPendingSegment(
          request,
          0,
          null,
          parentSegment.formatContext,
          // boundaries never require text embedding at their edges because comment nodes bound them
          false,
          false
        );
        contentRootSegment.parentFlushed = true;
        task.blockedBoundary = newBoundary;
        task.blockedSegment = contentRootSegment;
        try {
          renderNode(request, task, content);
          pushSegmentFinale(contentRootSegment.chunks, request.responseState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded);
          contentRootSegment.status = COMPLETED;
          queueCompletedSegment(newBoundary, contentRootSegment);
          if (newBoundary.pendingTasks === 0) {
            popComponentStackInDEV(task);
            return;
          }
        } catch (error2) {
          contentRootSegment.status = ERRORED;
          newBoundary.forceClientRender = true;
          newBoundary.errorDigest = logRecoverableError(request, error2);
          {
            captureBoundaryErrorDetailsDev(newBoundary, error2);
          }
        } finally {
          task.blockedBoundary = parentBoundary;
          task.blockedSegment = parentSegment;
        }
        var suspendedFallbackTask = createTask(request, fallback, parentBoundary, boundarySegment, fallbackAbortSet, task.legacyContext, task.context, task.treeContext);
        {
          suspendedFallbackTask.componentStack = task.componentStack;
        }
        request.pingedTasks.push(suspendedFallbackTask);
        popComponentStackInDEV(task);
      }
      function renderHostElement(request, task, type, props) {
        pushBuiltInComponentStackInDEV(task, type);
        var segment = task.blockedSegment;
        var children = pushStartInstance(segment.chunks, type, props, request.responseState, segment.formatContext);
        segment.lastPushedText = false;
        var prevContext = segment.formatContext;
        segment.formatContext = getChildFormatContext(prevContext, type, props);
        renderNode(request, task, children);
        segment.formatContext = prevContext;
        pushEndInstance(segment.chunks, type);
        segment.lastPushedText = false;
        popComponentStackInDEV(task);
      }
      function shouldConstruct$1(Component) {
        return Component.prototype && Component.prototype.isReactComponent;
      }
      function renderWithHooks(request, task, Component, props, secondArg) {
        var componentIdentity = {};
        prepareToUseHooks(task, componentIdentity);
        var result = Component(props, secondArg);
        return finishHooks(Component, props, result, secondArg);
      }
      function finishClassComponent(request, task, instance, Component, props) {
        var nextChildren = instance.render();
        {
          if (instance.props !== props) {
            if (!didWarnAboutReassigningProps) {
              error("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", getComponentNameFromType(Component) || "a component");
            }
            didWarnAboutReassigningProps = true;
          }
        }
        {
          var childContextTypes = Component.childContextTypes;
          if (childContextTypes !== null && childContextTypes !== void 0) {
            var previousContext = task.legacyContext;
            var mergedContext = processChildContext(instance, Component, previousContext, childContextTypes);
            task.legacyContext = mergedContext;
            renderNodeDestructive(request, task, nextChildren);
            task.legacyContext = previousContext;
            return;
          }
        }
        renderNodeDestructive(request, task, nextChildren);
      }
      function renderClassComponent(request, task, Component, props) {
        pushClassComponentStackInDEV(task, Component);
        var maskedContext = getMaskedContext(Component, task.legacyContext);
        var instance = constructClassInstance(Component, props, maskedContext);
        mountClassInstance(instance, Component, props, maskedContext);
        finishClassComponent(request, task, instance, Component, props);
        popComponentStackInDEV(task);
      }
      var didWarnAboutBadClass = {};
      var didWarnAboutModulePatternComponent = {};
      var didWarnAboutContextTypeOnFunctionComponent = {};
      var didWarnAboutGetDerivedStateOnFunctionComponent = {};
      var didWarnAboutReassigningProps = false;
      var didWarnAboutDefaultPropsOnFunctionComponent = {};
      var didWarnAboutGenerators = false;
      var didWarnAboutMaps = false;
      var hasWarnedAboutUsingContextAsConsumer = false;
      function renderIndeterminateComponent(request, task, Component, props) {
        var legacyContext;
        {
          legacyContext = getMaskedContext(Component, task.legacyContext);
        }
        pushFunctionComponentStackInDEV(task, Component);
        {
          if (Component.prototype && typeof Component.prototype.render === "function") {
            var componentName = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutBadClass[componentName]) {
              error("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
              didWarnAboutBadClass[componentName] = true;
            }
          }
        }
        var value = renderWithHooks(request, task, Component, props, legacyContext);
        var hasId = checkDidRenderIdHook();
        {
          if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
            var _componentName = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutModulePatternComponent[_componentName]) {
              error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName, _componentName, _componentName);
              didWarnAboutModulePatternComponent[_componentName] = true;
            }
          }
        }
        if (
          // Run these checks in production only if the flag is off.
          // Eventually we'll delete this branch altogether.
          typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0
        ) {
          {
            var _componentName2 = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutModulePatternComponent[_componentName2]) {
              error("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _componentName2, _componentName2, _componentName2);
              didWarnAboutModulePatternComponent[_componentName2] = true;
            }
          }
          mountClassInstance(value, Component, props, legacyContext);
          finishClassComponent(request, task, value, Component, props);
        } else {
          {
            validateFunctionComponentInDev(Component);
          }
          if (hasId) {
            var prevTreeContext = task.treeContext;
            var totalChildren = 1;
            var index = 0;
            task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
            try {
              renderNodeDestructive(request, task, value);
            } finally {
              task.treeContext = prevTreeContext;
            }
          } else {
            renderNodeDestructive(request, task, value);
          }
        }
        popComponentStackInDEV(task);
      }
      function validateFunctionComponentInDev(Component) {
        {
          if (Component) {
            if (Component.childContextTypes) {
              error("%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component");
            }
          }
          if (Component.defaultProps !== void 0) {
            var componentName = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutDefaultPropsOnFunctionComponent[componentName]) {
              error("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", componentName);
              didWarnAboutDefaultPropsOnFunctionComponent[componentName] = true;
            }
          }
          if (typeof Component.getDerivedStateFromProps === "function") {
            var _componentName3 = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3]) {
              error("%s: Function components do not support getDerivedStateFromProps.", _componentName3);
              didWarnAboutGetDerivedStateOnFunctionComponent[_componentName3] = true;
            }
          }
          if (typeof Component.contextType === "object" && Component.contextType !== null) {
            var _componentName4 = getComponentNameFromType(Component) || "Unknown";
            if (!didWarnAboutContextTypeOnFunctionComponent[_componentName4]) {
              error("%s: Function components do not support contextType.", _componentName4);
              didWarnAboutContextTypeOnFunctionComponent[_componentName4] = true;
            }
          }
        }
      }
      function resolveDefaultProps(Component, baseProps) {
        if (Component && Component.defaultProps) {
          var props = assign({}, baseProps);
          var defaultProps = Component.defaultProps;
          for (var propName in defaultProps) {
            if (props[propName] === void 0) {
              props[propName] = defaultProps[propName];
            }
          }
          return props;
        }
        return baseProps;
      }
      function renderForwardRef(request, task, type, props, ref) {
        pushFunctionComponentStackInDEV(task, type.render);
        var children = renderWithHooks(request, task, type.render, props, ref);
        var hasId = checkDidRenderIdHook();
        if (hasId) {
          var prevTreeContext = task.treeContext;
          var totalChildren = 1;
          var index = 0;
          task.treeContext = pushTreeContext(prevTreeContext, totalChildren, index);
          try {
            renderNodeDestructive(request, task, children);
          } finally {
            task.treeContext = prevTreeContext;
          }
        } else {
          renderNodeDestructive(request, task, children);
        }
        popComponentStackInDEV(task);
      }
      function renderMemo(request, task, type, props, ref) {
        var innerType = type.type;
        var resolvedProps = resolveDefaultProps(innerType, props);
        renderElement(request, task, innerType, resolvedProps, ref);
      }
      function renderContextConsumer(request, task, context, props) {
        {
          if (context._context === void 0) {
            if (context !== context.Consumer) {
              if (!hasWarnedAboutUsingContextAsConsumer) {
                hasWarnedAboutUsingContextAsConsumer = true;
                error("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
              }
            }
          } else {
            context = context._context;
          }
        }
        var render = props.children;
        {
          if (typeof render !== "function") {
            error("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.");
          }
        }
        var newValue = readContext(context);
        var newChildren = render(newValue);
        renderNodeDestructive(request, task, newChildren);
      }
      function renderContextProvider(request, task, type, props) {
        var context = type._context;
        var value = props.value;
        var children = props.children;
        var prevSnapshot;
        {
          prevSnapshot = task.context;
        }
        task.context = pushProvider(context, value);
        renderNodeDestructive(request, task, children);
        task.context = popProvider(context);
        {
          if (prevSnapshot !== task.context) {
            error("Popping the context provider did not return back to the original snapshot. This is a bug in React.");
          }
        }
      }
      function renderLazyComponent(request, task, lazyComponent, props, ref) {
        pushBuiltInComponentStackInDEV(task, "Lazy");
        var payload = lazyComponent._payload;
        var init = lazyComponent._init;
        var Component = init(payload);
        var resolvedProps = resolveDefaultProps(Component, props);
        renderElement(request, task, Component, resolvedProps, ref);
        popComponentStackInDEV(task);
      }
      function renderElement(request, task, type, props, ref) {
        if (typeof type === "function") {
          if (shouldConstruct$1(type)) {
            renderClassComponent(request, task, type, props);
            return;
          } else {
            renderIndeterminateComponent(request, task, type, props);
            return;
          }
        }
        if (typeof type === "string") {
          renderHostElement(request, task, type, props);
          return;
        }
        switch (type) {
          // TODO: LegacyHidden acts the same as a fragment. This only works
          // because we currently assume that every instance of LegacyHidden is
          // accompanied by a host component wrapper. In the hidden mode, the host
          // component is given a `hidden` attribute, which ensures that the
          // initial HTML is not visible. To support the use of LegacyHidden as a
          // true fragment, without an extra DOM node, we would have to hide the
          // initial HTML in some other way.
          // TODO: Add REACT_OFFSCREEN_TYPE here too with the same capability.
          case REACT_LEGACY_HIDDEN_TYPE:
          case REACT_DEBUG_TRACING_MODE_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_FRAGMENT_TYPE: {
            renderNodeDestructive(request, task, props.children);
            return;
          }
          case REACT_SUSPENSE_LIST_TYPE: {
            pushBuiltInComponentStackInDEV(task, "SuspenseList");
            renderNodeDestructive(request, task, props.children);
            popComponentStackInDEV(task);
            return;
          }
          case REACT_SCOPE_TYPE: {
            throw new Error("ReactDOMServer does not yet support scope components.");
          }
          // eslint-disable-next-line-no-fallthrough
          case REACT_SUSPENSE_TYPE: {
            {
              renderSuspenseBoundary(request, task, props);
            }
            return;
          }
        }
        if (typeof type === "object" && type !== null) {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE: {
              renderForwardRef(request, task, type, props, ref);
              return;
            }
            case REACT_MEMO_TYPE: {
              renderMemo(request, task, type, props, ref);
              return;
            }
            case REACT_PROVIDER_TYPE: {
              renderContextProvider(request, task, type, props);
              return;
            }
            case REACT_CONTEXT_TYPE: {
              renderContextConsumer(request, task, type, props);
              return;
            }
            case REACT_LAZY_TYPE: {
              renderLazyComponent(request, task, type, props);
              return;
            }
          }
        }
        var info = "";
        {
          if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
            info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
          }
        }
        throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (type == null ? type : typeof type) + "." + info));
      }
      function validateIterable(iterable, iteratorFn) {
        {
          if (typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
          iterable[Symbol.toStringTag] === "Generator") {
            if (!didWarnAboutGenerators) {
              error("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.");
            }
            didWarnAboutGenerators = true;
          }
          if (iterable.entries === iteratorFn) {
            if (!didWarnAboutMaps) {
              error("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
            }
            didWarnAboutMaps = true;
          }
        }
      }
      function renderNodeDestructive(request, task, node) {
        {
          try {
            return renderNodeDestructiveImpl(request, task, node);
          } catch (x2) {
            if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") ;
            else {
              lastBoundaryErrorComponentStackDev = lastBoundaryErrorComponentStackDev !== null ? lastBoundaryErrorComponentStackDev : getCurrentStackInDEV();
            }
            throw x2;
          }
        }
      }
      function renderNodeDestructiveImpl(request, task, node) {
        task.node = node;
        if (typeof node === "object" && node !== null) {
          switch (node.$$typeof) {
            case REACT_ELEMENT_TYPE: {
              var element = node;
              var type = element.type;
              var props = element.props;
              var ref = element.ref;
              renderElement(request, task, type, props, ref);
              return;
            }
            case REACT_PORTAL_TYPE:
              throw new Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
            // eslint-disable-next-line-no-fallthrough
            case REACT_LAZY_TYPE: {
              var lazyNode = node;
              var payload = lazyNode._payload;
              var init = lazyNode._init;
              var resolvedNode;
              {
                try {
                  resolvedNode = init(payload);
                } catch (x2) {
                  if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") {
                    pushBuiltInComponentStackInDEV(task, "Lazy");
                  }
                  throw x2;
                }
              }
              renderNodeDestructive(request, task, resolvedNode);
              return;
            }
          }
          if (isArray(node)) {
            renderChildrenArray(request, task, node);
            return;
          }
          var iteratorFn = getIteratorFn(node);
          if (iteratorFn) {
            {
              validateIterable(node, iteratorFn);
            }
            var iterator = iteratorFn.call(node);
            if (iterator) {
              var step = iterator.next();
              if (!step.done) {
                var children = [];
                do {
                  children.push(step.value);
                  step = iterator.next();
                } while (!step.done);
                renderChildrenArray(request, task, children);
                return;
              }
              return;
            }
          }
          var childString = Object.prototype.toString.call(node);
          throw new Error("Objects are not valid as a React child (found: " + (childString === "[object Object]" ? "object with keys {" + Object.keys(node).join(", ") + "}" : childString) + "). If you meant to render a collection of children, use an array instead.");
        }
        if (typeof node === "string") {
          var segment = task.blockedSegment;
          segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, node, request.responseState, segment.lastPushedText);
          return;
        }
        if (typeof node === "number") {
          var _segment = task.blockedSegment;
          _segment.lastPushedText = pushTextInstance(task.blockedSegment.chunks, "" + node, request.responseState, _segment.lastPushedText);
          return;
        }
        {
          if (typeof node === "function") {
            error("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
          }
        }
      }
      function renderChildrenArray(request, task, children) {
        var totalChildren = children.length;
        for (var i = 0; i < totalChildren; i++) {
          var prevTreeContext = task.treeContext;
          task.treeContext = pushTreeContext(prevTreeContext, totalChildren, i);
          try {
            renderNode(request, task, children[i]);
          } finally {
            task.treeContext = prevTreeContext;
          }
        }
      }
      function spawnNewSuspendedTask(request, task, x2) {
        var segment = task.blockedSegment;
        var insertionIndex = segment.chunks.length;
        var newSegment = createPendingSegment(
          request,
          insertionIndex,
          null,
          segment.formatContext,
          // Adopt the parent segment's leading text embed
          segment.lastPushedText,
          // Assume we are text embedded at the trailing edge
          true
        );
        segment.children.push(newSegment);
        segment.lastPushedText = false;
        var newTask = createTask(request, task.node, task.blockedBoundary, newSegment, task.abortSet, task.legacyContext, task.context, task.treeContext);
        {
          if (task.componentStack !== null) {
            newTask.componentStack = task.componentStack.parent;
          }
        }
        var ping = newTask.ping;
        x2.then(ping, ping);
      }
      function renderNode(request, task, node) {
        var previousFormatContext = task.blockedSegment.formatContext;
        var previousLegacyContext = task.legacyContext;
        var previousContext = task.context;
        var previousComponentStack = null;
        {
          previousComponentStack = task.componentStack;
        }
        try {
          return renderNodeDestructive(request, task, node);
        } catch (x2) {
          resetHooksState();
          if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") {
            spawnNewSuspendedTask(request, task, x2);
            task.blockedSegment.formatContext = previousFormatContext;
            task.legacyContext = previousLegacyContext;
            task.context = previousContext;
            switchContext(previousContext);
            {
              task.componentStack = previousComponentStack;
            }
            return;
          } else {
            task.blockedSegment.formatContext = previousFormatContext;
            task.legacyContext = previousLegacyContext;
            task.context = previousContext;
            switchContext(previousContext);
            {
              task.componentStack = previousComponentStack;
            }
            throw x2;
          }
        }
      }
      function erroredTask(request, boundary, segment, error2) {
        var errorDigest = logRecoverableError(request, error2);
        if (boundary === null) {
          fatalError(request, error2);
        } else {
          boundary.pendingTasks--;
          if (!boundary.forceClientRender) {
            boundary.forceClientRender = true;
            boundary.errorDigest = errorDigest;
            {
              captureBoundaryErrorDetailsDev(boundary, error2);
            }
            if (boundary.parentFlushed) {
              request.clientRenderedBoundaries.push(boundary);
            }
          }
        }
        request.allPendingTasks--;
        if (request.allPendingTasks === 0) {
          var onAllReady = request.onAllReady;
          onAllReady();
        }
      }
      function abortTaskSoft(task) {
        var request = this;
        var boundary = task.blockedBoundary;
        var segment = task.blockedSegment;
        segment.status = ABORTED;
        finishedTask(request, boundary, segment);
      }
      function abortTask(task, request, reason) {
        var boundary = task.blockedBoundary;
        var segment = task.blockedSegment;
        segment.status = ABORTED;
        if (boundary === null) {
          request.allPendingTasks--;
          if (request.status !== CLOSED) {
            request.status = CLOSED;
            if (request.destination !== null) {
              close(request.destination);
            }
          }
        } else {
          boundary.pendingTasks--;
          if (!boundary.forceClientRender) {
            boundary.forceClientRender = true;
            var _error = reason === void 0 ? new Error("The render was aborted by the server without a reason.") : reason;
            boundary.errorDigest = request.onError(_error);
            {
              var errorPrefix = "The server did not finish this Suspense boundary: ";
              if (_error && typeof _error.message === "string") {
                _error = errorPrefix + _error.message;
              } else {
                _error = errorPrefix + String(_error);
              }
              var previousTaskInDev = currentTaskInDEV;
              currentTaskInDEV = task;
              try {
                captureBoundaryErrorDetailsDev(boundary, _error);
              } finally {
                currentTaskInDEV = previousTaskInDev;
              }
            }
            if (boundary.parentFlushed) {
              request.clientRenderedBoundaries.push(boundary);
            }
          }
          boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
            return abortTask(fallbackTask, request, reason);
          });
          boundary.fallbackAbortableTasks.clear();
          request.allPendingTasks--;
          if (request.allPendingTasks === 0) {
            var onAllReady = request.onAllReady;
            onAllReady();
          }
        }
      }
      function queueCompletedSegment(boundary, segment) {
        if (segment.chunks.length === 0 && segment.children.length === 1 && segment.children[0].boundary === null) {
          var childSegment = segment.children[0];
          childSegment.id = segment.id;
          childSegment.parentFlushed = true;
          if (childSegment.status === COMPLETED) {
            queueCompletedSegment(boundary, childSegment);
          }
        } else {
          var completedSegments = boundary.completedSegments;
          completedSegments.push(segment);
        }
      }
      function finishedTask(request, boundary, segment) {
        if (boundary === null) {
          if (segment.parentFlushed) {
            if (request.completedRootSegment !== null) {
              throw new Error("There can only be one root segment. This is a bug in React.");
            }
            request.completedRootSegment = segment;
          }
          request.pendingRootTasks--;
          if (request.pendingRootTasks === 0) {
            request.onShellError = noop$1;
            var onShellReady = request.onShellReady;
            onShellReady();
          }
        } else {
          boundary.pendingTasks--;
          if (boundary.forceClientRender) ;
          else if (boundary.pendingTasks === 0) {
            if (segment.parentFlushed) {
              if (segment.status === COMPLETED) {
                queueCompletedSegment(boundary, segment);
              }
            }
            if (boundary.parentFlushed) {
              request.completedBoundaries.push(boundary);
            }
            boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request);
            boundary.fallbackAbortableTasks.clear();
          } else {
            if (segment.parentFlushed) {
              if (segment.status === COMPLETED) {
                queueCompletedSegment(boundary, segment);
                var completedSegments = boundary.completedSegments;
                if (completedSegments.length === 1) {
                  if (boundary.parentFlushed) {
                    request.partialBoundaries.push(boundary);
                  }
                }
              }
            }
          }
        }
        request.allPendingTasks--;
        if (request.allPendingTasks === 0) {
          var onAllReady = request.onAllReady;
          onAllReady();
        }
      }
      function retryTask(request, task) {
        var segment = task.blockedSegment;
        if (segment.status !== PENDING) {
          return;
        }
        switchContext(task.context);
        var prevTaskInDEV = null;
        {
          prevTaskInDEV = currentTaskInDEV;
          currentTaskInDEV = task;
        }
        try {
          renderNodeDestructive(request, task, task.node);
          pushSegmentFinale(segment.chunks, request.responseState, segment.lastPushedText, segment.textEmbedded);
          task.abortSet.delete(task);
          segment.status = COMPLETED;
          finishedTask(request, task.blockedBoundary, segment);
        } catch (x2) {
          resetHooksState();
          if (typeof x2 === "object" && x2 !== null && typeof x2.then === "function") {
            var ping = task.ping;
            x2.then(ping, ping);
          } else {
            task.abortSet.delete(task);
            segment.status = ERRORED;
            erroredTask(request, task.blockedBoundary, segment, x2);
          }
        } finally {
          {
            currentTaskInDEV = prevTaskInDEV;
          }
        }
      }
      function performWork(request) {
        if (request.status === CLOSED) {
          return;
        }
        var prevContext = getActiveContext();
        var prevDispatcher = ReactCurrentDispatcher$1.current;
        ReactCurrentDispatcher$1.current = Dispatcher;
        var prevGetCurrentStackImpl;
        {
          prevGetCurrentStackImpl = ReactDebugCurrentFrame$1.getCurrentStack;
          ReactDebugCurrentFrame$1.getCurrentStack = getCurrentStackInDEV;
        }
        var prevResponseState = currentResponseState;
        setCurrentResponseState(request.responseState);
        try {
          var pingedTasks = request.pingedTasks;
          var i;
          for (i = 0; i < pingedTasks.length; i++) {
            var task = pingedTasks[i];
            retryTask(request, task);
          }
          pingedTasks.splice(0, i);
          if (request.destination !== null) {
            flushCompletedQueues(request, request.destination);
          }
        } catch (error2) {
          logRecoverableError(request, error2);
          fatalError(request, error2);
        } finally {
          setCurrentResponseState(prevResponseState);
          ReactCurrentDispatcher$1.current = prevDispatcher;
          {
            ReactDebugCurrentFrame$1.getCurrentStack = prevGetCurrentStackImpl;
          }
          if (prevDispatcher === Dispatcher) {
            switchContext(prevContext);
          }
        }
      }
      function flushSubtree(request, destination, segment) {
        segment.parentFlushed = true;
        switch (segment.status) {
          case PENDING: {
            var segmentID = segment.id = request.nextSegmentId++;
            segment.lastPushedText = false;
            segment.textEmbedded = false;
            return writePlaceholder(destination, request.responseState, segmentID);
          }
          case COMPLETED: {
            segment.status = FLUSHED;
            var r = true;
            var chunks = segment.chunks;
            var chunkIdx = 0;
            var children = segment.children;
            for (var childIdx = 0; childIdx < children.length; childIdx++) {
              var nextChild = children[childIdx];
              for (; chunkIdx < nextChild.index; chunkIdx++) {
                writeChunk(destination, chunks[chunkIdx]);
              }
              r = flushSegment(request, destination, nextChild);
            }
            for (; chunkIdx < chunks.length - 1; chunkIdx++) {
              writeChunk(destination, chunks[chunkIdx]);
            }
            if (chunkIdx < chunks.length) {
              r = writeChunkAndReturn(destination, chunks[chunkIdx]);
            }
            return r;
          }
          default: {
            throw new Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
          }
        }
      }
      function flushSegment(request, destination, segment) {
        var boundary = segment.boundary;
        if (boundary === null) {
          return flushSubtree(request, destination, segment);
        }
        boundary.parentFlushed = true;
        if (boundary.forceClientRender) {
          writeStartClientRenderedSuspenseBoundary(destination, request.responseState, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
          flushSubtree(request, destination, segment);
          return writeEndClientRenderedSuspenseBoundary(destination, request.responseState);
        } else if (boundary.pendingTasks > 0) {
          boundary.rootSegmentID = request.nextSegmentId++;
          if (boundary.completedSegments.length > 0) {
            request.partialBoundaries.push(boundary);
          }
          var id = boundary.id = assignSuspenseBoundaryID(request.responseState);
          writeStartPendingSuspenseBoundary(destination, request.responseState, id);
          flushSubtree(request, destination, segment);
          return writeEndPendingSuspenseBoundary(destination, request.responseState);
        } else if (boundary.byteSize > request.progressiveChunkSize) {
          boundary.rootSegmentID = request.nextSegmentId++;
          request.completedBoundaries.push(boundary);
          writeStartPendingSuspenseBoundary(destination, request.responseState, boundary.id);
          flushSubtree(request, destination, segment);
          return writeEndPendingSuspenseBoundary(destination, request.responseState);
        } else {
          writeStartCompletedSuspenseBoundary(destination, request.responseState);
          var completedSegments = boundary.completedSegments;
          if (completedSegments.length !== 1) {
            throw new Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
          }
          var contentSegment = completedSegments[0];
          flushSegment(request, destination, contentSegment);
          return writeEndCompletedSuspenseBoundary(destination, request.responseState);
        }
      }
      function flushClientRenderedBoundary(request, destination, boundary) {
        return writeClientRenderBoundaryInstruction(destination, request.responseState, boundary.id, boundary.errorDigest, boundary.errorMessage, boundary.errorComponentStack);
      }
      function flushSegmentContainer(request, destination, segment) {
        writeStartSegment(destination, request.responseState, segment.formatContext, segment.id);
        flushSegment(request, destination, segment);
        return writeEndSegment(destination, segment.formatContext);
      }
      function flushCompletedBoundary(request, destination, boundary) {
        var completedSegments = boundary.completedSegments;
        var i = 0;
        for (; i < completedSegments.length; i++) {
          var segment = completedSegments[i];
          flushPartiallyCompletedSegment(request, destination, boundary, segment);
        }
        completedSegments.length = 0;
        return writeCompletedBoundaryInstruction(destination, request.responseState, boundary.id, boundary.rootSegmentID);
      }
      function flushPartialBoundary(request, destination, boundary) {
        var completedSegments = boundary.completedSegments;
        var i = 0;
        for (; i < completedSegments.length; i++) {
          var segment = completedSegments[i];
          if (!flushPartiallyCompletedSegment(request, destination, boundary, segment)) {
            i++;
            completedSegments.splice(0, i);
            return false;
          }
        }
        completedSegments.splice(0, i);
        return true;
      }
      function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
        if (segment.status === FLUSHED) {
          return true;
        }
        var segmentID = segment.id;
        if (segmentID === -1) {
          var rootSegmentID = segment.id = boundary.rootSegmentID;
          if (rootSegmentID === -1) {
            throw new Error("A root segment ID must have been assigned by now. This is a bug in React.");
          }
          return flushSegmentContainer(request, destination, segment);
        } else {
          flushSegmentContainer(request, destination, segment);
          return writeCompletedSegmentInstruction(destination, request.responseState, segmentID);
        }
      }
      function flushCompletedQueues(request, destination) {
        beginWriting();
        try {
          var completedRootSegment = request.completedRootSegment;
          if (completedRootSegment !== null && request.pendingRootTasks === 0) {
            flushSegment(request, destination, completedRootSegment);
            request.completedRootSegment = null;
            writeCompletedRoot(destination, request.responseState);
          }
          var clientRenderedBoundaries = request.clientRenderedBoundaries;
          var i;
          for (i = 0; i < clientRenderedBoundaries.length; i++) {
            var boundary = clientRenderedBoundaries[i];
            if (!flushClientRenderedBoundary(request, destination, boundary)) {
              request.destination = null;
              i++;
              clientRenderedBoundaries.splice(0, i);
              return;
            }
          }
          clientRenderedBoundaries.splice(0, i);
          var completedBoundaries = request.completedBoundaries;
          for (i = 0; i < completedBoundaries.length; i++) {
            var _boundary = completedBoundaries[i];
            if (!flushCompletedBoundary(request, destination, _boundary)) {
              request.destination = null;
              i++;
              completedBoundaries.splice(0, i);
              return;
            }
          }
          completedBoundaries.splice(0, i);
          completeWriting(destination);
          beginWriting(destination);
          var partialBoundaries = request.partialBoundaries;
          for (i = 0; i < partialBoundaries.length; i++) {
            var _boundary2 = partialBoundaries[i];
            if (!flushPartialBoundary(request, destination, _boundary2)) {
              request.destination = null;
              i++;
              partialBoundaries.splice(0, i);
              return;
            }
          }
          partialBoundaries.splice(0, i);
          var largeBoundaries = request.completedBoundaries;
          for (i = 0; i < largeBoundaries.length; i++) {
            var _boundary3 = largeBoundaries[i];
            if (!flushCompletedBoundary(request, destination, _boundary3)) {
              request.destination = null;
              i++;
              largeBoundaries.splice(0, i);
              return;
            }
          }
          largeBoundaries.splice(0, i);
        } finally {
          completeWriting(destination);
          flushBuffered(destination);
          if (request.allPendingTasks === 0 && request.pingedTasks.length === 0 && request.clientRenderedBoundaries.length === 0 && request.completedBoundaries.length === 0) {
            {
              if (request.abortableTasks.size !== 0) {
                error("There was still abortable task at the root when we closed. This is a bug in React.");
              }
            }
            close(destination);
          }
        }
      }
      function startWork(request) {
        scheduleWork(function() {
          return performWork(request);
        });
      }
      function startFlowing(request, destination) {
        if (request.status === CLOSING) {
          request.status = CLOSED;
          closeWithError(destination, request.fatalError);
          return;
        }
        if (request.status === CLOSED) {
          return;
        }
        if (request.destination !== null) {
          return;
        }
        request.destination = destination;
        try {
          flushCompletedQueues(request, destination);
        } catch (error2) {
          logRecoverableError(request, error2);
          fatalError(request, error2);
        }
      }
      function abort(request, reason) {
        try {
          var abortableTasks = request.abortableTasks;
          abortableTasks.forEach(function(task) {
            return abortTask(task, request, reason);
          });
          abortableTasks.clear();
          if (request.destination !== null) {
            flushCompletedQueues(request, request.destination);
          }
        } catch (error2) {
          logRecoverableError(request, error2);
          fatalError(request, error2);
        }
      }
      function createDrainHandler(destination, request) {
        return function() {
          return startFlowing(request, destination);
        };
      }
      function createAbortHandler(request, reason) {
        return function() {
          return abort(request, reason);
        };
      }
      function createRequestImpl(children, options) {
        return createRequest(children, createResponseState(options ? options.identifierPrefix : void 0, options ? options.nonce : void 0, options ? options.bootstrapScriptContent : void 0, options ? options.bootstrapScripts : void 0, options ? options.bootstrapModules : void 0), createRootFormatContext(options ? options.namespaceURI : void 0), options ? options.progressiveChunkSize : void 0, options ? options.onError : void 0, options ? options.onAllReady : void 0, options ? options.onShellReady : void 0, options ? options.onShellError : void 0);
      }
      function renderToPipeableStream(children, options) {
        var request = createRequestImpl(children, options);
        var hasStartedFlowing = false;
        startWork(request);
        return {
          pipe: function(destination) {
            if (hasStartedFlowing) {
              throw new Error("React currently only supports piping to one writable stream.");
            }
            hasStartedFlowing = true;
            startFlowing(request, destination);
            destination.on("drain", createDrainHandler(destination, request));
            destination.on("error", createAbortHandler(
              request,
              // eslint-disable-next-line react-internal/prod-error-codes
              new Error("The destination stream errored while writing data.")
            ));
            destination.on("close", createAbortHandler(
              request,
              // eslint-disable-next-line react-internal/prod-error-codes
              new Error("The destination stream closed early.")
            ));
            return destination;
          },
          abort: function(reason) {
            abort(request, reason);
          }
        };
      }
      reactDomServer_node_development.renderToPipeableStream = renderToPipeableStream;
      reactDomServer_node_development.version = ReactVersion;
    })();
  }
  return reactDomServer_node_development;
}
var hasRequiredServer_node;
function requireServer_node() {
  if (hasRequiredServer_node) return server_node;
  hasRequiredServer_node = 1;
  var l, s;
  if (process.env.NODE_ENV === "production") {
    l = requireReactDomServerLegacy_node_production_min();
    s = requireReactDomServer_node_production_min();
  } else {
    l = requireReactDomServerLegacy_node_development();
    s = requireReactDomServer_node_development();
  }
  server_node.version = l.version;
  server_node.renderToString = l.renderToString;
  server_node.renderToStaticMarkup = l.renderToStaticMarkup;
  server_node.renderToNodeStream = l.renderToNodeStream;
  server_node.renderToStaticNodeStream = l.renderToStaticNodeStream;
  server_node.renderToPipeableStream = s.renderToPipeableStream;
  return server_node;
}
var server_nodeExports = requireServer_node();
const ReactDOMServer = /* @__PURE__ */ getDefaultExportFromCjs(server_nodeExports);
var fullPattern = " daum[ /]| deusu/|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|(?<!cam)scan|24x7|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\bperl\\b|\\btime/|\\||^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\W|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^active|^ad muncher|^amaya|^avsdevicesdk/|^azure|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\(compatible;?(?:\\s\\w+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|agent\\b|analyzer|archive|ask jeeves/teoma|audit|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|evc-batch/|exaleadcloudview|feed|fetcher|firephp|functionize|grab|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|infrawatch|insight|inspect|iplabel|java(?!;)|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node\\b|nutch|offbyone|onetrust|optimize|pageburst|pagespeed|parser|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|retriever|rexx;|rigor|rss\\b|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|transcoder|url|validator|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|xtate/";
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  try {
    pattern = new RegExp(fullPattern, "i");
  } catch (error) {
    pattern = naivePattern;
  }
  return pattern;
}
function isbot(userAgent) {
  return Boolean(userAgent) && getPattern().test(userAgent);
}
const renderRouterToStream = async ({
  request,
  router,
  responseHeaders,
  children
}) => {
  if (typeof ReactDOMServer.renderToReadableStream === "function") {
    const stream = await ReactDOMServer.renderToReadableStream(children, {
      signal: request.signal,
      nonce: router.options.ssr?.nonce,
      progressiveChunkSize: Number.POSITIVE_INFINITY
    });
    if (isbot(request.headers.get("User-Agent"))) {
      await stream.allReady;
    }
    const responseStream = transformReadableStreamWithRouter(
      router,
      stream
    );
    return new Response(responseStream, {
      status: router.state.statusCode,
      headers: responseHeaders
    });
  }
  if (typeof ReactDOMServer.renderToPipeableStream === "function") {
    const reactAppPassthrough = new PassThrough();
    try {
      const pipeable = ReactDOMServer.renderToPipeableStream(children, {
        nonce: router.options.ssr?.nonce,
        progressiveChunkSize: Number.POSITIVE_INFINITY,
        ...isbot(request.headers.get("User-Agent")) ? {
          onAllReady() {
            pipeable.pipe(reactAppPassthrough);
          }
        } : {
          onShellReady() {
            pipeable.pipe(reactAppPassthrough);
          }
        },
        onError: (error, info) => {
          console.error("Error in renderToPipeableStream:", error, info);
          if (!reactAppPassthrough.destroyed) {
            reactAppPassthrough.destroy(
              error instanceof Error ? error : new Error(String(error))
            );
          }
        }
      });
    } catch (e) {
      console.error("Error in renderToPipeableStream:", e);
      reactAppPassthrough.destroy(e instanceof Error ? e : new Error(String(e)));
    }
    const responseStream = transformPipeableStreamWithRouter(
      router,
      reactAppPassthrough
    );
    return new Response(responseStream, {
      status: router.state.statusCode,
      headers: responseHeaders
    });
  }
  throw new Error(
    "No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming."
  );
};
const defaultStreamHandler = defineHandlerCallback(
  ({ request, router, responseHeaders }) => renderRouterToStream({
    request,
    router,
    responseHeaders,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(StartServer, { router })
  })
);
const TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
const TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
const X_TSS_SERIALIZED = "x-tss-serialized";
const X_TSS_RAW_RESPONSE = "x-tss-raw";
const TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
const FrameType = {
  /** Seroval JSON chunk (NDJSON line) */
  JSON: 0,
  /** Raw stream data chunk */
  CHUNK: 1,
  /** Raw stream end (EOF) */
  END: 2,
  /** Raw stream error */
  ERROR: 3
};
const FRAME_HEADER_SIZE = 9;
const TSS_FRAMED_PROTOCOL_VERSION = 1;
const TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=${TSS_FRAMED_PROTOCOL_VERSION}`;
const GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
const globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_STORAGE_KEY]) {
  globalObj$1[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
}
const startStorage = globalObj$1[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn2) {
  return startStorage.run(context, fn2);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) {
    throw new Error(
      `No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return context;
}
const getStartOptions = () => getStartContext().startOptions;
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) {
      if (isSafeKey(key)) result[key] = target[key];
    }
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) {
      if (isSafeKey(key)) result[key] = source[key];
    }
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) {
    if (isSafeKey(key)) obj[key] = source[key];
  }
  return obj;
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) {
      throw new Error(
        `Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`
      );
    }
    middleware.forEach((m2) => {
      if (m2.options.middleware) {
        recurse(m2.options.middleware, depth + 1);
      }
      if (!seen.has(m2)) {
        seen.add(m2);
        flattened.push(m2);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
function getDefaultSerovalPlugins() {
  const start = getStartOptions();
  const adapters = start?.serializationAdapters;
  return [
    ...adapters?.map(makeSerovalPlugin) ?? [],
    ...defaultSerovalPlugins
  ];
}
const NullProtoObj = /* @__PURE__ */ (() => {
  const e = function() {
  };
  return e.prototype = /* @__PURE__ */ Object.create(null), Object.freeze(e.prototype), e;
})();
function lazyInherit(target, source, sourceKey) {
  for (const key of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
    if (key === "constructor") continue;
    const targetDesc = Object.getOwnPropertyDescriptor(target, key);
    const desc = Object.getOwnPropertyDescriptor(source, key);
    let modified = false;
    if (desc.get) {
      modified = true;
      desc.get = targetDesc?.get || function() {
        return this[sourceKey][key];
      };
    }
    if (desc.set) {
      modified = true;
      desc.set = targetDesc?.set || function(value) {
        this[sourceKey][key] = value;
      };
    }
    if (!targetDesc?.value && typeof desc.value === "function") {
      modified = true;
      desc.value = function(...args) {
        return this[sourceKey][key](...args);
      };
    }
    if (modified) Object.defineProperty(target, key, desc);
  }
}
const FastURL = /* @__PURE__ */ (() => {
  const NativeURL = globalThis.URL;
  const FastURL$1 = class URL {
    #url;
    #href;
    #protocol;
    #host;
    #pathname;
    #search;
    #searchParams;
    #pos;
    constructor(url) {
      if (typeof url === "string") this.#href = url;
      else {
        this.#protocol = url.protocol;
        this.#host = url.host;
        this.#pathname = url.pathname;
        this.#search = url.search;
      }
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeURL;
    }
    get _url() {
      if (this.#url) return this.#url;
      this.#url = new NativeURL(this.href);
      this.#href = void 0;
      this.#protocol = void 0;
      this.#host = void 0;
      this.#pathname = void 0;
      this.#search = void 0;
      this.#searchParams = void 0;
      this.#pos = void 0;
      return this.#url;
    }
    get href() {
      if (this.#url) return this.#url.href;
      if (!this.#href) this.#href = `${this.#protocol || "http:"}//${this.#host || "localhost"}${this.#pathname || "/"}${this.#search || ""}`;
      return this.#href;
    }
    #getPos() {
      if (!this.#pos) {
        const url = this.href;
        const protoIndex = url.indexOf("://");
        const pathnameIndex = protoIndex === -1 ? -1 : url.indexOf("/", protoIndex + 4);
        this.#pos = [
          protoIndex,
          pathnameIndex,
          pathnameIndex === -1 ? -1 : url.indexOf("?", pathnameIndex)
        ];
      }
      return this.#pos;
    }
    get pathname() {
      if (this.#url) return this.#url.pathname;
      if (this.#pathname === void 0) {
        const [, pathnameIndex, queryIndex] = this.#getPos();
        if (pathnameIndex === -1) return this._url.pathname;
        this.#pathname = this.href.slice(pathnameIndex, queryIndex === -1 ? void 0 : queryIndex);
      }
      return this.#pathname;
    }
    get search() {
      if (this.#url) return this.#url.search;
      if (this.#search === void 0) {
        const [, pathnameIndex, queryIndex] = this.#getPos();
        if (pathnameIndex === -1) return this._url.search;
        const url = this.href;
        this.#search = queryIndex === -1 || queryIndex === url.length - 1 ? "" : url.slice(queryIndex);
      }
      return this.#search;
    }
    get searchParams() {
      if (this.#url) return this.#url.searchParams;
      if (!this.#searchParams) this.#searchParams = new URLSearchParams(this.search);
      return this.#searchParams;
    }
    get protocol() {
      if (this.#url) return this.#url.protocol;
      if (this.#protocol === void 0) {
        const [protocolIndex] = this.#getPos();
        if (protocolIndex === -1) return this._url.protocol;
        this.#protocol = this.href.slice(0, protocolIndex + 1);
      }
      return this.#protocol;
    }
    toString() {
      return this.href;
    }
    toJSON() {
      return this.href;
    }
  };
  lazyInherit(FastURL$1.prototype, NativeURL.prototype, "_url");
  Object.setPrototypeOf(FastURL$1.prototype, NativeURL.prototype);
  Object.setPrototypeOf(FastURL$1, NativeURL);
  return FastURL$1;
})();
const NodeResponse = /* @__PURE__ */ (() => {
  const NativeResponse = globalThis.Response;
  const STATUS_CODES = globalThis.process?.getBuiltinModule?.("node:http")?.STATUS_CODES || {};
  class NodeResponse$1 {
    #body;
    #init;
    #headers;
    #response;
    constructor(body, init) {
      this.#body = body;
      this.#init = init;
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeResponse;
    }
    get status() {
      return this.#response?.status || this.#init?.status || 200;
    }
    get statusText() {
      return this.#response?.statusText || this.#init?.statusText || STATUS_CODES[this.status] || "";
    }
    get headers() {
      if (this.#response) return this.#response.headers;
      if (this.#headers) return this.#headers;
      const initHeaders = this.#init?.headers;
      return this.#headers = initHeaders instanceof Headers ? initHeaders : new Headers(initHeaders);
    }
    get ok() {
      if (this.#response) return this.#response.ok;
      const status = this.status;
      return status >= 200 && status < 300;
    }
    get _response() {
      if (this.#response) return this.#response;
      this.#response = new NativeResponse(this.#body, this.#headers ? {
        ...this.#init,
        headers: this.#headers
      } : this.#init);
      this.#init = void 0;
      this.#headers = void 0;
      this.#body = void 0;
      return this.#response;
    }
    _toNodeResponse() {
      const status = this.status;
      const statusText = this.statusText;
      let body;
      let contentType;
      let contentLength;
      if (this.#response) body = this.#response.body;
      else if (this.#body) if (this.#body instanceof ReadableStream) body = this.#body;
      else if (typeof this.#body === "string") {
        body = this.#body;
        contentType = "text/plain; charset=UTF-8";
        contentLength = Buffer.byteLength(this.#body);
      } else if (this.#body instanceof ArrayBuffer) {
        body = Buffer.from(this.#body);
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof Uint8Array) {
        body = this.#body;
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof DataView) {
        body = Buffer.from(this.#body.buffer);
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof Blob) {
        body = this.#body.stream();
        contentType = this.#body.type;
        contentLength = this.#body.size;
      } else if (typeof this.#body.pipe === "function") body = this.#body;
      else body = this._response.body;
      const headers = [];
      const initHeaders = this.#init?.headers;
      const headerEntries = this.#response?.headers || this.#headers || (initHeaders ? Array.isArray(initHeaders) ? initHeaders : initHeaders?.entries ? initHeaders.entries() : Object.entries(initHeaders).map(([k2, v2]) => [k2.toLowerCase(), v2]) : void 0);
      let hasContentTypeHeader;
      let hasContentLength;
      if (headerEntries) for (const [key, value] of headerEntries) {
        if (Array.isArray(value)) for (const v2 of value) headers.push([key, v2]);
        else headers.push([key, value]);
        if (key === "content-type") hasContentTypeHeader = true;
        else if (key === "content-length") hasContentLength = true;
      }
      if (contentType && !hasContentTypeHeader) headers.push(["content-type", contentType]);
      if (contentLength && !hasContentLength) headers.push(["content-length", String(contentLength)]);
      this.#init = void 0;
      this.#headers = void 0;
      this.#response = void 0;
      this.#body = void 0;
      return {
        status,
        statusText,
        headers,
        body
      };
    }
  }
  lazyInherit(NodeResponse$1.prototype, NativeResponse.prototype, "_response");
  Object.setPrototypeOf(NodeResponse$1, NativeResponse);
  Object.setPrototypeOf(NodeResponse$1.prototype, NativeResponse.prototype);
  return NodeResponse$1;
})();
const kEventNS = "h3.internal.event.";
const kEventRes = /* @__PURE__ */ Symbol.for(`${kEventNS}res`);
const kEventResHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.headers`);
var H3Event = class {
  app;
  req;
  url;
  context;
  static __is_event__ = true;
  constructor(req, context, app) {
    this.context = context || req.context || new NullProtoObj();
    this.req = req;
    this.app = app;
    const _url = req._url;
    this.url = _url && _url instanceof URL ? _url : new FastURL(req.url);
  }
  get res() {
    return this[kEventRes] ||= new H3EventResponse();
  }
  get runtime() {
    return this.req.runtime;
  }
  waitUntil(promise) {
    this.req.waitUntil?.(promise);
  }
  toString() {
    return `[${this.req.method}] ${this.req.url}`;
  }
  toJSON() {
    return this.toString();
  }
  get node() {
    return this.req.runtime?.node;
  }
  get headers() {
    return this.req.headers;
  }
  get path() {
    return this.url.pathname + this.url.search;
  }
  get method() {
    return this.req.method;
  }
};
var H3EventResponse = class {
  status;
  statusText;
  get headers() {
    return this[kEventResHeaders] ||= new Headers();
  }
};
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) return defaultStatusCode;
  if (typeof statusCode === "string") statusCode = +statusCode;
  if (statusCode < 100 || statusCode > 599) return defaultStatusCode;
  return statusCode;
}
var HTTPError = class HTTPError2 extends Error {
  get name() {
    return "HTTPError";
  }
  status;
  statusText;
  headers;
  cause;
  data;
  body;
  unhandled;
  static isError(input) {
    return input instanceof Error && input?.name === "HTTPError";
  }
  static status(status, statusText, details) {
    return new HTTPError2({
      ...details,
      statusText,
      status
    });
  }
  constructor(arg1, arg2) {
    let messageInput;
    let details;
    if (typeof arg1 === "string") {
      messageInput = arg1;
      details = arg2;
    } else details = arg1;
    const status = sanitizeStatusCode(details?.status || details?.cause?.status || details?.status || details?.statusCode, 500);
    const statusText = sanitizeStatusMessage(details?.statusText || details?.cause?.statusText || details?.statusText || details?.statusMessage);
    const message = messageInput || details?.message || details?.cause?.message || details?.statusText || details?.statusMessage || [
      "HTTPError",
      status,
      statusText
    ].filter(Boolean).join(" ");
    super(message, { cause: details });
    this.cause = details;
    Error.captureStackTrace?.(this, this.constructor);
    this.status = status;
    this.statusText = statusText || void 0;
    const rawHeaders = details?.headers || details?.cause?.headers;
    this.headers = rawHeaders ? new Headers(rawHeaders) : void 0;
    this.unhandled = details?.unhandled ?? details?.cause?.unhandled ?? void 0;
    this.data = details?.data;
    this.body = details?.body;
  }
  get statusCode() {
    return this.status;
  }
  get statusMessage() {
    return this.statusText;
  }
  toJSON() {
    const unhandled = this.unhandled;
    return {
      status: this.status,
      statusText: this.statusText,
      unhandled,
      message: unhandled ? "HTTPError" : this.message,
      data: unhandled ? void 0 : this.data,
      ...unhandled ? void 0 : this.body
    };
  }
};
function isJSONSerializable(value, _type) {
  if (value === null || value === void 0) return true;
  if (_type !== "object") return _type === "boolean" || _type === "number" || _type === "string";
  if (typeof value.toJSON === "function") return true;
  if (Array.isArray(value)) return true;
  if (typeof value.pipe === "function" || typeof value.pipeTo === "function") return false;
  if (value instanceof NullProtoObj) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
const kNotFound = /* @__PURE__ */ Symbol.for("h3.notFound");
const kHandled = /* @__PURE__ */ Symbol.for("h3.handled");
function toResponse(val, event, config = {}) {
  if (typeof val?.then === "function") return (val.catch?.((error) => error) || Promise.resolve(val)).then((resolvedVal) => toResponse(resolvedVal, event, config));
  const response = prepareResponse(val, event, config);
  if (typeof response?.then === "function") return toResponse(response, event, config);
  const { onResponse: onResponse$1 } = config;
  return onResponse$1 ? Promise.resolve(onResponse$1(response, event)).then(() => response) : response;
}
var HTTPResponse = class {
  #headers;
  #init;
  body;
  constructor(body, init) {
    this.body = body;
    this.#init = init;
  }
  get status() {
    return this.#init?.status || 200;
  }
  get statusText() {
    return this.#init?.statusText || "OK";
  }
  get headers() {
    return this.#headers ||= new Headers(this.#init?.headers);
  }
};
function prepareResponse(val, event, config, nested) {
  if (val === kHandled) return new NodeResponse(null);
  if (val === kNotFound) val = new HTTPError({
    status: 404,
    message: `Cannot find any route matching [${event.req.method}] ${event.url}`
  });
  if (val && val instanceof Error) {
    const isHTTPError = HTTPError.isError(val);
    const error = isHTTPError ? val : new HTTPError(val);
    if (!isHTTPError) {
      error.unhandled = true;
      if (val?.stack) error.stack = val.stack;
    }
    if (error.unhandled && !config.silent) console.error(error);
    const { onError: onError$1 } = config;
    return onError$1 && !nested ? Promise.resolve(onError$1(error, event)).catch((error$1) => error$1).then((newVal) => prepareResponse(newVal ?? val, event, config, true)) : errorResponse(error, config.debug);
  }
  const preparedRes = event[kEventRes];
  const preparedHeaders = preparedRes?.[kEventResHeaders];
  event[kEventRes] = void 0;
  if (!(val instanceof Response)) {
    const res = prepareResponseBody(val, event, config);
    const status = res.status || preparedRes?.status;
    return new NodeResponse(nullBody(event.req.method, status) ? null : res.body, {
      status,
      statusText: res.statusText || preparedRes?.statusText,
      headers: res.headers && preparedHeaders ? mergeHeaders$1(res.headers, preparedHeaders) : res.headers || preparedHeaders
    });
  }
  if (!preparedHeaders || nested || !val.ok) return val;
  try {
    mergeHeaders$1(val.headers, preparedHeaders, val.headers);
    return val;
  } catch {
    return new NodeResponse(nullBody(event.req.method, val.status) ? null : val.body, {
      status: val.status,
      statusText: val.statusText,
      headers: mergeHeaders$1(val.headers, preparedHeaders)
    });
  }
}
function mergeHeaders$1(base, overrides, target = new Headers(base)) {
  for (const [name, value] of overrides) if (name === "set-cookie") target.append(name, value);
  else target.set(name, value);
  return target;
}
const frozenHeaders = () => {
  throw new Error("Headers are frozen");
};
var FrozenHeaders = class extends Headers {
  constructor(init) {
    super(init);
    this.set = this.append = this.delete = frozenHeaders;
  }
};
const emptyHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-length": "0" });
const jsonHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-type": "application/json;charset=UTF-8" });
function prepareResponseBody(val, event, config) {
  if (val === null || val === void 0) return {
    body: "",
    headers: emptyHeaders
  };
  const valType = typeof val;
  if (valType === "string") return { body: val };
  if (val instanceof Uint8Array) {
    event.res.headers.set("content-length", val.byteLength.toString());
    return { body: val };
  }
  if (val instanceof HTTPResponse || val?.constructor?.name === "HTTPResponse") return val;
  if (isJSONSerializable(val, valType)) return {
    body: JSON.stringify(val, void 0, config.debug ? 2 : void 0),
    headers: jsonHeaders
  };
  if (valType === "bigint") return {
    body: val.toString(),
    headers: jsonHeaders
  };
  if (val instanceof Blob) {
    const headers = new Headers({
      "content-type": val.type,
      "content-length": val.size.toString()
    });
    let filename = val.name;
    if (filename) {
      filename = encodeURIComponent(filename);
      headers.set("content-disposition", `filename="${filename}"; filename*=UTF-8''${filename}`);
    }
    return {
      body: val.stream(),
      headers
    };
  }
  if (valType === "symbol") return { body: val.toString() };
  if (valType === "function") return { body: `${val.name}()` };
  return { body: val };
}
function nullBody(method, status) {
  return method === "HEAD" || status === 100 || status === 101 || status === 102 || status === 204 || status === 205 || status === 304;
}
function errorResponse(error, debug) {
  return new NodeResponse(JSON.stringify({
    ...error.toJSON(),
    stack: debug && error.stack ? error.stack.split("\n").map((l) => l.trim()) : void 0
  }, void 0, debug ? 2 : void 0), {
    status: error.status,
    statusText: error.statusText,
    headers: error.headers ? mergeHeaders$1(jsonHeaders, error.headers) : new Headers(jsonHeaders)
  });
}
const GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
const globalObj = globalThis;
if (!globalObj[GLOBAL_EVENT_STORAGE_KEY]) {
  globalObj[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
}
const eventStorage = globalObj[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") {
    return headersWithSetCookie.getSetCookie();
  }
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) {
    return;
  }
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) {
    return;
  }
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
  for (const cookie of eventSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
}
function attachResponseHeaders(value, event) {
  if (isPromiseLike(value)) {
    return value.then((resolved) => {
      if (resolved instanceof Response) {
        mergeEventResponseHeaders(resolved, event);
      }
      return resolved;
    });
  }
  if (value instanceof Response) {
    mergeEventResponseHeaders(value, event);
  }
  return value;
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    const h3Event = new H3Event(request);
    const response = eventStorage.run(
      { h3Event },
      () => handler(request, requestOpts)
    );
    return toResponse(attachResponseHeaders(response, h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event.h3Event;
}
function getResponse() {
  const event = getH3Event();
  return event.res;
}
async function getStartManifest() {
  const { tsrStartManifest } = await import("./assets/_tanstack-start-manifest_v-DgCUEgqX.js");
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      async: true
    },
    children: script
  });
  const manifest2 = {
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).flatMap(([k2, v2]) => {
        const result = {};
        let hasData = false;
        if (v2.preloads && v2.preloads.length > 0) {
          result["preloads"] = v2.preloads;
          hasData = true;
        }
        if (v2.assets && v2.assets.length > 0) {
          result["assets"] = v2.assets;
          hasData = true;
        }
        if (!hasData) {
          return [];
        }
        return [[k2, result]];
      })
    )
  };
  return manifest2;
}
const textEncoder$1 = new TextEncoder();
const EMPTY_PAYLOAD = new Uint8Array(0);
function encodeFrame(type, streamId, payload) {
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = streamId >>> 24 & 255;
  frame[2] = streamId >>> 16 & 255;
  frame[3] = streamId >>> 8 & 255;
  frame[4] = streamId & 255;
  frame[5] = payload.length >>> 24 & 255;
  frame[6] = payload.length >>> 16 & 255;
  frame[7] = payload.length >>> 8 & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeJSONFrame(json) {
  return encodeFrame(FrameType.JSON, 0, textEncoder$1.encode(json));
}
function encodeChunkFrame(streamId, chunk) {
  return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
function encodeEndFrame(streamId) {
  return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
function encodeErrorFrame(streamId, error) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return encodeFrame(FrameType.ERROR, streamId, textEncoder$1.encode(message));
}
function createMultiplexedStream(jsonStream, rawStreams) {
  let activePumps = 1 + rawStreams.size;
  let controllerRef = null;
  let cancelled = false;
  const cancelReaders = [];
  const safeEnqueue = (chunk) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.enqueue(chunk);
    } catch {
    }
  };
  const safeError = (err) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.error(err);
    } catch {
    }
  };
  const safeClose = () => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.close();
    } catch {
    }
  };
  const checkComplete = () => {
    activePumps--;
    if (activePumps === 0) {
      safeClose();
    }
  };
  return new ReadableStream({
    start(controller) {
      controllerRef = controller;
      cancelReaders.length = 0;
      const pumpJSON = async () => {
        const reader = jsonStream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {
          });
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) break;
            safeEnqueue(encodeJSONFrame(value));
          }
        } catch (error) {
          safeError(error);
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      const pumpRawStream = async (streamId, stream) => {
        const reader = stream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {
          });
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) {
              safeEnqueue(encodeEndFrame(streamId));
              break;
            }
            safeEnqueue(encodeChunkFrame(streamId, value));
          }
        } catch (error) {
          safeEnqueue(encodeErrorFrame(streamId, error));
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      pumpJSON();
      for (const [streamId, stream] of rawStreams) {
        pumpRawStream(streamId, stream);
      }
    },
    cancel() {
      cancelled = true;
      controllerRef = null;
      for (const cancelReader of cancelReaders) {
        cancelReader();
      }
      cancelReaders.length = 0;
    }
  });
}
const manifest = {};
async function getServerFnById(id) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(
      `Server function module export not resolved for serverFn ID: ${id}`
    );
  }
  return action;
}
let serovalPlugins = void 0;
const textEncoder = new TextEncoder();
const FORM_DATA_CONTENT_TYPES = [
  "multipart/form-data",
  "application/x-www-form-urlencoded"
];
const MAX_PAYLOAD_SIZE = 1e6;
const handleServerAction = async ({
  request,
  context,
  serverFnId
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const methodLower = method.toLowerCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  if (!serovalPlugins) {
    serovalPlugins = getDefaultSerovalPlugins();
  }
  const contentType = request.headers.get("Content-Type");
  function parsePayload(payload) {
    const parsedPayload = du(payload, { plugins: serovalPlugins });
    return parsedPayload;
  }
  const response = await (async () => {
    try {
      let serializeResult = function(res2) {
        let nonStreamingBody = void 0;
        const alsResponse = getResponse();
        if (res2 !== void 0) {
          const rawStreams = /* @__PURE__ */ new Map();
          const rawStreamPlugin = createRawStreamRPCPlugin(
            (id, stream2) => {
              rawStreams.set(id, stream2);
            }
          );
          const plugins = [rawStreamPlugin, ...serovalPlugins || []];
          let done = false;
          const callbacks = {
            onParse: (value) => {
              nonStreamingBody = value;
            },
            onDone: () => {
              done = true;
            },
            onError: (error) => {
              throw error;
            }
          };
          $i(res2, {
            refs: /* @__PURE__ */ new Map(),
            plugins,
            onParse(value) {
              callbacks.onParse(value);
            },
            onDone() {
              callbacks.onDone();
            },
            onError: (error) => {
              callbacks.onError(error);
            }
          });
          if (done && rawStreams.size === 0) {
            return new Response(
              nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0,
              {
                status: alsResponse.status,
                statusText: alsResponse.statusText,
                headers: {
                  "Content-Type": "application/json",
                  [X_TSS_SERIALIZED]: "true"
                }
              }
            );
          }
          if (rawStreams.size > 0) {
            const jsonStream = new ReadableStream({
              start(controller2) {
                callbacks.onParse = (value) => {
                  controller2.enqueue(JSON.stringify(value) + "\n");
                };
                callbacks.onDone = () => {
                  try {
                    controller2.close();
                  } catch {
                  }
                };
                callbacks.onError = (error) => controller2.error(error);
                if (nonStreamingBody !== void 0) {
                  callbacks.onParse(nonStreamingBody);
                }
              }
            });
            const multiplexedStream = createMultiplexedStream(
              jsonStream,
              rawStreams
            );
            return new Response(multiplexedStream, {
              status: alsResponse.status,
              statusText: alsResponse.statusText,
              headers: {
                "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
                [X_TSS_SERIALIZED]: "true"
              }
            });
          }
          const stream = new ReadableStream({
            start(controller2) {
              callbacks.onParse = (value) => controller2.enqueue(
                textEncoder.encode(JSON.stringify(value) + "\n")
              );
              callbacks.onDone = () => {
                try {
                  controller2.close();
                } catch (error) {
                  controller2.error(error);
                }
              };
              callbacks.onError = (error) => controller2.error(error);
              if (nonStreamingBody !== void 0) {
                callbacks.onParse(nonStreamingBody);
              }
            }
          });
          return new Response(stream, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": "application/x-ndjson",
              [X_TSS_SERIALIZED]: "true"
            }
          });
        }
        return new Response(void 0, {
          status: alsResponse.status,
          statusText: alsResponse.statusText
        });
      };
      let res = await (async () => {
        if (FORM_DATA_CONTENT_TYPES.some(
          (type) => contentType && contentType.includes(type)
        )) {
          invariant(
            methodLower !== "get",
            "GET requests with FormData payloads are not supported"
          );
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData
          };
          if (typeof serializedContext === "string") {
            try {
              const parsedContext = JSON.parse(serializedContext);
              const deserializedContext = du(parsedContext, {
                plugins: serovalPlugins
              });
              if (typeof deserializedContext === "object" && deserializedContext) {
                params.context = safeObjectMerge(
                  context,
                  deserializedContext
                );
              }
            } catch (e) {
              if (process.env.NODE_ENV === "development") {
                console.warn("Failed to parse FormData context:", e);
              }
            }
          }
          return await action(params, signal);
        }
        if (methodLower === "get") {
          const payloadParam = url.searchParams.get("payload");
          if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) {
            throw new Error("Payload too large");
          }
          const payload2 = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
          payload2.context = safeObjectMerge(context, payload2.context);
          return await action(payload2, signal);
        }
        if (methodLower !== "post") {
          throw new Error("expected POST method");
        }
        let jsonPayload;
        if (contentType?.includes("application/json")) {
          jsonPayload = await request.json();
        }
        const payload = jsonPayload ? parsePayload(jsonPayload) : {};
        payload.context = safeObjectMerge(payload.context, context);
        return await action(payload, signal);
      })();
      const unwrapped = res.result || res.error;
      if (isNotFound(res)) {
        res = isNotFoundResponse(res);
      }
      if (!isServerFn) {
        return unwrapped;
      }
      if (unwrapped instanceof Response) {
        if (isRedirect(unwrapped)) {
          return unwrapped;
        }
        unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
        return unwrapped;
      }
      return serializeResult(res);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(
        await Promise.resolve(
          Zi(error, {
            refs: /* @__PURE__ */ new Map(),
            plugins: serovalPlugins
          })
        )
      );
      const response2 = getResponse();
      return new Response(serializedError, {
        status: response2.status ?? 500,
        statusText: response2.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true"
        }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  return response;
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
const HEADERS = {
  TSS_SHELL: "X-TSS_SHELL"
};
const createServerRpc = (functionId, splitImportFn) => {
  return Object.assign(splitImportFn, {
    functionId,
    [TSS_SERVER_FUNCTION]: true
  });
};
const ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v2) => {
    if (typeof v2 !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v2)) return false;
    return !!v2[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ functionId }) => ({ functionId }),
  fromSerializable: ({ functionId }) => {
    const fn2 = async (opts, signal) => {
      const serverFn = await getServerFnById(functionId);
      const result = await serverFn(opts ?? {}, signal);
      return result.result;
    };
    return createServerRpc(functionId, fn2);
  }
});
function getStartResponseHeaders(opts) {
  const headers = mergeHeaders(
    {
      "Content-Type": "text/html; charset=utf-8"
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    })
  );
  return headers;
}
let cachedStartEntry = null;
let cachedRouterEntry = null;
let cachedManifest = null;
async function getEntries() {
  if (cachedRouterEntry === null) {
    cachedRouterEntry = await import("./assets/router-_Z8es15s.js").then((n) => n.r);
  }
  if (cachedStartEntry === null) {
    cachedStartEntry = await import("./assets/start-HYkvq4Ni.js");
  }
  return {
    startEntry: cachedStartEntry,
    routerEntry: cachedRouterEntry
  };
}
async function getManifest() {
  if (cachedManifest === null) {
    cachedManifest = await getStartManifest();
  }
  return cachedManifest;
}
const ROUTER_BASEPATH = "/";
const SERVER_FN_BASE = "/_serverFn/";
const IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
const IS_SHELL_ENV = process.env.TSS_SHELL === "true";
const IS_DEV = process.env.NODE_ENV === "development";
const ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
const ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function isSpecialResponse(value) {
  return value instanceof Response || isRedirect(value);
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return { response: result };
  }
  return result;
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (nextCtx) => {
    if (nextCtx) {
      if (nextCtx.context) {
        ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      }
      for (const key of Object.keys(nextCtx)) {
        if (key !== "context") {
          ctx[key] = nextCtx[key];
        }
      }
    }
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx;
    let result;
    try {
      result = await middleware({ ...ctx, next });
    } catch (err) {
      if (isSpecialResponse(err)) {
        ctx.response = err;
        return ctx;
      }
      throw err;
    }
    const normalized = handleCtxResult(result);
    if (normalized) {
      if (normalized.response !== void 0) {
        ctx.response = normalized.response;
      }
      if (normalized.context) {
        ctx.context = safeObjectMerge(ctx.context, normalized.context);
      }
    }
    return ctx;
  };
  return next();
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) {
    return handler;
  }
  return async (ctx) => {
    const response = await handler({ ...ctx, next: throwIfMayNotDefer });
    if (!response) {
      throwRouteHandlerError();
    }
    return response;
  };
}
function createStartHandler(cb) {
  const startRequestResolver = async (request, requestOpts) => {
    let router = null;
    let cbWillCleanup = false;
    try {
      const url = new URL(request.url);
      const href = url.href.replace(url.origin, "");
      const origin = getOrigin(request);
      const entries = await getEntries();
      const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
      const serializationAdapters = [
        ...startOptions.serializationAdapters || [],
        ServerFunctionSerializationAdapter
      ];
      const requestStartOptions = {
        ...startOptions,
        serializationAdapters
      };
      const flattenedRequestMiddlewares = startOptions.requestMiddleware ? flattenMiddlewares(startOptions.requestMiddleware) : [];
      const executedRequestMiddlewares = new Set(
        flattenedRequestMiddlewares
      );
      const getRouter = async () => {
        if (router) return router;
        router = await entries.routerEntry.getRouter();
        let isShell = IS_SHELL_ENV;
        if (IS_PRERENDERING && !isShell) {
          isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
        }
        const history = createMemoryHistory({
          initialEntries: [href]
        });
        router.update({
          history,
          isShell,
          isPrerendering: IS_PRERENDERING,
          origin: router.options.origin ?? origin,
          ...{
            defaultSsr: requestStartOptions.defaultSsr,
            serializationAdapters: [
              ...requestStartOptions.serializationAdapters,
              ...router.options.serializationAdapters || []
            ]
          },
          basepath: ROUTER_BASEPATH
        });
        return router;
      };
      if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) {
          throw new Error("Invalid server action param for serverFnId");
        }
        const serverFnHandler = async ({ context }) => {
          return runWithStartContext(
            {
              getRouter,
              startOptions: requestStartOptions,
              contextAfterGlobalMiddlewares: context,
              request,
              executedRequestMiddlewares
            },
            () => handleServerAction({
              request,
              context: requestOpts?.context,
              serverFnId
            })
          );
        };
        const middlewares2 = flattenedRequestMiddlewares.map(
          (d) => d.options.server
        );
        const ctx2 = await executeMiddleware([...middlewares2, serverFnHandler], {
          request,
          context: createNullProtoObject(requestOpts?.context)
        });
        return handleRedirectResponse(ctx2.response, request, getRouter);
      }
      const executeRouter = async (serverContext) => {
        const acceptHeader = request.headers.get("Accept") || "*/*";
        const acceptParts = acceptHeader.split(",");
        const supportedMimeTypes = ["*/*", "text/html"];
        const isSupported = supportedMimeTypes.some(
          (mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType))
        );
        if (!isSupported) {
          return Response.json(
            { error: "Only HTML requests are supported here" },
            { status: 500 }
          );
        }
        const manifest2 = await getManifest();
        const routerInstance = await getRouter();
        attachRouterServerSsrUtils({
          router: routerInstance,
          manifest: manifest2
        });
        routerInstance.update({ additionalContext: { serverContext } });
        await routerInstance.load();
        if (routerInstance.state.redirect) {
          return routerInstance.state.redirect;
        }
        await routerInstance.serverSsr.dehydrate();
        const responseHeaders = getStartResponseHeaders({
          router: routerInstance
        });
        cbWillCleanup = true;
        return cb({
          request,
          router: routerInstance,
          responseHeaders
        });
      };
      const requestHandlerMiddleware = async ({ context }) => {
        return runWithStartContext(
          {
            getRouter,
            startOptions: requestStartOptions,
            contextAfterGlobalMiddlewares: context,
            request,
            executedRequestMiddlewares
          },
          async () => {
            try {
              return await handleServerRoutes({
                getRouter,
                request,
                url,
                executeRouter,
                context,
                executedRequestMiddlewares
              });
            } catch (err) {
              if (err instanceof Response) {
                return err;
              }
              throw err;
            }
          }
        );
      };
      const middlewares = flattenedRequestMiddlewares.map(
        (d) => d.options.server
      );
      const ctx = await executeMiddleware(
        [...middlewares, requestHandlerMiddleware],
        { request, context: createNullProtoObject(requestOpts?.context) }
      );
      return handleRedirectResponse(ctx.response, request, getRouter);
    } finally {
      if (router && !cbWillCleanup) {
        router.serverSsr?.cleanup();
      }
      router = null;
    }
  };
  return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
  if (!isRedirect(response)) {
    return response;
  }
  if (isResolvedRedirect(response)) {
    if (request.headers.get("x-tsr-serverFn") === "true") {
      return Response.json(
        { ...response.options, isSerializedRedirect: true },
        { headers: response.headers }
      );
    }
    return response;
  }
  const opts = response.options;
  if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) {
    throw new Error(
      `Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`
    );
  }
  if (["params", "search", "hash"].some(
    (d) => typeof opts[d] === "function"
  )) {
    throw new Error(
      `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
        opts
      ).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`
    );
  }
  const router = await getRouter();
  const redirect2 = router.resolveRedirect(response);
  if (request.headers.get("x-tsr-serverFn") === "true") {
    return Response.json(
      { ...response.options, isSerializedRedirect: true },
      { headers: response.headers }
    );
  }
  return redirect2;
}
async function handleServerRoutes({
  getRouter,
  request,
  url,
  executeRouter,
  context,
  executedRequestMiddlewares
}) {
  const router = await getRouter();
  const rewrittenUrl = executeRewriteInput(router.rewrite, url);
  const pathname = rewrittenUrl.pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && routeParams["**"] === void 0;
  const routeMiddlewares = [];
  for (const route of matchedRoutes) {
    const serverMiddleware = route.options.server?.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m2 of flattened) {
        if (!executedRequestMiddlewares.has(m2)) {
          routeMiddlewares.push(m2.options.server);
        }
      }
    }
  }
  const server2 = foundRoute?.options.server;
  if (server2?.handlers && isExactMatch) {
    const handlers = typeof server2.handlers === "function" ? server2.handlers({ createHandlers: (d) => d }) : server2.handlers;
    const requestMethod = request.method.toUpperCase();
    const handler = handlers[requestMethod] ?? handlers["ANY"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler === "function") {
        routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
      } else {
        if (handler.middleware?.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m2 of handlerMiddlewares) {
            routeMiddlewares.push(m2.options.server);
          }
        }
        if (handler.handler) {
          routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
        }
      }
    }
  }
  routeMiddlewares.push((ctx2) => executeRouter(ctx2.context));
  const ctx = await executeMiddleware(routeMiddlewares, {
    request,
    context,
    params: routeParams,
    pathname
  });
  return ctx.response;
}
const fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return {
    async fetch(...args) {
      return await entry.fetch(...args);
    }
  };
}
const server = createServerEntry({ fetch });
export {
  Outlet as O,
  React__default as R,
  reactExports as a,
  useRouter as b,
  requireReact as c,
  createServerEntry,
  dummyMatchContext as d,
  server as default,
  useForwardedRef as e,
  useIntersectionObserver as f,
  functionalUpdate as g,
  exactPathTest as h,
  invariant as i,
  joinPaths as j,
  removeTrailingSlash as k,
  deepEqual as l,
  matchContext as m,
  jsxRuntimeExports as n,
  isModuleNotFoundError as o,
  RouterCore as p,
  rootRouteId as r,
  trimPathLeft as t,
  useRouterState as u,
  warning as w
};
