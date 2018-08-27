import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.less'
import { routerRedux } from 'dva/router'
import { dateUtil } from '../../utils/'

const ConsultList = ({
  consultList,
  dispatch,
}) => {

  const { dataSource } = consultList

  const handleClick = (data) => {
    if(data.isSubmit === true){
      dispatch(routerRedux.push(`/consultDetaily/${data.id}`))
    }else{
      dispatch(routerRedux.push(`/consultDetailn/${data.id}`))
    }
  }

  // <i className={styles.icon}></i>

  return (
    <div>
      {
        dataSource && dataSource.length ?
        <div>
          {
            dataSource.map((val) => {
              let data = {
                id: val.id,
                isSubmit: val.isSubmit
              }
              return (
                <List className={styles.list} key={val.key} onClick={e => handleClick(data)}>
                  <div className={styles.block}>
                    <div className={styles.title}>{val.consultTitle}</div>
                  </div>
                  <div className={styles.block}>
                    <div className={styles.left}>
                      {dateUtil.convertToDate(val.createTime, 'yyyy-MM-dd hh:mm:ss')}
                      {
                        val.caseReasons && val.caseReasons.length ?
                        <span>
                          {
                            val.caseReasons.map(v => {
                              return (<span key={v.id}>{v.reasonName+'，'}</span>)
                            })
                          }
                        </span> : ''
                      }
                    </div>
                    <div className={styles.reply}>{val.replyNum}条回复</div>
                  </div>
                </List>
              )
            })
          }
        </div>
        :
        <div className={styles.tip}>暂无数据</div>
      }
    </div>
  )
}

ConsultList.propTypes = {
  consultList: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ consultList }) => ({ consultList }))(createForm()(ConsultList))

