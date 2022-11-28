"use strict";
const cheerio = require("cheerio")
const glob = require("glob")
const fs = require("fs")

let regex = /(<([^>]+)>)/ig
let locale_name = require("../setting.json")
let translation_directory = "../language/" + locale_name.group + "/www/"
let manual_directory = "../GMS2-Robohelp-en/"
let export_directory = "../build/"
let patch_directory = "../patch/static_patch/"
let json_global = require("../language/" + locale_name.group + "/global.json");

function removeHtml(str) {
    return str.replace(regex, "{}");
}

function retHtml(str) {
    return str.match(regex);
}

function importTranslate(page, json) {
    let html = page.html()
    let key = removeHtml(html)
    let val = json[key]
    if (val !== undefined && val.length) {
        let f = retHtml(html)
        if (f) f.forEach((v, k) => {
            var tmp=val.replace("{"+i+"}",v)
            if(tmp===val){
                val=val.replace("{}",v)
            }else{
                val=tmp
            }
            i++
        })
        page.html(val)
    }
}

fs.cpSync(manual_directory, export_directory, {recursive: true})

// 从记忆库替换导入翻译
glob(manual_directory + '**/*.htm', {}, (err, files) => {
    if (err) {
        console.log("错误：" + err)
    } else {
        for (let index = 0; index < files.length; index++) {
            let filename = files[index].substring(20, files[index].length - 4)
            // console.log(filename)
            let $ = cheerio.load(fs.readFileSync(files[index]).toString())
            let json
            if(fs.existsSync(files[index]) && fs.existsSync(translation_directory + filename + ".json")){
                json = require(translation_directory + filename + ".json")
            } else {
                continue
            }
            $("p, h1, h2, h3, td, li, a").each(function(){
                importTranslate($(this), json)
            })
            $("h4, th, .warning, .important, .optional").each(function(){
                importTranslate($(this), json_global)
            })
            glob(patch_directory + "*.js", {}, (err, jsfile)=>{
                if (err) {
                    console.log(err)
                } else {
                    for (let index = 0; index < files.length; index++) {
                        let jsFilename = jsfile[index].substring(9)
                        let appendJS = '<script type="text/javascript" src="assets/static_patch/' + jsFilename + '}"/>'
                        $('head').append(appendJS)
                    }
                }
            })
            glob(patch_directory + "*.css", {}, (err, cssfile)=>{
                if (err) {
                    console.log(err)
                } else {
                    for (let index = 0; index < files.length; index++) {
                        let cssFilename = cssfile[index].substring(9)
                        let appendCSS = '<link rel="stylesheet" type="text/css" href="assets/static_patch/' + cssFilename + '}"/>'
                        $('head').append(appendCSS)
                    }
                }
            })
            fs.writeFile(export_directory + filename + ".htm", $.html(), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    }
})

fs.cpSync(patch_directory, export_directory + "assets/static_patch/", {recursive: true})

// 插入译者信息
let content = fs.readFileSync(export_directory + "Content.htm").toString()
let team_patch = fs.readFileSync("../patch/team.htm").toString()
let $ = cheerio.load(content)

$('p').eq(3).empty().addClass('team').append(team_patch)

fs.writeFileSync(export_directory + "Content.htm", $.html())