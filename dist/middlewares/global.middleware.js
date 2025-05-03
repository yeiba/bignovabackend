"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalMiddlewares = void 0;
const utils_1 = require("../utils/utils");
const AppError_1 = require("../utils/AppError");
class GlobalMiddlewares {
    constructor(repo) {
        this.requiredFieldsMap = {
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
        this.repo = repo;
    }
    ValidationHandler(action) {
        return (req, res, next) => {
            const requiredFields = this.requiredFieldsMap[action];
            if (!requiredFields) {
                res.status(400).json({ error: "Invalid action specified" });
                return;
            }
            const bodyKeys = Object.keys(req.body);
            const missingFields = requiredFields.filter((field) => !bodyKeys.includes(field));
            const unexpectedFields = bodyKeys.filter((field) => !requiredFields.includes(field));
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
    UploadImageHandler(key) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileData = req.body[key];
                if (!fileData) {
                    // throw new AppError(`Missing file(s) for key "${key}"`, 400);
                    return next();
                }
                const uploadFile = (file, index) => __awaiter(this, void 0, void 0, function* () {
                    const filename = `${Date.now()}_${index !== null && index !== void 0 ? index : ""}_${file.originalname || "file"}`;
                    const path = `${key}/${filename}`;
                    const { data, error } = yield utils_1.Utilities.supaBaseClient()
                        .storage.from("bignova")
                        .upload(path, file, { upsert: true });
                    if (error)
                        throw new AppError_1.AppError(`Upload failed: ${error.message}`, 500);
                    return utils_1.Utilities.supaBaseClient()
                        .storage.from("bignova")
                        .getPublicUrl(data.path).data.publicUrl;
                });
                switch (key) {
                    case "image":
                        req.image = {
                            imageUrl: yield uploadFile(fileData),
                            altText: "",
                        };
                        break;
                    case "images":
                        req.images = yield Promise.all(fileData.map((img, i) => uploadFile(img, i).then((url) => ({
                            imageUrl: url,
                            altText: "",
                        }))));
                        break;
                    case "avatar":
                        req.avatar = {
                            imageUrl: yield uploadFile(fileData),
                            altText: "",
                        };
                        break;
                    case "banner":
                        req.banner = {
                            imageUrl: yield uploadFile(fileData),
                            altText: "",
                        };
                        break;
                    default:
                        throw new AppError_1.AppError("Invalid upload key", 400);
                }
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Failed to upload image(s)", 500));
            }
        });
    }
    DeleteRelatedImagesHandler() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = req.responseData;
                if (!responseData) {
                    return next(); // Nothing to delete
                }
                const imageUrls = yield utils_1.Utilities.extractImageUrls(responseData);
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
                const { error } = yield utils_1.Utilities.supaBaseClient()
                    .storage.from("bignova")
                    .remove(filePaths.filter((path) => path !== null));
                if (error) {
                    console.warn("Failed to delete one or more images:", error.message);
                }
                next();
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Failed to delete images", 500));
            }
        });
    }
    ResponseHandler(operation) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseBody = req.responseData
                    ? {
                        message: `${operation} successfully`,
                        data: req.responseData,
                    }
                    : {
                        message: `${operation} successfully`,
                    };
                res.status(200).json(Object.assign({}, responseBody));
            }
            catch (error) {
                next(new AppError_1.AppError(error.message || "Post Request error", 500));
            }
        });
    }
}
exports.GlobalMiddlewares = GlobalMiddlewares;
//# sourceMappingURL=global.middleware.js.map