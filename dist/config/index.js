"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
exports.default = {
    PORT: process.env.PORT,
    FRONTEND_API_KEY: process.env.FRONTEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_BUCKET_URL: process.env.SUPABASE_BUCKET_URL,
    ANON_KEY: process.env.ANON_KEY,
};
//# sourceMappingURL=index.js.map