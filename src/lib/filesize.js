var getwithness=(x)=>parseInt(x*100)/100;

module.exports=(size)=>{
    if(size>1024*1024*1024)return `${getwithness(size/1024/1024/1024)} GiB`;
    if(size>1024*1024)return `${getwithness(size/1024/1024)} MiB`;
    if(size>1024)return `${getwithness(size/1024)} KiB`;
    return `${getwithness(size)} Bytes`;
};