class Auth {
  constructor() {
    this.accessToken = localStorage.getItem("access_token");
    this.expiresAt = localStorage.getItem("expires_at");
  }

  authenticate(res, cbSuccess, cbError, validate) {
    if (res.status === 200 && res.data.success) {
      if (validate === null) {
        this.setSession(res.data.auth);
        return cbSuccess(res.data.user);
      }

      if (validate !== null && validate(res.data)) {
        this.setSession(res.data.auth);
        return cbSuccess(res.data.user);
      }

      return cbError("authentication field validation error");
    }

    // Good status but bad success status
    if (res.status === 200 && !res.data.success) {
      console.log(res.data.message);
      return cbError(res.data.message);
    }

    return cbError("unknown error");
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    window.location.replace("/");
  }

  isAuthenticated() {
    if (new Date().getTime() < this.expiresAt && this.accessToken) {
      return true;
    }

    return false;
  }

  authHeader() {
    return { accessToken: this.accessToken };
  }

  setSession(auth) {
    this.expiresAt = auth.expiresAt;
    this.accessToken = auth.accessToken;
    localStorage.setItem("access_token", this.accessToken);
    localStorage.setItem("expires_at", this.expiresAt);
  }
}

export default Auth;
