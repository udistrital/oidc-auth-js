
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs/Rx';

if (window.localStorage.getItem('access_token') === null ||
  window.localStorage.getItem('access_token') === undefined) {
  const params = {},
    queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g;
  let m;
  while (m = regex.exec(queryString)) {

    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  // And send the token over to the server
  const req = new XMLHttpRequest();
  // consider using POST so query isn't logged
  const query = 'https://' + window.location.host + '?' + queryString;
  req.open('GET', query, true);
  if (params['id_token'] !== null && params['id_token'] !== undefined) {
    window.localStorage.setItem('access_token', params['access_token']);
    window.localStorage.setItem('id_token', params['id_token']);
    window.localStorage.setItem('expires_in', params['expires_in']);
    window.localStorage.setItem('state', params['state']);
  } else {
    window.localStorage.clear();
  }
  req.onreadystatechange = function (e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        // window.location = params.state;
      } else if (req.status === 400) {
        window.alert('There was an error processing the token.');
      } else {
        // alert('something else other than 200 was returned');
        // console.info(req);
      }
    }
  };
} else {
  let state;
  const queryString = location.search.substring(1);
  const regex = /([^&=]+)=([^&]*)/g;
  let m;
  while (!!(m = regex.exec(queryString))) {
    state = decodeURIComponent(m[2]);
  }
  if (window.localStorage.getItem('state') === state) {
    window.localStorage.clear();
    const uri = window.location.toString();
    if (uri.indexOf('?') > 0) {
      const clean_uri = uri.substring(0, uri.indexOf('?'));
      window.history.replaceState({}, document.title, clean_uri);
    }
  }
}

export function init() {
  this.clearUrl();
  this.logOut = '';
  this.timer();
}
const GENERAL = {
  ENTORNO: {
    TOKEN: {
      AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
      URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
      CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
      REDIRECT_URL: "http://localhost:9000/",
      RESPONSE_TYPE: "id_token token",
      SCOPE: "openid email",
      BUTTON_CLASS: "btn btn-warning btn-sm",
      SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
      SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
      SIGN_OUT_APPEND_TOKEN: "true",
      REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
    }
  }
}

export function logout() {
  this.logOut = GENERAL.ENTORNO.TOKEN.SIGN_OUT_URL;
  this.logOut += '?id_token_hint=' + window.localStorage.getItem('id_token');
  this.logOut += '&post_logout_redirect_uri=' + GENERAL.ENTORNO.TOKEN.SIGN_OUT_REDIRECT_URL; // // + window.location.href; para redirect con regex
  this.logOut += '&state=' + window.localStorage.getItem('state');
  window.location.replace(this.logOut);
  return this.logOut;
}

export function clearUrl() {
  const uri = window.location.toString();
  if (uri.indexOf('?') > 0) {
    const clean_uri = uri.substring(0, uri.indexOf('?'));
    window.history.replaceState({}, document.title, clean_uri);
  }
}

export function getPayload() {
  if (this.live) {
    const id_token = window.localStorage.getItem('id_token').split('.');
    return JSON.parse(atob(id_token[1]));
  } else {
    return false;
  }
}

export function live() {
  if (window.localStorage.getItem('id_token') !== null && window.localStorage.getItem('id_token') !== undefined) {
    this.bearer = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'authorization': 'Bearer ' + window.localStorage.getItem('access_token'),
        'cache-control': 'no-cache',
      }),
    }
    this.setExpiresAt();
    return true;
  } else {
    return false;
  }
}

export function getAuthorizationUrl() {
  this.params = GENERAL.ENTORNO.TOKEN;
  if (!this.params.nonce) {
    this.params.nonce = this.generateState();
  }
  if (!this.params.state) {
    this.params.state = this.generateState();
  }
  let url = this.params.AUTORIZATION_URL + '?' +
    'client_id=' + encodeURIComponent(this.params.CLIENTE_ID) + '&' +
    'redirect_uri=' + encodeURIComponent(this.params.REDIRECT_URL) + '&' + // + window.location.href + '&' para redirect con regex
    'response_type=' + encodeURIComponent(this.params.RESPONSE_TYPE) + '&' +
    'scope=' + encodeURIComponent(this.params.SCOPE) + '&' +
    'state_url=' + encodeURIComponent(window.location.hash);
  if (this.params.nonce) {
    url += '&nonce=' + encodeURIComponent(this.params.nonce);
  }
  url += '&state=' + encodeURIComponent(this.params.state);
  // alert(url);
  return url;
}


export function generateState() {
  const text = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
  return Md5.hashStr(text);
}

export function setExpiresAt() {
  if (window.localStorage.getItem('expires_at') === null) {
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() +
      parseInt(window.localStorage.getItem('expires_in'), 10) - 60);
    window.localStorage.setItem('expires_at', expires_at.toUTCString());
  }
}

export function expired() {
  return (new Date(window.localStorage.getItem('expires_at')) < new Date());
}

export function timer() {
  Observable.interval(5000).subscribe(() => {
    if (window.localStorage.getItem('expires_at') !== null) {
      if (this.expired()) {
        window.localStorage.clear();
      }
    }
  });
}