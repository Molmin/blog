const express=require('express'),
      app=express();
const fs=require('fs');
const path=require('path');
const cors=require('cors');
app.use(cors());
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const cookieParser=require('cookie-parser');
app.use(cookieParser());
var System=JSON.parse(fs.readFileSync('./data/system.json'));
const Admin=require('./src/lib/admin.js');

var password=parseInt(Math.random()*1000000);
if(System.password)password=System.password;
else console.log(`Password is: ${password}`);
fs.writeFileSync("password",`${password}`,(err)=>{});

app.all('*',(req,res,next)=>{
    if(Admin.checkloginByReq(req))
        req.logined=true;
    else
        res.cookie('blog-cookie',''),
        req.logined=false;
    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Methods','GET');
    res.set('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
    if ('OPTIONS'==req.method)return res.send(200);
    next();
});

app.get("/",(req,res)=>{
    res.redirect(`/${System.on}`);
});
app.use("/file",express.static(path.join(__dirname,'src/assets')));
app.use(`/${System.on}/pub`,express.static(path.join(__dirname,'src/assets/public')));
app.use(`/${System.on}`,require('./src/preview.js'));
app.use(`/admin`,require('./src/admin.js'));

app.listen(System.port,()=>{
    console.log(`Port :${System.port} is opened`);
});