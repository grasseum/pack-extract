const {CJSgetScrtiptDetails,ESMgetScrtiptDetails} = require('./lib/script/script');
const {getCommentCode} = require('./lib/script/comment');

exports.script = function( content){
    const cjs = CJSgetScrtiptDetails(content);
    const esm = ESMgetScrtiptDetails(content);

    return {
        cjs,
        esm
    }
}

exports.scriptComment = function( content){
    const comment = getCommentCode(content);

    return comment;
}
