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

// import { Request, Response } from "express";
// import User from "../Models/User.js";
// import Groq from "groq-sdk";
// import { loadPDFChunks, getRelevantChunks } from "../utils/pdfHelper.js";

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

//     // Load PDF chunks
//     const chunks = await loadPDFChunks();
//     const relevantChunks = getRelevantChunks(chunks, userMessage);


// console.log("🧠 USER QUERY:", userMessage);
// console.log("📄 MATCHED PDF CHUNKS:", relevantChunks);

//     const context = relevantChunks.join("\n");

//     // Prepare chat history
//     const chats = user.chats.map(({ role, content }) => ({
//       role,
//       content,
//     }));

//     // System prompt with PDF context
//     chats.push({
//       role: "system",
//       content: `You are a helpful mental health assistant.

// Use the following context from a mental health guide:

// ${context}

// If the answer is not in the context, answer normally.`,
//     });

//     chats.push({
//       role: "user",
//       content: userMessage,
//     });

//     // Groq client
//     const groq = new Groq({
//       apiKey: process.env.GROQ_API_KEY,
//     });

//     const response = await groq.chat.completions.create({
//       // model: "llama-3.1-8b-instant",
//       model: "openai/gpt-oss-20b",
//       messages: chats as any,
//     });

//     const assistantMessage = {
//       role: "assistant",
//       content: response.choices[0].message.content || "",
//     };

//     // Save chat
//     user.chats.push({ role: "user", content: userMessage });
//     user.chats.push(assistantMessage);

//     await user.save();

//     // return res.status(200).json({
//     //   chats: user.chats,
//     // });
//     return res.status(200).json({
//   chats: user.chats,
//   debug: {
//     usedPDF: relevantChunks.length > 0,
//     matchedChunks: relevantChunks,
//   },
// });
//   } catch (error: any) {
//     console.log(error);

//     if (error.code === "insufficient_quota") {
//       return res.status(429).json({
//         message: "Groq quota exceeded",
//       });
//     }

//     return res.status(500).json({
//       message: "Server error",
//       cause: error.message,
//     });
//   }
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









//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // working version with only mental health relevant questions answered.
//personal questions not answered still. 
// import { Request, Response } from "express";
// import User from "../Models/User.js";
// import Groq from "groq-sdk";
// import { loadPDFChunks, getRelevantChunks } from "../utils/pdfHelper.js";

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

//     // Groq client
//     const groq = new Groq({
//       apiKey: process.env.GROQ_API_KEY,
//     });

//     // Check whether the query is relevant
//     const relevanceCheck = await groq.chat.completions.create({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a strict relevance classifier for a mental health assistant.

// Your ONLY task is to decide whether the user's message is clearly related to
// mental health, emotional wellbeing, emotional support, or personal emotional
// problems.

// Return ONLY:
// YES
// or
// NO

// Return YES for queries related to:
// - mental health
// - emotions
// - anxiety
// - depression
// - stress
// - sadness
// - loneliness
// - emotional wellbeing
// - emotional support
// - relationships and emotional problems
// - coping with difficult situations
// - self-esteem
// - confidence
// - personal emotional struggles
// - grief
// - trauma
// - panic
// - fear
// - overthinking
// - burnout
// - motivation related to emotional wellbeing
// - therapy or counseling

// Return NO for anything unrelated, including:
// - general knowledge
// - science
// - history
// - geography
// - computers
// - programming
// - coding
// - mathematics
// - technology
// - jokes
// - entertainment
// - sports
// - news
// - unrelated school questions

// Examples:

// "Who invented the computer?" -> NO
// "What is C++?" -> NO
// "What is the capital of France?" -> NO
// "How does a CPU work?" -> NO
// "Write me a Python program" -> NO
// "Tell me a joke" -> NO
// "What is 2 + 2?" -> NO
// "How do I learn React?" -> NO

// "I feel very stressed about exams" -> YES
// "I feel lonely" -> YES
// "I am anxious about my future" -> YES
// "How can I deal with stress?" -> YES
// "I am feeling sad today" -> YES
// "I am having problems in my relationship" -> YES
// "I keep overthinking everything" -> YES
// "I don't feel motivated and feel emotionally exhausted" -> YES

// IMPORTANT:
// - Be strict.
// - When the message is clearly unrelated to mental health, return NO.
// - Do NOT answer the user's question.
// - Do NOT explain your decision.
// - Return ONLY YES or NO.
//           `,
//         },
//         {
//           role: "user",
//           content: userMessage,
//         },
//       ],
//     });

//     const relevanceResult =
//       relevanceCheck.choices[0].message.content?.trim().toUpperCase();

//     const isRelevant = relevanceResult === "YES";

//     console.log("🔍 USER QUERY:", userMessage);
//     console.log("🔍 RELEVANCE RESULT:", relevanceResult);
//     console.log("✅ IS RELEVANT:", isRelevant);

//     // Reject irrelevant queries
//     if (!isRelevant) {
//       user.chats.push({
//         role: "user",
//         content: userMessage,
//       });

