import React from 'react'
import { Spin } from 'antd'
class LazyLoadingImg extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true
        }
        this.handleInitImg = this.handleInitImg.bind(this)
        this.handleInitImg() // 在这里就立即初始化图片
    }
    handleInitImg(){
        var { src } = this.props.state
        var image = new Image()
        image.src = src
        image.onload = ()=>{
            this.setState({
                loading: false
            })
        }
    }
    render(){
        var { nodeName, src, alt, BoxClassName, ImgClassName }  = this.props.state
        var { loading } = this.state
        if(!nodeName){
            return (
                <div className={BoxClassName}>
                    <Spin spinning={loading}>
                        <img src={src} alt={alt} className={ImgClassName} />
                    </Spin>
                </div>
            )
        }
        if(nodeName === 'ASIDE' || nodeName === 'aside'){
            return (
                <aside className={BoxClassName}>
                    <Spin spinning={loading}>
                        <img src={src} alt={alt} className={ImgClassName} />
                    </Spin>
                </aside>
            )
        }
        
    }
}
export default LazyLoadingImg