import { NextFunction, Request, Response } from "express";
import User from "../Models/User.js";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

export const generateChatCompletion = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({
        message: "User not registered OR Token malfunctioned",
      });
    }

    const userMessage = req.body.message;

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));

    chats.push({
      role: "system",
      content: "You are a helpful mental health assistant.",
    });

    chats.push({ role: "user", content: userMessage });

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const chatResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: chats as any,
    });

    // const assistantMessage = {
    //   role: "assistant",
    //   content: "This is a mock AI response. OpenAI quota exceeded.",
    // };
    const assistantMessage = {
      role: "assistant",
      content: chatResponse.choices[0].message.content,
    };

    user.chats.push({ role: "user", content: userMessage });
    user.chats.push(assistantMessage);

    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error: any) {
    console.log(error);

    if (error.code === "insufficient_quota") {
      return res.status(429).json({
        message: "Groq quota exceeded. Please add billing.",
      });
    }

    return res.status(500).json({
      message: "Server error",
      cause: error.message,
    });
  }
};

export const sendChatsToUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).send("User not registered");
    }

    return res.status(200).json({
      message: "OK",
      chats: user.chats,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};

export const deleteChats = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).send("User not registered");
    }

    user.chats = [];
    await user.save();

    return res.status(200).json({ message: "OK" });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};
