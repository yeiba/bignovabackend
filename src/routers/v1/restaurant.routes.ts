import { Router } from "express";
import { GlobalMiddlewares } from "../../middlewares/global.middleware";
import { MongodbRepository } from "../../repository/mongoRepository";
import { RestaurantControllers } from "../../controllers/restaurant.controllers";
import { UserMiddlewares } from "../../middlewares/user.middleware";

const repository = new MongodbRepository();

const RestaurantC = new RestaurantControllers(repository);
const GlobalM = new GlobalMiddlewares(repository);
const UserM = new UserMiddlewares(repository);
const router = Router();

router
  .route("/")
  .get(
    RestaurantC.GetRestaurentsHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Get all restaurents")
  );

router
  .route("/categoryId/:categoryId")
  .get(
    RestaurantC.GetCategoryRestaurantsHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Get Category restaurent")
  );
router
  .route("/userId/:userId")
  .get(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    RestaurantC.GetUserRestaurantsHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Get User restaurents")
  )
  .post(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.ValidationHandler("createRestaurent"),
    GlobalM.UploadImageHandler("banner"),
    RestaurantC.CreateRestaurantHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Create restaurent")
  );
router
  .route("/restaurantId/:restaurantId")
  .get(
    RestaurantC.GetRestaurantByIdHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Get restaurent By Id")
  )
  .put(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.ValidationHandler("updateRestaurent"),
    GlobalM.UploadImageHandler("banner"),
    RestaurantC.UpdateRestaurantByIdHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Update User restaurent By Id")
  )
  .delete(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.DeleteRelatedImagesHandler(),
    RestaurantC.DeleteRestaurantByIdHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Delete User restaurent By Id")
  );

router
  .route("/qrcode/:restaurantId")
  .post(
    RestaurantC.QRCodeRestaurentHandler.bind(RestaurantC),
    GlobalM.ResponseHandler("Get restaurent Q&R Code By Id")
  );
export default router;
