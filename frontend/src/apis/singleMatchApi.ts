import axios from "axios";
import { API_URL } from "./configApi";
import { MatchData } from "../interfaces/matchInterfaces";

export async function postFinishedSingleMatch(matchData: MatchData) {
  try {
    const response = await axios.post(
      API_URL + "/api/matches/postFinishedSingleMatch",
      matchData
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}
