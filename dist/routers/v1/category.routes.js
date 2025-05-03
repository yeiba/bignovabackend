"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const global_middleware_1 = require("../../middlewares/global.middleware");
const mongoRepository_1 = require("../../repository/mongoRepository");
const category_controllers_1 = require("../../controllers/category.controllers");
const user_middleware_1 = require("../../middlewares/user.middleware");
const repository = new mongoRepository_1.MongodbRepository();
const CategoryC = new category_controllers_1.CategoryControllers(repository);
const GlobalM = new global_middleware_1.GlobalMiddlewares(repository);
const UserM = new user_middleware_1.UserMiddlewares(repository);
const router = (0, express_1.Router)();
router
    .route("/")
    .get(CategoryC.GetCategoriesHandler.bind(CategoryC), GlobalM.ResponseHandler("Get All Categries"));
router
    .route("/userId/:userId")
    .get(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), CategoryC.GetUserCategoriesHandler.bind(CategoryC), GlobalM.ResponseHandler("Get User Categries"))
    .post(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.ValidationHandler("createCategory"), GlobalM.UploadImageHandler("image"), CategoryC.CreateCategoryHandler.bind(CategoryC), GlobalM.ResponseHandler("Create Category"));
router
    .route("/categoryId/:categoryId")
    .get(CategoryC.GetCategoryByIdHandler.bind(CategoryC), GlobalM.ResponseHandler("Get Category Id"))
    .put(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.UploadImageHandler("image"), CategoryC.UpdateCategoryByIdHandler.bind(CategoryC), GlobalM.ResponseHandler("Update Category"))
    .delete(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.DeleteRelatedImagesHandler(), CategoryC.DeleteCategoryHandler.bind(CategoryC), GlobalM.ResponseHandler("Delete Category"));
exports.default = router;
//# sourceMappingURL=category.routes.js.map