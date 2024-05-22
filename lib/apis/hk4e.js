import { MIHOYO_HK4E_DOMAIN, getSign, requsest, device, header } from './utils.js';

class MihoyoHk4e {
  // async loginByPassword (account, password) {
  //   let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/account/ma-cn-passport/web/loginByPassword`, { account: encrypt(account), password: encrypt(password) }, header, 2)
  //   return res.data
  // }

  async sendSms (area_code, mobile) {
    await requsest(`${MIHOYO_HK4E_DOMAIN}/shield/api/loginCaptcha`, { area: area_code, mobile: mobile }, header['pc'])
  }

  async verifySmsCode (area_code, mobile, captcha) {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hk4e_cn/mdk/shield/api/loginMobile`, { area: area_code, mobile: mobile, action: 'Login', captcha }, header['pc'])
    return res.data
  }

  async createQRLogin () {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hk4e_cn/combo/panda/qrcode/fetch`, {
      "app_id": "4", // 4: 云原神
      "device": device['pc'].device_id
    }, header['pc'])
    let ticket = /&ticket=(.*)&?/.exec(res.url)[1]
    return { ticket: ticket, url: res.url }
  }

  async queryQRLoginStatus (ticket) {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hk4e_cn/combo/panda/qrcode/query`, {
      "app_id": "4",
      "device": device['pc'].device_id,
      "ticket": ticket
    }, header['pc'])
    return { status: res.stat, raw: res.payload.raw }
  }

  async queryAccountInfo (uid, token) {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hk4e_cn/mdk/shield/api/verify`, { uid: uid, token: token }, header['pc'])
    return res
  }

  async queryComboToken (uid, token) {
    let data = JSON.stringify({
      "uid": uid,
      "guest": false,
      "token": token
    })
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hk4e_cn/combo/granter/login/v2/login`, {
      "app_id": "4",
      "channel_id": "1",
      "data": data,
      "device": device['pc'].device_id,
      "sign": getSign(data)
    }, header['pc'])
    return res
  }
}

export default Object.freeze(new MihoyoHk4e())