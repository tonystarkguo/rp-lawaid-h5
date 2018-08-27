import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'message',
  state: {
    user: {},
  },
  effects: {
    *getInfo ({ payload }, { put, call }) {
      let user = JSON.parse(localStorage.getItem('user'))
      let res="";
      if(!user){
        throw res
      }else{
         res = yield call(getDataService, { url: api.getUserInfoInCase }, { tRpUserId: user.userId })
      }
      
      if (res.success) {
        yield put({
          type: 'setMessage',
          payload: res.data,
        })
      } else {
        throw res
      }
    }
  },
  reducers: {
    setMessage (state, action) {
      return { ...state, user: action.payload }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/message') {
          let user = JSON.parse(localStorage.getItem('user'))
          dispatch({
            type: 'getInfo',
            payload: user,
          })
        }
      })
    }
  },
}
