const httpio = require('ibili/httpio')
const ibili = require('ibili')
const { sessdata } = require('./components/Common/IpToggle')
// 格式化时间
function handlePubdate(d){
    var moment = new Date(d * 1000)
    var date = moment.toLocaleDateString().replace(/\//g, '-')
    var time = moment.toTimeString().replace('GMT+0800 (中国标准时间)', '').trim()
    return date + ' ' + time
}
// 格式化播放数
function handleView(v){
    var num = null
    if(v >= 10000){
        num = v/10000
        return num.toFixed(1) + '万'
    }else{
        num = v
    }
    return num
}

// 格式化弹幕数
function handleDanmaku(d){
    var num = null
    if(d >= 10000){
        num = d/10000
        return num.toFixed(1) + '万'
    }else{
        num = d
    }
    return num
}

// 格式化post的数据
function formate(obj){
    var s = ""
    for(let o in obj){
        s += o+"="+obj[o]+"&"
    }
    return s.replace(/&$/g,"")
}

// handledate 处理出版日期
function handledate(date){
    var time = new Date(date * 1000)
    // var ts = time.toLocaleTimeString()
    var ds = time.toLocaleDateString().replace(/\//g, '-')
    return ds
}
// 根据类型
function handleType(type){
    switch(type){
        case 'media_bangumi':
            return '番剧'
        case 'video':
            return '视频'
        case 'media_ft':
            return '电影'
        default:
    }
}
// "<em class="keyword">路人女主的养成方法</em>"
function handleTextContent(s){
    return s.match(/>(.*?)</)[1]
}
// 判断视频的格式到底是mp4还是flv
function isMP4(url){
    return url.match(/\.([^.]+?)\?/)[1] === 'mp4'
}
function isFLV(url){
    return url.match(/\.([^.]+?)\?/)[1] === 'flv'
}

// 获取MP4的资源
function getMP4SourceByLink(link){
    return new Promise((resolve, reject)=>{
        // console.log(link)
        if(Array.isArray(link)){
            link = link[0]
        }
        httpio.get({
            url: link,
            headers: {
                'Referer': link,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
                'Cookie': 'SESSDATA=' + sessdata
            }
        }).then(res=>{
            var chs = []
            res.on('data', ch=>{
                chs.push(ch)
            }).on('end',()=>{
                var bs = JSON.parse(Buffer.concat(chs).toString()).data.durl[0].url
                httpio.get({
                    url: bs,
                    headers: {
                        'Referer': link,
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
                        'Cookie': 'SESSDATA=' + sessdata
                    }
                }).then(res=>{
                    resolve(res)
                })
            })
        })
    })
}

//
function getSourceAddress(url){
    return new Promise((resolve, reject)=>{
        ibili.getVideoDownLinkByurl(url).then(link=>{
            // console.log(link)
            if(Array.isArray(link)){
                link = link[0]
            }
            httpio.get({
                url: link,
                headers: {
                    'Referer': link,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
                    'Cookie': 'SESSDATA=' + sessdata
                }
            }).then(res=>{
                var chs = []
                res.on('data', ch=>{
                    chs.push(ch)
                }).on('end',()=>{
                    var bs = JSON.parse(Buffer.concat(chs).toString())
                    // console.log(bs.data)
                    var address = bs.data.durl[0].url
                    // console.log(address)
                    resolve(address)
                })
            })
        })
    })
}

// 获取视频的下载地址的链接地址
function getMP4SourceByUrl(url){
    return new Promise((resolve,reject)=>{
        ibili.getVideoDownLinkByurl(url).then(link=>{
            getMP4SourceByLink(link).then(res=>{
                resolve(res)
            })
        })
    })
}

// handleTitle
function handleTitle(title){
    return title.replace(/<.*?>/g, '')
}

// 获取作者的信息
function getAuthorInfo(mid){
    return new Promise((resolve, reject)=>{
        httpio.get({
            url: 'https://space.bilibili.com/15253026'
        }).then(data=>{
            resolve(data)
        })
    })
}
// 番剧页面的切换
function handleToggleBangumi(pathname){
    if(pathname === '/search/bangumi'){
        return '/search/bangumisub'
    }
    if(pathname === '/search/bangumisub'){
        return '/search/bangumi'
    }
}

module.exports = {
    handlePubdate,
    handleView,
    handleDanmaku,
    formate,
    handledate,
    handleType,
    handleTextContent,
    isFLV,
    isMP4,
    getMP4SourceByLink,
    getMP4SourceByUrl,
    getSourceAddress,
    handleTitle,
    getAuthorInfo,
    handleToggleBangumi
}