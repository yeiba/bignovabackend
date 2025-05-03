"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middlewares = void 0;
class Middlewares {
    static DefaultMiddlewareHandler(condition) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Proceed to the next middleware or route handler
                if (condition) {
                    // Additional logic for condition
                    req.body.modifiedField = `Modified based on condition: ${condition}`;
                    console.log("Condition met, applying extra checks.");
                }
                next();
            }
            catch (error) {
                res
                    .status(500)
                    .json({ error: "Authentication Error", details: error.message });
            }
        });
    }
    static ValidationHandler(action) {
        return (req, res, next) => {
            const requiredFields = Middlewares.requiredFieldsMap[action];
            if (!requiredFields) {
                res.status(400).json({ error: "Invalid action specified" });
                return;
            }
            const missingFields = requiredFields.filter((field) => !req.body[field]);
            if (missingFields.length > 0) {
                res.status(400).json({
                    error: `Missing required fields: ${missingFields.join(", ")}`,
                });
                return;
            }
            next();
        };
    }
}
exports.Middlewares = Middlewares;
/**
 * Middleware to verify if a user exists by email
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
Middlewares.requiredFieldsMap = {
    verify_subscribtion: ["token"],
    subscribe: ["fullName", "email", "password"],
    oauth_subscribe: ["fullName", "email"],
    participation: ["email", "password"],
    oauth_participation: ["email"],
    login: ["email", "password"],
    register: ["firstName", "lastName", "email", "password"],
    profile: ["userId"],
    admin_update_user: ["userId", "body"],
    admin_delete_user: ["userId"],
    update_info: ["firstName", "lastName", "password"],
    update_email: ["email", "password"],
    update_role: ["role", "password"],
    update_username: ["username", "password"],
    update_password: ["newpassword", "password"],
    user_deletion: ["password"],
    create_category: ["title", "description", "userId"],
};
