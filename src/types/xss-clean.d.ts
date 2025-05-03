// src/types/xss-clean.d.ts

declare module "xss-clean" {
  import { RequestHandler } from "express";

  /**
   * XSS Clean middleware for Express
   * Sanitizes user input in req.body, req.query, and req.params
   */
  const xssClean: () => RequestHandler;

  export = xssClean;
}
