

//删除跳过啥啥玩意
$(".skip-to-content-container").remove()

//插入css
$("head").append(cssHtml);



///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//移除并替换给定字符串的所有标签到{}
removeHtml=function(str,isOld){
	if (isOld)	str=str.replaceAll("{}", "{ }");
	//替换标签到{}
	str=str.replace(/(<([^>]+)>)/ig, "{}");

	//替换\r\n到\n
	str=str.replace(/\r\n/g, '\n');
	//删除换行
	str=str.replace(/\n/g, '');
	//删除多余空格
	str=str.replace(/ {2,}/g, ' ');
	
	return str
}

//返回给定字符串的所有标签
retHtml=function(str){
	var regex = /(<([^>]+)>)/ig
	return str.match(regex);
}




restT=function(ele){

	var ele=$(ele)

	
	//如果翻译了html
	if(ele.hasClass("isTranslate")){
		ele.removeClass("isTranslate")
		var bak=ele.attr("bak")
		ele.removeAttr("bak")
		ele.html(bak)
	}

	// //不重要
	// //如果翻译了attr
	// if(ele.hasClass("isTranslateAttr")){
	// 	ele.removeClass("isTranslateAttr")
	// 	var attr=ele.attr("bakAttr")
	// 	var bak=ele.attr(ele.attr("bakAttrHtml"))
	// 	//ele.attr(attr,bak)
	// 	ele.removeAttr("bakAttr")
	// 	ele.removeAttr("bakAttrHtml")
	// }

	ele.find(".isTranslate").each(function(i,ele){
		restT(ele)
	})

}

qqq_ok=function(){
	var form=$(".layui-layer-content .qqq_menu .form").val()
	var key=$(".layui-layer-content .qqq_menu .key").val()
	var old=$(".layui-layer-content .qqq_menu .old").html()
	var lnew=$(".layui-layer-content .qqq_menu .new").html()

	restT(target)
	
	setL(form,key,old,lnew)
	layer.closeAll()
	
}

///来源预处理
qqq_translate_form_path=function(str){

	//翻译前转义空格的转义
	str=str.replace(/\&nbsp\;/g," ")

	return str
}

qqq_translate_set=function(str){

	$(".qqq_menu .new").html(pangu.spacing(str))

	qqq_hight_light()

}

qqq_translate_patch=function(str){
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
	
	//修正&
	str=str.replaceAll('& amp;',"&")
	str=str.replaceAll("&amp;","&")
	
	return str
}

//复合翻译引擎
qqq_translate=async function (engine){
	var old=$(".qqq_menu .old").html()

	old=qqq_translate_form_path(old)

	var json=await translate(old,engine).catch((e) => {})
	if(!json){alert("接口报空,请检查token")}
	var str=json.data.target

	//修正返回内容
	str=qqq_translate_patch(str)
	
	//console.log(str)

	qqq_translate_set(str)

}

//腾讯交互翻译
qqq_translate_tts=async function (is_filt){
	var old=$(".qqq_menu .old").html()

	if( is_filt ){
		old=old.replaceAll('{}'," ")
	}

	old=qqq_translate_form_path(old)

	var str=await translate_tts(old).catch((e) => {})
	if(!str){alert("接口挂了(悲")}


	//修正返回内容
	str=qqq_translate_patch(str)
	
	//console.log(str)

	qqq_translate_set(str)

}

//谷歌转发翻译
qqq_translate_googleR=async function(is_filt){
	var old=$(".qqq_menu .old").html()

	if( is_filt ){
		old=old.replaceAll('{}'," ")
	}

	old=qqq_translate_form_path(old)


	$.post("http://127.0.0.1:1182",{t:old},function(data){
		data=JSON.parse(data)
		if (data.state!="ok") return 0
		str=data.translate
		str=qqq_translate_patch(str)
		qqq_translate_set(str)
	});
}

qqq_caiyun=async function (){

		var str=await caiyun($(".qqq_menu .old").html()).catch((e) => {})
		if(!str){alert("接口报空,请检查token")}
		//console.log(str)
		qqq_translate_set(str)

}

qqq_hight_light=function(){
	var reg=new RegExp('\{\}','g')
	var rs="<b class='score' style='color:red;'>{}</b>"
	var left=$(".qqq_menu .old").html()
	var right=$(".qqq_menu .new").html()
	
	var lc=left.split("{}").length-1 //左得分
	var rc=right.split("{}").length-1 //右得分

	var score="( "+lc+":"+rc+" )"//分数文本

	//替换标签
	left=left.replace(reg,rs)
	right=right.replace(reg,rs)

	//缓存显示字符串
	left_show=left
	right_show=right

	//增加序号
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

		tmp=left_show.replace("{"+i+"}",rs)
		if(tmp===left_show){
			left_show=left_show.replace('{}',"{<span>"+i+"</span>}")
		}else{
			left_show=tmp
		}

		tmp=right_show.replace("{"+i+"}",rs)
		if(tmp===right_show){
			right_show=right_show.replace('{}',"{<span>"+i+"</span>}")
		}else{
			right_show=tmp
		}


	}

	//显示在显示层
	$(".old_show").html(left_show)
	$(".new_show").html(right_show)

	//显示在编辑层
	$(".hl_old").html(left)
	$(".hl_new").html(right)

	var score="( "+lc+":"+rc+" )"
	$(".qqq span.num").html(score)

	//滚动条沉底
	var layer_div = $(".layui-layer-content");
	layer_div.animate({ scrollTop: layer_div.prop("scrollHeight") - layer_div.height() }, 0);
}

qqq_onekey_copy=function() {
	var right = $(".qqq_menu .new").html();
	navigator.clipboard.writeText(right);
}