//       user.chats.push({
//         role: "assistant",
//         content:
//           "I'm here to help with mental health and emotional wellbeing related topics. Please ask me something related to that.",
//       });

//       await user.save();

//       return res.status(200).json({
//         chats: user.chats,
//       });
//     }

//     // Load PDF chunks
//     const chunks = await loadPDFChunks();

//     // Try to find relevant information in the PDF.
//     // PDF context is optional; it should not block a valid mental-health query.
//     const relevantChunks = getRelevantChunks(chunks, userMessage);

//     console.log("🧠 USER QUERY:", userMessage);
//     console.log("📄 MATCHED PDF CHUNKS:", relevantChunks);

//     const context =
//       relevantChunks.length > 0
//         ? relevantChunks.join("\n")
//         : "No directly relevant information was found in the mental health guide.";

//     // Prepare chat history
//     const chats = user.chats.map(({ role, content }) => ({
//       role,
//       content,
//     }));

//     // System prompt
//     chats.push({
//       role: "system",
//       content: `You are SolaceAI, a helpful mental health and emotional wellbeing assistant.

// You MUST only answer questions related to:
// - mental health
// - emotional wellbeing
// - emotions
// - anxiety
// - stress
// - depression
// - sadness
// - loneliness
// - relationships and emotional problems
// - coping with difficult situations
// - self-esteem
// - confidence
// - grief
// - trauma
// - panic
// - fear
// - overthinking
// - burnout
// - therapy and counseling
// - other closely related emotional or psychological concerns

// The user has already been checked by a relevance classifier and their query is considered mental-health related.

// Use the following context from the mental health guide when it is relevant:

// ${context}

// IMPORTANT:
// - If the provided context is relevant, use it to make your answer more useful.
// - The PDF context is supplementary knowledge, not a requirement.
// - If the PDF does not contain enough information, you may use your general knowledge, but ONLY for mental health and emotional wellbeing topics.
// - Never answer unrelated questions about programming, computers, mathematics, science, history, geography, entertainment, sports, or general knowledge.
// - Be supportive, empathetic, clear, and concise.
// - Do not claim to be a doctor or mental health professional.
// - If the user appears to be in immediate danger or at risk of harming themselves or others, encourage them to contact local emergency services or a trusted person/professional immediately.`,
//     });

//     chats.push({
//       role: "user",
//       content: userMessage,
//     });

//     // Generate final answer
//     const response = await groq.chat.completions.create({
//       model: "openai/gpt-oss-20b",
//       messages: chats as any,
//     });

//     const assistantMessage = {
//       role: "assistant",
//       content: response.choices[0].message.content || "",
//     };

//     // Save chat
//     user.chats.push({
//       role: "user",
//       content: userMessage,
//     });

//     user.chats.push(assistantMessage);

//     await user.save();

//     return res.status(200).json({
//       chats: user.chats,
//       debug: {
//         usedPDF: relevantChunks.length > 0,
//         matchedChunks: relevantChunks,
//       },
//     });
//   } catch (error: any) {
//     console.log(error);

//     if (error.code === "insufficient_quota") {
//       return res.status(429).json({
//         message: "Groq quota exceeded",
//       });
//     }

//     return res.status(500).json({
//       message: "Server error",
//       cause: error.message,
//     });
//   }
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

//     return res.status(200).json({
//       message: "OK",
//     });
//   } catch (error: any) {
//     console.log(error);

//     return res.status(500).json({
//       message: "ERROR",
//       cause: error.message,
//     });
//   }
// };










//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// // working version with only mental health relevant questions answered and personal questions answered as well.
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

    // --------------------------------------------------
    // Handle simple personal/account-related questions
    // --------------------------------------------------

    const lowerMessage = userMessage.toLowerCase().trim();

    // const nameQuestions = [
    //   "what is my name",
    //   "what's my name",
    //   "whats my name",
    //   "tell me my name",
    //   "do you know my name",
    //   "do you remember my name",
    //   "who am i",
    // ];
    

    // const isNameQuestion = nameQuestions.some(
    //   (question) => lowerMessage === question
    // );

    const nameQuestions = [
  "what is my name",
  "what's my name",
  "whats my name",
  "tell me my name",
  "do you know my name",
  "do you remember my name",
  "who am i",
  "who am i?",
  "who is me",
  "who is me?",
  "tell me who i am",
  "can you tell me my name",
];

const isNameQuestion = nameQuestions.includes(lowerMessage);

    if (isNameQuestion) {
      const assistantMessage = {
        role: "assistant" as const,
        content: `Your name is ${user.name}.`,
      };

      user.chats.push({
        role: "user",
        content: userMessage,
      });

      user.chats.push(assistantMessage);

      await user.save();

      return res.status(200).json({
        chats: user.chats,
      });
    }

    // --------------------------------------------------
    // Groq client
    // --------------------------------------------------

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // --------------------------------------------------
    // Check whether the query is relevant
    // --------------------------------------------------

    const relevanceCheck = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are a strict relevance classifier for a mental health assistant.

