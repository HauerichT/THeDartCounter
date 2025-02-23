import axios from "axios";
import { API_URL } from "./configApi";
import { GameData } from "../interfaces/gameInterface";

export async function postFinishedGame(gameData: GameData) {
  try {
    const response = await axios.post(
      API_URL + "/api/games/post-finished-game",
      gameData
    );
    console.log(response);
  } catch (error) {
    console.error("Fehler beim POST-Request:", error);
    throw new Error(String(error));
  }
}
