import axios from "axios";
import Auth from "./authentication";

class API {
  constructor(server, auth) {
    this.server = server;
    this.config = { crossdomain: true, headers: {} };
    if (auth) {
      this.auth = new Auth();
    }
  }

  login(body) {
    const url = this.server + "/user/login";

    this.auth.authenticate();
  }

  register(body) {
    const url = this.server + "/user";
  }

  catchError(err) {}
  //  const url = this.state.server + "/user?name=true";
  //  const token = localStorage.getItem("accessToken");
  //  const config = {
  //    crossdomain: true,
  //    headers: { accessToken: token }
  //  };
  //  const self = this;
  //  if (!token) {
  //    return;
  //  }
  //  // Try to get user
  //  axios
  //    .get(url, config)
  //    .then(function(res) {
  //      if (res.status !== 200 || !res.data.success) {
  //        localStorage.removeItem("accessToken");
  //        if (res.status === 401) {
  //          //return window.location.replace("/unauthorized");
  //        }
  //        return;
  //      }
  //      self.setState({
  //        user: res.data.name
  //      });
  //    })
  //    .catch(function(err) {
  //      localStorage.removeItem("accessToken");
  //    });
  //   router.post("/device", authUser, addDeviceRoute);
  // router.get("/devices", authUser, getDevicesRoute);
  // router.delete(
  //   "/device/:deviceid/delete",
  //   authUser,
  //   getDevice,
  //   deleteDeviceRoute
  // );
  // router.get("/device/:deviceid/status", authUser, getDevice, deviceStatusRoute);
  // router.get("/device/:deviceid/record", authUser, getDevice, deviceRecordRoute);
  // router.get("/device/:deviceid/cleanup", authUser, deviceCleanupRoute);
  //   router.get("/user", authUser, getUserRoute);
  // router.post("/user", addUserRoute);
  // router.post("/user/login", loginUserRoute);
  // router.put("/user/lecturer", authUser, addLecturerRoute);
  //   router.post("/video/:deviceid", authUser, getDevice, addVideoRoute);
  // router.get("/videos", authUser, getVideosRoute);
  // router.delete("/video/:videoid/delete", authUser, getVideo, deleteVideoRoute);
  // router.get("/video/:videoid/view/:filename", authUser, viewVideoRoute);
  // router.put("/video/:videoid/view", authUser, getVideo, addViewRoute);
}

export default API;
