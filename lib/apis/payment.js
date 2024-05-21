import { MIHOYO_PAYMENT_DOMAIN, requsest, header, device } from './utils.js';

class MihoyoPayment {
  async getPayPlat (payment_token, cashier_id) {
    payment_header = {
      ...header['pc'],
      'x-rpc-payment_token': payment_token,
      'x-rpc-cashier_id': cashier_id,
    }
    let res = await requsest(`${MIHOYO_PAYMENT_DOMAIN}/plutus/api/v2/listPayPlat`, {
      'disable_market': 'false',
      'expand_mixed_qrcode': 'true',
      'fold_other': 'false'
    }, payment_header)//GET
    return res
  }

  async checkToken (payment_token, cashier_id) {
    payment_header = {
      ...header['pc'],
      'x-rpc-payment_token': payment_token,
      'x-rpc-cashier_id': cashier_id,
    }
    let res = await requsest(`${MIHOYO_PAYMENT_DOMAIN}/plutus/api/v2/token`, { 'meta': payment_token }, payment_header)
    return res
  }

  async checkOrder (payment_token, cashier_id, biz_order_no) {
    payment_header = {
      ...header['pc'],
      'x-rpc-payment_token': payment_token,
      'x-rpc-cashier_id': cashier_id,
    }
    let res = await requsest(`${MIHOYO_PAYMENT_DOMAIN}/plutus/api/v2/check`, { 'biz_order_no': biz_order_no }, payment_header) // GET
    return { status: res.status } // CheckStatusInit 待付款
  }
}

export default Object.freeze(new MihoyoPayment())