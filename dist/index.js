"use strict";
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/index.ts
var src_exports = {};
__export(src_exports, {
    Vexor: function() {
        return Vexor;
    }
});
module.exports = __toCommonJS(src_exports);
// src/methods.ts
var _Vexor = /*#__PURE__*/ function() {
    function _Vexor(params) {
        var _this = this;
        _class_call_check(this, _Vexor);
        this.apiUrl = "http://localhost:3000/api";
        // ============================================
        // vexor.pay and vexor.pay.platform     [START]
        // ============================================
        /**
     * Pay method with platform-specific shortcuts.
     * @type {Object}
     * @property {Function} mercadopago - Shortcut for MercadoPago payments.
     * @property {Function} stripe - Shortcut for Stripe payments.
     * @property {Function} paypal - Shortcut for PayPal payments.
     * 
     * @example
     * // Generic usage
     * vexor.pay({ platform: 'mercadopago', items: [...] });
     * 
     * // Platform-specific shortcut
     * vexor.pay.mercadopago({ items: [...] });
     * 
     * @description
     * Facilitates simple checkout scenarios for various payment platforms.
     */ this.pay = Object.assign(// Generic payment method
        function(params) {
            return _this.createCheckout(params.platform, params);
        }, // Platform-specific payment methods
        {
            mercadopago: function(body) {
                return _this.createCheckout("mercadopago", body);
            },
            stripe: function(body) {
                return _this.createCheckout("stripe", body);
            },
            paypal: function(body) {
                return _this.createCheckout("paypal", body);
            }
        });
        // ============================================
        // vexor.pay and vexor.pay.platform       [END]
        // ============================================
        // ============================================
        // vexor.webhook                        [START]
        // ============================================
        /**
       * Webhook method with platform-specific shortcuts.
       * @type {Object}
       * @property {Function} mercadopago - Shortcut for MercadoPago webhooks.
       * @property {Function} stripe - Shortcut for Stripe webhooks.
       * @property {Function} paypal - Shortcut for PayPal webhooks.
       * 
       * @example
       * // Generic usage
       * vexor.webhook(req);
       * 
       * // Platform-specific shortcut
       * vexor.webhook.mercadopago(req);
       * 
       * @description
       * Facilitates webhook handling for various payment platforms.
       */ this.webhook = Object.assign(// Generic webhook method
        function(req) {
            return _this.handleWebhook(req);
        }, // Platform-specific webhook methods
        {
            mercadopago: function(req) {
                return _this.handleWebhook(req);
            },
            stripe: function(req) {
                return _this.handleWebhook(req);
            },
            paypal: function(req) {
                return _this.handleWebhook(req);
            }
        });
        // ============================================
        // vexor.webhook                          [END]
        // ============================================
        // ========================================================
        // vexor.subscribe and vexor.subscribe.platform     [START]
        // ========================================================
        /**
     * Subscription method with platform-specific shortcuts.
     * @type {Object}
     * @property {Function} mercadopago - Shortcut for MercadoPago subscriptions.
     * @property {Function} stripe - Shortcut for Stripe subscriptions.
     * @property {Function} paypal - Shortcut for PayPal subscriptions.
     * 
     * @example
     * // Generic usage
     * vexor.subscribe({ platform: 'mercadopago', body });
     * 
     * // Platform-specific shortcut
     * vexor.subscribe.mercadopago({ body });
     * 
     * @description
     * Facilitates simple subscription scenarios for various payment platforms.
     */ this.subscribe = Object.assign(// Generic subscription method
        function(params) {
            return _this.createSubscription(params.platform, params);
        }, // Platform-specific subscription methods
        {
            mercadopago: function(body) {
                return _this.createSubscription("mercadopago", body);
            },
            stripe: function(body) {
                return _this.createSubscription("stripe", body);
            },
            paypal: function(body) {
                return _this.createSubscription("paypal", body);
            }
        });
        // ========================================================
        // vexor.subscribe and vexor.subscribe.platform       [END]
        // ========================================================
        // ========================================================
        // vexor.portal and vexor.portal.platform     [START]
        // ========================================================
        /**
     * Billing portal method with platform-specific shortcuts.
     * @type {Object}
     * @property {Function} mercadopago - Shortcut for MercadoPago portals.
     * @property {Function} stripe - Shortcut for Stripe portals.
     * @property {Function} paypal - Shortcut for PayPal portals.
     * 
     * @example
     * // Generic usage
     * vexor.subscribe({ platform: 'mercadopago', body });
     * 
     * // Platform-specific shortcut
     * vexor.subscribe.mercadopago({ body });
     * 
     * @description
     * Facilitates simple subscription scenarios for various payment platforms.
     */ this.portal = Object.assign(// Generic portal method
        function(params) {
            return _this.createPortal(params.platform, params);
        }, // Platform-specific portal methods
        {
            mercadopago: function(body) {
                return _this.createPortal("mercadopago", body);
            },
            stripe: function(body) {
                return _this.createPortal("stripe", body);
            },
            paypal: function(body) {
                return _this.createPortal("paypal", body);
            }
        });
        this.publishableKey = params.publishableKey;
        this.secretKey = params.secretKey;
        this.projectId = params.projectId;
    }
    _create_class(_Vexor, [
        {
            key: "createCheckout",
            value: // Private method to create a checkout session
            function createCheckout(platform, body) {
                var _this = this;
                return _async_to_generator(function() {
                    var response, data, errorMessage;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    fetch("".concat(_this.apiUrl, "/payments"), {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "x-vexor-key": _this.publishableKey,
                                            "x-vexor-platform": platform,
                                            "x-vexor-project-id": _this.projectId
                                        },
                                        body: JSON.stringify(body)
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    4,
                                    response.json()
                                ];
                            case 2:
                                data = _state.sent();
                                if (!response.ok) {
                                    errorMessage = data.message || "An unknown error occurred";
                                    throw new Error("Payment request failed: ".concat(errorMessage));
                                }
                                return [
                                    2,
                                    data
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "handleWebhook",
            value: // Private method to handle webhooks
            function handleWebhook(req) {
                var _this = this;
                return _async_to_generator(function() {
                    var _headers_get, headers, body, url, queryParams, platform, forwardRequest, response, data, errorMessage;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                headers = req.headers;
                                return [
                                    4,
                                    req.text()
                                ];
                            case 1:
                                body = _state.sent();
                                url = new URL(req.url);
                                queryParams = new URLSearchParams(url.searchParams);
                                if (headers.get("paypal-transmission-id")) {
                                    platform = "paypal";
                                } else if (headers.get("stripe-signature")) {
                                    platform = "stripe";
                                } else if ((_headers_get = headers.get("referer")) === null || _headers_get === void 0 ? void 0 : _headers_get.includes("mercadopago")) {
                                    platform = "mercadopago";
                                }
                                if (!platform) {
                                    throw new Error("Unsupported payment platform or missing signature header");
                                }
                                if (!_this.secretKey) {
                                    throw new Error("Missing VEXOR_SECRET_KEY environment variable");
                                }
                                forwardRequest = new Request("".concat(_this.apiUrl, "/webhooks/").concat(platform, "?").concat(queryParams.toString()), {
                                    method: req.method,
                                    headers: new Headers(headers),
                                    body: body
                                });
                                forwardRequest.headers.set("x-vexor-key", _this.secretKey);
                                forwardRequest.headers.set("x-vexor-platform", platform);
                                forwardRequest.headers.set("x-vexor-project-id", _this.projectId);
                                return [
                                    4,
                                    fetch(forwardRequest)
                                ];
                            case 2:
                                response = _state.sent();
                                return [
                                    4,
                                    response.json()
                                ];
                            case 3:
                                data = _state.sent();
                                if (!response.ok) {
                                    errorMessage = data.message || "An unknown error occurred";
                                    throw new Error("Webhook request failed: ".concat(errorMessage));
                                }
                                return [
                                    2,
                                    data
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "createSubscription",
            value: // Private method to create a checkout session
            function createSubscription(platform, body) {
                var _this = this;
                return _async_to_generator(function() {
                    var response, data, errorMessage;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    fetch("".concat(_this.apiUrl, "/subscriptions"), {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "x-vexor-key": _this.publishableKey,
                                            "x-vexor-platform": platform,
                                            "x-vexor-project-id": _this.projectId
                                        },
                                        body: JSON.stringify(body)
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    4,
                                    response.json()
                                ];
                            case 2:
                                data = _state.sent();
                                if (!response.ok) {
                                    errorMessage = data.message || "An unknown error occurred";
                                    throw new Error("Payment request failed: ".concat(errorMessage));
                                }
                                return [
                                    2,
                                    data
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "createPortal",
            value: // Private method to create a checkout session
            function createPortal(platform, body) {
                var _this = this;
                return _async_to_generator(function() {
                    var response, data, errorMessage;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    fetch("".concat(_this.apiUrl, "/portals"), {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "x-vexor-key": _this.publishableKey,
                                            "x-vexor-platform": platform,
                                            "x-vexor-project-id": _this.projectId
                                        },
                                        body: JSON.stringify(body)
                                    })
                                ];
                            case 1:
                                response = _state.sent();
                                return [
                                    4,
                                    response.json()
                                ];
                            case 2:
                                data = _state.sent();
                                if (!response.ok) {
                                    errorMessage = data.message || "An unknown error occurred";
                                    throw new Error("Payment request failed: ".concat(errorMessage));
                                }
                                return [
                                    2,
                                    data
                                ];
                        }
                    });
                })();
            }
        }
    ], [
        {
            key: "fromEnv",
            value: // Create a Vexor instance using environment variables
            function fromEnv() {
                if (!_Vexor.instance) {
                    var publishableKey = process.env.NEXT_PUBLIC_VEXOR_KEY;
                    var secretKey = process.env.VEXOR_SECRET_KEY;
                    var projectId = process.env.NEXT_PUBLIC_VEXOR_PROJECT;
                    if (!publishableKey) {
                        throw new Error("Missing NEXT_PUBLIC_VEXOR_KEY environment variable");
                    }
                    if (!projectId) {
                        throw new Error("Missing NEXT_PUBLIC_VEXOR_PROJECT environment variable");
                    }
                    _Vexor.instance = new _Vexor({
                        publishableKey: publishableKey,
                        projectId: projectId,
                        secretKey: secretKey
                    });
                }
                return _Vexor.instance;
            }
        },
        {
            key: "init",
            value: // Create a Vexor instance with provided parameters
            function init(params) {
                return new _Vexor(params);
            }
        }
    ]);
    return _Vexor;
}();
// Singleton instance of Vexor
_Vexor.instance = null;
var Vexor = _Vexor;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    Vexor: Vexor
});
