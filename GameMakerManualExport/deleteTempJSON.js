"use strict";
const fs = require("fs");
const glob = require("glob");

let export_directory_toc = "../build/whxdata/"

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
});