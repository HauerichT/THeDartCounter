import axios from "axios";
import { API_URL } from "./configApi";
import { TournamentCreationData } from "../interfaces/tournamentInterfaces";
import socket from "../utils/socket";
import { MatchData } from "../interfaces/matchInterfaces";

export async function postCreateTournament(
  tournamentCreationData: TournamentCreationData
) {
  try {
    const response = await axios.post(
      API_URL + "/api/tournaments/postCreateTournament",
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
      API_URL + "/api/tournaments/getOpenTournaments"
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getTournamentById(tournamentId: number) {
  try {
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentById/${tournamentId}`
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

export async function getTournamentMatch(tournamentId: number) {
  try {
    const socketId = socket.id;
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentMatch/${tournamentId}/${socketId}`
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

export async function getTournamentRanking(tournamentId: number) {
  try {
    const socketId = socket.id;
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentRanking/${tournamentId}/${socketId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}

export async function getTournamentMatches(tournamentId: number) {
  try {
    const socketId = socket.id;
    const response = await axios.get(
      `${API_URL}/api/tournaments/getTournamentMatches/${tournamentId}/${socketId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
}
