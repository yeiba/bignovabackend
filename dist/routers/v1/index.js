"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers/controllers");
const v1Router = (0, express_1.Router)();
v1Router
    .route("/")
    .get(controllers_1.Controllers.GetRouteHandler)
    .post(controllers_1.Controllers.PostRouteHandler);
exports.default = v1Router;
