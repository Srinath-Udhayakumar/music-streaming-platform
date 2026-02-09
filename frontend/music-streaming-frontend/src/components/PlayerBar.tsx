import type { Song } from "../types/Song";

interface PlayerBarProps {
  song: Song | null;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ song }) => {
  if (!song) {
    return (
      <div className="player">
        <span>Select a song to play</span>
      </div>
    );
  }

  return (
    <div className="player">
      <div>
        <strong>{song.title}</strong>
        <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
          {song.artist}
        </div>
      </div>

      <audio
        controls
        autoPlay
        src={`http://localhost:8081/${song.audioPath.replace(/\\/g, "/")}`}
      />
    </div>
  );
};

export default PlayerBar;
