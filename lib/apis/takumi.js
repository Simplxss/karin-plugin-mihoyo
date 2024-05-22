import { MIHOYO_TAKUMI_DOMAIN, requsest, header, device } from './utils.js';

class MihoyoTakumi {
  async getUserGameRoles (stuid, stoken, mid) {
    let res = await requsest(`${MIHOYO_TAKUMI_DOMAIN}/binding/api/getUserGameRolesByStoken`, { stuid, stoken, mid }, header['pc'])
    return res
  }

  async getAccountInfo (uid, game_token) {
    let res = await requsest(`${MIHOYO_TAKUMI_DOMAIN}/auth/api/getCookieAccountInfoByGameToken`, { uid, game_token }, header['pc'])
    return res
  }

  async getToken (account_id, game_token) {
    let res = await requsest(`${MIHOYO_TAKUMI_DOMAIN}/account/ma-cn-session/app/getTokenByGameToken`, { account_id, game_token }, header['mobile'])
    return { stoken: res.token.token, mid: res.user_info.mid }
  }

  async getActionTicket (uid, game_token, action) {
    let res = await requsest(`${MIHOYO_TAKUMI_DOMAIN}/account/ma-cn-verifier/verifier/createActionTicketByGameToken`, {
      "action_type": action, // change_password
      "account_id": uid,
      "game_token": game_token
    }, header['pc'])
    return res
  }

  // async getEHkrpgToken (authkey) {
  //   let res = await requsest(`${MIHOYO_TAKUMI_DOMAIN}/common/badge/v1/login/authKey`, {
  //     'sign_type': '2',
  //     'auth_appid': 'rpgcultivate',
  //     'authkey_ver': '1',
  //     'win_mode': 'fullscreen',
  //     'mode': 'fullscreen',
  //     'utm_medium': 'ingame',
  //     'utm_campaign': 'phone',
  //     'lang': 'zh-cn',
  //     'authkey': authkey,
  //     'game_biz': "hkrpg_cn",
  //     'os_system': 'Windows 11  (10.0.26217) 64bit',
  //     'device_model': device['pc'].device_model,
  //     'plat_type': 'pc',
  //     'ts': Date.now()
  //   }, header['pc'])
  //   return res
  // }
}

export default Object.freeze(new MihoyoTakumi())