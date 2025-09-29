import React, { useState } from 'react';
import { songsData } from './songs'; 
import './App.css'; 

const Song = ({ song }) => {
  return (
    <div className="song-item">
      <p className="song-title">{song.title}</p>
      <p className="song-artist">{song.artist} — {song.album}</p>
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = songsData.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🎵 My Music Playlist</h1>


      <input
        type="text"
        placeholder="🔍 Search for a song"
        className="search-bar"
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      
      <div className="song-list">
        {filteredSongs.map(song => (
          <Song key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default App;