import { Player } from "./playerInterfaces";

export enum TournamentStatus {
  OPEN = "Offen",
  GROUP_STAGE = "Gruppenphase",
  SEMIFINAL_STAGE = "Halbfinalphase",
  FINAL_STAGE = "Finalphase",
  FINISHED = "Beendet",
}

export interface TournamentCreationData {
  players: Player[];
  pointsGroupStage: number;
  pointsSemifinalStage: number;
  pointsFinalStage: number;
  legsGroupStage: number;
  legsSemifinalStage: number;
  legsFinalStage: number;
}

export interface Tournament {
  id: number;
  players: { length: number };
}

export interface TournamentGroupStageRanking {
  id: number;
  name: string;
  wins: number;
}
