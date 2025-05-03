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
exports.RestaurantControllers = void 0;
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../repository/prisma");
class RestaurantControllers {
    constructor(repo) {
        this.repo = repo;
    }
    GetRestaurentsHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield this.repo.find(prisma_1.prisma.restaurant);
                if (!restaurant) {
                    res.status(404).json({ error: "Restaurant not found " });
                    return;
                }
                req.responseData = restaurant;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    GetCategoryRestaurantsHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const category = yield this.repo.findById(prisma_1.prisma.category, categoryId);
                if (!category) {
                    res.status(404).json({ error: "Category not found " });
                    return;
                }
                req.responseData = category.restaurants;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    GetUserRestaurantsHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield this.repo.findById(prisma_1.prisma.user, userId);
                if (!user) {
                    res.status(404).json({ error: "User not found " });
                    return;
                }
                req.responseData = user.restaurants;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    CreateRestaurantHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { name, address, categoryId } = req.body;
                const banner = req.image;
                const user = yield this.repo.findById(prisma_1.prisma.user, userId);
                if (!user) {
                    res.status(404).json({ error: "User not found Error " });
                    return;
                }
                const restaurant = yield this.repo.createDocument(prisma_1.prisma.restaurant, {
                    owner: {
                        connect: { id: userId },
                    },
                    category: {
                        connect: { id: categoryId },
                    },
                    name,
                    address,
                    banner,
                });
                if (!restaurant) {
                    res.status(404).json({ error: "Creating Restaurant Error " });
                    return;
                }
                req.responseData = restaurant;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
    }
    GetRestaurantByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId } = req.params;
                const restaurant = yield this.repo.findById(prisma_1.prisma.restaurant, restaurantId);
                if (!restaurant) {
                    res.status(404).json({ error: "Restaurant not found " });
                    return;
                }
                req.responseData = restaurant;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    UpdateRestaurantByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId } = req.params;
                const body = __rest(req.body, []);
                const restaurant = yield this.repo.updateById(prisma_1.prisma.restaurant, restaurantId, {
                    body,
                });
                if (!restaurant) {
                    res.status(404).json({ error: "Restaurant not found " });
                    return;
                }
                req.responseData = restaurant;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    DeleteRestaurantByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId } = req.params;
                const deleteRestaurant = yield this.repo.deleteById(prisma_1.prisma.restaurant, restaurantId);
                if (!deleteRestaurant) {
                    res.status(404).json({ error: "Restaurant not found " });
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
    QRCodeRestaurentHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId } = req.params;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
}
exports.RestaurantControllers = RestaurantControllers;
//# sourceMappingURL=restaurant.controllers.js.map