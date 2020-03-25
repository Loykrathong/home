import React, { Component } from 'react';
import './App.css';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Route, Link, BrowserRouter } from 'react-router-dom';
import bisection from './components/bisection';
import falseposition from './components/falesposition';
import onepoint from './components/onepoint';
import newton from './components/newton';
import secant from './components/secant';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key><Link to="/">Home</Link></Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <SubMenu
                  key="sub1"
                  title={
                    <span>
                      <Icon type="user" />
                      Root of equation
                  </span>
                  }
                >
                  <Menu.Item key="1"><Link to="/bisection">Bisection</Link></Menu.Item>
                  <Menu.Item key="2"><Link to="/falseposition">Falseposition</Link></Menu.Item>
                  <Menu.Item key="3"><Link to="/onepoint">Onepoint</Link></Menu.Item>
                  <Menu.Item key="4"><Link to="/newton">Newton-Raphson</Link></Menu.Item>
                  <Menu.Item key="5"><Link to="/secant">Secant</Link></Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub2"
                  title={
                    <span>
                      <Icon type="laptop" />
                      subnav 2
                  </span>
                  }
                >
                  <Menu.Item key="6">option6</Menu.Item>
                  <Menu.Item key="7">option7</Menu.Item>
                  <Menu.Item key="8">option8</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub3"
                  title={
                    <span>
                      <Icon type="notification" />
                      subnav 3
                  </span>
                  }
                >
                  <Menu.Item key="9">option9</Menu.Item>
                  <Menu.Item key="10">option10</Menu.Item>
                  <Menu.Item key="11">option11</Menu.Item>
                  <Menu.Item key="12">option12</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <div>
              <switch>
                <Route exact path="/bisection" component={bisection} />
                <Route exact path="/falseposition" component={falseposition} />
                <Route exact path="/onepoint" component={onepoint} />
                <Route exact path="/newton" component={newton} />
                <Route exact path="/secant" component={secant} />
              </switch>
            </div>
          </Layout>
        </Layout>
      </BrowserRouter>
    )
  }
}

export default App;