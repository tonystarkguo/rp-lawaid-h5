import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, Flex, Card, WhiteSpace,Button,Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import { config, dateUtil } from '../../utils/'
import styles from './index.less'

const Item = List.Item;

const ConsultDetaily = ({
  consultDetaily,
  dispatch,
}) => {

const {dataSource,evaluateState,satisfaction,isAccept,id} = consultDetaily;
 let checkOneVal="";
 let checkTwoVal="";
  const submit=()=>{
    const val={satisfaction:checkOneVal,isAccept:checkTwoVal,id:id};
    if(checkOneVal===""){
      Toast.fail('请选择满意度', 1)
    }else{
      dispatch({type:"consultDetaily/submitSatisfaction",payload:val})
    }
    
  };
  const checkOne=(e)=>{
    let val=e.target.getAttribute("id");
    console.log()
    if(val=="one"){
      checkOneVal=0
    }else if(val=="two"){
     checkOneVal=1
    }else if(val=="three"){
      checkOneVal=2
    }
    console.log(checkOneVal)
  };
  const checkTwo=(e)=>{
    let val=e.target.getAttribute("id");
    console.log()
    if(val=="oneN"){
      checkTwoVal=0
    }else if(val=="twoN"){
      checkTwoVal=1
    }else if(val=="threeN"){
      checkTwoVal=2
    }
    console.log(checkTwoVal)
  };
  return (
    <div>
      <List className={styles.list}>
        <Item>编号：{dataSource.consultNumber}</Item>
        {
          dataSource.caseReasons && dataSource.caseReasons.length ?
          <Item>
            案由：
            {
              dataSource.caseReasons.map(v => {
                return (<span key={v.id}>{v.reasonName+'，'}</span>)
              })
            }
          </Item> : ''
        }
        <Item>咨询标题：{dataSource.consultTitle}</Item>
        <Item wrap>咨询内容：{dataSource.consultContent}</Item>
        {
          dataSource.files && dataSource.files.length ?
          <Flex wrap="wrap">
            {
              dataSource.files.map((val) => {
                return (<img src={val.addrUrl} key={val.id} className={styles.pic} />)
              })
            }
          </Flex> : ''
        }
        <Item>咨询时间：{dateUtil.convertToDate(dataSource.createTime, 'yyyy-MM-dd hh:mm:ss')}</Item>
        <Item>回访电话：{dataSource.mobile}</Item>
      </List>

      <List className={styles.list}>
        <Item><img src={dataSource.headPic} className={styles.head} /><span className={styles.layer}>值班法律援助人员</span></Item>
        <Item wrap>回复内容：{dataSource.answerSuggestion}</Item>
        <Item wrap><p className={styles.tip}>以上回复，仅代表值班法律援助人员个人意见，仅供参考。</p></Item>
        <Item>回复时间：{dateUtil.convertToDate(dataSource.submitTime, 'yyyy-MM-dd hh:mm:ss')}</Item>
      </List>
      <List>
      {
        evaluateState==false?<div className={styles.SatisfactionDiv}>
          <p className={styles.Satisfaction}><i className={styles.xinghao}>*</i> 满意度评价</p> 
          <p className={styles.SatisfactionSelect}>
          <label htmlFor="one" onClick={checkOne}><input type="radio" id="one" name="ok" /> 满意</label>
          <label htmlFor="two" onClick={checkOne}><input type="radio" id="two" name="ok"  />基本满意</label>
          <label htmlFor="three"onClick={checkOne}><input type="radio" id="three" name="ok" />不满意</label></p>
          <p className={styles.Satisfaction}>是否采纳</p>
          <p className={styles.SatisfactionSelect}>
          <label htmlFor="oneN" onClick={checkTwo}><input type="radio" id="oneN" name="adopt"/> 采纳</label>
          <label htmlFor="twoN" onClick={checkTwo}><input type="radio" id="twoN" name="adopt" />部分采纳</label>
          <label htmlFor="threeN"  onClick={checkTwo}><input type="radio" id="threeN" name="adopt"/>不采纳</label></p>
          <Button className={styles.button} type="primary" onClick={submit}>提交</Button>
        </div>
        :<div className={styles.SatisfactionDiv}>
        <p className={styles.Satisfaction}><i className={styles.xinghao}>*</i>满意度评价</p> 
        <p className={styles.SatisfactionSelect} >
        <label htmlFor="one"   ><input type="radio" id="one" name="ok" checked={(satisfaction==="0")} disabled={false}/> 满意</label>
        <label htmlFor="two" ><input type="radio" id="two" name="ok"  checked={satisfaction=="1"} disabled={false}/>基本满意</label>
        <label htmlFor="three"><input type="radio" id="three" name="ok" checked={satisfaction=="2"} disabled={false}/>不满意</label></p>
        {(isAccept.length===0||isAccept==null)?"":
        <div>
        <p className={styles.Satisfaction}>是否采纳</p>
        <p className={styles.SatisfactionSelect}>
        <label htmlFor="oneN" ><input type="radio" id="oneN" name="adopt" checked={isAccept==="0"} disabled={false}/> 采纳</label>
        <label htmlFor="twoN" ><input type="radio" id="twoN" name="adopt" checked={isAccept=="1"} disabled={false}/>部分采纳</label>
        <label htmlFor="threeN" ><input type="radio" id="threeN" name="adopt" checked={isAccept=="2"} disabled={false}/>不采纳</label></p>
        </div>
      }
        
      </div>
      }
      </List>
      {
        dataSource.tocaList && dataSource.tocaList.length ?
        <div>
          {
            dataSource.tocaList.map((val) => {
              return (
                <List className={styles.list} key={val.id}>
                  <Item><img src={val.headPic} className={styles.head} /><span className={styles.layer}>值班法律援助人员</span><span className={styles.zhuijia}>追加回复</span></Item>
                  <Item wrap>回复内容：{val.content}</Item>
                  <Item wrap><p className={styles.tip}>以上回复，仅代表值班法律援助人员个人意见，仅供参考。</p></Item>
                  <Item>回复时间：{dateUtil.convertToDate(val.createTime, 'yyyy-MM-dd hh:mm:ss')}</Item>
                </List>
              )
            })
          }
        </div> : ''
      }
    </div>
  )
}

ConsultDetaily.propTypes = {
  consultDetaily: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ consultDetaily }) => ({ consultDetaily }))(createForm()(ConsultDetaily))

