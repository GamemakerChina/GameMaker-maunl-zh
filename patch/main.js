
group="def"

target=null

//删除跳过啥啥玩意
$(".skip-to-content-container").remove()

var cssFileUrl='../patch/main.css';
$("head").append("<link>");
    css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: cssFileUrl
});

$.getScript("../patch/layer/layer.js")

var cssFileUrl='../patch/layer/theme/default/layer.css';
$("head").append("<link>");
    css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: cssFileUrl
});

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//移除并替换给定字符串的所有标签到{}
removeHtml=function(str){
	var regex = /(<([^>]+)>)/ig
	return str.replace(regex, "{}");
}

//返回给定字符串的所有标签
retHtml=function(str){
	var regex = /(<([^>]+)>)/ig
	return str.match(regex);
}

restT=function(ele){

	var ele=$(ele)

	if(ele.hasClass("isTranslate")){
		ele.removeClass("isTranslate")
		var bak=ele.attr("bak")
		ele.removeAttr("bak")
		ele.html(bak)
	}

	ele.find(".isTranslate").each(function(i,ele){
		var ele=$(ele)
		ele.removeClass("isTranslate")
		var bak=ele.attr("bak")
		ele.removeAttr("bak")
		ele.html(bak)
	})
	
}

qqq_ok=function(){
	var form=$(".layui-layer-content .qqq_menu .form").val()
	var key=$(".layui-layer-content .qqq_menu .key").val()
	var old=$(".layui-layer-content .qqq_menu .old").val()
	var lnew=$(".layui-layer-content .qqq_menu .new").val()

	restT(target)
	
	setL(form,key,old,lnew)
	layer.closeAll()
	
}

qqq_translate_set=function(str){

	$(".qqq_menu .new").val(str)

	qqq_hight_light()

}

