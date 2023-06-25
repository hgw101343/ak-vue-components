import Cookies from 'js-cookie';

const TokenKey = 'vue_admin_template_token';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
export function setLocalData(key, data) {
  return localStorage.setItem(key, data);
}

export function getLocalData(key) {
  return localStorage.getItem(key);
}
export function removeLocalData(key) {
  return localStorage.removeItem(key);
}
