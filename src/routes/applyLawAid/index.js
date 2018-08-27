import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Tabs } from 'antd-mobile'
import { createForm } from 'rc-form'
import Center from './modules/Center'
import Base from './modules/Base'
import Cases from './modules/Cases'
import File from './modules/File'

const TabPane = Tabs.TabPane

const ApplyLawAid = ({
  applyLawAid,
  dispatch,
}) => {
  const handleTabsChange = (key) => {
    dispatch({
      type: 'applyLawAid/setTabsKey',
      tabsKey: key,
    })
  }
  const { flag, fileList, tabsKey, allConfig, orgList, centerDataDone, baseDataDone, caseDataDone, caseDetail, baseData, centerData, noOne } = applyLawAid
  const centerProps = {
    allConfig,
    orgList,
    centerData,
  }
  const baseProps = {
    allConfig,
    baseData,
    flag,
    noOne,
  }
  const caseProps = {
    allConfig,
    caseDetail,
  }
  const fileProps = {
    allConfig,
    fileList,
    caseDetail,
  }
  return (
    <div className={styles.applyLawAid}>
      <Tabs onChange={handleTabsChange} activeKey={tabsKey} swipeable={false}>
        <TabPane tab="法律援助中心" key="1">
          <Center {...centerProps} />
        </TabPane>
        <TabPane tab="基本资料" key="2">
          <Base {...baseProps} />
        </TabPane>
        <TabPane tab="案件情况" key="3">
          <Cases {...caseProps} />
        </TabPane>
        <TabPane tab="证明材料" key="4">
          <File {...fileProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

ApplyLawAid.PropTypes = {
  applyLawAid: PropTypes.object,
}

export default connect(({ applyLawAid }) => ({ applyLawAid }))(createForm()(ApplyLawAid))
