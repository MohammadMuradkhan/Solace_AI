import React, { useEffect } from 'react';
import { Box, Typography, Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      toast.loading("Signing Up!", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Signed Up Successfully!", { id: "signup" });
      navigate("/chat"); // ✅ important
    } catch (error) {
      console.log(error);
      toast.error("Signing Up Failed!", { id: "signup" });
    }
  };

  useEffect(() => {
    if (auth?.user) navigate("/chat");
  }, [auth, navigate]);

  return (
    <Box width="100%" height="100%" display="flex">
      <Box padding={8} display={{ md: "flex", xs: "none" }}>
        <img src="AiChatbot.png" alt="AI Chatbot" style={{ width: "400px" }} />
      </Box>

      <Box display="flex" flex={1} justifyContent="center" padding={2}>
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
          }}
        >
          <Box display="flex" flexDirection="column">
            <Typography variant="h4" textAlign="center" padding={2}>
              Signup
            </Typography>

            <CustomizedInput name="name" label="Name" />
            <CustomizedInput name="email" label="Email" />
            <CustomizedInput name="password" label="Password" type="password" />

            <Button
              type="submit"
              sx={{
                mt: 2,
                width: "400px",
                bgcolor: "#F22C8F",
                color: "white",
                ":hover": { bgcolor: "#F566AD" },
              }}
            >
              Signup
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;