qqq_onekey_paste=function() {
	navigator.clipboard.readText().then(
		translated_text => {
			$(".qqq_menu .new").html(translated_text);
			qqq_hight_light();
		}
	);
}

qqq_add_space_by_pangujs=function() {
	var right = $(".qqq_menu .new").html();
	var pangu1 = pangu.spacing(right);
	$(".qqq_menu .new").html(pangu1);
	// console.log(pangu1);
	qqq_hight_light();
}

qqq_clean_space=function() {
	var right = $(".qqq_menu .new").html();
	$(".qqq_menu .new").html(right.replace(/\s*/g,""));
	qqq_hight_light();
}

qqq_toUpper=function() {
	var right = $(".qqq_menu .new").html().toUpperCase();
	$(".qqq_menu .new").html(right);
	qqq_hight_light();
}

qqq_toLower=function() {
	var right = $(".qqq_menu .new").html().toLowerCase();
	$(".qqq_menu .new").html(right);
	qqq_hight_light();
}

qqq_clean_semicolon=function() {
	var right = $(".qqq_menu .new").html();
	$(".qqq_menu .new").html(right.replace(/[\uff1b\u003b]/g,"")
								.replace(/[\u201C\u201D]/g,"\"")
								.replace(/[\uff5b]/g,"\{")
								.replace(/[\uff5d]/g,"\}"));
	qqq_hight_light();
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

html=`<div class="hide">

<div class="qqq qqq_menu">
		form(save file)
		<textarea class="input form"contenteditable="true"></textarea>
	<hr>
		key(struct key)<textarea class="input key"contenteditable="true"></textarea>
	<hr>
	<div class="qqq qqq_hightlight layui-row">
		<div class="hl_old layui-col-md6">123</div>
		<div class="hl_new layui-col-md6">132</div>
	</div>
	<hr>
	<div class="layui-row">

		<div class="layui-row">
			<div class="layui-col-md6">
				old(content)
				<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate_tts()>腾讯交互(带标签)</button>
				<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate_tts(1)>腾讯交互(去标签)</button>
				<br>
				<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate_googleR()>谷歌翻译(转发)</button>
				<button class="layui-btn  layui-btn-primary layui-btn-xs" onclick=qqq_translate_googleR(1)>谷歌翻译(去标签转发)</button>
			</div>

			<div class="layui-col-md6">
				new(translate)<span class="num"></span>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_hight_light()>hightlight</button>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_onekey_copy()>复制原文</button>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_onekey_paste()>粘贴译文</button>
				<br>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_add_space_by_pangujs()>添加空格</button>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_clean_space()>删除空格</button>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_toUpper()>全大写</button>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_toLower()>全小写</button>
				<button class="layui-btn  layui-btn-xs" onclick=qqq_clean_semicolon()>去多余分号</button>
			</div>

		</div>
		
		<div class="layui-col-md6 lr_col">
			<div class="lr input old_show" contenteditable="plaintext-only"></div>
			<div oninput="qqq_hight_light()" class="lr input old" contenteditable="plaintext-only"></div>
		</div>

		<div class="layui-col-md6 lr_col">
			<div class="lr input new_show" contenteditable="plaintext-only"></div>
			<div oninput="qqq_hight_light()" class="lr input new" contenteditable="plaintext-only"></div>
		</div>


	</div>
	<button class="layui-btn layui-btn-lg layui-btn-fluid" onclick=qqq_ok()>Ok!</button>

</div>


</div>`
$("body").after(html)

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//"global_toc"

///将元素翻译
add_translate=async function(ele,file,attr){

	//确定来源文件路径
	var form=group+"/"+file+".json"

	if(!attr){
		//跳过已翻译
		if (ele.hasClass("isTranslate"))return 0
		var html=ele.html()
	}else{
		if (ele.hasClass("isTranslateAttr"))return 0
		var html=ele.attr(attr)
		//console.log(attr)
	}

	//标签预处理成{}
	var key=removeHtml(html)

	//读取字典
	var val=await L(form,key)

	//字典长度0那也不用翻译了
	if (!val.length)return null

	//在翻译上还原标签
	var f=retHtml(html)
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

	//如果指定了attr元素那么说明翻译attr指定内容
	if(!attr){
		//备份html内容并添加已翻译标签
		ele.addClass("isTranslate")
		ele.attr("bak",html)
		ele.html(val)
	}else{
		//备份属性内容并添加已翻译标签
		ele.addClass("isTranslateAttr")
		ele.attr("bakAttrHtml",html)
		ele.attr("bakAttr",attr)
		ele.attr(attr,val)
	}

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
		var old=removeHtml(str,true)//额外处理{} => { }
		
		//console.log({key:key,str:str})

		$(".qqq_menu .key").val(key)
		$(".qqq_menu .old").html(old)
		var ele=$(".qqq_menu .new")
		ele.html(key)

		//如果使用异步函数,会无法阻止冒泡
		L(form,key).then((result,v=ele)=>{
			if (result.length)v.html(result)
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
	
	//页内插入css
	iframe.find("head:not('.isImport')").append(cssHtml).addClass("isImport")

	//这么做只是为了方便移植修改
	const css1="div.footer a,h4,caption,blockquote"
	const css2="p,h1,h2,h3,td,li,a,div.dropspotnote,figcaption,.expandtext"
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

	//翻译术语表
	$(".GlossDefinitionText").each(function(){
		const file="global"
		add_translate($(this),file)
		add_event($(this),file)
	})
	iframe.find(".tooltip").each(function(){
		const file="global"
		add_translate($(this),file,"title")
	})
	
},300)

