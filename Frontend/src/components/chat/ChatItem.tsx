import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const auth = useAuth();

  // SAFE NAME HANDLING
  const name = auth?.user?.name || "";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)     // removes undefined
    .slice(0, 2)
    .join("");

  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 2,
        my: 2,
        gap: 2,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "#020122" }}>
        <img src="Favicon.png" alt="solaceai" width={"30px"} />
      </Avatar>

      <Box>
        <Typography fontSize={"20px"} color={"#ECECEA"}>
          {content}
        </Typography>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#004d5612",
        p: 2,
        gap: 2,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "#FC2288", color: "white" }}>
        {initials || "U"} {/*fallback */}
      </Avatar>

      <Box>
        <Typography fontSize={"20px"}>{content}</Typography>
      </Box>
    </Box>
  );
};

export default ChatItem;