import React from 'react'
import Reply from './Reply'
import { Icon, Button } from 'antd'
import { handlePubdate } from '../../tool'
import LazyLoadingImg from '../Common/LazyLoadingImg'
class Comment extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        var { comments } = this.props
        if(comments){
            return (
                <div className='player-comment'>
                    {comments.map((comment, index)=>(
                        <div className='comment-item' key={index}>
                            <LazyLoadingImg 
                                state={{
                                    nodeName: 'aside',
                                    BoxClassName: 'comment-item-avatar',
                                    src: comment.avatar,
                                    alt: comment.uname
                                }}
                            ></LazyLoadingImg>
                            <section className='comment-item-body'>
                                <p className='comment-user'>{comment.uname}</p>
                                <p className='comment-text'>{comment.message}</p>
                                <p className='comment-pudate'>
                                    <span className='comment-ctime'>{handlePubdate(comment.ctime)}</span>
                                    <span className='comment-like'>
                                        <Icon type='like' /> {comment.like}
                                    </span>
                                    <Button type='primary' size='small' className='comment-reply-btn'>回复</Button>
                                </p>
                                <Reply comment={comment.replies}></Reply>
                            </section>
                        </div>
                    ))}
                </div>
            )
        }else{
            return (
                <div className='player-comment'></div>
            )
        }
    }
}
export default Comment