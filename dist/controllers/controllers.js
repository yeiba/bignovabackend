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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controllers = void 0;
const AppError_1 = require("../utils/AppError");
const User_model_1 = __importDefault(require("../models/User.model"));
class Controllers {
    static DefaultControllerHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Proceed to the next middleware or route handler
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Default error", 500));
            }
        });
    }
    static GetRouteHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).send("get Hello, World!");
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Hello world error", 500));
            }
        });
    }
    static PostRouteHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.default.findById(req.params);
                if (!user)
                    throw new AppError_1.AppError("User not found", 404, "USER_NOT_FOUND");
                res.json({ success: true, data: user });
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
}
exports.Controllers = Controllers;
