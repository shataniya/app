import React from 'react'
import { handlePubdate, handleView, handleDanmaku, handleTitle } from '../../tool'
import { Tag, Spin } from 'antd'
import axios from 'axios'
import { iptoggle } from '../Common/IpToggle'
class BangumiInfo extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            bangumi_message: null
        }
        this.handleInitBangumiInfo = this.handleInitBangumiInfo.bind(this)
        this.handleInitBangumiInfo()
    }
    handleInitBangumiInfo(){
        // console.log(this.props.state)
        var { datas, list } = this.props.state
        // url 或者 goto_url
        var url = list ? list.url : datas.url
        if(iptoggle){
            axios.get('http://satan.viphk.ngrok.org?aim=message&&val='+url).then(res=>{
                // console.log(res.data)
                this.setState({
                    bangumi_message: res.data,
                    loading: false
                })
            })
        }else{
            axios.get('http://localhost:4000?aim=message&&val='+url).then(res=>{
                // console.log(res.data)
                this.setState({
                    bangumi_message: res.data,
                    loading: false
                })
            })
        }
    }
    render(){
        var { datas, message, list } = this.props.state
        var { bangumi_message, loading } = this.state
        // console.log(datas)
        // console.log(message)
        if(!message){
            message = bangumi_message
        }
        if(!message){
            return (
                <section className='wb-info'>
                    <Spin spinning={loading}></Spin>
                </section>
            )
        }
        // 在这里设置标题
        if(list){
            datas = list
        }
        var title = datas.long_title ? datas.long_title : datas.title
        title = handleTitle(title)
        var DescClassName = ''
        if(datas.type === 'media_ft'){
            // 说明是电影
            DescClassName = 'wb-info-desc-ft'
            return (
                <section className='wb-info'>
                    <h1 className='wb-info-title'><Tag color='magenta'>{datas.season_type_name ? datas.season_type_name : message.tname}</Tag> {title}</h1>
                    <h2 className='wb-info-subtitle'>
                        <Tag color='geekblue'>{message.tname}</Tag> {handleTitle(datas.org_title)}
                    </h2>
                    <p className='wb-info-view'>更新日期：<span className='wb-info-view-text'>{handlePubdate(message.pubdate)}</span></p>
                    <div className='wb-info-view-box'>
                        <p className='wb-info-view-left'>
                            <span className='wb-info-label'>播放：</span>
                            <span className='wb-info-value'>{handleView(message.stat.view)}</span>
                        </p>
                        <p className='wb-info-view-right'>
                            <span className='wb-info-label'>弹幕：</span>
                            <span className='wb-info-value'>{handleDanmaku(message.stat.danmaku)}</span>
                        </p>
                    </div>
                    <div className='wb-info-view-box'>
                        <p className='wb-info-view-left'>
                            <span className='wb-info-label'>风格：</span>
                            <span className='wb-info-value'>{datas.styles}</span>
                        </p>
                        <p className='wb-info-view-right'>
                            <span className='wb-info-label'>声优：</span>
                            <span className='wb-info-value'>{datas.cv}</span>
                        </p>
                    </div>
                    <p className='wb-info-view'>阵容：<span className='wb-info-view-text'>{datas.staff}</span></p>
                    <p className={DescClassName}>{datas.desc}</p>
                    <p className='wb-info-tag'>
                        <Tag color='purple'>{message.owner.name}</Tag>
                        <Tag color='purple'>{message.tname}</Tag>
                    </p>
                </section>
            )
        }else{
            // 说明是番剧
            DescClassName = 'wb-info-desc'
            return (
                <section className='wb-info'>
                    <h1 className='wb-info-title'><Tag color='magenta'>{datas.season_type_name ? datas.season_type_name : message.tname}</Tag> {title}</h1>
                    <p className='wb-info-view'>更新日期：{handlePubdate(message.pubdate)}</p>
                    <p className='wb-info-view'>播放：{handleView(message.stat.view)} 弹幕：{handleDanmaku(message.stat.danmaku)}</p>
                    <p className={DescClassName}>{datas.desc}</p>
                    <p className='wb-info-tag'>
                        <Tag color='purple'>{message.owner.name}</Tag>
                        <Tag color='purple'>{message.tname}</Tag>
                    </p>
                </section>
            )
        }
    }
}
export default BangumiInfo