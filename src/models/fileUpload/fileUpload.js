import { getDataService, postDataService, postFormService } from '../../services/commonService'
import { getFileUrl } from '../../utils/getFileUrl'
import { config, jsUtil } from '../../utils'
import { routerRedux } from 'dva/router'
import { Toast } from 'antd-mobile'
const { api } = config

export default {
  namespace: 'fileUpload',
  state: {
    url: '',
    tCaseId: '',
    targetEvent: {},
    materialType: '',
    fileType: '',
    fileModal: {
      fileData: {},
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/fileUpload/') > -1) {
          const materialType = location.pathname.split('/').pop()
          const tCaseId = location.query.tCaseId
          dispatch({ type: 'reset' })
          dispatch({ type: 'setMaterialType', materialType, tCaseId })
          dispatch({ type: 'beforeUpload' })
        }
      })
    },
  },
  effects: {
    *handleSubmit ({ payload }, { select, put, call }) {
      const { fileModal, targetEvent, materialType, fileType, tCaseId, fileTypeCode } = yield select(({ fileUpload }) => fileUpload)
      const file = targetEvent.target.files[0]
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
        const response = yield call(getDataService, { url: api.getOssUrl }, { key })
        if (response.success) {
          yield put({
            type: 'app/setFileList',
            payload: {
              url: response.data.url,
              addr: response.data.url.split('?')[0],
              materialStatus: '1',
              fileType,
              materialType,
              objectKey: key,
              name: payload.name,
              tCaseId,
              dicFileType: fileType,
              dicType: materialType,
              addrUrl: response.data.url,
              dicMateriaStatus: tCaseId ? 2 : 1,
              fileTypeCode,
            },
          })
          yield put(routerRedux.go(-1))
        } else {
          throw response
        }
      } else {
        throw res
      }
    },
    *beforeUpload ({ payload }, { put, call }) {
      const policyInfoString = localStorage.getItem('policyInfo')
      if (policyInfoString) {
        const policyInfo = JSON.parse(policyInfoString)
        const policyTime = policyInfo.time
        const now = new Date().getTime()
        if (now - policyTime < 30 * 60 * 1000) {
          yield put({ type: 'setFileData', policyInfo })
          return
        }
      }
      const response = yield call(getDataService, { url: api.getPolicy }, { serviceId: 'srvid_ossGetPolicy' })
      if (response.success) {
        yield put({ type: 'setFileData', fileData: response.data })
      } else if (response.code === '9999') {
        // do nothing, it will not update the state and will not re-render the page.
      } else {
        throw response
      }
    },
    *getUrl ({ payload }, { put, call }) {
      const event = payload
      yield put({
        type: 'setTargetEvent',
        payload: event,
      })
      const fileNameList = event.target.files[0].name.split('.')
      const fileType = fileNameList[fileNameList.length - 1]
      let fileTypeCode = jsUtil.getFileExt(event.target.files[0].name)
      if (!fileTypeCode) {
        Toast.info('所传文件不符合类型')
        return
      }
      Toast.loading('加载中...', 0)
      const url = yield call(getFileUrl, event)
      Toast.hide()
      yield put({
        type: 'setTargetUrl',
        payload: { url, fileType, fileTypeCode },
      })
    },
  },
  reducers: {
    reset (state) {
      return {
        url: '',
        tCaseId: '',
        fileType: '',
        fileTypeCode: '',
        targetEvent: {},
        materialType: '',
        fileModal: {
          fileData: {},
        },
      }
    },
    setMaterialType (state, action) { // 材料用途1、5、6
      return { ...state, materialType: action.materialType, tCaseId: action.tCaseId }
    },
    setTargetUrl (state, action) {
      return { ...state, url: action.payload.url, fileType: action.payload.fileType, fileTypeCode: action.payload.fileTypeCode }
    },
    setTargetEvent (state, action) {
      return { ...state, targetEvent: action.payload }
    },
    setFileData (state, action) {
      let fileData = {}
      if (action.policyInfo) {
        const dts = new Date().format('yyyyMMdd')
        const lgs = new Date().getTime()
        fileData = action.policyInfo
        fileData.key = 'rp/' + dts + '/' + lgs + '_${filename}'
      } else {
        const dt = new Date().format('yyyyMMdd')
        const lg = new Date().getTime()
        fileData = {
          endPoint: action.fileData && action.fileData.endPoint || '',
          OSSAccessKeyId: action.fileData && action.fileData.accessid,
          policy: action.fileData && action.fileData.policy,
          Signature: action.fileData && action.fileData.signature,
          key: 'rp/' + dt + '/' + lg + '_${filename}',
          time: new Date().getTime(),
        }
      }
      localStorage.setItem('policyInfo', JSON.stringify(fileData))
      return {
        ...state,
        fileModal: {
          ...state.fileModal,
          fileData,
        },
      }
    },
  },
}
