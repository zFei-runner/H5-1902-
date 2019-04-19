var tools={
	/**
	 * 通过id名获取元素节点对象
	 * @param id<string> 传入id名
	 * @return obj<DOM Object> 返回与id相对应的元素节点对象
	 * 
	 * */
	getEleObjById:function (id){
		return document.getElementById(id);
	},
	/*
	 *通过标签名获取元素节点对象
	 * @param TagName<string> 字符串类型的标签名，eg:"div"
	 * @return HTMLCollection HTML的节点对象的集合，读取方式与数组相同
	 * 	 -当集合中只有一个节点对象时，也需要使用索引进行读取
	 * */
	getEleObjsByTagName:function (TagName){
		return document.getElementsByTagName(TagName);
	},
	/*
	 *通过name属性来获取元素节点对象
	 * 
	 *@param name<string> 字符串类型的name值
	 *@return HTMLCollection HTML的节点对象的集合，读取方式与数组相同
	 * 	-当集合中只有一个节点对象时，也需要使用索引进行读取
	 * 
	 * */
	getEleObjsByName:function (name){
		return document.getElementsByName(name);
	},
	
	
	
	
	
	
	
	
	
	
	/*获取body(可视化窗口)的宽度和高度
	 * @return obj {width,height} 
	 * 
	 * */
	getBody:function (){
		var width=document.documentElement.clientWidth||document.body.clientWidth;
		
		var height=document.documentElement.clientHeight||document.body.clientHeight;
		
		return {"width":width,"height":height};	
	},
	
	/*
	 *添加事件监听
	 * @param obj <DOM Object>
	 * @param type <string>  事件句柄(不加on)
	 * @param fn  <function> obj的触发函数
	 * @param isCaption <boolean> 是否在捕获阶段开始触发，默认为false
	 * 
	 * */
	addListener:function (obj,type,fn,isCaption){
		if(obj.addEventListener){
			obj.addEventListener(type,fn,isCaption);
		}else{//else if(window.attahEvent)
			//如果此处写的是fn,那么this指代的就是window这个对象，因为attachEvent方法是window的
//			obj.attachEvent("on"+type,fn);//兼容IE8及以下
			//
			obj.attachEvent("on"+type,function (){
				fn.call(obj);
			});
		}	
		
	},
	/*
	 *移除事件监听
	 * @param obj <DOM Object>
	 * @param type <string>  事件句柄(不加on)
	 * @param fn  <function> obj的触发函数
	 * @param isCaption <boolean> 是否在捕获阶段开始触发，默认为false
	 * 
	 * */
	removeListener:function (obj,type,fn,isCaption){
		if(obj.removeEventListener){
			obj.removeEventListener(type,fn,isCaption);
			
		}else{
			obj.detachEvent(type,fn);//兼容8及以下浏览器
		}
	},
	/*
	 *滚轮事件兼容
	 * @param obj<DOM Object> 添加滚轮事件的对象
	 * @param fn<function>  obj的响应函数,该函数带有一个boolean类型的参数，true表示向下，false表示向上
	 * 
	 * 
	 * */
	scroll:function (obj,fn){
		if(obj.onmousewheel!==undefined){
			obj.onmousewheel=function (e){
				e=e||event;
				if(e.wheelDelta<0){
					fn(true);//调用函数fn，并给它传入一个实参
				}else{
					fn(false);
				}
			};
		}else{
			obj.addEventListener("DOMMouseScroll",function (e){
				e=e||event;
				if(e.detail>0){
					fn(true);//调用函数fn，并给它传入一个实参
				}else{
					fn(false);
				}				
			});
		}	
	},
	/*
	 *获取当前正在显示的对象的某个属性的属性值
	 * @param obj<DOM Object> DOM对象
	 * @param attr<string>    需要获取属性值的属性
	 * 
	 * @return value<string>  返回与attr对应的属性值
	 * */
	getStyle:function (obj,attr){
		if(window.getComputedStyle){
			return getComputedStyle(obj,null)[attr];
		}else{
			return obj.currentStyle[attr];
		}		
	},
	
	/*
	 *元素匀速运动到指定位置
	 * @param obj<DOM Object>   运动的DOM对象
	 * @param attribute<string> 需要运动的DOM对象的属性
	 * @param end<number>       运动结束位置
	 * @param time<number>		运动从开始位置到结束位置所需的时间，单位：毫秒
	 * 
	 * */
	linearMove:function (obj,attr,end,time){
		//获取运动开始的位置
		var start=parseInt(this.getStyle(obj,attr));
		//获取运动的总距离
		var distance=end - start;//number类型
		//获取一共要运动多少步(每30毫秒为一步)
		var steps=parseInt(time / 30);
		//获取速度。也就是每一步运动多远的距离
		var speed= distance / steps;
		clearInterval(obj.timer);
		obj.timer=setInterval(function (){
			start+=speed;//每调用一次前进的距离
			// console.log(start,end);
			if(Math.abs(end-start)<=Math.abs(speed)){//用开始与结束的差值去与每30毫秒运动的距离进行判断，如果差值小于了speed，证明马上到终点了
				clearInterval(obj.timer);
				start=end;
			}
			obj.style[attr] = start + "px";	
//			console.log(1);
		},30);	
	},
	/*
	 *设置元素在窗口一直居中显示
	 * @param obj<DOM Object> 要居中的元素对象
	 * 
	 * */
	showCenter : function (obj){
		var _this=this;
		//不知道传入的obj的状态是显示还是隐藏，因此先置为显示状态
		obj.style.display="block";
		//不确定obj是否含有定位属性
		obj.style.position="absolute";
		function center(){
/*			//获取该元素的宽度和高度
			var obj_width=obj.offsetWidth;
			var obj_height=obj.offsetHeight;
			//获取窗口的宽度和高度
			var width=_this.getBody().width;
			var height=_this.getBody().height;*/
			//
			obj.style.top=(_this.getBody().height - obj.offsetHeight) / 2 +"px";
			obj.style.left=(_this.getBody().width - obj.offsetWidth) / 2 +"px";
		}
		center();
		//窗口每变化一次，就获取一次窗口的值
		window.onresize=center;
			
	},
	
};
