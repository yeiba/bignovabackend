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
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv")); // For environment variables
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config(); // Load .env file
const config_1 = __importDefault(require("../config"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
// Importing Implementation Modules
const routes_1 = __importDefault(require("../routers/routes")); // API routes
const error_controllers_1 = require("../controllers/error.controllers");
// CORS Configuration
const corsOptions = {
    credentials: true, // Allow credentials such as cookies or authorization headers
    origin: "*", // Allow all origins (can be restricted for production)
};
const app = (0, express_1.default)(); // Create Express application
app.use((0, express_session_1.default)({
    secret: config_1.default.SESSION_SECRET || "2eZW33xAQBIZofWK5",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    },
    store: connect_mongo_1.default.create({
        mongoUrl: config_1.default.DATABASE_URL,
        collectionName: "sessions",
        ttl: 60 * 60, // 1 hour
    }),
}));
// Global Middlewares Setup
app.use((0, helmet_1.default)()); // add security headers
app.use(express_1.default.json({ limit: "10kb" })); // Parse JSON payloads
app.use((0, express_mongo_sanitize_1.default)()); // Sanitize json request from nosql query or parameter injection attack
app.use((0, xss_clean_1.default)()); // xss sanitize any request input from malicious HTML code
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)()); // Parse cookies
app.use((0, cors_1.default)(corsOptions)); // Enable CORS with the specified options
app.enable("trust proxy"); // Trust reverse proxy (useful for load balancers)
app.use((0, morgan_1.default)("dev")); // Log HTTP requests (tiny format for concise logs)
const PUBLIC_DIR = path_1.default.join(__dirname, "..", "..", "public");
app.use(express_1.default.static(PUBLIC_DIR));
app.use((req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (config_1.default.NODE_ENV === "production" && apiKey !== config_1.default.FRONTEND_API_KEY) {
        res.status(403).json({ message: "Forbidden" });
    }
    next();
    console.log(config_1.default.NODE_ENV);
});
// API Routes Middleware
app.use("/api", routes_1.default); // Route all "/api" requests to the router
// Route to serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(PUBLIC_DIR, "index.html"));
});
// Error Handle Middlewares
// Handle Not Found Errors
app.use(error_controllers_1.ErrorControllers.NotFoundHandler);
// Handle Application Errors
app.use(error_controllers_1.ErrorControllers.GlobalErrorHandler);
exports.default = app;
//# sourceMappingURL=expressApp.js.map