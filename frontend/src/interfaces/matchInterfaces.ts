import { Player } from "./playerInterfaces";

export interface MatchData {
  player1: Player;
  player2: Player;
  player1RankingScore: number | null;
  player2RankingScore: number | null;
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
  player1RankingScore: number;
  player2RankingScore: number;
  winner: boolean;
  currentPlayerId: number;
}

export interface MatchProps {
  matchData: MatchData;
  points: number | null;
  legs: number | null;
  starter: Player;
  onFinishedMatch: (matchData: MatchData) => void;
}
