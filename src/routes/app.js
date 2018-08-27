import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Menu, ActivityIndicator, NavBar, Icon } from 'antd-mobile'
import { connect } from 'dva'
import { classnames, config } from '../utils'
import '../themes/index.less'
import styles from './app.less'
import NProgress from 'nprogress'
import Login from './login/index.js'
import LoginPhone from './loginPhone/index.js'
const { prefix } = config
import pathToRegexp from 'path-to-regexp'

const App = ({ children, location, dispatch, app, loading }) => {
  const { user, initData, show } = app

  const onChange = (value) => {
    let label = ''
    let url = ''
    initData.forEach((dataItem) => {
      if (dataItem.value === value[0]) {
        label = dataItem.label
        if (dataItem.children && value[1]) {
          dataItem.children.forEach((cItem) => {
            if (cItem.value === value[1]) {
              label += `${cItem.label}`
              url = `${cItem.url}`
            }
          })
        }
      }
    })
    dispatch({ type: 'app/hide' })
    dispatch(routerRedux.push(url))
  }

  const handleClick = (e) => {
    e.preventDefault()
    dispatch({
      type: 'app/isShow',
      payload: !show,
    })
  }

  const menuEl = (
    <Menu
      className="foo-menu"
      data={initData}
      value={['1', '3']}
      onChange={onChange}
      height={document.documentElement.clientHeight * 0.6}
    />
  )

  const loadingEl = (
    <div style={{ width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </div>
  )

  NProgress.start()
  !loading.global && NProgress.done()
  const path = window.location.href;
  //咨询详情 - 加密情况下不做 token 判断
  let isNeedconsultDetailToken=false;
  let reg=/^[0-9]+.?[0-9]*$/;
  if(path.indexOf('consultDetaily')>0){
    console.log(path.split("/")[4])
    isNeedconsultDetailToken=!reg.test(path.split("/")[4])
  }
 const isLogin = ((!!localStorage.getItem('token')) || path.indexOf('orgList') > 0 || path.indexOf('orgDetail') > 0||isNeedconsultDetailToken)
 const  isLoginPhone=(path.indexOf('loginPhone')>0);
  // const isLogin = true
  return (
    isLogin ? (
      <div id="main-container" className={styles.main}>
        {/* <div className={styles.menuBar}>
          <div className={show ? 'menu-active' : ''}>
            <NavBar
              leftContent="菜单"
              mode="light"
              iconName={require('../svg/icon/menu.svg')}
              onLeftClick={handleClick}
              className="top-nav-bar"
            ></NavBar>
          </div>
          {show ? initData ? menuEl : loadingEl : null}
        </div>*/}

        <div className={styles.container}>
          <div className={styles.content} id="scroll-area">
            {children}
          </div>
        </div>
      </div>) : (isLoginPhone? <LoginPhone />:<Login/>)
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ app, loading }) => ({ app, loading }))(App)// 容器组件绑定，将props交由redux管理
