module.exports=()=>{

const fs=require('fs');
const path=require('path');
const ejs=require('ejs');
const Template=require('./../template.js');
const highlightjs=require('highlight.js');
var System=JSON.parse(fs.readFileSync('./data/system.json'));
var MarkdownIt=require('./../lib/markdown.js');

var deleteDir=require('./../lib/deletedir.js');

deleteDir("dist");
fs.mkdirSync("dist");
fs.mkdirSync("dist/pub");
fs.copyFileSync("src/assets/public/main.js","dist/pub/main.js");
fs.copyFileSync("src/assets/public/main.css","dist/pub/main.css");
fs.copyFileSync("src/assets/public/busuanzi.pure.mini.js","dist/pub/busuanzi.pure.mini.js");
fs.copyFileSync("src/assets/public/FiraCode-Regular.ttf","dist/pub/FiraCode-Regular.ttf");
fs.copyFileSync("src/assets/public/LXGWWenKai-Bold.ttf","dist/pub/LXGWWenKai-Bold.ttf");
fs.copyFileSync("src/assets/public/noto-serif-sc-chinese-simplified-400-normal.ttf","dist/pub/noto-serif-sc-chinese-simplified-400-normal.ttf");

var blogList=fs.readFileSync('data/blog.json','utf8');
blogList=JSON.parse(blogList);

ejs.renderFile("./src/templates/blog_list.html",
    {isadmin: false, fs, blogList, System, MarkdownIt},(err,HTML)=>{
    fs.writeFileSync("dist/index.html",
        Template({title: `文章列表`,
                header: ``},HTML)
    );
});

ejs.renderFile(
    "./src/templates/about.html",
    {html: MarkdownIt.render(fs.readFileSync('data/readme.md','utf8'))},
    (err,HTML)=>{
        fs.writeFileSync("dist/about.html",
            Template({title: `关于`,
                      header: ``,
                      onabout: true
                     },HTML)
        );
    }
);

}