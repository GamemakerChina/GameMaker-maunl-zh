
group="zh"
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

removeHtml=function(str){
	var regex = /(<([^>]+)>)/ig
	return str.replace(regex, "{}");
}
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

	//分数文本
	var old=$(".qqq_menu .old").val()
	var lc=old.split("{}").length-1 //左得分
	var rc=str.split("{}").length-1 //右得分
	var score="( "+lc+":"+rc+" )"
	$(".qqq span.num").html(score)
&nbsp;
}

qqq_translate=async function (engine){
	var old=$(".qqq_menu .old").val()

	//翻译前转义空格的转义
	old=old.replace(/\&nbsp\;/g," ")
	
	var json=await translate(old,engine).catch((e) => {})
	var str=json.data.target

	//翻译后的内容清除{}周遭空格
	str=str.replace(/\} */g,"}")
	str=str.replace(/ *{/g,"{")

	console.log(str)

	qqq_translate_set(str)

}

qqq_caiyun=async function (){

		var str=await caiyun($(".qqq_menu .old").val()).catch((e) => {})
		console.log(str)
		qqq_translate_set(str)

}

qqq_hight_light=async function(){
	var reg=new RegExp('\{\}','g')
	var rs="<b>{}</b>"
	var left=$(".qqq_menu .old").val()
	var right=$(".qqq_menu .new").val()

	var lc=left.split("{}").length-1 //左得分
	var rc=right.split("{}").length-1 //右得分

	var score="( "+lc+":"+rc+" )"//分数文本

	//替换标签
	left=left.replace(reg,rs)
	right=right.replace(reg,rs)

	$(".hl_old").html(left)
	$(".hl_new").html(right)

	layer.open({
		type: 1 //Page 层类型
		,area: ['800px',"800px"]
		,title: 'distinction'+score
		,shade: 0.8 //遮罩透明度
		,anim: 0 //0-6的动画形式，-1不开启
		,content: $(".qqq_hightlight")
		,resize:false
		,shadeClose :true
	});

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
	
	<div class="layui-row">

		<div class="layui-col-md6">
		old(content)
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_caiyun()>彩云</button>
		<br>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("deepl")>deepl</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("lang-x")>langx</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("aws")>aws</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("ali")>ali</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("xinyi")>xinyi</button>
		<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate("xunfei")>xunfei</button>
		<textarea class="lr input old"contenteditable="true"></textarea>
		</div>

		<div class="layui-col-md6">
		new(translate)<span class="num"></span>
		<br>
		<button class="layui-btn  layui-btn-xs" onclick=qqq_hight_light()>distinction</button>
		<textarea class="lr input new"contenteditable="true"></textarea>
		</div>
	</div>
	<button class="layui-btn layui-btn-lg layui-btn-fluid" onclick=qqq_ok()>Ok!</button>

</div>

<div class="qqq qqq_hightlight layui-row">
	<div class="hl_old layui-col-md6">123</div>
	<div class="hl_new layui-col-md6">132</div>
</div>

</div>`
$("body").after(html)

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//"global_toc"

add_translate=function(ele,file){
	if ($(ele).hasClass("isTranslate"))return 0
	
	var form=group+"/"+file+".struct"
	var html=ele.html()
	var key=removeHtml(html)

	L(form,key).then(function(result,v=ele){
		if (result.new.length<1)return null

		v.addClass("isTranslate")
		v.attr("bak",v.html())
		
		//在翻译上还原标签
		var f=retHtml(v.html())
		if(f)f.forEach(function(v,k){
			result.new=result.new.replace("{}",v)
		})

		v.html(result.new)
	})
}
add_event=function(ins,file){
	if ($(ins).hasClass("isHookOver"))return 0
	//添加事件
	ins.addClass("isHookOver")
	
	ins.mousedown(function(e) {if (3 == e.which) {
		target=$(this)
		
		//设置路径
		var form=group+"/"+file+".struct"
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

		console.log(str)

		L(form,key).then(function(result,v=ele){
			if (result.new.length<1)return null
			v.val(removeHtml(result.new))
		})

		layer.open({
			type: 1 //Page 层类型
			,area: ['800px',"800px"]
			,title: 'translate'
			,shade: 0.8 //遮罩透明度
			,anim: 0 //0-6的动画形式，-1不开启
			,content: $(".qqq_menu")
			,resize:false
			,shadeClose :true
		});
		return false;
	}})
}


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


//给元素增加事件
window.setInterval(function(){
	
	//获取当前页面的目录
	var uri=$("iframe.topic")[0].baseURI
	dir="www/" + uri.match("t\=(.*)\.htm")[1].replaceAll("%2F","/")

	var iframe=$("iframe.topic").contents()
	
	iframe.find("p,h1,h2,td,li,a").each(function(){
		var file=dir
		add_translate($(this),file)
		add_event($(this),file)
	})

	iframe.find("h4,th,.warning,.important,.optional").each(function(){
		var file="global"
		add_translate($(this),file)
		add_event($(this),file)
	})

	//翻译左侧菜单
	$("#toc-panel a").each(function(){
		var file="global"
		add_translate($(this),file)
		add_event($(this),file)
	})


},100)
