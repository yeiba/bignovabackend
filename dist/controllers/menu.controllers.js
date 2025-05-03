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
exports.MenuControllers = void 0;
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../repository/prisma");
class MenuControllers {
    constructor(repo) {
        this.repo = repo;
    }
    GetMenusHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menu = yield this.repo.find(prisma_1.prisma.menu);
                if (!menu) {
                    res.status(404).json({ error: "Menu not found " });
                    return;
                }
                req.responseData = menu;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    GetRestaurentMenusHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId } = req.params;
                const restaurant = yield this.repo.findById(prisma_1.prisma.restaurant, restaurantId);
                if (!restaurant) {
                    res.status(404).json({ error: "Restaurant not found " });
                    return;
                }
                req.responseData = restaurant.menus;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
    CreateMenuHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantId } = req.params;
                const { name } = req.body;
                const menu = yield this.repo.createDocument(prisma_1.prisma.menu, {
                    name,
                    restaurant: { connect: { id: restaurantId } },
                });
                if (!menu) {
                    res.status(404).json({ error: "Creating Menu Error " });
                    return;
                }
                req.responseData = menu;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Request error", 500));
            }
        });
    }
    GetMenuByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { menuId } = req.params;
                const menu = yield this.repo.findById(prisma_1.prisma.menu, menuId);
                if (!menu) {
                    res.status(404).json({ error: "Menu not found " });
                    return;
                }
                req.responseData = menu;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    UpdateMenuByIdHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { menuId } = req.params;
                const body = __rest(req.body, []);
                const menu = yield this.repo.updateById(prisma_1.prisma.menu, menuId, {
                    body,
                });
                if (!menu) {
                    res.status(404).json({ error: "Menu not found " });
                    return;
                }
                req.responseData = menu;
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || " Request error", 500));
            }
        });
    }
    DeleteMenuHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { menuId } = req.params;
                const deleteMenu = yield this.repo.deleteById(prisma_1.prisma.menu, menuId);
                if (!deleteMenu) {
                    res.status(401).json({ error: "Menu Not Deleted " });
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
exports.MenuControllers = MenuControllers;
//# sourceMappingURL=menu.controllers.js.map