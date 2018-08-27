import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../utils'
import { getDataService, postDataService, postFormService } from '../services/commonService'

const { api } = config

export default {
  namespace: 'onlineConsult',
  state: {
    types: [],
    fileModal:{
      fileData: {},
      fileList: [],
    },
  },
  effects: {
    * beforeUpload ({payload}, {select, call, put}) {
      let res = yield call(getDataService, {url: api.getPolicy}, {serviceId: 'srvid_getPolicy' })
      console.log(res)
      if(res.success) {
        yield put({ type:'setFileData', payload: res.data})
      }else {
        throw res
      }
    },

    * updateFileList ({payload}, {select, call, put}){
      const fileModal = yield select(({ onlineConsult }) => onlineConsult.fileModal)
      const file = payload[payload.length-1].file
      let fileData = fileModal.fileData
      let newFileUrl = fileData.key.split("_")[0] + '_' + file.name
      let formData = new FormData()
      formData.append('endPoint', fileModal.fileData.endPoint)
      formData.append('OSSAccessKeyId', fileModal.fileData.OSSAccessKeyId)
      formData.append('policy', fileModal.fileData.policy)
      formData.append('Signature', fileModal.fileData.Signature)
      formData.append('key', fileModal.fileData.key)
      formData.append('file', file)
      const res = yield call(postFormService, { url: '/upload' }, formData)
      if (res.success) {
        const key = fileModal.fileData.key.replace('${filename}', file.name)
        const data = yield call(getDataService, { url: api.getUrl }, { key, serviceId: 'srvid_getUrl'})
        if(data.success){
          yield put({
            type: 'getUrlSuc',
            payload: {
              fileObj: {
                uid: payload.uid,
                objectKey: newFileUrl,
                name: file.name,
                url: data.data.url,
              },
            }
          })
        }else {
          throw data
        }
      } else {
        throw res
      }
    },

    * submit ({payload}, {select, call, put}) {
      let res = yield call(postDataService, {url: api.addConsult}, { ...payload, serviceId: 'srvid_addConsult' })
      console.log(res)
      if(res.success) {
        yield put(routerRedux.push('/consultList'))
      }else {
        throw res
      }
    },
  },
  reducers: {
    changeTypes(state, action){
      return { ...state, types: action.payload }
    },
    removeFileList(state, action){
      return { ...state, fileModal: {...state.fileModal, fileList: action.payload} }
    },
    setFileData(state, action) {
      const dt = new Date().format('yyyyMMdd')
      const lg = new Date().getTime()
      const fileData = {
        endPoint: action.payload.endPoint,
        OSSAccessKeyId: action.payload.accessid,
        policy: action.payload.policy,
        Signature: action.payload.signature,
        key: 'rp/' + dt + '/' + lg + '_'+ '${filename}',
      }
      return {...state, fileModal: {fileList:[], fileData: fileData}}
    },
    getUrlSuc(state, action) {
      let existFileList = state.fileModal.fileList
      const uploadType = state.uploadType
      let fileObj = action.payload.fileObj
      let fileBuildObj = {}

      fileBuildObj = {
        addr: fileObj.url,
        url: fileObj.url,
        fileType: jsUtil.getFileExt(fileObj.name),// 文件类型（1.doc 2.pdf 3.txt 4.jpg 5.png ,
        name: fileObj.name,//(string, optional): 文件名称 ,
        objectKey: fileObj.objectKey,// (string, optional): 文件key(阿里云OSS),
        uid: existFileList.length + 1,//fileObj.uid
        fid: fileObj.uid,
      }
      existFileList.push(fileBuildObj)
      return {...state, fileModal: {...state.fileModal, fileList: existFileList}}
    },
    clearType(state){
      return { ...state, types:[]}
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/onlineConsult') {
          dispatch({ type: 'beforeUpload' })//获取阿里云授权
          dispatch({ type: 'clearType' })//清空选中的
        }
      })
    }
  },
}
