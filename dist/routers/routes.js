"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_1 = __importDefault(require("./v1"));
const router = (0, express_1.Router)();
// Mount versioned routes
router.use("/v1", v1_1.default); // Version 1 routes
exports.default = router;
//# sourceMappingURL=routes.js.map