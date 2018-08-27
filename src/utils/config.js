let baseURL = process.env.NODE_ENV === 'development' ? '' : ''
module.exports = {
  name: '',
  prefix: 'antdAdmin',
  footerText: 'Copyright©2009 fabao.cn All Rights Reserved',
  logo: '/logo_fy.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  mapSvg: '/map.svg',
  phoneSvg: '/phone.svg',
  menuSvg: '/menu.svg',
  fileSvg: '/file.svg',
  docSvg: '/doc.svg',
  pdfSvg: '/pdf.svg',
  txtSvg: '/txt.svg',
  // baseURL: 'https://dev.fabaogd.com',
  baseURL, // 'http://localhost:8000',
  // baseURL: 'https://fy.fabaogd.com/opm-api',
  // baseURL: 'http://192.168.2.175:8000',
  YQL: ['https://fy.fabaogd.com/opm-api'],
  CORS: ['https://fy.fabaogd.com/opm-api'],
  openPages: ['/login'],
  // routerNeedNotToken: ['/', '/register', '/login', '/forget', '/orgList', '/orgDetail', '/address'], // 不需要token的路由
  // apiPrefix: '/api/v1',
  apiPrefix: '',
  api: {
    baseURL,
    getCaseList: '/rp/zhejiang/weixin/case/getCaseList', // 获取案件列表
    getCaseStepLog: '/rp/zhejiang/weixin/case/getCaseStepLog', // 获取案件进度日志
    getHpUserInMyCase: '/rp/zhejiang/weixin/case/getHpUserInMyCase', // 援助人信息
    getCaseInfo: '/rp/zhejiang/weixin/case/getCaseInfo', // 获取案件详情（申请信息）
    addMaterialFile: '/rp/zhejiang/weixin/case/addMaterialFile', // 新增/补充材料文件
    getMaterialDoc: '/rp/zhejiang/weixin/case/getMaterialDoc', // 相关文书
    getMaterialFile: '/rp/zhejiang/weixin/case/getMaterialFile', // 查询补充材料文件(包含所有类型材料文件)
    getCaseEvaluate: '/rp/zhejiang/weixin/case/getCaseEvaluate', // 满意度评价查询
    saveCaseEvaluate: '/rp/zhejiang/weixin/case/saveCaseEvaluate', // 提交评价
    appGetContentMock: '/appTest/contentMock', // app 页面
    getConsultById: '/rp/zhejiang/weixin/consult/getConsultById', // 获取咨询详情
    getMyHistoryConsults: '/rp/zhejiang/weixin/consult/getMyHistoryConsults', // 获取咨询列表
    addConsult: '/rp/zhejiang/weixin/consult/addConsult', // 提交咨询
    getUrl: '/rp/zhejiang/weixin/oss/getUrl', // 获取url
    getAllConfig: '/rp/zhejiang/weixin/config/getAllConfig', // 获取字典
    loginIn: '/rp/zhejiang/weixin/login', // 登录
    getPolicy: '/rp/zhejiang/weixin/oss/getPolicy', // 获取阿里云授权
    getOrgListUrl: '/rp/zhejiang/weixin/org/getLawOrg', // 获取机构列表
    getOssUrl: '/rp/zhejiang/weixin/oss/getUrl', // 获取Url
    getUserInfoInCase: '/rp/zhejiang/weixin/user/info', // 申请主体基本信息(受援人信息)查询接口

    registerCaptcha: '/rp/zhejiang/weixin/user/registerCaptcha', // 获取手机验证码
    loginPhoneUrl:'/rp/zhejiang/weixin/login/mobile',//手机验证码登录
    registerUrl: '/rp/zhejiang/weixin/user/register', // 注册
    createRpCase: '/rp/zhejiang/weixin/case/createRpCase', // 援助申请
    createRpBase: '/rp/zhejiang/weixin/user/update', // 受理登记-申请主体基本信息保存接口
    getAccessToken: '/rp/zhejiang/weixin/auth/accessToken', // 获取openid

    getdecryptConsultId:'/rp/zhejiang/weixin/consult/decryptConsultId',//咨询ID解密
    postCommitConsultEvaluate:'/rp/zhejiang/weixin/consult/commitConsultEvaluate',//提交评价
    getConsultByIdNoToken:'/rp/zhejiang/weixin/consult/getConsultByIdNoToken',//获取咨询详情不要token
  },
}
