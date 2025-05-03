"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const JWT_SECRET = config_1.default.JWT_SECRET; // Make sure to keep this secret in production
class Utilities {
    static signJwt(payload, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn });
    }
    static verifyJwt(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            return null; // Return null if token verification fails
        }
    }
}
exports.Utilities = Utilities;
