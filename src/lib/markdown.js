var MarkdownIt=require('markdown-it')({
    html: true,
    linkify: true,
});
MarkdownIt.use(require('markdown-it-katex'));
MarkdownIt.use(require('markdown-it-imsize'));
MarkdownIt.use(require('markdown-it-footnote'));
MarkdownIt.use(require('markdown-it-highlightjs'),{inline: true});

MarkdownIt.use(require('markdown-it-container'),'warning',{
    validate: (params)=>
        params.includes('note')||
        params.includes('warning')||
        params.includes('tip'),
    render: (tokens,idx)=>{
        if(tokens[idx].nesting===1)
            return `<blockquote class="topan-blockquote-${tokens[idx].info.substr(1)}">\n`;
        else return '</blockquote>\n';
    }
});

module.exports=MarkdownIt;