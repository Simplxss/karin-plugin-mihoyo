import md5 from 'md5';
import crypto from 'crypto';
import { randomString } from '../utils.js'

export const MIHOYO_TAKUMI_DOMAIN = "https://api-takumi.mihoyo.com"
export const MIHOYO_PASSPORT_DOMAIN = "https://passport-api.mihoyo.com"
export const MIYOSHE_PASSPORT_DOMAIN = "https://passport-api.miyoushe.com"

const MIHOYO_PASSPORT_DS_SALT = "JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS";
const MIHOYO_TAKUMI_DS_SALT = "sjdNFJB7XxyDWGIAk0eTV8AOCfMJmyEo";

const MIYOSHE_PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDvekdPMHN3AYhm/vktJT+YJr7\n' +
  'cI5DcsNKqdsx5DZX0gDuWFuIjzdwButrIYPNmRJ1G8ybDIF7oDW2eEpm5sMbL9zs\n' +
  '9ExXCdvqrn51qELbqj0XxtMTIpaCHFSI50PfPpTFV9Xt/hmyVwokoOXFlAEgCn+Q\n' +
  'CgGs52bFoYMtyi+xEQIDAQAB\n' +
  '-----END PUBLIC KEY-----'

export function encrypt (data) {
  return crypto.publicEncrypt({
    key: MIYOSHE_PUBLIC_KEY,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, data).toString("base64")

}

function getDs (salt) {
  let timestamp = Math.floor(Date.now() / 1000)
  let randomStr = randomString(6);
  let sign = md5(`salt=${salt}&t=${timestamp}&r=${randomStr}`);
  return `${timestamp},${randomStr},${sign}`
}

function getDs2 (salt, body, q) {
  let timestamp = Math.floor(Date.now() / 1000)
  let randomStr = randomString(6);
  let sign = md5(`salt=${salt}&t=${timestamp}&r=${randomStr}&b=${body}&q=${q}`)
  return `${timestamp},${randomStr},${sign}`
}

export async function requsest (url, data, headers, DsType = 0) {
  data = JSON.stringify(data)
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

    // -3001: 参数不合法
    // -3005: 参数不合法
    // -3501: 二维码已失效，请刷新后重新扫描
    // -3101: 请求频繁，请稍后再试
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

// export function gen_sign (data) {
//   if (!data) return ''
//   let d = Object.keys(data).sort()
//   let news = {}
//   for (const item of d) {
//     news[item] = data[item]
//   }
//   // let sign = this.HMCASHA256(Object.values(news).join(''))
//   let sign = crypto.createHmac('sha256', '6bdc3982c25f3f3c38668a32d287d16b').update(Object.values(news).join('')).digest('hex')
//   return sign
// }