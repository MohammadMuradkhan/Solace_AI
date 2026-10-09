// import { Box, Avatar, Typography } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";

// const ChatItem = ({
//   content,
//   role,
// }: {
//   content: string;
//   role: "user" | "assistant";
// }) => {
//   const auth = useAuth();

//   // SAFE NAME HANDLING
//   const name = auth?.user?.name || "";

//   const initials = name
//     .split(" ")
//     .map((word) => word[0])
//     .filter(Boolean)     // removes undefined
//     .slice(0, 2)
//     .join("");

//   return role === "assistant" ? (
//     <Box
//       sx={{
//         display: "flex",
//         p: 2,
//         my: 2,
//         gap: 2,
//       }}
//     >
//       <Avatar sx={{ ml: "0", bgcolor: "#020122" }}>
//         <img src="Favicon.png" alt="solaceai" width={"30px"} />
//       </Avatar>

//       <Box>
//         <Typography fontSize={"20px"} color={"#ECECEA"}>
//           {content}
//         </Typography>
//       </Box>
//     </Box>
//   ) : (
//     <Box
//       sx={{
//         display: "flex",
//         bgcolor: "#004d5612",
//         p: 2,
//         gap: 2,
//       }}
//     >
//       <Avatar sx={{ ml: "0", bgcolor: "#FC2288", color: "white" }}>
//         {initials || "U"} {/*fallback */}
//       </Avatar>

//       <Box>
//         <Typography fontSize={"20px"}>{content}</Typography>
//       </Box>
//     </Box>
//   );
// };

// export default ChatItem;















// without remark-gfm , text formatting is not properly supported.

// import { Box, Avatar, Typography } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";
// import ReactMarkdown from "react-markdown";

// const ChatItem = ({
//   content,
//   role,
// }: {
//   content: string;
//   role: "user" | "assistant";
// }) => {
//   const auth = useAuth();

//   const name = auth?.user?.name || "";

//   const initials = name
//     .split(" ")
//     .map((word) => word[0])
//     .filter(Boolean)
//     .slice(0, 2)
//     .join("");

//   return role === "assistant" ? (
//     <Box
//       sx={{
//         display: "flex",
//         p: 2,
//         my: 2,
//         gap: 2,
//       }}
//     >
//       <Avatar sx={{ ml: "0", bgcolor: "#020122" }}>
//         <img src="Favicon.png" alt="solaceai" width={"30px"} />
//       </Avatar>

//       <Box
//         sx={{
//           color: "#ECECEA",
//           fontSize: "20px",
//           "& p": { margin: "0 0 10px 0" },
//           "& h1, & h2, & h3": { margin: "10px 0" },
//           "& ul, & ol": { paddingLeft: "25px" },
//         }}
//       >
//         <ReactMarkdown>
//   {content.replace(/<br\s*\/?>/gi, "\n")}
// </ReactMarkdown>
//       </Box>
//     </Box>
//   ) : (
//     <Box
//       sx={{
//         display: "flex",
//         bgcolor: "#004d5612",
//         p: 2,
//         gap: 2,
//       }}
//     >
//       <Avatar sx={{ ml: "0", bgcolor: "#FC2288", color: "white" }}>
//         {initials || "U"}
//       </Avatar>

//       <Typography fontSize={"20px"}>{content}</Typography>
//     </Box>
//   );
// };

// export default ChatItem;












// with remark-gfm , text formated now with proper support for tables, strikethrough, and other markdown features.
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const auth = useAuth();

  const name = auth?.user?.name || "";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
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

      <Box
        sx={{
          color: "#ECECEA",
          fontSize: "20px",
          lineHeight: 1.5,

          "& p": {
            margin: "0 0 12px 0",
          },

          "& h1, & h2, & h3, & h4": {
            margin: "14px 0 8px 0",
          },

          "& ul, & ol": {
            paddingLeft: "28px",
            marginTop: "8px",
            marginBottom: "12px",
          },

          "& li": {
            marginBottom: "5px",
          },

          "& strong": {
            fontWeight: 700,
          },

          "& blockquote": {
            borderLeft: "4px solid #FC2288",
            paddingLeft: "15px",
            marginLeft: 0,
            opacity: 0.9,
          },

          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            margin: "15px 0",
          },

          "& th, & td": {
            border: "1px solid #555",
            padding: "8px 12px",
            textAlign: "left",
          },

          "& th": {
            fontWeight: 700,
          },

          "& code": {
            backgroundColor: "#111d27",
            padding: "2px 6px",
            borderRadius: "4px",
          },

          "& pre": {
            backgroundColor: "#111d27",
            padding: "15px",
            borderRadius: "8px",
            overflowX: "auto",
          },

          "& pre code": {
            backgroundColor: "transparent",
            padding: 0,
          },
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content.replace(/<br\s*\/?>/gi, "\n")}
        </ReactMarkdown>
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
        {initials || "U"}
      </Avatar>

      <Typography fontSize={"20px"}>{content}</Typography>
    </Box>
  );
};

export default ChatItem;










