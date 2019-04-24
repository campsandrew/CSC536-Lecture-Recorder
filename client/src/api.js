import axios from "axios";
import Auth from "./authentication";

class API {
  constructor(server, auth = true) {
    this.server = server;
    this.config = {
      crossdomain: true,
      headers: {}
    };

    this.auth = null;
    if (auth) {
      this.auth = new Auth();
      this.config.headers = this.auth.authHeader();
    }

    this.executeCallback = (callbacks, data) => {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }

      for (let callback of callbacks) {
        callback(data);
      }
    };
  }

  checkAuth() {
    if (this.auth !== null && !this.auth.isAuthenticated()) {
      window.location.replace("/unauthorized");
    }
  }

  serverConnector(cbSuccess, cbError, validate = null) {
    axios
      .get(this.server, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  loginUser(body, cbSuccess, cbError, validate = null) {
    const url = this.server + "/user/login";

    axios
      .post(url, body, this.config)
      .then(res => {
        this.auth.authenticate(res, cbSuccess, cbError, validate);
        this.config.headers = this.auth.authHeader();
      })
      .catch(err => this.catchError(err, cbError));
  }

  getUser(cbSuccess, cbError, validate = null) {
    const url = this.server + "/user?name=true&type=true";

    this.checkAuth();
    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  registerUser(body, cbSuccess, cbError, validate = null) {
    const url = this.server + "/user";

    axios
      .post(url, body, this.config)
      .then(res => {
        this.auth.authenticate(res, cbSuccess, cbError, validate);
        this.config.headers = this.auth.authHeader();
      })
      .catch(err => this.catchError(err, cbError));
  }

  addLecturer(body, cbSuccess, cbError, validate = null) {
    const url = this.server + "/user/lecturer";

    this.checkAuth();
    axios
      .put(url, body, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  addDevice(body, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device";

    this.checkAuth();
    axios
      .post(url, body, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  getDevices(cbSuccess, cbError, validate = null) {
    const url = this.server + "/devices";

    this.checkAuth();
    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  deleteDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/delete";

    this.checkAuth();
    axios
      .delete(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  statusDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/status";

    this.checkAuth();
    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  recordDevice(id, body, recording, cbSuccess, cbError, validate = null) {
    let url = this.server + "/device/" + id + "/record?action=";
    if (!recording) {
      url = url + "start";
    } else {
      url = url + "stop";
    }

    this.checkAuth();
    axios
      .post(url, body, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  shutdownDevice(id, cbSuccess, cbError, validate = null) {
    let url = this.server + "/device/" + id + "/cleanup?shutdown=true";

    this.checkAuth();
    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  cleanupDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/cleanup";

    this.checkAuth();
    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  getVideos(cbSuccess, cbError, validate = null) {
    const url = this.server + "/videos";

    this.checkAuth();
    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  deleteVideo(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/video/" + id + "/delete";

    this.checkAuth();
    axios
      .delete(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  getVideoSrc(video) {
    const url =
      this.server +
      "/video/" +
      video.id +
      "/view/" +
      video.filename +
      "?accesstoken=" +
      this.config.headers.accessToken;

    return url;
  }

  addViewVideo(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/video/" + id + "/view";

    this.checkAuth();
    axios
      .put(url, {}, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  successResponse(res, cbSuccess, cbError, validate) {
    if (res.status === 200 && res.data.success) {
      if (validate === null) {
        return this.executeCallback(cbSuccess, res.data);
      }
      if (validate !== null && validate(res.data)) {
        return this.executeCallback(cbSuccess, res.data);
      }

      return this.executeCallback(cbError, "field validation error");
    }

    // Good status but bad success status
    if (res.status === 200 && !res.data.success) {
      return this.executeCallback(cbError, res.data);
    }

    return this.executeCallback(cbError, "unknown error");
  }

  catchError(err, cb) {
    if (!err.response) {
      return this.executeCallback(cb, "server error");
    }

    // Unauthorized
    if (err.response.status === 401 || err.response.status === 403) {
      window.location.replace("/unauthorized");
      this.executeCallback(cb, "unauthorized access");
    }

    // Not found
    if (err.response.status === 404) {
      window.location.replace("/error");
      this.executeCallback(cb, "page not found");
    }
  }
}

export default API;
