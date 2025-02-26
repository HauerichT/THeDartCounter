import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TournamentOverviewPage from "./pages/TournamentOverviewPage";
import SingleMatchPage from "./pages/SingleMatchPage";
import TournamentPage from "./pages/TournamentPage";
import NavbarComponent from "./components/NavbarComponent";

export default function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/tournament-overview"
          element={<TournamentOverviewPage />}
        />
        <Route path="/single-game" element={<SingleMatchPage />} />
        <Route path="/tournament/:tournamentId" element={<TournamentPage />} />
      </Routes>
    </Router>
  );
}
