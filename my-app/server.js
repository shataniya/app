const http = require('http')
// const httpio = require('ibili/httpio')
const qs = require('querystring')
// sessdata: d8b8d32e%2C1583203485%2C1aac7c21
const url = require('url')
const ibili = require('ibili')
// 引入monto，为了处理弹幕数据
const monto = require('monto')
const db = monto('mongodb://localhost/dm') // 创建db实例
const { getSourceAddress, getMP4SourceByUrl, getAuthorInfo } = require('./src/tool')
const { iptoggle } = require('./src/components/Common/IpToggle')
// const fs = require('fs')
// const { isFLV, isMP4 } = require('./src/tool')
var danmubox = null
db.find('danmus', {}, true).then(data=>{
    danmubox = data // 最先从数据库里面获取弹幕的数据
})
http.createServer(async function(__req, __res){
    if(iptoggle){
        __res.setHeader('Access-Control-Allow-Origin', 'http://sha.viphk.ngrok.org')
    }else{
        __res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    }
    // console.log(__req.url)
    const { aim, val, page } = url.parse(__req.url,true).query
    var data = null
    // 获取搜索结果
    if(aim === 'search'){
        var res = await ibili.getSearchBypage(val, page)
        data = res
    }
    // 获取视频信息
    if(aim === 'message'){
        var res = await ibili.loadmessage(val)
        data = res.data
    }
    // 获取视频下方的评论
    if(aim === 'comment'){
        var res = await ibili.loadcomments(val)
        data = res
    }
    // 获取视频下载地址
    if(aim === 'download'){
        var address = await getSourceAddress(val)
        data = address
    }
    // 获取视频的资源
    if(aim === 'source'){
        var res = await getMP4SourceByUrl(val)
        res.pipe(__res)
        return
    }
    // 获取弹幕的数据
    if(aim === 'barrage'){
        data = danmubox
    }
    // 提交弹幕
    if(aim === 'submitbarrage'){
        var chunks = []
        __req.on('data',chunk=>{
            chunks.push(chunk)
        })
        __req.on('end',()=>{
            var s = Buffer.concat(chunks).toString()
            var recive = qs.parse(s)
            delete recive['isEnter']
            db.insertOne('danmus', recive).then(()=>{
                console.log('add successful!')
            })
            db.find('danmus', {}, true).then(data=>{
                danmubox = data
            })
        })
        data = 'submit successful!'
    }
    // 获取作者的信息
    if(aim === 'author'){
        var res = await getAuthorInfo(val)
        // console.log(res)
        data = res
    }
    __res.end(JSON.stringify(data))
}).listen(4000, function(){
    console.log('server is running at http://localhost:4000')
})