qqq_translate=async function (engine){
	var old=$(".qqq_menu .old").val()

	//翻译前转义空格的转义
	old=old.replace(/\&nbsp\;/g," ")
	var json=await translate(old,engine).catch((e) => {})
	if(!json){alert("接口报空,请检查token")}
	var str=json.data.target

	//翻译后的内容清除{}周遭空格
	str=str.replace(/\} */g,"}")
	str=str.replace(/ *{/g,"{")

	//修正大括号
	str=str.replace(/\） */g,")")
	str=str.replace(/ *（/g,"(")
	//修正小括号
	str=str.replace(/ *\(/g,"(")
	
	//修正双引号
	str=str.replace(/“/g,"\"")
	str=str.replace(/”/g,"\"")

	//修正狗屎转义
	str=str.replace(/ ?；/g,";")
	str=str.replace(/& ?/g,"&")
	

	//console.log(str)

	qqq_translate_set(str)

}

qqq_caiyun=async function (){

		var str=await caiyun($(".qqq_menu .old").val()).catch((e) => {})
		if(!str){alert("接口报空,请检查token")}
		//console.log(str)
		qqq_translate_set(str)

}

qqq_hight_light=function(){
	var reg=new RegExp('\{\}','g')
	var rs="<b class='score' style='color:red;'>{}</b>"
	var left=$(".qqq_menu .old").val()
	var right=$(".qqq_menu .new").val()

	var lc=left.split("{}").length-1 //左得分
	var rc=right.split("{}").length-1 //右得分

	var score="( "+lc+":"+rc+" )"//分数文本

	//替换标签
	left=left.replace(reg,rs)
	right=right.replace(reg,rs)

	for (let i = 0; i < lc; i++) {
		//console.log(left)
		left=left.replace('{}',"{"+i+"}")
	}
	for (let i = 0; i < lc; i++) {
		var rs="<b class='score' style='color:orange;'>{"+i+"}</b>"
		var tmp=right.replace("{"+i+"}",rs)
		if(tmp===right){
			right=right.replace('{}',"{"+i+"}")
		}else{
			right=tmp
			rc++
		}
	}

	$(".hl_old").html(left)
	$(".hl_new").html(right)

	var score="( "+lc+":"+rc+" )"
	$(".qqq span.num").html(score)

	//滚动条沉底
	var layer_div = $(".layui-layer-content");
	layer_div.animate({ scrollTop: layer_div.prop("scrollHeight") - layer_div.height() }, 0);
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

html=`<div class="hide">

<div class="qqq qqq_menu">
		form(save file)
		<textarea class="input form"contenteditable="true"></textarea>
	<hr>
		key(struct key)<textarea class="input key"contenteditable="true" style="height:50px"></textarea>
	<hr>
	<div class="qqq qqq_hightlight layui-row">
		<div class="hl_old layui-col-md6">123</div>
		<div class="hl_new layui-col-md6">132</div>
	</div>
	<hr>
	<div class="layui-row">

		<div class="layui-col-md6">
		old(content)
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_caiyun()>彩云</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("deepl")>deepl</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("lang-x")>langx</button>
		<br>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("aws")>aws</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("ali")>ali</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("xinyi")>xinyi</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("xunfei")>xunfei</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("modern-mt")>modern-mt</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("huoshan")>huoshan</button>
		<textarea oninput="qqq_hight_light()" class="lr input old"contenteditable="true"></textarea>
		</div>

		<div class="layui-col-md6">
		new(translate)<span class="num"></span>
		<br>
		<button class="layui-btn  layui-btn-xs" onclick=qqq_hight_light()>hightlight</button>
		<textarea oninput="qqq_hight_light()" class="lr input new"contenteditable="true"></textarea>
		</div>
	</div>
	<button class="layui-btn layui-btn-lg layui-btn-fluid" onclick=qqq_ok()>Ok!</button>

</div>



</div>`
$("body").after(html)

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//"global_toc"

add_translate=async function(ele,file){
	if (ele.hasClass("isTranslate"))return 0
	
	var form=group+"/"+file+".json"
	var html=ele.html()
	var key=removeHtml(html)

	var val=await L(form,key)

	if (!val.length)return null

	ele.addClass("isTranslate")
	ele.attr("bak",ele.html())
	
	//在翻译上还原标签
	var f=retHtml(ele.html())

	var i=0
	if(f)f.forEach(function(v,k){
		var tmp=val.replace("{"+i+"}",v)
		if(tmp===val){
			val=val.replace("{}",v)
		}else{
			val=tmp
		}
		i++
	})

	ele.html(val)

}
add_event=async function(ins,file){
	if ($(ins).hasClass("isHookOver"))return 0
	//添加事件
	ins.addClass("isHookOver")
	
	ins.mousedown(function(e) {if (3 == e.which) {
		target=$(this)
		
		//设置路径
		var form=group+"/"+file+".json"
		$(".qqq_menu .form").val(form)

		//如果被翻译过了,则获取原文
		restT(target)
		
		//处理html标签为{}
		var str=target.html()
		var key=removeHtml(str)
		
		$(".qqq_menu .key").val(key)
		$(".qqq_menu .old").val(key)
		var ele=$(".qqq_menu .new")
		ele.val(key)

		//如果使用异步函数,会无法阻止冒泡
		L(form,key).then((result,v=ele)=>{
			if (result.length)v.val(result)
			qqq_hight_light()
		})
		
		layer.open({
			type: 1 //Page 层类型
			,area: ['1000px',"900px"]
			,title: 'translate'
			,shade: 0.8 //遮罩透明度
			,anim: 0 //0-6的动画形式，-1不开启
			,content: $(".qqq_menu")
			,resize:false
			,shadeClose :true
		});

		//阻止事件冒泡
		return false;
	}})
}


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


//给元素增加事件
window.setInterval(function(){
	
	//获取当前页面的目录
	const uri=$("iframe.topic")[0].baseURI
	const dir="www/" + uri.match("t\=(.*)\.htm")[1].replaceAll("%2F","/")

	const iframe=$("iframe.topic").contents()
	
	//这么做只是为了方便移植修改
	const css1="div.footer a,h4,caption"
	const css2="p,h1,h2,h3,td,li,a,div.dropspotnote"
	const css3="th,.warning,.important,.optional"

	//页内第一次全局替换
	iframe.find(css1).each(function(){
		const file="global"
		add_translate($(this),file)
		add_event($(this),file)
	})

	//页内替换
	iframe.find(css2).each(function(){
		const file=dir
		add_translate($(this),file)
		add_event($(this),file)
	})

	//页内第二次全局替换
	iframe.find(css3).each(function(){
		const file="global"
		add_translate($(this),file)
		add_event($(this),file)
	})

	//翻译左侧菜单
	$("#toc-panel a").each(function(){
		const file="global"
		add_translate($(this),file)
		add_event($(this),file)
	})

},500)

