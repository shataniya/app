import fs from 'fs'
// 将txt文本转化成数组
function getText(__url){
    var text = fs.readFileSync(__url)
    return text.toString().split('\n')
}
// 生成字典
function createDic(dicArr){
    if(!Array.isArray(dicArr)){
        throw new Error('is not Array')
    }
    // 初始化字典树
    var dic = {}
    for(let i=0, len=dicArr.length; i<len; i++){
        dic = deep(dicArr[i], dic)
    }
    return dic
}

function deep(str, target){
    if(!target){
        target = {}
    }
    var __init = target
    for(let i=0, len=str.length; i<len; i++){
        // 判断有没有这个字
        if(!__init[str[i]]){
            // 说明没有这个字, 就要创建
            __init = __init[str[i]] = {}
        }else{
            // 说明已经存在了这个字
            __init = __init[str[i]]
        }
    }
    return target
}

// 根据文件的路径获取文件信息并生成字典树
function createDicByUrl(__url){
    var dicArr = getText(__url)
    return createDic(dicArr)
}



// 对敏感词汇进行检索
function checkSensitive(str, __url){
    if(typeof str !== 'string'){
        throw new Error('str is not string!')
    }
    var dic = null
    if(Array.isArray(__url)){
        dic = createDic(__url)
    }
    if(typeof __url === 'string'){
        dic = createDicByUrl(__url)
    }
    var __init = dic
    // 用来接收符合敏感条件的字，然后统计字数，敏感数组
    var arr = []
    for(let i=0,len=str.length; i<len; i++){
        // 判断这个字在字典树里面熟不熟存在
        var cen = __init[str[i]]
        if(cen){
            // 说明这个字已经存在
            arr.push(str[i]) // 就将这个字保存在 敏感数组里边
            if(Object.keys(cen).length){
                // 看看有没有属性，有属性说明不是最后一个字
                __init = cen
            }else{
                // 没有属性说明是最后一个字
                break
            }
        }else{
            // 一旦没有符合的那就初始化
            arr = []
            __init = dic
        }
    }
    // 实际上在这里就可以判断了，一旦敏感数组的长度大于2，那么就说明含有敏感词汇
    var origin = str
    var hasSensitive = null
    var sensitive_word = ''
    var origin_filter = origin
    if(arr.length >= 2){
        // console.log('含有敏感词汇')
        hasSensitive = true
        sensitive_word = arr.join('')
        origin_filter = origin.replace(sensitive_word, '*'.repeat(sensitive_word.length))
    }else{
        // console.log('没有敏感词汇')
        hasSensitive = false
    }
    return { origin, sensitive_word, origin_filter, hasSensitive }
}

export default checkSensitive