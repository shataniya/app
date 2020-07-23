import React from 'react'
import './Swiper.css'
import BangumiInfo from './BangumiInfo'
import LazyLoadingImg from '../Common/LazyLoadingImg'
import { Button, Icon, Spin } from 'antd'
import axios from 'axios'
import { iptoggle } from '../Common/IpToggle'
import { Link } from 'react-router-dom'
import { handleToggleBangumi } from '../../tool'
class Swiper extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            pageindex: null,
            pagemessage: null,
            loading: false
        }
        this.handlePage = this.handlePage.bind(this)
        this.handlePrevButton = this.handlePrevButton.bind(this)
        this.handleNextButton =this.handleNextButton.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleCenterButtonClick = this.handleCenterButtonClick.bind(this)
    }
    UNSAFE_componentWillMount(){
        var { index, list } = this.props.state
        if(!list){
            // 说明是番剧
            this.setState({
                pageindex: index
            })
        }
    }
    handlePrevButton(){
        // console.log('is prev')
        var { data } = this.props.state
        var { pageindex } = this.state
        var i = pageindex-1 >= 0 ? pageindex-1 : 0
        // console.log(i, pageindex)
        if(i !== pageindex){
            this.setState({
                loading: true
            })
            // 当点击next按钮当时候
            var { url } = data[i]
            if(iptoggle){
                axios.get('http://satan.viphk.ngrok.org?aim=message&&val='+url).then(res=>{
                    // console.log(res.data)
                    this.setState({
                        pagemessage: res.data,
                        pageindex: i,
                        loading: false
                    })
                })
            }else{
                axios.get('http://localhost:4000?aim=message&&val='+url).then(res=>{
                    // console.log(res.data)
                    this.setState({
                        pagemessage: res.data,
                        pageindex: i,
                        loading: false
                    })
                })
            }
        }
    }
    handleNextButton(){
        // console.log('is next')
        var { data } = this.props.state
        var { pageindex } = this.state
        var i = pageindex+1 < data.length ? pageindex+1 : pageindex
        // console.log(i, pageindex, index)
        if(i !== pageindex){
            this.setState({
                loading: true
            })
            // 当点击next按钮当时候
            var { url } = data[i]
            if(iptoggle){
                axios.get('http://satan.viphk.ngrok.org?aim=message&&val='+url).then(res=>{
                    // console.log(res.data)
                    this.setState({
                        pagemessage: res.data,
                        pageindex: i,
                        loading: false
                    })
                })
            }else{
                axios.get('http://localhost:4000?aim=message&&val='+url).then(res=>{
                    // console.log(res.data)
                    this.setState({
                        pagemessage: res.data,
                        pageindex: i,
                        loading: false
                    })
                })
            }
        }
    }
    handleButtonClick(data, index){
        // console.log(data, index)
        var { pathname } = this.props.state
        var path = {
            pathname: handleToggleBangumi(pathname),
            state: { data, index }
        }
        return path
    }
    handleCenterButtonClick(data, index, button_text){
        if(button_text === '立即观看'){
            // 说明中间的番剧要进行播放
            var { pathname } = this.props.state
            var path = {
                pathname: handleToggleBangumi(pathname),
                state: { data, index }
            }
            return (
                <Button type='primary' shape='round'>
                    <Link to={path}>
                        <Icon type="play-circle" theme="filled" /> {button_text}
                    </Link>
                </Button>
            )
        }else{
            // 说明中间的番剧不需要播放
            return (
                <Button type='primary' shape='round'>
                    <Icon type="play-circle" theme="filled" /> {button_text}
                </Button>
            )
        }
    }
    handlePage(item, i, pageindex){
        // console.log(i, pageindex)
        if(!item.cover || i === pageindex){
            // 说明已经没有了
            return (
                <div className='swiper-item'>
                    <LazyLoadingImg 
                        state={{
                            nodeName: 'aside',
                            BoxClassName: 'wb-aside',
                            ImgClassName: 'swiper-error-img',
                            src: 'https://s1.hdslb.com/bfs/static/jinkela/search/asserts/no-data.png',
                            alt: '没有了小老弟'
                        }}>
                    </LazyLoadingImg>
                    <div className='swiper-info-show'>
                        <p className='swiper-tag'>没有了小老弟</p>
                        <Button type='primary' shape='round'>
                            <Icon type="play-circle" theme="filled" /> 莫得观看
                        </Button>
                    </div>
                </div>
            )
        }else{
            var { index } = this.props.state
            if(i === index){
                return (
                    <div className='swiper-item'>
                        <LazyLoadingImg 
                            state={{
                                nodeName: 'aside',
                                BoxClassName: 'wb-aside',
                                ImgClassName: 'wb-img',
                                src: item.cover,
                                alt: item.long_title
                            }}>
                        </LazyLoadingImg>
                        <div className='swiper-info-show'>
                            <p className='swiper-tag'>{item.long_title}</p>
                            <Button type='primary' shape='round'>
                                <Icon type="play-circle" theme="filled" /> 正在观看
                            </Button>
                        </div>
                    </div>
                )
            }else{
                var { data } = this.props.state
                return (
                    <div className='swiper-item'>
                        <LazyLoadingImg 
                            state={{
                                nodeName: 'aside',
                                BoxClassName: 'wb-aside',
                                ImgClassName: 'wb-img',
                                src: item.cover,
                                alt: item.long_title
                            }}>
                        </LazyLoadingImg>
                        <div className='swiper-info-show'>
                            <p className='swiper-tag'>{item.long_title}</p>
                            <Button type='primary' shape='round'>
                                <Link to={this.handleButtonClick(data, i)}>
                                    <Icon type="play-circle" theme="filled" /> 立即观看
                                </Link>
                            </Button>
                        </div>
                    </div>
                )
            }
        }
    }
    render(){
        var { data, index, message, list } = this.props.state
        var { pageindex, pagemessage, loading } = this.state
        // 判断是电影还是番剧
        if(list){
            // list存在说明是电影
            return (
                <div className='wb-info-box'>
                    <LazyLoadingImg 
                        state={{
                            nodeName: 'aside',
                            BoxClassName: 'wb-aside-ft',
                            ImgClassName: 'wb-img',
                            src: list.cover,
                            alt: list.long_title
                        }}>
                    </LazyLoadingImg>
                    <BangumiInfo state={{list, message}}></BangumiInfo>
                </div>
            )
        }else{
            // list不存在说明是番剧
            var datas = data[index]
            var pindex = pageindex-1 >= 0 ? pageindex-1 : 0
            var prevs = pindex >= 0 ? data[pindex] : {}
            var nindex = pageindex+1 < data.length ? pageindex+1 : pageindex
            var nexts = nindex < data.length ? data[nindex] : {}
            var button_text = '正在观看'
            if(index !== pageindex){
                message = pagemessage
                datas = data[pageindex]
                button_text = '立即观看'
            }
            // console.log(message)
            return (
                <Spin spinning={loading} tip='loading...'>
                    <div className='swiper'>
                        <div className='swiper-prev'>
                            <Button type='primary' shape='circle' icon='left' onClick={this.handlePrevButton}></Button>
                        </div>
                        <div className='swiper-left'>
                            {this.handlePage(prevs, pindex, pageindex)}
                        </div>
                        <div className='swiper-center'>
                            <div className='swiper-center-img'>
                                <LazyLoadingImg 
                                    state={{
                                        nodeName: 'aside',
                                        BoxClassName: 'wb-aside',
                                        ImgClassName: 'wb-img',
                                        src: datas.cover,
                                        alt: datas.long_title
                                    }}>
                                </LazyLoadingImg>
                                <div className='swiper-info-show'>
                                    <p className='swiper-tag'>{datas.long_title}</p>
                                    {this.handleCenterButtonClick(data, pageindex, button_text)}
                                </div>
                            </div>
                            <BangumiInfo state={{datas, message}}></BangumiInfo>
                        </div>
                        <div className='swiper-right'>
                            {this.handlePage(nexts, nindex, pageindex)}
                        </div>
                        <div className='swiper-next'>
                            <Button type='primary' shape='circle' icon='right' onClick={this.handleNextButton}></Button>
                        </div>
                    </div>
                </Spin>
            )
        }
        
    }
}
export default Swiper