import { MIHOYO_PASSPORT_DOMAIN, encrypt, requsest, header } from './utils.js';

class MihoyoPassport {
  async loginByPassword (account, password) {
    let res = await requsest(`${MIHOYO_PASSPORT_DOMAIN}/account/ma-cn-passport/app/loginByPassword`, { account: encrypt(account), password: encrypt(password) }, header['mobile'], {}, 2)
    return { account_id: res.user_info.aid, mid: res.user_info.mid, stoken: res.token.token }
  }

  async sendSms (area_code, mobile) {
    await requsest(`${MIHOYO_PASSPORT_DOMAIN}/account/ma-cn-verifier/verifier/createLoginCaptcha`, { area_code: encrypt(area_code), mobile: encrypt(mobile) }, header['mobile'], {}, 2)
  }

  async verifySmsCode (area_code, mobile, captcha) {
    let res = await requsest(`${MIHOYO_PASSPORT_DOMAIN}/account/ma-cn-passport/app/loginByMobileCaptcha`, { action_type: 'login_by_mobile_captcha', area_code: encrypt(area_code), mobile: encrypt(mobile), captcha }, header['mobile'], {}, 2)
    return { account_id: res.user_info.aid, mid: res.user_info.mid, stoken: res.token.token }
  }

  async createQRLogin () {
    let res = await requsest(`${MIYOSHE_PASSPORT_DOMAIN}/account/ma-cn-passport/web/createQRLogin`, {}, header['web'])
    return { ticket: res.ticket, url: res.url }
  }

  async queryQRLoginStatus (ticket) {
    let res = await requsest(`${MIYOSHE_PASSPORT_DOMAIN}/account/ma-cn-passport/web/queryQRLoginStatus`, { ticket: ticket }, header['web'])
    return { status: res.status }
  }
}

export default Object.freeze(new MihoyoPassport())