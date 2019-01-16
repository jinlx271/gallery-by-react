require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

var imagesUrlData = require('../data/imageUrl.json');

//利用自执行函数将图片名称转换成图片路径  __imageDataArr 参数是将处理的json数据
imagesUrlData=(function getImageData(__imageDataArr){
	for(var i=0;i<__imageDataArr.length;i++){
		var imageData=require('../images/'+imagesUrlData[i].imageName);
		imagesUrlData[i].imageUrl=imageData;
		//console.log("imageData i="+i+"; imageData=="+'../images/'+imagesUrlData[i].imageName);
		}
	return __imageDataArr;
	})(imagesUrlData);
//console.log("imagesUrlData="+JSON.stringify(imagesUrlData));
	
class ImageFigure extends React.Component{
	// /*style={{left:this.props.arrange.pos.left,top:this.props.arrange.pos.top}}*/
	render(){
		return (
			<figure className="image-fig" >
			<img src={this.props.data.imageUrl} alt={this.props.data.imageTitle} />
			<figcaption>
				<h2>
				{this.props.data.imageTitle}
				</h2>
			</figcaption>
			</figure>
			)
		}	
}
class AppComponent extends React.Component {
  constructor(props){
	super(props);
	this.state={
		imageArrangeArr:[
		/*//每个图片的位置区域
		{pos:{
			left:0,
			top:0
			}}*/
		]
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
  render() {
	var imageFigureArr=[];
	imagesUrlData.forEach(function(__value,__index){
		if(!this.state.imageArrangeArr[__index]){
			this.state.imageArrangeArr[__index]={
				pos:{
					left:0,
					top:0
				}
				}
			}
		//arrange={this.state.imageArrangeArr[__index]}
		//console.log('state.imageArrangeArr ='+JSON.stringify(this.state.imageArrangeArr));	
		imageFigureArr.push(<ImageFigure data={__value} ref={'imageFig'+__index}></ImageFigure>);
		}.bind(this));
    return (
      <section className='stage' ref="stage">
	  <section className='image-sec'>
	  {imageFigureArr}
	  </section>
	  <nav className='control-nav'>
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
	  	  //centerLeft = constant.centerPos.left,
	      //centerTop = constant.centerPos.top,
		  hPosRange = constant.hPosRange,
	  	  vPosRange = constant.vPosRange,
		  hPosRangeLeftSecX=hPosRange.leftSecX,
		  hPosRangeRightSecX=hPosRange.rightSecX,
		  hPosRangeY=hPosRange.y,
		  vPosRangeTopSecY=vPosRange.topSecY,
		  vPosRangeX=vPosRange.x;
	  var topImageNum=Math.ceil(Math.random() * 2); //上方显示一个或者两个图片
	  var topImageSliceIndex=0; 
	  var imageCenterArrange=imageArrangeArr.splice(centerIndex,1);
	  //居中图片
	  imageCenterArrange[0].pos=centerPos;
	  //设置上方区域的图片
	  topImageSliceIndex=Math.ceil(Math.random()*(imageArrangeArr.length-topImageNum));
	  var topImageArrangeArr=imageArrangeArr.splice(topImageSliceIndex,topImageNum);
	  topImageArrangeArr.forEach(function(value,index){
		  topImageArrangeArr[index].pos.top=getRandomRange(vPosRangeTopSecY[0],vPosRangeTopSecY[1]);
		  topImageArrangeArr[index].pos.left=getRandomRange(vPosRangeX[0],vPosRangeX[1]);
		  });
	  console.log('topImageArrangeArr ='+JSON.stringify(topImageArrangeArr));
	  //设置左右两侧的区域的图片
	  for(var i=0,j=imageArrangeArr.length,k=j / 2;i<j;i++){
		  if(i<k){
			  imageArrangeArr[i].pos.left=getRandomRange(hPosRangeLeftSecX[0],hPosRangeLeftSecX[1]);
			  imageArrangeArr[i].pos.top=getRandomRange(hPosRangeY[0],hPosRangeY[1]);
		  }else{
			  imageArrangeArr[i].pos.left=getRandomRange(hPosRangeRightSecX[0],hPosRangeRightSecX[1]);
			  imageArrangeArr[i].pos.top=getRandomRange(hPosRangeY[0],hPosRangeY[1]);
		  }
	  }
	  imageArrangeArr.splice(topImageSliceIndex,0,topImageSliceIndex);
	  imageArrangeArr.splice(centerIndex,0,imageCenterArrange);
	 // console.log('imageArrangeArr ='+JSON.stringify(imageArrangeArr));
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
	  console.log('stageDom='+stageDom);
	  var stageDomWidth=stageDom.scrollWidth,
		  stageDomHight=stageDom.scrollHeight,
		  //上面是舞台的中心点
		  halfStageW=Math.ceil(stageDomWidth / 2),
		  halfStageH=Math.ceil(stageDomHight / 2);
	  //每组图片区域的大小  
	  var imageFigDom=ReactDOM.findDOMNode(this.refs.imageFig0),
	  		imageFigWidth=imageFigDom.scrollWidth,
			imageFigHeight=imageFigDom.scrollHeight,
			halfImageW=Math.ceil(imageFigWidth / 2),
			halfImageH=Math.ceil(imageFigHeight / 2);
			
	  this.constant.centerPos.left=	halfStageW - halfImageW;
	  this.constant.centerPos.top=	halfStageH - halfImageH;
	  this.constant.hPosRange.leftSecX[0]=-halfImageW;
	  this.constant.hPosRange.leftSecX[1]=halfStageW - halfImageW * 3;
	  this.constant.hPosRange.rightSecX[0]=halfStageW + halfImageW;
	  this.constant.hPosRange.rightSecX[1]=stageDomWidth - halfImageW ;
	  this.constant.hPosRange.y[0]=-halfImageH;
	  this.constant.hPosRange.y[1]=stageDomHight - halfImageW;
	  
	  this.constant.vPosRange.topSecY[0]=-halfImageH;
	  this.constant.vPosRange.topSecY[1]=halfStageH - halfImageH * 3;
	  this.constant.vPosRange.x[0]=halfStageW -imageFigWidth;
	  this.constant.vPosRange.x[1]=halfStageW;
	  
	  this.rearrange(0);
	 }
}

AppComponent.defaultProps = {
	inputContent:''
};

export default AppComponent;
