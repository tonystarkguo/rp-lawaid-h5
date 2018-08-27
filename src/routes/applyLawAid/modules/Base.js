import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { WhiteSpace, Icon, Picker, List, InputItem, Switch, Button, Checkbox, Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import styles from '../index.less'
import utils from '../../../utils/'
const validateMsg = utils.jsUtil.validateMsg
const Item = List.Item
const CheckboxItem = Checkbox.CheckboxItem
const { jsUtil } = utils
const Base = ({
  allConfig,
  dispatch,
  baseData,
  noOne,
  form: {
    getFieldProps,
    getFieldsValue,
    getFieldValue,
    validateFields,
  }
}) => {
  const { dicConsultantCategoryList } = baseData
  const { dictData = {} } = allConfig
  const dicConsultantCategoryListList = jsUtil.getDictDataByKey('dic_dic_occupatio')
  const dicLegalInstWayDataList = jsUtil.getDictDataByKey('dic_file_mailing')
  const dic_proxy_type = jsUtil.getDictDataByKey('dic_dic_case_proxy_type')
  const dicProxyTypeData = dic_proxy_type.map(item => {
    return { label: item.name, value: item.code }
  })
  const dicLegalInstWayData = dicLegalInstWayDataList.map(item => {
    return { label: item.name, value: item.code }
  })
  const handlePrev = () => {
    dispatch({
      type: 'applyLawAid/setTabsKey',
      tabsKey: '1',
    })
  }
  const checkboxChange = (e, val) => {
    let { value } = dicConsultantCategoryList
    if (e.target.checked === true) {
      value.push(val)
    } else {
      let idx = value.indexOf(val)
      if (idx !== -1) value.splice(idx, 1)
    }
    dispatch({
      type: 'applyLawAid/changedicConsultantCategoryList',
      payload: { value },
    })
  }
  const handleNext = () => {
    validateFields((errors) => {
      if (errors) {
        validateMsg(errors)
        return
      }
      dispatch({
        type: 'applyLawAid/setBaseData',
        baseData: getFieldsValue(),
      })
      dispatch({
        type: 'applyLawAid/setTabsKey',
        tabsKey: '3',
      })
    })
  }
  const user = JSON.parse(localStorage.getItem('user'))
  return (
    <div className={styles.base}>
      <div className={styles.content}>
        <List style={{ backgroundColor: 'white' }}>
          <InputItem editable={false} placeholder="请输入（必填）" {...getFieldProps('name', {
            rules: [{ required: true, message: '请输入姓名' }],
          })}>姓名</InputItem>
          <InputItem editable={false} placeholder="请输入（必填）" {...getFieldProps('cardCode', {
            rules: [{ required: true, message: '请输入身份证' }],
          })}>身份证</InputItem>
          <InputItem editable={false} placeholder="请输入（必填）" type="number" {...getFieldProps('mobile', {
            rules: [{ required: true, message: '请输入联系电话' }],
          })}>联系电话</InputItem>
          <InputItem placeholder="请输入（必填）" {...getFieldProps('emsAddress', { rules: [{ required: true, message: '请输入通讯地址' }] })}>通讯地址</InputItem>
        </List>
        <WhiteSpace />
        <List style={{ backgroundColor: 'white' }}>
          <List.Item
            extra={<Switch
              {...getFieldProps('isProxy', { initialValue: false, valuePropName: 'checked' })}
            />}
          >是否代理人申请</List.Item>
          {getFieldValue('isProxy') &&
            <div className={styles.proxy}>
              <InputItem placeholder="请输入(必填)" {...getFieldProps('proxyName', { rules: [{ required: true, message: '请输入代理人姓名' }] })}>代理人姓名</InputItem>
              <InputItem placeholder="请输入(必填)" {...getFieldProps('proxyCardId', { rules: [{ required: true, message: '请输入代理人身份证' }] })}>代理人身份证</InputItem>
              <InputItem placeholder="请输入(必填)" type="number" {...getFieldProps('proxyMobile', { rules: [{ required: true, message: '请输入代理人身份证' }] })}>代理人联系电话</InputItem>
              <Picker extra="请选择(必填)"
                {...getFieldProps('dicProxyType', {
                  rules: [
                    { required: true, message: '请选择代理人类别' },
                  ],
                })
                }
                cols={1}
                data={dicProxyTypeData}
                title="代理人类别"
              >
                <List.Item>代理人类别</List.Item>
              </Picker>
            </div>
          }
        </List>
        <WhiteSpace />
        <List style={{ backgroundColor: 'white' }}>
          <Picker extra="请选择(必填)"
            {...getFieldProps('dicLegalInstWay', {
              rules: [
                { required: true, message: '请选择文书送达方式' },
              ],
            })
            }
            cols={1}
            data={dicLegalInstWayData}
            title="文书送达方式"
          >
            <List.Item>文书送达方式</List.Item>
          </Picker>
        </List>
        <WhiteSpace />
        <Item>人群类别（多选）</Item>
        <List style={{ backgroundColor: 'white' }}>
          <Flex wrap="wrap">
              {dicConsultantCategoryListList.map(i => (
                <CheckboxItem className="inline" checked={dicConsultantCategoryList.value.indexOf(i.code) > -1} key={i.code} onChange={(e) => checkboxChange(e, i.code)} >
                  {i.name}
                </CheckboxItem>
                )
              )}
          </Flex>
        </List>
      </div>
      <div className={styles.btnWraps}>
        <Button type="primary" disabled={noOne} inline className={styles.baseBtn} onClick={handlePrev}>上一步</Button>
        <Button type="primary" inline className={styles.baseBtn} onClick={handleNext}>下一步</Button>
      </div>
    </div>
  )
}
Base.propTypes = {
  form: PropTypes.object,
}
export default connect(({ base }) => ({ base }))(createForm({
  mapPropsToFields (props) {
    let baseData = props.baseData
    return {
      name: baseData.name,
      cardCode: baseData.cardCode,
      mobile: baseData.mobile,
      emsAddress: baseData.emsAddress,
      isProxy: baseData.isProxy,
      proxyName: baseData.proxyName,
      proxyCardId: baseData.proxyCardId,
      proxyMobile: baseData.proxyMobile,
      dicProxyType: baseData.dicProxyType,
      dicLegalInstWay: baseData.dicLegalInstWay,
    }
  },
  onFieldsChange (props, fields) {
    props.dispatch({ type: 'applyLawAid/onBaseFieldsChange', payload: fields })
  },
})(Base))
