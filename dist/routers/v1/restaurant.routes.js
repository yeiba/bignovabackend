"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const global_middleware_1 = require("../../middlewares/global.middleware");
const mongoRepository_1 = require("../../repository/mongoRepository");
const restaurant_controllers_1 = require("../../controllers/restaurant.controllers");
const user_middleware_1 = require("../../middlewares/user.middleware");
const repository = new mongoRepository_1.MongodbRepository();
const RestaurantC = new restaurant_controllers_1.RestaurantControllers(repository);
const GlobalM = new global_middleware_1.GlobalMiddlewares(repository);
const UserM = new user_middleware_1.UserMiddlewares(repository);
const router = (0, express_1.Router)();
router
    .route("/")
    .get(RestaurantC.GetRestaurentsHandler.bind(RestaurantC), GlobalM.ResponseHandler("Get all restaurents"));
router
    .route("/categoryId/:categoryId")
    .get(RestaurantC.GetCategoryRestaurantsHandler.bind(RestaurantC), GlobalM.ResponseHandler("Get Category restaurent"));
router
    .route("/userId/:userId")
    .get(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), RestaurantC.GetUserRestaurantsHandler.bind(RestaurantC), GlobalM.ResponseHandler("Get User restaurents"))
    .post(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.ValidationHandler("createRestaurent"), GlobalM.UploadImageHandler("banner"), RestaurantC.CreateRestaurantHandler.bind(RestaurantC), GlobalM.ResponseHandler("Create restaurent"));
router
    .route("/restaurantId/:restaurantId")
    .get(RestaurantC.GetRestaurantByIdHandler.bind(RestaurantC), GlobalM.ResponseHandler("Get restaurent By Id"))
    .put(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.ValidationHandler("updateRestaurent"), GlobalM.UploadImageHandler("banner"), RestaurantC.UpdateRestaurantByIdHandler.bind(RestaurantC), GlobalM.ResponseHandler("Update User restaurent By Id"))
    .delete(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.DeleteRelatedImagesHandler(), RestaurantC.DeleteRestaurantByIdHandler.bind(RestaurantC), GlobalM.ResponseHandler("Delete User restaurent By Id"));
router
    .route("/qrcode/:restaurantId")
    .post(RestaurantC.QRCodeRestaurentHandler.bind(RestaurantC), GlobalM.ResponseHandler("Get restaurent Q&R Code By Id"));
exports.default = router;
//# sourceMappingURL=restaurant.routes.js.map