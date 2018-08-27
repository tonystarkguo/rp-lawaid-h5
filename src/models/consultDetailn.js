import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'consultDetailn',
  state: {
    dataSource: {},
  },
  effects: {
    * getConsultDetail({payload}, {select, call, put}) {
      let res = yield call(getDataService, {url: api.getConsultById}, { id: payload, serviceId: 'srvid_getConsultById' })
      if(res.success) {
        console.log(res)
        yield put({ type:'getMsgSuccess', payload: res.data })
      }else {
        throw res
      }
    },
  },
  reducers: {
    getMsgSuccess(state, action){
      return { ...state, dataSource: action.payload }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/consultDetailn/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'getConsultDetail',
            payload: match[1]
          })
        }
      })
    }
  },
}
