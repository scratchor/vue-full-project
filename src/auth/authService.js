import auth0 from "auth0-js";
import EventEmitter from "events";

const options = {
  domain: "vuejs-auth0.eu.auth0.com",
  redirectUri: "http://localhost:8080/callback",
  clientID: "szBmlacf31bZRWSxnDLlp2M3EDkQd7rR",
  responseType: "token id_token",
  scope: "openid profile email"
};

const webAuth = new auth0.WebAuth(options);

// Other imports and WebAuth declaration..

const localStorageKey = "loggedIn";
const loginEvent = "loginEvent";

class AuthService extends EventEmitter {
  idToken = null;

  profile = null;

  tokenExpiry = null;

  // Starts the user login flow

  login(customState) {
    this.webAuth.authorize({
      appState: customState
    });
  }

  // Handles the callback request from Auth0
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuth.parseHash((err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult.idToken);
        }
      });
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;

    // Convert the JWT expiry time from seconds to milliseconds
    this.tokenExpiry = new Date(this.profile.exp * 1000);

    localStorage.setItem(localStorageKey, "true");

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {}
    });
  }

  renewTokens() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== "true") {
        return reject(new Error("Not logged in"));
      }

      return webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  }

  logOut() {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

    webAuth.logout({
      returnTo: window.location.origin
    });

    this.emit(loginEvent, { loggedIn: false });
  }

  isAuthenticated() {
    return Date.now() < this.tokenExpiry && localStorage.getItem(localStorageKey) === "true";
  }

  // eslint-disable-next-line class-methods-use-this
  isExpired() {
    return localStorage.getItem(localStorageKey) === "true";
  }
}

export default new AuthService();
