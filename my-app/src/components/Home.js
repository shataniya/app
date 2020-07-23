import React from 'react'
import { Carousel, Spin } from 'antd'
import './common.css'
import './Home/Home.css'
// components
import Couter from './Home/Couter'
class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            imgArr: [
                {
                    id: '01',
                    src: 'http://cdn.cnbj1.fds.api.mi-img.com/mi-mall/b830faf6f15af779b581cd6182a07bc3.jpg?w=2452&h=920',
                    alt: '小米手机'
                },
                {
                    id: '02',
                    src: 'http://cdn.cnbj1.fds.api.mi-img.com/mi-mall/755aca9487082e7698e16f17cfb70839.jpg?w=2452&h=920',
                    alt: '小米手表'
                },
                {
                    id: '03',
                    src: 'http://cdn.cnbj1.fds.api.mi-img.com/mi-mall/e52c3e98602b90f198ec316dce253cba.jpg?w=2452&h=920',
                    alt: '小米电视'
                }
            ],
            images: []
        }
        this.handleError = this.handleError.bind(this)
    }
    handleError(){
        console.log('is error')
    }
    UNSAFE_componentWillMount(){
        var { imgArr } = this.state
        var images = []
        imgArr.forEach(el=>{
            var image = new Image()
            image.src = el.src
            image.onload = ()=>{
                // 说明图片加载完成
                images.push(image)
                this.setState({
                    images
                })
            }
        })
    }
    render(){
        var { images, imgArr } = this.state
        // 判断是不是图片已经加载完成
        if(images.length === 3){
            return (
                <div className='common-body' onError={this.handleError}>
                    <Carousel autoplay>
                        {imgArr.map(el=>(
                            <img className='home-carousel-img' key={el.id} src={el.src} data-src={el.src} alt={el.alt} />
                        ))}
                    </Carousel>
                    <Couter></Couter>
                </div>
            )
        }else{
            return (
                <div className='common-loading' onError={this.handleError}>
                    <Spin tip='Loading...' size='large'></Spin>
                </div>
            )
        }
    }
}
export default Home