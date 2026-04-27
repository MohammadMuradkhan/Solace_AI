import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constants.js";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[COOKIE_NAME];

  console.log("Cookies:", req.cookies); 

  if (!token) {
    return res.status(401).send("No token found");
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!);

    res.locals.jwtData = data;

    return next();
  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
};