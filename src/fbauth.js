// FacebookLogin.js

import React, { useEffect, useCallback } from 'react';

const FacebookLogin = () => {
    // Wrap statusChangeCallback with useCallback to ensure it remains stable between renders
    const statusChangeCallback = useCallback((response) => {
        if (response.status === 'connected') {
            testAPI();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, []); // Add dependencies here if any variables from the component scope are used

    // Define testAPI inside the component because it uses statusChangeCallback
    const testAPI = useCallback(() => {
        window.FB.api('/me', {fields: 'name,email'}, function(response) {
            document.getElementById("profile").innerHTML = `Good to see you, ${response.name}. I see your email address is ${response.email}.`;
        });
    }, [statusChangeCallback]);

    useEffect(() => {
        // Load the Facebook SDK script
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');

        // Initialize the SDK after the script loads
        window.fbAsyncInit = function() {
            window.FB.init({
                appId: '7448986741860655',
                xfbml: true,
                version: 'v19.0'
            });

            window.FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        };
    }, [statusChangeCallback]);

    const checkLoginState = useCallback(() => {
        window.FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }, [statusChangeCallback]);

    const handleFBLogin = useCallback(() => {
        window.FB.login(checkLoginState, {scope: 'email,public_profile'});
    }, [checkLoginState]);

    return (
        <div>
            <h2>Add Facebook Login to your webpage</h2>
            <button onClick={handleFBLogin}>Login with Facebook</button>
            <p id="profile"></p>
        </div>
    );
}

export default FacebookLogin;
