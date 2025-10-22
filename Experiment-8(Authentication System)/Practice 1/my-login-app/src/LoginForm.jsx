import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password.');
    } else {
      setError(''); 
      console.log('Login successful with:', username, password);
      
     
      setIsLoggedIn(true); 
    }
  };


  if (isLoggedIn) {
    return (
      <div className="login-container">
        <h2 className="success-message">Login Successful!</h2>
        <p className="welcome-message">Welcome, {username}!</p>
      </div>
    );
  }

 
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;