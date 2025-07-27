import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [replyTo, setReplyTo] = useState(null); // for tracking reply

  useEffect(() => {
    socket.on("chat message", (data) => {
      setChatHistory((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", {
        username,
        message: message.trim(),
        replyTo: replyTo ? { username: replyTo.username, message: replyTo.message } : null,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
      setMessage("");
      setReplyTo(null); // clear reply state
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Welcome, {username} 👋</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #eee",
              marginBottom: "10px",
              paddingBottom: "5px",
              cursor: "pointer",
            }}
            onDoubleClick={() => setReplyTo(chat)} // double-click to reply
          >
            <strong>{chat.username}:</strong> {chat.message}
            {chat.replyTo && (
              <div
                style={{
                  fontSize: "0.8em",
                  marginTop: "4px",
                  marginLeft: "10px",
                  padding: "4px",
                  borderLeft: "2px solid #aaa",
                  color: "#666",
                }}
              >
                ↪ replying to {chat.replyTo.username}: "{chat.replyTo.message}"
              </div>
            )}
            <div style={{ fontSize: "0.75em", color: "#888" }}>{chat.timestamp}</div>
          </div>
        ))}
      </div>

      {replyTo && (
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "5px 10px",
            marginBottom: "10px",
            borderLeft: "4px solid blue",
          }}
        >
          Replying to <strong>{replyTo.username}</strong>: "{replyTo.message}"
          <button
            onClick={() => setReplyTo(null)}
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
              color: "red",
              cursor: "pointer",
            }}
          >
            ❌ Cancel
          </button>
        </div>
      )}

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={message}
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;