import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import PlayerBar from "./components/PlayerBar";
import Home from "./pages/Home";
import type { Song } from "./types/Song";
import { getSongs } from "./services/songService";

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    getSongs().then(setSongs);
  }, []);
  
  useEffect(() => {
    getSongs().then(data => {
      console.log("SONGS FROM API:", data);
      setSongs(data);
    });
  }, []);


  return (
    <div className="app">
      <Sidebar />

      <Home songs={songs} onSelect={setCurrentSong} />

      <PlayerBar song={currentSong} />
    </div>
  );
}

export default App;
