import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { getDataService, postDataService } from '../../services/commonService'
import { config, caseStatusConverter, createDicNodes, jsUtil } from '../../utils'
import { Toast, Modal } from 'antd-mobile'
import { parse } from 'qs'
import _ from 'lodash'

const { api } = config


export default {
  namespace: 'lawcaseDetail',
  state: {
    caseInfo: {},
    applyerInfo: {},
    caseStatus: '',
    materialFileData: [],
    materialDocData: {},
    hpUserInfo: {},
    evaluateInfo: {
      'isIllegal': 0,
      'dicAttitude': '',
      'dicInterflow': '',
      'dicMaintain': '',
      'dicResult': '',
      'dicSummary': '',
    },
    formData: {
      'isLie': false,
      'underTakeServ': '',
      'procCommunicatSer': '',
      'lawyerHelpserv': '',
      'resultServ': '',
      'totalServ': '',
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      // dispatch({type: 'getDicNodes'})
      // dispatch({type: 'setCaseReason'})
      history.listen(() => {
        const match = pathToRegexp('/lawcase/:id').exec(location.pathname)
        if (match) {
          // dispatch({ type: 'initEditStatus'})// 初始化
          dispatch({ type: 'getCaseDetail', payload: { caseId: match[1] } })
          dispatch({ type: 'getApplyerDetail', payload: { tCaseId: match[1] } })
          dispatch({ type: 'getMaterialFile', payload: { tCaseId: match[1] } })
          // dispatch({ type: 'getCaseFinacialData', payload: { tCaseId: match[1] } })
        }
      })
    },
  },
  effects: {
    *getApplyerDetail ({payload}, {call, put}) {
      let data = yield call(getDataService, {url: api.getUserInfoInCase}, {...payload, serviceId: 'srvid_getApplyerDetail' })
      if(data.success) {
        yield put({ 
          type: 'setApplyerDetail',
          data: data.data,
        })
      }
    },
    *saveCaseEvaluate ({payload}, {select, call, put}) {

      const formData = yield select(({lawcaseDetail}) => lawcaseDetail.formData)
      const caseId = yield select(({lawcaseDetail}) => lawcaseDetail.caseId)
      if (formData.underTakeServ === '') {
        Toast.info('请选择服务满意度')
      } else {
        const params = {
          tCaseId: caseId,
          isIllegal: formData.isLie,
          dicAttitude: formData.underTakeServ,
          dicInterflow: formData.procCommunicatSer,
          dicMaintain: formData.lawyerHelpserv,
          dicResult: formData.resultServ,
          dicSummary: formData.totalServ,
        }
        let data = yield call(postDataService, { url: api.saveCaseEvaluate }, {...params, serviceId: 'srvid_saveCaseEvaluate' })
        if (data.success) {
          Modal.alert('', '评价成功！')
          yield put({
            type: 'getCaseEvaluate',
          })
        }
      }
    },
    *getCaseEvaluate ({payload}, {select, call, put}) {
      const caseId = yield select(({lawcaseDetail}) => lawcaseDetail.caseId)
      let data = yield call(getDataService, {url: api.getCaseEvaluate}, {tCaseId: caseId, serviceId: 'srvid_getCaseEvaluate' })
      if(data.success) {
        yield put({ 
          type: 'queryCaseEvaluateSuc',
          evaluteData: data.data || {},
        })
      }
    },
    *getDicNodes ({payload}, { put }) {
      const allConfig = JSON.parse(localStorage.getItem('allConfig'))
      yield put({ 
        type: 'setAllConfig',
        allConfig
      })      
    },
    *getCaseDetail ({ payload }, { call, put, select }) {
      // put({type: 'initEditStatus'})// 初始化
      const data = yield call(getDataService, {url: api.getCaseInfo}, {...payload, serviceId: 'srvid_getCaseDetail'})
      const caseDetailData = data && data.data || {}
      let caseStatus = caseDetailData.dicCaseStatus || ''
      let caseId = caseDetailData.caseId || ''
      yield put({
        type: 'querySuccess',
        payload: {
          caseDetailData,
          caseId,
          caseStatus,
        },
      })
    },
    *getMaterialFile ({ payload }, { call, put, select }) {
      const caseId = yield select(({lawcaseDetail}) => lawcaseDetail.caseId)
      let params = {
        tCaseId: Number(caseId),
        serviceId: 'srvid_getMaterialFile'
      }
      const data = yield call(getDataService, {url: api.getMaterialFile}, {...payload})
      const materialData = data && data.data || []

      yield put({
        type: 'queryMaterialFileSuccess',
        payload: materialData,
      })
    },
    
    *getMaterialDoc ({ payload }, { call, put, select }) {
      const caseId = yield select(({lawcaseDetail}) => lawcaseDetail.caseId)
      let params = {
        caseId: Number(caseId),
        serviceId: 'srvid_getMaterialDoc'
      }
      const data = yield call(getDataService, {url: api.getMaterialDoc}, {...params})
      const materialDocData = data && data.data || []

      yield put({
        type: 'queryMaterialDocSuccess',
        payload: materialDocData,
      })
    },
    
    *getHpUserInfo ({ payload }, { call, put, select }) {
      const caseId = yield select(({lawcaseDetail}) => lawcaseDetail.caseId)
      let params = {
        caseId: caseId,
        serviceId: 'srvid_getHpUserInfo'
      }
      const data = yield call(getDataService, {url: api.getHpUserInMyCase}, {...params})
      const hpUserInfo = data && data.data || []

      yield put({
        type: 'queryHpUserInfoSuccess',
        payload: hpUserInfo,
      })
    },
  },
  reducers: {
    querySuccess(state, action) {
      return {
        ...state,
        caseInfo: action.payload.caseDetailData,
        caseId: action.payload.caseId,
        caseStatus: action.payload.caseStatus,
      }
    },
    queryCaseEvaluateSuc(state, action) {
      const evaluateInfo = action.evaluteData
      return {
        ...state,
        evaluateInfo: evaluateInfo,
        formData: {
          isLie: evaluateInfo.isIllegal,
          underTakeServ: evaluateInfo.dicAttitude,
          procCommunicatSer: evaluateInfo.dicInterflow,
          lawyerHelpserv: evaluateInfo.dicMaintain,
          resultServ: evaluateInfo.dicResult,
          totalServ: evaluateInfo.dicSummary,
        }
      }
    },
    
    queryHpUserInfoSuccess(state, action) {
      return {
        ...state,
        hpUserInfo: action.payload,
      }
    },
    queryMaterialFileSuccess(state, action) {
      return {
        ...state,
        materialFileData: action.payload,
      }
    },
    queryMaterialDocSuccess(state, action) {
      return {
        ...state,
        materialDocData: action.payload,
      }
    },
    
    setApplyerDetail(state, action) {
      return {
        ...state,
        applyerInfo: action.data,
      }
    },
    
    upldateLieSwitch(state, action) {
      return {
        ...state,
        formData: {...state.formData, isLie: !action.payload},
      }
    },
    upldateUnderTakeServ(state, action) {
      return {
        ...state,
        formData: {...state.formData, underTakeServ: action.payload},
      }
    },
    upldateProcCommunicatSer(state, action) {
      return {
        ...state,
        formData: {...state.formData, procCommunicatSer: action.payload},
      }
    },
    upldateLawyerHelpserv(state, action) {
      return {
        ...state,
        formData: {...state.formData, lawyerHelpserv: action.payload},
      }
    },
    upldateResultServ(state, action) {
      return {
        ...state,
        formData: {...state.formData, resultServ: action.payload},
      }
    },
    upldateTotalServ(state, action) {
      return {
        ...state,
        formData: {...state.formData, totalServ: action.payload},
      }
    },
  }
}
