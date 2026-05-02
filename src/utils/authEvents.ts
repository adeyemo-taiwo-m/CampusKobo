import { EventEmitter } from 'events';

class AuthEventEmitter extends EventEmitter {}

export const authEvents = new AuthEventEmitter();

export const AUTH_EVENTS = {
  TOKEN_EXPIRED: 'AUTH_EXPIRED',
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGED_IN: 'LOGGED_IN',
};
