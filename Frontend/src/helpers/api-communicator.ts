import axios from "axios";

//  Creating a dedicated axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ================= USER =================

export const signupUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await API.post("/user/signup", { name, email, password });

  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }

  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/user/login", { email, password });

  if (res.status !== 200) {
    throw new Error("Unable to login");
  }

  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await API.get("/user/auth-status");

  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }

  return res.data;
};

export const logoutUser = async () => {
  const res = await API.get("/user/logout");

  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }

  return res.data;
};

// ================= CHAT =================

export const sendChatRequest = async (message: string) => {
  const res = await API.post("/chat/new", { message });

  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }

  return res.data;
};

export const getUserChats = async () => {
  const res = await API.get("/chat/all-chats");

  if (res.status !== 200) {
    throw new Error("Unable to fetch chats");
  }

  return res.data;
};

export const deleteUserChats = async () => {
  const res = await API.delete("/chat/delete");

  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }

  return res.data;
};
