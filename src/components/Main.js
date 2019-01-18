require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

var imagesUrlData = require('../data/imageUrl.json');
var refreashImg = require('../images/l_ico0.png');
var circleImg = require('../images/p_dot.png');
var tmImg=require('../images/global_tm.gif');

//利用自执行函数将图片名称转换成图片路径  __imageDataArr 参数是将处理的json数据
imagesUrlData=(function getImageData(__imageDataArr){
	for(var i=0;i<__imageDataArr.length;i++){
		var imageData=require('../images/'+imagesUrlData[i].imageName);
		imagesUrlData[i].imageUrl=imageData;
		}
	return __imageDataArr;
	})(imagesUrlData);
//console.log('imagesUrlData='+JSON.stringify(imagesUrlData));

/*
*单个图片 imageFigure组件
*/
class ImageFigure extends React.Component{
	constructor(props){
	super(props);
	this.state={
		//status:0
		};
	}
	
	//点击后处理方法 如果是中心图片需要翻转  如果是其他区域的图片需要重新排布图片
	onClickHandler(){
	  if(this.props.arrange.index==this.props.centerIndex){
		  //翻转
		  this.props.inverse();
	  }else{ 
		  this.props.handler(this.props.arrange.index);
	  }
	  
	} 
	/*
	*render
	*/
	render(){
		//transform 兼容
		var styleObj={
			'left':this.props.arrange.pos.left,
			'top':this.props.arrange.pos.top,
			'transform':this.props.arrange.transStyle,
			'MsTransform':this.props.arrange.transStyle,
			'WebkitTransform':this.props.arrange.transStyle,
			'OTransform':this.props.arrange.transStyle,
			'MozTransform':this.props.arrange.transStyle,
			'transitionDuration':'800ms',
			
		};
		//console.log('this.props.arrange.index=='+this.props.arrange.index+';this.props.centerIndex='+this.props.centerIndex);
		var imageStyle={
			'display':this.props.arrange.status==0?'block':'none'
			};
		var descStyle={
			'display':this.props.arrange.status==1?'block':'none',
			'background':'#dee1e6'	
			};
		var imageFigureClass='image-fig';
		imageFigureClass+=this.props.arrange.status==1?' imageFigInverse':'';
		imageFigureClass+=this.props.arrange.index==this.props.centerIndex?' centerImageFig':'';
		return (
			<figure onClick={this.onClickHandler.bind(this)} className={imageFigureClass}  style={styleObj}>
				<img src={this.props.data.imageUrl} alt={this.props.data.imageTitle} style={imageStyle}/>
				<figcaption style={imageStyle}>
					<h2>
					{this.props.data.imageTitle}
					</h2>
				</figcaption>
				<figcaption style={descStyle}>
					<h2>
					{this.props.data.desc}
					</h2>
				</figcaption>
			</figure>
			)
		}	
}
/*
*控件组件
*/
class CircleNav extends React.Component{
	constructor(props){
	super(props);
	this.state={
		};
	}
//	* 控件点击事件 一种是翻转 一种是重新布局 和imageFigure控件功能一样
//	
	onClickHandler(){
	  if(this.props.arrange.index==this.props.centerIndex){
		  //翻转
		  this.props.inverse();
	  }else{ 
		  this.props.handler(this.props.arrange.index);
	  }
	  
	} 	
//	*render
//	
	render(){
		var styleObj={
			'backgroundImage':this.props.arrange.index==this.props.centerIndex?'url('+refreashImg+')':'url('+circleImg+')',
			'backgroundRepeat':"no-repeat",
			'backgroundPosition':"center",
			'width':'50px',
			'height':'50px',
			'borderRadio':'50px'
			}
		var string='  ';
		return(
			<span style={styleObj} onClick={this.onClickHandler.bind(this)}><img src={tmImg} width={'50'} height={'50'}/></span>
		)	
	}
}
/*
*画廊应用舞台组件 AppComponent
*/
class AppComponent extends React.Component {
  //默认的属性变量
  constructor(props){
	super(props);
	this.state={
		imageArrangeArr:[],
		centerIndex:0
		};
	}
  //图片可放置区域
  constant={
	  //中心区域
	  centerPos:{
		  	left:0,
			top:0
		  },
		 //横向区域
	  hPosRange:{
		  leftSecX:[0,0],
		  rightSecX:[0,0],
		  y:[0,0]
		  },
		  //垂直方向区域的
	  vPosRange:{
		 topSecY:[0,0],
		 x:[0,0]
		 }
	  } 
  //点击事件 重新布局
  handler(__index){
	this.state.centerIndex=__index;
	this.rearrange(this.state.centerIndex);
  }
  //inverse 翻转事件 
  inverse(){
	  var imageArrangeArr=this.state.imageArrangeArr;
	  var status=imageArrangeArr[this.state.centerIndex].status;
	  if(status==0){
		   imageArrangeArr[this.state.centerIndex].status=1;
	  }else{
		   imageArrangeArr[this.state.centerIndex].status=0; 
	  }
	  this.setState({
		  imageArrangeArr:imageArrangeArr  
	  });//更新布局
  }
  
