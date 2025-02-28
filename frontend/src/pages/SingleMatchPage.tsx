import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import SingleMatchSetupComponent from "../components/SingleMatch/SingleMatchSetupComponent";
import MatchComponent from "../components/Match/MatchComponent";
import { MatchData } from "../interfaces/matchInterfaces";
import { postFinishedSingleMatch } from "../apis/singleMatchApi";
import {
  useDialog,
  CustomDialogComponent,
} from "../components/CustomDialogComponent";
import { useNavigate } from "react-router-dom";

export default function SingleMatchPage() {
  const [match, setMatch] = useState<MatchData | null>(() => {
    const savedGameData = sessionStorage.getItem("singleMatchData");
    return savedGameData ? JSON.parse(savedGameData) : null;
  });
  const { dialog, setDialog, showDialog } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    if (match) {
      sessionStorage.setItem("singleMatchData", JSON.stringify(match));
    } else {
      sessionStorage.removeItem("singleMatchData");
    }
  }, [match]);

  const handleMatchFinished = async (matchData: MatchData) => {
    const resPostFinishedMatch = await postFinishedSingleMatch(matchData);
    if (!resPostFinishedMatch.success) {
      showDialog(resPostFinishedMatch.message, "error");
      return;
    }
    sessionStorage.removeItem("singleMatchData");
    navigate("/");
  };

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <Container maxWidth={false}>
        {!match ? (
          <SingleMatchSetupComponent
            onStartMatch={(matchData) => setMatch(matchData)}
          />
        ) : (
          <MatchComponent
            key={match.player1.id + "-" + match.player2.id}
            matchData={match}
            points={match.points}
            legs={match.legs}
            starter={match.starter}
            onFinishedMatch={handleMatchFinished}
          />
        )}
      </Container>
    </>
  );
}
