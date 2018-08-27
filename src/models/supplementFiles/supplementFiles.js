import { getDataService, postDataService } from '../../services/commonService'
import { config } from '../../utils'
import { routerRedux } from 'dva/router'
import { Toast } from 'antd-mobile'
const { api } = config

export default {
  namespace: 'supplementFiles',
  state: {
    fileList: [],
    tCaseId: '',
    whetherRequset: true,
    deleteFileList: [],
    isFreeHardMaterials: 0,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/supplementFiles/') > -1) {
          const pathList = location.pathname.split('/')
          const tCaseId = pathList[pathList.length - 1]
          const isFreeHardMaterials = location.query.isFreeHardMaterials
          dispatch({ type: 'getFileListByService', payload: tCaseId })
          dispatch({ type: 'getFileList' })
          dispatch({ type: 'setIsFreeHardMaterials', payload: isFreeHardMaterials })
        }
      })
    },
  },
  effects: {
    *getFileListByService ({ payload }, { call, put, select }) {
      const { tCaseId, whetherRequset } = yield select(({ supplementFiles }) => supplementFiles)
      if (tCaseId !== payload && whetherRequset) {
        const res = yield call(getDataService, { url: api.getMaterialFile }, { tCaseId: payload })
        if (res.success) {
          yield put({
            type: 'setFileList',
            fileList: res.data,
          })
          yield put({
            type: 'app/setFileListByService',
            fileList: res.data,
          })
        } else {
          throw res
        }
        yield put({
          type: 'setTCaseId',
          tCaseId: payload,
        })
      }
    },
    *getFileList ({ payload }, { put, select }) {
      const fileList = yield select(({ app }) => app.fileList)
      yield put({
        type: 'setFileList',
        fileList,
      })
    },
    *handleSubmit ({ payload }, { put, call, select }) {
      const { fileList, deleteFileList } = yield select(({ supplementFiles }) => supplementFiles)
      const currentFileList = fileList.filter(item => {
        return !item.tCaseMaterialStorageId
      })
      if (currentFileList.length === 0 && deleteFileList.length === 0) {
        Toast.info('请补充材料！', 1)
        return
      }
      const res = yield call(postDataService, { url: api.addMaterialFile }, [...currentFileList, ...deleteFileList])
      if (res.success) {
        Toast.info('提交成功！')
        yield put(routerRedux.push('/lawcases'))
        yield put({ type: 'reset' })
        yield put({ type: 'app/resetFileList' })
      } else {
        throw res
      }
    },
    *deleteFile ({ payload }, { put, select }) {
      const { fileList } = yield select(({ supplementFiles }) => supplementFiles)
      const currentFileList = fileList.filter(item => {
        return item.addrUrl !== payload.addrUrl
      })
      if (payload.tCaseMaterialStorageId) {
        yield put({
          type: 'setDeleteFileList',
          deleteFile: payload,
        })
      }
      yield put({
        type: 'app/deleteFile',
        currentFileList,
      })
      yield put({
        type: 'deleteFileInSupplementFiles',
        currentFileList,
      })
    },
  },
  reducers: {
    reset (state) {
      return {
        ...state,
        fileList: [],
        tCaseId: '',
        whetherRequset: true,
        deleteFileList: [],
      }
    },
    setIsFreeHardMaterials (state, action) {
      return { ...state, isFreeHardMaterials: action.payload }
    },
    setDeleteFileList (state, action) {
      const deleteFile = action.deleteFile
      let currentdeleteFileList = state.deleteFileList
      currentdeleteFileList.push(deleteFile)
      return { ...state, deleteFileList: currentdeleteFileList }
    },
    setTCaseId (state, action) {
      return { ...state, tCaseId: action.tCaseId, whetherRequset: false }
    },
    deleteFileInSupplementFiles (state, action) {
      return { ...state, fileList: action.currentFileList }
    },
    setFileList (state, action) {
      const fileList = action.fileList
      return { ...state, fileList }
    },
  },
}
