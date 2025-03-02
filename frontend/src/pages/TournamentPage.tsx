import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid2, Typography } from "@mui/material";
import {
  getTournamentStageMatches,
  getTournamentStageLegs,
  getTournamentStagePoints,
  postFinishedTournamentMatch,
  getTournamentStatus,
  getTournamentGroupStageRanking,
} from "../apis/tournamentApi";
import { MatchData } from "../interfaces/matchInterfaces";
import {
  TournamentStatus,
  TournamentGroupStageRanking,
} from "../interfaces/tournamentInterfaces";
import {
  CustomDialogComponent,
  useDialog,
} from "../components/CustomDialogComponent";
import TournamentRankingComponent from "../components/Tournament/TournamentRankingComponent";
import TournamentMatchesWithResultComponent from "../components/Tournament/TournamentMatchesWithResultComponent";
import MatchComponent from "../components/Match/MatchComponent";
import socket from "../utils/socket";

export default function TournamentPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [legs, setLegs] = useState<number>();
  const [points, setPoints] = useState<number>();
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>(
    TournamentStatus.OPEN
  );
  const [ranking, setRanking] = useState<TournamentGroupStageRanking[]>([]);
  const [matchesWithResult, setMatchesWithResult] = useState<MatchData[]>([]);

  const { dialog, setDialog, showDialog } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournamentStatus();
    fetchTournamentStageMatches();
    fetchTournamentGroupStageRanking();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  useEffect(() => {
    socket.on("changedStage", async (value) => {
      if (value === TournamentStatus.FINISHED) {
        showDialog("Tunier beendet!", "success", () => {
          navigate(`/tournament-overview`);
        });
      } else {
        await fetchTournamentStatus();
        await fetchTournamentStageMatches();
        showDialog(`${value} startet!`, "success");
      }
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
    const resTournamentStageLegs = await getTournamentStageLegs(
      Number(tournamentId)
    );
    if (!resTournamentStageLegs.success) {
      showDialog(resTournamentStageLegs.message, "error");
      return;
    }
    setLegs(resTournamentStageLegs.data);

    const resTournamentStagePoints = await getTournamentStagePoints(
      Number(tournamentId)
    );
    if (!resTournamentStagePoints.success) {
      showDialog(resTournamentStagePoints.message, "error");
      return;
    }
    setPoints(resTournamentStagePoints.data);

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
    setMatchesWithResult(matchesData);
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

    if (tournamentStatus === TournamentStatus.GROUP_STAGE) {
      fetchTournamentGroupStageRanking();

      const updatedMatchesWithResult = matchesWithResult.map((match) =>
        match.player1.id === matchData.player1.id &&
        match.player2.id === matchData.player2.id
          ? { ...match, winner: matchData.winner }
          : match
      );
      setMatchesWithResult(updatedMatchesWithResult);
    }
  };

  const fetchTournamentGroupStageRanking = async () => {
    const resTournamentGroupStageRanking = await getTournamentGroupStageRanking(
      Number(tournamentId)
    );
    if (!resTournamentGroupStageRanking.success) {
      showDialog(resTournamentGroupStageRanking.message, "error");
      return;
    }
    setRanking(resTournamentGroupStageRanking.data);
  };

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <Container maxWidth={false}>
        {matches.length > 0 && points !== undefined && legs !== undefined ? (
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 12 }}>
              <Box
                p={2}
                boxShadow={2}
                borderRadius={2}
                bgcolor="background.paper"
              >
                <MatchComponent
                  key={matches[0].player1.id + "-" + matches[0].player2.id}
                  matchData={matches[0]}
                  points={points}
                  legs={legs}
                  starter={matches[0].player1}
                  onFinishedMatch={handleMatchFinished}
                />
              </Box>
            </Grid2>

            {tournamentStatus === TournamentStatus.GROUP_STAGE && (
              <>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box
                    p={2}
                    boxShadow={2}
                    borderRadius={2}
                    bgcolor="background.paper"
                  >
                    <TournamentRankingComponent ranking={ranking} />
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Box
                    p={2}
                    boxShadow={2}
                    borderRadius={2}
                    bgcolor="background.paper"
                  >
                    <TournamentMatchesWithResultComponent
                      matchesWithResult={matchesWithResult}
                    />
                  </Box>
                </Grid2>
              </>
            )}
          </Grid2>
        ) : tournamentStatus === TournamentStatus.FINAL_STAGE ? (
          <Typography variant="h6" align="center">
            Keine weiteren Spiele auf diesem Board.
          </Typography>
        ) : (
          <Typography variant="h6" align="center">
            Warten auf nächstes Match...
          </Typography>
        )}
      </Container>
    </>
  );
}
