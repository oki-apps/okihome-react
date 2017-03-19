
const config = {
  base : 'http://localhost:8585',
  baseApi : 'http://localhost:8585/api',
}

const PopupCenter = function($window, $document, url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = $window.screenLeft !== undefined ? $window.screenLeft : screen.left;
  var dualScreenTop = $window.screenTop !== undefined ? $window.screenTop : screen.top;

  var width = $window.innerWidth ? $window.innerWidth : $document.documentElement.clientWidth ? $document.documentElement.clientWidth : screen.width;
  var height = $window.innerHeight ? $window.innerHeight : $document.documentElement.clientHeight ? $document.documentElement.clientHeight : screen.height;

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = $window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (newWindow.focus) {
    newWindow.focus();
  }
};

export const connectAccount = function(token, serviceName, serviceTitle){
  const url=config.base+'/pages/services/'+serviceName+'/register?auth='+token

  PopupCenter(window, document, url, 'Okihome connection to ' + serviceTitle, 480, 400)
}

export const getVersion = function(token){
  return request(token,config.baseApi+'/version')
};

export const getServices = function(token){
  return request(token,config.baseApi+'/services')
};

export const getUser = function(token, userId){
  return request(token,config.baseApi+'/users/'+userId)
};

export const getTab = function(token, tabId){
  return request(token,config.baseApi+'/tabs/'+tabId)
};

export const addTab = function(token, tabTitle){
  return request(token,config.baseApi+'/tabs','POST',{title: tabTitle})
};

export const updateTab = function(token, tabId, tabTitle){
  return request(token,config.baseApi+'/tabs/'+tabId,'POST',{title: tabTitle})
};

export const deleteTab = function(token, tabId){
  return request(token,config.baseApi+'/tabs/'+tabId,'DELETE')
};

export const saveTabLayout = function(token, tabId, layout){
  return request(token,config.baseApi+'/tabs/'+tabId+'/layout','POST',layout)
};

export const getFeedItems = function(token, userId, feedId) {
  return request(token,config.baseApi+'/users/'+userId+'/feeds/'+feedId+'/items')
};

export const readFeedItems = function(token, userId, feedId, itemGuids) {
  return request(token,config.baseApi+'/users/'+userId+'/feeds/'+feedId, 'POST', {guids: itemGuids})
};

export const addWidget = function(token, tabId, widget){
return request(token,config.baseApi+'/tabs/'+tabId+'/widgets','POST',widget)
};

export const saveWidgetConfig = function(token, tabId, widgetId, data) {
  return request(token,config.baseApi+'/tabs/'+tabId+'/widgets/'+widgetId, 'POST', data)
};

export const deleteWidget = function(token, tabId, widgetId) {
  return request(token,config.baseApi+'/tabs/'+tabId+'/widgets/'+widgetId, 'DELETE')
};

export const getAccounts = function(token, userId) {
  return request(token,config.baseApi+'/users/'+userId+'/accounts')
};

export const revokeAccount = function(token, userId, accountId) {
  return request(token,config.baseApi+'/users/'+userId+'/accounts/'+accountId, 'DELETE')
};

export const getEmailItems = function(token, userId, accountId) {
  return request(token,config.baseApi+'/users/'+userId+'/accounts/'+accountId+'/emails')
};

// a request helper which reads the access_token from the redux state and passes it in its HTTP request
export default function request(token, url, method = 'GET', bodyObject = null) {
  const headers = new Headers();
  if(token) {
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
  }
  let body = null;
  if(bodyObject){
    headers.append('Content-Type', 'application/json');
    body =  JSON.stringify(bodyObject)
  }
  const options = {
    method,
    headers,
    body,
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => ({data}))
    .catch((error) => ({ error }));
}