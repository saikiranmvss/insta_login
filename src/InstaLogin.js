import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  const instagramClientId = '1421335018587943';
  const instagramClientSecret = '293ef37b66b6d7157db8a99c2fa584d0'; // WARNING: Never expose in production!
  const redirectUri = 'https://test-235b1.web.app/fbauth';

  const fetchAccessToken = (code) => {
    // Normally, this should be a POST request to your server, which would handle the token exchange
    const tokenUrl = `https://api.instagram.com/oauth/access_token`;

    const params = new URLSearchParams();
    params.append('client_id', instagramClientId);
    params.append('client_secret', instagramClientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri);
    params.append('code', code);

    axios.post(tokenUrl, params)
      .then(response => {
        console.log(response.data); // Access token and user info will be in response.data
        getUserDetails(response.data.access_token);
      })
      .catch(error => console.error('Error fetching access token:', error));
  };

  const getUserDetails = (accessToken) => {
    // This would use the Instagram Graph API to fetch user data
    // Normally requires additional backend handling
    const apiUrl = 'https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=' + accessToken;
    
    axios.get(apiUrl)
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => console.error('Error fetching user data:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => {
          const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramClientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
          window.location.href = authUrl;
        }}>
          Log in with Instagram
        </button>
        {userData && <div>
          <h1>{userData.username}</h1>
          <img src={userData.profile_picture} alt="profile" />
        </div>}
      </header>
    </div>
  );
}

export default App;
