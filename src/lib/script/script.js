const {isEmpty} = require("structkit");

argCleanup = function(content) {

    content=content.replace(/(\;)$/g,"")
    return content;
}


exports.ESMgetScrtiptDetails = function(content){
    
    let data = {};
    data['export']  =[];
    data['import']  =[];
    //console.log("-----",content,"-----") // [\'\"]{0,}[\-\_\.\,\\\/\w]{1,}[\'\"]{0,}
    content.replace(/([\/\*\=]{0,})import\s{1,}([\{]{0,}[\w\s,]{0,}[\}]{0,})\s{1,}from\s{1,}([\'\"]{0,}[\-\_\.\,\\\/\w]{1,}[\'\"]{0,})[\;]{0,}[\n]{0,}/g,function(wholeString,isComment,functionArg,functionSource,importError){ 

        if (isEmpty(isComment) ){
                    const argCleanupArgument = argCleanup(functionArg);
                    data['import'].push( {
                        "isDefault":!/^\{/g.test(argCleanupArgument),
                        "arguments":argCleanupArgument,
                        "source":argCleanup(functionSource).replace(/([\'\"]{0,})/g,""),
                        "raw":argCleanup(wholeString)
                    } );

            }    
       
        });

    content.replace(/([\/\*\=]{0,})(export\s{1,}const|export\s{1,}default|export\s{0,})\s{1,}([\{]{0,}[\-\_\.\,\\\/\;\w]{1,}[\}]{0,}\;{0,})/g,function(wholeString,isComment,functionArg,functionSource,importError){ 

        if (isEmpty(isComment) ){
  
                data['export'].push( {
                    "isDefault":/\b(export\s{1,}default)\b/g.test(functionArg),
                    "arguments":argCleanup(functionSource),
                    "source":argCleanup(functionSource),
                    "raw":argCleanup(wholeString)
                });
     
        }
    })

   return data;
}

exports.CJSgetScrtiptDetails = function(content){

    let data = {};
    data['export']  =[];
    data['import']  =[];

    content.replace(/([\/\*]{0,})(const|var|let)(\s{0,}[\{]{0,}[\w\s,]{0,}[\}]{0,})\s{0,}=\s{0,}require\s{0,}\(\s{0,}[\'\"]{0,}([\-\_\.\,\\\/\w]{1,})[\'\"\;]{0,}\s{0,}\)\;{0,}/g,function(wholeString,isComment,variableType,functionArg,functionSource,importError){ 

        if (isEmpty(isComment) ){
           const argCleanupArgument = functionArg.replace(/\b([\n\t\s]{0,}(const|var|let)[\n\t\s]{1,})/g,"").trim()
           const wholeStringReplace = wholeString.replace(/[\n]/g,"").replace(/\{/g,"").trim()
            data['import'].push( {
                "isDefault":!/^\{/g.test(argCleanupArgument),
                "arguments":argCleanupArgument,
                "source":functionSource,
                "raw":wholeString
            });

        }   
        
    });

    const contentNewLine = content.split(/\n/g);
    contentNewLine.forEach(element => {
        
        element.replace(/([\/\*]{0,})(module.exports|exports\.[\w\s,]{0,})\s{0,}=\s{0,}/g,function(wholeString,isComment,functionArg,functionSource,importError){ 

            if (isEmpty(isComment) ){
                const contentSplit = element.split("=")
                const argStrip = contentSplit[0].replace(/^([\n\t\s]{0,}(const|var|let)[\n\t\s]{1,})/g,"").trim()
                data['export'].push( {
                    "isDefault":argStrip==="module.exports",
                   "arguments":argStrip,
                   "source":contentSplit[1],
                    "raw":element
               });
    
            }   
            
        });

    });
    return data;
}

