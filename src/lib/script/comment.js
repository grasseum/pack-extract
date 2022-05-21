const {delimiter,first,each,clone,has} = require("structkit");


function assingVariable(dataValueReplace){
    
    if (isHeader) {
        
        argObject["comment"] += dataValueReplace

    }
    if (!isHeader) {
        
        const replaceContent = dataValueReplace.replace(/^(@[a-zA-Z0-9]{1,}\s{0,})/g,function(s1,s2,s3){
            
            argObject["parameter"].push({
                name:"",
                value:"",
                comment:"",
                arguments:""
            });
            const replParam = s1.replace(/[\@]/g,"").trim()
        
            argObject["parameter"][argObject["parameter"].length-1].name = replParam;
          
            return ""
        })
        const replaceContent1 = replaceContent.replace(/([\{]{1,}[\s]{0,}[a-zA-Z0-9,\|\[\]\=\?]{1,}[\s]{0,}[\}]{1,})\s/g,function(s1,s2,s3,ss){
            
            argObject["parameter"][argObject["parameter"].length-1].value = s1.replace(/[\{\}]/g,"").trim();
            return ""
        })
      
        if (has(argObject["parameter"],argObject["parameter"].length-1)){

            const getArgParam =argObject["parameter"][argObject["parameter"].length-1].name;

            if (getArgParam ==="param"){
                const getArgParamReplace =  replaceContent1.trim().split(/\s/)
                argObject["parameter"][argObject["parameter"].length-1].arguments = first(getArgParamReplace);
                argObject["parameter"][argObject["parameter"].length-1].comment += delimiter(getArgParamReplace,1).join(" ");

            }else{
                argObject["parameter"][argObject["parameter"].length-1].comment += replaceContent1.trim();
            }
            
        }
        
    }
    if (/^[\@]{1}[\s]{0,}/g.test(dataValueReplace) ===false && isHeader){
        isHeader =false
    } 
}
let isHeader = true;
let argObject = {};
let keyName = "";
let valueName = "";
let commentName = "";

const commentArgument = function(content){
    const newLine = content.split(/\n/);
    
    isHeader = true;

    argObject = {};
    argObject["comment"] = ""
    argObject["parameter"] = []

    keyName = "";
    valueName = "";
    commentName = "";

    each(newLine,function(key,value){

        const dataValue =value.trim();
        if (/^[\/]{2,}[\s]{0,}/g.test(dataValue)){

            const dataValueReplace = dataValue.trim().replace(/^([\/]{2,})/,"").trim();
           
            assingVariable(dataValueReplace);

        }
        if (/^[\*]{1,}[\s]{0,}/g.test(dataValue)){

            const dataValueReplace = dataValue.trim().replace(/^([\*]{1,})/,"").trim();
            
            assingVariable(dataValueReplace);
           
        }

    });

    return argObject;
}


exports.getCommentCode = function(content){

    const newLine = content.split(/\n/g);
    let isCommentOpen =false;
    const arryList =[];
    let arrySubList =[];

    
    each(newLine,function(key,value){

        const dataValue =value.trim();

        if(isCommentOpen){

            arrySubList.push(dataValue);
        }
        if (/\/[\s]{0,}[\*]{1,}/g.test(dataValue)){
            arrySubList.push(dataValue);
            isCommentOpen = true;
        }
        if (/[\*]{1,}[\s]{0,}\//g.test(dataValue)){
            isCommentOpen = false;
            const cloneData = clone(arrySubList).join("\n");
            arryList.push({
                content: cloneData,
                arguments: commentArgument(cloneData)
            })
            arrySubList=[];
        }
        if (/^[\/]{2,}[\s]{0,}/g.test(dataValue)){
            arryList.push({
                content: dataValue,
                arguments: commentArgument(cloneData)
            })
        }
    });
    return arryList;

}