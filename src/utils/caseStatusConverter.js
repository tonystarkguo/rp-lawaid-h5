import config from './config'
import lodash from 'lodash'


const caseStatusConverter = {

  /*
    根据案件状态返回案件属于哪一个阶段
    阶段分为：申请，审批，指派，承办，评价，归档
    @params: caseStatus-string
    @return: currentNodeNum
  */
  getStageByStatus(caseStatus){
    if(!caseStatus){
      return caseStatus
    }

    let currentNodeNum = 1

    if(caseStatus === '1' || caseStatus === '2'){
      currentNodeNum = 0 //
    }else if(caseStatus === '3' || caseStatus === '4' || caseStatus === '5' || caseStatus === '6' || caseStatus === '7' || caseStatus === '8'){
      currentNodeNum = 1 //审批阶段
    }else if(caseStatus === '9' || caseStatus === '10' || caseStatus === '11' || caseStatus === '12' || caseStatus === '13' || caseStatus === '14' || caseStatus === '15' || caseStatus === '16'){
      currentNodeNum = 2 //指派阶段
    }else if(caseStatus === '17'){
      currentNodeNum = 3 //承办中
    }else if(caseStatus === '18'){
      currentNodeNum = 4 //评价中
    }else if(caseStatus === '19' || caseStatus === '20' || caseStatus === '21' || caseStatus === '22' || caseStatus === '23' || caseStatus === '24'){
      currentNodeNum = 5 //归档阶段
    }
    
    return currentNodeNum
  },

  /*
    根据左侧菜单的路由获取请求案件列表的状态
    @params: listType
    @return: reqCaseStatus
  */

  getReqStatusByMenu(listType){
    let reqCaseStatus = ''
    switch (listType){
      case '1'://线上检查
      reqCaseStatus = '1'
      break;
      case '2'://发起竞价
      reqCaseStatus = '12'
      break;
      case '3'://推荐援助人
      reqCaseStatus = '14'
      break;
      case '4'://评价中
      reqCaseStatus = '18'
      break;
      case '5'://发起归档
      reqCaseStatus = '19'
      break;
      case '6'://待初审
      reqCaseStatus = '3'
      break;
      case '7'://待复审
      reqCaseStatus = '5,6'
      break;
      case '8'://待补充材料
      reqCaseStatus = '4,7'
      break;
      case '9'://待指派
      reqCaseStatus = '9'
      break;
      case '10'://待受援人指定
      reqCaseStatus = '10'
      break;
      case '11'://待援助人确认
      reqCaseStatus = '11'
      break;
      case '12'://竞价进行中
      reqCaseStatus = '13'
      break;
      case '13'://待确定援助人
      reqCaseStatus = '15'
      break;
      case '14'://待签订委托协议
      reqCaseStatus = '16'
      break;
      case '15'://援助事项监督
      reqCaseStatus = '17'
      break;
      case '16'://待填写结算
      reqCaseStatus = '21'
      break;
      case '17'://待补充材料
      reqCaseStatus = '20,23'
      break;
      case '18'://待归档完成
      reqCaseStatus = '22'
      break;
      case '19'://已归档事项
      reqCaseStatus = '24'
      break;
      case '20'://援助事项查询, 包含所有的案件
      reqCaseStatus = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24'
      break;
      case '21'://不予援助
      reqCaseStatus = '8'
      break;
      default:
      reqCaseStatus = '1'
    }
    return reqCaseStatus
  },

  /*
    根据案件状态返回showType,用于案件详情中根据状态展示不同的信息
    @params: caseStatus-string
    @return: showType
  */
  getShowTypeByStatus(caseStatus){
    if(!caseStatus){
      return caseStatus
    }

    let showType = ''

    if(caseStatus === '1' || caseStatus === '2' ){
      //申请阶段：显示通用的最新日志
      showType = 1
    }else if(caseStatus === '3' || caseStatus === '5' || caseStatus === '6' || caseStatus === '8' || caseStatus === '12' || caseStatus === '14'){
      //初审，复审， 不予援助, 发起竞价（待办），推荐援助人（待办）：显示案件信息
      showType = 2
    }else if(caseStatus === '4' || caseStatus === '7' || caseStatus === '20' || caseStatus === '23'){
      //初审复审阶段-需补充材料，归档中援助人待补充材料：显示案件信息+需补充材料信息
      showType = 3
    }else if(caseStatus === '9'){
      //待指派，待机构端发起竞价金额，待受援人指定：显示案件信息 + 援助类型
      showType = 4
    }else if(caseStatus === '10'){
      //待受援人指定：显示案件信息+援助类型+律师列表
      showType = 12
    }else if(caseStatus === '11'){
      //待援助人确定：显示案件信息+援助类型+律师列表
      showType = 5
    }else if(caseStatus === '13'){
      //竞价中：案件信息+援助类型+竞价事项
      showType = 6
    }else if(caseStatus === '15'){
      //待机构确定援助人：案件信息+援助类型 + 已推荐援助人
      showType = 7
    }else if(caseStatus === '17'){
      //事项监督（承办阶段）：显示案件信息+援助人信息+援助类型
      showType = 8
    }else if(caseStatus === '18'){
      //评价中，评价管理：案件信息+援助人信息+评价情况
      showType = 9
    }else if(caseStatus === '22' || caseStatus === '24'){
      //待归档完成：案件信息+援助人信息+结算金额信息
      showType = 10
    }else if(caseStatus === '16' || caseStatus === '21' || caseStatus === '19'){
      //待签订委托协议，待受援人指定，待填写结算金额， 发起归档（待办）：显示案件信息 + 援助人信息
      showType = 11
    }

    return showType
  }
}

module.exports = caseStatusConverter
