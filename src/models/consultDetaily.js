import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { getDataService, postDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'consultDetaily',
  state: {
    dataSource: {},
    evaluateState:false,//0未评价false 1评价
    satisfaction:"",//满意度
    isAccept:"",//评价
    id:""
  },
  effects: {
    * getConsultDetail({payload}, {select, call, put}) {
      let reg=/^[0-9]+.?[0-9]*$/;
      if(reg.test(payload)){
        let res = yield call(getDataService, {url: api.getConsultById}, { id: payload, serviceId: 'srvid_getConsultById' })
        if(res.success){
          yield put({ type:'getMsgSuccess', payload: res.data })
        }else{
          throw res
        }
      }else{
        let idCode = yield call(getDataService, {url: api.getdecryptConsultId}, { id: payload, serviceId: 'srvid_getConsultById' })
        let res = yield call(getDataService, {url: api.getConsultByIdNoToken}, { id: idCode.data, serviceId: 'srvid_getConsultById' })
        if(res.success) {
          console.log(res)
          yield put({ type:'getMsgSuccess', payload: res.data })
        }else {
          throw res
        }
      }   
    },
    *submitSatisfaction({payload}, {select, call, put}){
      let idCode = yield call(postDataService, {url: api.postCommitConsultEvaluate},payload)
      if(idCode.success) {
        const match = pathToRegexp('/consultDetaily/:id').exec(location.pathname)
        if (match) {
          yield put({type: 'getConsultDetail',payload: match[1]})
        }
      }else {
        
      }
    }
  },
  reducers: {
    getMsgSuccess(state, action){
      return { ...state, 
        dataSource: action.payload ,
        evaluateState:Boolean(Number(action.payload.rpConsultEvaluates.length>0?action.payload.rpConsultEvaluates[0].evaluateState:0)) ,
        satisfaction:action.payload.rpConsultEvaluates.length>0?action.payload.rpConsultEvaluates[0].satisfaction:"",
        isAccept:action.payload.rpConsultEvaluates.length>0?action.payload.rpConsultEvaluates[0].isAccept:"",
        id:action.payload.rpConsultEvaluates.length>0?action.payload.rpConsultEvaluates[0].id:""
      }   
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/consultDetaily/:id').exec(location.pathname)
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
