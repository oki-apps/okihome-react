/*
 * action types
 */

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SET_VERSION = 'SET_VERSION'

/*
 * other constants
 */

/*
 * action creators
 */

export function login(user) {
  return { type: LOGIN, user }
}

export function logout() {
  return { type: LOGOUT }
}

export function version(version) {
  return { type: SET_VERSION, version }
}