import { Request, Response, NextFunction } from "express";

export interface IRestaurent {
  GetRestaurentsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetCategoryRestaurantsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetUserRestaurantsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  CreateRestaurantHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetRestaurantByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  UpdateRestaurantByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  DeleteRestaurantByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  QRCodeRestaurentHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
