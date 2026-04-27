import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    const content = inputRef.current?.value;

    //  empty message protection
    if (!content || content.trim() === "") return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const chatData = await sendChatRequest(content);

      console.log("SEND RESPONSE:", chatData);

      if (Array.isArray(chatData)) {
        setChatMessages(chatData);
      } else if (Array.isArray(chatData?.chats)) {
        setChatMessages(chatData.chats);
      } else {
        console.warn("Invalid send response:", chatData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Message failed");
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });

      await deleteUserChats();

      setChatMessages([]);

      toast.success("Chats Deleted Successfully", {
        id: "deletechats",
      });
    } catch (error) {
      console.log(error);
      toast.error("Chat Deletion Failed", {
        id: "deletechats",
      });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });

      getUserChats()
        .then((data) => {
          console.log("CHAT DATA:", data);

          //  STRICT SAFE CHECK
          if (Array.isArray(data)) {
            setChatMessages(data);
          } else if (Array.isArray(data?.chats)) {
            setChatMessages(data.chats);
          } else {
            console.warn("Invalid chat data:", data);
            setChatMessages([]); // fallback
          }

          toast.success("Chats loaded", { id: "loadchats" });
        })

        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth]);

  const name = auth?.user?.name || "";
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      {/* LEFT PANEL */}
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
            p: 1.4,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "#FC2288",
              fontWeight: 700,
            }}
          >
            {initials || "U"}
          </Avatar>

          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You're now talking to Solace AI
          </Typography>

          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 1, p: 3 }}>
            Feel free to share your thoughts and feelings openly—this is a safe
            space where you can express yourself without fear of judgment, but
            please avoid sharing sensitive personal data.
          </Typography>

          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              letterSpacing: "2",
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 2,
          ml: 3,
        }}
      >
        {/* CHAT AREA */}
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 5,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
          }}
        >
          {chatMessages?.map((chat, index) => {
            if (!chat || !chat.content) return null;

            return (
              <ChatItem key={index} content={chat.content} role={chat.role} />
            );
          })}
        </Box>

        {/* INPUT */}
        <div
          style={{
            width: "100%",
            borderRadius: 30,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Message SolaceAI"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "20px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />

          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 4 }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
