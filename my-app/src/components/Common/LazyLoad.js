import React from 'react'
import './LazyLoad.css'
import { Spin } from 'antd'
// threshold
const threshold = [0.01]
class LazyLoad extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            io: null,
            refs: null,
            images: null,
            loading: true
        }
        this.handleonload = this.handleonload.bind(this)
    }
    UNSAFE_componentWillMount(){
        var {ImgClassName, src, alt, ImgStyle } = this.props.state
        var images = []
        var refs = []
        const ref = React.createRef()
        refs.push(ref)
        images.push(
            <img className={ImgClassName} ref={ref} data-src={src} alt={alt} style={{...ImgStyle}} />
        )
        this.setState({
            refs,
            images
        })
    }
    componentDidMount(){
        const io = new IntersectionObserver(entries=>{
            entries.forEach(item=>{
                if(item.intersectionRatio <= 0) return
                var { src } = this.props.state
                const { target } = item
                var image = new Image()
                image.src = src
                image.onload = ()=>{
                    this.setState({ loading: false })
                    target.src = target.dataset.src
                }
            })
        },{
            threshold
        })
        this.setState({ io })
    }
    handleonload(){
        var { io, refs } = this.state
        refs.forEach(item=>{
            io.observe(item.current)
        })
    }
    render(){
        var { BoxClassName, width, height, BoxStyle } = this.props.state
        var { images, loading } = this.state
        return (
            <div className={BoxClassName} style={{width, height, ...BoxStyle}}>
                <Spin spinning={loading}>
                    {images}
                    <img onError={this.handleonload} src='' alt='lazyload' style={{display: 'none'}} />
                </Spin>
            </div>
        )
    }
}
export default LazyLoad