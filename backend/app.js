const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const playerRoutes = require("./routes/playerRoutes");
const singleMatchRoutes = require("./routes/singleMatchRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const tournamentController = require("./controllers/tournamentController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/players", playerRoutes);
app.use("/api/matches", singleMatchRoutes);
app.use("/api/tournaments", tournamentRoutes(io));

const PORT = 8000;

io.on("connection", (socket) => {
  console.log("Benutzer verbunden: ", socket.id);

  socket.on("joinTournament", (tournamentId) => {
    socket.join(`tournament_${tournamentId}`);
    console.log(
      `Benutzer ${socket.id} ist dem Turnier ${tournamentId} beigetreten`
    );

    const room = io.sockets.adapter.rooms.get(`tournament_${tournamentId}`);
    const numClients = room ? room.size : 0;

    if (numClients === 1) {
      io.to(socket.id).emit("waitingForSecondBoard");
    } else if (numClients === 2) {
      tournamentController.startTournament(tournamentId, room);
      io.to(`tournament_${tournamentId}`).emit("startTournament", tournamentId);
    }
  });

  socket.on("disconnect", () => {
    console.log("Ein Benutzer hat die Verbindung getrennt:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
