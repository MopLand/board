/*
	日期 ：16:33 2012/5/28
	作者 ：Lay
	QQ    : 329118098
	Email	: veryide@qq.com
	Blog	: http://www.veryide.com/
	版本 ：V1.2

	/////////////////////////////////////

	社区广播台
	
	b		内容容器
	s		分页容器
	p		上翻控件
	n		下翻控件
	u		单个对象宽度参考
	m		是否只显示整数页（默认为 true）
	
	方法：
		Add(o)				添加对象（HTML值）
		Play(t)				播放第几张卡片 [t 卡片索引,从0开始]
		Start()				初始化
		Auto(s)				自动播放选项卡 [s 毫秒后自动播放下一张卡片]
*/
var TabBoard = function( b , s , p , n , u, f ){
	
	//容器对象
	this.Box = b;
	
	//控制器
	this.Set = s;
	
	//单个宽度
	this.Unit = u;
	
	//每页数量
	this.Page = 0;
	
	//上一页
	this.Prev = p;
	
	//下一页
	this.Next = n;
	
	//总页数
	this.Size = 0;	
	
	//是否只显示整数
	this.Full = ( typeof f == 'undefined' ) ? true : f;	
	
	//鼠标是否在容器中
	this.Over = false;	
	
	//当前页码
	this.Now = -1;
	
	//实例
	var self = this;
	
	//内容组
	this.Array = new Array();

	/*
		添加新内容
		o		HTML
	*/
	this.Add = function( o ){
		this.Array[this.Array.length] = o;
	}
	
	/*
		自动播放
		s		毫秒数
	*/
	this.Auto = function( s ){
		
		if( s ){
			
			var self=this;
					
			//如果只有一页
			if( this.Size == 1 ) return;
			
			//循环播放
			this.Inter=window.setInterval(function(){
												   
				if( self.Over ) return;
												   
				if( self.Size - self.Now - 1 > 0 ){
					self.Play(self.Now+1);
				}else{
					self.Play(0);
				}
				
			},s);
		}
		
	}
	
	/*
		初始化
	*/
	this.Start = function(  ){
		
		//未设置单个内容宽度时不启动
		if( typeof this.Unit != 'number' ) return;
		
		//绑定鼠标事件，鼠标在内容区时不播放
		this.Box.onmouseover = this.Set.onmouseover = this.Prev.onmouseover = this.Next.onmouseover = function(){
			self.Over = true;
		}
		
		//绑定鼠标事件，鼠标离开内容区时播放
		this.Box.onmouseout = this.Set.onmouseout = this.Prev.onmouseout = this.Next.onmouseout = function(){			
			self.Over = false;
		}		
		
		//可见尺寸（如果小于参考尺寸就等于参考尺寸，否则会产生无限循环的小数）
		var vis = this.Box.offsetWidth < this.Unit ? this.Unit : this.Box.offsetWidth;		
		
		//每页数量
		this.Page = parseInt( vis / this.Unit );
		
		//总页数，Full == true 去掉小数，Full == false 保留小数
		this.Size = this.Full ? Math.floor( this.Array.length / this.Page ) : Math.ceil( this.Array.length / this.Page ) ;
		
		//如果只有一页
		if( this.Size == 0 ) this.Size = 1;
		
		/*********************/
		
		//构建控制器
		var str = '';
		
		this.Set.innerHTML = str;
		
		for( var n = 0; n < this.Size ; n++ ){	
			
			//创建元素
			var tag = document.createElement("span");
			
			//为分页绑定事件
			(function(){				
				var i = n;
				tag.onclick = function(){					
					self.Play( i );
				}			
			})();
			
			//插入元素
			this.Set.appendChild(tag);			
			
		}
		
		//显示第一页
		this.Play();
		
		//绑定 上一页 按钮
		this.Prev.onclick = function(){
		
			//不在第一页
			if( self.Now != 0 ){			
				self.Play( self.Now - 1 );
			}else{			
				self.Play( self.Size -1 );
			}
			
		}
		
		//绑定 下一页 按钮
		this.Next.onclick = function(){
			
			//不在第后一页
			if( self.Size - self.Now - 1 > 0 ){			
				self.Play( self.Now + 1 );				
			}else{				
				self.Play( 0 );				
			}
			
		}
		
	}
	
	/*
		播放第几页
		n	页码
	*/
	this.Play = function( n ){
		
		//页码
		var n = n ? n : 0;
		
		//截取数据
		var arr = this.Array.slice( n * this.Page , (n+1) * this.Page );
		
		/******************/
		
		//高亮当前页
		var tag = this.Set.getElementsByTagName("span");
		
		for(var i=0; i<tag.length; i++){			
			tag[i].className = "";			
		}
		
		tag[n].className = "active";
		
		//记录页码
		this.Now = n;
		
		/******************/
		
		//构建数据
		var str = '';
		
		for( var i=0; i < arr.length && i < this.Page; i++ ){		
            str += '<td>'+ arr[i] +'</td>';
		}
		
		//显示数据
		self.Box.innerHTML = '<table cellpadding="0" cellspacing="0" width="100%"><tr>'+str+'</tr></table>';
		
	}
	
}