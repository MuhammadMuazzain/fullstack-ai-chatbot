const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:3500";
const wsUrl = process.env.REACT_APP_WS_URL?.replace(/\/$/, "") || "ws://127.0.0.1:3500";

export const config = {
  apiUrl,
  wsUrl,
};
