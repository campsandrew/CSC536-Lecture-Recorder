class Auth {
  constructor() {
    this.accessToken = localStorage.getItem("access_token");
    this.expiresAt = localStorage.getItem("expires_at");
  }

  authenticate() {}

  handleAuthentication() {}

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    //history.replace("/");
  }

  isAuthenticated() {
    return new Date().getTime() < JSON.parse(this.expiresAt);
  }

  authHeader() {
    return { accesstoken: this.accessToken };
  }

  setSession(authResult) {
    this.expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    this.accessToken = authResult.accessToken;
    localStorage.setItem("access_token", this.accessToken);
    localStorage.setItem("expires_at", this.expiresAt);
  }
}

export default Auth;
