import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'address',
  state: {
    data: 'haha'
  },
  effects: {
    
  },
  reducers: {
    
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/address') {
          console.log('机构导航')
        }
      })
    }
  },
}
