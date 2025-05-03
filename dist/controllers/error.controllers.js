"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorControllers = void 0;
const AppError_1 = require("../utils/AppError");
const config_1 = __importDefault(require("../config"));
class ErrorControllers {
    /** Formats an error response object with improved readability */
    static formatError(err, req) {
        var _a;
        const isProduction = config_1.default.NODE_ENV === "production";
        // Format stack trace as an array of lines for better readability
        const stackLines = (_a = err.stack) === null || _a === void 0 ? void 0 : _a.split("\n").map((line) => line.trim());
        return {
            success: false,
            error: {
                message: err.message,
                code: err.errorCode || "INTERNAL_SERVER_ERROR",
                statusCode: err.statusCode,
                details: isProduction ? undefined : err.details,
                path: req.originalUrl,
                method: req.method,
                requestId: req.headers["x-request-id"],
                correlationId: req.headers["x-correlation-id"],
                // Only include stack in non-production and as an array of lines
                stack: isProduction ? undefined : stackLines,
            },
            timestamp: new Date().toISOString(),
        };
    }
    /** Enhanced error logging with color coding and better formatting */
    static logError(err, req) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            message: err.message,
            errorCode: err.errorCode,
            statusCode: err.statusCode,
            path: req.originalUrl,
            method: req.method,
            requestId: req.headers["x-request-id"],
            correlationId: req.headers["x-correlation-id"],
        };
        // Color coding for console errors (red for production errors, yellow for others)
        const colorStart = err.statusCode >= 500 ? "\x1b[31m" : "\x1b[33m"; // Red for 500s, Yellow for others
        const colorEnd = "\x1b[0m";
        console.error(`${colorStart}ERROR: [${errorInfo.errorCode}] ${errorInfo.message}${colorEnd}`);
        console.error(JSON.stringify(errorInfo, null, 2));
        // Log detailed request information separately for debugging
        if (!config_1.default.NODE_ENV || config_1.default.NODE_ENV === "development") {
            console.error("Request Details:", {
                body: req.body,
                query: req.query,
                params: req.params,
                headers: req.headers,
            });
            // Log stack trace in a more readable format
            if (err.stack) {
                console.error("Stack Trace:");
                err.stack
                    .split("\n")
                    .forEach((line) => console.error("  " + line.trim()));
            }
        }
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
            : new AppError_1.AppError(err.message || "An error occurred", err.statusCode || 500, err.code || "INTERNAL_SERVER_ERROR");
        // Add request headers for tracking if available
        if (req.headers["x-request-id"] && !appError.details) {
            appError.details = { requestId: req.headers["x-request-id"] };
        }
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
//# sourceMappingURL=error.controllers.js.map