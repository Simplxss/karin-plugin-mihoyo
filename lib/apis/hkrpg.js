import { MIHOYO_HK4E_DOMAIN, MIHOYO_WEB_DOMAIN, getSign, requsest, device, header } from './utils.js';

class MihoyoHk4e {
  // async loginByPassword (account, password) {
  //   let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/account/ma-cn-passport/web/loginByPassword`, { account: encrypt(account), password: encrypt(password) }, header['pc'])
  //   return res.data
  // }

  async sendSms (area_code, mobile) {
    await requsest(`${MIHOYO_HK4E_DOMAIN}/shield/api/loginCaptcha`, { area: area_code, mobile: mobile }, header['pc'])
  }

  async verifySmsCode (area_code, mobile, captcha) {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hkrpg_cn/mdk/shield/api/loginMobile`, { area: area_code, mobile: mobile, action: 'Login', captcha }, header['pc'])
    return res.data
  }

  async createQRLogin () {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hkrpg_cn/combo/panda/qrcode/fetch`, {
      "app_id": "8", // 8: 崩坏: 星穹铁道
      "device": device['pc'].device_id
    }, header['pc'])
    let ticket = /&ticket=(.*)&?/.exec(res.url)[0]
    return { ticket: ticket, url: res.url }
  }

  async queryQRLoginStatus (ticket) {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hkrpg_cn/combo/panda/qrcode/query`, { ticket: ticket }, header['pc'])
    return { status: res.stat, raw: res.payload.raw }
  }

  async queryAccountInfo (uid, token) {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hkrpg_cn/mdk/shield/api/verify`, { uid: uid, token: token }, header['pc'])
    return res
  }

  async queryComboToken (uid, token) {
    let data = JSON.stringify({
      "uid": uid,
      "guest": false,
      "token": token
    })
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hkrpg_cn/combo/granter/login/v2/login`, {
      "app_id": 8,
      "channel_id": 1,
      "data": data,
      "device": device['pc'].device_id,
      "sign": getSign(data)
    }, header['pc'])
    return res
  }

  async createOrder (uid, token, game_uid, goods_id, goods_title, goods_num) {
    let res = await requsest(`${MIHOYO_HK4E_DOMAIN}/hkrpg_cn/mdk/luckycat/luckycat/createOrder`, {
      "who": {
        "account": uid,
        "token": token
      },
      "order": {
        "channel_id": "1",
        "account": uid,
        "pay_plat": "payment-cn",
        "country": "CHN",
        "currency": "CNY",
        "amount": 6800,
        "game": "hkrpg_cn",
        "region": "prod_gf_cn",
        "uid": game_uid,
        "goods_id": goods_id,
        "goods_title": goods_title,
        "goods_num": goods_num,
        "client_type": 3,
        "device": device['pc'].device_id,
        "price_tier": "Tier_10"
      },
      "sign": getSign(uid),
      "do_not_notice_again": false
    }, header['pc'])
    return res
  }

  async getActionTicket (uid, token) {
    return requsest(`${MIHOYO_WEB_DOMAIN}/Api/create_action_ticket_by_tickettoken`, `action_type=login&account_id=${uid}&ticket_token=${token}`, header['pc'])
  }
}

export default Object.freeze(new MihoyoHk4e())