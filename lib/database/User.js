import { db } from './init.js';

export default class User {
  constructor (user_id) {
    this.user_id = user_id

    let res = db.prepare('select * from User where user_id = ?').get(this.user_id,
      (err) => {
        if (err) {
          console.log(err)
        }
      }
    )
    if (res) {
      this.mihoyo_accounts = JSON.parse(res.mihoyo_accounts)
      this.data = JSON.parse(res.data)
    } else {
      this.mihoyo_accounts = []
      this.data = {}
    }
  }

  async addMihoyoAccount (mihoyo_account) {
    if (!this.mihoyo_accounts.find(account_id => account_id === mihoyo_account.account_id))
      this.mihoyo_accounts.push(mihoyo_account.account_id)
    await this.save()
  }

  async save () {
    db.prepare('insert or replace into User (user_id, mihoyo_accounts, data) values (?, ?, ?)')
      .run(this.user_id, JSON.stringify(this.mihoyo_accounts), JSON.stringify(this.data))
      .finalize()
  }
}