import React from 'react'
import { handleView } from '../../tool'
import LazyLoadingImg from '../Common/LazyLoadingImg'
import { Icon, Pagination } from 'antd'
import axios from 'axios'
import { iptoggle } from '../Common/IpToggle'
class SearchList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true, // 页面的加载loading
            search_list: null // 点击数据分页之后会更新搜索结果
        }
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.handleSearchList = this.handleSearchList.bind(this)
    }
    handlePaginationChange(page){
        var { search_text } = this.props.state
        // console.log(search_text)
        if(iptoggle){
            axios.get('http://satan.viphk.ngrok.org?aim=search&&val='+search_text+'&&page='+page).then(res=>{
                var data = res.data.filter(el=>el.result_type === 'video')[0].data
                // console.log(data)
                this.setState({
                    search_list: data
                })
            })
        }else{
            axios.get('http://localhost:4000?aim=search&&val='+search_text+'&&page='+page).then(res=>{
                var data = res.data.filter(el=>el.result_type === 'video')[0].data
                // console.log(data)
                this.setState({
                    search_list: data
                })
            })
        }
        
    }
    handleSearchList(list){
        var lists = (list.map(el=>(
            <a className='search-item' key={el.id} href={'/search/player?arcurl='+el.arcurl+'&&tag='+el.tag}>
                <LazyLoadingImg 
                    state={{
                        BoxClassName: 'search-item-header',
                        ImgClassName: 'search-item-img',
                        src: 'http:'+el.pic,
                        alt: el.typename
                    }}
                ></LazyLoadingImg>
                <div className='search-item-body'>
                    <p className='search-item-date'>
                        <span><Icon type="play-circle" theme="filled" /> {handleView(el.play)}</span>
                        <span><Icon type="clock-circle" theme="filled" /> {el.duration}</span>
                    </p>
                    <p className='search-item-author'><Icon type="twitter-circle" theme="filled" /> {el.author}</p>
                </div>
            </a>
        )))
        return lists
    }
    render(){
        // console.log(this.props)
        var { list } = this.props.state
        var { search_list } = this.state
        var lists = list.filter(el=>el.result_type === 'video')[0].data
        if(search_list){
            lists = search_list
        }
        return (
            // duration play
            <div className='search-list'>
                {this.handleSearchList(lists)}
                <div className='search-pagination'>
                    <Pagination defaultPageSize={20} total={1000} onChange={this.handlePaginationChange}></Pagination>
                </div>
            </div>
        )
    }
}
export default SearchList