"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDERS = exports.OTP_OPTIONS = exports.INVALID_PASSWORD_MESSAGE = exports.PASSWORD_MESSAGE = exports.ROLES = void 0;
const environment_1 = require("../environment");
var ROLES;
(function (ROLES) {
    ROLES["USER"] = "user";
    ROLES["ADMIN"] = "admin";
})(ROLES = exports.ROLES || (exports.ROLES = {}));
exports.PASSWORD_MESSAGE = `Password length must be between ${environment_1.MIN_PASSWORD_LENGTH} to ${environment_1.MAX_PASSWORD_LENGTH}`;
exports.INVALID_PASSWORD_MESSAGE = 'password must contain one uppercase, lowercase, number and symbol';
var OTP_OPTIONS;
(function (OTP_OPTIONS) {
    OTP_OPTIONS["SIGNUP"] = "signup";
    OTP_OPTIONS["LOGIN"] = "login";
    OTP_OPTIONS["UPDATE"] = "update";
    OTP_OPTIONS["VERIFY"] = "verify";
})(OTP_OPTIONS = exports.OTP_OPTIONS || (exports.OTP_OPTIONS = {}));
var PROVIDERS;
(function (PROVIDERS) {
    PROVIDERS["GOOGLE"] = "google";
    PROVIDERS["APPLE"] = "apple";
    PROVIDERS["FACEBOOK"] = "facebook";
    PROVIDERS["WHATSAPP"] = "whatsapp";
    PROVIDERS["TWITTER"] = "twitter";
})(PROVIDERS = exports.PROVIDERS || (exports.PROVIDERS = {}));
//# sourceMappingURL=index.js.map