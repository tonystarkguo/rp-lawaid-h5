import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../utils'
import { parse } from 'qs'
import { postDataService, getDataService } from '../services/commonService'
const { api } = config

export default {
  namespace: 'loginPhone',
  state: {
    loginLoading: false,
    hasCode: false,
    buttonText:"获取验证码",
    buttonDisable:false,
    isgetVerificationCode:false,
  },
  effects: {
    *login({ payload }, { put, call }) {
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
      /* 输入验证码请求数据 */
      payload.captchaValue=payload.text;
      payload.mobile=payload.phpne;
      const data = yield call(postDataService, { url: api.loginPhoneUrl }, { ...payload})// 此处payload中带的信息是登录表单中的userName，passworod，验证码
      
      yield put({ type: 'hideLoginLoading' })
      if (data.code === '1') {
        // token 保存在storage中以便其他的接口调用
        localStorage.setItem('token', data.data.token)
        // 将user对象存起来，刷新的时候不用再调用用户信息
        localStorage.setItem('user', JSON.stringify(data.data));
        //登录成功后跳到网络咨询页面
        if(location.pathname.split("/").length>2){
          yield put(routerRedux.push('/consultList'));//我的咨询
        }else{
          yield put(routerRedux.push('/onlineConsult'))
        }
       
      } else if (data.code === '40042') {
        // localStorage.setItem('openid', data.data.openid)
        yield put(routerRedux.push(`/login?openid=${data.data.openid}`))
      } else {
        localStorage.clear()// 清除缓存
        throw data
      }
      yield put({type:'hideLoginLoading'});
    },
    *getAccessToken ({ payload }, { call, put }) {
      // 判断url是否有openId
      // yield put({type:''})
    },
    /* 获取验证码*/
    *getVerificationCode({payload},{call,put}){
     
      payload=payload.replace(/\s/g,'');
      let phpne={mobile:payload};
      console.log(payload);
      var data=  yield call(getDataService,{url:api.registerCaptcha},{...phpne});
      if(data.code=="1"){
        // yield put({type:'changeVerificationCode',payload:true});
      }else{
        yield put({type:'starAndEndTimes',payload:{buttonDisable:false,buttonText:"获取验证码"}});
        yield put({type:'changeVerificationCode',payload:false});
        console.log(12345)
      }
      // yield put({ type: 'Countdown'})
    },
    //60秒倒计时
    *Countdown({payload},{call,put}){
      yield put({type:'starAndEndTimes',payload:payload});
    },
    *getAllConfig ({ payload }, { call }) {
      const res = yield call(getDataService, { url: api.getAllConfig }, { serviceId: 'srvid_getAllConfig' })
      if (res.success) {
        localStorage.setItem('allConfig', JSON.stringify(res.data))
      } else {
        throw res
      }
    }
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
    starAndEndTimes(state,action){
      return{
        ...state,
        buttonDisable:action.payload.buttonDisable,
        buttonText:action.payload.buttonText,
      }
    },
    changeVerificationCode(state,action){
      return{
        ...state,
        isgetVerificationCode:action.payload,
      }
    }
  },
  subscriptions: {// 订阅数据源，成功之后通过dispatch发送action，进行后续操作
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/loginPhone') {
          dispatch({type:'starAndEndTimes',payload:{buttonDisable:false,buttonText:"获取验证码"}});
          dispatch({ type: 'getAllConfig' })// 
          // let urlParams = parse(location.search.substr(1))
          if (location.query.code) {
            /* 进入登录页去做判断这里不在做了 */
            dispatch({ type: 'login/getAccessToken', payload: { code: location.query.code } })
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
