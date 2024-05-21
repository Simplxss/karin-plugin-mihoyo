import { db } from './init.js';

export default class MihoyoAccount {
  createByGameToken (account_id, game_token) {

  }

  save () {
    db.prepare('INSERT INTO MihoyoAccount (type, ltuid, ltoken, login_token, account_mid_v2, cookie_token_v2, ltoken_v2, ltmid_v2) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(this.type, this.ltuid, this.ltoken, this.login_token, this.account_mid_v2, this.cookie_token_v2, this.ltoken_v2, this.ltmid_v2)
      .finalize()

  }
}