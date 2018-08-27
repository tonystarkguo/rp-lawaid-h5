//model中定义state，action和reducer，具体可查看https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md
//
import {config, caseStatusConverter, jsUtil} from '../utils'
import { getDataService, postDataService } from '../services/commonService'
import { parse } from 'qs'
import {Toast} from 'antd-mobile'

const { api } = config

export default {
	namespace: 'lawcases',// model对应的命名空间，其他比如router容器组件中获取state的时需要带上命名空间
	state: {//model中的状态数据，是不变的，immutable data. 每次都是全新的数据, 这里的数据将会以connect的方式传送到容器组件
		allConfig: {},
		lawcaseList: [],//lawcases list, from database
		isLoaded: false,
	},
	reducers: {//同步操作，通过model当前的state和传入的action产生新的state
		initPage(state, action) {
	      	return {
		        ...state,
		        isLoaded: false,
	      	}
		},
		getAllConfig(state, action) {
			const allConfig = JSON.parse(localStorage.getItem('allConfig'))
	      	return {
		        ...state,
		        allConfig
	      	}
		},
		querySuccess (state, action){
			const { lawcaseList } = action.payload
			return {
				...state,
				lawcaseList,
				isLoaded: true,				
			}
		},
	},
	effects: {//异步操作，使用redux-sagas做异步流程控制，采用的generator 同步写法
		*getCaseList ({payload}, {call, put, select}){ // 获取案件列表
			payload = parse(location.search.substr(1))
			payload.serviceId = 'srvid_getLawcaseList'

			const data = yield call(getDataService, {url: api.getCaseList}, payload)
			if(data.success){
				let resData = data && data.data || []
				let startSeq = 1
				resData = resData.map((item, index) => {
					let newItem = item;
					newItem.seq = startSeq++
					return newItem
				})
				yield put(
					{
						type: 'querySuccess',
						payload: {
							lawcaseList: resData,
						}
					}
				)
			}else if(data.code === '9999'){
		        //do nothing, it will not update the state and will not re-render the page.
		    }
		},
	},
	subscriptions: {//订阅数据源，成功之后通过dispatch发送action，进行后续操作
		setup ({ dispatch, history }) {
		    dispatch({type: 'initPage'})
		    dispatch({type: 'getAllConfig'})
	        history.listen(location => {
		        if (location.pathname === '/lawcases') {
		          dispatch({
		            type: 'getCaseList',
		            payload: {...location.query},
		          })
		        }else{
		        	// dispatch({ type: 'getCaseList' })
		        }
	        })
	    }
	}
}