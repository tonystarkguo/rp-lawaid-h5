import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { Toast } from 'antd-mobile';
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'register',
  state: {
    dicCardType: '',
  },
  effects: {
     * getCaptchaValue ({payload}, {select, call, put}) {
      const res = yield call(getDataService, {url: api.registerCaptcha}, { mobile: payload, serviceId: 'srvid_registerCaptcha' })
      if(res.success) {
        Toast.success('发送成功');
      }else {
        throw res
      }
    },

    * register ({payload}, {select, call, put}) {
      const res = yield call(postDataService, {url: api.registerUrl}, { ...payload, serviceId: 'srvid_registerUrl' })
      if(res.code === '1') {
        Toast.success('注册成功');
        yield put(routerRedux.push('/login'))
      }else {
        throw res
      }
    },
  },
  reducers: {
    onchange(state, action){
      return { ...state, dicCardType: action.payload }
    },
  },
}
