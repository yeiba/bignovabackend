import { Request, Response, NextFunction } from "express";

export interface IDish {
  GetDishsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetCategoryDishesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetMenuDishesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  CreateDishHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetDishByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  UpdateDishByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  DeleteDishHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
