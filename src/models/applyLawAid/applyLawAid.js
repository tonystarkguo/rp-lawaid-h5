import { getDataService, postDataService } from '../../services/commonService'
import { config } from '../../utils'
import { routerRedux } from 'dva/router'
import { Toast } from 'antd-mobile'
const { api } = config
const user = JSON.parse(localStorage.getItem('user'))
export default {
  namespace: 'applyLawAid',
  state: {
    tabsKey: '1',
    allConfig: {},
    orgList: [],
    centerData: {},
    flag: false,
    baseData: {
      name: { value: user.name },
      cardCode: { value: user.cardCode },
      mobile: { value: user.mobile },
      emsAddress: { value: '' },
      isProxy: { value: false },
      proxyName: { value: '' },
      proxyCardId: { value: '' },
      proxyMobile: { value: '' },
      dicProxyType: { value: [] },
      dicLegalInstWay: { value: [] },
      dicConsultantCategoryList: { value: [] },
    },
    caseDetail: {
      caseDetail: { value: '' },
      dicCaseType: { value: [] },
      dicFreeHardMaterialsReason: { value: '' },
    },
    fileList: [],
    noOne: false,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/applyLawAid') {
          dispatch({ type: 'getFileList' })
          dispatch({ type: 'setAllConfig' })
          if (location.query.orgId) {
            dispatch({ type: 'setOrgId', orgId: location.query.orgId })
          }
        }
      })
    },
  },
  effects: {
    *getFileList ({ payload }, { put, select }) {
      const fileList = yield select(({ app }) => app.fileList)
      yield put({
        type: 'setFileList',
        fileList,
      })
    },
    *getOrgList ({ payload }, { call, put }) {
      const params = {
        tSmsProvince: payload.addr[0],
        tSmsCity: payload.addr[1],
        tSmsArea: payload.addr[2],
        pageNum: 1,
        pageSize: 9999,
      }
      const res = yield call(getDataService, { url: api.getOrgListUrl }, params)
      if (res.success) {
        yield put({ type: 'setOrgList', orgList: res.data.list || [] })
      } else {
        throw res
      }
    },
    *handleSubmit ({ payload }, { put, call, select }) {
      const { centerData, baseData, caseDetail, fileList } = yield select(({ applyLawAid }) => applyLawAid)
      const baseDataCurrent = {}
      for (let key in baseData) {
        baseDataCurrent[key] = baseData[key].value
      }
      const caseDetailCurrent = {}
      for (let key in caseDetail) {
        caseDetailCurrent[key] = caseDetail[key].value
      }
      let dicConsultantCategoryList = []
      if (baseData.dicConsultantCategoryList.value.length > 0) {
        baseData.dicConsultantCategoryList.value.forEach(item => {
          dicConsultantCategoryList.push({
            value: item,
          })
        })
      }
      const caseParams = {
        ...centerData,
        ...baseDataCurrent,
        ...caseDetailCurrent,
        dicConsultantCategoryList,
        fileStorageCtoList: fileList,
        dicLegalInstWay: baseDataCurrent.dicLegalInstWay && baseDataCurrent.dicLegalInstWay[0],
        dicProxyType: baseDataCurrent.dicProxyType && baseDataCurrent.dicProxyType[0],
        dicCaseType: caseDetailCurrent.dicCaseType && caseDetailCurrent.dicCaseType[0],
      }
      const baseParams = {
        ...baseDataCurrent,
        dicConsultantCategoryList,
        dicProxyType: baseDataCurrent.dicProxyType && baseDataCurrent.dicProxyType[0],
        dicLegalInstWay: baseDataCurrent.dicLegalInstWay && baseDataCurrent.dicLegalInstWay[0],
        dicCaseType: caseDetailCurrent.dicCaseType && caseDetailCurrent.dicCaseType[0],
      }
      const caseRes = yield call(postDataService, { url: api.createRpCase }, caseParams)
      if (caseRes.success) {
        const baseRes = yield call(postDataService, { url: api.createRpBase }, baseParams)
        if (baseRes.success) {
          Toast.info('提交成功')
          yield put(routerRedux.push('/lawcases'))
          yield put({ type: 'reset' })
          yield put({ type: 'app/resetFileList' })
        } else {
          throw baseRes
        }
      } else {
        throw caseRes
      }
    },
    *deleteFile ({ payload }, { put, select }) {
      const fileList = yield select(({ applyLawAid }) => applyLawAid.fileList)
      const currentFileList = fileList.filter(item => {
        return item.addrUrl !== payload
      })
      yield put({
        type: 'app/deleteFile',
        currentFileList,
      })
      yield put({
        type: 'deleteFileInApplyLawAid',
        currentFileList,
      })
    },
  },
  reducers: {
    reset () {
      return {
        tabsKey: '1',
        allConfig: {},
        orgList: [],
        centerData: {},
        baseData: {
          name: { value: '' },
          cardCode: { value: '' },
          mobile: { value: '' },
          emsAddress: { value: '' },
          isProxy: { value: false },
          proxyName: { value: '' },
          proxyCardId: { value: '' },
          proxyMobile: { value: '' },
          dicProxyType: { value: [] },
          dicLegalInstWay: { value: [] },
          dicConsultantCategoryList: { value: [] },
        },
        caseDetail: {
          caseDetail: { value: '' },
          dicCaseType: { value: [] },
          dicFreeHardMaterialsReason: { value: '' },
        },
        fileList: [],
      }
    },
    setOrgId (state, action) {
      const tabsKey = state.tabsKey === '4' ? '4' : '2'
      return { ...state, centerData: { orgId: action.orgId }, tabsKey, noOne: true }
    },
    setDicFreeHardMaterialsReason (state, action) {
      return { ...state, caseDetail: { ...state.caseDetail, dicFreeHardMaterialsReason: { value: action.payload } } }
    },
    setOrgList (state, action) {
      return { ...state, orgList: action.orgList }
    },
    deleteFileInApplyLawAid (state, action) {
      return { ...state, fileList: action.currentFileList }
    },
    changedicConsultantCategoryList (state, action) {
      return { ...state, baseDetail: { ...state.baseDetail, ...action.payload }, flag: !state.flag }
    },
    onCaseFieldsChange (state, action) {
      return { ...state, caseDetail: { ...state.caseDetail, ...action.payload } }
    },
    onBaseFieldsChange (state, action) {
      return { ...state, baseData: { ...state.baseData, ...action.payload } }
    },
    setCenterData (state, action) {
      return { ...state, centerData: action.centerData, centerDataDone: true }
    },
    setCaseDetail (state) {
      return { ...state, caseDataDone: true }
    },
    setBaseData (state) {
      return { ...state, baseDataDone: true }
    },
    setAllConfig (state) {
      const allConfig = JSON.parse(localStorage.getItem('allConfig'))
      return { ...state, allConfig }
    },
    setTabsKey (state, action) {
      const tabsKey = action.tabsKey
      return { ...state, tabsKey }
    },
    setFileList (state, action) {
      const fileList = action.fileList
      return { ...state, fileList }
    }
  },
}
