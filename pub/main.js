$(document).ready(()=>{
    var idlist=new Array();
    for(var i=0;i<100;i++){
        if($(`.language-input${i}`).length>=2 && $(`.language-output${i}`).length>=2){
            var sampleId=i+100;
            for(var j=0;j<$(`.language-input${i}`).length
                && j<$(`.language-output${i}`).length;j++,sampleId+=100)
                idlist.push(sampleId);
            sampleId=i;
            $(`.language-input${i}`).each(function(){
                sampleId+=100;
                $(this).addClass(`language-input${sampleId}`);
            });
            sampleId=i;
            $(`.language-output${i}`).each(function(){
                sampleId+=100;
                $(this).addClass(`language-output${sampleId}`);
            });
        }
        else if($(`.language-input${i}`).length>=1 && $(`.language-output${i}`).length>=1)
            idlist.push(i);
    }

    for(var i=0;i<idlist.length;i++){
        var id=idlist[i],sampleId=id%100;
        $(`.language-input${id}`).parent().before(`<div class="row problem-sample${id}"></div>`);
        var rowElement=$(`.problem-sample${id}`);
        rowElement.append(`<div class="column-one-second"><div style="padding-right: 10px;" class="problem-sample${id}-input"><h2>样例输入 ${sampleId}</h2></div></div><div class="column-one-second"><div style="padding-left: 10px;" class="problem-sample${id}-output"><h2>样例输出 ${sampleId}</h2></div></div>`);
        $(`.language-input${id}`) .parent().insertAfter(`.problem-sample${id}-input>h2`);
        $(`.language-output${id}`).parent().insertAfter(`.problem-sample${id}-output>h2`);
    }
});