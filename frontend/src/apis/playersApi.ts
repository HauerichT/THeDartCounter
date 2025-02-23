import axios from "axios";
import { API_URL } from "./configApi";

export async function getPlayers() {
  try {
    const response = await axios.get(API_URL + "/api/players/get-players");
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}
