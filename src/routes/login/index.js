import React from 'react'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, InputItem, WhiteSpace, Toast, Button, NoticeBar } from 'antd-mobile'
import { createForm } from 'rc-form'
import { config } from '../../utils'
import styles from './index.less'

const Login = ({
  login,
  dispatch,
  form: {
    getFieldProps,
    validateFields
  }
}) => {

  const { loginLoading, hasCode } = login

  const handleOk = () => {
    validateFields((errors, values) => {
      if (errors) {
        Toast.fail('请输入用户名及密码！', 1)
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  const toRegister = () => {
    window.location.href = ' https://puser.zjzwfw.gov.cn/sso/usp.do?action=mobileRegisterUser&type=2&servicecode=zjsftflyz&goto=http%3A%2F%2Fflyz.zjsft.gov.cn%2Flogin'
    // dispatch(routerRedux.push('/register'))
  }
  const toAuth = () => {
    window.location.href = 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1f2908759727698e&redirect_uri=http%3A%2F%2F31827d68.ngrok.io%2Flogin&response_type=code&scope=snsapi_userinfo&state=applyLawAid#wechat_redirect'
  }

  return (
    <div>
    {!hasCode?
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <p>{config.name}</p>
      </div>
      <InputItem clear {...getFieldProps('cardCode', {
        rules: [{required: true}],
      })} placeholder="请输入证件号、手机号或帐号" ></InputItem>
      <InputItem clear {...getFieldProps('password', {
        rules: [{required: true}],
      })} type="password" placeholder="请输入密码"></InputItem>
      <WhiteSpace />
      <Button className={styles.btn + ' login-button'} type="primary" onClick={handleOk}>登录</Button>
      <div className={styles.register}>
        <div>
          <a onClick={toRegister}>快速注册</a>          
        </div>  
      </div>
    </div>:''}
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(createForm()(Login))