  render() {
	var imageFigureArr=[],circleNavArr=[];
	imagesUrlData.forEach(function(__value,__index){
		if(!this.state.imageArrangeArr[__index]){
			this.state.imageArrangeArr[__index]={
				pos:{
					left:0,
					top:0
					
				},
				transStyle:'',
				index:__index,
				status:0 //正反面值
				}
			}
			//key 这里的key值在重新渲染的时候会缩短事件 不用全部比较组件 
		circleNavArr.push(<CircleNav key={'circleNav'+__index} handler={this.handler.bind(this)} arrange={this.state.imageArrangeArr[__index]} centerIndex={this.state.centerIndex}  inverse={this.inverse.bind(this)}></CircleNav>);
		imageFigureArr.push(<ImageFigure key={'imageFig'+__index} handler={this.handler.bind(this)} data={__value} ref={'imageFig'+__index} arrange={this.state.imageArrangeArr[__index]} centerIndex={this.state.centerIndex}  inverse={this.inverse.bind(this)}></ImageFigure>);
		}.bind(this));
    return (
      <section className='stage' ref='stage'>
	  <section className='image-sev'>
	  {imageFigureArr}
	  </section>
	  <nav className='control-nav'>
	  {circleNavArr}  
	  </nav>
	  </section>
    );
  }
  
