import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid2, Typography } from "@mui/material";
import {
  postFinishedTournamentMatch,
  getTournamentStatus,
  getTournamentMatch,
  getTournamentRanking,
  getTournamentMatches,
} from "../apis/tournamentApi";
import { MatchData } from "../interfaces/matchInterfaces";
import {
  TournamentRanking,
  TournamentStatus,
} from "../interfaces/tournamentInterfaces";
import {
  CustomDialogComponent,
  useDialog,
} from "../components/CustomDialogComponent";
import MatchComponent from "../components/Match/MatchComponent";
import socket from "../utils/socket";
import TournamentRankingComponent from "../components/Tournament/TournamentRankingComponent";
import TournamentMatchesWithResultComponent from "../components/Tournament/TournamentMatchesWithResultComponent";

export default function TournamentPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [match, setMatch] = useState<MatchData>();
  const [allMatches, setAllMatches] = useState<MatchData[]>();
  const [ranking, setRanking] = useState<TournamentRanking[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>(
    TournamentStatus.OPEN
  );

  const { dialog, setDialog, showDialog } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchTournamentStatus();
      await fetchTournamentMatch();
      await fetchTournamentMatches();
      await fetchTournamentRanking();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  useEffect(() => {
    socket.on("changedStage", async (value: TournamentStatus) => {
      if (value === TournamentStatus.FINISHED) {
        showDialog("Tunier beendet!", "success", () => {
          navigate(`/tournament-overview`);
        });
      } else {
        await fetchTournamentStatus();
        await fetchTournamentMatch();
        showDialog(`${value} startet!`, "success");
      }
    });

    return () => {
      socket.off("changedStage");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTournamentMatches = async () => {
    const resTournamentMatches = await getTournamentMatches(
      Number(tournamentId)
    );
    if (!resTournamentMatches.success) {
      showDialog(resTournamentMatches.message, "error");
      return;
    }
    setAllMatches(resTournamentMatches.data);
    return resTournamentMatches.data;
  };

  const fetchTournamentStatus = async () => {
    const resTournamentStatus = await getTournamentStatus(Number(tournamentId));
    if (!resTournamentStatus.success) {
      showDialog(resTournamentStatus.message, "error");
      return;
    }
    setTournamentStatus(resTournamentStatus.data);
    return resTournamentStatus.data;
  };

  const fetchTournamentMatch = async () => {
    const resTournamentMatch = await getTournamentMatch(Number(tournamentId));
    if (!resTournamentMatch.success) {
      showDialog(resTournamentMatch.message, "error");
      return;
    }
    console.log("FETCH", resTournamentMatch.data);
    setMatch(resTournamentMatch.data);
  };

  const fetchTournamentRanking = async () => {
    const resTournamentRanking = await getTournamentRanking(
      Number(tournamentId)
    );
    if (!resTournamentRanking.success) {
      showDialog(resTournamentRanking.message, "error");
      return;
    }
    console.log("RANKING", resTournamentRanking.data);
    setRanking(resTournamentRanking.data);
  };

  const handleMatchFinished = async (matchData: MatchData) => {
    console.log("FINISHED", matchData);
    const resPostFinishedMatch = await postFinishedTournamentMatch(
      Number(tournamentId),
      matchData
    );
    if (!resPostFinishedMatch.success) {
      showDialog(resPostFinishedMatch.message, "error");
      return;
    }
    const status = await fetchTournamentStatus();
    if (status === tournamentStatus) {
      await fetchTournamentMatch();
    }
    if (
      tournamentStatus === TournamentStatus.GROUP_STAGE ||
      tournamentStatus === TournamentStatus.LIGA_STAGE
    ) {
      await fetchTournamentRanking();
      await fetchTournamentMatches();
    }
  };

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <Container maxWidth={false}>
        {match ? (
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 12 }}>
              <Box
                p={2}
                boxShadow={2}
                borderRadius={2}
                bgcolor="background.paper"
              >
                <MatchComponent
                  key={match.player1.id + "-" + match.player2.id}
                  matchData={match}
                  starter={match.player1}
                  onFinishedMatch={handleMatchFinished}
                  points={null}
                  legs={null}
                />
              </Box>
            </Grid2>
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
                  matchesWithResult={allMatches || []}
                />
              </Box>
            </Grid2>
          </>
        )}
      </Container>
    </>
  );
}
