import { Player } from "./playerInterface";

export enum MatchMode {
  SINGLE_MATCH,
  TOURNAMENT_MATCH,
}

export interface GameData {
  tournamentId: number | null;
  player1: Player;
  player2: Player;
  legs: number | 1;
  points: number | 301;
  starter: Player;
  mode: MatchMode;
  winner: Player | null;
}

export interface SingleGameSetupProps {
  onStartGame: (data: GameData) => void;
}
