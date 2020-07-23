import React from 'react'
import LazyLoad from '../components/Common/LazyLoad'
// import { Button, Alert } from 'antd'
const images = []
for(let i=0; i<4; i++){
    images.push(
        <LazyLoad 
            state={{
                BoxClassName: 'lazyload-img-box',
                ImgClassName: 'lazyload-img',
                src: 'https://pschina.github.io/src/assets/images/'+i+'.jpg',
                alt: i+'.jpg',
                width: 200,
                height: 200
            }}
        ></LazyLoad>
    )
}
class ContentUS extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        return (
            <div>
                <h1>this is ContentUS Component!</h1>
                {images}
            </div>
        )
    }
}
export default ContentUS