  /*
  *排布区域 centerIndex是中心位置的index值
  */
  rearrange(centerIndex){
	  function getRandomRange(low,high){
		 return Math.ceil(Math.random()*(high-low)+low); 
	  }
	  var imageArrangeArr=this.state.imageArrangeArr;
	  var constant=this.constant;
	  var centerPos=constant.centerPos,
	  	  centerLeft = centerPos.left,
	      centerTop = centerPos.top,
		  hPosRange = constant.hPosRange,
	  	  vPosRange = constant.vPosRange,
		  hPosRangeLeftSecX=hPosRange.leftSecX,
		  hPosRangeRightSecX=hPosRange.rightSecX,
		  hPosRangeY=hPosRange.y,
		  vPosRangeTopSecY=vPosRange.topSecY,
		  vPosRangeX=vPosRange.x;
	  var topImageNum=Math.ceil(Math.random() * 2); //上方显示一个或者两个图片
	  var topImageSliceIndex=0; 
	  var imageCenterArrange=imageArrangeArr.splice(centerIndex,1);  //获取出来是数组
	  //居中图片
	  imageCenterArrange[0].pos.left=centerLeft;
	  imageCenterArrange[0].pos.top=centerTop 
	  
	  //设置上方区域的图片
	  topImageSliceIndex=Math.ceil(Math.random()*(imageArrangeArr.length-topImageNum));
	  var topImageArrangeArr=imageArrangeArr.splice(topImageSliceIndex,topImageNum);
	  topImageArrangeArr.forEach(function(value,index){
		 
		  topImageArrangeArr[index].pos.top=getRandomRange(vPosRangeTopSecY[0],vPosRangeTopSecY[1]);
		  topImageArrangeArr[index].pos.left=getRandomRange(vPosRangeX[0],vPosRangeX[1]);
		  });
	  //设置左右两侧的区域的图片
	 
	  for(var i=0,j=imageArrangeArr.length,k=j / 2;i<j;i++){
		  var left=0;
		  var top=0;
		  if(i<k){
			  left=getRandomRange(hPosRangeLeftSecX[0],hPosRangeLeftSecX[1]);
			  top=getRandomRange(hPosRangeY[0],hPosRangeY[1]);
		  }else{
			  left=getRandomRange(hPosRangeRightSecX[0],hPosRangeRightSecX[1]);
			  top=getRandomRange(hPosRangeY[0],hPosRangeY[1]);
			  
		  }
		  imageArrangeArr[i].pos={
			  left:left,
			  top:top
			  }
	  }
	  //将数据放在原来的地方
	  topImageArrangeArr.forEach(function(value,index){
		  imageArrangeArr.splice(topImageSliceIndex+index,0,topImageArrangeArr[index]);
		  });
	    imageArrangeArr.splice(centerIndex,0,imageCenterArrange[0]);
	  
	  //设置旋转角度
	  imageArrangeArr.forEach(function(value,index){
		  imageArrangeArr[index].status=0;
		  if(index==centerIndex){
			  imageArrangeArr[index].transStyle='rotate(0deg)';
		  }else{
			   imageArrangeArr[index].transStyle='rotate('+((Math.random()<0.5?'':'-')+Math.ceil(Math.random()*(30)))+'deg)'; 
		  }
		  });
	  this.setState({
		  imageArrangeArr:imageArrangeArr  
	  });
	  
  }
  //组件加载完成后 初始化图片位置
  componentDidMount(){
 	console.log('componentDidMount');
	  //舞台的大小
	  //console.log('componentDidMount this.refs='+JSON.stringify(this.refs));
	  var stageDom=ReactDOM.findDOMNode(this.refs.stage);//这里查找不到refs
	 // console.log('stageDom='+stageDom);
	  var stageDomWidth=stageDom.scrollWidth,
		  stageDomHight=stageDom.scrollHeight,
		  //下面是舞台的中心点
		  halfStageW=Math.ceil(stageDomWidth / 2),
		  halfStageH=Math.ceil(stageDomHight / 2);
	  //每组图片区域的大小  
	  var imageFigDom=ReactDOM.findDOMNode(this.refs.imageFig0),
	  		imageFigWidth=imageFigDom.scrollWidth,
			imageFigHeight=imageFigDom.scrollHeight,
			
			halfImageW=Math.ceil(imageFigWidth / 2),
			halfImageH=Math.ceil(imageFigHeight / 2);
	  //中心图片的位置	
	  this.constant.centerPos.left=	halfStageW - halfImageW;
	  this.constant.centerPos.top=	halfStageH - halfImageH;
	  //横向区域 左侧的图片的x取值范围
	  this.constant.hPosRange.leftSecX[0]=-halfImageW;
	  this.constant.hPosRange.leftSecX[1]=halfStageW - halfImageW * 3;
	  this.constant.hPosRange.rightSecX[0]=halfStageW + halfImageW *2 ;
	  this.constant.hPosRange.rightSecX[1]=stageDomWidth - halfImageW ;
	  this.constant.hPosRange.y[0]=-halfImageH;
	  this.constant.hPosRange.y[1]=stageDomHight - halfImageW;
	  
	  //纵向区域 顶部的图片的x取值范围
	  this.constant.vPosRange.topSecY[0]=-halfImageH;
	  this.constant.vPosRange.topSecY[1]=halfStageH - halfImageH * 3;
	  this.constant.vPosRange.x[0]=halfStageW -imageFigWidth;
	  this.constant.vPosRange.x[1]=stageDomWidth-imageFigWidth;
	  
	  this.rearrange(this.state.centerIndex);
	 }
}

AppComponent.defaultProps = {

};

export default AppComponent;
