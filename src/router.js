import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({
  history,
  app,
}) {
  const routes = [{
    path: '/',
    component: App, // 程序的路口
    getIndexRoute (nextState, cb) { // 登录进来之后默认显示的路由（如果没有指定路由的话）
      require.ensure([], require => {
        registerModel(app, require('./models/login'))
        cb(null, {
          component: require('./routes/login/')
        })
      }, 'login')
    },
    childRoutes: [{
      path: 'lawcase/:id',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/lawcase/detail'))
          cb(null, require('./routes/lawcases/detail/'))
        }, 'lawcase-detail')
      },
    }, {
      path: 'lawcaselog/:id',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/lawcase/caselog'))
          cb(null, require('./routes/lawcases/caselog/'))
        }, 'lawcase-caselog')
      },
    }, {
      path: 'lawcases',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/lawcases'))
          cb(null, require('./routes/lawcases/'))
        }, 'lawcase-detail')
      },
    }, {
      path: 'imgViewer',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          cb(null, require('./routes/lawcases/detail/imgViewer.js'))
        }, 'imgViewer')
      },
    }, {
      path: 'login', // 登陆
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/login'))
          cb(null, require('./routes/login/'))
        }, 'login')
      },
    }, {
      path: 'loginPhone(/:name)', // 手机号码登陆
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/loginPhone'))
          cb(null, require('./routes/loginPhone/'))
        }, 'loginPhone')
      },
    }, {
      path: 'register', // 注册
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/register'))
          cb(null, require('./routes/register/'))
        }, 'register')
      },
    }, {
      path: 'message', // 我的信息
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/message'))
          cb(null, require('./routes/message/'))
        }, 'message')
      },
    }, {
      path: 'onlineConsult', // 网络咨询
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/onlineConsult'))
          cb(null, require('./routes/onlineConsult/'))
        }, 'onlineConsult')
      },
    }, {
      path: 'consultList', // 咨询历史
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/consultList'))
          cb(null, require('./routes/consultList/'))
        }, 'consultList')
      },
    }, {
      path: 'consultDetailn/:id', // 咨询历史-未答复
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/consultDetailn'))
          cb(null, require('./routes/consultDetailn/'))
        }, 'consultDetailn')
      },
    }, {
      path: 'consultDetaily/:id', // 咨询历史-已答复
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/consultDetaily'))
          cb(null, require('./routes/consultDetaily/'))
        }, 'consultDetaily')
      },
    }, {
      path: 'orgList', // 机构列表
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/orgList'))
          cb(null, require('./routes/orgList/'))
        }, 'orgList')
      },
    }, {
      path: 'orgDetail', // 机构详情
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/orgDetail'))
          cb(null, require('./routes/orgDetail/'))
        }, 'orgDetail')
      },
    }, {
      path: 'address', //地址指引
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/address'))
          cb(null, require('./routes/address/'))
        }, 'address')
      },
    }, {
      path: 'notice', // 法律援助须知
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/notice'))
          cb(null, require('./routes/notice/'))
        }, 'notice')
      },
    }, {
      path: 'riskNotify', // 义务告知书
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/riskNotify/riskNotify.js'))
          cb(null, require('./routes/riskNotify/'))
        }, 'riskNotify')
      },
    }, {
      path: 'applyLawAid', // 申请法援
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/applyLawAid/applyLawAid.js'))
          cb(null, require('./routes/applyLawAid/'))
        }, 'applyLawAid')
      },
    }, {
      path: 'fileUpload/:type', // 文件上传
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/fileUpload/fileUpload.js'))
          cb(null, require('./routes/fileUpload/'))
        }, 'fileUpload')
      },
    }, {
      path: 'supplementFiles/:id', // 补充材料
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/supplementFiles/supplementFiles.js'))
          cb(null, require('./routes/supplementFiles/'))
        }, 'supplementFiles')
      },
    }],
  }]
  return (
    <Router history={
      history
    }
      routes={
        routes
      }
    />
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
