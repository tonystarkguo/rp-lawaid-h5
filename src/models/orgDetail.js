import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'orgDetail',
  state: {
    dataSource: {},
  },
  effects: {
    
  },
  reducers: {
    setOrgDetail(state, action){
      return { ...state, dataSource: action.payload }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/orgDetail') {
          let data = localStorage.getItem('orgMsg')
          dispatch({ type: 'setOrgDetail', payload: data })
        }
      })
    }
  },
}
