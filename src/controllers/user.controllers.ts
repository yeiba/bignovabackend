import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { IRepository } from "../repository/repository.interface";
import bcrypt from "bcryptjs";
import { prisma } from "../repository/prisma";
import { IUser } from "./Interfaces/user.interface";

export class UserControllers implements IUser {
  private repo: IRepository;

  constructor(repo: IRepository) {
    this.repo = repo;
  }

  public GetRouteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({ message: "get Hello, World!" });
    } catch (error: any) {
      next(new AppError(error.message || "Hello world error", 500));
    }
  };
  public CreateUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password, avatar } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.repo.createDocument(prisma.user, {
        name,
        email,
        avatar,
        password: hashedPassword,
      });
      if (!user) {
        res
          .status(404)
          .json({ error: "User did not Creater", details: "USER_NOT_FOUND" });
        return;
      }

      // const { password: _, ...userData } = user && user.toJSON();
      req.responseData = user;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  };
  public LoginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, email, password } = req.body;

      const user = userId
        ? await this.repo.findById(prisma.user, userId)
        : await this.repo.findOne(prisma.user, "email", email);

      if (!user) {
        res
          .status(401)
          .json({ error: "Invalid credentials", details: "USER_NOT_FOUND" });
        return;
      }

      if (!user.password) {
        res.status(401).json({
          error: "Invalid credentials",
          details: "Please paricipate with google or github",
        });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        res.status(401).json({
          error: "Invalid credentials",
          details: "Invalid Password",
        });
        return;
      }

      const { password: _, ...userData } = user;
      req.responseData = userData;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  };
  public OAuthLoginHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      const user = await this.repo.findOne(prisma.user, "email", email);

      if (!user) {
        res
          .status(401)
          .json({ error: "Invalid credentials", details: "USER_NOT_FOUND" });
        return;
      }

      const { password: _, ...userData } = user;
      req.responseData = userData;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  };
  public LogoutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.session.destroy((err) => {
        if (err) {
          res.status(403).json({ error: err.message, details: "Logout Error" });
          return;
        }
        res.status(200).json({ message: "Logout seccesfuly" });
      });
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  };
  public DeleteUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const deleteUser = await this.repo.deleteById(prisma.user, userId);
      if (!deleteUser) {
        res.status(401).json({ error: "User Not Deleted " });
        return;
      }
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    } finally {
      delete req.responseData;
    }
  };
}
