import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { getDataService, postDataService } from '../../services/commonService'
import { config, caseStatusConverter, createDicNodes, jsUtil } from '../../utils'
import { Toast } from 'antd-mobile'
import { parse } from 'qs'
import _ from 'lodash'

const { api } = config


export default {
  namespace: 'caselog',
  state: {
   logList: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/lawcaselog/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'getCaseStepLog', payload: { caseId: match[1] } })
        }
      })
    },
  },
  effects: {
    *getCaseStepLog ({ payload }, { call, put, select }) {
      const data = yield call(getDataService, {url: api.getCaseStepLog}, {...payload, serviceId: 'srvid_getCaseStepLog'})
      const logData = data && data.data || {}
      yield put({
        type: 'querySuccess',
        payload: logData,
      })
    },
  },
  reducers: {
    querySuccess(state, action) {
      console.log(action.payload)
      return {
        ...state,
        logList: action.payload,
      }
    },
  }
}
