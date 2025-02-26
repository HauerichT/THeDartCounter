import { Player } from "./playerInterfaces";

export enum TournamentStatus {
  OPEN,
  GROUP_STAGE,
  SEMIFINALS_STAGE,
  FINAL_STAGE,
  FINISHED,
}

export interface TournamentCreationData {
  players: Player[];
  pointsGroup: number;
  pointsSemifinal: number;
  pointsFinal: number;
  legsGroup: number;
  legsSemifinal: number;
  legsFinal: number;
}

export interface Tournament {
  id: number;
  players: { length: number };
}
