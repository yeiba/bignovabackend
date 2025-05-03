"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const restaurant_routes_1 = __importDefault(require("./restaurant.routes"));
const menu_routes_1 = __importDefault(require("./menu.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const dish_routes_1 = __importDefault(require("./dish.routes"));
const v1Router = (0, express_1.Router)();
// Mount routes
v1Router.use("/users", user_routes_1.default);
v1Router.use("/restaurants", restaurant_routes_1.default);
v1Router.use("/menus", menu_routes_1.default);
v1Router.use("/categoreis", category_routes_1.default);
v1Router.use("/dishes", dish_routes_1.default);
exports.default = v1Router;
//# sourceMappingURL=index.js.map