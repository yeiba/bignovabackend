import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { IRepository } from "../repository/repository.interface";

import { prisma } from "../repository/prisma";
import { IRestaurent } from "./Interfaces/restaurent.interface";

export class RestaurantControllers implements IRestaurent {
  private repo: IRepository;

  constructor(repo: IRepository) {
    this.repo = repo;
  }

  public async GetRestaurentsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const restaurant = await this.repo.find(prisma.restaurant);
      if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found " });
        return;
      }

      req.responseData = restaurant;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async GetCategoryRestaurantsHandler(
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

      req.responseData = category.restaurants;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Post Request error", 500));
    }
  }
  public async GetUserRestaurantsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await this.repo.findById(prisma.user, userId);
      if (!user) {
        res.status(404).json({ error: "User not found " });
        return;
      }

      req.responseData = user.restaurants;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Post Request error", 500));
    }
  }
  public async CreateRestaurantHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const { name, address, categoryId } = req.body;
      const banner = req.image;

      const user = await this.repo.findById(prisma.user, userId);
      if (!user) {
        res.status(404).json({ error: "User not found Error " });
        return;
      }

      const restaurant = await this.repo.createDocument(prisma.restaurant, {
        owner: {
          connect: { id: userId },
        },
        category: {
          connect: { id: categoryId },
        },
        name,
        address,
        banner,
      });
      if (!restaurant) {
        res.status(404).json({ error: "Creating Restaurant Error " });
        return;
      }

      req.responseData = restaurant;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  }
  public async GetRestaurantByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { restaurantId } = req.params;
      const restaurant = await this.repo.findById(
        prisma.restaurant,
        restaurantId
      );
      if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found " });
        return;
      }

      req.responseData = restaurant;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async UpdateRestaurantByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { restaurantId } = req.params;
      const { ...body } = req.body;
      const restaurant = await this.repo.updateById(
        prisma.restaurant,
        restaurantId,
        {
          body,
        }
      );
      if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found " });
        return;
      }

      req.responseData = restaurant;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async DeleteRestaurantByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { restaurantId } = req.params;
      const deleteRestaurant = await this.repo.deleteById(
        prisma.restaurant,
        restaurantId
      );
      if (!deleteRestaurant) {
        res.status(404).json({ error: "Restaurant not found " });
        return;
      }

      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    } finally {
      delete req.responseData;
    }
  }
  public async QRCodeRestaurentHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { restaurantId } = req.params;

      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
}
