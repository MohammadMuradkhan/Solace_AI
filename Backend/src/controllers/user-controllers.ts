import { NextFunction, Request, Response } from "express";
import User from "../Models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token_manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already exists");

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.clearCookie(COOKIE_NAME);

    const token = createToken(user._id.toString(), user.email, "7d");

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/", // ensures cookie is available everywhere
    });

    return res.status(201).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).send("User does not exist");
    }

    const isPasswordCorrect = await compare(password, user.password);

    console.log("Entered password:", password);
    console.log("Stored hash:", user.password);
    console.log("Match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log("Password mismatch");
      return res.status(403).send("Incorrect Password");
    }

    res.clearCookie(COOKIE_NAME);

    const token = createToken(user._id.toString(), user.email, "7d");

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/", // ensures cookie is available everywhere,written  again for reminding
    });

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).send("User does not exist OR Token malfunctioned");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permission didn't match");
    }

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const UserLogout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).send("User does not exist OR Token malfunctioned");
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permission didn't match");
    }

    res.clearCookie(COOKIE_NAME);

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
