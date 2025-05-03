"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const dotenv_1 = __importDefault(require("dotenv")); // For environment variables
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config(); // Load environment variables
const JWT_SECRET = config_1.default.JWT_SECRET; // Make sure to keep this secret in production
class Utilities {
    static signJwt(payload, expiresIn) {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, expiresIn);
    }
    static verifyJwt(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (_a) {
            return null;
        }
    }
    static extractImageUrls(obj) {
        try {
            const urls = [];
            function recurse(value) {
                if (Array.isArray(value)) {
                    for (const item of value) {
                        recurse(item);
                    }
                }
                else if (typeof value === "object" && value !== null) {
                    for (const [key, val] of Object.entries(value)) {
                        if (key === "imageUrl" && typeof val === "string") {
                            urls.push(val);
                        }
                        else {
                            recurse(val);
                        }
                    }
                }
            }
            recurse(obj);
            return urls;
        }
        catch (error) {
            return []; // Return null if token verification fails
        }
    }
    static supaBaseClient() {
        return (0, supabase_js_1.createClient)(config_1.default.SUPABASE_BUCKET_URL, config_1.default.ANON_KEY);
    }
}
exports.Utilities = Utilities;
//# sourceMappingURL=utils.js.map