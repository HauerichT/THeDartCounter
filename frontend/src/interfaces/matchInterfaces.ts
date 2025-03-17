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
  player1score: number | null;
  player2score: number | null;
  winner: boolean;
  currentPlayerId: number;
}

export interface MatchProps {
  matchData: MatchData;
  starter: Player;
  onFinishedMatch: (matchData: MatchData) => void;
}
