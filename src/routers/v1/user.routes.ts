import { Router } from "express";
import { UserControllers } from "../../controllers/user.controllers";
import { GlobalMiddlewares } from "../../middlewares/global.middleware";
import { MongodbRepository } from "../../repository/mongoRepository";
import { Response } from "express";
import { UserMiddlewares } from "../../middlewares/user.middleware";

const repository = new MongodbRepository();

const UserC = new UserControllers(repository);
const GlobalM = new GlobalMiddlewares(repository);
const UserM = new UserMiddlewares(repository);
const router = Router();

router.route("/").get(UserC.GetRouteHandler);

router
  .route("/authenticate")
  .get(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    (req, res) => {
      res.status(200).json({ success: true, data: req.userData });
    }
  );

router
  .route("/register")
  .post(
    UserM.UniqueEmailValidationHandler(),
    GlobalM.ValidationHandler("register"),
    GlobalM.UploadImageHandler("avatar"),
    UserC.CreateUserHandler,
    GlobalM.ResponseHandler("Register User")
  );
router
  .route("/login")
  .post(
    GlobalM.ValidationHandler("login"),
    UserC.LoginHandler.bind(UserC),
    UserM.CreateSessionHandler(),
    GlobalM.ResponseHandler("Login User")
  );
router
  .route("/OAuthlogin")
  .post(
    GlobalM.ValidationHandler("OAuthlogin"),
    UserC.OAuthLoginHandler.bind(UserC),
    UserM.CreateSessionHandler(),
    GlobalM.ResponseHandler("Login OAuth User")
  );
router
  .route("/logout")
  .post(UserM.VerifySessionHandler(), UserC.LogoutHandler.bind(UserC));

router
  .route("/users")
  .get(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"));
router
  .route("/profile/:userId")
  .put(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"))
  .delete(
    UserM.VerifySessionHandler(),
    UserM.RestrictRoleHandler("admin"),
    GlobalM.DeleteRelatedImagesHandler(),
    UserC.DeleteUserHandler.bind(UserC),
    GlobalM.ResponseHandler("Delete User")
  );
export default router;
