import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Tabs } from 'antd-mobile'
import { createForm } from 'rc-form'
import File from './modules/File'

const TabPane = Tabs.TabPane

const SupplementFiles = ({
  supplementFiles,
  dispatch,
}) => {
  const { fileList, tCaseId, isFreeHardMaterials } = supplementFiles

  const fileProps = {
    fileList,
    tCaseId,
    isFreeHardMaterials,
  }
  return (
    <div className={styles.supplement}>
      <Tabs defaultActiveKey={'4'} swipeable={false}>
        <TabPane tab="法律援助中心" key="1">
          <div></div>
        </TabPane>
        <TabPane tab="基本资料" key="2">
          <div></div>
        </TabPane>
        <TabPane tab="案件情况" key="3">
          <div></div>
        </TabPane>
        <TabPane tab="证明材料" key="4">
          <File {...fileProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

SupplementFiles.PropTypes = {
  supplementFiles: PropTypes.object,
}

export default connect(({ supplementFiles }) => ({ supplementFiles }))(createForm()(SupplementFiles))
