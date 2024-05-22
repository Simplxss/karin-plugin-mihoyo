import md5 from 'md5';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { randomString } from '../utils.js'

export const MIYOUSHE_PASSPORT_DOMAIN = "https://passport-api.miyoushe.com" // same as MIHOYO_PASSPORT_DOMAIN
export const MIYOUSHE_TAKUMI_DOMAIN = "https://api-takumi.miyoushe.com" // same as MIHOYO_TAKUMI_DOMAIN
export const MIYOUSHE_BBS_DOMAIN = "https://bbs-api.miyoushe.com"

export const MIHOYO_PASSPORT_DOMAIN = "https://passport-api.mihoyo.com"
export const MIHOYO_TAKUMI_DOMAIN = "https://api-takumi.mihoyo.com"
export const MIHOYO_PAYMENT_DOMAIN = "https://api-payment.mihoyo.com"
export const MIHOYO_WEB_DOMAIN = "https://webapi.account.mihoyo.com"

export const MIHOYO_HK4E_DOMAIN = "https://hk4e-sdk.mihoyo.com"
export const MIHOYO_HKRPG_DOMAIN = "https://hkrpg-sdk.mihoyo.com"

const MIHOYO_PASSPORT_DS_SALT = "JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS";
const MIHOYO_TAKUMI_DS_SALT = "sjdNFJB7XxyDWGIAk0eTV8AOCfMJmyEo";

const MIYOSHE_PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDvekdPMHN3AYhm/vktJT+YJr7\n' +
  'cI5DcsNKqdsx5DZX0gDuWFuIjzdwButrIYPNmRJ1G8ybDIF7oDW2eEpm5sMbL9zs\n' +
  '9ExXCdvqrn51qELbqj0XxtMTIpaCHFSI50PfPpTFV9Xt/hmyVwokoOXFlAEgCn+Q\n' +
  'CgGs52bFoYMtyi+xEQIDAQAB\n' +
  '-----END PUBLIC KEY-----'


export const device = {
  'pc': {
    lifecycle_id: randomString(18),
    device_id: randomString(53),
    device_fp: randomString(13),
    device_name: "karin-plugin-mihoyo",
    device_model: "karin-plugin-mihoyo"
  },
  "web": {
    lifecycle_id: randomString(18),
    device_id: uuidv4(),
    device_fp: randomString(13),
    device_name: "Chrome",
    device_model: "karin-plugin-mihoyo"
  },
  "mobile": {
    lifecycle_id: uuidv4(),
    device_id: randomString(16),
    device_fp: randomString(13),
    device_name: "karin-plugin-mihoyo",
    device_model: "karin-plugin-mihoyo"
  }

}

export const header = {
  "pc": { // from 云原神
    "x-rpc-channel_id": "1",
    "x-rpc-channel_version": "2.24.0.94",
    'x-rpc-client_type': '9',
    "x-rpc-device_fp": device['pc'].device_fp,
    "x-rpc-device_id": device['pc'].device_id,
    "x-rpc-device_model": device['pc'].device_model,
    'x-rpc-device_name': device['pc'].device_name,
    "x-rpc-game_biz": "hk4e_cn",
    "x-rpc-language": "zh-cn",
    "x-rpc-lifecycle_id": device['pc'].lifecycle_id,
    'x-rpc-mdk_version': '2.24.0.94',
    'x-rpc-sdk_version': "2.24.0.94",
    'x-rpc-sys_version': 'Windows 10',
    "Content-Type": "application/json"
  },
  "web": {
    "x-rpc-device_model": device['web'].device_model,
    "x-rpc-lifecycle_id": device['web'].lifecycle_id,
    'x-rpc-device_os': "Windows 10 64-bit",
    'x-rpc-sdk_version': "2.26.0",
    'x-rpc-device_name': device['web'].device_name,
    "x-rpc-mi_referrer": "https://user.miyoushe.com/login-platform/index.html?app_id=bll8iq97cem8&theme=&token_type=4&game_biz=bbs_cn&message_origin=https%253A%252F%252Fwww.miyoushe.com&succ_back_type=message%253Alogin-platform%253Alogin-success&fail_back_type=message%253Alogin-platform%253Alogin-fail&ux_mode=popup&iframe_level=1#/login/qr",
    "x-rpc-device_fp": device['web'].device_fp,
    "x-rpc-client_type": "4",
    "x-rpc-game_biz": "bbs_cn",
    "x-rpc-device_id": device['web'].device_id,
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
    "x-rpc-device_id": device['mobile'].device_id,
    "x-rpc-device_fp": device['mobile'].device_fp,
    'x-rpc-device_name': device['mobile'].device_name,
    "x-rpc-device_model": device['mobile'].device_model,
    'x-rpc-sys_version': '15',
    "x-rpc-game_biz": "bbs_cn",
    'x-rpc-app_version': '2.20.2',
    'x-rpc-sdk_version': "2.71.0",
    "x-rpc-lifecycle_id": device['mobile'].lifecycle_id,
    'x-rpc-account_version': '2.20.2',
    // 'x-rpc-aigis': '',
    // 'DS': ',
    "Content-Type": "application/json",
    "User-Agent": "okhttp/4.9.3"
  }
}

