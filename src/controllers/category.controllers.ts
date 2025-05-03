import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { IRepository } from "../repository/repository.interface";

import { prisma } from "../repository/prisma";
import { ICategory } from "./Interfaces/category.interface";

export class CategoryControllers implements ICategory {
  private repo: IRepository;

  constructor(repo: IRepository) {
    this.repo = repo;
  }
  public async GetCategoriesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const Categories = await this.repo.find(prisma.category);
      if (!Categories) {
        res.status(404).json({ error: "Categories not found " });
        return;
      }

      req.responseData = Categories;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async GetUserCategoriesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await this.repo.findById(prisma.user, userId);
      if (!user) {
        res.status(404).json({ error: "User menu not found " });
        return;
      }

      req.responseData = user.categories;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Post Request error", 500));
    }
  }
  public async CreateCategoryHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const image = req.image;
      const { name, description } = req.body;

      const { userId } = req.params;

      const user = await this.repo.findById(prisma.user, userId);
      if (!user) {
        res.status(404).json({ error: "User not found Error " });
        return;
      }

      const category = await this.repo.createDocument(prisma.category, {
        user: { connect: { id: userId } },
        name,
        description,
        image,
      });
      if (!category) {
        res.status(401).json({ error: "Category Not Created " });
        return;
      }

      req.responseData = category;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  }
  public async GetCategoryByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = req.params;
      const category = await this.repo.findById(prisma.category, categoryId);
      if (!category) {
        res.status(404).json({ error: "Category not found " });
        return;
      }

      req.responseData = category;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async UpdateCategoryByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = req.params;
      const { ...body } = req.body;
      const category = await this.repo.updateById(prisma.category, categoryId, {
        body,
      });
      if (!category) {
        res.status(404).json({ error: "Category not found " });
        return;
      }

      req.responseData = category;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async DeleteCategoryHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = req.params;
      const deleteCategory = await this.repo.deleteById(
        prisma.category,
        categoryId
      );
      if (!deleteCategory) {
        res.status(404).json({ error: "Category not found " });
        return;
      }
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    } finally {
      delete req.responseData;
    }
  }
}
