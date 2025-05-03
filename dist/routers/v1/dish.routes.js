"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const global_middleware_1 = require("../../middlewares/global.middleware");
const mongoRepository_1 = require("../../repository/mongoRepository");
const dish_controllers_1 = require("../../controllers/dish.controllers");
const user_middleware_1 = require("../../middlewares/user.middleware");
const repository = new mongoRepository_1.MongodbRepository();
const DishC = new dish_controllers_1.DishControllers(repository);
const GlobalM = new global_middleware_1.GlobalMiddlewares(repository);
const UserM = new user_middleware_1.UserMiddlewares(repository);
const router = (0, express_1.Router)();
router
    .route("/")
    .get(DishC.GetDishsHandler.bind(DishC), GlobalM.ResponseHandler("Get Dishs"));
router
    .route("/categoryId/:categoryId")
    .get(DishC.GetCategoryDishesHandler.bind(DishC), GlobalM.ResponseHandler("Get Category Dishes"));
router
    .route("/menuId/:menuId")
    .get(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), DishC.GetMenuDishesHandler.bind(DishC), GlobalM.ResponseHandler("Get Menu Dishes"))
    .post(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.ValidationHandler("createDish"), GlobalM.UploadImageHandler("images"), DishC.CreateDishHandler.bind(DishC), GlobalM.ResponseHandler("Create Dish"));
router
    .route("/dishId/:dishId")
    .get(DishC.GetDishByIdHandler.bind(DishC), GlobalM.ResponseHandler())
    .put(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.UploadImageHandler("images"), DishC.UpdateDishByIdHandler.bind(DishC), GlobalM.ResponseHandler("Update Dish"))
    .delete(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.DeleteRelatedImagesHandler(), DishC.DeleteDishHandler.bind(DishC), GlobalM.ResponseHandler("Delete Dish"));
exports.default = router;
//# sourceMappingURL=dish.routes.js.map