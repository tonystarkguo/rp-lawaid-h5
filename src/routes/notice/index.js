import React from 'react'
import { connect } from 'dva'
import { List } from 'antd-mobile';
import styles from './index.less'

const Item = List.Item;

const Notice = ({}) => {

  return (
    <List>
      <Item>一、法律援助对象</Item>
      <Item wrap>法律援助的对象为符合经济困难条件和法律援助事项条件的自然人。</Item>
      <Item>二、法律援助事项条件</Item>
      <Item wrap>1.依法请求国家赔偿的；2.请求给予社会保险待遇或者最低生活保障待遇的；3.请求发给抚恤金、救济金的；4.请求给付赡养费、抚养费、扶养费的；5.请求支付劳动报酬的；6.请求医疗事故、交通事故、工伤事故赔偿的；7.主张因见义勇为行为产生的民事权益的；8.刑事案件；9.其他符合法律援助事项条件的情形。</Item>
      <Item>三、法律援助形式</Item>
      <Item wrap>1.法律咨询、代拟法律文书；2.刑事辩护和刑事代理；3.民事诉讼代理；4.行政诉讼和行政复议代理；5.仲裁代理；6.非诉讼法律事务代理；7.公证证明；8.其他形式的法律服务。</Item>
      <Item wrap>四、申请法律援助应当提交的证据、证明材料</Item>
      <Item wrap>1.申请人、代理申请人的身份证或者其他有效的身份证明，代理申请人还应当提交有代理权的证明；2.经济困难的相关证明，例如：政府民政部门核发的《困难家庭救助证》（含低保）、《残疾人基本生活保障证》或者申请人户籍所在地乡镇人民政府（街道办事处）出具的申请人家庭经济困难证明，经济困难条件应当符合家庭人均月收入低于当地最低工资标准；3.与所申请法律援助事项有关的案件证据材料。网上申请法律援助的当事人，在网上预审通过后，应当到指定法律援助中心现场核对相关证据、证明材料，并填写《法律援助申请表》。</Item>
      <Item>五、法律援助案件受理管辖</Item>
      <Item wrap>申请法律援助应向办案机关所在地同级法律援助机构提出。办案机关为浙江省劳动人事争议仲裁院的，请向西湖区法律援助中心提出申请。</Item>
    </List>
  )

}

export default connect(({ orgList }) => ({ orgList }))(Notice)