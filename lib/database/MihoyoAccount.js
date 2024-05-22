import takumi from '../apis/takumi.js';
import { db } from './init.js';

export default class MihoyoAccount {
  constructor (type, account_id) {
    this.type = type
    this.account_id = account_id
  }

  async createByGameToken (game_token) {
    this.game_token = game_token
    await takumi.getToken(this.account_id, game_token).then(res => {
      this.stoken = res.stoken
      this.mid = res.mid
    })
  }

  async createByStoken (stoken, mid) {
    this.stoken = stoken
    this.mid = mid
  }

  async save () {
    db.prepare('insert or replace into MihoyoAccount (account_id, type, mid, stoken, game_token) values (?, ?, ?, ?, ?)')
      .run(this.account_id, this.type, this.mid, this.stoken, this.game_token)
      .finalize()

  }
}