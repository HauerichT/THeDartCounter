import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import HomePage from "./pages/HomePage";
import TournamentOverviewPage from "./pages/TournamentOverviewPage";
import SingleMatchPage from "./pages/SingleMatchPage";
import TournamentPage from "./pages/TournamentPage";
import NotFoundPage from "./pages/NotFoundPage";
import NavbarComponent from "./components/NavbarComponent";
import theme from "./utils/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tournament-overview"
            element={<TournamentOverviewPage />}
          />
          <Route path="/single-game" element={<SingleMatchPage />} />
          <Route
            path="/tournament/:tournamentId"
            element={<TournamentPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
