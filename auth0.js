auth0 = new auth0.WebAuth({
  domain:       'adobot.auth0.com',
  clientID:     'E7v0bIDB2bM4ICfIgbWPbe6J6T54hsiT',
  redirectUri:  'http://localhost:3000',
  audience:     `https://adobot.auth0.com/userinfo`,
  responseType: 'token id_token',
  audience:     'gifbattle',
  scope:        'openid'
});

window.authService = {

  isAuthenticated: function() {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  },

  logout: function() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    app.isLoggedIn = false;
  },

  setSession: function (authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  },

  login: function() {
    auth0.authorize();
  },

  handleAuthentication: function() {
    auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        authService.setSession(authResult);
        window.location.hash = '';
        app.isLoggedIn       = true;
      } else if (err) {
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    })
  }
};