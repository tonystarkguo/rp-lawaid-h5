import React from 'react'
import { routerRedux } from 'dva/router'
import WxImageViewer from 'react-wx-images-viewer'
import { Button } from 'antd-mobile'
import _ from 'lodash'

const imgViewer = ({ location, dispatch, loading, lawcaseDetail, form }) => {

  const images = JSON.parse(localStorage.getItem('previewImgs'))
  const imgUrls = _.map(images, 'addrUrl')
  const index = localStorage.getItem('imgIndex')
  return (
    <div className="content-inner content-container">
      <WxImageViewer urls={imgUrls} onClose={()=>{window.history.back()}} index={Number(index)}/>
    </div>
  )
}
export default imgViewer
