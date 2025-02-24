import axios from "axios";
import { API_URL } from "./configApi";
import { TournamentCreationData } from "../interfaces/tournamentInterface";
import socket from "../utils/socket";
import { MatchData } from "../interfaces/matchInterface";

export async function postCreateTournament(
  tournamentCreationData: TournamentCreationData
) {
  try {
    const response = await axios.post(
      API_URL + "/api/tournaments/createTournament",
      tournamentCreationData
    );
    return response.data;
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

export async function getTournamentStatus(tournamentId: number) {
  try {
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentStatus/${tournamentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getTournamentStageMatches(tournamentId: number) {
  try {
    const socketId = socket.id;
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentStageMatches/${tournamentId}/${socketId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getTournamentStageLegs(tournamentId: number) {
  try {
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentStageLegs/${tournamentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getTournamentStagePoints(tournamentId: number) {
  try {
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentStagePoints/${tournamentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function postFinishedTournamentMatch(
  tournamentId: number,
  matchData: MatchData
) {
  try {
    const response = await axios.post(
      `${API_URL}/api/tournaments/postFinishedTournamentMatch/${tournamentId}`,
      matchData
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}
