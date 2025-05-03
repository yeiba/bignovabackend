import { Request, Response, NextFunction } from "express";

export interface ICategory {
  GetCategoriesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetUserCategoriesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  CreateCategoryHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  GetCategoryByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  UpdateCategoryByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  DeleteCategoryHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
