import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, InputItem, Button, Picker, Toast, WhiteSpace, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { config, jsUtil } from '../../utils'
import styles from './index.less'

const Item = List.Item;

const Register = ({
  register,
  dispatch,
  form: {
    getFieldProps,
    getFieldValue,
    validateFields
  }
}) => {

  const { dicCardType } = register

  let cardType  = jsUtil.getDictDataByKey('dic_credentials_type')

  cardType = cardType.map(item => {
    let newItem = item;
    newItem.label = newItem.name
    newItem.value = newItem.code
    return newItem
  })

  const handleOk = () => {
    let name = getFieldValue('name');
    let cardCode = getFieldValue('cardCode');
    let password = getFieldValue('password');
    let mobile = getFieldValue('mobile');
    let captchaValue = getFieldValue('captchaValue');
    if(name === undefined || name === ''){
      Toast.info('请输入姓名');
      return;
    }else if(dicCardType === undefined || dicCardType === ''){
      Toast.info('请选择证件类型');
      return;
    }else if(cardCode === undefined || cardCode === ''){
      Toast.info('请输入证件号码');
      return;
    }else if(password === undefined || password === ''){
      Toast.info('请输入密码');
      return;
    }else if(mobile === undefined || mobile === ''){
      Toast.info('请输入手机号码');
      return;
    }else if(mobile.length != 11){
      Toast.info('请输入正确的手机号码');
      return;
    }else if(captchaValue === undefined || captchaValue === ''){
      Toast.info('请输入验证码');
      return;
    }else{
      validateFields((errors, values) => {
        let data = {
          ...values,
          dicCardType: dicCardType
        }
        console.log(data)
        dispatch({ 
          type: 'register/register',
          payload: data
        })
      })
    }
  }

  const sendCaptchaValue = () => {
    let mobile = getFieldValue('mobile');
    if(mobile === undefined || mobile === ''){
      Toast.info('请输入手机号码');
      return;
    }else if(mobile.length != 11){
      Toast.info('请输入正确的手机号码');
      return;
    }else{
      dispatch({ 
        type: 'register/getCaptchaValue',
        payload: mobile
      })
    }
  }

  const PickerChange = (value) => {
    dispatch({ 
      type: 'register/onchange',
      payload: value.toString()
    })
  }

  return (
    <div>
      <InputItem clear {...getFieldProps('name')} placeholder="真实姓名" ></InputItem>
      <Picker data={cardType} cols={1} {...getFieldProps('dicCardType')} className="forss" onOk={PickerChange}>
        <Item arrow="horizontal">选择证件类型</Item>
      </Picker>
      <InputItem clear {...getFieldProps('cardCode')} placeholder="请输入证件号码"></InputItem>
      <InputItem clear {...getFieldProps('password')} placeholder="请设置密码"></InputItem>
      <InputItem clear {...getFieldProps('comfirmPwd')} placeholder="请再次输入密码"></InputItem>
      <Flex>
        <Flex.Item style={{flex:1.5}}><InputItem clear {...getFieldProps('mobile')} placeholder="请输入手机号码" type="number"></InputItem></Flex.Item>
        <Flex.Item style={{paddingRight:'.3rem'}}><Button className="btn" type="primary" onClick={sendCaptchaValue}>发送验证码</Button></Flex.Item>
      </Flex>
      <InputItem clear {...getFieldProps('captchaValue')} placeholder="请输入验证码"></InputItem>
      <WhiteSpace size="lg" />
      <Item><Button className="btn" type="primary" onClick={handleOk}>注册</Button></Item>
    </div>
  )
}

Register.propTypes = {
  form: PropTypes.object,
  register: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ register }) => ({ register }))(createForm()(Register))
