import { routerRedux } from 'dva/router'
// import { parse } from 'qs'
import { getDataService } from '../services/commonService'
import { config, jsUtil } from '../utils'
const { api } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    fileList: [],
    initData: [
      {
        value: '1',
        label: '法援宣传',
        children: [
          {
            label: '机构指引',
            value: '1',
            url: '/orgList',
          },
        /*{
          label: '法援案例',
          value: '2',
        },*/
        /*{
          label: '工作宣传',
          value: '3',
        },*/
        ],
      }, {
        value: '2',
        label: '法律援助',
        children: [
        /* {
          label: '电话咨询',
          value: '1',
        }, */
          {
            label: '网络咨询',
            value: '2',
            url: '/onlineConsult',
          },
          {
            label: '申请须知',
            value: '3',
            url: '/notice',
          },
          {
            label: '申请法援',
            value: '4',
            url: '/riskNotify',
          },
        ],
      },
      {
        value: '3',
        label: '个人中心',
        children: [
          {
            label: '我的信息',
            value: '1',
            url: '/message',
          },
          {
            label: '我的咨询',
            value: '2',
            url: '/consultList',
          },
          {
            label: '我的法援',
            value: '3',
            url: '/lawcases',
          },
        ],
      },
    ],
    show: false,
  },
  subscriptions: {
    setup ({ dispatch }) {
      // if (location.pathname !== '/login' && location.pathname !== '/') {
      //   // dispatch({ type: 'init_main_page' }) // 初始化主页
      // } else {
      //   dispatch(routerRedux.push('/login'))
      // }
    },

  },
  effects: {
    *getAllConfig ({ payload }, { call }) {
      const res = yield call(getDataService, { url: api.getAllConfig }, { serviceId: 'srvid_getAllConfig' })
      if (res.success) {
        localStorage.setItem('allConfig', JSON.stringify(res.data))
      } else {
        throw res
      }
    },
    *getCaseReason ({ payload }, { call }) {
      const response = yield call(getDataService, { url: api.getCaseReason }, { serviceId: 'srvid_getCaseReason' })
      if (response.success) {
        let caseReasonList = response.data
        const caseReasonFunc = (caseReasonList) => {
          if (jsUtil.isNull(caseReasonList) && caseReasonList.length === 0) {
            return
          }
          caseReasonList.forEach((caseReasonItem) => {
            caseReasonItem.value = caseReasonItem.key
            caseReasonFunc(caseReasonItem.children)
          })
        }
        caseReasonFunc(caseReasonList)
        localStorage.setItem('caseReasonList', JSON.stringify(caseReasonList))
      }
    },
    *init_main_page ({ payload }, { put }) {
      let userInfo = payload && payload.user
      if (!userInfo) {
        userInfo = localStorage.getItem('user')
        userInfo = userInfo && JSON.parse(userInfo)
      }
      if (userInfo) {
        // 获取用户登录后的信息
      } else {
        yield put(routerRedux.push('/login'))// 不成功的话跳到登录页面
        throw (userInfo)
      }
    },
  },
  reducers: {
    resetFileList (state) {
      return { ...state, fileList: [] }
    },
    deleteFile (state, action) {
      return { ...state, fileList: action.currentFileList }
    },
    setFileListByService (state, action) {
      return { ...state, fileList: action.fileList }
    },
    setFileList (state, action) {
      let fileList = state.fileList
      fileList.push(action.payload)
      return { ...state, fileList }
    },
    querySuccess (state, { payload: user }) {
      return {
        ...state,
        user,
      }
    },
    isShow (state, action) {
      return {
        ...state,
        show: action.payload,
      }
    },
    hide (state, action) {
      return {
        ...state,
        show: false,
      }
    },
  },
}
