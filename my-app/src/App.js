import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Select } from 'antd'
// const Option = Select.Option
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import Home from './components/Home'
import Search from './components/Search'
import About from './components/About'
import ContentUS from './components/ContentUS'
import Player from './components/Search/Player'
import WatchBangumi from './components/Search/WatchBangumi'
import WatchBangumiSub from './components/Search/WatchBangumiSub'
import { iptoggle } from './components/Common/IpToggle'
// redux
import { Provider } from 'react-redux'
// store
import store from './store/store'
class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      history: []
    }
    this.handleSearch = this.handleSearch.bind(this)
  }
  UNSAFE_componentWillMount(){
    var search_history = localStorage.getItem('search-history')
    if(!search_history){
      search_history = '告白气球'
    }
    var history = search_history.split(',')
    this.setState({
      history
    })
  }
  handleSearch(val){
    if(iptoggle){
      window.location.href = 'http://sha.viphk.ngrok.org/search?val='+val
    }else{
      window.location.href = 'http://localhost:3000/search?val='+val
    }
    // 将val存进本地更新搜索的历史记录
    var history = localStorage.getItem('search-history').split(',')
    history.push(val)
    history = Array.from(new Set(history))
    localStorage.setItem('search-history', history)
  }
  render(){
    var { history } = this.state
    return (
      <Router>
        <Provider store={store}>
          <div className="App">
            <header className="App-header">
              <Link to='/home' className='header-item'>Home</Link>
              <Link to='/search' className='header-item'>Search</Link>
              <Link to='/about' className='header-item'>About</Link>
              <Select
                showSearch
                defaultValue='告白气球'
                className='header-item header-last header-search' 
                size='small'
                onSelect={this.handleSearch}>
                {history.map(el=>(
                  <Select.Option value={el} key={el}>{el}</Select.Option>
                ))}
              </Select>
              <Link to='/contentus' className='header-item'>ContentUS</Link>
            </header>
            <Switch>
              <Route exact path='/' component={Home}></Route>
              <Route path='/home' component={Home}></Route>
              <Route exact path='/search' component={Search}></Route>
              <Route path='/search/player' component={Player}></Route>
              <Route path='/search/bangumi' component={WatchBangumi}></Route>
              <Route path='/search/bangumisub' component={WatchBangumiSub}></Route>
              <Route path='/about' component={About}></Route>
              <Route path='/contentus' component={ContentUS}></Route>
            </Switch>
          </div>
        </Provider>
      </Router>
    );
  }
  
}

export default App;
