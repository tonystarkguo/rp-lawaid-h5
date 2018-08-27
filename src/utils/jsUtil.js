import config from './config'
import _ from 'lodash'
import { Toast } from 'antd-mobile'

const isNull = (v) => { // 判断变量是否空值 undefined, null, '', [], {} 均返回true，否则返回false
  switch (typeof v) {
    case 'undefined':
      return true
    case 'string':
      if (v == null || v == '') {
        return true
      }
      break
    case 'object':
      if (v === null) { return true }
      if (undefined !== v.length && v.length == 0) { return true }

      for (let k in v) {
        return false
      }
      return true
      break
    default :
      break
  }
  return false
}

const GetQueryString = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return null
}

const getAllConf = () => {
  return localStorage.getItem('allConfig') && JSON.parse(localStorage.getItem('allConfig'))
}

const jsUtil = {

  /*
    将数组中的某个字段萃取出来，并且用指定的分隔符链接起来
    @params: arr Array, e.g [{name: 'richard'}, {name: 'andy'}]
    @params: key string, 萃取的字段
    @params: sp string, 分隔符
    @return: string. e.g 'richard,andy'
  */
  getJoinedValFromArr (arr, key, sp) {
    if (isNull(arr)) {
      return arr
    }
    return _.map(arr, key).join(sp)
  },
  isNull,
  GetQueryString,
  /*
    将数组中的某个字段萃取出来，并且用指定的分隔符链接起来
    @params: arr Array, e.g [{name: 'richard'}, {name: 'andy'}]
    @params: val string, 萃取的字段
    @params: sp string, 分隔符
    @return: string. e.g 'richard,andy'
  */
  getObjByValFromArr (arr, key, val) {
    if (isNull(arr)) {
      return arr
    }

    return _.find(arr, (o) => {
      return o[key] === val
    })
  },

  getAllConf,

  getDictData () {
    const allConf = getAllConf()
    return allConf && allConf.dictData || {}
  },

  getAreaData () {
    const allConf = getAllConf()
    return allConf && allConf.areaData || {}
  },

  getDictDataByKey (code) {
    const allDicData = this.getDictData()
    return allDicData && allDicData[code] || []
  },

  /*
    根据code获取字典库 中的值
    @params: dicLib Array, e.g [{name: 'richard'}, {name: 'andy'}]
    @params: code string, 字典编码
    @return: string. e.g 'richard,andy'
  */
  getCities (code) {
    const areaData = this.getAreaData()
    if (isNull(areaData)) {
      return []
    }

    let areaCode = `area_CITY_${code}`

    return areaData[areaCode]
  },

  /*
    根据code获取字典库 中的值
    @params: dicLib Array, e.g [{name: 'richard'}, {name: 'andy'}]
    @params: code string, 字典编码
    @return: string. e.g 'richard,andy'
  */
  getDistricts (code) {
    const areaData = this.getAreaData()
    if (isNull(areaData)) {
      return code
    }
    let districtCode = `area_DISTRICT_${code}`
    return areaData[districtCode]
  },

  /*
    根据全国省份列表
    @return: arrary.
  */
  getProvinceList () {
    const areaData = this.getAreaData()
    if (isNull(areaData)) {
      return []
    }
    let proviceList = areaData.area_PROVINCE_100000 || []
    return proviceList
  },

  /*
    获取省市区级联数据
    @return: [{
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [{
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [{
                    value: 'xihu',
                    label: 'West Lake',
                  }],
                }],
              }, {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [{
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [{
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                  }],
                }],
              }]
  */
  getProCascaderList () {
    const provinceList = this.getProvinceList()
    let cList = []
    if (isNull(provinceList)) {
      return []
    }
    let _this = this
    cList = _.map(provinceList, (item) => {
      let code = item.code || ''
      let cObj = { value: code, label: item.name }
      let cities = _this.getCities(code)
      let buildCities = []
      if (!isNull(cities)) {
        for (let i = 0; i < cities.length; i++) {
          let cityO = { value: cities[i].code, label: cities[i].name }
          let districts = _this.getDistricts(cities[i].code)
          let buildDistricts = _.map(districts, (itm) => {
            itm.value = itm.code
            itm.label = itm.name
            delete item.code
            delete item.name
            return itm
          })
          cityO.children = buildDistricts
          buildCities.push(cityO)
        }
        cObj.children = buildCities
      }
      return cObj
    })
    return cList
  },
  validateMsg (errors) {
    for (let key in errors) {
      Toast.info(errors[key].errors[0].message, 2)
      return
    }
  },

  getFileExt (fileName) {
    if (isNull(fileName)) return fileName
    let extList = fileName.split('.')
    let ext = extList[extList.length - 1].toLowerCase()
    let result = 0
    if (ext === 'doc' || ext === 'docx') {
      result = 1
    } else if (ext === 'pdf') {
      result = 2
    } else if (ext === 'txt') {
      result = 3
    } else if (ext === 'jpg' || ext === 'jpeg') {
      result = 4
    } else if (ext === 'png') {
      result = 5
    }
    return result
  },
}

module.exports = jsUtil
