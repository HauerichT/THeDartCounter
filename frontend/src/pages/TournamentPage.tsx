import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid2, Typography } from "@mui/material";
import {
  postFinishedTournamentMatch,
  getTournamentStatus,
  getTournamentMatch,
} from "../apis/tournamentApi";
import { MatchData } from "../interfaces/matchInterfaces";
import {
  TournamentStatus,
} from "../interfaces/tournamentInterfaces";
import {
  CustomDialogComponent,
  useDialog,
} from "../components/CustomDialogComponent";
import MatchComponent from "../components/Match/MatchComponent";
import socket from "../utils/socket";

export default function TournamentPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [match, setMatch] = useState<MatchData>();
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>(
    TournamentStatus.OPEN
  );

  const { dialog, setDialog, showDialog } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournamentStatus();
    fetchTournamentMatch();
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

  const fetchTournamentStatus = async () => {
    const resTournamentStatus = await getTournamentStatus(Number(tournamentId));
    if (!resTournamentStatus.success) {
      showDialog(resTournamentStatus.message, "error");
    } else {
      setTournamentStatus(resTournamentStatus.data);
    }
  };

  const fetchTournamentMatch = async () => {
    if (match) return; // Verhindert mehrfaches Abrufen
    const resTournamentMatch = await getTournamentMatch(
      Number(tournamentId)
    );
    if (!resTournamentMatch.success) {
      showDialog(resTournamentMatch.message, "error");
      return;
    }
    console.log(resTournamentMatch.data);
    setMatch(resTournamentMatch.data);
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
      </Container>
    </>
  );
}