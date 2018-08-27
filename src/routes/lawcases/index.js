import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Button, Flex, WingBlank,WhiteSpace, List } from 'antd-mobile'
import styles from './index.less'
const Item = List.Item
const Brief = Item.Brief

//采用无状态stateless的方式定义react component
const Lawcases = ({ location, dispatch, lawcases, loading }) => {
  //预处理传入的数据
  const { lawcaseList = [], isLoaded = false } = lawcases
  const mockCaseList = [
    {seq: 1, caseId: 1, caseStatus: 1, caseNum: '杭援2017001', caseDetail: '房产纠纷案件房产纠纷案件房产纠纷案件房产纠纷案件', caseOriginCreateTime: '2017-08-17 12:33:32', hearOrg: '杭州市法援中心', hearOrgPng: 'https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg', caseReason: '民事-劳动争议-生育保险', caseStatusName: '预审中', hpUserName: '张律师', dicHpIdentityName: '律师', hpHeadPic: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'},
    {seq: 2, caseId: 2, caseStatus: 2, caseNum: '杭援2017001', caseDetail: '房产纠纷案件房产纠纷案件房产纠纷案件房产纠纷案件', caseOriginCreateTime: '2017-08-17 12:33:32', hearOrg: '杭州市法援中心', hearOrgPng: 'https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg', caseReason: '民事-劳动争议-生育保险', caseStatusName: '需补充材料', hpUserName: '张律师', dicHpIdentityName: '律师', hpHeadPic: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'},
    {seq: 3, caseId: 3, caseStatus: 5, caseNum: '杭援2017001', caseDetail: '房产纠纷案件房产纠纷案件房产纠纷案件房产纠纷案件', caseOriginCreateTime: '2017-08-17 12:33:32', hearOrg: '杭州市法援中心', hearOrgPng: 'https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg', caseReason: '民事-劳动争议-生育保险', caseStatusName: '审查中', hpUserName: '张律师', dicHpIdentityName: '律师', hpHeadPic: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'},
    {seq: 4, caseId: 4, caseStatus: 15, caseNum: '杭援2017001', caseDetail: '房产纠纷案件房产纠纷案件房产纠纷案件房产纠纷案件', caseOriginCreateTime: '2017-08-17 12:33:32', hearOrg: '杭州市法援中心', hearOrgPng: 'https://t.alipayobjects.com/images/rmsweb/T16xRhXkxbXXXXXXXX.svg', caseReason: '民事-劳动争议-生育保险', caseStatusName: '承办中', hpUserName: '张律师', dicHpIdentityName: '律师', hpHeadPic: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'},
    
  ]
  const viewDetails = (item) => {
    // !!WeixinJSBridge && WeixinJSBridge.invoke('closeWindow',{},function(res){
      
    //   alert(res.err_msg);
      
    // })
    dispatch(routerRedux.push(`/lawcase/${item.caseId}`))
  }
  const handleLongPress = (e) => {
    console.log('longpress toggled', e);
  }

  const genThumbElem = (item) => {
    // 承办中和办结的时候显示律师的头像
    return item.caseStatusValue < 14 ? <div className={styles.imgTxt}><img className={styles.squalImg} src={item.hearOrgPng} /><div>{item.hearOrg}</div></div> : <div className={styles.imgTxt}><img className={styles.circleImg} src={item.hpHeadPic} /><div>{item.hpUserName}/{item.dicHpIdentityName}</div></div>
  }

  const getCaseBreafInfo = (item) => {
    let status = item.caseStatusValue
    let result = ''
    if(status === '1' || status === '3' || status === '4'){
      // 预审中
      result = <ul>
        <li>流水号：{item.acceptNum}</li>
        <li>案件概述：{item.caseDetail}</li>
        <li>{item.caseOriginCreateTime}</li>
      </ul>
    }else if(status === '2' || status === '5' || status === '7'){
      // 需补充材料
      result = <ul>
        <li>案件概述：{item.caseDetail}</li>
        <li>案由：{item.caseReason}</li>
        <li>{item.caseOriginCreateTime}</li>
      </ul>
    }else{
      result = <ul>
        <li>案号：{item.caseNum}</li>
        <li>案件概述：{item.caseDetail}</li>
        <li>案由：{item.caseReason}</li>
        <li>{item.caseOriginCreateTime}</li>
      </ul>
    }
    return result
  }

  const getStatusName = (item) => {
    let caseStatus = item.caseStatusValue
    let result = ''
    if (caseStatus === '1') {
      result = '待预审'
    } else if (caseStatus === '2') {
      result = '需补充材料'
    } else if(caseStatus === '3') {
      result = '预审通过'
    } else if(caseStatus === '4') {
      result = '预审不通过'
    } else if(caseStatus === '8' || caseStatus === '9') {
      result = '预审通过'
    } else if(caseStatus === '10' || caseStatus === '11') {
      result = '预审通过'
    } else if(caseStatus === '12') {
      result = '审批通过'
    } else if(caseStatus === '13') {
      result = '审批不通过'
    } else if(caseStatus === '14' || caseStatus === '15' || caseStatus === '16' || caseStatus === '17') {
      result = '案件承办中'
    } else if(caseStatus === '18' || caseStatus === '19' ||　caseStatus === '20' ||　caseStatus === '0') {
      result = '案件办结'
    }
    return result
  }
  //渲染组件并返回供其他组件调用
  return (
    <div className="content-inner">
        <div className="btn-container">
          <div>
            {
              lawcaseList.length ?
              (
                <List renderHeader={() => '我的法律援助案件'}>
                {
                  lawcaseList.map((item, index)=> {
                    return <div key={item.seq} className={styles.caseItemBox}>
                    <Item 
                      thumb={genThumbElem(item)}
                      onClick={()=>viewDetails(item)}
                      className={styles.caseItemBoxItem}
                    >
                      {getCaseBreafInfo(item)}
                      <div className={styles.caseStatusTxt}>{getStatusName(item)}</div>
                    </Item>
                    </div>
                  })
                }
                </List>
              )
              :
              <div className={styles.tip}>{isLoaded ? '没有数据' : '加载中...'}</div>
            }
          </div>
        </div>
    </div>
  )
}
Lawcases.propTypes = {
  lawcases: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ lawcases, loading }) => ({ lawcases, loading }))(Lawcases) //用户表格容器