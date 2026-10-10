import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
  expiresIn: expiresIn as any,
});

  return token;
};

// export const verifyToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // const token = req.signedCookies[`${COOKIE_NAME}`];
//   const token = req.cookies[COOKIE_NAME];
//   if (!token || token.trim() === "") {
//     return res.status(401).json({ message: "Token Not Received" });
//   }
//   return new Promise<void>((resolve, reject) => {
//     return jwt.verify(token, process.env.JWT_SECRET as string, 
//       // (err, success) =>
//       (err: jwt.VerifyErrors | null, success: jwt.JwtPayload | string | undefined) =>
//         {
//       // if (err) {
//       //   reject(err.message);
//       //   return res.status(401).json({ message: "Token Expired" });
//       // }
//       if (err) {
//         resolve();
//         return res.status(401).json({ message: "Token Not Valid" });
//       }
//        else {
//         resolve();
//         res.locals.jwtData = success;
//         return next();
//       }
//     });
//   });
// };

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("Cookie names:", Object.keys(req.cookies || {}));
  // console.log("Expected cookie name:", COOKIE_NAME);

  const token = req.cookies?.[COOKIE_NAME];

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  // jwt.verify(token, process.env.JWT_SECRET as string, (err, success) => {
  //   if (err) {
  //     console.error("JWT verification failed:", err.message);
  //     return res.status(401).json({ message: "Token Not Valid" });
  //   }

  //   res.locals.jwtData = success;
  //   return next();
  // });
  jwt.verify(
  token,
  process.env.JWT_SECRET as string,
  (err: jwt.VerifyErrors | null, success: jwt.JwtPayload | string | undefined) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ message: "Token Not Valid" });
    }

    res.locals.jwtData = success;
    return next();
  });
};