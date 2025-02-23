import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TournamentOverviewPage from "./pages/TournamentOverviewPage";
import SingleGame from "./pages/SingleGame";
import TournamentPage from "./pages/TournamentPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/tournament-overview"
          element={<TournamentOverviewPage />}
        />
        <Route path="/single-game" element={<SingleGame />} />
        <Route path="/tournament/:tournamentId" element={<TournamentPage />} />
      </Routes>
    </Router>
  );
}
