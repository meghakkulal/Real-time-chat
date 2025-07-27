import React, { useState } from "react";
import Chat from "./chat";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (username.trim()) {
      setJoined(true);
    }
  };

  return (
    <div className="App">
      {!joined ? (
        <div className="join-container">
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}

export default App;
