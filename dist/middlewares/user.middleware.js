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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddlewares = void 0;
const utils_1 = require("../utils/utils");
const prisma_1 = require("../repository/prisma");
const AppError_1 = require("../utils/AppError");
class UserMiddlewares {
    constructor(repo) {
        this.repo = repo;
    }
    UniqueEmailValidationHandler() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const existEmail = yield this.repo.findOne(prisma_1.prisma.user, "email", email);
                if (existEmail) {
                    res.status(400).json({ error: "Please use a unique email" });
                    return;
                }
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    CreateSessionHandler() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield utils_1.Utilities.signJwt({ userId: req.responseData.id }, { expiresIn: "1h" });
                req.session.token = token;
                req.session.save((err) => {
                    if (err) {
                        res.status(500).json({
                            error: err.message || "",
                            details: "Failed to create session",
                        });
                        return;
                    }
                    next();
                });
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
    }
    VerifySessionHandler() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.session.token;
                if (!token) {
                    res.status(401).send({ error: "Not Authorized, No Token" });
                    return;
                }
                const decoded = yield utils_1.Utilities.verifyJwt(token);
                if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
                    res.status(401).send({ error: "Not Authorized, Invalid Token" });
                    return;
                }
                req.userId = decoded.userId;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    RestrictRoleHandler(role) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const user = yield this.repo.findById(prisma_1.prisma.user, userId);
                if (!user) {
                    res.status(404).json({ error: "User does not exist" });
                    return;
                }
                if (user.role !== role) {
                    res.status(403).json({ error: "Not Authorized, Insufficient Role" });
                    return;
                }
                const { password: _ } = user, userData = __rest(user, ["password"]);
                req.userData = userData;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
}
exports.UserMiddlewares = UserMiddlewares;
//# sourceMappingURL=user.middleware.js.map