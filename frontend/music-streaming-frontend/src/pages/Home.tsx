import type { Song } from "../types/Song";

interface HomeProps {
  songs: Song[];
  onSelect: (song: Song) => void;
}

const Home: React.FC<HomeProps> = ({ songs, onSelect }) => {
  return (
    <div className="content">
      <h1>Library</h1>

      <div className="grid">
        {songs.map((song) => (
          <div
            key={song.id}
            className="card"
            onClick={() => onSelect(song)}
          >
            {/* 🔥 COVER IMAGE */}
            {song.coverPath && (
              <img
                src={`http://localhost:8081/media/audio/${song.audioPath.split("/").pop()}`}
                alt={song.title}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              />
            )}

            <strong>{song.title}</strong>
            <p>{song.artist}</p>
          </div>

        ))}
      </div>
    </div>
  );
};

export default Home;
