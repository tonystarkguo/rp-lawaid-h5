import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { List, Button, WhiteSpace, Toast, Icon, Modal, Picker } from 'antd-mobile'
import utils from '../../../utils/'
import styles from '../index.less'
const { jsUtil } = utils
const alert = Modal.alert
const File = ({
  allConfig,
  caseDetail,
  fileList,
  dispatch,
}) => {
  const { dictData = {} } = allConfig
  const dic_dic_free_hard_materials_reason = jsUtil.getDictDataByKey('dic_dic_free_hard_materials_reason')
  dic_dic_free_hard_materials_reason.splice(6)
  const dicFreeHardMaterialsReason = dic_dic_free_hard_materials_reason.map(item => {
    return { label: item.name, value: item.code }
  })
  const handlePrev = () => {
    dispatch({
      type: 'applyLawAid/setTabsKey',
      tabsKey: '3',
    })
  }
  const handleSubmit = () => {
    const fileTypeList = fileList.map(item => item.materialType)
    if (fileTypeList.indexOf('1') === -1) {
      Toast.info('请上传有效身份证明')
      return
    }
    if (fileTypeList.indexOf('5') === -1 && caseDetail.dicFreeHardMaterialsReason.value === '') {
      Toast.info('请上传经济困难证明')
      return
    }
    if (fileTypeList.indexOf('6') === -1) {
      Toast.info('请上传相关证据、证明材料')
      return
    }
    dispatch({
      type: 'applyLawAid/handleSubmit',
    })
  }
  const handleDelete = (addrUrl) => {
    alert('删除', '确定删除此文件？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => {
          dispatch({
            type: 'applyLawAid/deleteFile',
            payload: addrUrl,
          })
        },
      },
    ])
  }
  const handleOkReason = (val) => {
    console.log(val)
    dispatch({
      type: 'applyLawAid/setDicFreeHardMaterialsReason',
      payload: val[0],
    })
  }
  const currentList = (type) => {
    return fileList.filter(_ => _.materialType === type).map(item => {
      return (
        <div className={styles.contentList} key={item.addrUrl}>
          {item.name && <p>{item.name}</p>}
          <Icon type="cross-circle" className={styles.close} onClick={() => handleDelete(item.addrUrl)} />
          {(item.fileTypeCode === 4 || item.fileTypeCode === 5) && item.url && <img src={item.url} alt="图片" className={styles.img} />}
          {item.fileTypeCode === 1 && <img alt="doc" src={utils.config.docSvg} className={styles.fileSvg} />}
          {item.fileTypeCode === 2 && <img alt="pdf" src={utils.config.pdfSvg} className={styles.fileSvg} />}
          {item.fileTypeCode === 3 && <img alt="txt" src={utils.config.txtSvg} className={styles.fileSvg} />}
        </div>
      )
    })
  }
  const handleLink = (type) => {
    dispatch(routerRedux.push(`/fileUpload/${type}`))
  }
  return (
    <div className={styles.file}>
      <div className={styles.content}>
        <div className={styles.item}>
          <p>有效身份证明（包括代理人身份证明）</p>
          <div className={styles.content}>
            {currentList('1')}
            <a className={styles.link} onClick={() => handleLink('1')}>点击上传：身份证、军官镇、护照、港澳台身份证等证明代理申请人身份的材料。</a>
          </div>
        </div>
        <div className={styles.item}>
          <p>经济困难证明</p>
          <List style={{ backgroundColor: 'white' }}>
            <Picker extra="免交材料条件"
              cols={1}
              data={dicFreeHardMaterialsReason}
              title="免交材料条件"
              value={[caseDetail.dicFreeHardMaterialsReason.value]}
              onOk={handleOkReason}
            >
              <List.Item>免交材料条件</List.Item>
            </Picker>
          </List>
          <div className={styles.content}>
            {currentList('5')}
            <a className={styles.link} onClick={() => handleLink('5')}>点击上传：下岗职工失业证、低保户家庭证、低保边缘家庭证、有关政府部门（人民团体）出具的生活困难证明。</a>
          </div>
        </div>
        <div className={styles.item}>
          <p>相关证据、证明材料</p>
          <div className={styles.content}>
            {currentList('6')}
            <a className={styles.link} onClick={() => handleLink('6')}>点击上传：例如劳动关系证明、银行工资单、工伤认定书、事故责任认定书等。</a>
          </div>
        </div>
      </div>
      <div className={styles.btnWraps}>
        <Button type="primary" inline className={styles.baseBtn} onClick={handlePrev}>上一步</Button>
        <Button type="primary" inline className={styles.baseBtn} onClick={handleSubmit}>提交申请</Button>
      </div>
    </div>
  )
}

export default connect(({ file }) => ({ file }))(File)
