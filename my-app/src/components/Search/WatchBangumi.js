import React from 'react'
// import qs from 'querystring'
import axios from 'axios'
import Comment from './Comment'
import { Spin, Input, Switch, Icon, Button, Tag } from 'antd'
import { handlePubdate, handleView, handleDanmaku, formate, isFLV, isMP4 } from '../../tool'
import flvjs from 'flv.js'
import DanMu from './danmu'
import './Player.css'
import './WatchBangumi.css'
import LazyLoadingImg from '../Common/LazyLoadingImg'
import { iptoggle } from '../Common/IpToggle'
import Swiper from './Swiper'
// import loadingsrc from '../../asset/ploading.gif'
// indicator={<img width='50px' src={loadingsrc} />}
// 在这里初始化弹幕的数据，因为如果设置在state会引起数据的更新儿导致video标签的刷新
var damaku = []
// 也是同样的原因才会在这里初始化弹幕的样式，为了避免state数据的更新导致video标签的刷新
var damakuStyle = null
// 获取最初的弹幕的数据
if(iptoggle){
    axios.get('http://satan.viphk.ngrok.org?aim=barrage').then(res=>{
        damaku = res.data
    })
}else{
    axios.get('http://localhost:4000?aim=barrage').then(res=>{
        damaku = res.data
    })
}
class WatchBangumi extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            message: null,
            icons: [
                {
                    type: 'like',
                    name: '喜欢'
                },
                {
                    type: 'copyright',
                    name: '硬币'
                },
                {
                    type: 'star',
                    name: '收藏'
                },
                {
                    type: 'share-alt',
                    name: '转发'
                }
            ],
            tags: [],
            comments: [],
            play_url: '',
            loading: true
        }
        this.handleInitMessage = this.handleInitMessage.bind(this)
        this.handleSwitch = this.handleSwitch.bind(this)
        this.handlePressEnter = this.handlePressEnter.bind(this)
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
        this.handleCurrentTime = this.handleCurrentTime.bind(this)
        this.handleVideoClick = this.handleVideoClick.bind(this)
        this.handleInitMessage()
    }
    // 初始化视频信息，获取视频信息
    handleInitMessage(){
        // console.log(this.props.location.pathname)
        var { data, index, list } = this.props.location.state
        var url = list ? list.url : data[index].url
        if(iptoggle){
            axios.get('http://satan.viphk.ngrok.org?aim=message&&val='+ url).then(res=>{
                var data = res.data
                this.setState({
                    message: data,
                    loading: false
                })
                axios.get('http://satan.viphk.ngrok.org?aim=comment&&val='+ data.aid).then(res=>{
                    this.setState({
                        comments: res.data
                    })
                    axios.get('http://satan.viphk.ngrok.org?aim=download&&val='+ url).then(res=>{
                        var play_url = res.data
                        this.setState({
                            play_url
                        })
                    })
                })
            })
        }else{
            axios.get('http://localhost:4000?aim=message&&val='+ url).then(res=>{
                var data = res.data
                this.setState({
                    message: data,
                    loading: false
                })
                axios.get('http://localhost:4000?aim=comment&&val='+ data.aid).then(res=>{
                    this.setState({
                        comments: res.data
                    })
                    axios.get('http://localhost:4000?aim=download&&val='+ url).then(res=>{
                        var play_url = res.data
                        this.setState({
                            play_url
                        })
                    })
                })
            })
        }
    }
    handleTimeUpdate(){
        var current = this.video.currentTime
        this.handleCurrentTime(current)
    }
    handleCurrentTime(val){
        var container = this.playerbox
        for(let i=0, len=damaku.length; i<len; i++){
            if(Math.abs(val - damaku[i].currentTime) < 0.12){
                // 这里要判断是不是刚刚输入的弹幕
                if(damaku[i].isEnter){
                    var style = {
                        fontSize:"25px",
                        color:"#fff",
                        position:"absolute",
                        whiteSpace:"nowrap",
                        borderBottom: '1px solid #ff80b0' // 为了方便区别是刚刚输入的弹幕，在弹幕的下方加一条下划线
                    }
                    new DanMu(container, damaku[i].content, style).create().move()
                }else{
                    new DanMu(container, damaku[i].content, damakuStyle).create().move()
                }
                
            }
        }
    }
    handleVideoClick(){
        // if(this.video.paused){
        //     this.video.play()
        //     return
        // }
        // if(this.video.played.length){
        //     this.video.pause()
        // }
    }
    handleSwitch(checked){
        // 弹幕开关
        console.log(checked)
        var styles = null
        if(!checked){
            // 说明开关关闭
            styles = {
                fontSize:"25px",
                color:"transparent",
                position:"absolute",
                whiteSpace:"nowrap"
            }
        }
        damakuStyle = styles
    }
    handlePressEnter(e){
        var val = e.target.value
        var current = this.video.currentTime + 1
        var data = {
            content: val,
            currentTime: current, // 之所以要延迟一秒的原因是为了能够在输入之后1秒中之后出现
            isEnter: true // 在这里标志为刚刚输入的弹幕
        }
        damaku.push(data)
        if(iptoggle){
            axios.post('http://satan.viphk.ngrok.org?aim=submitbarrage', formate(data)).then(res=>{
                console.log(res.data)
            })
        }else{
            axios.post('http://localhost:4000?aim=submitbarrage', formate(data)).then(res=>{
                console.log(res.data)
            })
        }
    }
    render(){
        var { state, pathname } = this.props.location
        var { data, index, list } = state
        // 在这里设置图片样式
        // console.log(data)
        var url = list ? list.url : data[index].url
        var { message, icons, comments, play_url, loading } = this.state
        // console.log(loading)
        // var videoLoadingStyle = play_url ? 'player-video-loading-hide' : 'player-video-loading'
        if(message){
            // console.log(message)
            // play_url 同样可以作为视频是不是开始加载的标志
            if(play_url){
                if(isFLV(play_url)){
                    if (flvjs.isSupported()) {
                        var flvPlayer = null
                        if(iptoggle){
                            flvPlayer = flvjs.createPlayer({
                                type: 'flv',
                                isLive: true,
                                // url: play_url,
                                url: 'http://satan.viphk.ngrok.org?aim=source&&val='+ url,
                                hasAudio:true,
                                hasVideo:true,
                                enableStashBuffer: true
                            });
                        }else{
                            flvPlayer = flvjs.createPlayer({
                                type: 'flv',
                                isLive: true,
                                // url: play_url,
                                url: 'http://localhost:4000?aim=source&&val='+ url,
                                hasAudio:true,
                                hasVideo:true,
                                enableStashBuffer: true
                            });
                        }
                        flvPlayer.attachMediaElement(this.video);
                        flvPlayer.load();
                        flvPlayer.play();
                    }
                }
                if(isMP4(play_url)){
                    if(iptoggle){
                        this.video.src = 'http://satan.viphk.ngrok.org?aim=source&&val='+ url
                    }else{
                        this.video.src = 'http://localhost:4000?aim=source&&val='+ url
                    }
                }
            }
            // 这里要判断是不是以【开头，如果是的话就要消除中文的间隙
            var titleClassName = /^【/.test(message.title) ? 'player-title-remove' : 'player-title'
            return (
                <div className='player-body'>
                    <div className='player-top'>
                        <aside className='player-top-left'>
                            <h1 className={titleClassName}>{message.title}</h1>
                            <p className='player-time'>{message.tname + ' ' + handlePubdate(message.pubdate)}</p>
                            <span className='player-view'>{handleView(message.stat.view) + '播放'}</span>
                            <span className='player-danmaku'>{handleDanmaku(message.stat.danmaku) + '弹幕'}</span>
                        </aside>
                        <section className='player-top-right'>
                            <LazyLoadingImg 
                                state={{
                                    BoxClassName: 'player-top-right-aside',
                                    ImgClassName: 'player-top-right-img',
                                    src: message.owner.face,
                                    alt: message.owner.name
                                }}
                            ></LazyLoadingImg>
                            <div className='player-top-right-section'>
                                <p className='player-top-right-user'>
                                    <Tag color='magenta'>作者</Tag> 
                                    {message.owner.name}
                                </p>
                                {/* <p className='player-top-right-desc'>{message.desc}</p> */}
                                <Button type='primary' shape='round'>
                                    <Icon type="plus-circle" theme="filled" /> 立即关注
                                </Button>
                            </div>
                        </section>
                    </div>
                    <div className='player-box' ref={el=>this.playerbox=el}>
                        <div className='player-container'>
                            <video src='' controls onTimeUpdate={this.handleTimeUpdate} ref={el=>this.video=el} autoPlay onClick={this.handleVideoClick} className='player-video'></video>
                        </div>
                        <div className='player-sendbar'>
                            <span className='player-danmaku-inline'>{handleDanmaku(message.stat.danmaku)+' 条实时弹幕'}</span>
                            <Input defaultValue='barrage...' style={{width: 300}} className='player-input-barrage' onPressEnter={this.handlePressEnter}></Input>
                            <Switch defaultChecked={true} onChange={this.handleSwitch}></Switch>
                        </div>
                        <div className='player-toolbar'>
                            {icons.map(el=>(
                                <span className='player-toolbar-icon' key={el.type}>
                                    <Icon type={el.type} /> {el.name}
                                </span>
                            ))}
                        </div>
                        <Spin spinning={loading} tip='loading...'>
                            <Swiper state={{data, index, message, list, pathname}}></Swiper>
                        </Spin>
                        <Comment comments={comments}></Comment>
                    </div>
                </div>
            )
        }else{
            return (
                <div className='player-loading'>
                    <Spin tip='Loading...' size='large'></Spin>
                </div>
            )
        }
    }
}
export default WatchBangumi