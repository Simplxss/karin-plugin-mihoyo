import { plugin, segment } from '#Karin'
import passport from '../lib/apis/passport.js'
import hk4e from '../lib/apis/hk4e.js'
import { sleep } from '../lib/utils.js'
import User from '../lib/database/User.js'
import MihoyoAccount from '../lib/database/MihoyoAccount.js'
import QRCode from 'qrcode'

export class login extends plugin {
  constructor () {
    super({
      // 必选 插件名称
      name: '米游社登录',
      // 插件描述
      dsc: '米游社扫码和账号密码登录',
      // 监听消息事件 默认message
      event: 'message',
      // 优先级
      priority: 5000,
      // 以下rule、task、button、handler均为可选，如键入，则必须为数组
      rule: [
        {
          reg: `^密码登录(.*) (.*)$`,
          fnc: "passwordLogin",
          log: false,
          permission: 'all'
        },
        {
          reg: String.raw`^短信验证码登录(\+\d*)? ?(\d*)$`,
          fnc: "phoneLogin",
          log: false,
          permission: 'all'
        },
        {
          reg: String.raw`^短信验证码登录(\+\d*)? ?(\d*) (\d{6})$`,
          fnc: "submmitSmsCode",
          log: false,
          permission: 'all'
        },
        {
          reg: `^扫码登录$`,
          fnc: "qrcodeLogin",
          log: false,
          permission: 'all'
        },
        {
          reg: `^([Cc]ookie|[Ss]token|米游社|登录)(帮助|教程|绑定|登录)$`,
          fnc: "loginHelp",
          log: false,
          permission: 'all'
        },
        {
          reg: `^test$`,
          fnc: "test",
          log: false,
          permission: 'all'
        }
      ]
    })
  }

  async test () {
  }

  async passwordLogin () {
    try {
      let params = /^密码登录(.*) (.*)$/.exec(this.e.msg)
      let res = await passport.loginByPassword(params[1], params[2])

      let mihoyoAccount = new MihoyoAccount('miyoushe', res.account_id)
      await mihoyoAccount.createByStoken(res.stoken, res.mid)
      await mihoyoAccount.save()

      let user = new User(this.e.user_id)
      await user.addMihoyoAccount(mihoyoAccount)
      await user.save()

      this.reply('登录成功', { at: true, recallMsg: 0, reply: false, button: false })
    }
    catch (err) {
      this.reply(err.message, { at: false, recallMsg: 0, reply: true, button: false })
    }
  }

  async phoneLogin () {
    try {
      let params = /^短信验证码登录(\+\d*)? ?(\d*)$/.exec(this.e.msg)
      await passport.sendSms(params[1] ? params[1] : '+86', params[2])
      this.reply('验证码已发送，请输入验证码', { at: false, recallMsg: 0, reply: true, button: false })
    }
    catch (err) {
      this.reply(err.message, { at: false, recallMsg: 0, reply: true, button: false })
    }
  }

  async submmitSmsCode () {
    try {
      let params = /^短信验证码登录(\+\d*)? ?(\d*) (\d{6})$/.exec(this.e.msg)
      let res = await passport.verifySmsCode(params[1] ? params[1] : '+86', params[2], params[3])

      let mihoyoAccount = new MihoyoAccount('miyoushe', res.account_id)
      await mihoyoAccount.createByStoken(res.stoken, res.mid)
      await mihoyoAccount.save()

      let user = new User(this.e.user_id)
      await user.addMihoyoAccount(mihoyoAccount)
      await user.save()

      this.reply('登录成功', { at: false, recallMsg: 0, reply: true, button: false })
    }
    catch (err) {
      this.reply(err.message, { at: false, recallMsg: 0, reply: true, button: false })
    }
  }

  async qrcodeLogin () {
    try {
      let { ticket, url } = await hk4e.createQRLogin()
      this.reply('请扫描二维码', { at: false, recallMsg: 0, reply: true, button: false })

      let image = (await QRCode.toBuffer(url)).toString('base64')
      this.reply([segment.image(`base64://${image}`)])

      let hasSend = false
      while (true) {
        let res = await hk4e.queryQRLoginStatus(ticket)
        if (res.status === 'Scanned' && hasSend) {
          this.reply('二维码已扫描, 请确认登录', { at: false, recallMsg: 0, reply: true, button: false })
          hasSend = true
        } else if (res.status === 'Confirmed') {
          let raw = JSON.parse(res.raw)
          let mihoyoAccount = new MihoyoAccount('miyoushe', raw.uid)
          await mihoyoAccount.createByGameToken(raw.token)
          await mihoyoAccount.save()

          let user = new User(this.e.user_id)
          await user.addMihoyoAccount(mihoyoAccount)
          await user.save()

          this.reply('登录成功', { at: true, recallMsg: 0, reply: false, button: false })
          break
        }
        await sleep(1000)
      }
    }
    catch (err) {
      this.reply(err.message, { at: false, recallMsg: 0, reply: true, button: false })
    }
  }

  async loginHelp () {
    this.reply('米游社登录帮助', { at: false, recallMsg: 0, reply: true, button: false })
  }

  async buttonTest () {
    // 构建一个连接按钮
    const data = segment.button({ link: 'https://www.baidu.com', text: '百度一下' })
    return {
      stop: true, // 停止循环，不再遍历后续按钮
      data
    }
  }
}
