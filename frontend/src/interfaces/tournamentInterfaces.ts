import { Player } from "./playerInterfaces";

export enum TournamentStatus {
  OPEN = "Offen",
  LIGA_STAGE = "Ligaphase",
  GROUP_STAGE = "Gruppenphase",
  SEMIFINAL_STAGE = "Halbfinalphase",
  FINAL_STAGE = "Finalphase",
  FINISHED = "Beendet",
}

export enum TournamentMode {
  KO = "KO-System",
  LIGA = "Liga-System",
}

export interface TournamentCreationData {
  players: Player[];
  tournamentMode: TournamentMode;
  legsLiga: number;
  pointsLiga: number;
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

export interface TournamentRanking {
  id: number;
  name: string;
  wins: number;
  rankingScore: number;
}
