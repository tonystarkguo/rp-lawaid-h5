import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, Icon, Flex, InputItem, ListView, Button, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
import { routerRedux } from 'dva/router'
import styles from './index.less'
import { config, jsUtil } from '../../utils/'

const Item = List.Item;

const OrgList = ({
  orgList,
  dispatch,
  form: {
    getFieldProps,
    getFieldValue,
    validateFields,
  }
}) => {
  document.querySelector('body').style.overflow = 'scroll'
  const { dataSource, isLoading } = orgList

  let allCity = jsUtil.getCities('330000')

  allCity = allCity.map(item => {
    let newItem = item;
    newItem.label = newItem.name
    newItem.value = newItem.code
    return newItem
  })

  const onSearch = () => {
    let params = {
      name: getFieldValue('name'),
      tSmsCity: getFieldValue('tSmsCity') && getFieldValue('tSmsCity').toString() || null
    }

    dispatch({ 
      type: 'orgList/getOrgList',
      payload: params 
    })
  }

  const PickerChange = (value) => {
    dispatch({ 
      type: 'orgList/getOrgList',
      payload: {
        tSmsCity: value.toString()
      }
    })
  }

  const toDetail = (data) => {
    localStorage.setItem('orgMsg', JSON.stringify(data))
    dispatch(routerRedux.push('/orgDetail'))
  }

  const toAddress = (data) => {
    localStorage.setItem('orgMsg', JSON.stringify(data))
    dispatch(routerRedux.push('/address'))
  }

  return (
    <div>
      <List className={styles.list}>
        <Flex>
          <Flex.Item>
            <Picker data={allCity} cols={1} {...getFieldProps('tSmsCity')} className="forss" onOk={PickerChange}>
              <List.Item></List.Item>
            </Picker>
          </Flex.Item>
          <Flex.Item style={{flex:2}}>
            <InputItem {...getFieldProps('name')} placeholder="请输入法援中心名称"></InputItem>
          </Flex.Item>
          <Flex.Item>
            <Button className="btn" type="primary" size="small" inline onClick={onSearch}>搜索</Button>
          </Flex.Item>
        </Flex>
      </List>

      {
        dataSource.map(val => {
          let data = {
            picAddress: val.picAddress,
            name: val.name,
            address: val.address,
            telephone: val.telephone,
            longitude: val.longitude,
            latitude: val.latitude,
            id: val.id,
          }
          return (
            <List className={styles.list} key={val.key}>
              <Item
                wrap
                arrow="horizontal"
                onClick={e => toDetail(data)}
              >
                {val.name}
              </Item>
              <Item arrow="horizontal" thumb={config.mapSvg} onClick={e => toAddress(data)}>{val.address}</Item>
              <Item thumb={config.phoneSvg}>{val.telephone}</Item>
            </List>
          )
          
        })
      }
      
    </div>
  )

}

OrgList.propTypes = {
  orgList: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ orgList }) => ({ orgList }))(createForm()(OrgList))


/*<ListView ref="lv"
  dataSource={dataSource}
  renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
    {isLoading ? 'Loading...' : 'Loaded'}
  </div>)}
  renderRow={row}
  renderSeparator={separator}
  className="am-list"
  pageSize={4}
  useBodyScroll
  onScroll={() => { console.log('scroll'); }}
  scrollRenderAheadDistance={500}
  scrollEventThrottle={200}
  onEndReached={onEndReached}
  onEndReachedThreshold={10}
/>*/

/*let index = dataSource.length - 1;
const NUM_ROWS = 20;
let pageIndex = 0;

const separator = (sectionID, rowID) => (
  <div key={`${sectionID}-${rowID}`}
    style={{
      backgroundColor: '#F5F5F9',
      height: 8,
      borderTop: '1px solid #ECECED',
      borderBottom: '1px solid #ECECED',
    }}
  />
);

const row = (rowData, sectionID, rowID) => {
  if (index < 0) {
    index = dataSource.length - 1;
  }
  const obj = dataSource[index--];
  return (
    <div key={rowID} className="row">
      <div className="row-title">{obj.title}</div>
      <div style={{ display: '-webkit-box', display: 'flex', padding: '0.3rem 0' }}>
        <img style={{ height: '1.28rem', marginRight: '0.3rem' }} src={obj.img} alt="icon" />
        <div className="row-text">
          <div style={{ marginBottom: '0.16rem', fontWeight: 'bold' }}>{obj.des}</div>
          <div><span style={{ fontSize: '0.6rem', color: '#FF6E27' }}>{rowID}</span>¥</div>
        </div>
      </div>
    </div>
  );
};

const onEndReached = (event) => {
  if (isLoading && !hasMore) {
    return;
  }
  console.log('reach end', event);
  dispatch({ type: 'orgList/showLoading' })
  setTimeout(() => {
    dispatch({ type: 'orgList/loadMore', payload: ++pageIndex })
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      isLoading: false,
    });
  }, 1000);
}*/