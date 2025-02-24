import { Player } from "./playerInterface";

export enum MatchMode {
  SINGLE_MATCH,
  TOURNAMENT_MATCH,
}

export interface MatchData {
  player1: Player;
  player2: Player;
  winner: Player | null;
}

export interface MatchProps {
  matchData: MatchData;
  points: number;
  legs: number;
  starter: Player;
  onFinishedMatch: (matchData: MatchData) => void;
}
