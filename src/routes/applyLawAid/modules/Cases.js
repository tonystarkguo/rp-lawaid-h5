import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { TextareaItem, WhiteSpace, WingBlank, Button, List, Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import styles from '../index.less'
import utils from '../../../utils/'
const { jsUtil } = utils
const validateMsg = utils.jsUtil.validateMsg

const Cases = ({
  caseDetail,
  dispatch,
  allConfig,
  form: {
    getFieldProps,
    getFieldsValue,
    getFieldValue,
    validateFields,
  }
}) => {
  const { dictData } = allConfig
  const dic_case_type = jsUtil.getDictDataByKey('dic_case_type')
  const dicCaseTypeData = dic_case_type.map(item => {
    return { label: item.name, value: item.code }
  })
  const handlePrev = () => {
    dispatch({
      type: 'applyLawAid/setTabsKey',
      tabsKey: '2',
    })
  }
  const handleNext = () => {
    validateFields((errors) => {
      if (errors) {
        validateMsg(errors)
        return
      }
      dispatch({
        type: 'applyLawAid/setCaseDetail',
        caseDetail: getFieldsValue(),
      })
      dispatch({
        type: 'applyLawAid/setTabsKey',
        tabsKey: '4',
      })
    })
  }
  return (
    <div className={styles.cases}>
      <div className={styles.centent}>
        <List style={{ backgroundColor: 'white' }}>
          <Picker extra="请选择(必填)"
            {...getFieldProps('dicCaseType', {
              rules: [
                { required: true, message: '请选择案件类型' },
              ],
            })
            }
            cols={1}
            data={dicCaseTypeData}
            title="案件类型"
          >
            <List.Item>案件类型</List.Item>
          </Picker>
        </List>
        <WingBlank>
          <p>案情概述: <span>不超过500字</span></p>
          <TextareaItem
            title=""
            placeholder="请输入："
            data-seed="logId"
            rows={5}
            count={500}
            autoFocus
            autoHeight
            {...getFieldProps('caseDetail', { rules: [{ required: true, message: '请输入案件概述' }] })}
          />
        </WingBlank>
      </div>
      <div className={styles.btnWraps}>
        <Button type="primary" inline className={styles.baseBtn} onClick={handlePrev}>上一步</Button>
        <Button type="primary" inline className={styles.baseBtn} onClick={handleNext}>下一步</Button>
      </div>
    </div>
  )
}

export default connect(({ cases }) => ({ cases }))(createForm({
  mapPropsToFields (props) {
    let caseDetail = props.caseDetail
    return {
      caseDetail: caseDetail.caseDetail,
      dicCaseType: caseDetail.dicCaseType,
    }
  },
  onFieldsChange (props, fields) {
    props.dispatch({type: 'applyLawAid/onCaseFieldsChange', payload: fields })
  },
})(Cases))
