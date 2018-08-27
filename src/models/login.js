import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../utils'
import { parse } from 'qs'
import { postDataService, getDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    hasCode: false,
  },
  effects: {
    *login ({ payload }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      // 判断url是否有openId
      let url = window.location.href
      if (url.indexOf('openid=') > -1) {
        let openid = url.split('openid=')[1]
        payload.openid = openid
        payload.dicLoginAccountType = '0'
      }
      let targetRouter
      if (url.indexOf('state=') > -1) {
        targetRouter = `/${url.split('state=')[1]}`
        targetRouter = targetRouter.split('&')[0]
      } else {
        targetRouter = '/lawcases'
      }
      const data = yield call(postDataService, { url: api.loginIn }, { ...payload, serviceId: 'srvid_loginIn' })// 此处payload中带的信息是登录表单中的userName，passworod，验证码
      yield put({ type: 'hideLoginLoading' })
      if (data.code === '1') {
        // token 保存在storage中以便其他的接口调用
        localStorage.setItem('token', data.data.token)
        // 将user对象存起来，刷新的时候不用再调用用户信息
        localStorage.setItem('user', JSON.stringify(data.data))
        yield put(routerRedux.push(targetRouter))
        // yield put({ type: 'app/init_main_page', payload: {user: data.data} })//跨model调用action
        yield put({ type: 'app/getAllConfig' })// 跨model调用action
        // yield put({ type: 'app/getCaseReason'})
      } else if (data.code === '40042') {
        // localStorage.setItem('openid', data.data.openid)
        yield put(routerRedux.push(`/login?openid=${data.data.openid}`))
      } else {
        localStorage.clear()// 清除缓存
        throw data
      }
    },
    *getAccessToken ({ payload }, { call, put }) {
      // 判断url是否有openId
      let url = window.location.href
      let targetRouter
      if (url.indexOf('state=') > -1) {
        targetRouter = url.split('state=')[1]
      }
      const data = yield call(getDataService, { url: api.getAccessToken }, { ...payload })
      if (data.success) {
        if (data.data && data.data.openid) {
          localStorage.setItem('openid', data.data.openid)
        }
        if (!jsUtil.isNull(localStorage.getItem('token')) || targetRouter === 'orgList' || targetRouter === 'orgDetail') {
          // 机构列表不需要登录就可以查看
          yield put(routerRedux.push(`/${targetRouter}`))
        }else if(targetRouter === 'loginPhone'){
          //手机号码登录
          yield put(routerRedux.push(`/${targetRouter}`))
        } else {
          yield put(routerRedux.push(`/login?state=${targetRouter}&openid=${data.data.openid}`))
        }
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
    setHasCode (state, action) {
      return {
        ...state,
        hasCode: action.payload,
      }
    },

  },
  subscriptions: {// 订阅数据源，成功之后通过dispatch发送action，进行后续操作
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/login') {
          // let urlParams = parse(location.search.substr(1))
          if (location.query.code) {
            dispatch({ type: 'getAccessToken', payload: { code: location.query.code } })
            dispatch({ type: 'setHasCode', payload: true })
            // dispatch({ type: 'login', payload: {dicLoginAccountType: '4', code: location.query.code} })
          } else {
            dispatch({ type: 'setHasCode', payload: false })
          }
        } else {
          // dispatch({ type: 'getCaseList' })
        }
      })
    },
  },
}
