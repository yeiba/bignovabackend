import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
export default {
  PORT: process.env.PORT as string,
  FRONTEND_API_KEY: process.env.FRONTEND_API_KEY as string,
  NODE_ENV: process.env.NODE_ENV as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  SUPABASE_BUCKET_URL: process.env.SUPABASE_BUCKET_URL as string,
  ANON_KEY: process.env.ANON_KEY as string,
};
