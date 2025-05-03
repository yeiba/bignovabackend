import { Router } from "express";
import { GlobalMiddlewares } from "../../middlewares/global.middleware";
import { MongodbRepository } from "../../repository/mongoRepository";
import { DishControllers } from "../../controllers/dish.controllers";
import { UserMiddlewares } from "../../middlewares/user.middleware";

const repository = new MongodbRepository();

const DishC = new DishControllers(repository);
const GlobalM = new GlobalMiddlewares(repository);
const UserM = new UserMiddlewares(repository);
const router = Router();

router
  .route("/")
  .get(DishC.GetDishsHandler.bind(DishC), GlobalM.ResponseHandler("Get Dishs"));
router
  .route("/categoryId/:categoryId")
  .get(
    DishC.GetCategoryDishesHandler.bind(DishC),
    GlobalM.ResponseHandler("Get Category Dishes")
  );
router
  .route("/menuId/:menuId")
  .get(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    DishC.GetMenuDishesHandler.bind(DishC),
    GlobalM.ResponseHandler("Get Menu Dishes")
  )
  .post(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.ValidationHandler("createDish"),
    GlobalM.UploadImageHandler("images"),
    DishC.CreateDishHandler.bind(DishC),
    GlobalM.ResponseHandler("Create Dish")
  );
router
  .route("/dishId/:dishId")
  .get(DishC.GetDishByIdHandler.bind(DishC), GlobalM.ResponseHandler())
  .put(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.UploadImageHandler("images"),
    DishC.UpdateDishByIdHandler.bind(DishC),
    GlobalM.ResponseHandler("Update Dish")
  )
  .delete(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.DeleteRelatedImagesHandler(),
    DishC.DeleteDishHandler.bind(DishC),
    GlobalM.ResponseHandler("Delete Dish")
  );
export default router;
