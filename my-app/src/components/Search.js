import React from 'react'
import './common.css'
import './Search/Search.css'
import { Input, Tag, Spin, Radio } from 'antd'
import { handleType } from '../tool'
import axios from 'axios'
import qs from 'querystring'
import SearchList from './Search/SearchList'
import Bangumi from './Search/Bangumi'
import { iptoggle } from './Common/IpToggle'
// import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// 初始化搜索内容
var search_text = ''
class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            list: [],
            history: [],
            isloading: false,
            page: ''
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleTagClose = this.handleTagClose.bind(this)
        this.handleTagChange = this.handleTagChange.bind(this)
    }
    handleSearch(val){
        if(!val){
            return
        }
        var saerch_history = localStorage.getItem('search-history')
        var history = null
        if(!saerch_history){
            history = [val]
        }else{
            history = saerch_history.split(',')
            history.push(val)
            history = Array.from(new Set(history))
        }
        localStorage.setItem('search-history', history)
        this.setState({
            history
        })
        if(iptoggle){
            axios.get('http://satan.viphk.ngrok.org?aim=search&&val='+val).then(res=>{
                var data = res.data
                this.setState({
                    list: data,
                    isloading: false //获取搜索结果之后就要进行渲染，取消加载状态
                })
            })
        }else{
            axios.get('http://localhost:4000?aim=search&&val='+val).then(res=>{
                var data = res.data
                this.setState({
                    list: data,
                    isloading: false //获取搜索结果之后就要进行渲染，取消加载状态
                })
            })
        }
        
    }
    UNSAFE_componentWillMount(){
        var searchtext = this.props.location.search.replace('?', '')
        var { val } = qs.parse(searchtext)
        search_text = val
        if(val){
            // 说明是进行了跳转
            this.setState({
                isloading: true
            })
            this.handleSearch(val)
        }
        var saerch_history = localStorage.getItem('search-history')
        var history = []
        if(saerch_history){
            // 说明有历史记录
            history = saerch_history.split(',')
        }
        history = Array.from(new Set(history))
        this.setState({
            history
        })
    }
    handleClick(event){
        var val = event.target.textContent
        search_text = val
        // 这个时候肯定是处于加载状态
        this.setState({
            isloading: true
        })
        this.handleSearch(val)
    }
    handleTagClose(e){
        // 说明要关闭这个标签
        var el = e.target
        function getparentNode(node){
            if(node.nodeName === 'SPAN'){
                return node.textContent
            }
            return getparentNode(node.parentNode)
        }
        var val = getparentNode(el)
        var history = localStorage.getItem('search-history').split(',')
        history = history.filter(el=>el !== val)
        this.setState({
            history
        })
        localStorage.setItem('search-history', history)
    }
    handleTagChange(e){
        var val = e.target.value
        this.setState({
            page: val
        })
    }
    // 控制页面的切换
    handlePageReflash(p, list){
        // console.log(search_text)
        var page = p || 'video'
        switch(page){
            case 'video':
                return (
                    <SearchList state={{list, search_text}}></SearchList>
                )
            case 'media_bangumi':
                return (
                    <Bangumi list={list} type='media_bangumi'></Bangumi>
                )
            case 'media_ft':
                return (
                    <Bangumi list={list} type='media_ft'></Bangumi>
                )
            default:
                // return (
                //     <SearchList list={list}></SearchList>
                // )
        }
    }
    render(){
        var { list, history, isloading, page } = this.state
        if(isloading){
            // 这个时候会属于loading状态
            return (
                <div className='common-loading'>
                    <Spin tip='Loading...' size='large'></Spin>
                </div>
            )
        }
        if(list.length){
            // console.log(list)
            return (
                <div className='common-body'>
                    <Input.Search placeholder='搜索视频...' style={{width: 200, marginTop: 50}} onSearch={this.handleSearch}></Input.Search>
                    <div className='search-tag'>
                        <Radio.Group defaultValue='video' onChange={this.handleTagChange}>
                            {list.map(el=>(
                                <Radio.Button value={el.result_type} key={el.result_type}>{handleType(el.result_type)}</Radio.Button>
                            ))}
                        </Radio.Group>
                    </div>
                    {this.handlePageReflash(page, list)}
                </div>
            )
        }else if(history.length){
            return (
                <div className='common-body'>
                    <h1 style={{marginTop: 50}}>Wonderful video, waiting for you to search ...</h1>
                    <Input.Search placeholder='Search for video ...' style={{width: 200, marginTop: 50}} onSearch={this.handleSearch}></Input.Search>
                    <div className='search-history' onClick={this.handleClick}>
                        <p className='history-list'>search history:</p>
                        {history.map(el=>(
                            <Tag closable key={el} color='green' onClose={this.handleTagClose}>{el}</Tag>
                        ))}
                    </div>
                </div>
            )
        }else{
            return (
                <div className='common-body'>
                    <h1 style={{marginTop: 50}}>Wonderful video, waiting for you to search ...</h1>
                    <Input.Search placeholder='Search for video ...' style={{width: 200, marginTop: 50}} onSearch={this.handleSearch}></Input.Search>
                    <div className='search-history'>
                        <p className='history-list'>No search history...</p>
                    </div>
                </div>
            )
        }
    }
}
export default Search