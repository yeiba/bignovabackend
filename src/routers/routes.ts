import { Router } from "express";
import v1Routes from "./v1";

const router = Router();

// Mount versioned routes
router.use("/v1", v1Routes); // Version 1 routes

export default router;
