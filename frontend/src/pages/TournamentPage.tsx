import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import {
  getTournamentStatus,
  getTournamentStageMatches,
  getTournamentStageLegs,
  getTournamentStagePoints,
  postFinishedTournamentMatch,
} from "../apis/tournamentApi";
import Match from "../components/Match/Match";
import { MatchData } from "../interfaces/matchInterface";
import { TournamentStatus } from "../interfaces/tournamentInterface";

export default function TournamentPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>(
    TournamentStatus.OPEN
  );
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [legs, setLegs] = useState<number>();
  const [points, setPoints] = useState<number>();

  useEffect(() => {
    fetchTournamentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  useEffect(() => {
    if (tournamentStatus === TournamentStatus.GROUP_STAGE) {
      fetchTournamentStageMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentStatus]);

  const fetchTournamentStatus = async () => {
    const resTournamentStatus = await getTournamentStatus(Number(tournamentId));
    if (!resTournamentStatus.success) {
      return;
    }
    setTournamentStatus(resTournamentStatus.data);
  };

  const fetchTournamentStageMatches = async () => {
    // Get the stage matches
    const resTournamentStageMatches = await getTournamentStageMatches(
      Number(tournamentId)
    );
    console.log(resTournamentStageMatches);
    if (!resTournamentStageMatches.success) {
      return;
    }
    setMatches(resTournamentStageMatches.data);

    // Get the stage leg amount
    const resTournamentStageLegs = await getTournamentStageLegs(
      Number(tournamentId)
    );
    console.log(resTournamentStageLegs);
    if (!resTournamentStageLegs.success) {
      return;
    }
    setLegs(resTournamentStageLegs.data);

    // Get the group point amount
    const resTournamentStagePoints = await getTournamentStagePoints(
      Number(tournamentId)
    );
    console.log(resTournamentStagePoints);
    if (!resTournamentStagePoints.success) {
      return;
    }
    setPoints(resTournamentStagePoints.data);
  };

  const handleFinishedMatch = async (matchData: MatchData) => {
    const resPostFinishedMatch = await postFinishedTournamentMatch(
      Number(tournamentId),
      matchData
    );
    console.log(resPostFinishedMatch);
    if (!resPostFinishedMatch.success) {
      return;
    }
    alert(`Spiel beendet! ${matchData.winner?.name} hat gewonnen!`);
    setMatches((prevMatches) => prevMatches.slice(1));
  };

  return matches.length > 0 && points !== undefined && legs !== undefined ? (
    <Match
      key={matches[0].player1.id + "-" + matches[0].player2.id}
      matchData={matches[0]}
      points={points}
      legs={legs}
      starter={matches[0].player1}
      onFinishedMatch={handleFinishedMatch}
    />
  ) : (
    <Typography>"Warten auf nächstes Match..."</Typography>
  );
}
