import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, InputItem, WhiteSpace, Button, TextareaItem, Checkbox, Flex, Toast, ImagePicker  } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.less'
import { config, jsUtil } from '../../utils/'

const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

const OnlineConsult = ({
  onlineConsult,
  dispatch,
  form: {
    getFieldProps,
    getFieldValue,
    validateFields
  }
}) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const orgId = jsUtil.GetQueryString('orgId')
  const { types } = onlineConsult
  const fileList = onlineConsult.fileModal.fileList

  const personType  = jsUtil.getDictDataByKey('dic_dic_occupatio')

  const handleSubmit = () => {
    if (getFieldValue('consultTitle') === undefined || getFieldValue('consultTitle') === ''){
      Toast.info('请输入咨询标题')
      return
    } else if (getFieldValue('consultTitle').length > 20){
      Toast.info('咨询标题不能超过20个字');
      return
    } else if (getFieldValue('consultContent') === undefined || getFieldValue('consultContent') === ''){
      Toast.info('请输入咨询内容');
      return
    } else if (getFieldValue('consultContent').length > 500) {
      Toast.info('咨询内容不能超过500个字');
      return
    } else if (getFieldValue('mobile') === undefined || getFieldValue('mobile') === '') {
      Toast.info('请输入回访电话');
      return
    } else {
      validateFields((err, values) => {
        const data = {
          ...values,
          isOpen: !getFieldValue('isOpen'),
          files: fileList,
          consultantCategoryKeys: types,
          isSubmit: false,
          orgId: orgId,
          name: user.name,
          cardCode: user.cardCode,
          dicCardType: jsUtil.isNull(user.dicCardType) === true ? 'SF' : user.dicCardType,
        }
        dispatch({
          type: 'onlineConsult/submit',
          payload: data
        })
      })
    }
  }

  const onChange = (val) => {
    console.log(val);
  }

  const checkboxChange = (e, val) => {
    if(e.target.checked === true){
      types.push(val)
    }else{
      let idx = types.indexOf(val);
      if(idx != -1) types.splice(idx, 1)
    }
    console.log(types)
    dispatch({
      type: 'onlineConsult/changeTypes',
      payload: types
    })
  }

  const fileChange = (files, type, index) => {
    if(type === 'remove'){
      fileList.splice(index,1)
      dispatch({
        type: 'onlineConsult/removeFileList',
        payload: fileList
      })
    }else{
      dispatch({
        type: 'onlineConsult/updateFileList',
        payload: files
      })
    }
  }

  return (
    <List>
      <InputItem 
        clear 
        labelNumber={4}
        placeholder="请输入咨询标题（必填）"
        {...getFieldProps('consultTitle')}
      >咨询标题</InputItem>

      <TextareaItem
        {...getFieldProps('consultContent')}
        clear
        title="咨询内容"
        autoHeight
        labelNumber={4}
        rows={5}
        count={500}
        placeholder="请准确描述您的法律问题，便于法律顾问能有针对性的答复。（必填）"
      />

      <ImagePicker
        files={fileList}
        onChange={(files, type, index) => fileChange(files, type, index)}
        onImageClick={(index, fs) => console.log(index, fs)}
      />

      <AgreeItem {...getFieldProps('isOpen', { initialValue: true, valuePropName: 'checked' })}>
        不公开到互联网
      </AgreeItem>

      <InputItem 
        clear 
        type="number"
        labelNumber={4}
        editable={false}
        placeholder="请输入回访电话（必填）"
        {...getFieldProps('mobile', {
          initialValue: user.mobile,
        })} 
      >回访电话</InputItem>

      <Item>人群类别（多选）</Item>

      <Flex wrap="wrap">
        {personType.map(i => (
          <CheckboxItem className="inline" key={i.code} onChange={(e) => checkboxChange(e, i.code)} >
            {i.name}
          </CheckboxItem>
        ))}
      </Flex>

      <Item><Button className="btn" type="primary" onClick={handleSubmit}>提交咨询</Button></Item>
    </List>
  )
}

OnlineConsult.propTypes = {
  form: PropTypes.object,
  onlineConsult: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ onlineConsult }) => ({ onlineConsult }))(createForm()(OnlineConsult))

