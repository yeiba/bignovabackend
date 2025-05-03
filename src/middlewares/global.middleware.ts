import { Request, Response, NextFunction } from "express";

import { IRepository } from "../repository/repository.interface";
import { validate as uuidValidate } from "uuid";
import { Utilities } from "../utils/utils";
import { AppError } from "../utils/AppError";

export class GlobalMiddlewares {
  private repo: IRepository;

  constructor(repo: IRepository) {
    this.repo = repo;
  }
  private requiredFieldsMap: Record<string, string[]> = {
    register: ["name", "email", "password", "avater"],
    updateUser: ["name", "email", "password", "avater"],
    login: ["email", "password"],
    OAuthlogin: ["email"],
    createCategory: ["name", "description", "image"],
    updateCategory: ["name", "description", "image"],
    createRestaurent: ["name", "address", "banner", "categoryId"],
    updateRestaurent: ["name", "address", "banner", "categoryId"],
    createMenu: ["name"],
    updateMenu: ["name"],
    createDish: ["name", "description", "price", "images", "categoryId"],
    updateDish: ["name", "description", "price", "images", "categoryId"],
  };
  public ValidationHandler(action: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const requiredFields = this.requiredFieldsMap[action];

      if (!requiredFields) {
        res.status(400).json({ error: "Invalid action specified" });
        return;
      }

      const bodyKeys = Object.keys(req.body);
      const missingFields = requiredFields.filter(
        (field) => !bodyKeys.includes(field)
      );
      const unexpectedFields = bodyKeys.filter(
        (field) => !requiredFields.includes(field)
      );

      // if (missingFields.length > 0) {
      //   res.status(400).json({
      //     error: `Missing required fields: ${missingFields.join(", ")}`,
      //   });
      //   return;
      // }

      if (unexpectedFields.length > 0) {
        res.status(400).json({
          error: `Unexpected fields provided: ${unexpectedFields.join(", ")}`,
        });
        return;
      }
      next();
    };
  }
  public UploadImageHandler(key: "image" | "images" | "avatar" | "banner") {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const fileData = req.body[key];

        if (!fileData) {
          // throw new AppError(`Missing file(s) for key "${key}"`, 400);
          return next();
        }

        const uploadFile = async (file: any, index?: number) => {
          const filename = `${Date.now()}_${index ?? ""}_${
            file.originalname || "file"
          }`;
          const path = `${key}/${filename}`;

          const { data, error } = await Utilities.supaBaseClient()
            .storage.from("bignova")
            .upload(path, file, { upsert: true });

          if (error) throw new AppError(`Upload failed: ${error.message}`, 500);
          return Utilities.supaBaseClient()
            .storage.from("bignova")
            .getPublicUrl(data.path).data.publicUrl;
        };

        switch (key) {
          case "image":
            req.image = {
              imageUrl: await uploadFile(fileData),
              altText: "",
            };
            break;

          case "images":
            req.images = await Promise.all(
              fileData.map((img: any, i: number) =>
                uploadFile(img, i).then((url) => ({
                  imageUrl: url,
                  altText: "",
                }))
              )
            );
            break;

          case "avatar":
            req.avatar = {
              imageUrl: await uploadFile(fileData),
              altText: "",
            };
            break;

          case "banner":
            req.banner = {
              imageUrl: await uploadFile(fileData),
              altText: "",
            };
            break;

          default:
            throw new AppError("Invalid upload key", 400);
        }

        next();
      } catch (error: any) {
        next(new AppError(error.message || "Failed to upload image(s)", 500));
      }
    };
  }
  public DeleteRelatedImagesHandler() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const responseData = req.responseData;

        if (!responseData) {
          return next(); // Nothing to delete
        }

        const imageUrls: string[] = await Utilities.extractImageUrls(
          responseData
        );

        if (!imageUrls || imageUrls.length === 0) {
          return next(); // No images to delete
        }

        // Extract storage paths from full URLs
        const filePaths = imageUrls
          .map((url) => {
            const parts = url.split("/storage/v1/object/public/bignova/");
            return parts[1] || null;
          })
          .filter(Boolean);

        if (filePaths.length === 0) {
          return next(); // No valid paths to delete
        }

        const { error } = await Utilities.supaBaseClient()
          .storage.from("bignova")
          .remove(filePaths.filter((path): path is string => path !== null));

        if (error) {
          console.warn("Failed to delete one or more images:", error.message);
        }

        next();
      } catch (error: any) {
        next(new AppError(error.message || "Failed to delete images", 500));
      }
    };
  }
  public ResponseHandler(operation?: string) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const responseBody = req.responseData
          ? {
              message: `${operation} successfully`,
              data: req.responseData,
            }
          : {
              message: `${operation} successfully`,
            };

        res.status(200).json({ ...responseBody });
      } catch (error: any) {
        next(new AppError(error.message || "Post Request error", 500));
      }
    };
  }
}
