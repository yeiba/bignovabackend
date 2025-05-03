"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorControllers = void 0;
const AppError_1 = require("../utils/AppError");
const config_1 = __importDefault(require("../config"));
class ErrorControllers {
    /** Formats an error response object */
    static formatError(err, req) {
        const isProduction = config_1.default.NODE_ENV === "production";
        return {
            success: false,
            message: err.message,
            statusCode: err.statusCode,
            errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
            details: isProduction ? undefined : err.details,
            stack: isProduction ? undefined : err.stack,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method,
            requestId: req.headers["x-request-id"],
            correlationId: req.headers["x-correlation-id"],
        };
    }
    /** Logs error details to the console or a logging service */
    static logError(err, req) {
        console.error({
            timestamp: new Date().toISOString(),
            message: err.message,
            errorCode: err.errorCode,
            stack: err.stack,
            path: req.originalUrl,
            method: req.method,
            requestId: req.headers["x-request-id"],
            correlationId: req.headers["x-correlation-id"],
            body: req.body,
            query: req.query,
            params: req.params,
            headers: req.headers,
        });
    }
    /** Middleware for handling 404 errors */
    static NotFoundHandler(req, res, next) {
        next(new AppError_1.AppError(`URL '${req.originalUrl}' not found`, 404, "RESOURCE_NOT_FOUND"));
    }
    /** Middleware for handling all errors globally */
    static GlobalErrorHandler(err, req, res, next) {
        // Normalize error
        const appError = err instanceof AppError_1.AppError
            ? err
            : new AppError_1.AppError(err.message || "An error occurred", err.statusCode || 500);
        // Log the error
        ErrorControllers.logError(appError, req);
        // Send formatted error response
        const errorResponse = ErrorControllers.formatError(appError, req);
        res.status(appError.statusCode).json(errorResponse);
    }
    /** Wrapper for async route handlers to catch errors */
    static AsyncErrorHandler(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }
}
exports.ErrorControllers = ErrorControllers;
