require('gh-pages').publish('dist',{
    branch: 'gh-pages',
    repo: 'git@github.com:Molmin/blog.git'
},err=>{
    if(err){
        console.log(`failed to update github page: ${err}`);
    }
    else{
        console.log(`updated github page`);
    }
});