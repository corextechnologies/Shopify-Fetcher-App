// app/utils/tokenStore.js

let apiToken = null;

export function setApiToken(token) {
  apiToken = token;
}

export function getApiToken() {
  return apiToken;
}

export function clearApiToken() {
  apiToken = null;
}
