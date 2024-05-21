import { MIYOUSHE_BBS_DOMAIN, requsest, header } from './utils.js';

class Miyoushe {
  async getUserFullInfo (uid, token) {
    let res = await requsest(`${MIYOUSHE_BBS_DOMAIN}/user/api/getUserFullInfo`, { uid, token }, header['app'], { stuid, stoken, mid }, 1) //GET
    return res
  }

  async getUserGameRoles (stuid, stoken, mid) {
    let res = await requsest(`${MIYOUSHE_BBS_DOMAIN}/binding/api/getUserGameRolesByStoken`, {}, header['app'], { stuid, stoken, mid }, 1)  //GET
    return res
  }
}

export default Object.freeze(new Miyoushe())
