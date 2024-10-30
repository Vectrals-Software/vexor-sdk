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
// src/methods/pay.ts
var vexorPay = function(vexor) {
    return Object.assign(// Generic payment method
    function(params) {
        return vexor.createCheckout(params.platform, params);
    }, // Platform-specific payment methods
    {
        mercadopago: function(body) {
            return vexor.createCheckout("mercadopago", body);
        },
        stripe: function(body) {
            return vexor.createCheckout("stripe", body);
        },
        paypal: function(body) {
            return vexor.createCheckout("paypal", body);
        }
    });
};
function createCheckout(vexor, platform, body) {
    return _createCheckout.apply(this, arguments);
}
function _createCheckout() {
    _createCheckout = _async_to_generator(function(vexor, platform, body) {
        var response, data, errorMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("".concat(vexor.apiUrl, "/payments"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-vexor-key": vexor.publishableKey,
                                "x-vexor-platform": platform,
                                "x-vexor-project-id": vexor.projectId
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
    });
    return _createCheckout.apply(this, arguments);
}
// src/methods/webhook.ts
var vexorWebhook = function(vexor) {
    return Object.assign(// Generic webhook method
    function(req) {
        return vexor.handleWebhook(req);
    }, // Platform-specific webhook methods
    {
        mercadopago: function(req) {
            return vexor.handleWebhook(req);
        },
        stripe: function(req) {
            return vexor.handleWebhook(req);
        },
        paypal: function(req) {
            return vexor.handleWebhook(req);
        }
    });
};
function handleWebhook(vexor, req) {
    return _handleWebhook.apply(this, arguments);
}
function _handleWebhook() {
    _handleWebhook = _async_to_generator(function(vexor, req) {
        var _headers_get, headers, body, url, queryParams, platform, forwardRequest, response, data;
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
                    if (!vexor.secretKey) {
                        throw new Error("Missing VEXOR_SECRET_KEY environment variable");
                    }
                    forwardRequest = new Request("".concat(vexor.apiUrl, "/webhooks/").concat(platform, "?").concat(queryParams.toString()), {
                        method: req.method,
                        headers: new Headers(headers),
                        body: body
                    });
                    forwardRequest.headers.set("x-vexor-key", vexor.secretKey);
                    forwardRequest.headers.set("x-vexor-platform", platform);
                    forwardRequest.headers.set("x-vexor-project-id", vexor.projectId);
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
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return _handleWebhook.apply(this, arguments);
}
// src/methods/subscribe.ts
var vexorSubscribe = function(vexor) {
    return Object.assign(// Generic subscription method
    function(params) {
        return vexor.createSubscription(params.platform, params);
    }, // Platform-specific subscription methods
    {
        mercadopago: function(body) {
            return vexor.createSubscription("mercadopago", body);
        },
        stripe: function(body) {
            return vexor.createSubscription("stripe", body);
        },
        paypal: function(body) {
            return vexor.createSubscription("paypal", body);
        }
    });
};
function createSubscription(vexor, platform, body) {
    return _createSubscription.apply(this, arguments);
}
function _createSubscription() {
    _createSubscription = _async_to_generator(function(vexor, platform, body) {
        var response, data, errorMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("".concat(vexor.apiUrl, "/subscriptions"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-vexor-key": vexor.publishableKey,
                                "x-vexor-platform": platform,
                                "x-vexor-project-id": vexor.projectId
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
                        throw new Error("Subscription request failed: ".concat(errorMessage));
                    }
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return _createSubscription.apply(this, arguments);
}
// src/methods/portal.ts
var vexorPortal = function(vexor) {
    return Object.assign(// Generic portal method
    function(params) {
        return vexor.createPortal(params.platform, params);
    }, // Platform-specific portal methods
    {
        mercadopago: function(body) {
            return vexor.createPortal("mercadopago", body);
        },
        stripe: function(body) {
            return vexor.createPortal("stripe", body);
        },
        paypal: function(body) {
            return vexor.createPortal("paypal", body);
        }
    });
};
function createPortal(vexor, platform, body) {
    return _createPortal.apply(this, arguments);
}
function _createPortal() {
    _createPortal = _async_to_generator(function(vexor, platform, body) {
        var response, data, errorMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("".concat(vexor.apiUrl, "/portals"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-vexor-key": vexor.publishableKey,
                                "x-vexor-platform": platform,
                                "x-vexor-project-id": vexor.projectId
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
                        throw new Error("Portal request failed: ".concat(errorMessage));
                    }
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return _createPortal.apply(this, arguments);
}
// src/methods/connect.ts
var vexorConnect = function(vexor) {
    return Object.assign(// Generic connect method
    function(params) {
        return vexor.createConnect(params.platform, params);
    }, // Platform-specific connect methods
    {
        mercadopago: function(body) {
            return vexor.createConnect("mercadopago", body);
        },
        stripe: function(body) {
            return vexor.createConnect("stripe", body);
        },
        auth: function(body) {
            return vexor.createConnectAuth(body);
        },
        pay: Object.assign(function(params) {
            return vexor.createConnectPay(params.platform, params);
        }, {
            mercadopago: function(body) {
                return vexor.createConnectPay("mercadopago", body);
            },
            stripe: function(body) {
                return vexor.createConnectPay("stripe", body);
            }
        }),
        dashboard: function(body) {
            return vexor.createConnectDashboard(body);
        }
    });
};
function createConnect(vexor, platform, body) {
    return _createConnect.apply(this, arguments);
}
function _createConnect() {
    _createConnect = _async_to_generator(function(vexor, platform, body) {
        var response, data, errorMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("".concat(vexor.apiUrl, "/connect"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-vexor-key": vexor.secretKey,
                                "x-vexor-platform": platform,
                                "x-vexor-project-id": vexor.projectId,
                                "x-vexor-action": "connect"
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
                        throw new Error("Connect request failed: ".concat(errorMessage));
                    }
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return _createConnect.apply(this, arguments);
}
function createConnectAuth(vexor, body) {
    return _createConnectAuth.apply(this, arguments);
}
function _createConnectAuth() {
    _createConnectAuth = _async_to_generator(function(vexor, body) {
        var response, data, errorMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("".concat(vexor.apiUrl, "/connect"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-vexor-key": vexor.secretKey,
                                "x-vexor-platform": "mercadopago",
                                "x-vexor-project-id": vexor.projectId,
                                "x-vexor-action": "get_credentials"
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
                        throw new Error("Connect auth request failed: ".concat(errorMessage));
                    }
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return _createConnectAuth.apply(this, arguments);
}
function createConnectPay(vexor, platform, body) {
    return _createConnectPay.apply(this, arguments);
}
function _createConnectPay() {
    _createConnectPay = _async_to_generator(function(vexor, platform, body) {
        var response, data, errorMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("".concat(vexor.apiUrl, "/connect"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-vexor-key": vexor.secretKey,
                                "x-vexor-platform": platform,
                                "x-vexor-project-id": vexor.projectId,
                                "x-vexor-action": "create_payment"
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
                        throw new Error("Connect pay request failed: ".concat(errorMessage));
                    }
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return _createConnectPay.apply(this, arguments);
}
function createConnectDashboard(vexor, body) {
    return _createConnectDashboard.apply(this, arguments);
}
function _createConnectDashboard() {
    _createConnectDashboard = _async_to_generator(function(vexor, body) {
        var response, data, errorMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("".concat(vexor.apiUrl, "/connect"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-vexor-key": vexor.secretKey,
                                "x-vexor-platform": "stripe",
                                "x-vexor-project-id": vexor.projectId,
                                "x-vexor-action": "get_dashboard_link"
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
                        throw new Error("Connect dashboard request failed: ".concat(errorMessage));
                    }
                    return [
                        2,
                        data
                    ];
            }
        });
    });
    return _createConnectDashboard.apply(this, arguments);
}
// src/methods.ts
var _Vexor = /*#__PURE__*/ function() {
    function _Vexor(params) {
        _class_call_check(this, _Vexor);
        this.apiUrl = "http://localhost:3001/api";
        this.publishableKey = params.publishableKey;
        this.secretKey = params.secretKey;
        this.projectId = params.projectId;
        this.pay = vexorPay(this);
        this.webhook = vexorWebhook(this);
        this.subscribe = vexorSubscribe(this);
        this.portal = vexorPortal(this);
        this.connect = vexorConnect(this);
    }
    _create_class(_Vexor, [
        {
            key: "createCheckout",
            value: function createCheckout1(platform, body) {
                return createCheckout(this, platform, body);
            }
        },
        {
            key: "handleWebhook",
            value: function handleWebhook1(req) {
                return handleWebhook(this, req);
            }
        },
        {
            key: "createSubscription",
            value: function createSubscription1(platform, body) {
                return createSubscription(this, platform, body);
            }
        },
        {
            key: "createPortal",
            value: function createPortal1(platform, body) {
                return createPortal(this, platform, body);
            }
        },
        {
            key: "createConnect",
            value: function createConnect1(platform, body) {
                return createConnect(this, platform, body);
            }
        },
        {
            key: "createConnectAuth",
            value: function createConnectAuth1(body) {
                return createConnectAuth(this, body);
            }
        },
        {
            key: "createConnectPay",
            value: function createConnectPay1(platform, body) {
                return createConnectPay(this, platform, body);
            }
        },
        {
            key: "createConnectDashboard",
            value: function createConnectDashboard1(body) {
                return createConnectDashboard(this, body);
            }
        }
    ], [
        {
            key: "fromEnv",
            value: // Create a Vexor instance using environment variables
            function fromEnv() {
                if (!_Vexor.instance) {
                    var publishableKey = process.env.NEXT_PUBLIC_VEXOR_PUBLISHABLE_KEY || process.env.VEXOR_PUBLISHABLE_KEY;
                    var secretKey = process.env.VEXOR_SECRET_KEY;
                    var projectId = process.env.NEXT_PUBLIC_VEXOR_PROJECT || process.env.VEXOR_PROJECT;
                    if (!publishableKey) {
                        throw new Error("Missing environment variable for publishable key");
                    }
                    if (!projectId) {
                        throw new Error("Missing environment variable for project ID");
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
