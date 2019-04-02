import axios from "axios";
import Auth from "./authentication";

class API {
  constructor(server, auth = true) {
    this.server = server;
    this.config = {
      crossdomain: true,
      headers: {}
    };

    if (auth) {
      this.auth = new Auth();
      this.config.headers = this.auth.authHeader();
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

    axios
      .put(url, body, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  addDevice(body, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device";

    axios
      .post(url, body, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  getDevices(cbSuccess, cbError, validate = null) {
    const url = this.server + "/devices";

    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  deleteDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/delete";

    axios
      .delete(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  // TODO: add to api on server
  streamDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/stream";

    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  statusDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/status";

    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  recordDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/record";

    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  cleanupDevice(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/device/" + id + "/cleanup";

    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  addVideo(id, body, cbSuccess, cbError, validate = null) {
    const url = this.server + "/video/" + id;

    axios
      .post(url, body, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  getVideos(cbSuccess, cbError, validate = null) {
    const url = this.server + "/videos";

    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  deleteVideo(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/video/" + id + "/delete";

    axios
      .delete(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  viewVideo(id, name, cbSuccess, cbError, validate = null) {
    const url = this.server + "/video/" + id + "/view/" + name;

    axios
      .get(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  addViewVideo(id, cbSuccess, cbError, validate = null) {
    const url = this.server + "/video/" + id + "/view";

    axios
      .put(url, this.config)
      .then(res => this.successResponse(res, cbSuccess, cbError, validate))
      .catch(err => this.catchError(err, cbError));
  }

  successResponse(res, cbSuccess, cbError, validate) {
    if (res.status === 200 && res.data.success) {
      if (validate === null) {
        return cbSuccess(res.data);
      }

      if (validate !== null && validate(res.data)) {
        return cbSuccess(res.data);
      }

      return cbError("field validation error");
    }

    // Good status but bad success status
    if (res.status === 200 && !res.data.success) {
      console.log(res.data.message);
      return cbError(res.data.message);
    }

    // Unauthorized
    if (res.status === 401 || res.status === 403) {
      window.location.replace("/unauthorized");
      cbError("unauthorized access");
    }

    // Not found
    if (res.status === 404) {
      window.location.replace("/error");
      cbError("page not found");
    }

    return cbError("unknown error");
  }

  catchError(err, callback) {
    console.log(err);
    return callback("error connecting to server");
  }
}

export default API;
