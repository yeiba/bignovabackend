import { Router } from "express";
import userRoutes from "./user.routes";
import restaurantRoutes from "./restaurant.routes";
import menuRoutes from "./menu.routes";
import categoryRoutes from "./category.routes";
import dishRoutes from "./dish.routes";

const v1Router = Router();

// Mount routes
v1Router.use("/users", userRoutes);
v1Router.use("/restaurants", restaurantRoutes);
v1Router.use("/menus", menuRoutes);
v1Router.use("/categoreis", categoryRoutes);
v1Router.use("/dishes", dishRoutes);
export default v1Router;
