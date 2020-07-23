import React from 'react'
import { Icon, Button } from 'antd'
import { handlePubdate } from '../../tool'
class Reply extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        var { comment } = this.props
        if(comment){
            // console.log(comment)
            return (
                <div className='comment-reply-box'>
                    {comment.map((rep, index)=>(
                        <div className='reply-item' key={index}>
                            <aside className='reply-item-avatar'>
                                <img src={rep.avatar} alt={rep.uname} />
                            </aside>
                            <section className='reply-item-body'>
                                <p className='reply-item-user'>
                                    <span className='reply-name'>{rep.uname}</span>
                                    <span className='reply-text'>{rep.message}</span>
                                </p>
                                <p className='reply-item-date'>
                                    <span className='comment-ctime'>{handlePubdate(rep.ctime)}</span>
                                    <span className='comment-like'>
                                        <Icon type='like' /> {rep.like}
                                    </span>
                                    <Button type='primary' size='small' className='comment-reply-btn'>回复</Button>
                                </p>
                            </section>
                        </div>
                    ))}
                </div>
            )
        }else{
            return (
                <div className='comment-reply-box'></div>
            )
        }
    }
}
export default Reply