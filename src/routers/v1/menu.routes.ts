import { Router } from "express";
import { GlobalMiddlewares } from "../../middlewares/global.middleware";
import { MongodbRepository } from "../../repository/mongoRepository";
import { MenuControllers } from "../../controllers/menu.controllers";
import { UserMiddlewares } from "../../middlewares/user.middleware";

const repository = new MongodbRepository();

const MenuC = new MenuControllers(repository);
const GlobalM = new GlobalMiddlewares(repository);
const UserM = new UserMiddlewares(repository);
const router = Router();

router
  .route("/")
  .get(
    MenuC.GetMenusHandler.bind(MenuC),
    GlobalM.ResponseHandler("Get All Menus")
  );
router
  .route("/restaurantId/:restaurantId")
  .get(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    MenuC.GetRestaurentMenusHandler.bind(MenuC),
    GlobalM.ResponseHandler("Get restaurent menus")
  )
  .post(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.ValidationHandler("createMenu"),
    MenuC.CreateMenuHandler.bind(MenuC),
    GlobalM.ResponseHandler("Create Menu")
  );
router
  .route("/menuId/:menuId")
  .get(MenuC.GetMenuByIdHandler.bind(MenuC), GlobalM.ResponseHandler())
  .put(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    MenuC.UpdateMenuByIdHandler.bind(MenuC),
    GlobalM.ResponseHandler("Update Menu")
  )
  .delete(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.DeleteRelatedImagesHandler(),
    MenuC.DeleteMenuHandler.bind(MenuC),
    GlobalM.ResponseHandler("Delete Menu")
  );

export default router;
