// action也是一个函数
function increaseCouter(data){
    return function(dispatch, getState){
        dispatch({ type: 'INCREASE', data })
    }
}

function reduceCouter(data){
    return function(dispatch, getState){
        dispatch({ type: 'REDUCE', data })
    }
}

function OpenInput(data){
    return function(dispatch, getState){
        dispatch({ type: 'OPEN', data })
    }
}
function CloseInput(data){
    return function(dispatch, getState){
        dispatch({ type: 'CLOSE', data })
    }
}

const action = {
    increaseCouter,
    reduceCouter,
    OpenInput,
    CloseInput
}

// export default action
module.exports = action