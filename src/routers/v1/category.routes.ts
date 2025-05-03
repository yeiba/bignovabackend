import { Router } from "express";
import { GlobalMiddlewares } from "../../middlewares/global.middleware";
import { MongodbRepository } from "../../repository/mongoRepository";
import { CategoryControllers } from "../../controllers/category.controllers";
import { UserMiddlewares } from "../../middlewares/user.middleware";

const repository = new MongodbRepository();

const CategoryC = new CategoryControllers(repository);
const GlobalM = new GlobalMiddlewares(repository);
const UserM = new UserMiddlewares(repository);
const router = Router();

router
  .route("/")
  .get(
    CategoryC.GetCategoriesHandler.bind(CategoryC),
    GlobalM.ResponseHandler("Get All Categries")
  );
router
  .route("/userId/:userId")
  .get(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    CategoryC.GetUserCategoriesHandler.bind(CategoryC),
    GlobalM.ResponseHandler("Get User Categries")
  )
  .post(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.ValidationHandler("createCategory"),
    GlobalM.UploadImageHandler("image"),
    CategoryC.CreateCategoryHandler.bind(CategoryC),
    GlobalM.ResponseHandler("Create Category")
  );
router
  .route("/categoryId/:categoryId")
  .get(
    CategoryC.GetCategoryByIdHandler.bind(CategoryC),
    GlobalM.ResponseHandler("Get Category Id")
  )
  .put(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.UploadImageHandler("image"),
    CategoryC.UpdateCategoryByIdHandler.bind(CategoryC),
    GlobalM.ResponseHandler("Update Category")
  )
  .delete(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.DeleteRelatedImagesHandler(),
    CategoryC.DeleteCategoryHandler.bind(CategoryC),
    GlobalM.ResponseHandler("Delete Category")
  );

export default router;
