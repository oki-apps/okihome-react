import { createUserManager } from 'redux-oidc';

const userManagerConfig = {
  client_id: 'okihome-app',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  response_type: 'id_token token',
  scope: 'openid profile email offline_access',
  authority: 'https://login.xdbsoft.com/',
  loadUserInfo: false,
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
