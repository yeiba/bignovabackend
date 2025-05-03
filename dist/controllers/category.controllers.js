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
exports.CategoryControllers = void 0;
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../repository/prisma");
class CategoryControllers {
    constructor(repo) {
        this.repo = repo;
    }
    GetCategoriesHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Categories = yield this.repo.find(prisma_1.prisma.category);
                if (!Categories) {
                    res.status(404).json({ error: "Categories not found " });
                    return;
                }
                req.responseData = Categories;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    GetUserCategoriesHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield this.repo.findById(prisma_1.prisma.user, userId);
                if (!user) {
                    res.status(404).json({ error: "User menu not found " });
                    return;
                }
                req.responseData = user.categories;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    CreateCategoryHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = req.image;
                const { name, description } = req.body;
                const { userId } = req.params;
                const user = yield this.repo.findById(prisma_1.prisma.user, userId);
                if (!user) {
                    res.status(404).json({ error: "User not found Error " });
                    return;
                }
                const category = yield this.repo.createDocument(prisma_1.prisma.category, {
                    user: { connect: { id: userId } },
                    name,
                    description,
                    image,
                });
                if (!category) {
                    res.status(401).json({ error: "Category Not Created " });
                    return;
                }
                req.responseData = category;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
    }
    GetCategoryByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const category = yield this.repo.findById(prisma_1.prisma.category, categoryId);
                if (!category) {
                    res.status(404).json({ error: "Category not found " });
                    return;
                }
                req.responseData = category;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    UpdateCategoryByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const body = __rest(req.body, []);
                const category = yield this.repo.updateById(prisma_1.prisma.category, categoryId, {
                    body,
                });
                if (!category) {
                    res.status(404).json({ error: "Category not found " });
                    return;
                }
                req.responseData = category;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    DeleteCategoryHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const deleteCategory = yield this.repo.deleteById(prisma_1.prisma.category, categoryId);
                if (!deleteCategory) {
                    res.status(404).json({ error: "Category not found " });
                    return;
                }
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
            finally {
                delete req.responseData;
            }
        });
    }
}
exports.CategoryControllers = CategoryControllers;
//# sourceMappingURL=category.controllers.js.map