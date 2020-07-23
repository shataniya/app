import React from 'react'
import { handledate, handleTitle } from '../../tool'
import { Tag, Button, Icon } from 'antd'
// import LazyLoadingImg from '../Common/LazyLoadingImg'
import LazyLoad from '../Common/LazyLoad'
import { Link } from 'react-router-dom'
class Bangumi extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        this.handlEpsTag = this.handlEpsTag.bind(this)
        this.handleBangumiTagClick = this.handleBangumiTagClick.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }
    handleBangumiTagClick(eps, index){
        // console.log(eps)
        // var data = eps[index]
        var data = eps
        var path = {
            pathname: '/search/bangumi',
            state: { data, index }
        }
        return path
    }
    handleButtonClick(list){
        var path = {
            pathname: '/search/bangumi',
            state: { list }
        }
        return path
    }
    handlEpsTag(eps, type, list){
        // console.log(eps)
        if(!eps.length){
            if(type === 'media_ft'){
                // 说明是电影
                return (
                    <div className='bangumi-info-button'>
                        <Button type="primary" shape="round">
                            <Link to={this.handleButtonClick(list)}>
                                <Icon type="play-circle" theme="filled" /> 立即观看
                            </Link>
                        </Button>
                    </div>
                )
            }
            return
        }
        // 说明是番剧
        if(eps.length > 21){
            return (
                <div className='bangumi-info-tag-over'>
                    {eps.map((el, index)=>(
                        <Tag color='purple' key={el.id} style={{marginBottom: 8}}>
                            <Link to={this.handleBangumiTagClick(eps, index)}>{index+1}</Link>
                        </Tag>
                    ))}
                </div>
            )
        }
        return (
            <div className='bangumi-info-tag'>
                {eps.map((el, index)=>(
                    <Tag color='purple' key={el.id} style={{marginBottom: 8}}>
                        <Link to={this.handleBangumiTagClick(eps, index)}>{index+1}</Link>
                    </Tag>
                ))}
            </div>
        )
    }
    render(){
        var { list, type } = this.props
        var media_type = type || 'media_bangumi'
        var lists = list.filter(el=>el.result_type === media_type)[0].data
        // console.log(lists)
        return (
            <div className='search-bangumi'>
                {lists.map(el=>(
                    <div className='bangumi-item' key={el.media_id}>
                        {/* <LazyLoadingImg 
                            state={{
                                nodeName: 'aside',
                                BoxClassName: 'bangumi-avatar',
                                ImgClassName: 'bangumi-img', 
                                src: el.cover, 
                                alt: el.title
                            }}>
                        </LazyLoadingImg> */}
                        <LazyLoad 
                            state={{
                                BoxClassName: 'bangumi-avatar',
                                ImgClassName: 'bangumi-img', 
                                src: el.cover, 
                                alt: el.title
                            }}
                        ></LazyLoad>
                        <section className='bangumi-info'>
                            <h1 className='bangumi-info-headline'>
                                <Tag color='magenta'>{el.season_type_name}</Tag>
                                <span className='bangumi-info-title'>{handleTitle(el.title)}</span>
                            </h1>
                            <div className='bangumi-info-line'>
                                <p className='info-line-left'>
                                    <span className='label'>风格：</span>
                                    <span className='value'>{el.styles}</span>
                                </p>
                                <p className='info-line-right'>
                                    <span className='label'>地区：</span>
                                    <span className='value'>{el.areas}</span>
                                </p>
                            </div>
                            <div className='bangumi-info-line'>
                                <p className='info-line-left'>
                                    <span className='label'>开播时间：</span>
                                    <span className='value'>{handledate(el.pubtime)}</span>
                                </p>
                                <p className='info-line-right'>
                                    <span className='label'>声优：</span>
                                    <span className='value'>{el.cv}</span>
                                </p>
                            </div>
                            <p className='bangumi-info-desc'>简介：{el.desc}</p>
                            {this.handlEpsTag(el.eps, media_type, el)}
                        </section>
                    </div>
                ))}
            </div>
        )
    }
}
export default Bangumi