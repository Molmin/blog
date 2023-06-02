const crypto=require('crypto');
const fs=require('fs');
const encode=(str)=>{
    // second time
    const MD5=crypto.createHash('md5');
    const SHA256=crypto.createHash('sha256');
    var md5=MD5.update(str,'utf8').digest('hex');
    var sha256=SHA256.update(str,'utf8').digest('hex');
    return sha256.substr(0,32)+md5+sha256.substr(32);
};
const Encode=(str)=>{
    // first time
    return encode(`blog_${str}`);
}
const checkloginByReq=req=>req.headers.host.startsWith('localhost')||req.cookies['blog-cookie']
    &&req.cookies['blog-cookie']==Encode(fs.readFileSync('password','utf8'));
const checkloginByPassword=password=>password==fs.readFileSync('password','utf8');
module.exports={
    encode,
    Encode,
    checkloginByReq,
    checkloginByPassword
};