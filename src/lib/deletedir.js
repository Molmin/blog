const {existsSync, readdirSync, statSync,
    unlinkSync, rmdirSync}=require('fs');
const path=require('path');

var deletedir=(url)=>{
    if(existsSync(url)){
        var files=[];
        files=readdirSync(url);
        files.forEach(file=>{
            var curPath=path.join(url,file);
            if(statSync(curPath).isDirectory())
                deletedir(curPath);
            else unlinkSync(curPath);
        });
        rmdirSync(url);
    }
};

module.exports=deletedir;