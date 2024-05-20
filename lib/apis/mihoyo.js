import { v4 as uuidv4 } from 'uuid';
import { randomString } from '../utils.js'
import { MIHOYO_PASSPORT_DOMAIN, encrypt, requsest } from './utils.js';

// web pc
// const LIFECYCLE_ID = randomString(18)
// const DEVICE_ID = uuidv4()
// const DEVICE_FP = randomString(13)
// const DEVICE_NAME = "Chrome"
// const DEVICE_MODEL = "karin-plugin-mihoyo"

const LIFECYCLE_ID = uuidv4()
const DEVICE_ID = randomString(16)
const DEVICE_FP = randomString(13)
const DEVICE_NAME = "karin-plugin-mihoyo"
const DEVICE_MODEL = "karin-plugin-mihoyo"

const header = {
  "web": {
    "x-rpc-device_model": DEVICE_MODEL,
    "x-rpc-lifecycle_id": LIFECYCLE_ID,
    'x-rpc-device_os': "Windows 10 64-bit",
    'x-rpc-sdk_version': "2.26.0",
    'x-rpc-device_name': DEVICE_NAME,
    "x-rpc-mi_referrer": "https://user.miyoushe.com/login-platform/index.html?app_id=bll8iq97cem8&theme=&token_type=4&game_biz=bbs_cn&message_origin=https%253A%252F%252Fwww.miyoushe.com&succ_back_type=message%253Alogin-platform%253Alogin-success&fail_back_type=message%253Alogin-platform%253Alogin-fail&ux_mode=popup&iframe_level=1#/login/qr",
    "x-rpc-device_fp": DEVICE_FP,
    "x-rpc-client_type": "4",
    "x-rpc-game_biz": "bbs_cn",
    "x-rpc-device_id": DEVICE_ID,
    "x-rpc-app_id": "bll8iq97cem8",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-ch-ua-mobile": "?0",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Origin": "https://user.miyoushe.com",
    "Referer": "https://user.miyoushe.com/"
  },
  "mobile": {
    "x-rpc-app_id": "bll8iq97cem8",
    "x-rpc-client_type": "2",
    "x-rpc-device_id": DEVICE_ID,
    "x-rpc-device_fp": DEVICE_FP,
    'x-rpc-device_name': DEVICE_NAME,
    "x-rpc-device_model": DEVICE_MODEL,
    'x-rpc-sys_version': '15',
    "x-rpc-game_biz": "bbs_cn",
    'x-rpc-app_version': '2.20.2',
    'x-rpc-sdk_version': "2.71.0",
    "x-rpc-lifecycle_id": LIFECYCLE_ID,
    'x-rpc-account_version': '2.20.2',
    // 'x-rpc-aigis': '',
    // 'DS': ',
    "Content-Type": "application/json",
    "User-Agent": "okhttp/4.9.3"
  }
}

class Mihoyo {
  async loginByPassword (account, password) {
    let res = await requsest(`${MIHOYO_PASSPORT_DOMAIN}/account/ma-cn-passport/web/loginByPassword`, { account: encrypt(account), password: encrypt(password) }, header, 2)
    return res.data
  }

  async sendSms (area_code, mobile) {
    await requsest(`${MIHOYO_PASSPORT_DOMAIN}/account/ma-cn-verifier/verifier/createLoginCaptcha`, { area_code: encrypt(area_code), mobile: encrypt(mobile) }, header, 2)
  }

  async verifySmsCode (area_code, mobile, captcha) {
    let res = await requsest(`${MIHOYO_PASSPORT_DOMAIN}/account/ma-cn-passport/app/loginByMobileCaptcha`, { action_type: 'login_by_mobile_captcha', area_code: encrypt(area_code), mobile: encrypt(mobile), captcha }, header, 2)
    return res.data
  }

  async createQRLogin () {
    let res = await requsest(`${MIYOSHE_PASSPORT_DOMAIN}/account/ma-cn-passport/web/createQRLogin`, {}, header)
    return { ticket: res.ticket, url: res.url }
  }

  async queryQRLoginStatus (ticket) {
    let res = await requsest(`${MIYOSHE_PASSPORT_DOMAIN}/account/ma-cn-passport/web/queryQRLoginStatus`, { ticket: ticket }, header)
    return { status: res.status }
  }
}

export default Object.freeze(new Mihoyo())