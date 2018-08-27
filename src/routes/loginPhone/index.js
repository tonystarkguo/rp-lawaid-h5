import React from 'react'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, InputItem, WhiteSpace, Toast, Button, NoticeBar } from 'antd-mobile'
import { createForm } from 'rc-form'
import { config } from '../../utils'
import styles from './index.less'

const LoginPhone = ({
  loginPhone,
  dispatch,
  form: {
    getFieldProps,
    validateFields
  }
}) => {
  const { loginLoading, hasCode,buttonText,buttonDisable ,isgetVerificationCode} = loginPhone
  const getVerificationCode = () => {
    validateFields((errors, values) => {
      if (errors.phpne||values.phpne.length<13) {
        Toast.fail('请输入手机号！', 1)
        return 
      }else{
        let {phpne}=values;
      let countdown=60; 
      let cleatTime;
      let buttonObj={};
      const nextTime=()=>{
        if(countdown==0){
        clearInterval(cleatTime);
          buttonObj={buttonDisable:false,buttonText:"获取验证码"};
          countdown=60
        }else{
          countdown--;
          buttonObj={buttonDisable:true,buttonText:"重新发送"+countdown+"秒"};
        };
      };
      // if(isgetVerificationCode){
        cleatTime=setInterval(function(){
            nextTime();
              dispatch({type:'loginPhone/Countdown',payload:buttonObj});
            },1000);
      // }
      dispatch({ type: 'loginPhone/getVerificationCode', payload: phpne });
      }
      
    });
  }
  const checkOk=()=>{
    validateFields((errors, values) => {
      if(errors){
        if (errors.phpne||values.phpne.length<11) {
          // console.log(errors,values)
          Toast.fail('请输入手机号！', 1)
          return
        }
        Toast.fail('请输入验证码！', 1)
        return
      }
      values.phpne=values.phpne.replace(/\s/g,'');
      dispatch({ type: 'loginPhone/login', payload: values });
    });
  }
  return (
    <div>
    {!hasCode?
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <p>{config.name}</p>
      </div>
      <List>
        <InputItem clear className={styles.phoneLeft} type="phone" placeholder="请输入手机号"  {...getFieldProps('phpne',{rules: [{required: true,message: '请输入手机号'},]})} ></InputItem>
        <Button inline disabled={buttonDisable} className={styles.phoneBtton} onClick={getVerificationCode}>{buttonText}</Button>
        <WhiteSpace />
        <InputItem clear  type="text" placeholder="请输入验证码"  {...getFieldProps('text',{rules: [{required: true, message: '请输入验证码'},]})} ></InputItem>
        <WhiteSpace />
        <Button type="primary" className={styles.btn + ' login-button' } onClick={checkOk}>确定</Button>
      </List>
    </div>:''}
    </div>
  )
}

LoginPhone.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}
//                       namespace                                    module
export default connect(({loginPhone}) => ({loginPhone}))(createForm()(LoginPhone))
