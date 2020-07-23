import { combineReducers } from 'redux'
import initState from './state'
// 创建一个reducer，一个reducer就是一个函数
function getCouter(state=initState.count, action){
    switch(action.type){
        case 'INCREASE':
            return state+1
        case 'REDUCE':
            return state-1
        default:
            return state
    }
}
// getNoTalking
function getNoTalking(state=initState.notalking, action){
    switch(action.type){
        case 'OPEN':
            return true
        case 'CLOSE':
            return false
        default:
            return state
    }
}

export default combineReducers({
    getCouter,
    getNoTalking
})