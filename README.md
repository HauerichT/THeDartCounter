# Dart Counter für Tuniere mit 2 Boards.

## **Technologien**

- **Frontend:** React.js (mit Material-UI für UI-Komponenten)
- **Backend:** Express.js
- **Datenbank:** MySQL
- **Echtzeit-Kommunikation:** Socket.IO
- **Styling:** Material-UI

## **Funktionen**

### **1. Spieler-Management**

- **Features:**
  - Spieler anlegen mit Namen und optionalen Zusatzinformationen.
  - Spieler speichern und in der Datenbank wiederverwendbar machen.
  - Spieler können aus der Liste ausgewählt und in Spiele oder Turniere eingebunden werden.

### **2. Einzelspiel**

- **Features:**
  - Spiel mit zwei Spielern im Modus **301** oder **501**.
  - **Single Out** oder **Double Out** am Ende.
  - Modus: **First-to-Legs**.
  - Dynamische Anzeige des verbleibenden Scores und Überprüfung von Regeln (z. B. kein Bust bei Double Out).

### **3. Turnierverwaltung**

- **Features:**
  - Spieler für das Turnier auswählen (z. B. 10 Spieler aus der Datenbank).
  - Automatische Gruppenzuweisung (2 Gruppen à 5 Spieler per Zufallslosung).
  - Jeder-gegen-Jeden innerhalb der Gruppen (**Round Robin**).
  - Echtzeitsynchronisation mit Socket.IO:
    - Spiele in beiden Gruppen laufen gleichzeitig auf zwei Boards (z. B. Gruppe A → Board 1, Gruppe B → Board 2).
  - Berechnung der Tabellenposition:
    - Punkte (Sieg: 2 Punkte, Niederlage: 0 Punkte).
    - Punktedifferenz bei Niederlage.
  - **KO-Phase:**
    - Platz 1 und 2 jeder Gruppe spielen die Halbfinals.
    - Halbfinals werden auf den jeweiligen Boards gespielt.
    - Finale wird auf einem Board gespielt.
