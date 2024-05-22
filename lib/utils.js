import _ from 'lodash';

export function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function randomString (length) {
  let randomStr = '';
  for (let i = 0; i < length; i++) {
    randomStr += _.sample('abcdefghijklmnopqrstuvwxyz0123456789');
  }
  return randomStr;
}