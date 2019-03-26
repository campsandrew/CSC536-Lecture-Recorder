export default class Auth {
  login() {}

  logout() {}

  isAuthenticated(server) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return false;
    }
  }
}
