import io from "socket.io-client";
import { API_URL } from "../apis/configApi";

const socket = io(API_URL, {
  transports: ["websocket", "polling"],
});

export default socket;
