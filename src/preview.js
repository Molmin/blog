const express=require('express'),
      router=express.Router();
const ejs=require('ejs');
const fs=require('fs');
const Template=require('./template.js');
var System=JSON.parse(fs.readFileSync('./data/system.json'));
const highlightjs=require('highlight.js');
const fileSize=require('./lib/filesize.js');
var MarkdownIt=require('./lib/markdown.js');
const Type=require('./lib/type.js');

router.get('/',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    var blogList=fs.readFileSync('data/blog.json','utf8');
    blogList=JSON.parse(blogList);
    ejs.renderFile("./src/templates/blog_list.html",
        {isadmin: req.logined, fs, blogList, System, MarkdownIt, types: Type()},(err,HTML)=>{
        res.send(Template({title: `文章列表`,
                           header: ``,
                           preview: true,
                           isadmin: req.logined
                          },HTML));
    });
});
router.get('/about',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    ejs.renderFile("./src/templates/about.html",
        {html: MarkdownIt.render(fs.readFileSync('data/readme.md','utf8'))},
    (err,HTML)=>{
        res.send(Template({title: `关于`,
                           header: ``,
                           preview: true,
                           isadmin: req.logined,
                           onabout: true
                          },HTML));
    });
});

router.get('/:blogId',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    if(fs.existsSync(`data/${req.params.blogId}/config.json`)){
        var blogConfig=JSON.parse(fs.readFileSync(`data/${req.params.blogId}/config.json`));
        blogConfig.blogId=req.params.blogId;
        ejs.renderFile("./src/templates/blog_detail.html",
            {isadmin: req.logined, fs, blogConfig, System, MarkdownIt, types: Type()},(err,HTML)=>{
            res.send(Template({title: `${blogConfig.title}`,
                               header: ``,
                               preview: true,
                               isadmin: req.logined
                              },HTML));
        });
    }
    else res.sendStatus(404);
});
router.get('/:blogId/file/:fileName',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    if(fs.existsSync(`data/${req.params.blogId}/${req.params.fileName}`))
        res.sendFile(`data/${req.params.blogId}/${req.params.fileName}`,{root: process.cwd()},err=>{});
    else res.sendStatus(404);
});

module.exports=router;