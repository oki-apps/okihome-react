
const config = {
  baseApi : 'http://localhost:8585/api',
}

export const getVersion = function(token){
  return request(token,config.baseApi+'/version')
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

export const getFeedItems = function(token, userId, feedId) {
  return request(token,config.baseApi+'/users/'+userId+'/feeds/'+feedId+'/items')
}

export const readFeedItems = function(token, userId, feedId, itemGuids) {
  return request(token,config.baseApi+'/users/'+userId+'/feeds/'+feedId, 'POST', {guids: itemGuids})
}

export const saveWidgetConfig = function(token, tabId, widgetId, data) {
  return request(token,config.baseApi+'/tabs/'+tabId+'/widgets/'+widgetId, 'POST',data)
}

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