Your ONLY task is to decide whether the user's message is clearly related to
mental health, emotional wellbeing, emotional support, or personal emotional
problems.

Return ONLY:
YES
or
NO

Return YES for queries related to:
- mental health
- emotions
- anxiety
- depression
- stress
- sadness
- loneliness
- emotional wellbeing
- emotional support
- relationships and emotional problems
- coping with difficult situations
- self-esteem
- confidence
- personal emotional struggles
- grief
- trauma
- panic
- fear
- overthinking
- burnout
- motivation related to emotional wellbeing
- therapy or counseling

Return NO for anything unrelated, including:
- general knowledge
- science
- history
- geography
- computers
- programming
- coding
- mathematics
- technology
- jokes
- entertainment
- sports
- news
- unrelated school questions

Examples:

"Who invented the computer?" -> NO
"What is C++?" -> NO
"What is the capital of France?" -> NO
"How does a CPU work?" -> NO
"Write me a Python program" -> NO
"Tell me a joke" -> NO
"What is 2 + 2?" -> NO
"How do I learn React?" -> NO

"I feel very stressed about exams" -> YES
"I feel lonely" -> YES
"I am anxious about my future" -> YES
"How can I deal with stress?" -> YES
"I am feeling sad today" -> YES
"I am having problems in my relationship" -> YES
"I keep overthinking everything" -> YES
"I don't feel motivated and feel emotionally exhausted" -> YES

IMPORTANT:
- Be strict.
- When the message is clearly unrelated to mental health, return NO.
- Do NOT answer the user's question.
- Do NOT explain your decision.
- Return ONLY YES or NO.
          `,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const relevanceResult =
      relevanceCheck.choices[0].message.content?.trim().toUpperCase();

    const isRelevant = relevanceResult === "YES";

    console.log("🔍 USER QUERY:", userMessage);
    console.log("🔍 RELEVANCE RESULT:", relevanceResult);
    console.log("✅ IS RELEVANT:", isRelevant);

    // --------------------------------------------------
    // Reject irrelevant queries
    // --------------------------------------------------

    if (!isRelevant) {
      user.chats.push({
        role: "user",
        content: userMessage,
      });

      user.chats.push({
        role: "assistant",
        content:
          "I'm here to help with mental health and emotional wellbeing related topics. Please ask me something related to that.",
      });

      await user.save();

      return res.status(200).json({
        chats: user.chats,
      });
    }

    // --------------------------------------------------
    // Load PDF chunks
    // --------------------------------------------------

    const chunks = await loadPDFChunks();

    const relevantChunks = getRelevantChunks(
      chunks,
      userMessage
    );

    console.log("🧠 USER QUERY:", userMessage);
    console.log("📄 MATCHED PDF CHUNKS:", relevantChunks);

    const context =
      relevantChunks.length > 0
        ? relevantChunks.join("\n")
        : "No directly relevant information was found in the mental health guide.";

    // --------------------------------------------------
    // Prepare chat history
    // --------------------------------------------------

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));

    // --------------------------------------------------
    // System prompt
    // --------------------------------------------------

    chats.push({
      role: "system",
      content: `You are SolaceAI, a helpful mental health and emotional wellbeing assistant.

You MUST only answer questions related to:
- mental health
- emotional wellbeing
- emotions
- anxiety
- stress
- depression
- sadness
- loneliness
- relationships and emotional problems
- coping with difficult situations
- self-esteem
- confidence
- grief
- trauma
- panic
- fear
- overthinking
- burnout
- therapy and counseling
- other closely related emotional or psychological concerns

The user's query has already been checked and classified as mental-health related.

Use the following context from the mental health guide when it is relevant:

${context}

IMPORTANT:
- If the provided context is relevant, use it to make your answer more useful.
- The PDF context is supplementary knowledge, not a requirement.
- If the PDF does not contain enough information, you may use your general knowledge, but ONLY for mental health and emotional wellbeing topics.
- Never answer unrelated questions about programming, computers, mathematics, science, history, geography, entertainment, sports, or general knowledge.
- Be supportive, empathetic, clear, and concise.
- Do not claim to be a doctor or mental health professional.
- If the user appears to be in immediate danger or at risk of harming themselves or others, encourage them to contact local emergency services or a trusted person/professional immediately.`,
    });

    chats.push({
      role: "user",
      content: userMessage,
    });

    // --------------------------------------------------
    // Generate final answer
    // --------------------------------------------------

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: chats as any,
    });

    const assistantMessage = {
      role: "assistant" as const,
      content: response.choices[0].message.content || "",
    };

    // --------------------------------------------------
    // Save chat
    // --------------------------------------------------

    user.chats.push({
      role: "user",
      content: userMessage,
    });

    user.chats.push(assistantMessage);

    await user.save();

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

    return res.status(200).json({
      message: "OK",
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      message: "ERROR",
      cause: error.message,
    });
  }
};