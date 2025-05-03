import { Request, Response, NextFunction } from "express";

export interface IMenu {
  GetMenusHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetRestaurentMenusHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  CreateMenuHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetMenuByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  UpdateMenuByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  DeleteMenuHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
