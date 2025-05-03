"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../../controllers/user.controllers");
const global_middleware_1 = require("../../middlewares/global.middleware");
const mongoRepository_1 = require("../../repository/mongoRepository");
const user_middleware_1 = require("../../middlewares/user.middleware");
const repository = new mongoRepository_1.MongodbRepository();
const UserC = new user_controllers_1.UserControllers(repository);
const GlobalM = new global_middleware_1.GlobalMiddlewares(repository);
const UserM = new user_middleware_1.UserMiddlewares(repository);
const router = (0, express_1.Router)();
router.route("/").get(UserC.GetRouteHandler);
router
    .route("/authenticate")
    .get(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), (req, res) => {
    res.status(200).json({ success: true, data: req.userData });
});
router
    .route("/register")
    .post(UserM.UniqueEmailValidationHandler(), GlobalM.ValidationHandler("register"), GlobalM.UploadImageHandler("avatar"), UserC.CreateUserHandler, GlobalM.ResponseHandler("Register User"));
router
    .route("/login")
    .post(GlobalM.ValidationHandler("login"), UserC.LoginHandler.bind(UserC), UserM.CreateSessionHandler(), GlobalM.ResponseHandler("Login User"));
router
    .route("/OAuthlogin")
    .post(GlobalM.ValidationHandler("OAuthlogin"), UserC.OAuthLoginHandler.bind(UserC), UserM.CreateSessionHandler(), GlobalM.ResponseHandler("Login OAuth User"));
router
    .route("/logout")
    .post(UserM.VerifySessionHandler(), UserC.LogoutHandler.bind(UserC));
router
    .route("/users")
    .get(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"));
router
    .route("/profile/:userId")
    .put(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"))
    .delete(UserM.VerifySessionHandler(), UserM.RestrictRoleHandler("admin"), GlobalM.DeleteRelatedImagesHandler(), UserC.DeleteUserHandler.bind(UserC), GlobalM.ResponseHandler("Delete User"));
exports.default = router;
//# sourceMappingURL=user.routes.js.map