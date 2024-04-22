import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const handleLogin = () => {
    const clientId = '1421335018587943';
    const redirectUri = encodeURIComponent('https://test-235b1.web.app/fbauth');
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Login to Instagram</h1>
      <button onClick={handleLogin}>Log in with Instagram</button>
    </div>
  );
}

function FbAuth() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
  }, [location]);

  const exchangeCodeForToken = (code) => {
    // Assume backendUrl points to your backend server
    const backendUrl = 'http://localhost:3001/exchange-code';
    axios.post(backendUrl, { code })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => console.error('Error processing authentication:', error));
  };

  return (
    <div>
      {userData ? (
        <div>
          <h1>Welcome, {userData.user.username}</h1>
          <p>User ID: {userData.user.id}</p>
          <p>Media Count: {userData.user.media_count}</p>
        </div>
      ) : (
        <h1>Authenticating...</h1>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/fbauth" element={<FbAuth />}>          
        </Route>
        <Route path="/" element={<Login />}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
