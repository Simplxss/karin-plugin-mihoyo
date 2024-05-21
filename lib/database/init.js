import sqlite3_pkg from 'sqlite3';
import { dataPath } from '../imports/dir.js'
import { logger } from '../../../../lib/index.js';

const sqlite3 = sqlite3_pkg.verbose()

let db = new sqlite3.Database(dataPath + '/data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      logger.error("[DATABASE] Can't open database file.")
      return;
    }
    db.exec(`
          create table if not exist User (
              user_id text primary key not null,
              mihoyo_accounts text,
              data text
          );
          create table if not exist MihoyoAccount (
              account_id int primary key not null,
              type text not null,
              ltuid text not null,
              ltoken text not null,
              login_token text not null,
              account_mid_v2 text not null,
              cookie_token_v2 text not null,
              ltoken_v2 text not null,
              ltmid_v2 text not null
          );
        `, (err) => {
      if (err) {
        logger.error("[DATABASE] Can't create tables.")
        return;
      }
    });
  }
)

export { db }