import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import { createForm } from 'rc-form';
import _ from 'lodash'

import { Button, Flex, WingBlank, WhiteSpace, Steps, Icon } from 'antd-mobile'
const Step = Steps.Step

const Caselog = ({ location, dispatch, loading, caselog }) => {
  let logList = caselog.logList || []
  let reverseList = []
  for(let i=logList.length-1;i>=0;i--){
    reverseList.push(logList[i])
  }
  // let logL = _.reverse(logList)
  console.log('logL', reverseList)
  // const logList = [
  //   {id: 1, title: '审查', logDetail: '审核通过，同意法援。', createTime: '2017-08-11 14:35:21'},
  //   {id: 2, title: '网上预审', logDetail: '杭州市法援局预审通过，请到现场核对材料。', createTime: '2017-08-11 14:35:21'},
  //   {id: 3, title: '网上申请', logDetail: '群众通过微信公众号／公共法律服务网申请法律援助。', createTime: '2017-08-11 14:35:21'},
  // ]

  const getDesc = (item) => {
    return (<div>
      <div>{item.logMessage}</div>
      <div>{item.createTime}</div>
    </div>
    )
  }

  return (
    <div className="content-inner content-container">
      <WhiteSpace size="lg" />
      <WingBlank>
        <div className="sub-title">进度详情</div>
        <WhiteSpace />
        {
          reverseList.length ? 
            <Steps current={reverseList.length-1}>
              { reverseList.map((item, index) => <Step key={index} title={item.logTitle} description={getDesc(item)} />)}
            </Steps>
            : <div style={{color: '#cccccc'}}>暂无进度日志</div>
        }
      </WingBlank>
    </div>
  )
}

Caselog.propTypes = {
  caselog: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ caselog, location, dispatch, loading }) => ({ caselog, location, dispatch, loading }))(Caselog)
