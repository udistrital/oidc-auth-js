import {hash} from './md5.js';

var GENERAL = 
{
  ENTORNO:{
    TOKEN:{}
  }
}
var logout_url="";
var setting_bearer={
  headers:{}
}

if (window.localStorage.getItem('access_token') === null ||
  window.localStorage.getItem('access_token') === undefined) {
  var params = {},
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
    //if token setearñp
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
  }
  setExpiresAt();
  timer();
  /*else {
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
}*/

export function init() {
  console.log("entro a init")
  this.clearUrl();
  //var logOut = '';
  this.timer();
}

export function setGeneral(url_token){
  GENERAL.ENTORNO.TOKEN=url_token;
}

// const GENERAL = {
//   ENTORNO: {
//     TOKEN: {
//       AUTORIZATION_URL: "https://autenticacion.udistrital.edu.co/oauth2/authorize",
//       URL_USER_INFO: "https://autenticacion.udistrital.edu.co/oauth2/userinfo",
//       CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
//       REDIRECT_URL: "http://localhost:9000/",
//       RESPONSE_TYPE: "id_token token",
//       SCOPE: "openid email",
//       BUTTON_CLASS: "btn btn-warning btn-sm",
//       SIGN_OUT_URL: "https://autenticacion.udistrital.edu.co/oidc/logout",
//       SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
//       SIGN_OUT_APPEND_TOKEN: "true",
//       REFRESH_TOKEN: "https://autenticacion.udistrital.edu.co/oauth2/token",
//     }
//   }
// }


export function logout() {
  window.location.replace(logout_url);
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

 export function logoutValid () {
  console.log("entro a logout valid")
  var state;
  var valid = true;
  var queryString = location.search.substring(1);
  var regex = /([^&=]+)=([^&]*)/g;
  var m;
  while (!!(m = regex.exec(queryString))) {
    state = decodeURIComponent(m[2]);
  }
  if (window.localStorage.getItem('state') === state) {
    window.localStorage.clear();
    valid = true;
  } else {
    valid = false;
  }
  return valid;
}

export function live() {
  if (window.localStorage.getItem('id_token') !== null && window.localStorage.getItem('id_token') !== undefined && !this.logoutValid() ) {
    var bearer = {
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'authorization': 'Bearer ' + window.localStorage.getItem('access_token'),
        'cache-control': 'no-cache',
      }),
    }
    this.setExpiresAt();
    return true;
  } else {
    this.getAuthorizationUrl()
    return false;
  }
}

 export function live_token () {
  if (window.localStorage.getItem('id_token') === 'undefined' || window.localStorage.getItem('id_token') === null || this.logoutValid()) {
    this.getAuthorizationUrl();
    return false;
  } else {
      setting_bearer = {
      headers: new Headers({
        headers: {
          'Accept': 'application/json',
          "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
        }    
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'authorization': 'Bearer ' + window.localStorage.getItem('access_token'),
        // 'cache-control': 'no-cache',
      }),
    }
    logout_url = GENERAL.ENTORNO.TOKEN.SIGN_OUT_URL;
    logout_url += '?id_token_hint=' + window.localStorage.getItem('id_token');
    logout_url += '&post_logout_redirect_uri=' + GENERAL.ENTORNO.TOKEN.SIGN_OUT_REDIRECT_URL;
    logout_url += '&state=' + window.localStorage.getItem('state');
    return true;
  }
}

export function getHeader () {
  setting_bearer = {
    headers: {
      'Accept': 'application/json',
      "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
    } 
  }
  return setting_bearer;
}

export function getAuthorizationUrl() {
   params = GENERAL.ENTORNO.TOKEN;
  if (!params.nonce) {
    params.nonce = this.generateState();
  }
  if (!params.state) {
    params.state = this.generateState();
  }
  let url = params.AUTORIZATION_URL + '?' +
    'client_id=' + encodeURIComponent(params.CLIENTE_ID) + '&' +
    'redirect_uri=' + encodeURIComponent(params.REDIRECT_URL) + '&' + // + window.location.href + '&' para redirect con regex
    'response_type=' + encodeURIComponent(params.RESPONSE_TYPE) + '&' +
    'scope=' + encodeURIComponent(params.SCOPE) + '&' +
    'state_url=' + encodeURIComponent(window.location.hash);
  if (params.nonce) {
    url += '&nonce=' + encodeURIComponent(params.nonce);
  }
  url += '&state=' + encodeURIComponent(params.state);
  // alert(url);
  window.location = url;
  return url;
}


export function generateState() {
  const text = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
  console.log("general: "+GENERAL.ENTORNO.TOKEN.AUTORIZATION_URL)
  return hash(text);
}

export function setExpiresAt() {
  if (window.localStorage.getItem('expires_at') === null || window.localStorage.getItem('expires_at') === undefined) {
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + parseInt(window.localStorage.getItem('expires_in'), 10) - 60);
    window.localStorage.setItem('expires_at', expires_at.toUTCString());
  }
}

export function expired() {
  return (new Date(window.localStorage.getItem('expires_at')) < new Date());
}

export function timer() {
  setInterval(()=>{
    console.log("entro a timer")
   if (window.localStorage.getItem('expires_at') !== null || window.localStorage.getItem('expires_at')!== undefined) {
      if (expired()) {
        window.localStorage.clear();
      }
    }
  },5000)
}