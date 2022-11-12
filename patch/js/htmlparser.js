let sign_enum = {
	SIGN_END: "SIGN_END",           // 结束标签读取 如 </xxxxx>
	SIGN_END_OK: "SIGN_EN_OK",      // 结束标签读取完成
	SIGN_START: "SIGN_START",       // 开始标签读取 如 <xxxxx>
	SIGN_START_OK: "SIGN_START_OK", // 开始标签读取完成 
  };
 htmlStrParser=function(htmlStr) {
	const str = htmlStr.replace(/\n/g, "");
	let result = { nodeName: "root", children: [] };
  // 默认 result.children[0]插入, ，这里记录调试用的栈信息
	let use_line = [0];               
	let current_index = 0;            // 记录当前插入children的下标
	let node = result;                // 当前操作的节点
	let sign = "";                    // 标记标签字符串（可能包含属性字符）、文本信息
	let status = "";                  // 当前状态，为空的时候我们认为是在读取当前节点（node）的文本信息
	for (var i = 0; i < str.length; i++) {
	  var current = str.charAt(i);
	  var next = str.charAt(i + 1);
	  if (current === "<") {
		// 在开始标签完成后记录文本信息到当前节点
		if (sign && status === sign_enum.SIGN_START_OK) {
		  node.text = sign;
		  sign = "";
		}
		// 根据“</”来区分是 结束标签的（</xxx>）读取中  还是开始的标签(<xxx>) 读取中
		if (next === "/") {
		  status = sign_enum.SIGN_END;
		} else {
		  status = sign_enum.SIGN_START;
		}
	  } else if (current === ">") {
		// (<xxx>) 读取中，遇到“>”， (<xxx>) 读取中完成
		if (status === sign_enum.SIGN_START) {
		  // 记录当前node所在的位置，并更改node
		  node = result;
		  use_line.map((_, index) => {
			if (!node.children) node.children = [];
			if (index === use_line.length - 1) {
			  sign = sign.replace(/^\s*/g, "").replace(/\"/g, "");
			  let mark = sign.match(/^[a-zA-Z0-9]*\s*/)[0].replace(/\s/g, ""); // 记录标签
			  // 标签上定义的属性获取
			  let attributeStr = sign.replace(mark, '').replace(/\s+/g, ",").split(",");
			  let attrbuteObj = {};
			  let style = {};
			  attributeStr.map(attr => {
				if (attr) {
				  let value = attr.split("=")[1];
				  let key = attr.split("=")[0];
				  if (key === "style") {
					value.split(";").map(s => {
					  if (s) {
						style[s.split(":")[0]] = s.split(":")[1]
					  }
					})
					return attrbuteObj[key] = style;
				  }
				  attrbuteObj[key] = value;
				}
			  })
			  node.children.push({ nodeName: mark, children: [], ...attrbuteObj })
			}
			current_index = node.children.length - 1;
			node = node.children[current_index];
		  });
		  use_line.push(current_index);
		  sign = "";
		  status = sign_enum.SIGN_START_OK;
		}
		// (</xxx>) 读取中，遇到“>”， (</xxx>) 读取中完成
		if (status === sign_enum.SIGN_END) {
		  use_line.pop();
		  node = result;
		  // 重新寻找操作的node
		  use_line.map((i) => {
			node = node.children[i];
		  });
		  sign = "";
		  status = sign_enum.SIGN_END_OK;
		}
	  } else {
		sign = sign + current;
	  }
	}
	return result;
  }

 htmlObjParser=function(obj) {
	let htmlStr = "";
	function work(obj) {
	  const children = obj.children;
	  let attrStr = "";
	  Object.keys(obj).map(key => {
		if (key !== 'nodeName' && key !== 'text' && key !== "children") {
		  if (key !== 'style') {
			attrStr += ` ${key}=${obj[key]}`
		  } else if (key === 'style') {
			let styleStr = '';
			Object.keys(obj[key]).map(k => {
			  styleStr += ` ${k}:${obj[key][k]};`
			})
			attrStr += styleStr;
		  }
		}
	  })
	  htmlStr += `<${obj.nodeName}${attrStr}>${obj.text ? obj.text : ''}`;
	  if (children && children.length) {
		children.map(c => {
		  work(c)
		});
	  }
	  htmlStr += `</${obj.nodeName}>`;
	}
	work(obj);
	return htmlStr;
}
