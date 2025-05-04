// Importing Dependencies
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import path from "path";
import dotenv from "dotenv"; // For environment variables
import session from "express-session";
dotenv.config(); // Load .env file
import config from "../config";
import MongoStore from "connect-mongo";
// Importing Implementation Modules
import router from "../routers/routes"; // API routes
import { ErrorControllers } from "../controllers/error.controllers";

// CORS Configuration
const corsOptions = {
  credentials: true, // Allow credentials such as cookies or authorization headers
  origin: "http://localhost:3000", // Allow all origins (can be restricted for production)
};

const app = express(); // Create Express application

app.use(
  session({
    secret: config.SESSION_SECRET || "2eZW33xAQBIZofWK5",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    },
    store: MongoStore.create({
      mongoUrl: config.DATABASE_URL,
      collectionName: "sessions",
      ttl: 60 * 60, // 1 hour
    }),
  })
);

// Global Middlewares Setup
app.use(helmet()); // add security headers
app.use(express.json({ limit: "10kb" })); // Parse JSON payloads
app.use(sanitize()); // Sanitize json request from nosql query or parameter injection attack
app.use(xss()); // xss sanitize any request input from malicious HTML code
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies
app.use(cors(corsOptions)); // Enable CORS with the specified options
app.enable("trust proxy"); // Trust reverse proxy (useful for load balancers)
app.use(morgan("dev")); // Log HTTP requests (tiny format for concise logs)
const PUBLIC_DIR = path.join(__dirname, "..", "public");
app.use(express.static(PUBLIC_DIR));

app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  if (config.NODE_ENV === "production" && apiKey !== config.FRONTEND_API_KEY) {
    res.status(403).json({ message: "Forbidden" });
  }
  next();
  console.log(config.NODE_ENV);
});

// API Routes Middleware
app.use("/api", router); // Route all "/api" requests to the router

// Route to serve the index.html file
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// app.get("/api", (req, res) => {
//   res.json({ message: "Hello from Vercel + Express!" });
// });

// Error Handle Middlewares
// Handle Not Found Errors
app.use(ErrorControllers.NotFoundHandler);

// Handle Application Errors
app.use(ErrorControllers.GlobalErrorHandler);

export default app;
