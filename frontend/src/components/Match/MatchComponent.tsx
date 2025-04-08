import { useState, useEffect } from "react";
import {
  MatchData,
  MatchProps,
  MatchScores,
} from "../../interfaces/matchInterfaces";
import { Player } from "../../interfaces/playerInterfaces";
import { CustomDialogComponent, useDialog } from "../CustomDialogComponent";
import MatchPlayerBoxComponent from "./MatchPlayerBoxComponent";
import MatchScoreInputComponent from "./MatchScoreInputComponent";
import MatchHeaderComponent from "./MatchHeaderComponent";

export default function MatchComponent({
  matchData,
  starter,
  onFinishedMatch,
}: MatchProps) {
  const { player1, player2 } = matchData;
  const [player1Points, setPlayer1Points] = useState<number>(matchData.points);
  const [player2Points, setPlayer2Points] = useState<number>(matchData.points);
  const [player1Legs, setPlayer1Legs] = useState<number>(0);
  const [player2Legs, setPlayer2Legs] = useState<number>(0);
  const [player1Darts, setPlayer1Darts] = useState<number>(0);
  const [player2Darts, setPlayer2Darts] = useState<number>(0);
  const [player1ScoreTotal, setPlayer1ScoreTotal] = useState<number>(0);
  const [player2ScoreTotal, setPlayer2ScoreTotal] = useState<number>(0);
  const [player1RankingScore, setPlayer1RankingScore] = useState<number>(0);
  const [player2RankingScore, setPlayer2RankingScore] = useState<number>(0);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(starter.id);
  const [currentLeg, setCurrentLeg] = useState<number>(1);
  const [scores, setScores] = useState<MatchScores[]>([]);
  const { dialog, setDialog, showDialog } = useDialog();

  const resetGame = () => {
    setPlayer1Points(matchData.points);
    setPlayer2Points(matchData.points);
    setPlayer1Legs(0);
    setPlayer2Legs(0);
    setCurrentLeg(1);
    setScores([]);
    setCurrentPlayerId(starter.id);
  };

  const handleResult = (winner: Player) => {
    const updatedMatch: MatchData = {
      ...matchData,
      winner,
      player1RankingScore,
      player2RankingScore,
    };

    showDialog(
      `Spiel beendet. ${winner?.name} hat gewonnen!`,
      "success",
      () => {
        onFinishedMatch(updatedMatch);
        resetGame();
      }
    );
  };

  const handleScoreSubmit = (score: number) => {
    if (score < 0 || score > 180) {
      showDialog(`${score} ist ein ungültiger Wurf!`, "error");
      return;
    }

    const isPlayer1 = currentPlayerId === player1.id;
    const currentPoints = isPlayer1 ? player1Points : player2Points;
    const newPoints = currentPoints - score;

    if (newPoints < 0 || newPoints === 1) {
      showDialog(
        `${score} ist ein ungültiger Wurf! Es muss auf 0 mit einem Doppelfeld beendet werden.`,
        "error"
      );
      return;
    }

    if (isPlayer1) {
      setPlayer1Darts((prev) => prev + 1);
      setPlayer1ScoreTotal((prev) => prev + score);
    } else {
      setPlayer2Darts((prev) => prev + 1);
      setPlayer2ScoreTotal((prev) => prev + score);
    }

    if (newPoints === 0) {
      if (isPlayer1) {
        setPlayer1Legs((prev) => prev + 1);
        setPlayer1RankingScore((prev) => prev + player2Points);
        setPlayer2RankingScore((prev) => prev - player2Points);
      } else {
        setPlayer2Legs((prev) => prev + 1);
        setPlayer2RankingScore((prev) => prev + player1Points);
        setPlayer1RankingScore((prev) => prev - player1Points);
      }
      resetLeg();
    } else {
      if (isPlayer1) {
        setPlayer1Points(newPoints);
      } else {
        setPlayer2Points(newPoints);
      }
      setCurrentPlayerId(isPlayer1 ? player2.id : player1.id);
    }

    setScores((prevScores) => [
      ...prevScores,
      {
        player1points: player1Points,
        player2points: player2Points,
        player1score: isPlayer1 ? score : null,
        player2score: isPlayer1 ? null : score,
        player1RankingScore: player1RankingScore,
        player2RankingScore:  player2RankingScore,
        winner: newPoints === 0,
        currentPlayerId,
      },
    ]);
  };

  const resetLeg = () => {
    setPlayer1Points(matchData.points);
    setPlayer2Points(matchData.points);
    setCurrentLeg((prev) => prev + 1);
    setCurrentPlayerId(
      currentLeg % 2 === 0
        ? starter.id
        : starter.id === player1.id
        ? player2.id
        : player1.id
    );
  };

  const handleUndo = () => {
    if (scores.length === 0) return;

    const lastScore = scores[scores.length - 1];
    const newScores = scores.slice(0, -1);

    setScores(newScores);
    setPlayer1Points(lastScore.player1points);
    setPlayer2Points(lastScore.player2points);
    setPlayer1RankingScore(lastScore.player1RankingScore);
    setPlayer2RankingScore(lastScore.player2RankingScore);
    setCurrentPlayerId(lastScore.currentPlayerId);

    if (lastScore.player1score !== null) {
      setPlayer1Darts((prev) => Math.max(0, prev - 1));
      setPlayer1ScoreTotal((prev) =>
        Math.max(0, prev - (lastScore.player1score ?? 0))
      );
    }
    if (lastScore.player2score !== null) {
      setPlayer2Darts((prev) => Math.max(0, prev - 1));
      setPlayer2ScoreTotal((prev) =>
        Math.max(0, prev - (lastScore.player2score ?? 0))
      );
    }

    if (lastScore.winner) {
      if (lastScore.currentPlayerId === player1.id) {
        setPlayer1Legs((prev) => Math.max(0, prev - 1));
      } else {
        setPlayer2Legs((prev) => Math.max(0, prev - 1));
      }
    }
  };

  useEffect(() => {
    if (player1Legs === matchData.legs) {
      handleResult(player1);
    } else if (player2Legs === matchData.legs) {
      handleResult(player2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player1Legs, player2Legs, matchData.legs]);

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <MatchHeaderComponent legs={matchData.legs} />
      <MatchPlayerBoxComponent
        player={player1}
        playerLegs={player1Legs}
        playerPoints={player1Points}
        playerDarts={player1Darts}
        playerScoreTotal={player1ScoreTotal}
        playerLastScore={
          scores.length > 0
            ? scores
                .slice()
                .reverse()
                .find((score) => score.player1score !== null)?.player1score ??
              null
            : null
        }
        isActive={currentPlayerId === player1.id}
      />

      <MatchPlayerBoxComponent
        player={player2}
        playerLegs={player2Legs}
        playerPoints={player2Points}
        playerDarts={player2Darts}
        playerScoreTotal={player2ScoreTotal}
        playerLastScore={
          scores.length > 0
            ? scores
                .slice()
                .reverse()
                .find((score) => score.player2score !== null)?.player2score ??
              null
            : null
        }
        isActive={currentPlayerId === player2.id}
      />

      <MatchScoreInputComponent
        onSubmit={handleScoreSubmit}
        onUndo={handleUndo}
        canUndo={scores.length > 0}
      />
    </>
  );
}
