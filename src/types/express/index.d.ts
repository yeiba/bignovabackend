import * as express from "express";
import "express-session";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: any;
      userData?: any;
      responseData?: any;
      image?: any;
      images?: any;
      avatar?: any;
      banner?: any;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    token?: string;
  }
}
