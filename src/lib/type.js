const fs=require('fs');
module.exports=()=>JSON.parse(fs.readFileSync('data/types.json','utf8'));