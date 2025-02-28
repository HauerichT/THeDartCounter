import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import {
  getTournamentStageMatches,
  getTournamentStageLegs,
  getTournamentStagePoints,
  postFinishedTournamentMatch,
  getTournamentStatus,
} from "../apis/tournamentApi";
import MatchComponent from "../components/Match/MatchComponent";
import { MatchData } from "../interfaces/matchInterfaces";
import { TournamentStatus } from "../interfaces/tournamentInterfaces";
import socket from "../utils/socket";
import {
  CustomDialogComponent,
  useDialog,
} from "../components/CustomDialogComponent";

export default function TournamentPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [legs, setLegs] = useState<number>();
  const [points, setPoints] = useState<number>();
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>(
    TournamentStatus.OPEN
  );
  const { dialog, setDialog, showDialog } = useDialog();

  useEffect(() => {
    fetchTournamentStatus();
    fetchTournamentStageMatches();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  useEffect(() => {
    socket.on("changedStage", async () => {
      await fetchTournamentStatus();
      await fetchTournamentStageMatches();
    });

    return () => {
      socket.off("changedStage");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTournamentStatus = async () => {
    const resTournamentStatus = await getTournamentStatus(Number(tournamentId));
    if (!resTournamentStatus.success) {
      showDialog(resTournamentStatus.message, "error");
    } else {
      setTournamentStatus(resTournamentStatus.data);
    }
  };

  const fetchTournamentStageMatches = async () => {
    // Get the stage matches
    const resTournamentStageMatches = await getTournamentStageMatches(
      Number(tournamentId)
    );
    if (!resTournamentStageMatches.success) {
      showDialog(resTournamentStageMatches.message, "error");
      return;
    }

    const matchesData = Array.isArray(resTournamentStageMatches.data)
      ? resTournamentStageMatches.data
      : [resTournamentStageMatches.data];

    setMatches(matchesData);

    // Get the stage leg amount
    const resTournamentStageLegs = await getTournamentStageLegs(
      Number(tournamentId)
    );
    if (!resTournamentStageLegs.success) {
      showDialog(resTournamentStageLegs.message, "error");
      return;
    }
    setLegs(resTournamentStageLegs.data);

    // Get the group point amount
    const resTournamentStagePoints = await getTournamentStagePoints(
      Number(tournamentId)
    );
    if (!resTournamentStagePoints.success) {
      showDialog(resTournamentStagePoints.message, "error");
      return;
    }
    setPoints(resTournamentStagePoints.data);
  };

  const handleMatchFinished = async (matchData: MatchData) => {
    const resPostFinishedMatch = await postFinishedTournamentMatch(
      Number(tournamentId),
      matchData
    );
    if (!resPostFinishedMatch.success) {
      showDialog(resPostFinishedMatch.message, "error");
      return;
    }

    setMatches((prevMatches) => prevMatches.slice(1));
  };

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <Typography>{tournamentStatus}</Typography>
      {matches.length > 0 && points !== undefined && legs !== undefined ? (
        <MatchComponent
          key={matches[0].player1.id + "-" + matches[0].player2.id}
          matchData={matches[0]}
          points={points}
          legs={legs}
          starter={matches[0].player1}
          onFinishedMatch={handleMatchFinished}
        />
      ) : tournamentStatus === TournamentStatus.FINAL_STAGE ? (
        <Typography>Keine weiteren Spiele auf diesem Board.</Typography>
      ) : (
        <Typography>Warten auf nächstes Match...</Typography>
      )}
    </>
  );
}
