require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

var imagesUrlData = require('../data/imageUrl.json');

//利用自执行函数将图片名称转换成图片路径  __imageDataArr 参数是将处理的json数据
imagesUrlData=(function getImageData(__imageDataArr){
	for(var i=0;i<__imageDataArr.length;i++){
		var imageData=require('../images/'+imagesUrlData[i].imageName);
		imagesUrlData[i].imageUrl=imageData;
		console.log("imageData i="+i+"; imageData=="+'../images/'+imagesUrlData[i].imageName);
		}
	return __imageDataArr;
	})(imagesUrlData);
console.log("imagesUrlData="+JSON.stringify(imagesUrlData));	

class AppComponent extends React.Component {
  render() {
    return (
      <section className='stage-sec'>
	  <section className='stage'>
	  </section>
	  <nav className='control-nav'>
	  </nav>
	  </section>
    );
  }
}

AppComponent.defaultProps = {
	inputContent:''
};

export default AppComponent;
