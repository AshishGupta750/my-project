// frontend/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

// Connect to the backend server
const socket = io('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Function to auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Scroll whenever messages update

  // Effect to handle incoming messages
  useEffect(() => {
    // Listener for 'receiveMessage' event
    const receiveMessageHandler = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    socket.on('receiveMessage', receiveMessageHandler);

    // Cleanup: remove the listener when the component unmounts
    return () => {
      socket.off('receiveMessage', receiveMessageHandler);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault(); // Prevent form refresh
    if (currentMessage.trim() && username.trim()) {
      const messageData = {
        user: username,
        text: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'}),
      };
      socket.emit('sendMessage', messageData);
      setCurrentMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Real-Time Chat</h2>
      </div>
      <div className="username-input">
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}</strong> [{msg.time}]: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          disabled={!username.trim()} // Disable input if no username
        />
        <button type="submit" disabled={!username.trim()}>Send</button>
      </form>
    </div>
  );
}

export default App;