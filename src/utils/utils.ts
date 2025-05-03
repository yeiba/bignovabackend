import jwt from "jsonwebtoken";
import config from "../config";
import dotenv from "dotenv"; // For environment variables
import mongoose from "mongoose";
import { createClient } from "@supabase/supabase-js";
dotenv.config(); // Load environment variables

const JWT_SECRET = config.JWT_SECRET; // Make sure to keep this secret in production

export class Utilities {
  public static signJwt(payload: object, expiresIn: object) {
    return jwt.sign(payload, JWT_SECRET, expiresIn);
  }
  public static verifyJwt(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
  public static extractImageUrls(obj: any): string[] {
    try {
      const urls: string[] = [];

      function recurse(value: any) {
        if (Array.isArray(value)) {
          for (const item of value) {
            recurse(item);
          }
        } else if (typeof value === "object" && value !== null) {
          for (const [key, val] of Object.entries(value)) {
            if (key === "imageUrl" && typeof val === "string") {
              urls.push(val);
            } else {
              recurse(val);
            }
          }
        }
      }

      recurse(obj);
      return urls;
    } catch (error) {
      return []; // Return null if token verification fails
    }
  }

  public static supaBaseClient() {
    return createClient(config.SUPABASE_BUCKET_URL, config.ANON_KEY);
  }
}
