
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

// a request helper which reads the access_token from the redux state and passes it in its HTTP request
export default function request(token, url, method = 'GET') {
  const headers = new Headers();
  if(token) {
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  const options = {
    method,
    headers
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => ({data}))
    .catch((error) => ({ error }));
}