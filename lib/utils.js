import _ from 'lodash';

export function randomString (length) {
  let randomStr = '';
  for (let i = 0; i < length; i++) {
    randomStr += _.sample('abcdefghijklmnopqrstuvwxyz0123456789');
  }
  return randomStr;
}