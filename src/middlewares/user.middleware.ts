import { Request, Response, NextFunction } from "express";

import { IRepository } from "../repository/repository.interface";
import { validate as uuidValidate } from "uuid";
import { Utilities } from "../utils/utils";
import { prisma } from "../repository/prisma";
import { AppError } from "../utils/AppError";

export class UserMiddlewares {
  private repo: IRepository;

  constructor(repo: IRepository) {
    this.repo = repo;
  }
  public UniqueEmailValidationHandler() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { email } = req.body;
        const existEmail = await this.repo.findOne(prisma.user, "email", email);
        if (existEmail) {
          res.status(400).json({ error: "Please use a unique email" });
          return;
        }
        next();
      } catch (error: any) {
        next(new AppError(error.message || "Post Request error", 500));
      }
    };
  }
  public CreateSessionHandler() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const token = await Utilities.signJwt(
          { userId: req.responseData.id },
          { expiresIn: "1h" }
        );
        req.session.token = token;
        req.session.save((err) => {
          if (err) {
            res.status(500).json({
              error: err.message || "",
              details: "Failed to create session",
            });
            return;
          }
          next();
        });
      } catch (error: any) {
        next(new AppError(error.message || "Request error", 500));
      }
    };
  }
  public VerifySessionHandler() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const token = req.session.token;

        if (!token) {
          res.status(401).send({ error: "Not Authorized, No Token" });
          return;
        }
        const decoded = await Utilities.verifyJwt(token);
        if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
          res.status(401).send({ error: "Not Authorized, Invalid Token" });
          return;
        }

        req.userId = decoded.userId;
        next();
      } catch (error: any) {
        next(new AppError(error.message || "Post Request error", 500));
      }
    };
  }
  public RestrictRoleHandler(role: "admin" | "user") {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = req.userId;
        const user = await this.repo.findById(prisma.user, userId);

        if (!user) {
          res.status(404).json({ error: "User does not exist" });
          return;
        }

        if (user.role !== role) {
          res.status(403).json({ error: "Not Authorized, Insufficient Role" });
          return;
        }

        const { password: _, ...userData } = user;
        req.userData = userData;
        next();
      } catch (error: any) {
        next(new AppError(error.message || "Post Request error", 500));
      }
    };
  }
}
