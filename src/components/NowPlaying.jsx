import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_LASTFM_KEY;
const USERNAME = "awsumnes298";

function NowPlaying() {
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function getTrack() {
    const url =
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks` +
      `&user=${USERNAME}&api_key=${API_KEY}&limit=1&format=json`;

    const response = await fetch(url);
    const data = await response.json();
    const latest = data.recenttracks.track[0];

    console.log(latest); // open the console to see every field available

    setTrack(latest);
    setIsPlaying(latest["@attr"]?.nowplaying === "true");
  }

  useEffect(() => {
    getTrack();
    const timer = setInterval(getTrack, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!track) return <p>Loading...</p>;

  // image is a list of sizes: small, medium, large, extralarge
  const cover = track.image[3]["#text"];

  return (
    <div>
      <p>{isPlaying ? "Now playing" : "Last played"}</p>

      {cover ? (
        <img src={cover} alt={track.album["#text"]} width="300" />
      ) : (
        <p>No album art</p>
      )}

      <h2>{track.name}</h2>
      <p>{track.artist["#text"]}</p>
      <p>{track.album["#text"]}</p>

      {!isPlaying && track.date && (
        <p>{new Date(track.date.uts * 1000).toLocaleString()}</p>
      )}

      <a href={track.url} target="_blank" rel="noreferrer">
        View on Last.fm
      </a>
    </div>
  );
}

export default NowPlaying;