import { request } from '../utils'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import { jsUtil } from '../utils'

export async function getDataService (config, params) {
  Toast.loading('加载中...', 0)
	const res = await request({
    url: config.url,
    method: 'get',
    data: {...params, random: new Date().getTime()}
	})
  const code = res.code
  if (code !== '1') {
    res.success = false
    Toast.fail(res.message)
  }

	if (code === '40000') {
		// 处理token过期，清除storage中的user对象，token
		localStorage.removeItem('user')
		localStorage.removeItem('token')
    if(localStorage.getItem('openid')){
      window.location = '/login?openid='+localStorage.getItem('openid')
    }else{
      window.location = '/login'
    }
    
    Toast.hide()
	} else if(code === '-1') {
		return res;
	} else {
    Toast.hide()
		return res;
	}
}

export async function postDataService (config, params) {
  Toast.loading('加载中...', 0)
	const res = await request({
	    url: config.url,
	    method: 'post',
	    data: params
	})
  const code = res.code
  if (code !== '1') {
    res.success = false
    Toast.fail(res.message)
  }

	if (code === '40000') {
		//处理token过期，清除storage中的user对象，token
		localStorage.removeItem('user')
		localStorage.removeItem('token')
    window.location = '/login'
    Toast.hide()
	}else if(code === '-1'){ // 后台返回错误代码
		return res;
	}else if(code === 500 || code === '40140'){
    res.success = false
    Toast.hide()
		return res;
	}else{
    Toast.hide()
		return res;
	}
}

export async function postFormService (config, params) {
  Toast.loading('数据加载中...', 0)
  const res = await axios({
    url: config.url,
    method: 'post',
    data: params,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'multipart/form-data',
    },
  })
  const status = res.status
  if (status === 204) {
    res.success = true
    Toast.hide()
    return res
  } else {
    res.success = false
    res.message = '服务器异常！'
    Toast.hide()
    return res
  }
}