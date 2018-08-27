import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { List, Button, WhiteSpace, Toast, Icon, Modal, NoticeBar } from 'antd-mobile'
import utils from '../../../utils/'
import styles from '../index.less'
const alert = Modal.alert
const File = ({
  tCaseId,
  fileList,
  dispatch,
  isFreeHardMaterials,
}) => {
  const handleSubmit = () => {
    const fileTypeList = fileList.map(item => item.dicType)
    if (fileTypeList.indexOf('1') === -1) {
      Toast.info('请上传有效身份证明')
      return
    }
    if (fileTypeList.indexOf('5') === -1 && isFreeHardMaterials === '0') {
      Toast.info('请上传经济困难证明')
      return
    }
    if (fileTypeList.indexOf('6') === -1) {
      Toast.info('请上传相关证据、证明材料')
      return
    }
    dispatch({
      type: 'supplementFiles/handleSubmit',
    })
  }
  const handleDelete = (item) => {
    alert('删除', '确定删除此文件？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => {
          dispatch({
            type: 'supplementFiles/deleteFile',
            payload: item,
          })
        },
      },
    ])
  }
  const currentList = (type) => {
    return fileList.filter(_ => _.dicType === type).map((item, index) => {
      return (
        <div className={styles.contentList} key={index}>
          {item.name && <p>{item.name}</p>}
          <Icon type="cross-circle" className={styles.close} onClick={() => handleDelete(item)} />
          {(['jpg', 'png', 'jpeg', 'image/png', 'image/jpeg', 'JPG', 'PNG', 'JPEG'].indexOf(item.dicFileType) > -1) && item.addrUrl && <img src={item.addrUrl} alt="图片" className={styles.img} />}
          {(['doc', 'docx'].indexOf(item.dicFileType) > -1) && <img alt="doc" src={utils.config.docSvg} className={styles.fileSvg} />}
          {(['pdf'].indexOf(item.dicFileType) > -1) && <img alt="pdf" src={utils.config.pdfSvg} className={styles.fileSvg} />}
          {(['txt'].indexOf(item.dicFileType) > -1) && <img alt="txt" src={utils.config.txtSvg} className={styles.fileSvg} />}
        </div>
      )
    })
  }
  const handleLink = (type) => {
    dispatch(routerRedux.push(`/fileUpload/${type}?tCaseId=${tCaseId}`))
  }
  const remark = () => {
    let result = ''
    if (fileList && fileList.length > 0) {
      fileList.forEach(item => {
        if (item.remark) {
          result = item.remark
        }
      })
    }
    return result
  }
  return (
    <div className={styles.file}>
      {remark().length > 0 &&
        <NoticeBar mode="closable" marqueeProps={{ loop: true, style: { padding: '0 0.15rem' } }}>
          {remark()}
        </NoticeBar>
      }
      <div className={styles.item}>
        <p>有效身份证明</p>
        <div className={styles.content}>
          {currentList('1')}
          <a className={styles.link} onClick={() => handleLink('1', 'supplement')}>点击上传：身份证、军官镇、护照、港澳台身份证等证明代理申请人身份的材料。</a>
        </div>
      </div>
      <div className={styles.item}>
        <p>经济困难证明 {isFreeHardMaterials === '1' && <span>（免交）</span>}</p>
        <div className={styles.content}>
          {currentList('5')}
          <a className={styles.link} onClick={() => handleLink('5', 'supplement')}>点击上传：下岗职工失业证、低保户家庭证、低保边缘家庭证、有关政府部门（人民团体）出具的生活困难证明。</a>
        </div>
      </div>
      <div className={styles.item}>
        <p>相关证据、证明材料</p>
        <div className={styles.content}>
          {currentList('6')}
          <a className={styles.link} onClick={() => handleLink('6', 'supplement')}>点击上传：例如劳动关系证明、银行工资单、工伤认定书、事故责任认定书等。</a>
        </div>
      </div>
      <div>
        <Button type="primary" onClick={handleSubmit}>补充材料</Button>
      </div>
      <WhiteSpace size="lg" />
    </div>
  )
}

export default connect(({ file }) => ({ file }))(File)
