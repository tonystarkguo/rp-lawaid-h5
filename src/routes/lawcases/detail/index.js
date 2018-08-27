import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import {jsUtil} from '../../../utils'

import { Button, Flex, WingBlank, WhiteSpace, Tag, Tabs, List, Radio, Switch,Popup } from 'antd-mobile'
const TabPane = Tabs.TabPane
const FlexItem = Flex.Item
const Item = List.Item
const RadioItem = Radio.RadioItem

const Detail = ({ location, dispatch, loading, lawcaseDetail, form }) => {

  const { caseId = '', caseStatus = '', caseInfo = {}, applyerInfo = {}, materialFileData = [], materialDocData = [], hpUserInfo = [], evaluateInfo={}} = lawcaseDetail
  const {
    isLie = false,
    underTakeServ,
    procCommunicatSer,
    lawyerHelpserv,
    resultServ,
    totalServ,
  } = lawcaseDetail.formData

  const {
    isIllegal = false,
    dicAttitude,
    dicInterflow,
    dicMaintain,
    dicResult,
    dicSummary,
  } = lawcaseDetail.evaluateInfo

  const viewLogDetail = () => {
    dispatch(routerRedux.push(`/lawcaselog/${caseId}`))
  }

  const handleSwitchChange = () => {
    dispatch({ type: 'lawcaseDetail/upldateLieSwitch', payload: isLie })
  }

  const onUndertakeRadioChange = (value) => {
    dispatch({ type: 'lawcaseDetail/upldateUnderTakeServ', payload: value })
  }
  const procCommunicatSerChange = (value) => {
    dispatch({ type: 'lawcaseDetail/upldateProcCommunicatSer', payload: value })
  }
  const lawyerHelpservChange = (value) => {
    dispatch({ type: 'lawcaseDetail/upldateLawyerHelpserv', payload: value })
  }
  const resultServChange = (value) => {
    dispatch({ type: 'lawcaseDetail/upldateResultServ', payload: value })
  }
  const totalServChange = (value) => {
    dispatch({ type: 'lawcaseDetail/upldateTotalServ', payload: value })
  }

  const identifyFiles = materialFileData.filter((item)=>item.dicType === '1')// 身份证明材料
  const homeFinFiles = materialFileData.filter((item)=>item.dicType === '5')// 家庭困难材料
  const caseRelatedFiles = materialFileData.filter((item)=>item.dicType === '6')// 援助事项相关材料
  
  // const identifyFiles = materialFileData['1'] || []// 身份证明材料
  // const homeFinFiles = materialFileData['5'] || []// 家庭困难材料
  // const caseRelatedFiles = materialFileData['6'] || []// 援助事项相关材料

  const handleSubmit = () => {
    // 提交满意度数据
    dispatch({ type: 'lawcaseDetail/saveCaseEvaluate' })
  }

  const mockCaseDetail = {
    "acreage": "string",
    "applyAddress": "string",
    "applyDate": "2017-08-14T09:37:34.620Z",
    "assetTotalValue": 0,
    "birthdate": "2017-08-14T09:37:34.620Z",
    "cardCode": "string",
    "caseDetail": "string",
    "caseId": 0,
    "caseNum": "杭援20170908001",
    "createTime": "2017-08-14T09:37:34.620Z",
    "creatorGlobalId": "string",
    "dicCardType": "string",
    "dicCaseStatus": '1',
    "dicCaseStatusParent": "string",
    "dicCaseType": "string",
    "dicEduLevel": "string",
    "dicGender": "string",
    "dicHealth": "string",
    "dicLegalInstWay": "string",
    "dicNation": "string",
    "dicNationality": "string",
    "dicOccupation": "string",
    "dicProxyType": "string",
    "familyIncome": 0,
    "familySize": 0,
    "fileStorageCtoList": [
      {
        "addr": "string",
        "caseId": 0,
        "fileType": "string",
        "flowId": 0,
        "isPass": 0,
        "materialStatus": "string",
        "materialType": "string",
        "name": "string",
        "objectKey": "string",
        "objectMd5": "string",
        "remark": "string"
      }
    ],
    "headPic": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    "hpWorkUnit": "杭州大成律师事务所",
    "id": 0,
    "isApply": true,
    "isAuthentication": true,
    "isCar": true,
    "isDeleted": true,
    "isHeadPicAdopt": true,
    "isOtherAssets": true,
    "isProperty": true,
    "isVilla": true,
    "legalInstAddr": "string",
    "mobile": "13545474787",
    "modifierGlobalId": "string",
    "modifyTime": "2017-08-14T09:37:34.620Z",
    "name": "李四",
    "oId": 0,
    "orgId": "string",
    "orgName": "string",
    "perMonthlyIncome": 0,
    "perMonthlyOutcome": 0,
    "proxyCardId": "string",
    "proxyMobile": "string",
    "proxyName": "string",
    "reasonList": [
      "string"
    ],
    "regis": "string",
    "remark": "string",
    "rpUserId": 0,
    "tRpUserId": 0,
    "tSmsArea": 0,
    "tSmsCity": 0,
    "tSmsProvince": 0,
    "usualAddr": "string",
    "workUnit": "string",
    "zipCode": 0
  }

  const getStatusName = () => {
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

  const materialDocTabChange = (key) =>{
    if(key === '2'){
      dispatch({ type: 'lawcaseDetail/getMaterialDoc' })
    }else if(key === '3'){
      dispatch({ type: 'lawcaseDetail/getHpUserInfo' })
    }else if(key === '4'){
      dispatch({ type: 'lawcaseDetail/getCaseEvaluate' })
    }
  }
  const handleSupMeterial = () =>{
    dispatch(routerRedux.push(`/supplementFiles/${caseId}?isFreeHardMaterials=${caseInfo.isFreeHardMaterials}`))
  }
  
  // 援助人标签
  const goodFields = !jsUtil.isNull(hpUserInfo.goodFields) && hpUserInfo.goodFields.split(',') || []

  // const hpUserInfo = [
  //   {
  //     "tCaseId": 11071,
  //     "tGlobalId": "hp_890101330884952065",
  //     "tHpUserId": "2000004932",
  //     "hpHeadpic": "http://lsgl.zjsft.gov.cn/zjlawyermanager/lawyerphoto/4931.jpg",
  //     "name": "徐爱华",
  //     "mobile": "string1",
  //     "tWorkUnit": "xx",
  //     "tWorkeProvinceId": null,
  //     "tWorkeCityId": null,
  //     "tWorkeAreaId": null,
  //     "tWorkeProvinceName": null,
  //     "tWorkeCityName": null,
  //     "tWorkeAreaName": null,
  //     "areaCode": "舟山市",
  //     "tTagGoodField": ",民商业务",
  //     "dicHpIdentity": "专职法律援助律师"
  //   },
  //   {
  //     "tCaseId": 11071,
  //     "tGlobalId": "opm_898944485331828736",
  //     "tHpUserId": "2003745318",
  //     "hpHeadpic": "",
  //     "name": "信息",
  //     "mobile": "13566666666",
  //     "tWorkUnit": "想",
  //     "tWorkeProvinceId": null,
  //     "tWorkeCityId": null,
  //     "tWorkeAreaId": null,
  //     "tWorkeProvinceName": null,
  //     "tWorkeCityName": null,
  //     "tWorkeAreaName": null,
  //     "areaCode": null,
  //     "tTagGoodField": null,
  //     "dicHpIdentity": "社会律师"
  //   },
  //   {
  //     "tCaseId": 11071,
  //     "tGlobalId": "opm_906093027330621440",
  //     "tHpUserId": "2003745321",
  //     "hpHeadpic": "http://public-content-zhj.oss-cn-shenzhen.aliyuncs.com/orm/20170908/1504864384587_QQ图片20170731135826.jpg",
  //     "name": "张荣笙",
  //     "mobile": "13560305494",
  //     "tWorkUnit": "法宝",
  //     "tWorkeProvinceId": null,
  //     "tWorkeCityId": null,
  //     "tWorkeAreaId": null,
  //     "tWorkeProvinceName": null,
  //     "tWorkeCityName": null,
  //     "tWorkeAreaName": null,
  //     "areaCode": null,
  //     "tTagGoodField": null,
  //     "dicHpIdentity": "社会律师"
  //   }
  // ]
  
  class PopupContent extends React.Component {
    state = {

    };
    onSel = (sel) => {
      this.props.onClose()
    };
    render() {
      return (
        <Flex align="center">
          <Flex.Item className={styles.photoStyle}><img style={{width: '100%'}} src={this.props.addrUrl} /></Flex.Item>
        </Flex>
      );
    }
  }

  const onMaskClose = () => {
    console.log('onMaskClose');
  };
  const showBigPicture = (images, index) => {
    localStorage.setItem('previewImgs', JSON.stringify(images))
    localStorage.setItem('imgIndex', index)
    dispatch(routerRedux.push(`/imgViewer`))
    // e.preventDefault(); // 修复 Android 上点击穿透
    // Popup.show(<PopupContent onClose={() => Popup.hide()} addrUrl = {addrUrl} />, { onMaskClose });
  };

  return (
    <div className="content-inner content-container">
      <WhiteSpace size="lg" />
      <WingBlank>
        <Flex>
          <FlexItem>{caseStatus < 15? caseInfo.orgName: caseInfo.hpWorkUnit}</FlexItem>
          <FlexItem style={{ textAlign: 'right' }}>
            <Button type="primary" size="small" inline style={{ marginRight: '0.08rem' }} onClick={() => viewLogDetail()}>{getStatusName()}</Button>
          </FlexItem>
        </Flex>
        <WhiteSpace size="lg" />
      </WingBlank>
      <div className={styles.hhr}></div>
      <WingBlank>
        <Flex style={{ marginTop: 50 }}>
          <FlexItem style={{ width: 100, position: 'relative' }}>
            <img className={styles.avanter} src={applyerInfo.headPic} />
            <div className={styles.avantNameTxt}>{applyerInfo.name}</div>
            <div className={styles.avantTelTxt}>电话：{applyerInfo.mobile}</div>
            <div className={styles.tagsContainer}>
              {
                caseInfo.dicConsultantCategoryList && caseInfo.dicConsultantCategoryList.length ? caseInfo.dicConsultantCategoryList.map((item, index) => <Tag selected key={index}>{item.labelName}</Tag>) : ''
              }
            </div>
          </FlexItem>
        </Flex>
      </WingBlank>
      <WhiteSpace />
      <Tabs defaultActiveKey="1" swipeable={false} onChange={materialDocTabChange} className="tabCuscss">
        <TabPane tab="申请信息" key="1">
          <List className="my-list">
            <Item>{applyerInfo.name} | {applyerInfo.dicGenderName} | {applyerInfo.age} | {applyerInfo.dicNationName}  | {applyerInfo.dicEduLevelName}学历</Item>
            <Item>联系电话：{applyerInfo.mobile}</Item>
            <Item>身份证： {applyerInfo.cardCode}</Item>
            <Item>常住地： {applyerInfo.usualAddr}</Item>
            <Item>工作单位： {applyerInfo.workUnit}</Item>
          </List>
          {
            caseInfo.proxyName ? <div><div className={styles.hhr}></div>
            <List className="my-list">
              <Item>代理人姓名：{caseInfo.proxyName}</Item>
              <Item>代理人身份证： {caseInfo.proxyCardId}</Item>
              <Item>代理人联系电话： {caseInfo.proxyMobile}</Item>
            </List></div>: <div></div>
          }
          
          <div className={styles.hhr}></div>
          <List className="my-list">
            <Item><div style={{color: "blue"}}>【{caseInfo.orgName}】</div></Item>
          </List>
          <div className={styles.hhr}></div>
          <List className="my-list">
            <Item>案件类型：{caseInfo.dicCaseTypeName}</Item>
            <Item>案由:
            {
                caseInfo.reasonList && caseInfo.reasonList.length ? caseInfo.reasonList.map((item, index) => <Tag style={{marginLeft: 10}} selected key={index}>{item}</Tag>) : ''
              }
            </Item>
            <Item>援助方式：{caseInfo.dicAidWayName}</Item>
            <Item wrap>案件概述：<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{caseInfo.caseDetail}</div></Item>
          </List>
          <div className={styles.hhr}></div>
          <List className="my-list">
            <Item>申请材料：</Item>
          </List>
          <List renderHeader={() => '身份证明材料'} className="my-list">
            <Item>
              {
                identifyFiles.length ? identifyFiles.map((item, index)=><img className={styles.materialImg} key={index}  onClick={()=>showBigPicture(identifyFiles, index)} src={item.addrUrl} />):''
              }
              
            </Item>
          </List>
          <List className="my-list">
            {
              caseInfo.isFreeHardMaterials ? <div> <Item>经济困难证明：免交</Item> <List renderHeader={() => '经济困难证明：'} className="my-list">
                <Item>
                  {
                    homeFinFiles.length ? homeFinFiles.map((item, index)=><img className={styles.materialImg} key={index} onClick={()=>showBigPicture(homeFinFiles, index)} src={item.addrUrl} />):''
                  }
                </Item>
              </List></div>: 
              <List renderHeader={() => '经济困难证明：'} className="my-list">
                <Item>
                  {
                    homeFinFiles.length ? homeFinFiles.map((item, index)=><img className={styles.materialImg} key={index}  onClick={()=>showBigPicture(homeFinFiles, index)} src={item.addrUrl} />):''
                  }
                </Item>
              </List>
            }
          </List>
          <List renderHeader={() => '相关证据、证明材料：'} className="my-list">
            <Item>
              {
                caseRelatedFiles.length ? caseRelatedFiles.map((item, index)=><img className={styles.materialImg} key={index}  onClick={()=>showBigPicture(caseRelatedFiles, index)} src={item.addrUrl} />):''
              }  
            </Item>
          </List>
          {
            caseStatus === '2' ? <List>
              <Item><Button className="btn" type="primary" onClick={() => handleSupMeterial()}>补充材料</Button></Item>
            </List> : <div></div>
          }
          
        </TabPane>
        <TabPane tab="相关文书" key="2">
          {
            materialDocData.length ? materialDocData.map((item, index)=><List key={index} renderHeader={() => {return item.name.split('.')[0]}} className="my-list">
            <Item><img className={styles.materialImg} src={item.addrUrl}  onClick={()=>showBigPicture(materialDocData, index)} /></Item>
          </List>):<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
              暂无文书
          </div>
          }
        </TabPane>
        <TabPane tab="承办人信息" key="3">
          {!jsUtil.isNull(hpUserInfo)?hpUserInfo.map((item, index)=> <div key={index} style={{ minHeight: '120px', backgroundColor: '#fff' }}>
            <Flex style={{ marginTop: 20, padding: 10 }}>
              <FlexItem style={{ position: 'relative', marginBottom: 40 }}>
                <img className={styles.avanter} src={item.hpHeadpic} />
                <div className={styles.avantOrgNameTxt}>{item.name}</div>
                <div className={styles.avantOrgTelTxt}>电话：{item.mobile}</div>
                <div className={styles.avantLaworgTxt}>{item.tWorkUnit}</div>
                <div className={styles.lawyertagsContainer}>
                  {
                    item.tTagGoodField && item.tTagGoodField.split(',') ? item.tTagGoodField.split(',').map((item, index) => <Tag selected key={index}>{item}</Tag>) : ''
                  }
                </div>
              </FlexItem>
            </Flex>
          </div>):<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
              未指定承办人
          </div>}
        </TabPane>
        <TabPane tab="满意度评价" key="4">
          <div style={{ display: 'flex', minHeight: '5rem', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            {caseStatus > 13? 
            <form style={{ width: '100%' }}>
              <List renderHeader="承办人服务态度:">
                <Radio className="cust-radio" disabled={dicAttitude === '1'} checked={underTakeServ === '1'} onChange={() => onUndertakeRadioChange('1')}>满意</Radio>
                <Radio className="cust-radio" disabled={dicAttitude === '1'} checked={underTakeServ === '2'} onChange={() => onUndertakeRadioChange('2')}>基本满意</Radio>
                <Radio className="cust-radio" disabled={dicAttitude === '1'} checked={underTakeServ === '3'} onChange={() => onUndertakeRadioChange('3')}>不满意</Radio>
              </List>
              <List renderHeader="办案过程中沟通交流情况：">
                <Radio className="cust-radio" disabled={dicInterflow === '1'} checked={procCommunicatSer === '1'} onChange={() => procCommunicatSerChange('1')}>满意</Radio>
                <Radio className="cust-radio" disabled={dicInterflow === '1'} checked={procCommunicatSer === '2'} onChange={() => procCommunicatSerChange('2')}>基本满意</Radio>
                <Radio className="cust-radio" disabled={dicInterflow === '1'} checked={procCommunicatSer === '3'} onChange={() => procCommunicatSerChange('3')}>不满意</Radio>
              </List>
              <List renderHeader="承办人维护合法权益情况:">
                <Radio className="cust-radio" disabled={dicMaintain === '1'} checked={lawyerHelpserv === '1'} onChange={() => lawyerHelpservChange('1')}>满意</Radio>
                <Radio className="cust-radio" disabled={dicMaintain === '1'} checked={lawyerHelpserv === '2'} onChange={() => lawyerHelpservChange('2')}>基本满意</Radio>
                <Radio className="cust-radio" disabled={dicMaintain === '1'} checked={lawyerHelpserv === '3'} onChange={() => lawyerHelpservChange('3')}>不满意</Radio>
              </List>
              <List renderHeader="对案件结果是否满意:">
                <Radio className="cust-radio" disabled={dicResult === '1'} checked={resultServ === '1'} onChange={() => resultServChange('1')}>满意</Radio>
                <Radio className="cust-radio" disabled={dicResult === '1'} checked={resultServ === '2'} onChange={() => resultServChange('2')}>基本满意</Radio>
                <Radio className="cust-radio" disabled={dicResult === '1'} checked={resultServ === '3'} onChange={() => resultServChange('3')}>不满意</Radio>
              </List>
              <List renderHeader="总体评价:">
                <Radio className="cust-radio" disabled={dicSummary === '1'} checked={totalServ === '1'} onChange={() => totalServChange('1')}>满意</Radio>
                <Radio className="cust-radio" disabled={dicSummary === '1'}  checked={totalServ === '2'} onChange={() => totalServChange('2')}>基本满意</Radio>
                <Radio className="cust-radio" disabled={dicSummary === '1'}  checked={totalServ === '3'} onChange={() => totalServChange('3')}>不满意</Radio>
              </List>
              <List>
                <Item extra={<Switch checked={isLie} onChange={() => handleSwitchChange()} />}
                >是否有违规收受财物行为：</Item>
              </List>
              <List>
                <Item><Button className="btn" type="primary" onClick={() => handleSubmit()}>提交</Button></Item>
              </List>
            </form>:<div >
                暂不能评价
            </div>}
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

Detail.propTypes = {
  lawcaseDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ lawcaseDetail, form, location, dispatch, loading }) => ({ lawcaseDetail, form, location, dispatch, loading }))(Detail)
