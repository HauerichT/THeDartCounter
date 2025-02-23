import { Player } from "./playerInterface";

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
