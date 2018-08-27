import React from 'react'
import { connect } from 'dva'
import { List, Button } from 'antd-mobile';
import styles from './index.less'
import { routerRedux } from 'dva/router'

const Item = List.Item;

const Message = ({
  message,
  dispatch
}) => {

  const { user } = message

  const logout = () => {
    localStorage.clear() // 清除所有的localStorage数据
    dispatch(routerRedux.push(`/login`))
  }

  return (
    <List>
      {
        user.headPic === null || user.headPic === '' ?
        ''
        :
        <Item><img src={user.headPic} /></Item>
      }
      <Item>姓名：{user.name}</Item>
      <Item>性别：{user.dicGenderName}</Item>
      <Item>证件号：{user.cardCode}</Item>
      <Item>手机号：{user.mobile}</Item>
      <Item>通讯地址：{user.legalInstAddr}</Item>
      <Item><Button className="btn" type="primary" onClick={logout}>退出登录</Button></Item>
    </List>
  )

}

export default connect(({ message }) => ({ message }))(Message)
