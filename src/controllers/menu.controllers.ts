import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { IRepository } from "../repository/repository.interface";

import { prisma } from "../repository/prisma";
import { IMenu } from "./Interfaces/menu.interface";

export class MenuControllers implements IMenu {
  private repo: IRepository;

  constructor(repo: IRepository) {
    this.repo = repo;
  }
  public async GetMenusHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const menu = await this.repo.find(prisma.menu);
      if (!menu) {
        res.status(404).json({ error: "Menu not found " });
        return;
      }

      req.responseData = menu;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async GetRestaurentMenusHandler(
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

      req.responseData = restaurant.menus;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Post Request error", 500));
    }
  }
  public async CreateMenuHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { restaurantId } = req.params;
      const { name } = req.body;
      const menu = await this.repo.createDocument(prisma.menu, {
        name,
        restaurant: { connect: { id: restaurantId } },
      });
      if (!menu) {
        res.status(404).json({ error: "Creating Menu Error " });
        return;
      }

      req.responseData = menu;
      next();
    } catch (error: any) {
      next(new AppError(error.message || "Request error", 500));
    }
  }
  public async GetMenuByIdHandler(
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

      req.responseData = menu;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async UpdateMenuByIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { menuId } = req.params;
      const { ...body } = req.body;
      const menu = await this.repo.updateById(prisma.menu, menuId, {
        body,
      });
      if (!menu) {
        res.status(404).json({ error: "Menu not found " });
        return;
      }

      req.responseData = menu;
      next();
    } catch (error: any) {
      next(new AppError(error.message || " Request error", 500));
    }
  }
  public async DeleteMenuHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { menuId } = req.params;
      const deleteMenu = await this.repo.deleteById(prisma.menu, menuId);
      if (!deleteMenu) {
        res.status(401).json({ error: "Menu Not Deleted " });
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
