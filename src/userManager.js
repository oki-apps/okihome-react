import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
  client_id: '88998355665-78cac36apbrms0gcvbht5gsv508ldakb.apps.googleusercontent.com',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'token id_token',
  scope: 'openid profile email',
  authority: 'https://accounts.google.com',
  filterProtocolClaims: true,
  loadUserInfo: true,
};
/*
const userManagerConfig = {
  client_id: 'okihome-app',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'id_token token',
  scope: 'openid profile email offline_access',
  authority: 'http://127.0.0.1:5556/dex',
  loadUserInfo: false,
};*/

const userManager = createUserManager(userManagerConfig);

export default userManager;