"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing Dependencies
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv")); // For environment variables
dotenv_1.default.config(); // Load .env file
// Importing Implementation Modules
const routes_1 = __importDefault(require("../routers/routes")); // API routes
const error_controllers_1 = require("../controllers/error.controllers");
// CORS Configuration
const corsOptions = {
    credentials: true, // Allow credentials such as cookies or authorization headers
    origin: "*", // Allow all origins (can be restricted for production)
};
const app = (0, express_1.default)(); // Create Express application
// Global Middlewares Setup
app.use(express_1.default.json()); // Parse JSON payloads
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)()); // Parse cookies
app.use((0, cors_1.default)(corsOptions)); // Enable CORS with the specified options
app.enable("trust proxy"); // Trust reverse proxy (useful for load balancers)
app.use((0, morgan_1.default)("dev")); // Log HTTP requests (tiny format for concise logs)
app.disable("x-powered-by"); // Security: Disable the "X-Powered-By" header
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// API Routes Middleware
app.use("/api", routes_1.default); // Route all "/api" requests to the router
// Route to serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
// Error Handle Middlewares
// Handle Not Found Errors
app.use(error_controllers_1.ErrorControllers.NotFoundHandler);
// Handle Application Errors
app.use(error_controllers_1.ErrorControllers.GlobalErrorHandler);
exports.default = app;
