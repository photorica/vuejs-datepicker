
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
  'use strict';

  /*!
   * Vue.js v2.6.12
   * (c) 2014-2020 Evan You
   * Released under the MIT License.
   */
  /*  */

  var emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "development" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var isPhantomJS = UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /*@__PURE__*/(function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;
  var tip = noop;
  var generateComponentTrace = (noop); // work around flow check
  var formatComponentName = (noop);

  {
    var hasConsole = typeof console !== 'undefined';
    var classifyRE = /(?:^|[-_])(\w)/g;
    var classify = function (str) { return str
      .replace(classifyRE, function (c) { return c.toUpperCase(); })
      .replace(/[-_]/g, ''); };

    warn = function (msg, vm) {
      var trace = vm ? generateComponentTrace(vm) : '';

      if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace);
      } else if (hasConsole && (!config.silent)) {
        console.error(("[Vue warn]: " + msg + trace));
      }
    };

    tip = function (msg, vm) {
      if (hasConsole && (!config.silent)) {
        console.warn("[Vue tip]: " + msg + (
          vm ? generateComponentTrace(vm) : ''
        ));
      }
    };

    formatComponentName = function (vm, includeFile) {
      if (vm.$root === vm) {
        return '<Root>'
      }
      var options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
          ? vm.$options || vm.constructor.options
          : vm;
      var name = options.name || options._componentTag;
      var file = options.__file;
      if (!name && file) {
        var match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (
        (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
        (file && includeFile !== false ? (" at " + file) : '')
      )
    };

    var repeat = function (str, n) {
      var res = '';
      while (n) {
        if (n % 2 === 1) { res += str; }
        if (n > 1) { str += str; }
        n >>= 1;
      }
      return res
    };

    generateComponentTrace = function (vm) {
      if (vm._isVue && vm.$parent) {
        var tree = [];
        var currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            var last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
          .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
              ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
              : formatComponentName(vm))); })
          .join('\n')
      } else {
        return ("\n\n(found in " + (formatComponentName(vm)) + ")")
      }
    };
  }

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    if ( !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if ( customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
       warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
       warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn(
          "option \"" + key + "\" can only be used during instance " +
          'creation with the `new` keyword.'
        );
      }
      return defaultStrat(parent, child)
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;

    var keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') { continue }
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
         warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
       assertObjectType(key, childVal, vm);
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "development" !== 'production') {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Validate component names
   */
  function checkComponents (options) {
    for (var key in options.components) {
      validateComponentName(key);
    }
  }

  function validateComponentName (name) {
    if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
      warn(
        'Invalid component name: "' + name + '". Component names ' +
        'should conform to valid custom element name in html5 specification.'
      );
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + name
      );
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    } else {
      warn(
        "Invalid value for option \"props\": expected an Array or an Object, " +
        "but got " + (toRawType(props)) + ".",
        vm
      );
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    } else {
      warn(
        "Invalid value for option \"inject\": expected an Array or an Object, " +
        "but got " + (toRawType(inject)) + ".",
        vm
      );
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {
    {
      checkComponents(child);
    }

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if ( warnMissing && !res) {
      warn(
        'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
        options
      );
    }
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if ( isObject(def)) {
      warn(
        'Invalid default value for prop "' + key + '": ' +
        'Props with type Object/Array must use a factory function ' +
        'to return the default value.',
        vm
      );
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp (
    prop,
    name,
    value,
    vm,
    absent
  ) {
    if (prop.required && absent) {
      warn(
        'Missing required prop: "' + name + '"',
        vm
      );
      return
    }
    if (value == null && !prop.required) {
      return
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (var i = 0; i < type.length && !valid; i++) {
        var assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid;
      }
    }

    if (!valid) {
      warn(
        getInvalidTypeMessage(name, value, expectedTypes),
        vm
      );
      return
    }
    var validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn(
          'Invalid prop: custom validator check failed for prop "' + name + '".',
          vm
        );
      }
    }
  }

  var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  function assertType (value, type) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
      var t = typeof value;
      valid = t === expectedType.toLowerCase();
      // for primitive wrapper objects
      if (!valid && t === 'object') {
        valid = value instanceof type;
      }
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid: valid,
      expectedType: expectedType
    }
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  function getInvalidTypeMessage (name, value, expectedTypes) {
    var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', '));
    var expectedType = expectedTypes[0];
    var receivedType = toRawType(value);
    var expectedValue = styleValue(value, expectedType);
    var receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)) {
      message += " with value " + expectedValue;
    }
    message += ", got " + receivedType + " ";
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
      message += "with value " + receivedValue + ".";
    }
    return message
  }

  function styleValue (value, type) {
    if (type === 'String') {
      return ("\"" + value + "\"")
    } else if (type === 'Number') {
      return ("" + (Number(value)))
    } else {
      return ("" + value)
    }
  }

  function isExplicable (value) {
    var explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
  }

  function isBoolean () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) {
          var hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (var i = 0; i < hooks.length; i++) {
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }

  function logError (err, vm, info) {
    {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  /* not type checking this file because flow doesn't play well with Proxy */

  var initProxy;

  {
    var allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );

    var warnNonPresent = function (target, key) {
      warn(
        "Property or method \"" + key + "\" is not defined on the instance but " +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
      );
    };

    var warnReservedPrefix = function (target, key) {
      warn(
        "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals. ' +
        'See: https://vuejs.org/v2/api/#data',
        target
      );
    };

    var hasProxy =
      typeof Proxy !== 'undefined' && isNative(Proxy);

    if (hasProxy) {
      var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
      config.keyCodes = new Proxy(config.keyCodes, {
        set: function set (target, key, value) {
          if (isBuiltInModifier(key)) {
            warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
            return false
          } else {
            target[key] = value;
            return true
          }
        }
      });
    }

    var hasHandler = {
      has: function has (target, key) {
        var has = key in target;
        var isAllowed = allowedGlobals(key) ||
          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
        if (!has && !isAllowed) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return has || !isAllowed
      }
    };

    var getHandler = {
      get: function get (target, key) {
        if (typeof key === 'string' && !(key in target)) {
          if (key in target.$data) { warnReservedPrefix(target, key); }
          else { warnNonPresent(target, key); }
        }
        return target[key]
      }
    };

    initProxy = function initProxy (vm) {
      if (hasProxy) {
        // determine which proxy handler to use
        var options = vm.$options;
        var handlers = options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  var mark;
  var measure;

  {
    var perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = function (tag) { return perf.mark(tag); };
      measure = function (name, startTag, endTag) {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        // perf.clearMeasures(name)
      };
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) {
         warn(
          "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
          vm
        );
      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        {
          var keyInLowerCase = key.toLowerCase();
          if (
            key !== keyInLowerCase &&
            attrs && hasOwn(attrs, keyInLowerCase)
          ) {
            tip(
              "Prop \"" + keyInLowerCase + "\" is passed to component " +
              (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
              " \"" + key + "\". " +
              "Note that HTML attributes are case-insensitive and camelCased " +
              "props need to use their kebab-case equivalents when using in-DOM " +
              "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
            );
          }
        }
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key], function () {
            warn(
              "Avoid mutating an injected value directly since the changes will be " +
              "overwritten whenever the provided component re-renders. " +
              "injection being mutated: \"" + key + "\"",
              vm
            );
          });
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          } else {
            warn(("Injection \"" + key + "\" not found"), vm);
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        if ( !isObject(bindObject)) {
          warn(
            'slot v-bind without argument expects an Object',
            this
          );
        }
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) {
         warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) {
         warn(
          'v-on without argument expects an Object value',
          this
        );
      } else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      } else if ( key !== '' && key !== null) {
        // null is a special value for explicitly removing a binding
        warn(
          ("Invalid value for dynamic directive argument (expected string or null): " + key),
          this
        );
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
      (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
    }
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn(("Invalid Component definition: " + (String(Ctor))), context);
      }
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
       warn(
        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // warn against non-primitive key
    if (
      isDef(data) && isDef(data.key) && !isPrimitive(data.key)
    ) {
      {
        warn(
          'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
          context
        );
      }
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        if ( isDef(data) && isDef(data.nativeOn)) {
          warn(
            ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
            context
          );
        }
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
      }, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
      }, true);
    }
  }

  var currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        // There's no need to maintain a stack because all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        if ( vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if ( Array.isArray(vnode)) {
          warn(
            'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
            vm
          );
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
         warn(
          "Failed to resolve async component: " + (String(factory)) +
          (reason ? ("\nReason: " + reason) : '')
        );
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                   ("timeout (" + (res.timeout) + "ms)")
                    
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    var _target = target;
    return function onceHandler () {
      var res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null;
  var isUpdatingChildComponent = false;

  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    if ( config.performance && mark) {
      updateComponent = function () {
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(("vue " + name + " render"), startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(("vue " + name + " patch"), startTag, endTag);
      };
    } else {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  /*  */

  var MAX_UPDATE_COUNT = 100;

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var circular = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ( has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                : "in a component render function."
            ),
            watcher.vm
          );
          break
        }
      }
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if ( !config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression =  expOrFn.toString()
      ;
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
         warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        var hyphenatedKey = hyphenate(key);
        if (isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)) {
          warn(
            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        defineReactive$$1(props, key, value, function () {
          if (!isRoot && !isUpdatingChildComponent) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
       warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
         warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if ( getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (
        sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (typeof methods[key] !== 'function') {
          warn(
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    {
      dataDef.set = function () {
        warn(
          'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
          this
        );
      };
      propsDef.set = function () {
        warn("$props is readonly.", this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      var startTag, endTag;
      /* istanbul ignore if */
      if ( config.performance && mark) {
        startTag = "vue-perf-start:" + (vm._uid);
        endTag = "vue-perf-end:" + (vm._uid);
        mark(startTag);
      }

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if ( config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(("vue " + (vm._name) + " init"), startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    if (
      !(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;
      if ( name) {
        validateComponentName(name);
      }

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if ( type === 'component') {
            validateComponentName(id);
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      for (var key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    {
      configDef.set = function () {
        warn(
          'Do not replace the Vue.config object, set individual fields instead.'
        );
      };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.12';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
         warn(
          'Cannot find element: ' + el
        );
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function isUnknownElement$$1 (vnode, inVPre) {
      return (
        !inVPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some(function (ignore) {
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag)
      )
    }

    var creatingElmInVPre = 0;

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (data && data.pre) {
            creatingElmInVPre++;
          }
          if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
            warn(
              'Unknown custom element: <' + tag + '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
              vnode.context
            );
          }
        }

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }

        if ( data && data.pre) {
          creatingElmInVPre--;
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        {
          checkDuplicateKeys(children);
        }
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh);
      }

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function checkDuplicateKeys (children) {
      var seenKeys = {};
      for (var i = 0; i < children.length; i++) {
        var vnode = children[i];
        var key = vnode.key;
        if (isDef(key)) {
          if (seenKeys[key]) {
            warn(
              ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
              vnode.context
            );
          } else {
            seenKeys[key] = true;
          }
        }
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          {
            checkDuplicateKeys(ch);
          }
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      // assert node match
      {
        if (!assertNodeMatch(elm, vnode, inVPre)) {
          return false
        }
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                /* istanbul ignore if */
                if (
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('server innerHTML: ', i);
                  console.warn('client innerHTML: ', elm.innerHTML);
                }
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                /* istanbul ignore if */
                if (
                  typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    function assertNodeMatch (node, vnode, inVPre) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || (
          !isUnknownElement$$1(vnode, inVPre) &&
          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
        )
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3)
      }
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              } else {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                );
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  /*  */

  /*  */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1 (event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecessary `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    if ( explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    if ( isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration (val, name, vnode) {
    if (typeof val !== 'number') {
      warn(
        "<transition> explicit " + name + " duration is not a valid number - " +
        "got " + (JSON.stringify(val)) + ".",
        vnode.context
      );
    } else if (isNaN(val)) {
      warn(
        "<transition> explicit " + name + " duration is NaN - " +
        'the duration expression might be incorrect.',
        vnode.context
      );
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
       warn(
        "<select multiple v-model=\"" + (binding.expression) + "\"> " +
        "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
        vm
      );
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if ( children.length > 1) {
        warn(
          '<transition> can only be used on a single element. Use ' +
          '<transition-group> for lists.',
          this.$parent
        );
      }

      var mode = this.mode;

      // warn invalid mode
      if (
        mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
        warn(
          'invalid <transition> mode: ' + mode,
          this.$parent
        );
      }

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount () {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          } else {
            var opts = c.componentOptions;
            var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
            warn(("<transition-group> children must be keyed: <" + name + ">"));
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        } else {
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
          );
        }
      }
      if (
        config.productionTip !== false &&
        typeof console !== 'undefined'
      ) {
        console[console.info ? 'info' : 'log'](
          "You are running Vue in development mode.\n" +
          "Make sure to turn on production mode when deploying for production.\n" +
          "See more tips at https://vuejs.org/guide/deployment.html"
        );
      }
    }, 0);
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var Language = /*#__PURE__*/function () {
    function Language(language, months, monthsAbbr, days) {
      _classCallCheck(this, Language);

      this.language = language;
      this.months = months;
      this.monthsAbbr = monthsAbbr;
      this.days = days;
      this.rtl = false;
      this.ymd = false;
      this.yearSuffix = '';
    }

    _createClass(Language, [{
      key: "language",
      get: function get() {
        return this._language;
      },
      set: function set(language) {
        if (typeof language !== 'string') {
          throw new TypeError('Language must be a string');
        }

        this._language = language;
      }
    }, {
      key: "months",
      get: function get() {
        return this._months;
      },
      set: function set(months) {
        if (months.length !== 12) {
          throw new RangeError("There must be 12 months for ".concat(this.language, " language"));
        }

        this._months = months;
      }
    }, {
      key: "monthsAbbr",
      get: function get() {
        return this._monthsAbbr;
      },
      set: function set(monthsAbbr) {
        if (monthsAbbr.length !== 12) {
          throw new RangeError("There must be 12 abbreviated months for ".concat(this.language, " language"));
        }

        this._monthsAbbr = monthsAbbr;
      }
    }, {
      key: "days",
      get: function get() {
        return this._days;
      },
      set: function set(days) {
        if (days.length !== 7) {
          throw new RangeError("There must be 7 days for ".concat(this.language, " language"));
        }

        this._days = days;
      }
    }]);

    return Language;
  }(); // eslint-disable-next-line

  var language = new Language('Japanese', ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], ['日', '月', '火', '水', '木', '金', '土']);
  language.yearSuffix = '年';
  language.ymd = true;

  var utils = {
    /**
     * @type {Boolean}
     */
    useUtc: false,

    /**
     * Returns the full year, using UTC or not
     * @param {Date} date
     */
    getFullYear: function getFullYear(date) {
      return this.useUtc ? date.getUTCFullYear() : date.getFullYear();
    },

    /**
     * Returns the month, using UTC or not
     * @param {Date} date
     */
    getMonth: function getMonth(date) {
      return this.useUtc ? date.getUTCMonth() : date.getMonth();
    },

    /**
     * Returns the date, using UTC or not
     * @param {Date} date
     */
    getDate: function getDate(date) {
      return this.useUtc ? date.getUTCDate() : date.getDate();
    },

    /**
     * Returns the day, using UTC or not
     * @param {Date} date
     */
    getDay: function getDay(date) {
      return this.useUtc ? date.getUTCDay() : date.getDay();
    },

    /**
     * Returns the hours, using UTC or not
     * @param {Date} date
     */
    getHours: function getHours(date) {
      return this.useUtc ? date.getUTCHours() : date.getHours();
    },

    /**
     * Returns the minutes, using UTC or not
     * @param {Date} date
     */
    getMinutes: function getMinutes(date) {
      return this.useUtc ? date.getUTCMinutes() : date.getMinutes();
    },

    /**
     * Sets the full year, using UTC or not
     * @param {Date} date
     */
    setFullYear: function setFullYear(date, value, useUtc) {
      return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value);
    },

    /**
     * Sets the month, using UTC or not
     * @param {Date} date
     */
    setMonth: function setMonth(date, value, useUtc) {
      return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value);
    },

    /**
     * Sets the date, using UTC or not
     * @param {Date} date
     * @param {Number} value
     */
    setDate: function setDate(date, value, useUtc) {
      return this.useUtc ? date.setUTCDate(value) : date.setDate(value);
    },

    /**
     * Check if date1 is equivalent to date2, without comparing the time
     * @see https://stackoverflow.com/a/6202196/4455925
     * @param {Date} date1
     * @param {Date} date2
     */
    compareDates: function compareDates(date1, date2) {
      var d1 = new Date(date1.getTime());
      var d2 = new Date(date2.getTime());

      if (this.useUtc) {
        d1.setUTCHours(0, 0, 0, 0);
        d2.setUTCHours(0, 0, 0, 0);
      } else {
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
      }

      return d1.getTime() === d2.getTime();
    },

    /**
     * Validates a date object
     * @param {Date} date - an object instantiated with the new Date constructor
     * @return {Boolean}
     */
    isValidDate: function isValidDate(date) {
      if (Object.prototype.toString.call(date) !== '[object Date]') {
        return false;
      }

      return !isNaN(date.getTime());
    },

    /**
     * Return abbreviated week day name
     * @param {Date}
     * @param {Array}
     * @return {String}
     */
    getDayNameAbbr: function getDayNameAbbr(date, days) {
      if (_typeof(date) !== 'object') {
        throw TypeError('Invalid Type');
      }

      return days[this.getDay(date)];
    },

    /**
     * Return name of the month
     * @param {Number|Date}
     * @param {Array}
     * @return {String}
     */
    getMonthName: function getMonthName(month, months) {
      if (!months) {
        throw Error('missing 2nd parameter Months array');
      }

      if (_typeof(month) === 'object') {
        return months[this.getMonth(month)];
      }

      if (typeof month === 'number') {
        return months[month];
      }

      throw TypeError('Invalid type');
    },

    /**
     * Return an abbreviated version of the month
     * @param {Number|Date}
     * @return {String}
     */
    getMonthNameAbbr: function getMonthNameAbbr(month, monthsAbbr) {
      if (!monthsAbbr) {
        throw Error('missing 2nd paramter Months array');
      }

      if (_typeof(month) === 'object') {
        return monthsAbbr[this.getMonth(month)];
      }

      if (typeof month === 'number') {
        return monthsAbbr[month];
      }

      throw TypeError('Invalid type');
    },

    /**
     * Alternative get total number of days in month
     * @param {Number} year
     * @param {Number} m
     * @return {Number}
     */
    daysInMonth: function daysInMonth(year, month) {
      return /8|3|5|10/.test(month) ? 30 : month === 1 ? !(year % 4) && year % 100 || !(year % 400) ? 29 : 28 : 31;
    },

    /**
     * Get nth suffix for date
     * @param {Number} day
     * @return {String}
     */
    getNthSuffix: function getNthSuffix(day) {
      switch (day) {
        case 1:
        case 21:
        case 31:
          return 'st';

        case 2:
        case 22:
          return 'nd';

        case 3:
        case 23:
          return 'rd';

        default:
          return 'th';
      }
    },

    /**
     * Formats date object
     * @param {Date}
     * @param {String}
     * @param {Object}
     * @return {String}
     */
    formatDate: function formatDate(date, format, translation) {
      translation = !translation ? language : translation;
      var year = this.getFullYear(date);
      var month = this.getMonth(date) + 1;
      var day = this.getDate(date);
      var str = format.replace(/dd/, ('0' + day).slice(-2)).replace(/d/, day).replace(/yyyy/, year).replace(/yy/, String(year).slice(2)).replace(/MMMM/, this.getMonthName(this.getMonth(date), translation.months)).replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date), translation.monthsAbbr)).replace(/MM/, ('0' + month).slice(-2)).replace(/M(?!a|ä|e)/, month).replace(/su/, this.getNthSuffix(this.getDate(date))).replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days));
      return str;
    },

    /**
     * Creates an array of dates for each day in between two dates.
     * @param {Date} start
     * @param {Date} end
     * @return {Array}
     */
    createDateArray: function createDateArray(start, end) {
      var dates = [];

      while (start <= end) {
        dates.push(new Date(start));
        start = this.setDate(new Date(start), this.getDate(new Date(start)) + 1);
      }

      return dates;
    },

    /**
     * method used as a prop validator for input values
     * @param {*} val
     * @return {Boolean}
     */
    validateDateInput: function validateDateInput(val) {
      return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number';
    }
  };
  var makeDateUtils = function makeDateUtils(useUtc) {
    return _objectSpread2(_objectSpread2({}, utils), {}, {
      useUtc: useUtc
    });
  };
  var utils$1 = _objectSpread2({}, utils) // eslint-disable-next-line
  ;

  var script = {
    props: {
      selectedDate: Date,
      resetTypedDate: [Date],
      format: [String, Function],
      translation: Object,
      inline: Boolean,
      id: String,
      name: String,
      refName: String,
      openDate: Date,
      placeholder: String,
      inputClass: [String, Object, Array],
      clearButton: Boolean,
      clearButtonIcon: String,
      calendarButton: Boolean,
      calendarButtonIcon: String,
      calendarButtonIconContent: String,
      disabled: Boolean,
      required: Boolean,
      typeable: Boolean,
      bootstrapStyling: Boolean,
      useUtc: Boolean
    },
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        input: null,
        typedDate: false,
        utils: constructedDateUtils
      };
    },
    computed: {
      formattedValue: function formattedValue() {
        if (!this.selectedDate) {
          return null;
        }

        if (this.typedDate) {
          return this.typedDate;
        }

        return typeof this.format === 'function' ? this.format(this.selectedDate) : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation);
      },
      computedInputClass: function computedInputClass() {
        if (this.bootstrapStyling) {
          if (typeof this.inputClass === 'string') {
            return [this.inputClass, 'form-control'].join(' ');
          }

          return _objectSpread2({
            'form-control': true
          }, this.inputClass);
        }

        return this.inputClass;
      }
    },
    watch: {
      resetTypedDate: function resetTypedDate() {
        this.typedDate = false;
      }
    },
    methods: {
      showCalendar: function showCalendar() {
        this.$emit('showCalendar');
      },

      /**
       * Attempt to parse a typed date
       * @param {Event} event
       */
      parseTypedDate: function parseTypedDate(event) {
        // close calendar if escape or enter are pressed
        if ([27, // escape
        13 // enter
        ].includes(event.keyCode)) {
          this.input.blur();
        }

        if (this.typeable) {
          var typedDate = Date.parse(this.input.value);

          if (!isNaN(typedDate)) {
            this.typedDate = this.input.value;
            this.$emit('typedDate', new Date(this.typedDate));
          }
        }
      },

      /**
       * nullify the typed date to defer to regular formatting
       * called once the input is blurred
       */
      inputBlurred: function inputBlurred() {
        if (this.typeable && isNaN(Date.parse(this.input.value))) {
          this.clearDate();
          this.input.value = null;
          this.typedDate = null;
        }

        this.$emit('closeCalendar');
      },

      /**
       * emit a clearDate event
       */
      clearDate: function clearDate() {
        this.$emit('clearDate');
      }
    },
    mounted: function mounted() {
      this.input = this.$el.querySelector('input');
    }
  } // eslint-disable-next-line
  ;

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { class: { "input-group": _vm.bootstrapStyling } },
      [
        _vm.calendarButton
          ? _c(
              "span",
              {
                staticClass: "vdp-datepicker__calendar-button",
                class: { "input-group-prepend": _vm.bootstrapStyling },
                style: { "cursor:not-allowed;": _vm.disabled },
                on: { click: _vm.showCalendar }
              },
              [
                _c(
                  "span",
                  { class: { "input-group-text": _vm.bootstrapStyling } },
                  [
                    _c("i", { class: _vm.calendarButtonIcon }, [
                      _vm._v(
                        "\n        " +
                          _vm._s(_vm.calendarButtonIconContent) +
                          "\n        "
                      ),
                      !_vm.calendarButtonIcon
                        ? _c("span", [_vm._v("…")])
                        : _vm._e()
                    ])
                  ]
                )
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _c("input", {
          ref: _vm.refName,
          class: _vm.computedInputClass,
          attrs: {
            type: _vm.inline ? "hidden" : "text",
            name: _vm.name,
            id: _vm.id,
            "open-date": _vm.openDate,
            placeholder: _vm.placeholder,
            "clear-button": _vm.clearButton,
            disabled: _vm.disabled,
            required: _vm.required,
            readonly: !_vm.typeable,
            autocomplete: "off"
          },
          domProps: { value: _vm.formattedValue },
          on: {
            click: _vm.showCalendar,
            keyup: _vm.parseTypedDate,
            blur: _vm.inputBlurred
          }
        }),
        _vm._v(" "),
        _vm.clearButton && _vm.selectedDate
          ? _c(
              "span",
              {
                staticClass: "vdp-datepicker__clear-button",
                class: { "input-group-append": _vm.bootstrapStyling },
                on: {
                  click: function($event) {
                    return _vm.clearDate()
                  }
                }
              },
              [
                _c(
                  "span",
                  { class: { "input-group-text": _vm.bootstrapStyling } },
                  [
                    _c("i", { class: _vm.clearButtonIcon }, [
                      !_vm.clearButtonIcon ? _c("span", [_vm._v("×")]) : _vm._e()
                    ])
                  ]
                )
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm._t("afterDateInput")
      ],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  var name = "@holiday-jp/holiday_jp";
  var version = "2.3.0";
  var description = "Japanese holidays";
  var main = "lib/holiday_jp.js";
  var types = "lib/holiday_jp.d.ts";
  var scripts = {
  	test: "mocha --require should test/*.js",
  	generate: "git submodule update; cd holiday_jp/; git fetch origin master; git reset --hard origin/master; cd ../; node scripts/generate.js",
  	build: "npm run generate; webpack; node scripts/build.js;rm scripts/holiday_jp_webpacked.js;cd ./release/; uglifyjs holiday_jp.js -c -m --source-map -o holiday_jp.min.js"
  };
  var repository = {
  	type: "git",
  	url: "https://github.com/holiday-jp/holiday_jp-js"
  };
  var keywords = [
  	"holidays"
  ];
  var author = "Ken'ichiro Oyama";
  var license = "MIT";
  var bugs = {
  	url: "https://github.com/holiday-jp/holiday_jp-js/issues"
  };
  var homepage = "https://github.com/holiday-jp/holiday_jp-js";
  var devDependencies = {
  	chai: "^4.2.0",
  	"js-yaml": "^3.13.1",
  	mocha: "^8.2.1",
  	moment: "^2.23.0",
  	request: "^2.88.0",
  	should: "~1.2.2",
  	"uglify-js": "^3.4.9",
  	webpack: "^4.28.2",
  	"webpack-cli": "^4.2.0"
  };
  var _package = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	types: types,
  	scripts: scripts,
  	repository: repository,
  	keywords: keywords,
  	author: author,
  	license: license,
  	bugs: bugs,
  	homepage: homepage,
  	devDependencies: devDependencies
  };

  var _package$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    version: version,
    description: description,
    main: main,
    types: types,
    scripts: scripts,
    repository: repository,
    keywords: keywords,
    author: author,
    license: license,
    bugs: bugs,
    homepage: homepage,
    devDependencies: devDependencies,
    'default': _package
  });

  // Generated from holidays.yml at 2020-12-06 13:27:56;
  var holidays = {};
  holidays['1970-01-01'] = {
    'date': '1970-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1970-01-15'] = {
    'date': '1970-01-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1970-02-11'] = {
    'date': '1970-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1970-03-21'] = {
    'date': '1970-03-21',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1970-04-29'] = {
    'date': '1970-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1970-05-03'] = {
    'date': '1970-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1970-05-05'] = {
    'date': '1970-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1970-09-15'] = {
    'date': '1970-09-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1970-09-23'] = {
    'date': '1970-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1970-10-10'] = {
    'date': '1970-10-10',
    'week': '土',
    'week_en': 'Saturday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1970-11-03'] = {
    'date': '1970-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1970-11-23'] = {
    'date': '1970-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1971-01-01'] = {
    'date': '1971-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1971-01-15'] = {
    'date': '1971-01-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1971-02-11'] = {
    'date': '1971-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1971-03-21'] = {
    'date': '1971-03-21',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1971-04-29'] = {
    'date': '1971-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1971-05-03'] = {
    'date': '1971-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1971-05-05'] = {
    'date': '1971-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1971-09-15'] = {
    'date': '1971-09-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1971-09-24'] = {
    'date': '1971-09-24',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1971-10-10'] = {
    'date': '1971-10-10',
    'week': '日',
    'week_en': 'Sunday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1971-11-03'] = {
    'date': '1971-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1971-11-23'] = {
    'date': '1971-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1972-01-01'] = {
    'date': '1972-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1972-01-15'] = {
    'date': '1972-01-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1972-02-11'] = {
    'date': '1972-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1972-03-20'] = {
    'date': '1972-03-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1972-04-29'] = {
    'date': '1972-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1972-05-03'] = {
    'date': '1972-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1972-05-05'] = {
    'date': '1972-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1972-09-15'] = {
    'date': '1972-09-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1972-09-23'] = {
    'date': '1972-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1972-10-10'] = {
    'date': '1972-10-10',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1972-11-03'] = {
    'date': '1972-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1972-11-23'] = {
    'date': '1972-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1973-01-01'] = {
    'date': '1973-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1973-01-15'] = {
    'date': '1973-01-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1973-02-11'] = {
    'date': '1973-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1973-03-21'] = {
    'date': '1973-03-21',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1973-04-29'] = {
    'date': '1973-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1973-04-30'] = {
    'date': '1973-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1973-05-03'] = {
    'date': '1973-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1973-05-05'] = {
    'date': '1973-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1973-09-15'] = {
    'date': '1973-09-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1973-09-23'] = {
    'date': '1973-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1973-09-24'] = {
    'date': '1973-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1973-10-10'] = {
    'date': '1973-10-10',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1973-11-03'] = {
    'date': '1973-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1973-11-23'] = {
    'date': '1973-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1974-01-01'] = {
    'date': '1974-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1974-01-15'] = {
    'date': '1974-01-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1974-02-11'] = {
    'date': '1974-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1974-03-21'] = {
    'date': '1974-03-21',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1974-04-29'] = {
    'date': '1974-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1974-05-03'] = {
    'date': '1974-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1974-05-05'] = {
    'date': '1974-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1974-05-06'] = {
    'date': '1974-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1974-09-15'] = {
    'date': '1974-09-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1974-09-16'] = {
    'date': '1974-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1974-09-23'] = {
    'date': '1974-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1974-10-10'] = {
    'date': '1974-10-10',
    'week': '木',
    'week_en': 'Thursday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1974-11-03'] = {
    'date': '1974-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1974-11-04'] = {
    'date': '1974-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1974-11-23'] = {
    'date': '1974-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1975-01-01'] = {
    'date': '1975-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1975-01-15'] = {
    'date': '1975-01-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1975-02-11'] = {
    'date': '1975-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1975-03-21'] = {
    'date': '1975-03-21',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1975-04-29'] = {
    'date': '1975-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1975-05-03'] = {
    'date': '1975-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1975-05-05'] = {
    'date': '1975-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1975-09-15'] = {
    'date': '1975-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1975-09-24'] = {
    'date': '1975-09-24',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1975-10-10'] = {
    'date': '1975-10-10',
    'week': '金',
    'week_en': 'Friday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1975-11-03'] = {
    'date': '1975-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1975-11-23'] = {
    'date': '1975-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1975-11-24'] = {
    'date': '1975-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1976-01-01'] = {
    'date': '1976-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1976-01-15'] = {
    'date': '1976-01-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1976-02-11'] = {
    'date': '1976-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1976-03-20'] = {
    'date': '1976-03-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1976-04-29'] = {
    'date': '1976-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1976-05-03'] = {
    'date': '1976-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1976-05-05'] = {
    'date': '1976-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1976-09-15'] = {
    'date': '1976-09-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1976-09-23'] = {
    'date': '1976-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1976-10-10'] = {
    'date': '1976-10-10',
    'week': '日',
    'week_en': 'Sunday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1976-10-11'] = {
    'date': '1976-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1976-11-03'] = {
    'date': '1976-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1976-11-23'] = {
    'date': '1976-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1977-01-01'] = {
    'date': '1977-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1977-01-15'] = {
    'date': '1977-01-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1977-02-11'] = {
    'date': '1977-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1977-03-21'] = {
    'date': '1977-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1977-04-29'] = {
    'date': '1977-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1977-05-03'] = {
    'date': '1977-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1977-05-05'] = {
    'date': '1977-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1977-09-15'] = {
    'date': '1977-09-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1977-09-23'] = {
    'date': '1977-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1977-10-10'] = {
    'date': '1977-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1977-11-03'] = {
    'date': '1977-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1977-11-23'] = {
    'date': '1977-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1978-01-01'] = {
    'date': '1978-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1978-01-02'] = {
    'date': '1978-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1978-01-15'] = {
    'date': '1978-01-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1978-01-16'] = {
    'date': '1978-01-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1978-02-11'] = {
    'date': '1978-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1978-03-21'] = {
    'date': '1978-03-21',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1978-04-29'] = {
    'date': '1978-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1978-05-03'] = {
    'date': '1978-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1978-05-05'] = {
    'date': '1978-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1978-09-15'] = {
    'date': '1978-09-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1978-09-23'] = {
    'date': '1978-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1978-10-10'] = {
    'date': '1978-10-10',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1978-11-03'] = {
    'date': '1978-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1978-11-23'] = {
    'date': '1978-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1979-01-01'] = {
    'date': '1979-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1979-01-15'] = {
    'date': '1979-01-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1979-02-11'] = {
    'date': '1979-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1979-02-12'] = {
    'date': '1979-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1979-03-21'] = {
    'date': '1979-03-21',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1979-04-29'] = {
    'date': '1979-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1979-04-30'] = {
    'date': '1979-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1979-05-03'] = {
    'date': '1979-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1979-05-05'] = {
    'date': '1979-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1979-09-15'] = {
    'date': '1979-09-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1979-09-24'] = {
    'date': '1979-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1979-10-10'] = {
    'date': '1979-10-10',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1979-11-03'] = {
    'date': '1979-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1979-11-23'] = {
    'date': '1979-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1980-01-01'] = {
    'date': '1980-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1980-01-15'] = {
    'date': '1980-01-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1980-02-11'] = {
    'date': '1980-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1980-03-20'] = {
    'date': '1980-03-20',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1980-04-29'] = {
    'date': '1980-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1980-05-03'] = {
    'date': '1980-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1980-05-05'] = {
    'date': '1980-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1980-09-15'] = {
    'date': '1980-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1980-09-23'] = {
    'date': '1980-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1980-10-10'] = {
    'date': '1980-10-10',
    'week': '金',
    'week_en': 'Friday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1980-11-03'] = {
    'date': '1980-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1980-11-23'] = {
    'date': '1980-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1980-11-24'] = {
    'date': '1980-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1981-01-01'] = {
    'date': '1981-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1981-01-15'] = {
    'date': '1981-01-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1981-02-11'] = {
    'date': '1981-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1981-03-21'] = {
    'date': '1981-03-21',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1981-04-29'] = {
    'date': '1981-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1981-05-03'] = {
    'date': '1981-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1981-05-04'] = {
    'date': '1981-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1981-05-05'] = {
    'date': '1981-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1981-09-15'] = {
    'date': '1981-09-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1981-09-23'] = {
    'date': '1981-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1981-10-10'] = {
    'date': '1981-10-10',
    'week': '土',
    'week_en': 'Saturday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1981-11-03'] = {
    'date': '1981-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1981-11-23'] = {
    'date': '1981-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1982-01-01'] = {
    'date': '1982-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1982-01-15'] = {
    'date': '1982-01-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1982-02-11'] = {
    'date': '1982-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1982-03-21'] = {
    'date': '1982-03-21',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1982-03-22'] = {
    'date': '1982-03-22',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1982-04-29'] = {
    'date': '1982-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1982-05-03'] = {
    'date': '1982-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1982-05-05'] = {
    'date': '1982-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1982-09-15'] = {
    'date': '1982-09-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1982-09-23'] = {
    'date': '1982-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1982-10-10'] = {
    'date': '1982-10-10',
    'week': '日',
    'week_en': 'Sunday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1982-10-11'] = {
    'date': '1982-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1982-11-03'] = {
    'date': '1982-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1982-11-23'] = {
    'date': '1982-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1983-01-01'] = {
    'date': '1983-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1983-01-15'] = {
    'date': '1983-01-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1983-02-11'] = {
    'date': '1983-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1983-03-21'] = {
    'date': '1983-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1983-04-29'] = {
    'date': '1983-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1983-05-03'] = {
    'date': '1983-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1983-05-05'] = {
    'date': '1983-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1983-09-15'] = {
    'date': '1983-09-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1983-09-23'] = {
    'date': '1983-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1983-10-10'] = {
    'date': '1983-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1983-11-03'] = {
    'date': '1983-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1983-11-23'] = {
    'date': '1983-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1984-01-01'] = {
    'date': '1984-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1984-01-02'] = {
    'date': '1984-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1984-01-15'] = {
    'date': '1984-01-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1984-01-16'] = {
    'date': '1984-01-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1984-02-11'] = {
    'date': '1984-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1984-03-20'] = {
    'date': '1984-03-20',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1984-04-29'] = {
    'date': '1984-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1984-04-30'] = {
    'date': '1984-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1984-05-03'] = {
    'date': '1984-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1984-05-05'] = {
    'date': '1984-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1984-09-15'] = {
    'date': '1984-09-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1984-09-23'] = {
    'date': '1984-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1984-09-24'] = {
    'date': '1984-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1984-10-10'] = {
    'date': '1984-10-10',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1984-11-03'] = {
    'date': '1984-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1984-11-23'] = {
    'date': '1984-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1985-01-01'] = {
    'date': '1985-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1985-01-15'] = {
    'date': '1985-01-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1985-02-11'] = {
    'date': '1985-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1985-03-21'] = {
    'date': '1985-03-21',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1985-04-29'] = {
    'date': '1985-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1985-05-03'] = {
    'date': '1985-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1985-05-05'] = {
    'date': '1985-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1985-05-06'] = {
    'date': '1985-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1985-09-15'] = {
    'date': '1985-09-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1985-09-16'] = {
    'date': '1985-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1985-09-23'] = {
    'date': '1985-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1985-10-10'] = {
    'date': '1985-10-10',
    'week': '木',
    'week_en': 'Thursday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1985-11-03'] = {
    'date': '1985-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1985-11-04'] = {
    'date': '1985-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1985-11-23'] = {
    'date': '1985-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1986-01-01'] = {
    'date': '1986-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1986-01-15'] = {
    'date': '1986-01-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1986-02-11'] = {
    'date': '1986-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1986-03-21'] = {
    'date': '1986-03-21',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1986-04-29'] = {
    'date': '1986-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1986-05-03'] = {
    'date': '1986-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1986-05-05'] = {
    'date': '1986-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1986-09-15'] = {
    'date': '1986-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1986-09-23'] = {
    'date': '1986-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1986-10-10'] = {
    'date': '1986-10-10',
    'week': '金',
    'week_en': 'Friday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1986-11-03'] = {
    'date': '1986-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1986-11-23'] = {
    'date': '1986-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1986-11-24'] = {
    'date': '1986-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1987-01-01'] = {
    'date': '1987-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1987-01-15'] = {
    'date': '1987-01-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1987-02-11'] = {
    'date': '1987-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1987-03-21'] = {
    'date': '1987-03-21',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1987-04-29'] = {
    'date': '1987-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1987-05-03'] = {
    'date': '1987-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1987-05-04'] = {
    'date': '1987-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1987-05-05'] = {
    'date': '1987-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1987-09-15'] = {
    'date': '1987-09-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1987-09-23'] = {
    'date': '1987-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1987-10-10'] = {
    'date': '1987-10-10',
    'week': '土',
    'week_en': 'Saturday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1987-11-03'] = {
    'date': '1987-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1987-11-23'] = {
    'date': '1987-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1988-01-01'] = {
    'date': '1988-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1988-01-15'] = {
    'date': '1988-01-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1988-02-11'] = {
    'date': '1988-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1988-03-20'] = {
    'date': '1988-03-20',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1988-03-21'] = {
    'date': '1988-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1988-04-29'] = {
    'date': '1988-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1988-05-03'] = {
    'date': '1988-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1988-05-04'] = {
    'date': '1988-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1988-05-05'] = {
    'date': '1988-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1988-09-15'] = {
    'date': '1988-09-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1988-09-23'] = {
    'date': '1988-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1988-10-10'] = {
    'date': '1988-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1988-11-03'] = {
    'date': '1988-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1988-11-23'] = {
    'date': '1988-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1989-01-01'] = {
    'date': '1989-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1989-01-02'] = {
    'date': '1989-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1989-01-15'] = {
    'date': '1989-01-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1989-01-16'] = {
    'date': '1989-01-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1989-02-11'] = {
    'date': '1989-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1989-02-24'] = {
    'date': '1989-02-24',
    'week': '金',
    'week_en': 'Friday',
    'name': '大喪の礼',
    'name_en': "The Funeral Ceremony of Emperor Showa."
  };
  holidays['1989-03-21'] = {
    'date': '1989-03-21',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1989-04-29'] = {
    'date': '1989-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1989-05-03'] = {
    'date': '1989-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1989-05-04'] = {
    'date': '1989-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1989-05-05'] = {
    'date': '1989-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1989-09-15'] = {
    'date': '1989-09-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1989-09-23'] = {
    'date': '1989-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1989-10-10'] = {
    'date': '1989-10-10',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1989-11-03'] = {
    'date': '1989-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1989-11-23'] = {
    'date': '1989-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1989-12-23'] = {
    'date': '1989-12-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1990-01-01'] = {
    'date': '1990-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1990-01-15'] = {
    'date': '1990-01-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1990-02-11'] = {
    'date': '1990-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1990-02-12'] = {
    'date': '1990-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1990-03-21'] = {
    'date': '1990-03-21',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1990-04-29'] = {
    'date': '1990-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1990-04-30'] = {
    'date': '1990-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1990-05-03'] = {
    'date': '1990-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1990-05-04'] = {
    'date': '1990-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1990-05-05'] = {
    'date': '1990-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1990-09-15'] = {
    'date': '1990-09-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1990-09-23'] = {
    'date': '1990-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1990-09-24'] = {
    'date': '1990-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1990-10-10'] = {
    'date': '1990-10-10',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1990-11-03'] = {
    'date': '1990-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1990-11-12'] = {
    'date': '1990-11-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '即位礼正殿の儀',
    'name_en': "The Ceremony of the Enthronement of His Majesty the Emperor (at the Seiden)"
  };
  holidays['1990-11-23'] = {
    'date': '1990-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1990-12-23'] = {
    'date': '1990-12-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1990-12-24'] = {
    'date': '1990-12-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1991-01-01'] = {
    'date': '1991-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1991-01-15'] = {
    'date': '1991-01-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1991-02-11'] = {
    'date': '1991-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1991-03-21'] = {
    'date': '1991-03-21',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1991-04-29'] = {
    'date': '1991-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1991-05-03'] = {
    'date': '1991-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1991-05-04'] = {
    'date': '1991-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1991-05-05'] = {
    'date': '1991-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1991-05-06'] = {
    'date': '1991-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1991-09-15'] = {
    'date': '1991-09-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1991-09-16'] = {
    'date': '1991-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1991-09-23'] = {
    'date': '1991-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1991-10-10'] = {
    'date': '1991-10-10',
    'week': '木',
    'week_en': 'Thursday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1991-11-03'] = {
    'date': '1991-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1991-11-04'] = {
    'date': '1991-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1991-11-23'] = {
    'date': '1991-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1991-12-23'] = {
    'date': '1991-12-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1992-01-01'] = {
    'date': '1992-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1992-01-15'] = {
    'date': '1992-01-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1992-02-11'] = {
    'date': '1992-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1992-03-20'] = {
    'date': '1992-03-20',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1992-04-29'] = {
    'date': '1992-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1992-05-03'] = {
    'date': '1992-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1992-05-04'] = {
    'date': '1992-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1992-05-05'] = {
    'date': '1992-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1992-09-15'] = {
    'date': '1992-09-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1992-09-23'] = {
    'date': '1992-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1992-10-10'] = {
    'date': '1992-10-10',
    'week': '土',
    'week_en': 'Saturday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1992-11-03'] = {
    'date': '1992-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1992-11-23'] = {
    'date': '1992-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1992-12-23'] = {
    'date': '1992-12-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1993-01-01'] = {
    'date': '1993-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1993-01-15'] = {
    'date': '1993-01-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1993-02-11'] = {
    'date': '1993-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1993-03-20'] = {
    'date': '1993-03-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1993-04-29'] = {
    'date': '1993-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1993-05-03'] = {
    'date': '1993-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1993-05-04'] = {
    'date': '1993-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1993-05-05'] = {
    'date': '1993-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1993-06-09'] = {
    'date': '1993-06-09',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '結婚の儀',
    'name_en': "The Rite of Wedding of HIH Crown Prince Naruhito"
  };
  holidays['1993-09-15'] = {
    'date': '1993-09-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1993-09-23'] = {
    'date': '1993-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1993-10-10'] = {
    'date': '1993-10-10',
    'week': '日',
    'week_en': 'Sunday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1993-10-11'] = {
    'date': '1993-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1993-11-03'] = {
    'date': '1993-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1993-11-23'] = {
    'date': '1993-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1993-12-23'] = {
    'date': '1993-12-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1994-01-01'] = {
    'date': '1994-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1994-01-15'] = {
    'date': '1994-01-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1994-02-11'] = {
    'date': '1994-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1994-03-21'] = {
    'date': '1994-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1994-04-29'] = {
    'date': '1994-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1994-05-03'] = {
    'date': '1994-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1994-05-04'] = {
    'date': '1994-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1994-05-05'] = {
    'date': '1994-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1994-09-15'] = {
    'date': '1994-09-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1994-09-23'] = {
    'date': '1994-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1994-10-10'] = {
    'date': '1994-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1994-11-03'] = {
    'date': '1994-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1994-11-23'] = {
    'date': '1994-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1994-12-23'] = {
    'date': '1994-12-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1995-01-01'] = {
    'date': '1995-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1995-01-02'] = {
    'date': '1995-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1995-01-15'] = {
    'date': '1995-01-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1995-01-16'] = {
    'date': '1995-01-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1995-02-11'] = {
    'date': '1995-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1995-03-21'] = {
    'date': '1995-03-21',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1995-04-29'] = {
    'date': '1995-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1995-05-03'] = {
    'date': '1995-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1995-05-04'] = {
    'date': '1995-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1995-05-05'] = {
    'date': '1995-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1995-09-15'] = {
    'date': '1995-09-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1995-09-23'] = {
    'date': '1995-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1995-10-10'] = {
    'date': '1995-10-10',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1995-11-03'] = {
    'date': '1995-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1995-11-23'] = {
    'date': '1995-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1995-12-23'] = {
    'date': '1995-12-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1996-01-01'] = {
    'date': '1996-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1996-01-15'] = {
    'date': '1996-01-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1996-02-11'] = {
    'date': '1996-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1996-02-12'] = {
    'date': '1996-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1996-03-20'] = {
    'date': '1996-03-20',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1996-04-29'] = {
    'date': '1996-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1996-05-03'] = {
    'date': '1996-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1996-05-04'] = {
    'date': '1996-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1996-05-05'] = {
    'date': '1996-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1996-05-06'] = {
    'date': '1996-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1996-07-20'] = {
    'date': '1996-07-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['1996-09-15'] = {
    'date': '1996-09-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1996-09-16'] = {
    'date': '1996-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1996-09-23'] = {
    'date': '1996-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1996-10-10'] = {
    'date': '1996-10-10',
    'week': '木',
    'week_en': 'Thursday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1996-11-03'] = {
    'date': '1996-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1996-11-04'] = {
    'date': '1996-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1996-11-23'] = {
    'date': '1996-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1996-12-23'] = {
    'date': '1996-12-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1997-01-01'] = {
    'date': '1997-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1997-01-15'] = {
    'date': '1997-01-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1997-02-11'] = {
    'date': '1997-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1997-03-20'] = {
    'date': '1997-03-20',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1997-04-29'] = {
    'date': '1997-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1997-05-03'] = {
    'date': '1997-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1997-05-05'] = {
    'date': '1997-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1997-07-20'] = {
    'date': '1997-07-20',
    'week': '日',
    'week_en': 'Sunday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['1997-07-21'] = {
    'date': '1997-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1997-09-15'] = {
    'date': '1997-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1997-09-23'] = {
    'date': '1997-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1997-10-10'] = {
    'date': '1997-10-10',
    'week': '金',
    'week_en': 'Friday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1997-11-03'] = {
    'date': '1997-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1997-11-23'] = {
    'date': '1997-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1997-11-24'] = {
    'date': '1997-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1997-12-23'] = {
    'date': '1997-12-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1998-01-01'] = {
    'date': '1998-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1998-01-15'] = {
    'date': '1998-01-15',
    'week': '木',
    'week_en': 'Thursday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1998-02-11'] = {
    'date': '1998-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1998-03-21'] = {
    'date': '1998-03-21',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1998-04-29'] = {
    'date': '1998-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1998-05-03'] = {
    'date': '1998-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1998-05-04'] = {
    'date': '1998-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1998-05-05'] = {
    'date': '1998-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1998-07-20'] = {
    'date': '1998-07-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['1998-09-15'] = {
    'date': '1998-09-15',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1998-09-23'] = {
    'date': '1998-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1998-10-10'] = {
    'date': '1998-10-10',
    'week': '土',
    'week_en': 'Saturday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1998-11-03'] = {
    'date': '1998-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1998-11-23'] = {
    'date': '1998-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1998-12-23'] = {
    'date': '1998-12-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['1999-01-01'] = {
    'date': '1999-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['1999-01-15'] = {
    'date': '1999-01-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['1999-02-11'] = {
    'date': '1999-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['1999-03-21'] = {
    'date': '1999-03-21',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['1999-03-22'] = {
    'date': '1999-03-22',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1999-04-29'] = {
    'date': '1999-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['1999-05-03'] = {
    'date': '1999-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['1999-05-04'] = {
    'date': '1999-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['1999-05-05'] = {
    'date': '1999-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['1999-07-20'] = {
    'date': '1999-07-20',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['1999-09-15'] = {
    'date': '1999-09-15',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['1999-09-23'] = {
    'date': '1999-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['1999-10-10'] = {
    'date': '1999-10-10',
    'week': '日',
    'week_en': 'Sunday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['1999-10-11'] = {
    'date': '1999-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['1999-11-03'] = {
    'date': '1999-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['1999-11-23'] = {
    'date': '1999-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['1999-12-23'] = {
    'date': '1999-12-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2000-01-01'] = {
    'date': '2000-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2000-01-10'] = {
    'date': '2000-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2000-02-11'] = {
    'date': '2000-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2000-03-20'] = {
    'date': '2000-03-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2000-04-29'] = {
    'date': '2000-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2000-05-03'] = {
    'date': '2000-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2000-05-04'] = {
    'date': '2000-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2000-05-05'] = {
    'date': '2000-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2000-07-20'] = {
    'date': '2000-07-20',
    'week': '木',
    'week_en': 'Thursday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2000-09-15'] = {
    'date': '2000-09-15',
    'week': '金',
    'week_en': 'Friday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2000-09-23'] = {
    'date': '2000-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2000-10-09'] = {
    'date': '2000-10-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2000-11-03'] = {
    'date': '2000-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2000-11-23'] = {
    'date': '2000-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2000-12-23'] = {
    'date': '2000-12-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2001-01-01'] = {
    'date': '2001-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2001-01-08'] = {
    'date': '2001-01-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2001-02-11'] = {
    'date': '2001-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2001-02-12'] = {
    'date': '2001-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2001-03-20'] = {
    'date': '2001-03-20',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2001-04-29'] = {
    'date': '2001-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2001-04-30'] = {
    'date': '2001-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2001-05-03'] = {
    'date': '2001-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2001-05-04'] = {
    'date': '2001-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2001-05-05'] = {
    'date': '2001-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2001-07-20'] = {
    'date': '2001-07-20',
    'week': '金',
    'week_en': 'Friday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2001-09-15'] = {
    'date': '2001-09-15',
    'week': '土',
    'week_en': 'Saturday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2001-09-23'] = {
    'date': '2001-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2001-09-24'] = {
    'date': '2001-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2001-10-08'] = {
    'date': '2001-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2001-11-03'] = {
    'date': '2001-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2001-11-23'] = {
    'date': '2001-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2001-12-23'] = {
    'date': '2001-12-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2001-12-24'] = {
    'date': '2001-12-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2002-01-01'] = {
    'date': '2002-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2002-01-14'] = {
    'date': '2002-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2002-02-11'] = {
    'date': '2002-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2002-03-21'] = {
    'date': '2002-03-21',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2002-04-29'] = {
    'date': '2002-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2002-05-03'] = {
    'date': '2002-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2002-05-04'] = {
    'date': '2002-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2002-05-05'] = {
    'date': '2002-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2002-05-06'] = {
    'date': '2002-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2002-07-20'] = {
    'date': '2002-07-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2002-09-15'] = {
    'date': '2002-09-15',
    'week': '日',
    'week_en': 'Sunday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2002-09-16'] = {
    'date': '2002-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2002-09-23'] = {
    'date': '2002-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2002-10-14'] = {
    'date': '2002-10-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2002-11-03'] = {
    'date': '2002-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2002-11-04'] = {
    'date': '2002-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2002-11-23'] = {
    'date': '2002-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2002-12-23'] = {
    'date': '2002-12-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2003-01-01'] = {
    'date': '2003-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2003-01-13'] = {
    'date': '2003-01-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2003-02-11'] = {
    'date': '2003-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2003-03-21'] = {
    'date': '2003-03-21',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2003-04-29'] = {
    'date': '2003-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2003-05-03'] = {
    'date': '2003-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2003-05-05'] = {
    'date': '2003-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2003-07-21'] = {
    'date': '2003-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2003-09-15'] = {
    'date': '2003-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2003-09-23'] = {
    'date': '2003-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2003-10-13'] = {
    'date': '2003-10-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2003-11-03'] = {
    'date': '2003-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2003-11-23'] = {
    'date': '2003-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2003-11-24'] = {
    'date': '2003-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2003-12-23'] = {
    'date': '2003-12-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2004-01-01'] = {
    'date': '2004-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2004-01-12'] = {
    'date': '2004-01-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2004-02-11'] = {
    'date': '2004-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2004-03-20'] = {
    'date': '2004-03-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2004-04-29'] = {
    'date': '2004-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2004-05-03'] = {
    'date': '2004-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2004-05-04'] = {
    'date': '2004-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2004-05-05'] = {
    'date': '2004-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2004-07-19'] = {
    'date': '2004-07-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2004-09-20'] = {
    'date': '2004-09-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2004-09-23'] = {
    'date': '2004-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2004-10-11'] = {
    'date': '2004-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2004-11-03'] = {
    'date': '2004-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2004-11-23'] = {
    'date': '2004-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2004-12-23'] = {
    'date': '2004-12-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2005-01-01'] = {
    'date': '2005-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2005-01-10'] = {
    'date': '2005-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2005-02-11'] = {
    'date': '2005-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2005-03-20'] = {
    'date': '2005-03-20',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2005-03-21'] = {
    'date': '2005-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2005-04-29'] = {
    'date': '2005-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2005-05-03'] = {
    'date': '2005-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2005-05-04'] = {
    'date': '2005-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2005-05-05'] = {
    'date': '2005-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2005-07-18'] = {
    'date': '2005-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2005-09-19'] = {
    'date': '2005-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2005-09-23'] = {
    'date': '2005-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2005-10-10'] = {
    'date': '2005-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2005-11-03'] = {
    'date': '2005-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2005-11-23'] = {
    'date': '2005-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2005-12-23'] = {
    'date': '2005-12-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2006-01-01'] = {
    'date': '2006-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2006-01-02'] = {
    'date': '2006-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2006-01-09'] = {
    'date': '2006-01-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2006-02-11'] = {
    'date': '2006-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2006-03-21'] = {
    'date': '2006-03-21',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2006-04-29'] = {
    'date': '2006-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2006-05-03'] = {
    'date': '2006-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2006-05-04'] = {
    'date': '2006-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2006-05-05'] = {
    'date': '2006-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2006-07-17'] = {
    'date': '2006-07-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2006-09-18'] = {
    'date': '2006-09-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2006-09-23'] = {
    'date': '2006-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2006-10-09'] = {
    'date': '2006-10-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2006-11-03'] = {
    'date': '2006-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2006-11-23'] = {
    'date': '2006-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2006-12-23'] = {
    'date': '2006-12-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2007-01-01'] = {
    'date': '2007-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2007-01-08'] = {
    'date': '2007-01-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2007-02-11'] = {
    'date': '2007-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2007-02-12'] = {
    'date': '2007-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2007-03-21'] = {
    'date': '2007-03-21',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2007-04-29'] = {
    'date': '2007-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2007-04-30'] = {
    'date': '2007-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2007-05-03'] = {
    'date': '2007-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2007-05-04'] = {
    'date': '2007-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2007-05-05'] = {
    'date': '2007-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2007-07-16'] = {
    'date': '2007-07-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2007-09-17'] = {
    'date': '2007-09-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2007-09-23'] = {
    'date': '2007-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2007-09-24'] = {
    'date': '2007-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2007-10-08'] = {
    'date': '2007-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2007-11-03'] = {
    'date': '2007-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2007-11-23'] = {
    'date': '2007-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2007-12-23'] = {
    'date': '2007-12-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2007-12-24'] = {
    'date': '2007-12-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2008-01-01'] = {
    'date': '2008-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2008-01-14'] = {
    'date': '2008-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2008-02-11'] = {
    'date': '2008-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2008-03-20'] = {
    'date': '2008-03-20',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2008-04-29'] = {
    'date': '2008-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2008-05-03'] = {
    'date': '2008-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2008-05-04'] = {
    'date': '2008-05-04',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2008-05-05'] = {
    'date': '2008-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2008-05-06'] = {
    'date': '2008-05-06',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2008-07-21'] = {
    'date': '2008-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2008-09-15'] = {
    'date': '2008-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2008-09-23'] = {
    'date': '2008-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2008-10-13'] = {
    'date': '2008-10-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2008-11-03'] = {
    'date': '2008-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2008-11-23'] = {
    'date': '2008-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2008-11-24'] = {
    'date': '2008-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2008-12-23'] = {
    'date': '2008-12-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2009-01-01'] = {
    'date': '2009-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2009-01-12'] = {
    'date': '2009-01-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2009-02-11'] = {
    'date': '2009-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2009-03-20'] = {
    'date': '2009-03-20',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2009-04-29'] = {
    'date': '2009-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2009-05-03'] = {
    'date': '2009-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2009-05-04'] = {
    'date': '2009-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2009-05-05'] = {
    'date': '2009-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2009-05-06'] = {
    'date': '2009-05-06',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2009-07-20'] = {
    'date': '2009-07-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2009-09-21'] = {
    'date': '2009-09-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2009-09-22'] = {
    'date': '2009-09-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2009-09-23'] = {
    'date': '2009-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2009-10-12'] = {
    'date': '2009-10-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2009-11-03'] = {
    'date': '2009-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2009-11-23'] = {
    'date': '2009-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2009-12-23'] = {
    'date': '2009-12-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2010-01-01'] = {
    'date': '2010-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2010-01-11'] = {
    'date': '2010-01-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2010-02-11'] = {
    'date': '2010-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2010-03-21'] = {
    'date': '2010-03-21',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2010-03-22'] = {
    'date': '2010-03-22',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2010-04-29'] = {
    'date': '2010-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2010-05-03'] = {
    'date': '2010-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2010-05-04'] = {
    'date': '2010-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2010-05-05'] = {
    'date': '2010-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2010-07-19'] = {
    'date': '2010-07-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2010-09-20'] = {
    'date': '2010-09-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2010-09-23'] = {
    'date': '2010-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2010-10-11'] = {
    'date': '2010-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2010-11-03'] = {
    'date': '2010-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2010-11-23'] = {
    'date': '2010-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2010-12-23'] = {
    'date': '2010-12-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2011-01-01'] = {
    'date': '2011-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2011-01-10'] = {
    'date': '2011-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2011-02-11'] = {
    'date': '2011-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2011-03-21'] = {
    'date': '2011-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2011-04-29'] = {
    'date': '2011-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2011-05-03'] = {
    'date': '2011-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2011-05-04'] = {
    'date': '2011-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2011-05-05'] = {
    'date': '2011-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2011-07-18'] = {
    'date': '2011-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2011-09-19'] = {
    'date': '2011-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2011-09-23'] = {
    'date': '2011-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2011-10-10'] = {
    'date': '2011-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2011-11-03'] = {
    'date': '2011-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2011-11-23'] = {
    'date': '2011-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2011-12-23'] = {
    'date': '2011-12-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2012-01-01'] = {
    'date': '2012-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2012-01-02'] = {
    'date': '2012-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2012-01-09'] = {
    'date': '2012-01-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2012-02-11'] = {
    'date': '2012-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2012-03-20'] = {
    'date': '2012-03-20',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2012-04-29'] = {
    'date': '2012-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2012-04-30'] = {
    'date': '2012-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2012-05-03'] = {
    'date': '2012-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2012-05-04'] = {
    'date': '2012-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2012-05-05'] = {
    'date': '2012-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2012-07-16'] = {
    'date': '2012-07-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2012-09-17'] = {
    'date': '2012-09-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2012-09-22'] = {
    'date': '2012-09-22',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2012-10-08'] = {
    'date': '2012-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2012-11-03'] = {
    'date': '2012-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2012-11-23'] = {
    'date': '2012-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2012-12-23'] = {
    'date': '2012-12-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2012-12-24'] = {
    'date': '2012-12-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2013-01-01'] = {
    'date': '2013-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2013-01-14'] = {
    'date': '2013-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2013-02-11'] = {
    'date': '2013-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2013-03-20'] = {
    'date': '2013-03-20',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2013-04-29'] = {
    'date': '2013-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2013-05-03'] = {
    'date': '2013-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2013-05-04'] = {
    'date': '2013-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2013-05-05'] = {
    'date': '2013-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2013-05-06'] = {
    'date': '2013-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2013-07-15'] = {
    'date': '2013-07-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2013-09-16'] = {
    'date': '2013-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2013-09-23'] = {
    'date': '2013-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2013-10-14'] = {
    'date': '2013-10-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2013-11-03'] = {
    'date': '2013-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2013-11-04'] = {
    'date': '2013-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2013-11-23'] = {
    'date': '2013-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2013-12-23'] = {
    'date': '2013-12-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2014-01-01'] = {
    'date': '2014-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2014-01-13'] = {
    'date': '2014-01-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2014-02-11'] = {
    'date': '2014-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2014-03-21'] = {
    'date': '2014-03-21',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2014-04-29'] = {
    'date': '2014-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2014-05-03'] = {
    'date': '2014-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2014-05-04'] = {
    'date': '2014-05-04',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2014-05-05'] = {
    'date': '2014-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2014-05-06'] = {
    'date': '2014-05-06',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2014-07-21'] = {
    'date': '2014-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2014-09-15'] = {
    'date': '2014-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2014-09-23'] = {
    'date': '2014-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2014-10-13'] = {
    'date': '2014-10-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2014-11-03'] = {
    'date': '2014-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2014-11-23'] = {
    'date': '2014-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2014-11-24'] = {
    'date': '2014-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2014-12-23'] = {
    'date': '2014-12-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2015-01-01'] = {
    'date': '2015-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2015-01-12'] = {
    'date': '2015-01-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2015-02-11'] = {
    'date': '2015-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2015-03-21'] = {
    'date': '2015-03-21',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2015-04-29'] = {
    'date': '2015-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2015-05-03'] = {
    'date': '2015-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2015-05-04'] = {
    'date': '2015-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2015-05-05'] = {
    'date': '2015-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2015-05-06'] = {
    'date': '2015-05-06',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2015-07-20'] = {
    'date': '2015-07-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2015-09-21'] = {
    'date': '2015-09-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2015-09-22'] = {
    'date': '2015-09-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2015-09-23'] = {
    'date': '2015-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2015-10-12'] = {
    'date': '2015-10-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2015-11-03'] = {
    'date': '2015-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2015-11-23'] = {
    'date': '2015-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2015-12-23'] = {
    'date': '2015-12-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2016-01-01'] = {
    'date': '2016-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2016-01-11'] = {
    'date': '2016-01-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2016-02-11'] = {
    'date': '2016-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2016-03-20'] = {
    'date': '2016-03-20',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2016-03-21'] = {
    'date': '2016-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2016-04-29'] = {
    'date': '2016-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2016-05-03'] = {
    'date': '2016-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2016-05-04'] = {
    'date': '2016-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2016-05-05'] = {
    'date': '2016-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2016-07-18'] = {
    'date': '2016-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2016-08-11'] = {
    'date': '2016-08-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2016-09-19'] = {
    'date': '2016-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2016-09-22'] = {
    'date': '2016-09-22',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2016-10-10'] = {
    'date': '2016-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2016-11-03'] = {
    'date': '2016-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2016-11-23'] = {
    'date': '2016-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2016-12-23'] = {
    'date': '2016-12-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2017-01-01'] = {
    'date': '2017-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2017-01-02'] = {
    'date': '2017-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2017-01-09'] = {
    'date': '2017-01-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2017-02-11'] = {
    'date': '2017-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2017-03-20'] = {
    'date': '2017-03-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2017-04-29'] = {
    'date': '2017-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2017-05-03'] = {
    'date': '2017-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2017-05-04'] = {
    'date': '2017-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2017-05-05'] = {
    'date': '2017-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2017-07-17'] = {
    'date': '2017-07-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2017-08-11'] = {
    'date': '2017-08-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2017-09-18'] = {
    'date': '2017-09-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2017-09-23'] = {
    'date': '2017-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2017-10-09'] = {
    'date': '2017-10-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2017-11-03'] = {
    'date': '2017-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2017-11-23'] = {
    'date': '2017-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2017-12-23'] = {
    'date': '2017-12-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2018-01-01'] = {
    'date': '2018-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2018-01-08'] = {
    'date': '2018-01-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2018-02-11'] = {
    'date': '2018-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2018-02-12'] = {
    'date': '2018-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2018-03-21'] = {
    'date': '2018-03-21',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2018-04-29'] = {
    'date': '2018-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2018-04-30'] = {
    'date': '2018-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2018-05-03'] = {
    'date': '2018-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2018-05-04'] = {
    'date': '2018-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2018-05-05'] = {
    'date': '2018-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2018-07-16'] = {
    'date': '2018-07-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2018-08-11'] = {
    'date': '2018-08-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2018-09-17'] = {
    'date': '2018-09-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2018-09-23'] = {
    'date': '2018-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2018-09-24'] = {
    'date': '2018-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2018-10-08'] = {
    'date': '2018-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日',
    'name_en': "Health and Sports Day"
  };
  holidays['2018-11-03'] = {
    'date': '2018-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2018-11-23'] = {
    'date': '2018-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2018-12-23'] = {
    'date': '2018-12-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2018-12-24'] = {
    'date': '2018-12-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2019-01-01'] = {
    'date': '2019-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2019-01-14'] = {
    'date': '2019-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2019-02-11'] = {
    'date': '2019-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2019-03-21'] = {
    'date': '2019-03-21',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2019-04-29'] = {
    'date': '2019-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2019-04-30'] = {
    'date': '2019-04-30',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Holiday"
  };
  holidays['2019-05-01'] = {
    'date': '2019-05-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '休日（祝日扱い）',
    'name_en': "Holiday"
  };
  holidays['2019-05-02'] = {
    'date': '2019-05-02',
    'week': '木',
    'week_en': 'Thursday',
    'name': '休日',
    'name_en': "Holiday"
  };
  holidays['2019-05-03'] = {
    'date': '2019-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2019-05-04'] = {
    'date': '2019-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2019-05-05'] = {
    'date': '2019-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2019-05-06'] = {
    'date': '2019-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2019-07-15'] = {
    'date': '2019-07-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2019-08-11'] = {
    'date': '2019-08-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2019-08-12'] = {
    'date': '2019-08-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2019-09-16'] = {
    'date': '2019-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2019-09-23'] = {
    'date': '2019-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2019-10-14'] = {
    'date': '2019-10-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '体育の日（スポーツの日）',
    'name_en': "Health and Sports Day"
  };
  holidays['2019-10-22'] = {
    'date': '2019-10-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日（祝日扱い）',
    'name_en': "Holiday"
  };
  holidays['2019-11-03'] = {
    'date': '2019-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2019-11-04'] = {
    'date': '2019-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2019-11-23'] = {
    'date': '2019-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2020-01-01'] = {
    'date': '2020-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2020-01-13'] = {
    'date': '2020-01-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2020-02-11'] = {
    'date': '2020-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2020-02-23'] = {
    'date': '2020-02-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2020-02-24'] = {
    'date': '2020-02-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2020-03-20'] = {
    'date': '2020-03-20',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2020-04-29'] = {
    'date': '2020-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2020-05-03'] = {
    'date': '2020-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2020-05-04'] = {
    'date': '2020-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2020-05-05'] = {
    'date': '2020-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2020-05-06'] = {
    'date': '2020-05-06',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2020-07-23'] = {
    'date': '2020-07-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2020-07-24'] = {
    'date': '2020-07-24',
    'week': '金',
    'week_en': 'Friday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2020-08-10'] = {
    'date': '2020-08-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2020-09-21'] = {
    'date': '2020-09-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2020-09-22'] = {
    'date': '2020-09-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2020-11-03'] = {
    'date': '2020-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2020-11-23'] = {
    'date': '2020-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2021-01-01'] = {
    'date': '2021-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2021-01-11'] = {
    'date': '2021-01-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2021-02-11'] = {
    'date': '2021-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2021-02-23'] = {
    'date': '2021-02-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2021-03-20'] = {
    'date': '2021-03-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2021-04-29'] = {
    'date': '2021-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2021-05-03'] = {
    'date': '2021-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2021-05-04'] = {
    'date': '2021-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2021-05-05'] = {
    'date': '2021-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2021-07-22'] = {
    'date': '2021-07-22',
    'week': '木',
    'week_en': 'Thursday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2021-07-23'] = {
    'date': '2021-07-23',
    'week': '金',
    'week_en': 'Friday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2021-08-08'] = {
    'date': '2021-08-08',
    'week': '日',
    'week_en': 'Sunday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2021-08-09'] = {
    'date': '2021-08-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2021-09-20'] = {
    'date': '2021-09-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2021-09-23'] = {
    'date': '2021-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2021-11-03'] = {
    'date': '2021-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2021-11-23'] = {
    'date': '2021-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2022-01-01'] = {
    'date': '2022-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2022-01-10'] = {
    'date': '2022-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2022-02-11'] = {
    'date': '2022-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2022-02-23'] = {
    'date': '2022-02-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2022-03-21'] = {
    'date': '2022-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2022-04-29'] = {
    'date': '2022-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2022-05-03'] = {
    'date': '2022-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2022-05-04'] = {
    'date': '2022-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2022-05-05'] = {
    'date': '2022-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2022-07-18'] = {
    'date': '2022-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2022-08-11'] = {
    'date': '2022-08-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2022-09-19'] = {
    'date': '2022-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2022-09-23'] = {
    'date': '2022-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2022-10-10'] = {
    'date': '2022-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2022-11-03'] = {
    'date': '2022-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2022-11-23'] = {
    'date': '2022-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2023-01-01'] = {
    'date': '2023-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2023-01-02'] = {
    'date': '2023-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2023-01-09'] = {
    'date': '2023-01-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2023-02-11'] = {
    'date': '2023-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2023-02-23'] = {
    'date': '2023-02-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2023-03-21'] = {
    'date': '2023-03-21',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2023-04-29'] = {
    'date': '2023-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2023-05-03'] = {
    'date': '2023-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2023-05-04'] = {
    'date': '2023-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2023-05-05'] = {
    'date': '2023-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2023-07-17'] = {
    'date': '2023-07-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2023-08-11'] = {
    'date': '2023-08-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2023-09-18'] = {
    'date': '2023-09-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2023-09-23'] = {
    'date': '2023-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2023-10-09'] = {
    'date': '2023-10-09',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2023-11-03'] = {
    'date': '2023-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2023-11-23'] = {
    'date': '2023-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2024-01-01'] = {
    'date': '2024-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2024-01-08'] = {
    'date': '2024-01-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2024-02-11'] = {
    'date': '2024-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2024-02-12'] = {
    'date': '2024-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2024-02-23'] = {
    'date': '2024-02-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2024-03-20'] = {
    'date': '2024-03-20',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2024-04-29'] = {
    'date': '2024-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2024-05-03'] = {
    'date': '2024-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2024-05-04'] = {
    'date': '2024-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2024-05-05'] = {
    'date': '2024-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2024-05-06'] = {
    'date': '2024-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2024-07-15'] = {
    'date': '2024-07-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2024-08-11'] = {
    'date': '2024-08-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2024-08-12'] = {
    'date': '2024-08-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2024-09-16'] = {
    'date': '2024-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2024-09-22'] = {
    'date': '2024-09-22',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2024-09-23'] = {
    'date': '2024-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2024-10-14'] = {
    'date': '2024-10-14',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2024-11-03'] = {
    'date': '2024-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2024-11-04'] = {
    'date': '2024-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2024-11-23'] = {
    'date': '2024-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2025-01-01'] = {
    'date': '2025-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2025-01-13'] = {
    'date': '2025-01-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2025-02-11'] = {
    'date': '2025-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2025-02-23'] = {
    'date': '2025-02-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2025-02-24'] = {
    'date': '2025-02-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2025-03-20'] = {
    'date': '2025-03-20',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2025-04-29'] = {
    'date': '2025-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2025-05-03'] = {
    'date': '2025-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2025-05-04'] = {
    'date': '2025-05-04',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2025-05-05'] = {
    'date': '2025-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2025-05-06'] = {
    'date': '2025-05-06',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2025-07-21'] = {
    'date': '2025-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2025-08-11'] = {
    'date': '2025-08-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2025-09-15'] = {
    'date': '2025-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2025-09-23'] = {
    'date': '2025-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2025-10-13'] = {
    'date': '2025-10-13',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2025-11-03'] = {
    'date': '2025-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2025-11-23'] = {
    'date': '2025-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2025-11-24'] = {
    'date': '2025-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2026-01-01'] = {
    'date': '2026-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2026-01-12'] = {
    'date': '2026-01-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2026-02-11'] = {
    'date': '2026-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2026-02-23'] = {
    'date': '2026-02-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2026-03-20'] = {
    'date': '2026-03-20',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2026-04-29'] = {
    'date': '2026-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2026-05-03'] = {
    'date': '2026-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2026-05-04'] = {
    'date': '2026-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2026-05-05'] = {
    'date': '2026-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2026-05-06'] = {
    'date': '2026-05-06',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2026-07-20'] = {
    'date': '2026-07-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2026-08-11'] = {
    'date': '2026-08-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2026-09-21'] = {
    'date': '2026-09-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2026-09-22'] = {
    'date': '2026-09-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2026-09-23'] = {
    'date': '2026-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2026-10-12'] = {
    'date': '2026-10-12',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2026-11-03'] = {
    'date': '2026-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2026-11-23'] = {
    'date': '2026-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2027-01-01'] = {
    'date': '2027-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2027-01-11'] = {
    'date': '2027-01-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2027-02-11'] = {
    'date': '2027-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2027-02-23'] = {
    'date': '2027-02-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2027-03-21'] = {
    'date': '2027-03-21',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2027-03-22'] = {
    'date': '2027-03-22',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2027-04-29'] = {
    'date': '2027-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2027-05-03'] = {
    'date': '2027-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2027-05-04'] = {
    'date': '2027-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2027-05-05'] = {
    'date': '2027-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2027-07-19'] = {
    'date': '2027-07-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2027-08-11'] = {
    'date': '2027-08-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2027-09-20'] = {
    'date': '2027-09-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2027-09-23'] = {
    'date': '2027-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2027-10-11'] = {
    'date': '2027-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2027-11-03'] = {
    'date': '2027-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2027-11-23'] = {
    'date': '2027-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2028-01-01'] = {
    'date': '2028-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2028-01-10'] = {
    'date': '2028-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2028-02-11'] = {
    'date': '2028-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2028-02-23'] = {
    'date': '2028-02-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2028-03-20'] = {
    'date': '2028-03-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2028-04-29'] = {
    'date': '2028-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2028-05-03'] = {
    'date': '2028-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2028-05-04'] = {
    'date': '2028-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2028-05-05'] = {
    'date': '2028-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2028-07-17'] = {
    'date': '2028-07-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2028-08-11'] = {
    'date': '2028-08-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2028-09-18'] = {
    'date': '2028-09-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2028-09-22'] = {
    'date': '2028-09-22',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2028-10-09'] = {
    'date': '2028-10-09',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2028-11-03'] = {
    'date': '2028-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2028-11-23'] = {
    'date': '2028-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2029-01-01'] = {
    'date': '2029-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2029-01-08'] = {
    'date': '2029-01-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2029-02-11'] = {
    'date': '2029-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2029-02-12'] = {
    'date': '2029-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2029-02-23'] = {
    'date': '2029-02-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2029-03-20'] = {
    'date': '2029-03-20',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2029-04-29'] = {
    'date': '2029-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2029-04-30'] = {
    'date': '2029-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2029-05-03'] = {
    'date': '2029-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2029-05-04'] = {
    'date': '2029-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2029-05-05'] = {
    'date': '2029-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2029-07-16'] = {
    'date': '2029-07-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2029-08-11'] = {
    'date': '2029-08-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2029-09-17'] = {
    'date': '2029-09-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2029-09-23'] = {
    'date': '2029-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2029-09-24'] = {
    'date': '2029-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2029-10-08'] = {
    'date': '2029-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2029-11-03'] = {
    'date': '2029-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2029-11-23'] = {
    'date': '2029-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2030-01-01'] = {
    'date': '2030-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2030-01-14'] = {
    'date': '2030-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2030-02-11'] = {
    'date': '2030-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2030-02-23'] = {
    'date': '2030-02-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2030-03-20'] = {
    'date': '2030-03-20',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2030-04-29'] = {
    'date': '2030-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2030-05-03'] = {
    'date': '2030-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2030-05-04'] = {
    'date': '2030-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2030-05-05'] = {
    'date': '2030-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2030-05-06'] = {
    'date': '2030-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2030-07-15'] = {
    'date': '2030-07-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2030-08-11'] = {
    'date': '2030-08-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2030-08-12'] = {
    'date': '2030-08-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2030-09-16'] = {
    'date': '2030-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2030-09-23'] = {
    'date': '2030-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2030-10-14'] = {
    'date': '2030-10-14',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2030-11-03'] = {
    'date': '2030-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2030-11-04'] = {
    'date': '2030-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2030-11-23'] = {
    'date': '2030-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2031-01-01'] = {
    'date': '2031-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2031-01-13'] = {
    'date': '2031-01-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2031-02-11'] = {
    'date': '2031-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2031-02-23'] = {
    'date': '2031-02-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2031-02-24'] = {
    'date': '2031-02-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2031-03-21'] = {
    'date': '2031-03-21',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2031-04-29'] = {
    'date': '2031-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2031-05-03'] = {
    'date': '2031-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2031-05-04'] = {
    'date': '2031-05-04',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2031-05-05'] = {
    'date': '2031-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2031-05-06'] = {
    'date': '2031-05-06',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2031-07-21'] = {
    'date': '2031-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2031-08-11'] = {
    'date': '2031-08-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2031-09-15'] = {
    'date': '2031-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2031-09-23'] = {
    'date': '2031-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2031-10-13'] = {
    'date': '2031-10-13',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2031-11-03'] = {
    'date': '2031-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2031-11-23'] = {
    'date': '2031-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2031-11-24'] = {
    'date': '2031-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2032-01-01'] = {
    'date': '2032-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2032-01-12'] = {
    'date': '2032-01-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2032-02-11'] = {
    'date': '2032-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2032-02-23'] = {
    'date': '2032-02-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2032-03-20'] = {
    'date': '2032-03-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2032-04-29'] = {
    'date': '2032-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2032-05-03'] = {
    'date': '2032-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2032-05-04'] = {
    'date': '2032-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2032-05-05'] = {
    'date': '2032-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2032-07-19'] = {
    'date': '2032-07-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2032-08-11'] = {
    'date': '2032-08-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2032-09-20'] = {
    'date': '2032-09-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2032-09-21'] = {
    'date': '2032-09-21',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2032-09-22'] = {
    'date': '2032-09-22',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2032-10-11'] = {
    'date': '2032-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2032-11-03'] = {
    'date': '2032-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2032-11-23'] = {
    'date': '2032-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2033-01-01'] = {
    'date': '2033-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2033-01-10'] = {
    'date': '2033-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2033-02-11'] = {
    'date': '2033-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2033-02-23'] = {
    'date': '2033-02-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2033-03-20'] = {
    'date': '2033-03-20',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2033-03-21'] = {
    'date': '2033-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2033-04-29'] = {
    'date': '2033-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2033-05-03'] = {
    'date': '2033-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2033-05-04'] = {
    'date': '2033-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2033-05-05'] = {
    'date': '2033-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2033-07-18'] = {
    'date': '2033-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2033-08-11'] = {
    'date': '2033-08-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2033-09-19'] = {
    'date': '2033-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2033-09-23'] = {
    'date': '2033-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2033-10-10'] = {
    'date': '2033-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2033-11-03'] = {
    'date': '2033-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2033-11-23'] = {
    'date': '2033-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2034-01-01'] = {
    'date': '2034-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2034-01-02'] = {
    'date': '2034-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2034-01-09'] = {
    'date': '2034-01-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2034-02-11'] = {
    'date': '2034-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2034-02-23'] = {
    'date': '2034-02-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2034-03-20'] = {
    'date': '2034-03-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2034-04-29'] = {
    'date': '2034-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2034-05-03'] = {
    'date': '2034-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2034-05-04'] = {
    'date': '2034-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2034-05-05'] = {
    'date': '2034-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2034-07-17'] = {
    'date': '2034-07-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2034-08-11'] = {
    'date': '2034-08-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2034-09-18'] = {
    'date': '2034-09-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2034-09-23'] = {
    'date': '2034-09-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2034-10-09'] = {
    'date': '2034-10-09',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2034-11-03'] = {
    'date': '2034-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2034-11-23'] = {
    'date': '2034-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2035-01-01'] = {
    'date': '2035-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2035-01-08'] = {
    'date': '2035-01-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2035-02-11'] = {
    'date': '2035-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2035-02-12'] = {
    'date': '2035-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2035-02-23'] = {
    'date': '2035-02-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2035-03-21'] = {
    'date': '2035-03-21',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2035-04-29'] = {
    'date': '2035-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2035-04-30'] = {
    'date': '2035-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2035-05-03'] = {
    'date': '2035-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2035-05-04'] = {
    'date': '2035-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2035-05-05'] = {
    'date': '2035-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2035-07-16'] = {
    'date': '2035-07-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2035-08-11'] = {
    'date': '2035-08-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2035-09-17'] = {
    'date': '2035-09-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2035-09-23'] = {
    'date': '2035-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2035-09-24'] = {
    'date': '2035-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2035-10-08'] = {
    'date': '2035-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2035-11-03'] = {
    'date': '2035-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2035-11-23'] = {
    'date': '2035-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2036-01-01'] = {
    'date': '2036-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2036-01-14'] = {
    'date': '2036-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2036-02-11'] = {
    'date': '2036-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2036-02-23'] = {
    'date': '2036-02-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2036-03-20'] = {
    'date': '2036-03-20',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2036-04-29'] = {
    'date': '2036-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2036-05-03'] = {
    'date': '2036-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2036-05-04'] = {
    'date': '2036-05-04',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2036-05-05'] = {
    'date': '2036-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2036-05-06'] = {
    'date': '2036-05-06',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2036-07-21'] = {
    'date': '2036-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2036-08-11'] = {
    'date': '2036-08-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2036-09-15'] = {
    'date': '2036-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2036-09-22'] = {
    'date': '2036-09-22',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2036-10-13'] = {
    'date': '2036-10-13',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2036-11-03'] = {
    'date': '2036-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2036-11-23'] = {
    'date': '2036-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2036-11-24'] = {
    'date': '2036-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2037-01-01'] = {
    'date': '2037-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2037-01-12'] = {
    'date': '2037-01-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2037-02-11'] = {
    'date': '2037-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2037-02-23'] = {
    'date': '2037-02-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2037-03-20'] = {
    'date': '2037-03-20',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2037-04-29'] = {
    'date': '2037-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2037-05-03'] = {
    'date': '2037-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2037-05-04'] = {
    'date': '2037-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2037-05-05'] = {
    'date': '2037-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2037-05-06'] = {
    'date': '2037-05-06',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2037-07-20'] = {
    'date': '2037-07-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2037-08-11'] = {
    'date': '2037-08-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2037-09-21'] = {
    'date': '2037-09-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2037-09-22'] = {
    'date': '2037-09-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2037-09-23'] = {
    'date': '2037-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2037-10-12'] = {
    'date': '2037-10-12',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2037-11-03'] = {
    'date': '2037-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2037-11-23'] = {
    'date': '2037-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2038-01-01'] = {
    'date': '2038-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2038-01-11'] = {
    'date': '2038-01-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2038-02-11'] = {
    'date': '2038-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2038-02-23'] = {
    'date': '2038-02-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2038-03-20'] = {
    'date': '2038-03-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2038-04-29'] = {
    'date': '2038-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2038-05-03'] = {
    'date': '2038-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2038-05-04'] = {
    'date': '2038-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2038-05-05'] = {
    'date': '2038-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2038-07-19'] = {
    'date': '2038-07-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2038-08-11'] = {
    'date': '2038-08-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2038-09-20'] = {
    'date': '2038-09-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2038-09-23'] = {
    'date': '2038-09-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2038-10-11'] = {
    'date': '2038-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2038-11-03'] = {
    'date': '2038-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2038-11-23'] = {
    'date': '2038-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2039-01-01'] = {
    'date': '2039-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2039-01-10'] = {
    'date': '2039-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2039-02-11'] = {
    'date': '2039-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2039-02-23'] = {
    'date': '2039-02-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2039-03-21'] = {
    'date': '2039-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2039-04-29'] = {
    'date': '2039-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2039-05-03'] = {
    'date': '2039-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2039-05-04'] = {
    'date': '2039-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2039-05-05'] = {
    'date': '2039-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2039-07-18'] = {
    'date': '2039-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2039-08-11'] = {
    'date': '2039-08-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2039-09-19'] = {
    'date': '2039-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2039-09-23'] = {
    'date': '2039-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2039-10-10'] = {
    'date': '2039-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2039-11-03'] = {
    'date': '2039-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2039-11-23'] = {
    'date': '2039-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2040-01-01'] = {
    'date': '2040-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2040-01-02'] = {
    'date': '2040-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2040-01-09'] = {
    'date': '2040-01-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2040-02-11'] = {
    'date': '2040-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2040-02-23'] = {
    'date': '2040-02-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2040-03-20'] = {
    'date': '2040-03-20',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2040-04-29'] = {
    'date': '2040-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2040-04-30'] = {
    'date': '2040-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2040-05-03'] = {
    'date': '2040-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2040-05-04'] = {
    'date': '2040-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2040-05-05'] = {
    'date': '2040-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2040-07-16'] = {
    'date': '2040-07-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2040-08-11'] = {
    'date': '2040-08-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2040-09-17'] = {
    'date': '2040-09-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2040-09-22'] = {
    'date': '2040-09-22',
    'week': '土',
    'week_en': 'Saturday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2040-10-08'] = {
    'date': '2040-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2040-11-03'] = {
    'date': '2040-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2040-11-23'] = {
    'date': '2040-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2041-01-01'] = {
    'date': '2041-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2041-01-14'] = {
    'date': '2041-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2041-02-11'] = {
    'date': '2041-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2041-02-23'] = {
    'date': '2041-02-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2041-03-20'] = {
    'date': '2041-03-20',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2041-04-29'] = {
    'date': '2041-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2041-05-03'] = {
    'date': '2041-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2041-05-04'] = {
    'date': '2041-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2041-05-05'] = {
    'date': '2041-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2041-05-06'] = {
    'date': '2041-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2041-07-15'] = {
    'date': '2041-07-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2041-08-11'] = {
    'date': '2041-08-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2041-08-12'] = {
    'date': '2041-08-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2041-09-16'] = {
    'date': '2041-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2041-09-23'] = {
    'date': '2041-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2041-10-14'] = {
    'date': '2041-10-14',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2041-11-03'] = {
    'date': '2041-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2041-11-04'] = {
    'date': '2041-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2041-11-23'] = {
    'date': '2041-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2042-01-01'] = {
    'date': '2042-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2042-01-13'] = {
    'date': '2042-01-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2042-02-11'] = {
    'date': '2042-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2042-02-23'] = {
    'date': '2042-02-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2042-02-24'] = {
    'date': '2042-02-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2042-03-20'] = {
    'date': '2042-03-20',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2042-04-29'] = {
    'date': '2042-04-29',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2042-05-03'] = {
    'date': '2042-05-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2042-05-04'] = {
    'date': '2042-05-04',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2042-05-05'] = {
    'date': '2042-05-05',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2042-05-06'] = {
    'date': '2042-05-06',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2042-07-21'] = {
    'date': '2042-07-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2042-08-11'] = {
    'date': '2042-08-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2042-09-15'] = {
    'date': '2042-09-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2042-09-23'] = {
    'date': '2042-09-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2042-10-13'] = {
    'date': '2042-10-13',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2042-11-03'] = {
    'date': '2042-11-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2042-11-23'] = {
    'date': '2042-11-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2042-11-24'] = {
    'date': '2042-11-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2043-01-01'] = {
    'date': '2043-01-01',
    'week': '木',
    'week_en': 'Thursday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2043-01-12'] = {
    'date': '2043-01-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2043-02-11'] = {
    'date': '2043-02-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2043-02-23'] = {
    'date': '2043-02-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2043-03-21'] = {
    'date': '2043-03-21',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2043-04-29'] = {
    'date': '2043-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2043-05-03'] = {
    'date': '2043-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2043-05-04'] = {
    'date': '2043-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2043-05-05'] = {
    'date': '2043-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2043-05-06'] = {
    'date': '2043-05-06',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2043-07-20'] = {
    'date': '2043-07-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2043-08-11'] = {
    'date': '2043-08-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2043-09-21'] = {
    'date': '2043-09-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2043-09-22'] = {
    'date': '2043-09-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2043-09-23'] = {
    'date': '2043-09-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2043-10-12'] = {
    'date': '2043-10-12',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2043-11-03'] = {
    'date': '2043-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2043-11-23'] = {
    'date': '2043-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2044-01-01'] = {
    'date': '2044-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2044-01-11'] = {
    'date': '2044-01-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2044-02-11'] = {
    'date': '2044-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2044-02-23'] = {
    'date': '2044-02-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2044-03-20'] = {
    'date': '2044-03-20',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2044-03-21'] = {
    'date': '2044-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2044-04-29'] = {
    'date': '2044-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2044-05-03'] = {
    'date': '2044-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2044-05-04'] = {
    'date': '2044-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2044-05-05'] = {
    'date': '2044-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2044-07-18'] = {
    'date': '2044-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2044-08-11'] = {
    'date': '2044-08-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2044-09-19'] = {
    'date': '2044-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2044-09-22'] = {
    'date': '2044-09-22',
    'week': '木',
    'week_en': 'Thursday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2044-10-10'] = {
    'date': '2044-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2044-11-03'] = {
    'date': '2044-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2044-11-23'] = {
    'date': '2044-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2045-01-01'] = {
    'date': '2045-01-01',
    'week': '日',
    'week_en': 'Sunday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2045-01-02'] = {
    'date': '2045-01-02',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2045-01-09'] = {
    'date': '2045-01-09',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2045-02-11'] = {
    'date': '2045-02-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2045-02-23'] = {
    'date': '2045-02-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2045-03-20'] = {
    'date': '2045-03-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2045-04-29'] = {
    'date': '2045-04-29',
    'week': '土',
    'week_en': 'Saturday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2045-05-03'] = {
    'date': '2045-05-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2045-05-04'] = {
    'date': '2045-05-04',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2045-05-05'] = {
    'date': '2045-05-05',
    'week': '金',
    'week_en': 'Friday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2045-07-17'] = {
    'date': '2045-07-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2045-08-11'] = {
    'date': '2045-08-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2045-09-18'] = {
    'date': '2045-09-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2045-09-22'] = {
    'date': '2045-09-22',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2045-10-09'] = {
    'date': '2045-10-09',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2045-11-03'] = {
    'date': '2045-11-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2045-11-23'] = {
    'date': '2045-11-23',
    'week': '木',
    'week_en': 'Thursday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2046-01-01'] = {
    'date': '2046-01-01',
    'week': '月',
    'week_en': 'Monday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2046-01-08'] = {
    'date': '2046-01-08',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2046-02-11'] = {
    'date': '2046-02-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2046-02-12'] = {
    'date': '2046-02-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2046-02-23'] = {
    'date': '2046-02-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2046-03-20'] = {
    'date': '2046-03-20',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2046-04-29'] = {
    'date': '2046-04-29',
    'week': '日',
    'week_en': 'Sunday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2046-04-30'] = {
    'date': '2046-04-30',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2046-05-03'] = {
    'date': '2046-05-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2046-05-04'] = {
    'date': '2046-05-04',
    'week': '金',
    'week_en': 'Friday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2046-05-05'] = {
    'date': '2046-05-05',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2046-07-16'] = {
    'date': '2046-07-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2046-08-11'] = {
    'date': '2046-08-11',
    'week': '土',
    'week_en': 'Saturday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2046-09-17'] = {
    'date': '2046-09-17',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2046-09-23'] = {
    'date': '2046-09-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2046-09-24'] = {
    'date': '2046-09-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2046-10-08'] = {
    'date': '2046-10-08',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2046-11-03'] = {
    'date': '2046-11-03',
    'week': '土',
    'week_en': 'Saturday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2046-11-23'] = {
    'date': '2046-11-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2047-01-01'] = {
    'date': '2047-01-01',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2047-01-14'] = {
    'date': '2047-01-14',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2047-02-11'] = {
    'date': '2047-02-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2047-02-23'] = {
    'date': '2047-02-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2047-03-21'] = {
    'date': '2047-03-21',
    'week': '木',
    'week_en': 'Thursday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2047-04-29'] = {
    'date': '2047-04-29',
    'week': '月',
    'week_en': 'Monday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2047-05-03'] = {
    'date': '2047-05-03',
    'week': '金',
    'week_en': 'Friday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2047-05-04'] = {
    'date': '2047-05-04',
    'week': '土',
    'week_en': 'Saturday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2047-05-05'] = {
    'date': '2047-05-05',
    'week': '日',
    'week_en': 'Sunday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2047-05-06'] = {
    'date': '2047-05-06',
    'week': '月',
    'week_en': 'Monday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2047-07-15'] = {
    'date': '2047-07-15',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2047-08-11'] = {
    'date': '2047-08-11',
    'week': '日',
    'week_en': 'Sunday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2047-08-12'] = {
    'date': '2047-08-12',
    'week': '月',
    'week_en': 'Monday',
    'name': '山の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2047-09-16'] = {
    'date': '2047-09-16',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2047-09-23'] = {
    'date': '2047-09-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2047-10-14'] = {
    'date': '2047-10-14',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2047-11-03'] = {
    'date': '2047-11-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2047-11-04'] = {
    'date': '2047-11-04',
    'week': '月',
    'week_en': 'Monday',
    'name': '文化の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2047-11-23'] = {
    'date': '2047-11-23',
    'week': '土',
    'week_en': 'Saturday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2048-01-01'] = {
    'date': '2048-01-01',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2048-01-13'] = {
    'date': '2048-01-13',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2048-02-11'] = {
    'date': '2048-02-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2048-02-23'] = {
    'date': '2048-02-23',
    'week': '日',
    'week_en': 'Sunday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2048-02-24'] = {
    'date': '2048-02-24',
    'week': '月',
    'week_en': 'Monday',
    'name': '天皇誕生日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2048-03-20'] = {
    'date': '2048-03-20',
    'week': '金',
    'week_en': 'Friday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2048-04-29'] = {
    'date': '2048-04-29',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2048-05-03'] = {
    'date': '2048-05-03',
    'week': '日',
    'week_en': 'Sunday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2048-05-04'] = {
    'date': '2048-05-04',
    'week': '月',
    'week_en': 'Monday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2048-05-05'] = {
    'date': '2048-05-05',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2048-05-06'] = {
    'date': '2048-05-06',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2048-07-20'] = {
    'date': '2048-07-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2048-08-11'] = {
    'date': '2048-08-11',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2048-09-21'] = {
    'date': '2048-09-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2048-09-22'] = {
    'date': '2048-09-22',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2048-10-12'] = {
    'date': '2048-10-12',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2048-11-03'] = {
    'date': '2048-11-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2048-11-23'] = {
    'date': '2048-11-23',
    'week': '月',
    'week_en': 'Monday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2049-01-01'] = {
    'date': '2049-01-01',
    'week': '金',
    'week_en': 'Friday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2049-01-11'] = {
    'date': '2049-01-11',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2049-02-11'] = {
    'date': '2049-02-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2049-02-23'] = {
    'date': '2049-02-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2049-03-20'] = {
    'date': '2049-03-20',
    'week': '土',
    'week_en': 'Saturday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2049-04-29'] = {
    'date': '2049-04-29',
    'week': '木',
    'week_en': 'Thursday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2049-05-03'] = {
    'date': '2049-05-03',
    'week': '月',
    'week_en': 'Monday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2049-05-04'] = {
    'date': '2049-05-04',
    'week': '火',
    'week_en': 'Tuesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2049-05-05'] = {
    'date': '2049-05-05',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2049-07-19'] = {
    'date': '2049-07-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2049-08-11'] = {
    'date': '2049-08-11',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2049-09-20'] = {
    'date': '2049-09-20',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2049-09-21'] = {
    'date': '2049-09-21',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '休日',
    'name_en': "Citizen's Holiday"
  };
  holidays['2049-09-22'] = {
    'date': '2049-09-22',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2049-10-11'] = {
    'date': '2049-10-11',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2049-11-03'] = {
    'date': '2049-11-03',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2049-11-23'] = {
    'date': '2049-11-23',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  holidays['2050-01-01'] = {
    'date': '2050-01-01',
    'week': '土',
    'week_en': 'Saturday',
    'name': '元日',
    'name_en': "New Year's Day"
  };
  holidays['2050-01-10'] = {
    'date': '2050-01-10',
    'week': '月',
    'week_en': 'Monday',
    'name': '成人の日',
    'name_en': "Coming of Age Day"
  };
  holidays['2050-02-11'] = {
    'date': '2050-02-11',
    'week': '金',
    'week_en': 'Friday',
    'name': '建国記念の日',
    'name_en': "National Foundation Day"
  };
  holidays['2050-02-23'] = {
    'date': '2050-02-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '天皇誕生日',
    'name_en': "Emperor's Birthday"
  };
  holidays['2050-03-20'] = {
    'date': '2050-03-20',
    'week': '日',
    'week_en': 'Sunday',
    'name': '春分の日',
    'name_en': "Vernal Equinox Day"
  };
  holidays['2050-03-21'] = {
    'date': '2050-03-21',
    'week': '月',
    'week_en': 'Monday',
    'name': '春分の日 振替休日',
    'name_en': "Holiday in lieu"
  };
  holidays['2050-04-29'] = {
    'date': '2050-04-29',
    'week': '金',
    'week_en': 'Friday',
    'name': '昭和の日',
    'name_en': "Showa Day"
  };
  holidays['2050-05-03'] = {
    'date': '2050-05-03',
    'week': '火',
    'week_en': 'Tuesday',
    'name': '憲法記念日',
    'name_en': "Constitution Memorial Day"
  };
  holidays['2050-05-04'] = {
    'date': '2050-05-04',
    'week': '水',
    'week_en': 'Wednesday',
    'name': 'みどりの日',
    'name_en': "Greenery Day"
  };
  holidays['2050-05-05'] = {
    'date': '2050-05-05',
    'week': '木',
    'week_en': 'Thursday',
    'name': 'こどもの日',
    'name_en': "Children's Day"
  };
  holidays['2050-07-18'] = {
    'date': '2050-07-18',
    'week': '月',
    'week_en': 'Monday',
    'name': '海の日',
    'name_en': "Marine Day"
  };
  holidays['2050-08-11'] = {
    'date': '2050-08-11',
    'week': '木',
    'week_en': 'Thursday',
    'name': '山の日',
    'name_en': "Mountain Day"
  };
  holidays['2050-09-19'] = {
    'date': '2050-09-19',
    'week': '月',
    'week_en': 'Monday',
    'name': '敬老の日',
    'name_en': "Respect for the Aged Day"
  };
  holidays['2050-09-23'] = {
    'date': '2050-09-23',
    'week': '金',
    'week_en': 'Friday',
    'name': '秋分の日',
    'name_en': "Autumnal Equinox Day"
  };
  holidays['2050-10-10'] = {
    'date': '2050-10-10',
    'week': '月',
    'week_en': 'Monday',
    'name': 'スポーツの日',
    'name_en': "Health and Sports Day"
  };
  holidays['2050-11-03'] = {
    'date': '2050-11-03',
    'week': '木',
    'week_en': 'Thursday',
    'name': '文化の日',
    'name_en': "National Culture Day"
  };
  holidays['2050-11-23'] = {
    'date': '2050-11-23',
    'week': '水',
    'week_en': 'Wednesday',
    'name': '勤労感謝の日',
    'name_en': "Labor Thanksgiving Day"
  };
  var holidays_1 = holidays;

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
  }

  var package_info = getCjsExportFromNamespace(_package$1);

  function format(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + (date.getDate())).slice(-2);
    return (year + '-' + month + '-' + day);
  }

  var holiday_jp = {
    VERSION: package_info.version,
    between: function(start, last) {
      var selected = [];
      var d;
      start = new Date(format(start));
      last = new Date(format(last));
      Object.keys(holidays_1).forEach(function (date) {
        d = new Date(holidays_1[date]['date']);
        if (start <= d && d <= last) {
          holidays_1[date]['date'] = d;
          selected.push(holidays_1[date]);
        }
      });
      return selected;
    },

    isHoliday: function(date) {
      if (date instanceof Date) {
        date = format(date);
      }
      if (holidays_1[date]) {
        return true;
      }
      return false;
    }
  };

  var holiday_jp_1 = holiday_jp;

  /**
   * 旧暦の、年 月 日 閏月 の順で返す
   */
  Date.prototype.getQreki = function () {
    function func(p0, p1, hosei, min) {
      var q0 = 365.2 / 360;
      return function (tm) {
        var t1 = tm | 0;
        var t2 = tm - t1 - hosei;
        var d1 = 0,
            d2 = 1,
            d3,
            t;
        var lsun = p0 * (sun((t2 + .5) / 36525 + (t1 - 2451545) / 36525) / p0 | 0);

        while (Math.abs(d1 + d2) > min) {
          d3 = sun((t2 + .5) / 36525 + (t1 - 2451545) / 36525) - lsun;
          d3 += d3 > 180 ? -360 : d3 < -180 ? 360 : 0;
          t = d3 * q0;
          t1 -= d1 = t | 0;
          t2 -= d2 = t / p1 - d1;
          t2 < 0 && (t2 += 1, t1 -= 1);
        }

        return [t1 + t2 + hosei, lsun];
      };
    }

    var hosei = 9 / 24;
    var min = 1 / 86400;
    var deg = Math.PI / 180;
    var chuki = func(30, 1, hosei, min);
    var nibun = func(90, 360, hosei, min);

    var julius = function () {
      var q0 = 29.530589 / 360;
      return function (tm) {
        var t1 = tm | 0,
            t2 = tm - t1 - hosei;
        var cnt = 1,
            d1 = 0,
            d2 = 1,
            d3,
            t,
            lsun,
            lmoon;

        while (Math.abs(d1 + d2) > min) {
          t = (t2 + .5) / 36525 + (t1 - 2451545) / 36525;
          d3 = (lmoon = moon(t)) - (lsun = sun(t));
          t = (d3 < 0 ? 360 : 0) + d3 % 360;
          if (cnt == 1 && d3 < 0) d3 = t;else if (lsun >= 0 && lsun <= 20 && lmoon >= 300) d3 = 360 - t;else if (Math.abs(d3) > 40) d3 = t;
          t = d3 * q0;
          t1 -= d1 = t | 0;
          t2 -= d2 = t - d1;
          t2 < 0 && (t2 += 1, t1 -= 1);

          if (Math.abs(d1 + d2) > min) {
            if (cnt == 15) t1 = tm - 26 | (t2 = 0);else if (cnt > 30) return tm + hosei;
          }

          cnt++;
        }

        return t2 + t1 + hosei;
      };
    }();

    var ymd_jd = function () {
      return function (y, m, d) {
        m < 3 && (y -= 1, m += 12);
        return (365.25 * y | 0) + (y / 400 | 0) - (y / 100 | 0) + (30.59 * (m - 2) | 0) + 1721088 + d;
      };
    }();

    var jd_ymd = function () {
      return function (jd) {
        var x0,
            x1,
            x2,
            x3,
            x4,
            x5,
            x6,
            y,
            m,
            d;
        x0 = jd + 68570 | 0;
        x1 = x0 / 36524.25 | 0;
        x2 = x0 - 36524.25 * x1 + .75 | 0;
        x3 = (x2 + 1) / 365.2425 | 0;
        x4 = x2 - (365.25 * x3 | 0) + 31;
        x5 = (x4 | 0) / 30.59 | 0;
        x6 = (x5 | 0) / 11 | 0;
        y = 100 * (x1 - 49) + x3 + x6;
        m = x5 - 12 * x6 + 2;
        d = x4 - 30.59 * x5 | 0;
        m == 2 && d > 28 && (d = y % (y % 100 > 0 ? 4 : 400) ? 28 : 29);
        return [y, m, d];
      };
    }();

    var sun = function (pr0, pr1, pr2) {
      return function (t) {
        for (var i = 0, th = 0, b; i < 15; i++) {
          th += (b = Math.cos((pr0[i] * t + pr1[i]) * deg)) * pr2[i];
        }

        return (b = (pr0[i] * t + pr1[i] + th + b * pr2[i] * t) % 360) < 0 ? 360 + b : b;
      };
    }([31557, 29930, 2281, 155, 33718, 9038, 3035, 65929, 22519, 45038, 445267, 19, 32964, 71998.1, 35999.05, 36000.7695], [161, 48, 221, 118, 316, 64, 110, 45, 352, 254, 208, 159, 158, 265.1, 267.52, 280.4659], [.0004, .0004, .0005, .0005, .0006, .0007, .0007, .0007, .0013, .0015, .0018, .0018, .002, .02, 1.9147, -0.0048]);

    var moon = function (pr0, pr1, pr2) {
      return function (t) {
        for (var i = 0, th = 0, b; i < 61; i++) {
          th += Math.cos((pr0[i] * t + pr1[i]) * deg) * pr2[i];
        }

        return (b = (pr0[i] * t + pr1[i] + th) % 360) < 0 ? 360 + b : b;
      };
    }([2322131, 4067, 549197, 1808933, 349472, 381404, 958465, 12006, 39871, 509131, 1745069, 1908795, 2258267, 111869, 27864, 485333, 405201, 790672, 1403732, 858602, 1920802, 1267871, 1856938, 401329, 341337, 71998, 990397, 818536, 922466, 99863, 1379739, 918399, 1934, 541062, 1781068, 133, 1844932, 1331734, 481266, 31932, 926533, 449334, 826671, 1431597, 1303870, 489205, 1443603, 75870, 513197.9, 445267.1, 441199.8, 854535.2, 1367733.1, 377336.3, 63863.5, 966404, 35999.05, 954397.74, 890534.22, 413335.35, 477198.868, 481267.8809], [191, 70, 220, 58, 337, 354, 340, 187, 223, 242, 24, 90, 156, 38, 127, 186, 50, 114, 98, 129, 186, 249, 152, 274, 16, 85, 357, 151, 163, 122, 17, 182, 145, 259, 21, 29, 56, 283, 205, 107, 323, 188, 111, 315, 246, 142, 52, 41, 222.5, 27.9, 47.4, 148.2, 280.7, 13.2, 124.2, 276.5, 87.53, 179.93, 145.7, 10.74, 44.963, 218.3162], [.0003, .0003, .0003, .0003, .0003, .0003, .0003, .0004, .0004, 0.0005, 0.0005, 0.0005, 0.0006, 0.0006, .0007, .0007, .0007, .0007, .0008, .0009, .0011, .0012, .0016, .0018, .0021, .0021, .0021, .0022, .0023, .0024, .0026, .0027, .0028, .0037, .0038, .004, .004, .004, .005, .0052, .0068, .0079, .0085, .01, .0107, .011, .0125, .0154, .0304, .0347, .0409, .0458, .0533, .0571, .0588, .1144, .1851, .2136, .6583, 1.274, 6.2888]);

    return function () {
      var tm0 = ymd_jd(this.getFullYear(), this.getMonth() + 1, this.getDate());
      var chu = [nibun(tm0)],
          saku = [],
          m = [];
      var state = 0,
          it = tm0 | 0,
          j = 0,
          tmp,
          tmp1,
          i,
          lap,
          a;

      for (i = 1; i < 4; i++) {
        chu[i] = chuki(chu[i - 1][0] + 32);
      }

      saku[0] = julius(chu[0][0]);

      for (i = 1; i < 5; i++) {
        tmp = saku[i - 1];
        saku[i] = julius(tmp + 30);
        if (Math.abs((tmp | 0) - (saku[i] | 0)) <= 26) saku[i] = julius(tmp + 35);
      }

      if ((saku[1] | 0) <= (chu[0][0] | 0)) {
        saku[0] = saku[1];
        saku[1] = saku[2];
        saku[2] = saku[3];
        saku[3] = saku[4];
        saku[4] = julius(saku[3] + 35);
      } else if ((saku[0] | 0) > (chu[0][0] | 0)) {
        saku[4] = saku[3];
        saku[3] = saku[2];
        saku[2] = saku[1];
        saku[1] = saku[0];
        saku[0] = julius(saku[0] - 27);
      }

      lap = saku[4] <= chu[3][0] ? 1 : 0;
      m[0] = [(chu[0][1] / 30 | 0) + 2, 0, saku[0] | 0];

      for (i = 1; i < 5; i++) {
        if (lap == 1 && i != 1) {
          if (chu[j][0] <= saku[j] || chu[j][0] >= saku[i]) {
            m[j] = [m[i - 2][0], 1, saku[j] | 0];
            lap = 0;
          }
        }

        m[i] = [m[j][0] + 1, 0, saku[i] | 0];
        m[i][0] > 12 && (m[i][0] -= 12);
        j = i;
      }

      for (i = 0; i < 5; i++) {
        tmp1 = m[i][2] | 0;

        if (it < tmp1) {
          state = 1;
          break;
        }

        if (it == tmp1) {
          state = 2;
          break;
        }
      }

      2 > state && i--;
      tmp = m[i][0];
      a = jd_ymd(tm0);
      tmp > 9 && tmp > a[1] && a[0]--;
      return [a[0], tmp, it - (m[i][2] | 0) + 1, m[i][1]];
    };
  }();
  /**
   * 六曜を返す
   */


  Date.prototype.getRokuyo = function (rokuyo) {
    return function (sw) {
      var exceptionStartTime = new Date('2025-07-25 00:00:00').getTime();
      var exceptionEndTime = new Date('2025-08-23 00:00:00').getTime();
      var targetTime = this.getTime();

      if (exceptionStartTime <= targetTime && exceptionEndTime > targetTime) {
        var a = this.getQreki(),
            w = (a[1] + a[2] - 1) % 6;
        return sw ? rokuyo[w] : w;
      }

      var a = this.getQreki(),
          w = (a[1] + a[2]) % 6;
      return sw ? rokuyo[w] : w;
    };
  }(['大安', '赤口', '先勝', '友引', '先負', '仏滅']);

  var utils$2 = {
    insertBody: function insertBody(elx) {
      document.body.insertBefore(elx, document.body.firstChild);
    },
    removeBody: function removeBody(element) {
      var bodyx = document.body;

      try {
        if (bodyx.contains(element)) {
          bodyx.removeChild(element);
        }
      } catch (error) {}
    },
    changePosition: function changePosition(elx, content, conditional) {
      var topx = 0;
      var leftx = 0;
      var widthx = 0;
      var scrollTopx = window.pageYOffset || document.documentElement.scrollTop;

      if (elx.getBoundingClientRect().top + 300 >= window.innerHeight) {
        setTimeout(function () {
          if (conditional) {
            topx = elx.getBoundingClientRect().top - content.clientHeight + scrollTopx;
          } else {
            topx = elx.getBoundingClientRect().top - content.clientHeight + elx.clientHeight + scrollTopx;
          }
        }, 1);
      } else {
        topx = conditional ? elx.getBoundingClientRect().top + elx.clientHeight + scrollTopx + 5 : elx.getBoundingClientRect().top + scrollTopx;
      }

      leftx = elx.getBoundingClientRect().left;
      widthx = elx.offsetWidth;
      var cords = {
        left: "".concat(leftx, "px"),
        top: "".concat(topx, "px"),
        width: "".concat(widthx, "px")
      };
      return cords;
    }
  };

  var _color = {
    darken: function darken(color, percent) {
      var f = color.split(","),
          t = percent < 0 ? 0 : 255,
          p = percent < 0 ? percent * -1 : percent,
          R = parseInt(f[0].slice(4)),
          G = parseInt(f[1]),
          B = parseInt(f[2]);
      return "rgb(" + (Math.round((t - R) * p) + R) + "," + (Math.round((t - G) * p) + G) + "," + (Math.round((t - B) * p) + B) + ")";
    },
    getColor: function getColor(colorx) {
      var alphax = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var defaultx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      // change color hex to RGB
      if (/^[#]/.test(colorx)) {
        var c = this.hexToRgb(colorx);

        if (alphax == 1) {
          colorx = "rgb(".concat(c.r, ",").concat(c.g, ",").concat(c.b, ")");
        } else {
          colorx = "rgba(".concat(c.r, ",").concat(c.g, ",").concat(c.b, ",").concat(alphax, ")");
        }
      } else if (/^rgba/.test(colorx)) {
        if (colorx.search(/.([0-9]\))$/) == -1 && !defaultx) {
          colorx = colorx.replace(/.?([0-9]\))$/, "".concat(alphax, ")"));
        }
      } else if (/^(rgb)/.test(colorx)) {
        // change rgb and rgba
        if (alphax != 1) {
          colorx = colorx.replace(/^(rgb)/, "rgba");
          colorx = colorx.replace(/\)$/, ",".concat(alphax, ")"));
        }
      }

      return colorx;
    },
    isColor: function isColor(colorx) {
      var vscolors = ['primary', 'secondary', 'success', 'danger', 'warning', 'dark', 'light'];
      return vscolors.includes(colorx);
    },
    RandomColor: function RandomColor() {
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

      return "rgb(".concat(getRandomInt(0, 255), ",").concat(getRandomInt(0, 255), ",").concat(getRandomInt(0, 255), ")");
    },
    rColor: function rColor(colorx) {
      var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (/^[#]/.test(colorx)) {
        var c = this.hexToRgb(colorx);
        colorx = "rgba(".concat(c.r, ",").concat(c.g, ",").concat(c.b, ",").concat(opacity, ")");
      } else if (/^[rgb]/.test(colorx)) {
        var colorSplit = colorx.split(')')[0];

        if (!/^[rgba]/.test(colorx)) {
          colorSplit.replace('rgb', 'rgba');
          colorSplit += ",".concat(opacity, ")");
        } else {
          // colorSplit.replace('rgb','rgba')
          colorSplit += ")";
        }

        colorx = colorSplit;
      }

      var vscolors = ['primary', 'success', 'danger', 'warning', 'dark'];

      if (colorx) {
        if (/[#()]/.test(colorx)) {
          return colorx;
        } else {
          if (vscolors.includes(colorx)) {
            return "rgba(var(--".concat(colorx, "),").concat(opacity, ")");
          } else {
            return "rgba(var(--primary),".concat(opacity, ")");
          }
        }
      } else {
        return "rgba(var(--primary),".concat(opacity, ")");
      }
    },
    contrastColor: function contrastColor(elementx) {
      var c = elementx;

      if (/[#]/g.test(elementx)) {
        var rgbx = this.hexToRgb(elementx);
        c = "rgb(".concat(rgbx.r, ",").concat(rgbx.g, ",").concat(rgbx.b, ")");
      }

      var rgb = c.replace(/^(rgb|rgba)\(/, '').replace(/\)$/, '').replace(/\s/g, '').split(',');
      var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

      if (yiq >= 128) {
        return true;
      } else {
        return false;
      }
    },
    setCssVariable: function setCssVariable(propertyName, value) {
      if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty(propertyName, value);
      }
    },
    hexToRgb: function hexToRgb(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    getVariable: function getVariable(styles, propertyName) {
      return String(styles.getPropertyValue(propertyName)).trim();
    },
    changeColor: function changeColor(colorInicial) {
      var colores = ['primary', 'success', 'danger', 'warning', 'dark'];
      var colorx;

      if (colores.includes(colorInicial)) {
        var style = getComputedStyle(document.documentElement);
        colorx = this.getVariable(style, '--' + colorInicial);
      } else {
        if (/[rgb()]/g.test(colorInicial)) {
          colorx = colorInicial.replace(/[rgb()]/g, '');
        } else if (/[#]/g.test(colorInicial)) {
          var rgbx = this.hexToRgb(colorInicial);
          colorx = "".concat(rgbx.r, ",").concat(rgbx.g, ",").concat(rgbx.b);
        } else {
          colorx = '--' + colorInicial;
        }
      }

      return colorx; // this.setCssVariable('--'+clave,colorx)
    }
  };

  //
  var script$1 = {
    name: 'vx-tooltip',
    props: {
      title: {
        "default": null,
        type: [String, Number]
      },
      text: {
        "default": null,
        type: [String, Number]
      },
      color: {
        "default": null,
        type: String
      },
      position: {
        "default": 'top',
        type: String
      },
      delay: {
        "default": '0s',
        type: [Number, String]
      }
    },
    data: function data() {
      return {
        cords: {},
        active: false,
        widthx: 'auto',
        positionx: null,
        noneAfter: false
      };
    },
    computed: {
      style: function style() {
        return {
          left: this.cords.left,
          top: this.cords.top,
          transitionDelay: this.active ? this.delay : '0s',
          background: _color.getColor(this.color, 1),
          width: this.widthx
        };
      }
    },
    methods: {
      mouseenterx: function mouseenterx() {
        var _this = this;

        this.active = true;
        this.$nextTick(function () {
          if (_this.$refs.vstooltip) {
            utils$2.insertBody(_this.$refs.vstooltip);

            if (_this.$refs.convstooltip) {
              _this.changePosition(_this.$refs.convstooltip, _this.$refs.vstooltip);
            }
          }
        });
      },
      mouseleavex: function mouseleavex() {
        this.active = false;
      },
      changePosition: function changePosition(elxEvent, tooltip) {
        this.noneAfter = false;
        this.positionx = null;
        var elx = elxEvent.closest('.con-vs-tooltip');
        var scrollTopx = window.pageYOffset || document.documentElement.scrollTop;
        var topx = elx.getBoundingClientRect().top + scrollTopx - tooltip.clientHeight - 4;
        var leftx = elx.getBoundingClientRect().left - tooltip.clientWidth / 2 + elx.clientWidth / 2;
        var widthx = elx.clientWidth;

        if (this.position == 'bottom') {
          topx = elx.getBoundingClientRect().top + scrollTopx + elx.clientHeight + 4;
        } else if (this.position == 'left') {
          leftx = elx.getBoundingClientRect().left - tooltip.clientWidth - 4;
          topx = elx.getBoundingClientRect().top + scrollTopx + elx.clientHeight / 2 - tooltip.clientHeight / 2;

          if (Math.sign(leftx) == -1) {
            leftx = elx.getBoundingClientRect().left;
            topx = elx.getBoundingClientRect().top + scrollTopx + elx.clientHeight + 4;
            this.positionx = 'bottom';
            this.noneAfter = true;
          }
        } else if (this.position == 'right') {
          leftx = elx.getBoundingClientRect().left + elx.clientWidth + 4;
          topx = elx.getBoundingClientRect().top + scrollTopx + elx.clientHeight / 2 - tooltip.clientHeight / 2;

          if (window.innerWidth - (leftx + tooltip.clientWidth) <= 20) {
            leftx = elx.getBoundingClientRect().left - tooltip.clientWidth / 2 - 10;
            topx = elx.getBoundingClientRect().top + scrollTopx + elx.clientHeight + 4;
            this.positionx = 'bottom';
            this.noneAfter = true;
          }
        }

        this.cords = {
          left: "".concat(leftx, "px"),
          top: "".concat(topx, "px"),
          width: "".concat(widthx, "px")
        };
      },
      destroy: function destroy() {
        var _this2 = this;

        this.active = false;
        this.$nextTick(function () {
          if (_this2.active && _this2.$refs.vstooltip) {
            utils$2.removeBody(_this2.$refs.vstooltip);
          }
        });
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.active = false;

      if (this.$refs.vstooltip) {
        utils$2.removeBody(this.$refs.vstooltip);
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        ref: "convstooltip",
        staticClass: "con-vs-tooltip",
        on: {
          mouseleave: _vm.mouseleavex,
          mouseenter: _vm.mouseenterx,
          mouseup: _vm.destroy
        }
      },
      [
        _c("transition", { attrs: { name: "tooltip-fade" } }, [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.active,
                  expression: "active"
                }
              ],
              ref: "vstooltip",
              staticClass: "vs-tooltip",
              class: [
                "vs-tooltip-" + (_vm.positionx || _vm.position),
                "vs-tooltip-" + _vm.color,
                { "after-none": _vm.noneAfter }
              ],
              style: _vm.style
            },
            [
              _vm.title ? _c("h4", [_vm._v(_vm._s(_vm.title))]) : _vm._e(),
              _vm._v("\n      " + _vm._s(_vm.text) + "\n    ")
            ]
          )
        ]),
        _vm._v(" "),
        _vm._t("default")
      ],
      2
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  var script$2 = {
    components: {
      VxTooltip: __vue_component__$1
    },
    props: {
      showDayView: Boolean,
      selectedDate: Date,
      pageDate: Date,
      pageTimestamp: Number,
      fullMonthName: Boolean,
      allowedToShowView: Function,
      dayCellContent: {
        type: Function,
        "default": function _default(day) {
          return day.date;
        }
      },
      disabledDates: Object,
      holidayDates: Array,
      highlighted: Object,
      calendarClass: [String, Object, Array],
      calendarStyle: Object,
      translation: Object,
      isRtl: Boolean,
      mondayFirst: Boolean,
      useUtc: Boolean
    },
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        utils: constructedDateUtils
      };
    },
    computed: {
      /**
       * Returns an array of day names
       * @return {String[]}
       */
      daysOfWeek: function daysOfWeek() {
        if (this.mondayFirst) {
          var tempDays = this.translation.days.slice();
          tempDays.push(tempDays.shift());
          return tempDays;
        }

        return this.translation.days;
      },

      /**
       * Returns the day number of the week less one for the first of the current month
       * Used to show amount of empty cells before the first in the day calendar layout
       * @return {Number}
       */
      blankDays: function blankDays() {
        var d = this.pageDate;
        var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());

        if (this.mondayFirst) {
          return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6;
        }

        return this.utils.getDay(dObj);
      },

      /**
       * @return {Object[]}
       */
      days: function days() {
        var d = this.pageDate;
        var days = []; // set up a new date object to the beginning of the current 'page'

        var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
        var daysInMonth = this.utils.daysInMonth(this.utils.getFullYear(dObj), this.utils.getMonth(dObj));

        for (var i = 0; i < daysInMonth; i++) {
          days.push({
            date: this.utils.getDate(dObj),
            timestamp: dObj.getTime(),
            isSelected: this.isSelectedDate(dObj),
            isDisabled: this.isDisabledDate(dObj),
            isHighlighted: this.isHighlightedDate(dObj),
            isHighlightStart: this.isHighlightStart(dObj),
            isHighlightEnd: this.isHighlightEnd(dObj),
            isToday: this.utils.compareDates(dObj, new Date()),
            isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
            isSaturday: this.utils.getDay(dObj) === 6,
            isSunday: this.utils.getDay(dObj) === 0
          });
          this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
        }

        return days;
      },

      /**
       * Gets the name of the month the current page is on
       * @return {String}
       */
      currMonthName: function currMonthName() {
        var monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
        return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName);
      },

      /**
       * Gets the name of the year that current page is on
       * @return {Number}
       */
      currYearName: function currYearName() {
        var yearSuffix = this.translation.yearSuffix;
        return "".concat(this.utils.getFullYear(this.pageDate)).concat(yearSuffix);
      },

      /**
       * Is this translation using year/month/day format?
       * @return {Boolean}
       */
      isYmd: function isYmd() {
        return this.translation.ymd && this.translation.ymd === true;
      },

      /**
       * Is the left hand navigation button disabled?
       * @return {Boolean}
       */
      isLeftNavDisabled: function isLeftNavDisabled() {
        return this.isRtl ? this.isNextMonthDisabled(this.pageTimestamp) : this.isPreviousMonthDisabled(this.pageTimestamp);
      },

      /**
       * Is the right hand navigation button disabled?
       * @return {Boolean}
       */
      isRightNavDisabled: function isRightNavDisabled() {
        return this.isRtl ? this.isPreviousMonthDisabled(this.pageTimestamp) : this.isNextMonthDisabled(this.pageTimestamp);
      }
    },
    methods: {
      selectDate: function selectDate(date) {
        if (date.isDisabled) {
          this.$emit('selectedDisabled', date);
          return false;
        }

        this.$emit('selectDate', date);
      },

      /**
       * @return {Number}
       */
      getPageMonth: function getPageMonth() {
        return this.utils.getMonth(this.pageDate);
      },

      /**
       * Emit an event to show the month picker
       */
      showMonthCalendar: function showMonthCalendar() {
        this.$emit('showMonthCalendar');
      },

      /**
       * Change the page month
       * @param {Number} incrementBy
       */
      changeMonth: function changeMonth(incrementBy) {
        var date = this.pageDate;
        this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy);
        this.$emit('changedMonth', date);
      },

      /**
       * Decrement the page month
       */
      previousMonth: function previousMonth() {
        if (!this.isPreviousMonthDisabled()) {
          this.changeMonth(-1);
        }
      },

      /**
       * Is the previous month disabled?
       * @return {Boolean}
       */
      isPreviousMonthDisabled: function isPreviousMonthDisabled() {
        if (!this.disabledDates || !this.disabledDates.to) {
          return false;
        }

        var d = this.pageDate;
        return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d);
      },

      /**
       * Increment the current page month
       */
      nextMonth: function nextMonth() {
        if (!this.isNextMonthDisabled()) {
          this.changeMonth(+1);
        }
      },

      /**
       * Is the next month disabled?
       * @return {Boolean}
       */
      isNextMonthDisabled: function isNextMonthDisabled() {
        if (!this.disabledDates || !this.disabledDates.from) {
          return false;
        }

        var d = this.pageDate;
        return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d);
      },

      /**
       * Whether a day is selected
       * @param {Date}
       * @return {Boolean}
       */
      isSelectedDate: function isSelectedDate(dObj) {
        return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj);
      },

      /**
       * Whether a day is disabled
       * @param {Date}
       * @return {Boolean}
       */
      isDisabledDate: function isDisabledDate(date) {
        var _this = this;

        var disabledDates = false;

        if (typeof this.disabledDates === 'undefined') {
          return false;
        }

        if (typeof this.disabledDates.dates !== 'undefined') {
          this.disabledDates.dates.forEach(function (d) {
            if (_this.utils.compareDates(date, d)) {
              disabledDates = true;
              return true;
            }
          });
        }

        if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && date < this.disabledDates.to) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && date > this.disabledDates.from) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.ranges !== 'undefined') {
          this.disabledDates.ranges.forEach(function (range) {
            if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
              if (date < range.to && date > range.from) {
                disabledDates = true;
                return true;
              }
            }
          });
        }

        if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
          disabledDates = true;
        }

        if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
          disabledDates = true;
        }

        return disabledDates;
      },

      /**
       * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
       * @param {Date}
       * @return {Boolean}
       */
      isHighlightedDate: function isHighlightedDate(date) {
        var _this2 = this;

        if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
          return false;
        }

        var highlighted = false;

        if (typeof this.highlighted === 'undefined') {
          return false;
        }

        if (typeof this.highlighted.dates !== 'undefined') {
          this.highlighted.dates.forEach(function (d) {
            if (_this2.utils.compareDates(date, d)) {
              highlighted = true;
              return true;
            }
          });
        }

        if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
          highlighted = date >= this.highlighted.from && date <= this.highlighted.to;
        }

        if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1) {
          highlighted = true;
        }

        if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
          highlighted = true;
        }

        if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
          highlighted = true;
        }

        return highlighted;
      },
      satClasses: function satClasses(days, blankDays) {
        return days.length + blankDays > 35 ? 'bg-sat h-74' : 'bg-sat';
      },
      sunClasses: function sunClasses(days, blankDays) {
        return days.length + blankDays > 35 ? 'bg-sun h-74' : 'bg-sun';
      },
      dayClasses: function dayClasses(day, holidayDates) {
        var targetDate = new Date(day.timestamp);
        var isRegularHoliday = holidayDates.some(function (holidayDate) {
          var date = new Date(holidayDate);
          return targetDate.getFullYear() === date.getFullYear() && targetDate.getMonth() === date.getMonth() && targetDate.getDate() === date.getDate();
        });
        return {
          'selected': day.isSelected,
          'disabled': day.isDisabled,
          'highlighted': day.isHighlighted,
          'today': day.isToday,
          'weekend': day.isWeekend,
          'public-holiday': holiday_jp_1.isHoliday(targetDate),
          'regular-holiday': isRegularHoliday,
          'sat': day.isSaturday,
          'sun': day.isSunday,
          'highlight-start': day.isHighlightStart,
          'highlight-end': day.isHighlightEnd
        };
      },
      dayRokuyo: function dayRokuyo(day, holidayDates) {
        var targetDate = new Date(day.timestamp);
        var isRegularHoliday = holidayDates.some(function (holidayDate) {
          var date = new Date(holidayDate);
          return targetDate.getFullYear() === date.getFullYear() && targetDate.getMonth() === date.getMonth() && targetDate.getDate() === date.getDate();
        });
        return isRegularHoliday ? "\u4F11\u696D\u65E5 ".concat(targetDate.getRokuyo(1)) : targetDate.getRokuyo(1);
      },

      /**
       * Whether a day is highlighted and it is the first date
       * in the highlighted range of dates
       * @param {Date}
       * @return {Boolean}
       */
      isHighlightStart: function isHighlightStart(date) {
        return this.isHighlightedDate(date) && this.highlighted.from instanceof Date && this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.from) === this.utils.getDate(date);
      },

      /**
       * Whether a day is highlighted and it is the first date
       * in the highlighted range of dates
       * @param {Date}
       * @return {Boolean}
       */
      isHighlightEnd: function isHighlightEnd(date) {
        return this.isHighlightedDate(date) && this.highlighted.to instanceof Date && this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.to) === this.utils.getDate(date);
      },

      /**
       * Helper
       * @param  {mixed}  prop
       * @return {Boolean}
       */
      isDefined: function isDefined(prop) {
        return typeof prop !== 'undefined' && prop;
      }
    }
  } // eslint-disable-next-line
  ;

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.showDayView,
            expression: "showDayView"
          }
        ],
        class: [_vm.calendarClass, "vdp-datepicker__calendar"],
        style: _vm.calendarStyle,
        on: {
          mousedown: function($event) {
            $event.preventDefault();
          }
        }
      },
      [
        _vm._t("beforeCalendarHeader"),
        _vm._v(" "),
        _c("header", [
          _c(
            "span",
            {
              staticClass: "prev",
              class: { disabled: _vm.isLeftNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.nextMonth() : _vm.previousMonth();
                }
              }
            },
            [_vm._v("<")]
          ),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "day__month_btn",
              class: _vm.allowedToShowView("month") ? "up" : "",
              on: { click: _vm.showMonthCalendar }
            },
            [
              _vm._v(
                _vm._s(_vm.isYmd ? _vm.currYearName : _vm.currMonthName) +
                  " " +
                  _vm._s(_vm.isYmd ? _vm.currMonthName : _vm.currYearName)
              )
            ]
          ),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "next",
              class: { disabled: _vm.isRightNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.previousMonth() : _vm.nextMonth();
                }
              }
            },
            [_vm._v(">")]
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          { class: _vm.isRtl ? "flex-rtl" : "" },
          [
            _c("div", { class: _vm.satClasses(_vm.days, _vm.blankDays) }),
            _vm._v(" "),
            _c("div", { class: _vm.sunClasses(_vm.days, _vm.blankDays) }),
            _vm._v(" "),
            _vm._l(_vm.daysOfWeek, function(d) {
              return _c(
                "span",
                { key: d.timestamp, staticClass: "cell day-header" },
                [_vm._v(_vm._s(d))]
              )
            }),
            _vm._v(" "),
            _vm.blankDays > 0
              ? _vm._l(_vm.blankDays, function(d) {
                  return _c("span", {
                    key: d.timestamp,
                    staticClass: "cell day blank"
                  })
                })
              : _vm._e(),
            _vm._v(" "),
            _vm._l(_vm.days, function(day) {
              return _c(
                "vx-tooltip",
                {
                  key: day.timestamp,
                  staticClass: "cell day",
                  class: _vm.dayClasses(day, _vm.holidayDates),
                  attrs: { text: _vm.dayRokuyo(day, _vm.holidayDates) }
                },
                [
                  _c("span", {
                    domProps: { innerHTML: _vm._s(_vm.dayCellContent(day)) },
                    on: {
                      click: function($event) {
                        return _vm.selectDate(day)
                      }
                    }
                  })
                ]
              )
            })
          ],
          2
        )
      ],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  var script$3 = {
    props: {
      showMonthView: Boolean,
      selectedDate: Date,
      pageDate: Date,
      pageTimestamp: Number,
      disabledDates: Object,
      calendarClass: [String, Object, Array],
      calendarStyle: Object,
      translation: Object,
      isRtl: Boolean,
      allowedToShowView: Function,
      useUtc: Boolean
    },
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        utils: constructedDateUtils
      };
    },
    computed: {
      months: function months() {
        var d = this.pageDate;
        var months = []; // set up a new date object to the beginning of the current 'page'

        var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate())) : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes());

        for (var i = 0; i < 12; i++) {
          months.push({
            month: this.utils.getMonthName(i, this.translation.months),
            timestamp: dObj.getTime(),
            isSelected: this.isSelectedMonth(dObj),
            isDisabled: this.isDisabledMonth(dObj)
          });
          this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1);
        }

        return months;
      },

      /**
       * Get year name on current page.
       * @return {String}
       */
      pageYearName: function pageYearName() {
        var yearSuffix = this.translation.yearSuffix;
        return "".concat(this.utils.getFullYear(this.pageDate)).concat(yearSuffix);
      },

      /**
       * Is the left hand navigation disabled
       * @return {Boolean}
       */
      isLeftNavDisabled: function isLeftNavDisabled() {
        return this.isRtl ? this.isNextYearDisabled(this.pageTimestamp) : this.isPreviousYearDisabled(this.pageTimestamp);
      },

      /**
       * Is the right hand navigation disabled
       * @return {Boolean}
       */
      isRightNavDisabled: function isRightNavDisabled() {
        return this.isRtl ? this.isPreviousYearDisabled(this.pageTimestamp) : this.isNextYearDisabled(this.pageTimestamp);
      }
    },
    methods: {
      /**
       * Emits a selectMonth event
       * @param {Object} month
       */
      selectMonth: function selectMonth(month) {
        if (month.isDisabled) {
          return false;
        }

        this.$emit('selectMonth', month);
      },

      /**
       * Changes the year up or down
       * @param {Number} incrementBy
       */
      changeYear: function changeYear(incrementBy) {
        var date = this.pageDate;
        this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
        this.$emit('changedYear', date);
      },

      /**
       * Decrements the year
       */
      previousYear: function previousYear() {
        if (!this.isPreviousYearDisabled()) {
          this.changeYear(-1);
        }
      },

      /**
       * Checks if the previous year is disabled or not
       * @return {Boolean}
       */
      isPreviousYearDisabled: function isPreviousYearDisabled() {
        if (!this.disabledDates || !this.disabledDates.to) {
          return false;
        }

        return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate);
      },

      /**
       * Increments the year
       */
      nextYear: function nextYear() {
        if (!this.isNextYearDisabled()) {
          this.changeYear(1);
        }
      },

      /**
       * Checks if the next year is disabled or not
       * @return {Boolean}
       */
      isNextYearDisabled: function isNextYearDisabled() {
        if (!this.disabledDates || !this.disabledDates.from) {
          return false;
        }

        return this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(this.pageDate);
      },

      /**
       * Emits an event that shows the year calendar
       */
      showYearCalendar: function showYearCalendar() {
        this.$emit('showYearCalendar');
      },

      /**
       * Whether the selected date is in this month
       * @param {Date}
       * @return {Boolean}
       */
      isSelectedMonth: function isSelectedMonth(date) {
        return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date) && this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date);
      },

      /**
       * Whether a month is disabled
       * @param {Date}
       * @return {Boolean}
       */
      isDisabledMonth: function isDisabledMonth(date) {
        var disabledDates = false;

        if (typeof this.disabledDates === 'undefined') {
          return false;
        }

        if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
          if (this.utils.getMonth(date) < this.utils.getMonth(this.disabledDates.to) && this.utils.getFullYear(date) <= this.utils.getFullYear(this.disabledDates.to) || this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
            disabledDates = true;
          }
        }

        if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
          if (this.utils.getMonth(date) > this.utils.getMonth(this.disabledDates.from) && this.utils.getFullYear(date) >= this.utils.getFullYear(this.disabledDates.from) || this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
            disabledDates = true;
          }
        }

        if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
          disabledDates = true;
        }

        return disabledDates;
      }
    }
  } // eslint-disable-next-line
  ;

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.showMonthView,
            expression: "showMonthView"
          }
        ],
        class: [_vm.calendarClass, "vdp-datepicker__calendar"],
        style: _vm.calendarStyle,
        on: {
          mousedown: function($event) {
            $event.preventDefault();
          }
        }
      },
      [
        _vm._t("beforeCalendarHeader"),
        _vm._v(" "),
        _c("header", [
          _c(
            "span",
            {
              staticClass: "prev",
              class: { disabled: _vm.isLeftNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.nextYear() : _vm.previousYear();
                }
              }
            },
            [_vm._v("<")]
          ),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "month__year_btn",
              class: _vm.allowedToShowView("year") ? "up" : "",
              on: { click: _vm.showYearCalendar }
            },
            [_vm._v(_vm._s(_vm.pageYearName))]
          ),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "next",
              class: { disabled: _vm.isRightNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.previousYear() : _vm.nextYear();
                }
              }
            },
            [_vm._v(">")]
          )
        ]),
        _vm._v(" "),
        _vm._l(_vm.months, function(month) {
          return _c(
            "span",
            {
              key: month.timestamp,
              staticClass: "cell month",
              class: { selected: month.isSelected, disabled: month.isDisabled },
              on: {
                click: function($event) {
                  $event.stopPropagation();
                  return _vm.selectMonth(month)
                }
              }
            },
            [_vm._v(_vm._s(month.month))]
          )
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  var script$4 = {
    props: {
      showYearView: Boolean,
      selectedDate: Date,
      pageDate: Date,
      pageTimestamp: Number,
      disabledDates: Object,
      highlighted: Object,
      calendarClass: [String, Object, Array],
      calendarStyle: Object,
      translation: Object,
      isRtl: Boolean,
      allowedToShowView: Function,
      useUtc: Boolean
    },
    computed: {
      years: function years() {
        var d = this.pageDate;
        var years = []; // set up a new date object to the beginning of the current 'page'7

        var dObj = this.useUtc ? new Date(Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate())) : new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());

        for (var i = 0; i < 10; i++) {
          years.push({
            year: this.utils.getFullYear(dObj),
            timestamp: dObj.getTime(),
            isSelected: this.isSelectedYear(dObj),
            isDisabled: this.isDisabledYear(dObj)
          });
          this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1);
        }

        return years;
      },

      /**
       * @return {String}
       */
      getPageDecade: function getPageDecade() {
        var decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10;
        var decadeEnd = decadeStart + 9;
        var yearSuffix = this.translation.yearSuffix;
        return "".concat(decadeStart, " - ").concat(decadeEnd).concat(yearSuffix);
      },

      /**
       * Is the left hand navigation button disabled?
       * @return {Boolean}
       */
      isLeftNavDisabled: function isLeftNavDisabled() {
        return this.isRtl ? this.isNextDecadeDisabled(this.pageTimestamp) : this.isPreviousDecadeDisabled(this.pageTimestamp);
      },

      /**
       * Is the right hand navigation button disabled?
       * @return {Boolean}
       */
      isRightNavDisabled: function isRightNavDisabled() {
        return this.isRtl ? this.isPreviousDecadeDisabled(this.pageTimestamp) : this.isNextDecadeDisabled(this.pageTimestamp);
      }
    },
    data: function data() {
      var constructedDateUtils = makeDateUtils(this.useUtc);
      return {
        utils: constructedDateUtils
      };
    },
    methods: {
      selectYear: function selectYear(year) {
        if (year.isDisabled) {
          return false;
        }

        this.$emit('selectYear', year);
      },
      changeYear: function changeYear(incrementBy) {
        var date = this.pageDate;
        this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
        this.$emit('changedDecade', date);
      },
      previousDecade: function previousDecade() {
        if (this.isPreviousDecadeDisabled()) {
          return false;
        }

        this.changeYear(-10);
      },
      isPreviousDecadeDisabled: function isPreviousDecadeDisabled() {
        if (!this.disabledDates || !this.disabledDates.to) {
          return false;
        }

        var disabledYear = this.utils.getFullYear(this.disabledDates.to);
        var lastYearInPreviousPage = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10 - 1;
        return disabledYear > lastYearInPreviousPage;
      },
      nextDecade: function nextDecade() {
        if (this.isNextDecadeDisabled()) {
          return false;
        }

        this.changeYear(10);
      },
      isNextDecadeDisabled: function isNextDecadeDisabled() {
        if (!this.disabledDates || !this.disabledDates.from) {
          return false;
        }

        var disabledYear = this.utils.getFullYear(this.disabledDates.from);
        var firstYearInNextPage = Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10;
        return disabledYear < firstYearInNextPage;
      },

      /**
       * Whether the selected date is in this year
       * @param {Date}
       * @return {Boolean}
       */
      isSelectedYear: function isSelectedYear(date) {
        return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date);
      },

      /**
       * Whether a year is disabled
       * @param {Date}
       * @return {Boolean}
       */
      isDisabledYear: function isDisabledYear(date) {
        var disabledDates = false;

        if (typeof this.disabledDates === 'undefined' || !this.disabledDates) {
          return false;
        }

        if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
          if (this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
            disabledDates = true;
          }
        }

        if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
          if (this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
            disabledDates = true;
          }
        }

        if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
          disabledDates = true;
        }

        return disabledDates;
      }
    }
  } // eslint-disable-next-line
  ;

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.showYearView,
            expression: "showYearView"
          }
        ],
        class: [_vm.calendarClass, "vdp-datepicker__calendar"],
        style: _vm.calendarStyle,
        on: {
          mousedown: function($event) {
            $event.preventDefault();
          }
        }
      },
      [
        _vm._t("beforeCalendarHeader"),
        _vm._v(" "),
        _c("header", [
          _c(
            "span",
            {
              staticClass: "prev",
              class: { disabled: _vm.isLeftNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.nextDecade() : _vm.previousDecade();
                }
              }
            },
            [_vm._v("<")]
          ),
          _vm._v(" "),
          _c("span", [_vm._v(_vm._s(_vm.getPageDecade))]),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "next",
              class: { disabled: _vm.isRightNavDisabled },
              on: {
                click: function($event) {
                  _vm.isRtl ? _vm.previousDecade() : _vm.nextDecade();
                }
              }
            },
            [_vm._v(">")]
          )
        ]),
        _vm._v(" "),
        _vm._l(_vm.years, function(year) {
          return _c(
            "span",
            {
              key: year.timestamp,
              staticClass: "cell year",
              class: { selected: year.isSelected, disabled: year.isDisabled },
              on: {
                click: function($event) {
                  $event.stopPropagation();
                  return _vm.selectYear(year)
                }
              }
            },
            [_vm._v(_vm._s(year.year))]
          )
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = undefined;
    /* scoped */
    const __vue_scope_id__$4 = undefined;
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      undefined,
      undefined,
      undefined
    );

  //
  var script$5 = {
    components: {
      DateInput: __vue_component__,
      PickerDay: __vue_component__$2,
      PickerMonth: __vue_component__$3,
      PickerYear: __vue_component__$4
    },
    props: {
      value: {
        validator: function validator(val) {
          return utils$1.validateDateInput(val);
        }
      },
      name: String,
      refName: String,
      id: String,
      format: {
        type: [String, Function],
        "default": 'dd MMM yyyy'
      },
      language: {
        type: Object,
        "default": function _default() {
          return language;
        }
      },
      openDate: {
        validator: function validator(val) {
          return utils$1.validateDateInput(val);
        }
      },
      dayCellContent: Function,
      fullMonthName: Boolean,
      disabledDates: Object,
      holidayDates: {
        type: Array,
        "default": function _default() {
          return [];
        }
      },
      highlighted: Object,
      placeholder: String,
      inline: Boolean,
      calendarClass: [String, Object, Array],
      inputClass: [String, Object, Array],
      wrapperClass: [String, Object, Array],
      mondayFirst: Boolean,
      clearButton: Boolean,
      clearButtonIcon: String,
      calendarButton: Boolean,
      calendarButtonIcon: String,
      calendarButtonIconContent: String,
      bootstrapStyling: Boolean,
      initialView: String,
      disabled: Boolean,
      required: Boolean,
      typeable: Boolean,
      useUtc: Boolean,
      minimumView: {
        type: String,
        "default": 'day'
      },
      maximumView: {
        type: String,
        "default": 'year'
      }
    },
    data: function data() {
      var startDate = this.openDate ? new Date(this.openDate) : new Date();
      var constructedDateUtils = makeDateUtils(this.useUtc);
      var pageTimestamp = constructedDateUtils.setDate(startDate, 1);
      return {
        /*
         * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
         * This represents the first day of the current viewing month
         * {Number}
         */
        pageTimestamp: pageTimestamp,

        /*
         * Selected Date
         * {Date}
         */
        selectedDate: null,

        /*
         * Flags to show calendar views
         * {Boolean}
         */
        showDayView: false,
        showMonthView: false,
        showYearView: false,

        /*
         * Positioning
         */
        calendarHeight: 0,
        resetTypedDate: new Date(),
        utils: constructedDateUtils
      };
    },
    watch: {
      value: function value(_value) {
        this.setValue(_value);
      },
      openDate: function openDate() {
        this.setPageDate();
      },
      initialView: function initialView() {
        this.setInitialView();
      }
    },
    computed: {
      computedInitialView: function computedInitialView() {
        if (!this.initialView) {
          return this.minimumView;
        }

        return this.initialView;
      },
      pageDate: function pageDate() {
        return new Date(this.pageTimestamp);
      },
      translation: function translation() {
        return this.language;
      },
      calendarStyle: function calendarStyle() {
        return {
          position: this.isInline ? 'static' : undefined
        };
      },
      isOpen: function isOpen() {
        return this.showDayView || this.showMonthView || this.showYearView;
      },
      isInline: function isInline() {
        return !!this.inline;
      },
      isRtl: function isRtl() {
        return this.translation.rtl === true;
      }
    },
    methods: {
      /**
       * Called in the event that the user navigates to date pages and
       * closes the picker without selecting a date.
       */
      resetDefaultPageDate: function resetDefaultPageDate() {
        if (this.selectedDate === null) {
          this.setPageDate();
          return;
        }

        this.setPageDate(this.selectedDate);
      },

      /**
       * Effectively a toggle to show/hide the calendar
       * @return {mixed}
       */
      showCalendar: function showCalendar() {
        if (this.disabled || this.isInline) {
          return false;
        }

        if (this.isOpen) {
          return this.close(true);
        }

        this.setInitialView();
      },

      /**
       * Sets the initial picker page view: day, month or year
       */
      setInitialView: function setInitialView() {
        var initialView = this.computedInitialView;

        if (!this.allowedToShowView(initialView)) {
          throw new Error("initialView '".concat(this.initialView, "' cannot be rendered based on minimum '").concat(this.minimumView, "' and maximum '").concat(this.maximumView, "'"));
        }

        switch (initialView) {
          case 'year':
            this.showYearCalendar();
            break;

          case 'month':
            this.showMonthCalendar();
            break;

          default:
            this.showDayCalendar();
            break;
        }
      },

      /**
       * Are we allowed to show a specific picker view?
       * @param {String} view
       * @return {Boolean}
       */
      allowedToShowView: function allowedToShowView(view) {
        var views = ['day', 'month', 'year'];
        var minimumViewIndex = views.indexOf(this.minimumView);
        var maximumViewIndex = views.indexOf(this.maximumView);
        var viewIndex = views.indexOf(view);
        return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
      },

      /**
       * Show the day picker
       * @return {Boolean}
       */
      showDayCalendar: function showDayCalendar() {
        if (!this.allowedToShowView('day')) {
          return false;
        }

        this.close();
        this.showDayView = true;
        return true;
      },

      /**
       * Show the month picker
       * @return {Boolean}
       */
      showMonthCalendar: function showMonthCalendar() {
        if (!this.allowedToShowView('month')) {
          return false;
        }

        this.close();
        this.showMonthView = true;
        return true;
      },

      /**
       * Show the year picker
       * @return {Boolean}
       */
      showYearCalendar: function showYearCalendar() {
        if (!this.allowedToShowView('year')) {
          return false;
        }

        this.close();
        this.showYearView = true;
        return true;
      },

      /**
       * Set the selected date
       * @param {Number} timestamp
       */
      setDate: function setDate(timestamp) {
        var date = new Date(timestamp);
        this.selectedDate = date;
        this.setPageDate(date);
        this.$emit('selected', date);
        this.$emit('input', date);
      },

      /**
       * Clear the selected date
       */
      clearDate: function clearDate() {
        this.selectedDate = null;
        this.setPageDate();
        this.$emit('selected', null);
        this.$emit('input', null);
        this.$emit('cleared');
      },

      /**
       * @param {Object} date
       */
      selectDate: function selectDate(date) {
        this.setDate(date.timestamp);

        if (!this.isInline) {
          this.close(true);
        }

        this.resetTypedDate = new Date();
      },

      /**
       * @param {Object} date
       */
      selectDisabledDate: function selectDisabledDate(date) {
        this.$emit('selectedDisabled', date);
      },

      /**
       * @param {Object} month
       */
      selectMonth: function selectMonth(month) {
        var date = new Date(month.timestamp);

        if (this.allowedToShowView('day')) {
          this.setPageDate(date);
          this.$emit('changedMonth', month);
          this.showDayCalendar();
        } else {
          this.selectDate(month);
        }
      },

      /**
       * @param {Object} year
       */
      selectYear: function selectYear(year) {
        var date = new Date(year.timestamp);

        if (this.allowedToShowView('month')) {
          this.setPageDate(date);
          this.$emit('changedYear', year);
          this.showMonthCalendar();
        } else {
          this.selectDate(year);
        }
      },

      /**
       * Set the datepicker value
       * @param {Date|String|Number|null} date
       */
      setValue: function setValue(date) {
        if (typeof date === 'string' || typeof date === 'number') {
          var parsed = new Date(date);
          date = isNaN(parsed.valueOf()) ? null : parsed;
        }

        if (!date) {
          this.setPageDate();
          this.selectedDate = null;
          return;
        }

        this.selectedDate = date;
        this.setPageDate(date);
      },

      /**
       * Sets the date that the calendar should open on
       */
      setPageDate: function setPageDate(date) {
        if (!date) {
          if (this.openDate) {
            date = new Date(this.openDate);
          } else {
            date = new Date();
          }
        }

        this.pageTimestamp = this.utils.setDate(new Date(date), 1);
      },

      /**
       * Handles a month change from the day picker
       */
      handleChangedMonthFromDayPicker: function handleChangedMonthFromDayPicker(date) {
        this.setPageDate(date);
        this.$emit('changedMonth', date);
      },

      /**
       * Set the date from a typedDate event
       */
      setTypedDate: function setTypedDate(date) {
        this.setDate(date.getTime());
      },

      /**
       * Close all calendar layers
       * @param {Boolean} emitEvent - emit close event
       */
      close: function close(emitEvent) {
        this.showDayView = this.showMonthView = this.showYearView = false;

        if (!this.isInline) {
          if (emitEvent) {
            this.$emit('closed');
          }

          document.removeEventListener('click', this.clickOutside, false);
        }
      },

      /**
       * Initiate the component
       */
      init: function init() {
        if (this.value) {
          this.setValue(this.value);
        }

        if (this.isInline) {
          this.setInitialView();
        }
      }
    },
    mounted: function mounted() {
      this.init();
    }
  } // eslint-disable-next-line
  ;

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        staticClass: "vdp-datepicker",
        class: [_vm.wrapperClass, _vm.isRtl ? "rtl" : ""]
      },
      [
        _c(
          "date-input",
          {
            attrs: {
              selectedDate: _vm.selectedDate,
              resetTypedDate: _vm.resetTypedDate,
              format: _vm.format,
              translation: _vm.translation,
              inline: _vm.inline,
              id: _vm.id,
              name: _vm.name,
              refName: _vm.refName,
              openDate: _vm.openDate,
              placeholder: _vm.placeholder,
              inputClass: _vm.inputClass,
              typeable: _vm.typeable,
              clearButton: _vm.clearButton,
              clearButtonIcon: _vm.clearButtonIcon,
              calendarButton: _vm.calendarButton,
              calendarButtonIcon: _vm.calendarButtonIcon,
              calendarButtonIconContent: _vm.calendarButtonIconContent,
              disabled: _vm.disabled,
              required: _vm.required,
              bootstrapStyling: _vm.bootstrapStyling,
              "use-utc": _vm.useUtc
            },
            on: {
              showCalendar: _vm.showCalendar,
              closeCalendar: _vm.close,
              typedDate: _vm.setTypedDate,
              clearDate: _vm.clearDate
            }
          },
          [_vm._t("afterDateInput", null, { slot: "afterDateInput" })],
          2
        ),
        _vm._v(" "),
        _vm.allowedToShowView("day")
          ? _c(
              "picker-day",
              {
                attrs: {
                  pageDate: _vm.pageDate,
                  selectedDate: _vm.selectedDate,
                  showDayView: _vm.showDayView,
                  fullMonthName: _vm.fullMonthName,
                  allowedToShowView: _vm.allowedToShowView,
                  disabledDates: _vm.disabledDates,
                  holidayDates: _vm.holidayDates,
                  highlighted: _vm.highlighted,
                  calendarClass: _vm.calendarClass,
                  calendarStyle: _vm.calendarStyle,
                  translation: _vm.translation,
                  pageTimestamp: _vm.pageTimestamp,
                  isRtl: _vm.isRtl,
                  mondayFirst: _vm.mondayFirst,
                  dayCellContent: _vm.dayCellContent,
                  "use-utc": _vm.useUtc
                },
                on: {
                  changedMonth: _vm.handleChangedMonthFromDayPicker,
                  selectDate: _vm.selectDate,
                  showMonthCalendar: _vm.showMonthCalendar,
                  selectedDisabled: _vm.selectDisabledDate
                }
              },
              [
                _vm._t("beforeCalendarHeader", null, {
                  slot: "beforeCalendarHeader"
                })
              ],
              2
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.allowedToShowView("month")
          ? _c(
              "picker-month",
              {
                attrs: {
                  pageDate: _vm.pageDate,
                  selectedDate: _vm.selectedDate,
                  showMonthView: _vm.showMonthView,
                  allowedToShowView: _vm.allowedToShowView,
                  disabledDates: _vm.disabledDates,
                  calendarClass: _vm.calendarClass,
                  calendarStyle: _vm.calendarStyle,
                  translation: _vm.translation,
                  isRtl: _vm.isRtl,
                  "use-utc": _vm.useUtc
                },
                on: {
                  selectMonth: _vm.selectMonth,
                  showYearCalendar: _vm.showYearCalendar,
                  changedYear: _vm.setPageDate
                }
              },
              [
                _vm._t("beforeCalendarHeader", null, {
                  slot: "beforeCalendarHeader"
                })
              ],
              2
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.allowedToShowView("year")
          ? _c(
              "picker-year",
              {
                attrs: {
                  pageDate: _vm.pageDate,
                  selectedDate: _vm.selectedDate,
                  showYearView: _vm.showYearView,
                  allowedToShowView: _vm.allowedToShowView,
                  disabledDates: _vm.disabledDates,
                  calendarClass: _vm.calendarClass,
                  calendarStyle: _vm.calendarStyle,
                  translation: _vm.translation,
                  isRtl: _vm.isRtl,
                  "use-utc": _vm.useUtc
                },
                on: { selectYear: _vm.selectYear, changedDecade: _vm.setPageDate }
              },
              [
                _vm._t("beforeCalendarHeader", null, {
                  slot: "beforeCalendarHeader"
                })
              ],
              2
            )
          : _vm._e()
      ],
      1
    )
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-154503b0_0", { source: ".rtl {\n  direction: rtl;\n}\n.vdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.vdp-datepicker * {\n  box-sizing: border-box;\n}\n.vdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  width: 300px;\n  border: 1px solid #ccc;\n}\n.vdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n}\n.vdp-datepicker__calendar header span {\n  display: inline-block;\n  text-align: center;\n  width: 71.42857142857143%;\n  float: left;\n}\n.vdp-datepicker__calendar header .prev,\n.vdp-datepicker__calendar header .next {\n  width: 14.285714285714286%;\n  float: left;\n  text-indent: -10000px;\n  position: relative;\n}\n.vdp-datepicker__calendar header .prev:after,\n.vdp-datepicker__calendar header .next:after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  border: 6px solid transparent;\n}\n.vdp-datepicker__calendar header .prev:after {\n  border-right: 10px solid #000;\n  margin-left: -5px;\n}\n.vdp-datepicker__calendar header .prev.disabled:after {\n  border-right: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .next:after {\n  border-left: 10px solid #000;\n  margin-left: 5px;\n}\n.vdp-datepicker__calendar header .next.disabled:after {\n  border-left: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled),\n.vdp-datepicker__calendar header .next:not(.disabled),\n.vdp-datepicker__calendar header .up:not(.disabled) {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled):hover,\n.vdp-datepicker__calendar header .next:not(.disabled):hover,\n.vdp-datepicker__calendar header .up:not(.disabled):hover {\n  background: #eee;\n}\n.vdp-datepicker__calendar .disabled {\n  color: #ddd;\n  cursor: default;\n}\n.vdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.vdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.vdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.vdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.vdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.vdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .month,\n.vdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.vdp-datepicker__calendar .bg-sat {\n  width: 14.285714285714286%;\n  height: 70%;\n  position: absolute;\n  top: 80px;\n  right: 0px;\n  background-color: rgba(0,0,255,0.5);\n  opacity: 50%;\n}\n.vdp-datepicker__calendar .bg-sat.h-74 {\n  height: 74%;\n}\n.vdp-datepicker__calendar .bg-sun {\n  width: 14.285714285714286%;\n  height: 70%;\n  position: absolute;\n  top: 80px;\n  background-color: rgba(255,0,0,0.5);\n  opacity: 50%;\n}\n.vdp-datepicker__calendar .bg-sun.h-74 {\n  height: 74%;\n}\n.vdp-datepicker__clear-button,\n.vdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.vdp-datepicker__clear-button.disabled,\n.vdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n", map: {"version":3,"sources":["Datepicker.vue"],"names":[],"mappings":"AAAA;EACE,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;EAChB,YAAY;EACZ,sBAAsB;AACxB;AACA;EACE,cAAc;EACd,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,yBAAyB;EACzB,WAAW;AACb;AACA;;EAEE,0BAA0B;EAC1B,WAAW;EACX,qBAAqB;EACrB,kBAAkB;AACpB;AACA;;EAEE,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,4CAA4C;EAC5C,6BAA6B;AAC/B;AACA;EACE,6BAA6B;EAC7B,iBAAiB;AACnB;AACA;EACE,6BAA6B;AAC/B;AACA;EACE,4BAA4B;EAC5B,gBAAgB;AAClB;AACA;EACE,4BAA4B;AAC9B;AACA;;;EAGE,eAAe;AACjB;AACA;;;EAGE,gBAAgB;AAClB;AACA;EACE,WAAW;EACX,eAAe;AACjB;AACA;EACE,aAAa;EACb,cAAc;EACd,eAAe;AACjB;AACA;EACE,qBAAqB;EACrB,cAAc;EACd,0BAA0B;EAC1B,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,sBAAsB;EACtB,6BAA6B;AAC/B;AACA;;;EAGE,eAAe;AACjB;AACA;;;EAGE,sBAAsB;AACxB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;AAChB;AACA;EACE,WAAW;AACb;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;EACd,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,mBAAmB;AACrB;AACA;;EAEE,cAAc;AAChB;AACA;EACE,0BAA0B;EAC1B,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,UAAU;EACV,mCAAmC;EACnC,YAAY;AACd;AACA;EACE,WAAW;AACb;AACA;EACE,0BAA0B;EAC1B,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,mCAAmC;EACnC,YAAY;AACd;AACA;EACE,WAAW;AACb;AACA;;EAEE,eAAe;EACf,kBAAkB;AACpB;AACA;;EAEE,WAAW;EACX,eAAe;AACjB","file":"Datepicker.vue","sourcesContent":[".rtl {\n  direction: rtl;\n}\n.vdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.vdp-datepicker * {\n  box-sizing: border-box;\n}\n.vdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  width: 300px;\n  border: 1px solid #ccc;\n}\n.vdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n}\n.vdp-datepicker__calendar header span {\n  display: inline-block;\n  text-align: center;\n  width: 71.42857142857143%;\n  float: left;\n}\n.vdp-datepicker__calendar header .prev,\n.vdp-datepicker__calendar header .next {\n  width: 14.285714285714286%;\n  float: left;\n  text-indent: -10000px;\n  position: relative;\n}\n.vdp-datepicker__calendar header .prev:after,\n.vdp-datepicker__calendar header .next:after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  border: 6px solid transparent;\n}\n.vdp-datepicker__calendar header .prev:after {\n  border-right: 10px solid #000;\n  margin-left: -5px;\n}\n.vdp-datepicker__calendar header .prev.disabled:after {\n  border-right: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .next:after {\n  border-left: 10px solid #000;\n  margin-left: 5px;\n}\n.vdp-datepicker__calendar header .next.disabled:after {\n  border-left: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled),\n.vdp-datepicker__calendar header .next:not(.disabled),\n.vdp-datepicker__calendar header .up:not(.disabled) {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled):hover,\n.vdp-datepicker__calendar header .next:not(.disabled):hover,\n.vdp-datepicker__calendar header .up:not(.disabled):hover {\n  background: #eee;\n}\n.vdp-datepicker__calendar .disabled {\n  color: #ddd;\n  cursor: default;\n}\n.vdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.vdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.vdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.vdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.vdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.vdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .month,\n.vdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.vdp-datepicker__calendar .bg-sat {\n  width: 14.285714285714286%;\n  height: 70%;\n  position: absolute;\n  top: 80px;\n  right: 0px;\n  background-color: rgba(0,0,255,0.5);\n  opacity: 50%;\n}\n.vdp-datepicker__calendar .bg-sat.h-74 {\n  height: 74%;\n}\n.vdp-datepicker__calendar .bg-sun {\n  width: 14.285714285714286%;\n  height: 70%;\n  position: absolute;\n  top: 80px;\n  background-color: rgba(255,0,0,0.5);\n  opacity: 50%;\n}\n.vdp-datepicker__calendar .bg-sun.h-74 {\n  height: 74%;\n}\n.vdp-datepicker__clear-button,\n.vdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.vdp-datepicker__clear-button.disabled,\n.vdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      createInjector,
      undefined,
      undefined
    );

  var af = new Language('Afrikaans', ['Januarie', 'Februarie', 'Maart', 'April', 'Mei', 'Junie', 'Julie', 'Augustus', 'September', 'Oktober', 'November', 'Desember'], ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'], ['So.', 'Ma.', 'Di.', 'Wo.', 'Do.', 'Vr.', 'Sa.']) // eslint-disable-next-line
  ;

  var language$1 = new Language('Arabic', ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوڤمبر', 'ديسمبر'], ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوڤمبر', 'ديسمبر'], ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']);
  language$1.rtl = true;

  var bg = new Language('Bulgarian', ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'], ['Ян', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'], ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']) // eslint-disable-next-line
  ;

  var bs = new Language('Bosnian', ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'], ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'], ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']) // eslint-disable-next-line
  ;

  var ca = new Language('Catalan', ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'], ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'], ['Diu', 'Dil', 'Dmr', 'Dmc', 'Dij', 'Div', 'Dis']) // eslint-disable-next-line
  ;

  var cs = new Language('Czech', ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'], ['led', 'úno', 'bře', 'dub', 'kvě', 'čer', 'čec', 'srp', 'zář', 'říj', 'lis', 'pro'], ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so']) // eslint-disable-next-line
  ;

  var da = new Language('Danish', ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'], ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'], ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø']) // eslint-disable-next-line
  ;

  var de = new Language('German', ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'], ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.']) // eslint-disable-next-line
  ;

  var ee = new Language('Estonian', ['Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni', 'Juuli', 'August', 'September', 'Oktoober', 'November', 'Detsember'], ['Jaan', 'Veebr', 'Märts', 'Apr', 'Mai', 'Juuni', 'Juuli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dets'], ['P', 'E', 'T', 'K', 'N', 'R', 'L']) // eslint-disable-next-line
  ;

  var el = new Language('Greek', ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάϊος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'], ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'], ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ']) // eslint-disable-next-line
  ;

  var en = new Language('English', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) // eslint-disable-next-line
  ;

  var es = new Language('Spanish', ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']) // eslint-disable-next-line
  ;

  var fa = new Language('Persian', ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'], ['فرو', 'ارد', 'خرد', 'تیر', 'مرد', 'شهر', 'مهر', 'آبا', 'آذر', 'دی', 'بهم', 'اسف'], ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']) // eslint-disable-next-line
  ;

  var fi = new Language('Finnish', ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'], ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'], ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']) // eslint-disable-next-line
  ;

  var fo = new Language('Faroese', ['Januar', 'Februar', 'Mars', 'Apríl', 'Mai', 'Juni', 'Juli', 'August', 'Septembur', 'Oktobur', 'Novembur', 'Desembur'], ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'], ['Sun', 'Mán', 'Týs', 'Mik', 'Hós', 'Frí', 'Ley']) // eslint-disable-next-line
  ;

  var fr = new Language('French', ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'], ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']) // eslint-disable-next-line
  ;

  var ge = new Language('Georgia', ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'], ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'], ['კვი', 'ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ']) // eslint-disable-next-line
  ;

  var gl = new Language('Galician', ['Xaneiro', 'Febreiro', 'Marzo', 'Abril', 'Maio', 'Xuño', 'Xullo', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Decembro'], ['Xan', 'Feb', 'Mar', 'Abr', 'Mai', 'Xuñ', 'Xul', 'Ago', 'Set', 'Out', 'Nov', 'Dec'], ['Dom', 'Lun', 'Mar', 'Mér', 'Xov', 'Ven', 'Sáb']) // eslint-disable-next-line
  ;

  var language$2 = new Language('Hebrew', ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'], ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'], ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']);
  language$2.rtl = true;

  var hr = new Language('Croatian', ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'], ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'], ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']) // eslint-disable-next-line
  ;

  var hu = new Language('Hungarian', ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'], ['Jan', 'Febr', 'Márc', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szept', 'Okt', 'Nov', 'Dec'], ['Vas', 'Hét', 'Ke', 'Sze', 'Csü', 'Pén', 'Szo']) // eslint-disable-next-line
  ;

  var id = new Language('Indonesian', ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'], ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'], ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']) // eslint-disable-next-line
  ;

  var is = new Language('Icelandic', ['Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní', 'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember'], ['Jan', 'Feb', 'Mars', 'Apr', 'Maí', 'Jún', 'Júl', 'Ágú', 'Sep', 'Okt', 'Nóv', 'Des'], ['Sun', 'Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau']) // eslint-disable-next-line
  ;

  var it = new Language('Italian', ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'], ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'], ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']) // eslint-disable-next-line
  ;

  var kk = new Language('Kazakh', ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'], ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'], ['Жк', 'Дй', 'Сй', 'Ср', 'Бй', 'Жм', 'Сн']) // eslint-disable-next-line
  ;

  var language$3 = new Language('Korean', ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], ['일', '월', '화', '수', '목', '금', '토']);
  language$3.yearSuffix = '년';
  language$3.ymd = true;

  var lb = new Language('Luxembourgish', ['Januar', 'Februar', 'Mäerz', 'Abrëll', 'Mee', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], ['Jan', 'Feb', 'Mäe', 'Abr', 'Mee', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'], ['So.', 'Mé.', 'Dë.', 'Më.', 'Do.', 'Fr.', 'Sa.']) // eslint-disable-next-line
  ;

  var language$4 = new Language('Lithuanian', ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'], ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rugp', 'Rugs', 'Spa', 'Lap', 'Gru'], ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš']);
  language$4.ymd = true;

  var lv = new Language('Latvian', ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'], ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jūn', 'Jūl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'], ['Sv', 'Pr', 'Ot', 'Tr', 'Ce', 'Pk', 'Se']) // eslint-disable-next-line
  ;

  var mk = new Language('Macedonian', ['Јануари', 'Февруари', 'Март', 'Април', 'Мај', 'Јуни', 'Јули', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'], ['Јан', 'Фев', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'], ['Нед', 'Пон', 'Вто', 'Сре', 'Чет', 'Пет', 'Саб']) // eslint-disable-next-line
  ;

  var language$5 = new Language('Mongolia', ['1 дүгээр сар', '2 дугаар сар', '3 дугаар сар', '4 дүгээр сар', '5 дугаар сар', '6 дугаар сар', '7 дугаар сар', '8 дугаар сар', '9 дүгээр сар', '10 дугаар сар', '11 дүгээр сар', '12 дугаар сар'], ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'], ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя']);
  language$5.ymd = true;

  var nbNO = new Language('Norwegian Bokmål', ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'], ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'], ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø']) // eslint-disable-next-line
  ;

  var nl = new Language('Dutch', ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'], ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'], ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']) // eslint-disable-next-line
  ;

  var pl = new Language('Polish', ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'], ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'], ['Nd', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob']) // eslint-disable-next-line
  ;

  var ptBR = new Language('Brazilian', ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']) // eslint-disable-next-line
  ;

  var ro = new Language('Romanian', ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'], ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'], ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S']) // eslint-disable-next-line
  ;

  var ru = new Language('Russian', ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'], ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'], ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']) // eslint-disable-next-line
  ;

  var sk = new Language('Slovakian', ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'], ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'], ['ne', 'po', 'ut', 'st', 'št', 'pi', 'so']) // eslint-disable-next-line
  ;

  var slSI = new Language('Sloveian', ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'], ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'], ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob']) // eslint-disable-next-line
  ;

  var srCYRL = new Language('Serbian in Cyrillic script', ['Јануар', 'Фебруар', 'Март', 'Април', 'Мај', 'Јун', 'Јул', 'Август', 'Септембар', 'Октобар', 'Новембар', 'Децембар'], ['Јан', 'Феб', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Нов', 'Дец'], ['Нед', 'Пон', 'Уто', 'Сре', 'Чет', 'Пет', 'Суб']) // eslint-disable-next-line
  ;

  var sr = new Language('Serbian', ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'], ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'], ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']) // eslint-disable-next-line
  ;

  var sv = new Language('Swedish', ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'], ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'], ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör']) // eslint-disable-next-line
  ;

  var th = new Language('Thai', ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'], ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'], ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']) // eslint-disable-next-line
  ;

  var tr = new Language('Turkish', ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'], ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'], ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']) // eslint-disable-next-line
  ;

  var uk = new Language('Ukraine', ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'], ['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Чер', 'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'], ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']) // eslint-disable-next-line
  ;

  var language$6 = new Language('Urdu', ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'], ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'], ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ']);
  language$6.rtl = true;

  var vi = new Language('Vietnamese', ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'], ['T 01', 'T 02', 'T 03', 'T 04', 'T 05', 'T 06', 'T 07', 'T 08', 'T 09', 'T 10', 'T 11', 'T 12'], ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']) // eslint-disable-next-line
  ;

  var language$7 = new Language('Chinese', ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], ['日', '一', '二', '三', '四', '五', '六']);
  language$7.yearSuffix = '年';

  var language$8 = new Language('Chinese_HK', ['壹月', '贰月', '叁月', '肆月', '伍月', '陆月', '柒月', '捌月', '玖月', '拾月', '拾壹月', '拾贰月'], ['壹月', '贰月', '叁月', '肆月', '伍月', '陆月', '柒月', '捌月', '玖月', '拾月', '拾壹月', '拾贰月'], ['日', '壹', '贰', '叁', '肆', '伍', '陆']);
  language$8.yearSuffix = '年';



  var lang = /*#__PURE__*/Object.freeze({
    __proto__: null,
    af: af,
    ar: language$1,
    bg: bg,
    bs: bs,
    ca: ca,
    cs: cs,
    da: da,
    de: de,
    ee: ee,
    el: el,
    en: en,
    es: es,
    fa: fa,
    fi: fi,
    fo: fo,
    fr: fr,
    ge: ge,
    gl: gl,
    he: language$2,
    hr: hr,
    hu: hu,
    id: id,
    is: is,
    it: it,
    ja: language,
    kk: kk,
    ko: language$3,
    lb: lb,
    lt: language$4,
    lv: lv,
    mk: mk,
    mn: language$5,
    nbNO: nbNO,
    nl: nl,
    pl: pl,
    ptBR: ptBR,
    ro: ro,
    ru: ru,
    sk: sk,
    slSI: slSI,
    srCYRL: srCYRL,
    sr: sr,
    sv: sv,
    th: th,
    tr: tr,
    uk: uk,
    ur: language$6,
    vi: vi,
    zh: language$7,
    zhHK: language$8
  });

  //
  var state = {
    date1: new Date()
  };
  var script$6 = {
    name: 'demo',
    components: {
      Datepicker: __vue_component__$5
    },
    data: function data() {
      return {
        styleInput: null,
        format: 'd MMMM yyyy',
        disabledDates: {},
        openDate: null,
        disabledFn: {
          customPredictor: function customPredictor(date) {
            if (date.getDate() % 3 === 0) {
              return true;
            }
          }
        },
        highlightedFn: {
          customPredictor: function customPredictor(date) {
            if (date.getDate() % 4 === 0) {
              return true;
            }
          }
        },
        highlighted: {},
        eventMsg: null,
        state: state,
        vModelExample: null,
        languages: lang,
        language: 'en'
      };
    },
    computed: {
      getInputStyle: function getInputStyle() {
        return this.styleInput;
      }
    },
    methods: {
      highlightTo: function highlightTo(val) {
        if (typeof this.highlighted.to === 'undefined') {
          this.highlighted = {
            to: null,
            daysOfMonth: this.highlighted.daysOfMonth,
            from: this.highlighted.from
          };
        }

        this.highlighted.to = val;
      },
      highlightFrom: function highlightFrom(val) {
        if (typeof this.highlighted.from === 'undefined') {
          this.highlighted = {
            to: this.highlighted.to,
            daysOfMonth: this.highlighted.daysOfMonth,
            from: null
          };
        }

        this.highlighted.from = val;
      },
      setHighlightedDays: function setHighlightedDays(elem) {
        if (elem.target.value === 'undefined') {
          return;
        }

        var highlightedDays = elem.target.value.split(',').map(function (day) {
          return parseInt(day);
        });
        this.highlighted = {
          from: this.highlighted.from,
          to: this.highlighted.to,
          daysOfMonth: highlightedDays
        };
      },
      setDisabledDays: function setDisabledDays(elem) {
        if (elem.target.value === 'undefined') {
          return;
        }

        var disabledDays = elem.target.value.split(',').map(function (day) {
          return parseInt(day);
        });
        this.disabledDates = {
          from: this.disabledDates.from,
          to: this.disabledDates.to,
          daysOfMonth: disabledDays
        };
      },
      disableTo: function disableTo(val) {
        if (typeof this.disabledDates.to === 'undefined') {
          this.disabledDates = {
            to: null,
            daysOfMonth: this.disabledDates.daysOfMonth,
            from: this.disabledDates.from
          };
        }

        this.disabledDates.to = val;
      },
      disableFrom: function disableFrom(val) {
        if (typeof this.disabledDates.from === 'undefined') {
          this.disabledDates = {
            to: this.disabledDates.to,
            daysOfMonth: this.disabledDates.daysOfMonth,
            from: null
          };
        }

        this.disabledDates.from = val;
      }
    }
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { attrs: { id: "app" } }, [
      _c("h1", [_vm._v("Datepicker Examples")]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Default datepicker...")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { placeholder: "Select Date" } }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n        <datepicker placeholder="Select Date"></datepicker>\n    '
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Typeable datepicker")]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: { placeholder: "Type or select date", typeable: true }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n        <datepicker placeholder="Type or select date" :typeable="true"></datepicker>\n    '
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Bootstrap styled datepicker")]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: {
              bootstrapStyling: true,
              calendarButton: true,
              clearButton: true
            }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n        <datepicker placeholder="Select Date"></datepicker>\n    '
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("v-model datepicker")]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: { placeholder: "Select Date" },
            model: {
              value: _vm.vModelExample,
              callback: function($$v) {
                _vm.vModelExample = $$v;
              },
              expression: "vModelExample"
            }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n          <datepicker placeholder="Select Date" v-model="vmodelexample"></datepicker>\n      '
            )
          ]),
          _vm._v(" "),
          _c("hr"),
          _vm._v(" "),
          _c("p", [_vm._v(_vm._s(_vm.vModelExample))])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Format datepicker")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { format: _vm.format } }),
          _vm._v(" "),
          _c("code", [
            _vm._v('\n      <datepicker :format="format"></datepicker>\n    ')
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "settings" }, [
            _c("h5", [_vm._v("Settings")]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", [_vm._v("Format")]),
              _vm._v(" "),
              _c(
                "select",
                {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.format,
                      expression: "format"
                    }
                  ],
                  on: {
                    change: function($event) {
                      var $$selectedVal = Array.prototype.filter
                        .call($event.target.options, function(o) {
                          return o.selected
                        })
                        .map(function(o) {
                          var val = "_value" in o ? o._value : o.value;
                          return val
                        });
                      _vm.format = $event.target.multiple
                        ? $$selectedVal
                        : $$selectedVal[0];
                    }
                  }
                },
                [
                  _c("option", { attrs: { value: "d MMM yyyy", selected: "" } }, [
                    _vm._v("d MMM yyyy - e.g 12 Feb 2016")
                  ]),
                  _vm._v(" "),
                  _c("option", { attrs: { value: "d MMMM yyyy" } }, [
                    _vm._v("d MMMM yyyy - e.g 12 February 2016")
                  ]),
                  _vm._v(" "),
                  _c("option", { attrs: { value: "yyyy-MM-dd" } }, [
                    _vm._v("yyyy-MM-dd - e.g 2016-02-12")
                  ]),
                  _vm._v(" "),
                  _c("option", { attrs: { value: "dsu MMM yyyy" } }, [
                    _vm._v("dsu MMM yyyy - e.g 12th Feb 2016")
                  ]),
                  _vm._v(" "),
                  _c("option", { attrs: { value: "D dsu MMM yyyy" } }, [
                    _vm._v("D dsu MMM yyyy - e.g Sat 12th Feb 2016")
                  ])
                ]
              )
            ])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("With minimum and maximum date range")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { disabledDates: _vm.disabledDates } }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n      <datepicker :disabledDates="disabledDates"></datepicker>\n    '
            )
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "settings" },
            [
              _c("h5", [_vm._v("Settings")]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "form-group" },
                [
                  _c("label", [_vm._v("Disabled to:")]),
                  _vm._v(" "),
                  _c("datepicker", { on: { selected: _vm.disableTo } })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "form-group" },
                [
                  _c("label", [_vm._v("Disabled from:")]),
                  _vm._v(" "),
                  _c("datepicker", { on: { selected: _vm.disableFrom } })
                ],
                1
              ),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("label", [_vm._v("Disabled Days of Month:")]),
                _vm._v(" "),
                _c("input", {
                  attrs: { type: "text", value: "", placeholder: "5,6,12,13" },
                  on: { change: _vm.setDisabledDays }
                })
              ]),
              _vm._v(" "),
              _c("pre", [_vm._v("disabled: " + _vm._s(_vm.disabledDates))]),
              _vm._v(" "),
              _c("h5", [_vm._v("Resulting Date picker")]),
              _vm._v(" "),
              _c("datepicker", { attrs: { disabledDates: _vm.disabledDates } })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "example" }, [
        _c(
          "div",
          { staticClass: "settings" },
          [
            _c("h5", [_vm._v("Settings")]),
            _vm._v(" "),
            _vm._m(0),
            _vm._v(" "),
            _c("pre", [
              _vm._v(
                "        disabledDates: {\n          customPredictor: function (date) {\n            // disables every day of a month which is a multiple of 3\n            if (date.getDate() % 3 === 0) {\n              return true\n            }\n          }\n        }\n      "
              )
            ]),
            _vm._v(" "),
            _c("h5", [_vm._v("Resulting Date picker")]),
            _vm._v(" "),
            _c("datepicker", { attrs: { disabledDates: _vm.disabledFn } })
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Highlighting Dates Matching Given Function")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { highlighted: _vm.highlighted } }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n      <datepicker :highlighted="highlighted"></datepicker>\n    '
            )
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "settings" },
            [
              _c("h5", [_vm._v("Settings")]),
              _vm._v(" "),
              _c("pre", [
                _vm._v(
                  "        highlighted: {\n          customPredictor: function (date) {\n            // highlights every day of a month which is a multiple of 4\n            if (date.getDate() % 4 === 0) {\n              return true\n            }\n          }\n        }\n      "
                )
              ]),
              _vm._v(" "),
              _c("h5", [_vm._v("Resulting Date picker")]),
              _vm._v(" "),
              _c("datepicker", { attrs: { highlighted: _vm.highlightedFn } })
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "example" }, [
        _c("h3", [_vm._v("Highlighting Dates")]),
        _vm._v(" "),
        _c("code", [
          _vm._v(
            '\n      <datepicker :highlighted="highlighted"></datepicker>\n    '
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "settings" },
          [
            _c("h5", [_vm._v("Settings")]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "form-group" },
              [
                _c("label", [_vm._v("Highlight from:")]),
                _vm._v(" "),
                _c("datepicker", { on: { selected: _vm.highlightFrom } })
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "form-group" },
              [
                _c("label", [_vm._v("Highlight to:")]),
                _vm._v(" "),
                _c("datepicker", { on: { selected: _vm.highlightTo } })
              ],
              1
            ),
            _vm._v(" "),
            _c("div", { staticClass: "form-group" }, [
              _c("label", [_vm._v("Highlight Days of Month:")]),
              _vm._v(" "),
              _c("input", {
                attrs: { type: "text", value: "" },
                on: { change: _vm.setHighlightedDays }
              })
            ]),
            _vm._v(" "),
            _c("pre", [_vm._v("highlighted: " + _vm._s(_vm.highlighted))]),
            _vm._v(" "),
            _c("h5", [_vm._v("Resulting Date picker")]),
            _vm._v(" "),
            _c("datepicker", { attrs: { highlighted: _vm.highlighted } })
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("With default open date")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { "open-date": _vm.openDate } }),
          _vm._v(" "),
          _c("code", [
            _vm._v('\n      <datepicker :disabled="disabled"></datepicker>\n    ')
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "settings" }, [
            _c("h5", [_vm._v("Settings")]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "form-group" },
              [
                _c("label", [_vm._v("Open date:")]),
                _vm._v(" "),
                _c("datepicker", {
                  model: {
                    value: _vm.openDate,
                    callback: function($$v) {
                      _vm.openDate = $$v;
                    },
                    expression: "openDate"
                  }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c("pre", [_vm._v("openDate: " + _vm._s(_vm.openDate))])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Translations")]),
          _vm._v(" "),
          _c("h5", [
            _vm._v(_vm._s(_vm.languages[_vm.language].language) + " datepicker")
          ]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: {
              language: _vm.languages[_vm.language],
              format: "d MMMM yyyy"
            }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n        <datepicker :language="languages.' +
                _vm._s(_vm.language) +
                '"></datepicker>\n    '
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "settings" }, [
            _c("h5", [_vm._v("Settings")]),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.language,
                    expression: "language"
                  }
                ],
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value;
                        return val
                      });
                    _vm.language = $event.target.multiple
                      ? $$selectedVal
                      : $$selectedVal[0];
                  }
                }
              },
              _vm._l(_vm.languages, function(language, key) {
                return _c("option", { key: key, domProps: { value: key } }, [
                  _vm._v(_vm._s(language.language))
                ])
              }),
              0
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Inline datepicker")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { inline: true } }),
          _vm._v(" "),
          _c("code", [
            _vm._v('\n        <datepicker :inline="true"></datepicker>\n    ')
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("RTL datepicker")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { language: _vm.languages.he } }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n        <datepicker :language="languages.he"></datepicker>\n    '
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Day view only")]),
          _vm._v(" "),
          _c("datepicker", { attrs: { minimumView: "day", maximumView: "day" } }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              "\n      <datepicker :minimumView=\"'day'\" :maximumView=\"'day'\"></datepicker>\n    "
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Day view only RTL")]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: {
              minimumView: "day",
              maximumView: "day",
              language: _vm.languages.he
            }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              '\n      <datepicker :minimumView="\'day\'" :maximumView="\'day\'" language="languages.he"></datepicker>\n    '
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Month view only")]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: { minimumView: "month", maximumView: "month" }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              "\n      <datepicker :minimumView=\"'month'\" :maximumView=\"'month'\"></datepicker>\n    "
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Day and month view only")]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: {
              minimumView: "day",
              maximumView: "month",
              initialView: "month"
            }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              "\n      <datepicker :minimumView=\"'day'\" :maximumView=\"'month'\" :initialView=\"'month'\"></datepicker>\n    "
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "example" },
        [
          _c("h3", [_vm._v("Year and month view only")]),
          _vm._v(" "),
          _c("datepicker", {
            attrs: {
              minimumView: "month",
              maximumView: "year",
              initialView: "year"
            }
          }),
          _vm._v(" "),
          _c("code", [
            _vm._v(
              "\n      <datepicker :minimumView=\"'month'\" :maximumView=\"'year'\" :initialView=\"'year'\"></datepicker>\n    "
            )
          ])
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$6 = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "form-group" }, [
        _c("label", [_vm._v("Disabled Function:")])
      ])
    }
  ];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-05bfb3f4_0", { source: "\n@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');\nbody {\n    font-family: 'Helvetica Neue Light', Helvetica, sans-serif;\n    padding: 1em 2em 2em;\n}\ninput, select {\n    padding: .75em .5em;\n    font-size: 100%;\n    border: 1px solid #ccc;\n    width: 100%\n}\nselect {\n    height: 2.5em;\n}\n.example {\n    background: #f2f2f2;\n    border: 1px solid #ddd;\n    padding: 0em 1em 1em;\n    margin-bottom: 2em;\n}\ncode,\npre {\n    margin: 1em 0;\n    padding: 1em;\n    border: 1px solid #bbb;\n    display: block;\n    background: #ddd;\n    border-radius: 3px;\n}\n.settings {\n    margin: 2em 0;\n    border-top : 1px solid #bbb;\n    background: #eee;\n}\nh5 {\n    font-size:100%;\n    padding: 0;\n}\n.form-group {\n    margin-bottom: 1em;\n}\n.form-group label {\n    font-size: 80%;\n    display: block;\n}\n", map: {"version":3,"sources":["/Users/40021/Source/vuejs-datepicker/example/Demo.vue"],"names":[],"mappings":";AA8WA,oFAAA;AAEA;IACA,0DAAA;IACA,oBAAA;AACA;AACA;IACA,mBAAA;IACA,eAAA;IACA,sBAAA;IACA;AACA;AAEA;IACA,aAAA;AACA;AAEA;IACA,mBAAA;IACA,sBAAA;IACA,oBAAA;IACA,kBAAA;AACA;AAEA;;IAEA,aAAA;IACA,YAAA;IACA,sBAAA;IACA,cAAA;IACA,gBAAA;IACA,kBAAA;AACA;AAEA;IACA,aAAA;IACA,2BAAA;IACA,gBAAA;AACA;AAEA;IACA,cAAA;IACA,UAAA;AACA;AAEA;IACA,kBAAA;AACA;AAEA;IACA,cAAA;IACA,cAAA;AACA","file":"Demo.vue","sourcesContent":["<template>\n  <div id=\"app\">\n    <h1>Datepicker Examples</h1>\n    <div class=\"example\">\n      <h3>Default datepicker...</h3>\n      <datepicker placeholder=\"Select Date\" />\n      <code>\n          &lt;datepicker placeholder=\"Select Date\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n      <h3>Typeable datepicker</h3>\n      <datepicker placeholder=\"Type or select date\" :typeable=\"true\" />\n      <code>\n          &lt;datepicker placeholder=\"Type or select date\" :typeable=\"true\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n      <h3>Bootstrap styled datepicker</h3>\n      <datepicker\n        :bootstrapStyling=\"true\"\n        :calendarButton=\"true\"\n        :clearButton=\"true\"\n      >\n      </datepicker>\n      <code>\n          &lt;datepicker placeholder=\"Select Date\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n        <h3>v-model datepicker</h3>\n        <datepicker placeholder=\"Select Date\" v-model=\"vModelExample\"></datepicker>\n        <code>\n            &lt;datepicker placeholder=\"Select Date\" v-model=\"vmodelexample\"&gt;&lt;/datepicker&gt;\n        </code>\n        <hr/>\n      <p>{{ vModelExample }}</p>\n    </div>\n\n    <div class=\"example\">\n      <h3>Format datepicker</h3>\n      <datepicker :format=\"format\"></datepicker>\n      <code>\n        &lt;datepicker :format=\"format\"&gt;&lt;/datepicker&gt;\n      </code>\n      <div class=\"settings\">\n        <h5>Settings</h5>\n        <div class=\"form-group\">\n          <label>Format</label>\n          <select v-model=\"format\">\n            <option value=\"d MMM yyyy\" selected>d MMM yyyy - e.g 12 Feb 2016</option>\n            <option value=\"d MMMM yyyy\">d MMMM yyyy - e.g 12 February 2016</option>\n            <option value=\"yyyy-MM-dd\">yyyy-MM-dd - e.g 2016-02-12</option>\n            <option value=\"dsu MMM yyyy\">dsu MMM yyyy - e.g 12th Feb 2016</option>\n            <option value=\"D dsu MMM yyyy\">D dsu MMM yyyy - e.g Sat 12th Feb 2016</option>\n          </select>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"example\">\n      <h3>With minimum and maximum date range</h3>\n      <datepicker :disabledDates=\"disabledDates\"></datepicker>\n      <code>\n        &lt;datepicker :disabledDates=\"disabledDates\"&gt;&lt;/datepicker&gt;\n      </code>\n      <div class=\"settings\">\n        <h5>Settings</h5>\n        <div class=\"form-group\">\n          <label>Disabled to:</label>\n          <datepicker v-on:selected=\"disableTo\"></datepicker>\n        </div>\n        <div class=\"form-group\">\n          <label>Disabled from:</label>\n          <datepicker v-on:selected=\"disableFrom\"></datepicker>\n        </div>\n        <div class=\"form-group\">\n          <label>Disabled Days of Month:</label>\n          <input type=\"text\" value=\"\" v-on:change=\"setDisabledDays\" placeholder=\"5,6,12,13\">\n        </div>\n        <pre>disabled: {{ disabledDates }}</pre>\n\n        <h5>Resulting Date picker</h5>\n        <datepicker :disabledDates=\"disabledDates\"></datepicker>\n      </div>\n    </div>\n\n    <div class=\"example\">\n      <div class=\"settings\">\n        <h5>Settings</h5>\n        <div class=\"form-group\">\n          <label>Disabled Function:</label>\n        </div>\n        <pre>\n          disabledDates: {\n            customPredictor: function (date) {\n              // disables every day of a month which is a multiple of 3\n              if (date.getDate() % 3 === 0) {\n                return true\n              }\n            }\n          }\n        </pre>\n        <h5>Resulting Date picker</h5>\n        <datepicker :disabledDates=\"disabledFn\"></datepicker>\n      </div>\n    </div>\n\n    <div class=\"example\">\n      <h3>Highlighting Dates Matching Given Function</h3>\n      <datepicker :highlighted=\"highlighted\"></datepicker>\n      <code>\n        &lt;datepicker :highlighted=\"highlighted\"&gt;&lt;/datepicker&gt;\n      </code>\n      <div class=\"settings\">\n        <h5>Settings</h5>\n        <pre>\n          highlighted: {\n            customPredictor: function (date) {\n              // highlights every day of a month which is a multiple of 4\n              if (date.getDate() % 4 === 0) {\n                return true\n              }\n            }\n          }\n        </pre>\n\n        <h5>Resulting Date picker</h5>\n        <datepicker :highlighted=\"highlightedFn\"></datepicker>\n      </div>\n    </div>\n\n    <div class=\"example\">\n      <h3>Highlighting Dates</h3>\n      <code>\n        &lt;datepicker :highlighted=\"highlighted\"&gt;&lt;/datepicker&gt;\n      </code>\n      <div class=\"settings\">\n        <h5>Settings</h5>\n        <div class=\"form-group\">\n          <label>Highlight from:</label>\n          <datepicker v-on:selected=\"highlightFrom\"></datepicker>\n        </div>\n        <div class=\"form-group\">\n          <label>Highlight to:</label>\n          <datepicker v-on:selected=\"highlightTo\"></datepicker>\n        </div>\n        <div class=\"form-group\">\n          <label>Highlight Days of Month:</label>\n          <input type=\"text\" value=\"\" v-on:change=\"setHighlightedDays\">\n        </div>\n        <pre>highlighted: {{ highlighted }}</pre>\n\n        <h5>Resulting Date picker</h5>\n        <datepicker :highlighted=\"highlighted\"></datepicker>\n      </div>\n    </div>\n\n    <div class=\"example\">\n      <h3>With default open date</h3>\n      <datepicker :open-date=\"openDate\"></datepicker>\n      <code>\n        &lt;datepicker :disabled=\"disabled\"&gt;&lt;/datepicker&gt;\n      </code>\n      <div class=\"settings\">\n        <h5>Settings</h5>\n        <div class=\"form-group\">\n          <label>Open date:</label>\n          <datepicker v-model=\"openDate\"></datepicker>\n        </div>\n        <pre>openDate: {{ openDate }}</pre>\n      </div>\n    </div>\n\n    <div class=\"example\">\n      <h3>Translations</h3>\n      <h5>{{ languages[language].language }} datepicker</h5>\n\n      <datepicker :language=\"languages[language]\" format=\"d MMMM yyyy\"></datepicker>\n      <code>\n          &lt;datepicker :language=\"languages.{{ language }}\"&gt;&lt;/datepicker&gt;\n      </code>\n      <div class=\"settings\">\n        <h5>Settings</h5>\n        <select v-model=\"language\">\n          <option :value=\"key\" v-for=\"(language, key) in languages\" :key=\"key\">{{ language.language }}</option>\n        </select>\n      </div>\n    </div>\n\n    <div class=\"example\">\n      <h3>Inline datepicker</h3>\n      <datepicker :inline=\"true\"></datepicker>\n      <code>\n          &lt;datepicker :inline=\"true\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n    <div class=\"example\">\n      <h3>RTL datepicker</h3>\n      <datepicker :language=\"languages.he\"></datepicker>\n      <code>\n          &lt;datepicker :language=\"languages.he\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n      <h3>Day view only</h3>\n      <datepicker :minimumView=\"'day'\" :maximumView=\"'day'\"></datepicker>\n      <code>\n        &lt;datepicker :minimumView=\"'day'\" :maximumView=\"'day'\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n      <h3>Day view only RTL</h3>\n      <datepicker :minimumView=\"'day'\" :maximumView=\"'day'\" :language=\"languages.he\"></datepicker>\n      <code>\n        &lt;datepicker :minimumView=\"'day'\" :maximumView=\"'day'\" language=\"languages.he\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n      <h3>Month view only</h3>\n      <datepicker :minimumView=\"'month'\" :maximumView=\"'month'\"></datepicker>\n      <code>\n        &lt;datepicker :minimumView=\"'month'\" :maximumView=\"'month'\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n      <h3>Day and month view only</h3>\n      <datepicker :minimumView=\"'day'\" :maximumView=\"'month'\" :initialView=\"'month'\"></datepicker>\n      <code>\n        &lt;datepicker :minimumView=\"'day'\" :maximumView=\"'month'\" :initialView=\"'month'\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n    <div class=\"example\">\n      <h3>Year and month view only</h3>\n      <datepicker :minimumView=\"'month'\" :maximumView=\"'year'\" :initialView=\"'year'\"></datepicker>\n      <code>\n        &lt;datepicker :minimumView=\"'month'\" :maximumView=\"'year'\" :initialView=\"'year'\"&gt;&lt;/datepicker&gt;\n      </code>\n    </div>\n\n  </div>\n</template>\n\n<script>\nimport Datepicker from '../src/components/Datepicker.vue'\nimport * as lang from '../src/locale/index.js'\n\nconst state = {\n  date1: new Date()\n}\n\nexport default {\n  name: 'demo',\n  components: {\n    Datepicker\n  },\n  data () {\n    return {\n      styleInput: null,\n      format: 'd MMMM yyyy',\n      disabledDates: {},\n      openDate: null,\n      disabledFn: {\n        customPredictor (date) {\n          if (date.getDate() % 3 === 0) {\n            return true\n          }\n        }\n      },\n      highlightedFn: {\n        customPredictor (date) {\n          if (date.getDate() % 4 === 0) {\n            return true\n          }\n        }\n      },\n      highlighted: {},\n      eventMsg: null,\n      state: state,\n      vModelExample: null,\n      languages: lang,\n      language: 'en'\n    }\n  },\n  computed: {\n    getInputStyle () {\n      return this.styleInput\n    }\n  },\n  methods: {\n    highlightTo (val) {\n      if (typeof this.highlighted.to === 'undefined') {\n        this.highlighted = {\n          to: null,\n          daysOfMonth: this.highlighted.daysOfMonth,\n          from: this.highlighted.from\n        }\n      }\n      this.highlighted.to = val\n    },\n    highlightFrom (val) {\n      if (typeof this.highlighted.from === 'undefined') {\n        this.highlighted = {\n          to: this.highlighted.to,\n          daysOfMonth: this.highlighted.daysOfMonth,\n          from: null\n        }\n      }\n      this.highlighted.from = val\n    },\n    setHighlightedDays (elem) {\n      if (elem.target.value === 'undefined') {\n        return\n      }\n      let highlightedDays = elem.target.value.split(',').map(day => parseInt(day))\n      this.highlighted = {\n        from: this.highlighted.from,\n        to: this.highlighted.to,\n        daysOfMonth: highlightedDays\n      }\n    },\n    setDisabledDays (elem) {\n      if (elem.target.value === 'undefined') {\n        return\n      }\n      let disabledDays = elem.target.value.split(',').map(day => parseInt(day))\n      this.disabledDates = {\n        from: this.disabledDates.from,\n        to: this.disabledDates.to,\n        daysOfMonth: disabledDays\n      }\n    },\n    disableTo (val) {\n      if (typeof this.disabledDates.to === 'undefined') {\n        this.disabledDates = {\n          to: null,\n          daysOfMonth: this.disabledDates.daysOfMonth,\n          from: this.disabledDates.from\n        }\n      }\n      this.disabledDates.to = val\n    },\n    disableFrom (val) {\n      if (typeof this.disabledDates.from === 'undefined') {\n        this.disabledDates = {\n          to: this.disabledDates.to,\n          daysOfMonth: this.disabledDates.daysOfMonth,\n          from: null\n        }\n      }\n      this.disabledDates.from = val\n    }\n  }\n}\n</script>\n\n<style>\n\n@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');\n\nbody {\n    font-family: 'Helvetica Neue Light', Helvetica, sans-serif;\n    padding: 1em 2em 2em;\n}\ninput, select {\n    padding: .75em .5em;\n    font-size: 100%;\n    border: 1px solid #ccc;\n    width: 100%\n}\n\nselect {\n    height: 2.5em;\n}\n\n.example {\n    background: #f2f2f2;\n    border: 1px solid #ddd;\n    padding: 0em 1em 1em;\n    margin-bottom: 2em;\n}\n\ncode,\npre {\n    margin: 1em 0;\n    padding: 1em;\n    border: 1px solid #bbb;\n    display: block;\n    background: #ddd;\n    border-radius: 3px;\n}\n\n.settings {\n    margin: 2em 0;\n    border-top : 1px solid #bbb;\n    background: #eee;\n}\n\nh5 {\n    font-size:100%;\n    padding: 0;\n}\n\n.form-group {\n    margin-bottom: 1em;\n}\n\n.form-group label {\n    font-size: 80%;\n    display: block;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$6 = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      false,
      createInjector,
      undefined,
      undefined
    );

  Vue.config.productionTip = false;
  /* eslint-disable no-new */

  new Vue({
    el: '#app',
    render: function render(h) {
      return h(__vue_component__$6);
    }
  });

}());
//# sourceMappingURL=demo.js.map
