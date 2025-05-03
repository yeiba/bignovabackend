import { Request, Response, NextFunction } from "express";

export interface IUser {
  CreateUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  LoginHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  LogoutHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
  DeleteUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
