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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const AppError_1 = require("../utils/AppError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../repository/prisma");
class UserControllers {
    constructor(repo) {
        this.GetRouteHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json({ message: "get Hello, World!" });
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Hello world error", 500));
            }
        });
        this.CreateUserHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, avatar } = req.body;
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const user = yield this.repo.createDocument(prisma_1.prisma.user, {
                    name,
                    email,
                    avatar,
                    password: hashedPassword,
                });
                if (!user) {
                    res
                        .status(404)
                        .json({ error: "User did not Creater", details: "USER_NOT_FOUND" });
                    return;
                }
                // const { password: _, ...userData } = user && user.toJSON();
                req.responseData = user;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
        this.LoginHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, email, password } = req.body;
                const user = userId
                    ? yield this.repo.findById(prisma_1.prisma.user, userId)
                    : yield this.repo.findOne(prisma_1.prisma.user, "email", email);
                if (!user) {
                    res
                        .status(401)
                        .json({ error: "Invalid credentials", details: "USER_NOT_FOUND" });
                    return;
                }
                if (!user.password) {
                    res.status(401).json({
                        error: "Invalid credentials",
                        details: "Please paricipate with google or github",
                    });
                    return;
                }
                const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
                if (!isValidPassword) {
                    res.status(401).json({
                        error: "Invalid credentials",
                        details: "Invalid Password",
                    });
                    return;
                }
                const { password: _ } = user, userData = __rest(user, ["password"]);
                req.responseData = userData;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
        this.OAuthLoginHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield this.repo.findOne(prisma_1.prisma.user, "email", email);
                if (!user) {
                    res
                        .status(401)
                        .json({ error: "Invalid credentials", details: "USER_NOT_FOUND" });
                    return;
                }
                const { password: _ } = user, userData = __rest(user, ["password"]);
                req.responseData = userData;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
        this.LogoutHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.session.destroy((err) => {
                    if (err) {
                        res.status(403).json({ error: err.message, details: "Logout Error" });
                        return;
                    }
                    res.status(200).json({ message: "Logout seccesfuly" });
                });
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
        this.DeleteUserHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const deleteUser = yield this.repo.deleteById(prisma_1.prisma.user, userId);
                if (!deleteUser) {
                    res.status(401).json({ error: "User Not Deleted " });
                    return;
                }
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
            finally {
                delete req.responseData;
            }
        });
        this.repo = repo;
    }
}
exports.UserControllers = UserControllers;
//# sourceMappingURL=user.controllers.js.map