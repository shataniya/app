import React from 'react'
import qs from 'querystring'
import axios from 'axios'
import './Player.css'
import Comment from './Comment'
import { Spin, Input, Switch, Icon, Tag, Button, message } from 'antd'
import { handlePubdate, handleView, handleDanmaku, formate, isFLV, isMP4 } from '../../tool'
import flvjs from 'flv.js'
import DanMu from './danmu'
// import checkSensitive from '../../algorithm/dic'
import { iptoggle } from '../Common/IpToggle'
import LazyLoadingImg from '../Common/LazyLoadingImg'
// 引入敏感词典和恶意词典
import { SENSITIVE_Dictionary, MALICE_Dictionary } from '../../malice/Dictionary'
import { Detect } from '../../malice/bundle'

import { connect } from 'react-redux'
// action
import { OpenInput } from '../../store/action'

// import appState from '../Common/appState'
// 记录含有敏感词汇的次数
// *** 一旦发言含有敏感词汇超过两次，就会被禁言
var sentive_count = 0
// var notalking = false
// import loadingsrc from '../../asset/ploading.gif'
// indicator={<img width='50px' src={loadingsrc} />}
// 在这里初始化弹幕的数据，因为如果设置在state会引起数据的更新儿导致video标签的刷新
var damaku = []
// 也是同样的原因才会在这里初始化弹幕的样式，为了避免state数据的更新导致video标签的刷新
var damakuStyle = null
// 获取最初的弹幕的数据
function loaddamaku(){
    if(iptoggle){
        axios.get('http://satan.viphk.ngrok.org?aim=barrage').then(res=>{
            damaku = res.data
        })
    }else{
        axios.get('http://localhost:4000?aim=barrage').then(res=>{
            damaku = res.data
        })
    }
}
loaddamaku()
class Player extends React.Component{
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
            // notalking: false
            // desc: ''
        }
        this.handleSwitch = this.handleSwitch.bind(this)
        this.handlePressEnter = this.handlePressEnter.bind(this)
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
        this.handleCurrentTime = this.handleCurrentTime.bind(this)
        this.handleVideoClick = this.handleVideoClick.bind(this)
    }
    UNSAFE_componentWillMount(){
        var searchtext = this.props.location.search.replace('?', '')
        var { arcurl, tag} = qs.parse(searchtext)
        if(iptoggle){
            axios.get('http://satan.viphk.ngrok.org?aim=message&&val='+ arcurl).then(res=>{
                var data = res.data
                this.setState({
                    message: data
                })
                axios.get('http://satan.viphk.ngrok.org?aim=comment&&val='+ data.aid).then(res=>{
                    this.setState({
                        comments: res.data
                    })
                    axios.get('http://satan.viphk.ngrok.org?aim=download&&val='+ arcurl).then(res=>{
                        // console.log(res.data)
                        this.setState({
                            play_url: res.data
                        })
                    })
                })
            })
        }else{
            axios.get('http://localhost:4000?aim=message&&val='+ arcurl).then(res=>{
                var data = res.data
                // axios.get('http://localhost:4000?aim=author&&val='+data.owner.mid).then(r=>{
                //     console.log(r.data)
                // })
                this.setState({
                    message: data
                })
                axios.get('http://localhost:4000?aim=comment&&val='+ data.aid).then(res=>{
                    this.setState({
                        comments: res.data
                    })
                    axios.get('http://localhost:4000?aim=download&&val='+ arcurl).then(res=>{
                        // console.log(res.data)
                        this.setState({
                            play_url: res.data
                        })
                    })
                })
            })
        }
        this.setState({
            tags: tag.split(',')
        })
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
                        borderBottom: '2px solid lightgreen' // 为了方便区别是刚刚输入的弹幕，在弹幕的下方加一条下划线
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
        // console.log(checked)
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
        // console.log(val)
        var check_result = Detect(val, SENSITIVE_Dictionary, MALICE_Dictionary)
        //  console.log(hasSensitive)
         if(check_result.result){
             // 说明这个弹幕含有敏感词汇
             sentive_count = sentive_count + 1
             if(sentive_count >= 2){
                 // 说明发言含有敏感词汇两次，那么就会进行禁烟处理
                //  this.setState({
                //      notalking: true
                //  })
                // notalking = true
                // appState.notalking = true
                OpenInput()
                 message.error('你已经被禁言！！！')
                 // 修改输入框的提示信息
                 this.input.input.value = '你已经被禁言'
                 // 进行禁言处理
                 this.input.input.disabled = true
                //  window.history.go(0)
                // damaku = []
                // loaddamaku()
                 return
             }
             if(check_result.state === 'SENSITIVE'){
                message.warning('你输入的弹幕有敏感词汇！')
             }
             if(check_result.state === 'MALICE'){
                 message.warning('你输入的弹幕含有恶意！')
             }
            return
         }
        //  sentive_count = 0 // 说明是正常发言，这个时候要更新敏感词汇发言的次数为0
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
        message.success('弹幕输入成功！')
        this.input.input.value = ''
        sentive_count = 0
    }
    render(){
        var { message, icons, tags, comments, play_url } = this.state
        // var { getNoTalking } = this.props.state
        // var videoLoadingStyle = play_url ? 'player-video-loading-hide' : 'player-video-loading'
        if(message){
            // console.log(message)
            // play_url 同样可以作为视频是不是开始加载的标志
            if(play_url){
                // 判断是不是FLV
                if(isFLV(play_url)){
                    if (flvjs.isSupported()) {
                        var flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            isLive: true,
                            url: play_url,
                            hasAudio:true,
                            hasVideo:true,
                            enableStashBuffer: true
                        });
                        flvPlayer.attachMediaElement(this.video);
                        flvPlayer.load();
                        flvPlayer.play();
                    }
                }
                // 判断是不是MP4
                if(isMP4(play_url)){
                    var searchtext = this.props.location.search.replace('?', '')
                    var { arcurl} = qs.parse(searchtext)
                    if(iptoggle){
                        this.video.src = 'http://satan.viphk.ngrok.org?aim=source&&val='+ arcurl
                    }else{
                        this.video.src = 'http://localhost:4000?aim=source&&val='+ arcurl
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
                            <Input placeholder='请输入弹幕...' ref={el=>this.input = el} style={{width: 300}} className='player-input-barrage' onPressEnter={this.handlePressEnter}></Input>
                            <Switch defaultChecked={true} onChange={this.handleSwitch}></Switch>
                        </div>
                        <div className='player-toolbar'>
                            {icons.map(el=>(
                                <span className='player-toolbar-icon' key={el.type}>
                                    <Icon type={el.type} /> {el.name}
                                </span>
                            ))}
                        </div>
                        <div className='player-info'>
                            <p className='player-info-desc'>{message.desc}</p>
                            <p className='player-info-tag'>
                                {tags.map(tag=>(
                                    <Tag color='purple' key={tag}>{tag}</Tag>
                                ))}
                            </p>
                        </div>
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

function mapStateToProps(state){
    return {
        state
    }
}

export default connect(mapStateToProps)(Player)