export function encrypt (data) {
  return crypto.publicEncrypt({
    key: MIYOSHE_PUBLIC_KEY,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, data).toString("base64")

}

export function getSign (data) {
  return crypto.createHmac('sha256', '6bdc3982c25f3f3c38668a32d287d16b').update(data).digest('hex') // broken
}

function getDs (salt) {
  let timestamp = Math.floor(Date.now() / 1000)
  let randomStr = randomString(6);
  let sign = md5(`salt=${salt}&t=${timestamp}&r=${randomStr}`);
  return `${timestamp},${randomStr},${sign}`
}

function getDs2 (salt, body, query) {
  let timestamp = Math.floor(Date.now() / 1000)
  let randomStr = randomString(6);
  let sign = md5(`salt=${salt}&t=${timestamp}&r=${randomStr}&b=${body}&q=${query}`)
  return `${timestamp},${randomStr},${sign}`
}

export async function requsest (url, data, headers, cookies = {}, DsType = 0) {
  data = JSON.stringify(data)
  let cookie = ''
  for (let key in cookies) {
    cookie += `${key}=${cookies[key]};`
  }
  headers = { ...headers, 'cookie': cookie }
  switch (DsType) {
    case 0:
      break
    case 1:
      headers['DS'] = getDs(MIHOYO_TAKUMI_DS_SALT)
      break
    case 2:
      headers['DS'] = getDs2(MIHOYO_PASSPORT_DS_SALT, data, '')
      break
    default:
      break
  }

  let params = {
    method: 'post',
    body: data,
    headers: headers
  }

  for (var i = 0; i < 3; i++) {
    let response
    try { response = await fetch(url, params) }
    catch (err) {
      logger.error(`${err.name}: ${err.message}`)
      throw new Error(`请求失败, 请稍后重试`)
    }

    if (!response.ok) {
      logger.error(`[requsest] ${response.status} ${response.statusText}`)
      throw new Error(`请求失败, 请稍后重试`)
    }

    let res = await response.json()
    if (!res) {
      logger.error(`[requsest] ${res.text()}`)
      throw new Error(`请求失败, 请稍后重试`)
    }

    // -102: InvalidParam   MIHOYO_HK4E_DOMAIN
    // -106: ExpiredCode   MIHOYO_HK4E_DOMAIN
    // -3001: 参数不合法   MIHOYO_PASSPORT_DOMAIN
    // -3005: 参数不合法   MIHOYO_PASSPORT_DOMAIN, MIHOYO_TAKUMI_DOMAIN
    // -3006: 请求过于频繁，请稍后再试   MIHOYO_PASSPORT_DOMAIN
    // -3501: 二维码已失效，请刷新后重新扫描   MIHOYO_PASSPORT_DOMAIN
    // -3101: 请求频繁，请稍后再试   MIHOYO_PASSPORT_DOMAIN
    // -3208: 账号或密码错误   MIHOYO_PASSPORT_DOMAIN
    switch (res.retcode) {
      case 0:
        return res.data
      case 10035:
        // 验证码
        continue
      default:
        throw new Error(res.message)
    }
  }
  logger.error('[requsest] retry 3 times failed')
  throw new Error('请求失败, 请稍后重试')
}