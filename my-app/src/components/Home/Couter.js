import React from 'react'
import { connect } from 'react-redux'
import { increaseCouter, reduceCouter } from '../../store/action'
// antd
import { Button } from 'antd'

class Couter extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        var { state, ClickToIncrease, ClickToReduce } = this.props
        return (
            <div>
                <p>{state.getCouter}</p>
                <Button type='primary' onClick={ClickToIncrease}>increase</Button>
                <Button type='danger' onClick={ClickToReduce}>reduce</Button>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        state
    }
}
function mapDispatchToProps(dispatch){
    return {
        ClickToIncrease: ()=>dispatch(increaseCouter()),
        ClickToReduce: ()=>dispatch(reduceCouter())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Couter)