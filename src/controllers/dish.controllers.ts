import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { IRepository } from "../repository/repository.interface";

import { prisma } from "../repository/prisma";
import { IDish } from "./Interfaces/dish.interface";

export class DishControllers implements IDish {
  private repo: IRepository;

  constructor(repo: IRepository) {
    this.repo = repo;
  }
  public async GetDishsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dish = await this.repo.find(prisma.dish);
      if (!dish) {
        res.status(404).json({ error: "Dish not found " });
        return;
      }

      req.responseData = dish;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async GetCategoryDishesHandler(
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

      req.responseData = category.dishs;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Post Request error", 500));
    }
  }
  public async GetMenuDishesHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { menuId } = req.params;

      const menu = await this.repo.findById(prisma.menu, menuId);
      if (!menu) {
        res.status(404).json({ error: "Menu not found " });
        return;
      }

      req.responseData = menu.dishs;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Post Request error", 500));
    }
  }
  public async CreateDishHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const images = req.images;
      const { menuId } = req.params;
      const { name, description, price, categoryId } = req.body;

      const menu = await this.repo.findById(prisma.menu, menuId);
      if (!menu) {
        res.status(404).json({ error: "Menu not found Error " });
        return;
      }
      const category = await this.repo.findById(prisma.category, categoryId);
      if (!category) {
        res.status(404).json({ error: "Category not found Error " });
        return;
      }

      const dish = await this.repo.createDocument(prisma.dish, {
        menu: {
          connect: { id: menuId },
        },
        name,
        description,
        price,
        images,
        category: {
          connect: { id: categoryId },
        },
      });
      if (!dish) {
        res.status(404).json({ error: "Creating Dish Error " });
        return;
      }

      req.responseData = dish;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  }
  public async GetDishByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { dishId } = req.params;
      const dish = await this.repo.findById(prisma.dish, dishId);
      if (!dish) {
        res.status(404).json({ error: "Dish not found " });
        return;
      }

      req.responseData = dish;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async UpdateDishByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { dishId } = req.params;
      const { ...body } = req.body;
      const dish = await this.repo.updateById(prisma.dish, dishId, {
        body,
      });
      if (!dish) {
        res.status(404).json({ error: "Dish not found " });
        return;
      }

      req.responseData = dish;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async DeleteDishHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { dishId } = req.params;
      const deleteDish = await this.repo.deleteById(prisma.dish, dishId);
      if (!deleteDish) {
        res.status(401).json({ error: "Dish Not Deleted " });
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
