import { Request, Response } from "express";

export function logger(req: Request, res: Response, next) {
    console.log(req.url);
    next();
  };