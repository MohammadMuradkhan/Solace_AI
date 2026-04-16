import axios from "axios";

// ✅ MUST be at top (global config)
axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) throw new Error("Unable to login");
  return res.data;
};

export const SignupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201) throw new Error("Unable to Signup");
  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) throw new Error("Unable to authenticate");
  return res.data;
};

export const sendChatRequest = async (message: string) => {
  const res = await axios.post("/chat/new", { message });
  if (res.status !== 200) throw new Error("Unable to send chat");
  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) throw new Error("Unable to fetch chats");
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) throw new Error("Unable to delete chats");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) throw new Error("Unable to Logout");
  return res.data;
};