"use strict";
const fs = require("fs");
const glob = require("glob");
const readline = require("readline");
const jsbeautify = require("js-beautify").js;

let export_directory_toc = "../build/whxdata/"
let manual_directory_toc = "../GMS2-Robohelp-en/whxdata/"
let locale_name = require("../setting.json")
let json_global = require("../language/" + locale_name.group + "/global.json")

let regex = new RegExp("var toc \\= \\[\\{", "g")

glob(manual_directory_toc + "toc*.new.js", {}, (err, files) => {
    for (let index = 0; index < files.length; index++) {
        // 格式化所有目录文件
        let toc_original = fs.readFileSync(files[index]).toString();
        let toc_beautify = jsbeautify(toc_original, { indent_size: 4, space_in_empty_paren: true })
        fs.writeFileSync(files[index], toc_beautify)

        // 逐行读取内容
        let toc_stream_read = fs.createReadStream(files[index])
        let toc_filename = export_directory_toc + files[index].substring(28, files[index].length - 3)
        let toc_write_json = toc_filename + ".json"
        let rl = readline.createInterface({
            input: toc_stream_read
        });
        
        rl.on('line', (line) => {
            // 古典方法删除不需要的行，足够无脑但真有用
            switch (line.trim()) {
                case "(function() {":
                    return "";
        
                case "window.rh.model.publish(rh.consts('KEY_TEMP_DATA'), toc, {":
                    return "";
        
                case "sync: true":
                    return "";
        
                case "});":
                    return "";
        
                case "})();":
                    return "";
            }
            // 保存处理过后的内容，且保存为JSON
            fs.appendFileSync(toc_write_json, line.replace(regex, "[{").replace("}];", "}]"))
        })
        rl.on("close", ()=>{
            if (fs.existsSync(toc_write_json)) {
                let toc_json = require(toc_write_json)
                for (let j = 0; j < toc_json.length; j++) {
                    // 匹配到转义字符
                    if (json_global[toc_json[j].name.replace("&", "&amp;")]) {
                        if (toc_json[j].name !== json_global[toc_json[j].name.replace("&", "&amp;")]) {
                            toc_json[j].name = json_global[toc_json[j].name.replace("&", "&amp;")].replace("&amp;", "&")
                        }
                    }
                }
                fs.writeFileSync(toc_write_json, JSON.stringify(toc_json, null, "\t"))
    
                let toc_json_translated = require(toc_write_json)
                let toc_write_js = toc_filename + ".js"
                let toc_js_template = `
                (function() {
                    var toc = ${JSON.stringify(toc_json_translated)};
                    window.rh.model.publish(rh.consts('KEY_TEMP_DATA'), toc, {
                        sync: true
                    });
                })();
                `
                fs.writeFileSync(toc_write_js, toc_js_template)
            }
        })
    }
})

glob(export_directory_toc + "toc*.new.json", {}, (err, files)=>{
    if (err) {
        console.log(err)
    } else {
        for (let index = 0; index < files.length; index++) {
            if (fs.existsSync(files[index])) {
                fs.rmSync(files[index])
            }
        }
    }
})