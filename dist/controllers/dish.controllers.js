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
exports.DishControllers = void 0;
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../repository/prisma");
class DishControllers {
    constructor(repo) {
        this.repo = repo;
    }
    GetDishsHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dish = yield this.repo.find(prisma_1.prisma.dish);
                if (!dish) {
                    res.status(404).json({ error: "Dish not found " });
                    return;
                }
                req.responseData = dish;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    GetCategoryDishesHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const category = yield this.repo.findById(prisma_1.prisma.category, categoryId);
                if (!category) {
                    res.status(404).json({ error: "Category not found " });
                    return;
                }
                req.responseData = category.dishs;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    GetMenuDishesHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { menuId } = req.params;
                const menu = yield this.repo.findById(prisma_1.prisma.menu, menuId);
                if (!menu) {
                    res.status(404).json({ error: "Menu not found " });
                    return;
                }
                req.responseData = menu.dishs;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    CreateDishHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = req.images;
                const { menuId } = req.params;
                const { name, description, price, categoryId } = req.body;
                const menu = yield this.repo.findById(prisma_1.prisma.menu, menuId);
                if (!menu) {
                    res.status(404).json({ error: "Menu not found Error " });
                    return;
                }
                const category = yield this.repo.findById(prisma_1.prisma.category, categoryId);
                if (!category) {
                    res.status(404).json({ error: "Category not found Error " });
                    return;
                }
                const dish = yield this.repo.createDocument(prisma_1.prisma.dish, {
                    menu: {
                        connect: { id: menuId },
                    },
                    name,
                    description,
                    price,
                    images,
                    category: {
                        connect: { id: categoryId },
                    },
                });
                if (!dish) {
                    res.status(404).json({ error: "Creating Dish Error " });
                    return;
                }
                req.responseData = dish;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
    }
    GetDishByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dishId } = req.params;
                const dish = yield this.repo.findById(prisma_1.prisma.dish, dishId);
                if (!dish) {
                    res.status(404).json({ error: "Dish not found " });
                    return;
                }
                req.responseData = dish;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    UpdateDishByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dishId } = req.params;
                const body = __rest(req.body, []);
                const dish = yield this.repo.updateById(prisma_1.prisma.dish, dishId, {
                    body,
                });
                if (!dish) {
                    res.status(404).json({ error: "Dish not found " });
                    return;
                }
                req.responseData = dish;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    DeleteDishHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dishId } = req.params;
                const deleteDish = yield this.repo.deleteById(prisma_1.prisma.dish, dishId);
                if (!deleteDish) {
                    res.status(401).json({ error: "Dish Not Deleted " });
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
exports.DishControllers = DishControllers;
//# sourceMappingURL=dish.controllers.js.map