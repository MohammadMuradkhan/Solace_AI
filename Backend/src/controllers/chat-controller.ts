// import { NextFunction, Request, Response } from "express";
// import User from "../Models/User.js";
// import OpenAI from 'openai';
// import fs from 'fs';
// import pdfParse from 'pdf-parse';
// import path from "path";

// export const generateChatCompletion = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // const pdfPath = '../MentalSupport.pdf'; 
//   const pdfPath = path.join( process.cwd(), "src", "controllers", "MentalSupport.pdf" );

//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user)
//       return res
//         .status(401)
//         .json({ message: "User not registered OR Token malfunctioned" });

//     // Read the PDF file
//     const pdfData = fs.readFileSync(pdfPath);

//     const pdfParse = (await import("pdf-parse")).default; // ✅ FIX
//     const pdfText = await pdfParse(pdfData);

//     // grab chats of user
//     const chats = user.chats.map(({ role, content }) => ({
//       role,
//       content,
//     }));
//     chats.push({ content: pdfText.text, role: "user" });
//     user.chats.push({ content: pdfText.text, role: "user" });

//     // send all chats with new one to OpenAI API
//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     // get latest response
//     const chatResponse = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [],
//     });

//     user.chats.push(chatResponse.choices[0].message);
//     await user.save();
//     return res.status(200).json({ chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

// // Send chats to the user
// export const sendChatsToUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     return res.status(200).json({ message: "OK", chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "ERROR", cause: error.message });
//   }
// };

// // Delete chats
// export const deleteChats = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     user.chats = [];
//     await user.save();
//     return res.status(200).json({ message: "OK" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "ERROR", cause: error.message });
//   }
// };












// -----------------------------------------
// pushed to github with Groq API instead of OpenAI but no MentalSupport.pdf context.





// import { NextFunction, Request, Response } from "express";
// import User from "../Models/User.js";
// import Groq from "groq-sdk";
// import fs from "fs";
// import path from "path";

// export const generateChatCompletion = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).json({
//         message: "User not registered OR Token malfunctioned",
//       });
//     }

//     const userMessage = req.body.message;

//     const chats = user.chats.map(({ role, content }) => ({
//       role,
//       content,
//     }));

//     chats.push({
//       role: "system",
//       content: "You are a helpful mental health assistant.",
//     });

//     chats.push({ role: "user", content: userMessage });


//     const groq = new Groq({
//       apiKey: process.env.GROQ_API_KEY,
//     });

//     const chatResponse = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: chats as any,
//     });





//     // const assistantMessage = {
//     //   role: "assistant",
//     //   content: "This is a mock AI response. OpenAI quota exceeded.",
//     // };
//     const assistantMessage = {
//       role: "assistant",
//       content: chatResponse.choices[0].message.content,
//     };






//     user.chats.push({ role: "user", content: userMessage });
//     user.chats.push(assistantMessage);

//     await user.save();

//     return res.status(200).json({ chats: user.chats });
//   } 

//   catch (error: any) {
//   console.log(error);

//   if (error.code === "insufficient_quota") {
//     return res.status(429).json({
//       message: "Groq quota exceeded. Please add billing.",
//     });
//   }

//   return res.status(500).json({
//     message: "Server error",
//     cause: error.message,
//   });
// }
// };







// export const sendChatsToUser = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const user = await User.findById(res.locals.jwtData.id);

//     if (!user) {
//       return res.status(401).send("User not registered");
//     }

//     return res.status(200).json({
//       message: "OK",
//       chats: user.chats,
//     });
//   } catch (error: any) {
//     console.log(error);
//     return res.status(500).json({
//       message: "ERROR",
//       cause: error.message,
//     });
//   }
// };

// export const deleteChats = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const user = await User.findById(res.locals.jwtData.id);

//     if (!user) {
//       return res.status(401).send("User not registered");
//     }

//     user.chats = [];
//     await user.save();

//     return res.status(200).json({ message: "OK" });
//   } catch (error: any) {
//     console.log(error);
//     return res.status(500).json({
//       message: "ERROR",
//       cause: error.message,
//     });
//   }
// };



// ------------------------

// Groq API integrated with MentalSupport.pdf context.
import { Request, Response } from "express";
import User from "../Models/User.js";
import Groq from "groq-sdk";
import { loadPDFChunks, getRelevantChunks } from "../utils/pdfHelper.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).json({
        message: "User not registered OR Token malfunctioned",
      });
    }

    const userMessage = req.body.message;

    // Load PDF chunks
    const chunks = await loadPDFChunks();
    const relevantChunks = getRelevantChunks(chunks, userMessage);


console.log("🧠 USER QUERY:", userMessage);
console.log("📄 MATCHED PDF CHUNKS:", relevantChunks);

    const context = relevantChunks.join("\n");

    // Prepare chat history
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));

    // System prompt with PDF context
    chats.push({
      role: "system",
      content: `You are a helpful mental health assistant.

Use the following context from a mental health guide:

${context}

If the answer is not in the context, answer normally.`,
    });

    chats.push({
      role: "user",
      content: userMessage,
    });

    // Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: chats as any,
    });

    const assistantMessage = {
      role: "assistant",
      content: response.choices[0].message.content || "",
    };

    // Save chat
    user.chats.push({ role: "user", content: userMessage });
    user.chats.push(assistantMessage);

    await user.save();

    // return res.status(200).json({
    //   chats: user.chats,
    // });
    return res.status(200).json({
  chats: user.chats,
  debug: {
    usedPDF: relevantChunks.length > 0,
    matchedChunks: relevantChunks,
  },
});
  } catch (error: any) {
    console.log(error);

    if (error.code === "insufficient_quota") {
      return res.status(429).json({
        message: "Groq quota exceeded",
      });
    }

    return res.status(500).json({
      message: "Server error",
      cause: error.message,
    });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response
) => {
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

export const deleteChats = async (
  req: Request,
  res: Response
) => {
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