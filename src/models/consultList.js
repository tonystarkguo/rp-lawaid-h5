import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'consultList',
  state: {
    dataSource: [],
  },
  effects: {
    * getConsultList({payload}, {select, call, put}) {
      let res = yield call(getDataService, {url: api.getMyHistoryConsults}, { serviceId: 'srvid_getMyHistoryConsults' })
      if(res.success) {
        let resData = res && res.data && res.data.list || []
        let key = 0;
        resData = resData.map((item, index) => {
          let newItem = item;
          newItem.key = key++
          return newItem
        })
        yield put({ type:'setList', payload: resData })
      }else {
        throw res
      }
    },
  },
  reducers: {
    setList(state, action){
      return { ...state, dataSource: action.payload }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/consultList') {
          dispatch({ type: 'getConsultList' })
        }
      })
    }
  },
}
