import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'orgList',
  state: {
    dataSource: [],
    isLoading: true,
  },
  effects: {
    * getOrgList ({ payload }, { select, call, put }) {
      yield put({ type: 'app/getAllConfig' })// 跨model调用action
      const res = yield call(getDataService, { url: api.getOrgListUrl }, { ...payload, pageSize: 999, serviceId: 'srvid_getOrgListUrl' })
      if (res.success) {
        let resData = res && res.data && res.data.list || []
        let key = 0
        resData = resData.map((item, index) => {
          let newItem = item
          newItem.key = key++
          return newItem
        })
        yield put({ type: 'setList', payload: resData })
      } else {
        throw res
      }
    },
  },
  reducers: {
    showLoading (state, action) {
      return { ...state, isLoading: true }
    },
    setList (state, action) {
      return { ...state, dataSource: action.payload }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/orgList') {
          dispatch({ type: 'getOrgList' })
        }
      })
    },
  },
}
