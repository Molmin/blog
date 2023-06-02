const express=require('express'),
      router=express.Router();
const ejs=require('ejs');
const fs=require('fs');
const Template=require('./template.js');
var System=JSON.parse(fs.readFileSync('./data/system.json'));
const Type=require('./lib/type.js');
const Admin=require('./lib/admin.js');
const URL=require('url');
const deletedir=require('./lib/deletedir.js');
const logger=require('./lib/logger.js');

router.all('*',(req,res,next)=>{
    if(req._parsedUrl.pathname.startsWith('/login')||Admin.checkloginByReq(req))next();
    else return res.redirect('/admin/login');
});

router.get('/',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    ejs.renderFile("./src/templates/dashboard.html",{logs: logger.list(), System},(err,HTML)=>{
        res.send(Template({title: `仪表盘`,
                           header: ``,
                           preview: true,
                           onadmin: true,
                           isadmin: req.logined
                          },HTML));
    });
});
router.post('/update/db',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    require('child_process').spawnSync('rm',['-rf','node_modules/gh-pages/.cache']);
    require('child_process').spawnSync('rm',['-rf','node_modules/.cache/gh-pages']);
    require('gh-pages').publish('data',{
        branch: System.repository.db.branch,
        message: req.body.message,
        repo: System.repository.db.repo
    },err=>{
        if(err){
            res.status(200).json({error: err.message});
            logger.log(req,`failed to update database to github: ${err}`);
        }
        else{
            res.status(200).json({message: "同步成功。"});
            logger.log(req,`updated database to github`);
        }
    });
});
router.post('/update/ghpage',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    require('./build/main.js')();
    setTimeout(()=>{
        require('child_process').spawnSync('rm',['-rf','node_modules/gh-pages/.cache']);
        require('child_process').spawnSync('rm',['-rf','node_modules/.cache/gh-pages']);
        require('gh-pages').publish('dist',{
            branch: System.repository.ghpage.branch,
            message: req.body.message,
            repo: System.repository.ghpage.repo
        },err=>{
            if(err){
                res.status(200).json({error: err.message});
                logger.log(req,`failed to update github page: ${err}`);
            }
            else{
                res.status(200).json({message: "同步成功。"});
                logger.log(req,`updated github page`);
            }
        });
    },1000);
});

router.get('/settings',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    ejs.renderFile("./src/templates/settings.html",{System, fs},(err,HTML)=>{
        res.send(Template({title: `系统设置`,
                           header: ``,
                           preview: true,
                           onadmin: true,
                           isadmin: req.logined
                          },HTML));
    });
});

router.get('/login',(req,res)=>{
    System=JSON.parse(fs.readFileSync('./data/system.json'));
    if(req.logined){
        res.redirect("/");
        return;
    }
    ejs.renderFile("./src/templates/login.html",(err,HTML)=>{
        res.send(Template({title: `Login`,
                           header: ``,
                           preview: true,
                           onadmin: true,
                           isadmin: req.logined
                          },HTML));
    });
});
router.post('/login/try',(req,res)=>{
    if(req.logined){
        res.status(200).json({error: '已经登录成功。'});
        return;
    }
    if(Admin.checkloginByPassword(req.body.password)){
        res.cookie("blog-cookie",Admin.Encode(req.body.password),{maxAge: 1000*60*60*24});
        res.status(200).json({success: true});
    }
    else res.status(200).json({error: '密码错误。'})
});
router.get('/logout',(req,res)=>{
    if(req.logined){
        res.cookie("blog-cookie",'');
        if(!req.headers.referer)return res.redirect("/");
        var direct=URL.parse(req.headers.referer);
        if(direct.host!=req.headers.host)res.redirect("/");
        else res.redirect(direct.href);
    }
    else res.redirect('/');
});

router.get('/:blogId/edit',(req,res)=>{
    if(fs.existsSync(`data/${req.params.blogId}/config.json`)){
        System=JSON.parse(fs.readFileSync('./data/system.json'));
        var blogConfig=JSON.parse(fs.readFileSync(`data/${req.params.blogId}/config.json`));
        blogConfig.blogId=req.params.blogId;
        ejs.renderFile("./src/templates/blog_edit.html",{System, fs, blogConfig, types: Type()},(err,HTML)=>{
            res.send(Template({title: `编辑文章`,
                            header: ``,
                            preview: true,
                            onadmin: true,
                            isadmin: req.logined
                            },HTML));
        });
    }
    else res.sendStatus(404);
});

module.exports=router;