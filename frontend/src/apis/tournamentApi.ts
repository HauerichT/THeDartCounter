import axios from "axios";
import { API_URL } from "./configApi";
import { TournamentCreationData } from "../interfaces/tournamentInterface";
import socket from "../utils/socket";

export async function postCreateTournament(
  tournamentCreationData: TournamentCreationData
) {
  try {
    console.log(tournamentCreationData);
    const response = await axios.post(
      API_URL + "/api/tournaments/createTournament",
      tournamentCreationData
    );
    console.log(response.data.message);
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getOpenTournaments() {
  try {
    const response = await axios.get(
      API_URL + "/api/tournaments/openTournaments"
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getTournamentById(tournamentId: number) {
  try {
    const response = await axios.get(
      `${API_URL}/api/tournaments/${tournamentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getNextTournamentMatch(tournamentId: number) {
  try {
    const socketId = socket.id;
    const response = await axios.get(
      `${API_URL}/api/tournaments/nextTournamentMatch/${tournamentId}/${socketId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}
