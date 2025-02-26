import { Player } from "./playerInterfaces";

export interface MatchData {
  player1: Player;
  player2: Player;
  winner: Player | null;
  points: number;
  legs: number;
  starter: Player;
}

export interface MatchScores {
  player1points: number;
  player2points: number;
  winner: boolean;
  currentPlayerId: number;
}

export interface MatchProps {
  matchData: MatchData;
  points: number;
  legs: number;
  starter: Player;
  onFinishedMatch: (matchData: MatchData) => void;
}
