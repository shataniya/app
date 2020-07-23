import React from 'react'
// react-router-dom
import { Route, Switch, HashRouter as Router } from 'react-router-dom' 
// component
import Option from './About/Option'
import Option1 from './About/Option1'
import Option2 from './About/Option2'
import Option3 from './About/Option3'
import Option4 from './About/Option4'
import { Row, Col, Menu } from 'antd'
import { iptoggle } from './Common/IpToggle'
const { SubMenu }  = Menu

// tool
function pushHistory(val){
    var base_url = ''
    if(iptoggle){
        base_url = 'http://sha.viphk.ngrok.org/about#'
    }else{
        base_url = 'http://localhost:3000/about#'
    }
    
    var go_url = ''
    switch(val){
        case 'Option 1':
            go_url = '/option1'
            break
        case 'Option 2':
            go_url = '/option2'
            break
        case 'Option 3':
            go_url = '/option3'
            break
        case 'Option 4':
            go_url = '/option4'
            break
        default:
    }
    window.location.href = base_url + go_url
}

class About extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            openKeys: ['sub1']
        }
        this.rootSubmenuKeys = ['sub1', 'sub2', 'sub4']
        this.onOpenChange = this.onOpenChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }
    onOpenChange(openKeys){
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.setState({ openKeys })
        } else {
          this.setState({
            openKeys: latestOpenKey ? [latestOpenKey] : [],
          })
        }
      }
    handleSelect({ item }){
        var select = item.props.children
        pushHistory(select)
    }
    render(){
        return (
            <Router>
                <div className='about-body'>
                    <Row>
                        <Col span={6}>
                            <Menu
                                mode="inline"
                                openKeys={this.state.openKeys}
                                onOpenChange={this.onOpenChange}
                                style={{ width: 256 }}
                                theme='dark'
                                onSelect={this.handleSelect}
                            >
                                <SubMenu
                                key="sub1"
                                title={
                                    <span>1. Navigation One</span>
                                }
                                >
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                key="sub2"
                                title={
                                    <span>2. Navigation Two</span>
                                }
                                >
                                <Menu.Item key="5">Option 5</Menu.Item>
                                <Menu.Item key="6">Option 6</Menu.Item>
                                <SubMenu key="sub3" title="Submenu">
                                    <Menu.Item key="7">Option 7</Menu.Item>
                                    <Menu.Item key="8">Option 8</Menu.Item>
                                </SubMenu>
                                </SubMenu>
                                <SubMenu
                                key="sub4"
                                title={
                                    <span>3. Navigation Three</span>
                                }
                                >
                                <Menu.Item key="9">Option 9</Menu.Item>
                                <Menu.Item key="10">Option 10</Menu.Item>
                                <Menu.Item key="11">Option 11</Menu.Item>
                                <Menu.Item key="12">Option 12</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Col>
                        <Col span={18}>
                            <Switch>
                                <Route exact path='/' component={Option}></Route>
                                <Route path='/option1' component={Option1}></Route>
                                <Route path='/option2' component={Option2}></Route>
                                <Route path='/option3' component={Option3}></Route>
                                <Route path='/option4' component={Option4}></Route>
                            </Switch>
                        </Col>
                    </Row>
                </div>
            </Router>
        )
    }
}
export default About