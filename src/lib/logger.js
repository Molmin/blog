const {readFileSync, writeFileSync, existsSync} = require('fs');

var log=(req,message)=>{
    var logs;
    if(existsSync('data/system.log'))
        logs=readFileSync("data/system.log",'utf8');
    else logs=``;
    logs+=`${message}\n`;
    writeFileSync('data/system.log',logs);
};

var list=()=>{
    var logs=readFileSync("data/system.log",'utf8');
    return logs.split('\n').slice(-100).join('\n');
};

module.exports={log, list};