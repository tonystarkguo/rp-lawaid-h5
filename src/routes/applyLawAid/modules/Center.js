import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { NoticeBar, WhiteSpace, Icon, Picker, List, Tag, Button, WingBlank, Toast } from 'antd-mobile'
import styles from '../index.less'
import { createForm } from 'rc-form'
import { constants } from '../../../utils'
const Center = ({
  centerData,
  orgList,
  dispatch,
  form: {
    getFieldProps,
    getFieldsValue,
    getFieldValue,
    validateFields,
  }
}) => {
  const { CITY_CASADER_DATA } = constants
  const conditionList = [
    { label: '被告所在地', value: '1' },
    { label: '审理机关所在地', value: '2' },
    { label: '法律援助机构所在地', value: '3' },
  ]
  const handleChange = () => {
    if (getFieldsValue().condition && getFieldsValue().addr) {
      dispatch({
        type: 'applyLawAid/getOrgList',
        payload: {
          addr: getFieldsValue().addr,
        },
      })
    }
  }
  const handleCheck = (item) => {
    dispatch({
      type: 'applyLawAid/setCenterData',
      centerData: {
        orgId: item.id,
      },
    })
  }
  const orgNode = orgList.map(item => {
    return (
      <div className={styles.org} key={item.id} onClick={() => { handleCheck(item) }}>
        <div className={styles.orgName}>
          <p>{item.name}</p>
          <Icon type="check-circle" className={centerData.orgId === item.id ? styles.checked : ''} />
        </div>
        <div className={styles.orgTel}>
          <Icon type={require('../../../svg/icon/phone.svg')} />
          <p>{item.telephone}</p>
        </div>
        <div className={styles.orgAddress}>
          <div>
            <Icon type={require('../../../svg/icon/location.svg')} />
            <p>{item.address}</p>
          </div>
          {/* <Tag>800m</Tag> */}
        </div>
      </div>
    )
  })
  const handleNext = () => {
    if (!centerData.orgId) {
      Toast.info('请选择一个法律援助机构')
      return
    }
    dispatch({
      type: 'applyLawAid/setTabsKey',
      tabsKey: '2',
    })
  }
  return (
    <div className={styles.center}>
      <div className={styles.content}>
        <NoticeBar mode="closable" marqueeProps={{ loop: true, style: { padding: '0 0.15rem' } }}>
          1，如遇到问题，请拨12348；
          2，如果遇到困难，而12348占线，建议到就近的法律援助中心咨询。
        </NoticeBar>
        <List style={{ backgroundColor: 'white' }} className="picker-list">
          <Picker extra="请选择(必填)"
            cols={1}
            data={conditionList}
            title="筛选条件选择"
            onOk={handleChange}
            {...getFieldProps('condition', { rules: [{ required: true, message: '请选择筛选条件' }] })}
          >
            <List.Item>筛选条件选择：</List.Item>
          </Picker>
          <Picker extra="请选择(必填)"
            cols={3}
            data={CITY_CASADER_DATA}
            title="所在地"
            onOk={handleChange}
            {...getFieldProps('addr', {
              initialValue: ['330000', '0', '0'],
              rules: [{ required: true, message: '请选择所在地' }]
            })}
          >
            <List.Item>所在地：</List.Item>
          </Picker>
        </List>
        <WhiteSpace />
        <div className={styles.title}>
          <p>选择法律援助中心</p>
        </div>
        <div>
          {orgList.length ? orgNode : (<p className={styles.note}>请选择筛选条件及所在地</p>)}
        </div>
      </div>
      <div className={styles.btnWraps}>
        <WhiteSpace size="lg" />
        <Button type="primary" onClick={handleNext}>下一步</Button>
      </div>
    </div>
  )
}

export default connect(({ center }) => ({ center }))(createForm()(Center))
