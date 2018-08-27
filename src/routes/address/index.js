import { Component, PropTypes } from 'react';
import { connect } from 'dva'
import styles from './index.less'

class Address extends Component {

  componentDidMount () {

	let data = JSON.parse(localStorage.getItem('orgMsg'))

	let sContent = `<div>
		<p style='margin:0 0 5px 0;line-height:1.5;padding:0.1em 0;font-size:28px;'>${data.name}</p>
		<p style='margin:0 0 5px 0;line-height:1.5;padding:0.1em 0;font-size:28px;'>${data.address}</p>
    </div>`

	// 百度地图API功能
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(data.longitude, data.latitude);
	var marker = new BMap.Marker(point);  // 创建标注
	map.addOverlay(marker);              // 将标注添加到地图中
	map.centerAndZoom(point, 18);
	map.enableScrollWheelZoom(true);
	var opts = {
	  width : 300,     // 信息窗口宽度
	  // height: 180,     // 信息窗口高度
	  // title : "海底捞王府井店" , // 信息窗口标题
	  // enableMessage:true,	//设置允许信息窗发送短息
	  // message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
	}
	var infoWindow = new BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象
	map.openInfoWindow(infoWindow,point); //开启信息窗口
	marker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	});

  }

  render() {
  	return <div>
  		<div id='allmap' style={{ width:'100vw', height:'100vh' }}></div>
  	</div>
  }
}


export default connect((address) => ({address}))(Address)

