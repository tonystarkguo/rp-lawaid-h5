import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { config, dateUtil } from '../../utils/'
import styles from './index.less'

const Item = List.Item;

const ConsultDetailn = ({
  consultDetailn,
  dispatch,
}) => {

  const { dataSource } = consultDetailn

  /*dataSource.caseReasons = [{
    reasonName: "经济诈骗罪",
    id: 0
  }, {
    reasonName: "杀人放火罪",
    id: 1
  }]*/

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
        
        <Item>咨询问题：{dataSource.consultTitle}</Item>
        <Item wrap>咨询内容：{dataSource.consultContent}</Item>
        <Item>
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
        </Item>
        <Item>咨询时间：{dateUtil.convertToDate(dataSource.createTime, 'yyyy-MM-dd hh:mm:ss')}</Item>
        <Item>回访电话：{dataSource.mobile}</Item>
      </List>
    </div>
  )
}

ConsultDetailn.propTypes = {
  consultDetailn: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ consultDetailn }) => ({ consultDetailn }))(createForm()(ConsultDetailn))

