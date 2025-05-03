"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const global_middleware_1 = require("../../middlewares/global.middleware");
const mongoRepository_1 = require("../../repository/mongoRepository");
const menu_controllers_1 = require("../../controllers/menu.controllers");
const user_middleware_1 = require("../../middlewares/user.middleware");
const repository = new mongoRepository_1.MongodbRepository();
const MenuC = new menu_controllers_1.MenuControllers(repository);
const GlobalM = new global_middleware_1.GlobalMiddlewares(repository);
const UserM = new user_middleware_1.UserMiddlewares(repository);
const router = (0, express_1.Router)();
router
    .route("/")
    .get(MenuC.GetMenusHandler.bind(MenuC), GlobalM.ResponseHandler("Get All Menus"));
router
    .route("/restaurantId/:restaurantId")
    .get(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), MenuC.GetRestaurentMenusHandler.bind(MenuC), GlobalM.ResponseHandler("Get restaurent menus"))
    .post(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.ValidationHandler("createMenu"), MenuC.CreateMenuHandler.bind(MenuC), GlobalM.ResponseHandler("Create Menu"));
router
    .route("/menuId/:menuId")
    .get(MenuC.GetMenuByIdHandler.bind(MenuC), GlobalM.ResponseHandler())
    .put(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), MenuC.UpdateMenuByIdHandler.bind(MenuC), GlobalM.ResponseHandler("Update Menu"))
    .delete(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.DeleteRelatedImagesHandler(), MenuC.DeleteMenuHandler.bind(MenuC), GlobalM.ResponseHandler("Delete Menu"));
exports.default = router;
//# sourceMappingURL=menu.routes.js.map