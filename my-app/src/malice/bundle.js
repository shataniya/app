const fs = require('fs')

/**
 * @function BuildDic 建立词典
 * @param {Array} arr 恶意词数组
 * @returns {Object} 生成的恶意词典
 */
function BuildDic(arr){
    var initdic = {}
    for(let i=0,len=arr.length;i<len;i++){
        var dic = initdic
        for(let j=0,current=arr[i],_len=current.length;j<_len;j++){
            // 如果这个字存在
            if(dic[current[j]]){
                // 说明这个字存在
                // 直接进入下一个字判断
                dic = dic[current[j]]
                dic.word_frequency = dic.word_frequency + 1
            }else{
                // 说明不存在这个字
                // 那就添加这个字
                dic = dic[current[j]] = {}
                dic.state = true
                dic.word_frequency = 1
            }
        }
    }
    return initdic
}

/**
 * @function GenerateDic 生成词典
 * @param {String} filepath 输入的txt文件路径
 * @param {String} outpath 输出的json文件路径
 * @description 生成词典的json文件
 */
function GenerateDic(filepath, outpath){
    var data = fs.readFileSync(filepath)
    var arr = data.toString().replace(/\n$/, '').split('\n')
    // console.log(arr)
    var dic = BuildDic(arr)
    // 建立恶意词典json文件
    fs.writeFileSync(outpath, JSON.stringify(dic, null, 5))
    console.log(outpath+' have built...')
}

/**
 * @function DetectSentences 检测句子
 * @param {String} str 待检测的句子
 * @param {Object} dic 恶意词典
 * @returns {Boolean} 是否是恶意句子 
 */
function DetectSentences(str, dic){
    for(let i=0,len=str.length;i<len;i++){
        // 判断是不是有这个字
        if(dic[str[i]]){
            // 说明有这个字
            dic = dic[str[i]]
        }else{
            return false
        }
    }
    return true
}

function CheckSensitive(str, dic){
    let original_dic = dic
    var f = original_dic
    var sensitive_word = ''
    var obj = {}
    for(let i=0,len=str.length;i<len;i++){
        // 逐字判断是不是有可能是敏感词
        if(f[str[i]]){
            // 说明有可能是敏感词
            f = f[str[i]]
            sensitive_word += str[i]
            if(Object.getOwnPropertyNames(f).length === 2){
                // 说明已经是最后一个字
                obj.result = true
                obj.sensitive_word = sensitive_word
                return obj
            }
        }else{
            // 说明这个字不存在敏感词
            sensitive_word = ''
            if(original_dic[str[i]]){
                f = original_dic[str[i]]
                sensitive_word += str[i]
            }else{
                f = original_dic
            }
            
        }
    }
    obj.result = false
    return obj
}

function Check(str, sensitive_json, malice_json){
    var sensitive_dic = JSON.parse(sensitive_json)
    var malice_dic = JSON.parse(malice_json)
    var sensitive_result = CheckSensitive(str, sensitive_dic)
    // 定义检测结果
    var check_result = {}
    if(sensitive_result.result){
        // 说明含有敏感词，直接返回
        check_result.result = true
        check_result.state = 'SENSITIVE'
        check_result.message = '含有敏感词'
        check_result.sensitive_word = sensitive_result.sensitive_word
        return check_result
    }else{
        // 说明不含邮敏感词
        // 接着进行恶意检测
        var malice_result = DetectSentences(str, malice_dic)
        if(malice_result){
            // 说明含有恶意
            check_result.result = true
            check_result.state = 'MALICE'
            check_result.message = '含有恶意'
            check_result.sensitive_word = ''
            return check_result
        }else{
            // 说明不含有恶意
            check_result.result = false
            check_result.state = 'NORMAL'
            check_result.message = '不含敏感词或者恶意'
            check_result.sensitive_word = ''
            return check_result
        }
    }
}

function Detect(str, sensitive_dic, malice_dic){
    var sensitive_result = CheckSensitive(str, sensitive_dic)
    // 定义检测结果
    var check_result = {}
    if(sensitive_result.result){
        // 说明含有敏感词，直接返回
        check_result.result = true
        check_result.state = 'SENSITIVE'
        check_result.message = '含有敏感词'
        check_result.sensitive_word = sensitive_result.sensitive_word
        return check_result
    }else{
        // 说明不含邮敏感词
        // 接着进行恶意检测
        var malice_result = DetectSentences(str, malice_dic)
        if(malice_result){
            // 说明含有恶意
            check_result.result = true
            check_result.state = 'MALICE'
            check_result.message = '含有恶意'
            check_result.sensitive_word = ''
            return check_result
        }else{
            // 说明不含有恶意
            check_result.result = false
            check_result.state = 'NORMAL'
            check_result.message = '不含敏感词或者恶意'
            check_result.sensitive_word = ''
            return check_result
        }
    }
}

// 生成恶意词典的json文件
// GenerateDic('malice.txt', 'malice.json')
// 生成敏感词典的json文件
// GenerateDic('sensitive.txt', 'sensitive.json')


module.exports = {
    GenerateDic,
    Check,
    Detect
}
