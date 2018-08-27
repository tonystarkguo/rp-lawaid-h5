import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Button, Toast, Modal } from 'antd-mobile'
import { routerRedux } from 'dva/router'
const RiskNotify = ({
  dispatch,
  riskNotify,
}) => {
  const onOk = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.isAuth) {
      dispatch(routerRedux.push('applyLawAid'))
    } else {
      // Toast.info('您还没有在浙江公共法律服务网经过实名认证，无法申请法援。')
      Modal.alert('申请法援需实名认证，请在“浙江政务网”实名认证后重新登录', '', [
        { text: '取消' },
        { text: '去认证', onPress: () => window.location.href = 'https://puser.zjzwfw.gov.cn/sso/usp.do?action=mobilefplogin&servicecode=zjsftflyz&goto=http%3A//flyzwx.zjsft.gov.cn/login' },
      ])
    }
  }
  return (
    <div>
      <article className={styles.content}>
        <h2>法律援助权力义务一次性告知书</h2>
        <h4>为了您的利益，请仔细阅读下列内容：</h4>
        <h3>一、受援人权利</h3>
        <p>（一）法律援助是无偿的。法律援助中心、法律服务机构、案件承办人不得收受任何财物，请您监督，并可向法律援助中心或律师协会投诉。</p>
        <p>（二）您有权向案件承办人了解案件进展情况。</p>
        <p>（三）您认为案件承办人消极办案，有权向法律援助中心提出，并可要求更换案件承办人。法律援助中心查证属实的，可视情形予以更换。</p>
        <p>（四）您的诉求能否得到实现，根据您所提供的证据材料，取决于人民法院或仲裁机构的依法裁判。案件审理时间的长短，由法院或仲裁机构决定。法律援助中心与法院、仲裁机构不相隶属，案件承办人根据您的授权为您向仲裁院申请仲裁，或者向法院提起诉讼，并参与调解、参加庭审等活动。</p>
        <h3>二、受援人义务</h3>
        <p>（一）法律援助中心接受您的申请材料，除法律援助申请表为原件外，其他申请材料一律为复印件</p>
        <p>（二）您通过自取、邮寄或网上下载等方式收到《给予法律援助决定书》后，请及时与决定书上指派的承办单位和承办人联系，办理相关手续。</p>
        <p>（三）您的手机24小时都应开机，如果更换号码应及时通知案件承办人员。案件办理过程中，法律援助中心、案件承办人根据您所提供的联系方式与您联系都无法联系上的，法律援助中心有权终止该事项的法律援助，相关后果由您本人负责，请您务必填写清楚您的联系方式。</p>
        <p>（四）您对主张的权利负有举证责任。请您将与案件有关的证据及时提供给案件承办人。否则，您将承担举证不能的法律后果。</p>
        <p>（五）您应如实向法律援助中心及案件承办人陈述与案件相关的事实。您不得隐瞒与案件相关联的对您不利的客观事实，并对自己提供的证据材料的真实性、合法性负责。如果您的陈述、声明与事实不符，提供证明、文字材料虚假，法律援助中心有权终止法律援助。</p>
        <p>（六）您收到开庭通知书后应立即通知案件承办人，以免贻误工作。</p>
        <p>（七）您如果要将已立案的案件撤诉时，必须及时告知案件承办人。</p>
        <h3>三、本案存在以下风险：部分败诉、败诉。</h3>
      </article>
      <div className={styles.btn}>
        <Button type="primary" onClick={onOk}>我已了解，确认申请法律援助</Button>
      </div>
    </div>
  )
}

export default connect(({ riskNotify }) => ({ riskNotify }))(RiskNotify)
