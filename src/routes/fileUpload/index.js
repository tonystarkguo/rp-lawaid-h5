import React from 'react'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { InputItem, WingBlank, WhiteSpace, Button, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import styles from './index.less'
import utils from '../../utils/'
const validateMsg = utils.jsUtil.validateMsg
const FileUpload = ({
  fileUpload,
  dispatch,
  form: {
    getFieldProps,
    getFieldsValue,
    validateFields,
  }
}) => {
  const { url, fileTypeCode, tCaseId } = fileUpload
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        validateMsg(errors)
        return
      }
      if (!fileTypeCode) {
        Toast.info('请选择材料')
        return
      }
      if (!tCaseId) {
        dispatch({
          type: 'applyLawAid/setTabsKey',
          tabsKey: '4',
        })
      }
      dispatch({
        type: 'fileUpload/handleSubmit',
        payload: getFieldsValue(),
      })
    })
  }
  const handleBack = () => {
    if (!tCaseId) {
      dispatch({
        type: 'applyLawAid/setTabsKey',
        tabsKey: '4',
      })
    }
    dispatch(routerRedux.go(-1))
  }
  const uploadChange = (e) => {
    e.persist()
    if (e.target.files[0]) {
      dispatch({
        type: 'fileUpload/getUrl',
        payload: e,
      })
    }
  }
  return (
    <div className={styles.fileUpload}>
      <WingBlank>
        <InputItem placeholder="请输入文件描述（如：身份证正面）" {...getFieldProps('name', { rules: [{ required: true, message: '请输入文件描述（如：身份证正面）' }] })} />
        {(fileTypeCode === 4 || fileTypeCode === 5) && url && <img src={url} alt="图片" className={styles.img} />}
        {fileTypeCode === 1 && <img alt="doc" src={utils.config.docSvg} className={styles.fileSvg} />}
        {fileTypeCode === 2 && <img alt="pdf" src={utils.config.pdfSvg} className={styles.fileSvg} />}
        {fileTypeCode === 3 && <img alt="txt" src={utils.config.txtSvg} className={styles.fileSvg} />}
        <div className={styles.upload}>
          <input type="file" className={styles.input} onChange={uploadChange} accept="image/jpeg,image/jpg,image/png" />
          <div className={styles.cover}>
            <p>{fileTypeCode ? '点击更改' : '点击上传'}</p>
          </div>
        </div>
        <WhiteSpace />
        <Button type="primary" onClick={handleSubmit}>上传材料</Button>
        <WhiteSpace />
        <Button type="primary" onClick={handleBack}>返回</Button>
        <WhiteSpace />
      </WingBlank>
    </div>
  )
}

FileUpload.propTypes = {
  form: PropTypes.object,
  fileUpload: PropTypes.object,
}
export default connect(({ fileUpload }) => ({ fileUpload }))(createForm()(FileUpload))
