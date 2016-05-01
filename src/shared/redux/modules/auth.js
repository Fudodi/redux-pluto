import { createAction, handleActions } from 'redux-actions';
import { bind } from 'redux-effects';
import { compose } from 'recompose';
import { initialState, filterActionType } from './utils';

/**
 * Action types
 */
const AUTH = 'redux-proto/auth/';

const AUTH_CHECK_LOGIN = AUTH + 'check/';
export const AUTH_CHECK_LOGIN_REQUEST = AUTH_CHECK_LOGIN + 'request';
export const AUTH_CHECK_LOGIN_SUCCESS = AUTH_CHECK_LOGIN + 'success';
export const AUTH_CHECK_LOGIN_FAIL = AUTH_CHECK_LOGIN + 'fail';

const AUTH_LOGIN = AUTH + 'login/';
export const AUTH_LOGIN_REQUEST = AUTH_LOGIN + 'request';
export const AUTH_LOGIN_SUCCESS = AUTH_LOGIN + 'success';
export const AUTH_LOGIN_FAIL = AUTH_LOGIN + 'fail';

const AUTH_LOGOUT = AUTH + 'logout/';
export const AUTH_LOGOUT_REQUEST = AUTH_LOGOUT + 'request';
export const AUTH_LOGOUT_SUCCESS = AUTH_LOGOUT + 'success';
export const AUTH_LOGOUT_FAIL = AUTH_LOGOUT + 'fail';

/**
 * Action creators
 */
const checkLoginRequest = createAction(AUTH_CHECK_LOGIN_REQUEST);

const checkLoginSuccess = createAction(AUTH_CHECK_LOGIN_SUCCESS);

const checkLoginFail = createAction(AUTH_CHECK_LOGIN_FAIL);

export function checkLogin() {
  return bind(checkLoginRequest(), checkLoginSuccess, checkLoginFail);
}

const loginRequest = createAction(AUTH_LOGIN_REQUEST,
  (username, password, location) => ({ params: { username, password }, location }));

const loginSuccess = createAction(AUTH_LOGIN_SUCCESS);

const loginFail = createAction(AUTH_LOGIN_FAIL);

export function login(username, password, location) {
  return bind(loginRequest(username, password, location), loginSuccess, loginFail);
}

const logoutRequest = createAction(AUTH_LOGOUT_REQUEST);

const logoutSuccess = createAction(AUTH_LOGOUT_SUCCESS);

const logoutFail = createAction(AUTH_LOGOUT_FAIL);

export function logout() {
  return bind(logoutRequest(), logoutSuccess, logoutFail);
}

/**
 * Initial state
 */
const INITIAL_STATE = {
  login: false,
  username: null,
};

/**
 * Reducer
 */
export default compose(
  initialState(INITIAL_STATE),
  filterActionType(AUTH),
)(handleActions({
  [AUTH_CHECK_LOGIN_SUCCESS]: loggedIn,
  [AUTH_LOGIN_SUCCESS]: loggedIn,
  [AUTH_CHECK_LOGIN_FAIL]: loggedOut,
  [AUTH_LOGIN_FAIL]: loggedOut,
  [AUTH_LOGOUT_SUCCESS]: loggedOut,
}));

function loggedIn(state, { payload: { sub } }) {
  return state.login && state.username === sub ? state : {
    login: true,
    username: sub,
  };
}

function loggedOut(state, action) {
  return INITIAL_STATE;
}
