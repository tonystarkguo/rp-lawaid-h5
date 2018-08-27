import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, Toast, Flex, Button, Modal } from 'antd-mobile'
import { createForm } from 'rc-form'
import { routerRedux } from 'dva/router'
import styles from './index.less'
import { config, jsUtil } from '../../utils/'

const Item = List.Item

const OrgDetail = ({
  orgDetail,
  dispatch,
  form: {
    getFieldProps,
    getFieldValue,
    validateFields,
  },
}) => {
  const dataSource = JSON.parse(orgDetail.dataSource)

  const toConsult = () => {
    const orgMsg = JSON.parse(localStorage.getItem('orgMsg'))
    dispatch(routerRedux.push(`/onlineConsult?orgId=${orgMsg.id}`))
  }

  const toApplyLawAid = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    if (!token) { // 是否登录
      if (localStorage.getItem('openid')) {
        dispatch(routerRedux.push(`/login?openid=${localStorage.getItem('openid')}`))
      } else {
        dispatch(routerRedux.push('/login'))
      }
    } else if (user && user.isAuth) {
      const orgMsg = JSON.parse(localStorage.getItem('orgMsg'))
      dispatch(routerRedux.push(`/applyLawAid?orgId=${orgMsg.id}`))
    } else {
      Modal.alert('申请法援需实名认证，请在“浙江政务网”实名认证后重新登录', '', [
        { text: '取消' },
        { text: '去认证', onPress: () => window.location.href = 'https://puser.zjzwfw.gov.cn/sso/usp.do?action=mobilefplogin&servicecode=zjsftflyz&goto=http%3A//flyzwx.zjsft.gov.cn/login' },
      ])
    }
  }

  return (
    <div>
      <List className={styles.list}>
        <img className={styles.pic} src={dataSource.picAddress} alt="" />
        <Item thumb={config.mapSvg}>{dataSource.address}</Item>
        <Item thumb={config.phoneSvg}>{dataSource.telephone}</Item>

        <Flex className={styles.center}>
          <Flex.Item><Button className="btn" type="primary" onClick={toConsult}>网络咨询</Button></Flex.Item>
          <Flex.Item><Button className="btn" type="primary" onClick={toApplyLawAid}>申请法援</Button></Flex.Item>
        </Flex>
      </List>
    </div>
  )
}

OrgDetail.propTypes = {
  orgDetail: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ orgDetail }) => ({ orgDetail }))(createForm()(OrgDetail))
