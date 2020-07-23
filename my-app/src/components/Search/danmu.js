// 打算设置20个弹幕赛道，每条赛道的宽度是 30px

// 如何定义赛道
var Tracks = []
for(let i=0;i<20;i++){
    Tracks[i] = false
}

/**
 * @function DanMu
 * @description 创建一个弹幕类
 */
function DanMu(container,content,styles,time){
    this.container = container
    this.content = content
    this.label = false // 记录一个触发器，这个触发器只能触发一次
    for(let i=0;i<20;i++){
        if(!Tracks[i]){
            // 说明此时的赛道是允许让弹幕进入的
            Tracks[i] = true
            this.Sign = i // 记住这个赛道的号码
            break;
        }
    }
    this.time = time || null
    var __styles = {
        fontSize:"25px",
        color:"#fff",
        position:"absolute",
        whiteSpace:"nowrap"
    }
    this.styles = styles || __styles
    this.div = null
    this.__wdith = document.body.clientWidth
    this.count = 0
    this.gap = 20 // 默认每条弹幕之间最近的横向间隔是 20px
}

// create dom
DanMu.prototype.create = function(){
    this.top = this.Sign*33 + 10
    var div = document.createElement("div")
    div.innerHTML = this.content
    div.style.top = this.top + "px"
    for(let o in this.styles){
        div.style[o] = this.styles[o]
    }
    div.style.left = this.__wdith + "px"
    this.div = div
    this.container.append(div)
    this.__self = parseInt(this.styles.fontSize)*this.content.length
    return this
}

DanMu.prototype.move = function(speed){
    this.speed = speed || 1
    var timer = setInterval(()=>{
        this.count++
        if(parseInt(this.div.style.left) + this.__self + this.gap < this.__wdith && !this.label){
            // 说明此时弹幕已经全部进入窗口，可以赛道已经空出来，可以下一条弹幕进入赛道了
            Tracks[this.Sign] = false
            this.label = true
        }
        if(parseInt(this.div.style.left) < -this.__self){
            clearInterval(timer)
            this.container.removeChild(this.div)
        }else{
            this.div.style.left = parseInt(this.div.style.left) - this.speed + "px"
        }
    },10)
}
export default DanMu