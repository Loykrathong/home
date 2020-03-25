import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Card, Row, Table } from 'antd'
import { Form, Button, Col } from 'react-bootstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
const { Content } = Layout;
var fxr = [], fxl = [], fxm = [];
var data = [];

class bisection extends Component {
  componentDidMount() {
    fetch("/bisection")
      .then(res => res.json())
      .then(json => {
        this.setState({ items: json });
      });
  }
  constructor() {
    super();
    this.state = { items: [], check: false, Xr: 0, Xl: 0, Xm: 0, function: " " }
    this.onChangefunction = this.onChangefunction.bind(this)
    this.onChangeVariableXr = this.onChangeVariableXr.bind(this)
    this.onChangeVariableXl = this.onChangeVariableXl.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onExample = this.onExample.bind(this)
  }
  onChangefunction(func) {
    this.setState({ function: func.target.value })
  }
  onChangeVariableXr = (event) => {
    this.setState({ Xr: event.target.value })
  }
  onChangeVariableXl = (event) => {
    this.setState({ Xl: event.target.value })
  }
  onExample() {
    this.componentDidMount();
    this.setState(this.setState({
      function: this.state.items.Function,
      Xl: this.state.items.XL,
      Xr: this.state.items.XR
    }))
  }

  onSubmit() {
    if (this.state.Xl < this.state.Xr) {
      var sum = parseFloat(0.000000)
      var increaseFunction = false
      var n = 0
      var xm, xl = this.state.Xl, xr = this.state.Xr
      var inputy = []
      inputy['xl'] = []
      inputy['xm'] = []
      inputy['xr'] = []
      inputy['error'] = []

      /* ทำทิ้งเปล่า 1 ครั้ง */
      inputy['xl'][n] = parseFloat(xl)
      inputy['xr'][n] = parseFloat(xr)
      xm = (parseFloat(xl) + parseFloat(xr)) / 2
      inputy['xm'][n] = xm
      inputy['error'][n] = 1
      fxm[n] = xm
      fxr[n] = this.funcChange(xr)
      fxl[n] = this.funcChange(xl)
      increaseFunction = (((fxr[n]) * this.funcChange(xm)) < 0 ? true : false)
      if (increaseFunction) {
        xl = xm
      }
      else {
        xr = xm
      }

      /* console.log("Iteration"+n+" "+"xl:"+data['xl'][n]+" "+"xr:"+data['xr'][n]+" "+"xm:"+data['xm'][n]+" "+"error:"+data['error'][n])*/

      /* loop ทำ Iteration*/
      do {
        inputy['xl'][n + 1] = parseFloat(xl)
        inputy['xr'][n + 1] = xr
        xm = (parseFloat(xl) + parseFloat(xr)) / 2
        fxm[n + 1] = xm
        fxr[n + 1] = this.funcChange(inputy['xr'][n + 1])
        fxl[n + 1] = this.funcChange(inputy['xl'][n + 1])
        increaseFunction = (((fxr[n + 1]) * this.funcChange(xm)) < 0 ? true : false)
        if (increaseFunction) {
          xl = xm
        }
        else {
          xr = xm
        }
        sum = this.funcError(xm, inputy['xm'][n])
        inputy['xm'][n + 1] = xm
        inputy['error'][n + 1] = sum
        n++;

      } while (sum > 0.000001)
      this.setState({ check: true })
      this.createTable(inputy['xl'], inputy['xr'], inputy['xm'], inputy['error']);
    }
    else {
      console.log("Please Input Xl > Xr")
    }


  }
  funcChange = (X) => { let scope = { x: parseFloat(X) }; var expr = compile(this.state.function); return expr.evaluate(scope) }
  funcError = (Xnew, Xold) => { return abs((Xnew - Xold) / Xnew) }
  createTable(xl, xr, xm, error) {
    for (var i = 0; i < xl.length; i++) {
      data.push({
        iteration: i,
        xl: xl[i],
        xr: xr[i],
        xm: xm[i],
        error: error[i],
      });
    }
  }



  render() {

    return (
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Bisection</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Form>
            <Form.Group as={Row} controlId="functionBisection">
              <Form.Label column sm="2">
                <h2 className="text-white">Fucntion</h2>
              </Form.Label>
              <Col sm="2">
                < Form.Control type="text" placeholder={this.state.function} onChange={this.onChangefunction} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="VariableXrBisection">
              <Form.Label column sm="2">
                <h2 className="text-white">Xl</h2>
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" placeholder={this.state.Xl} onChange={this.onChangeVariableXl} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="VariableXlBisection">
              <Form.Label column sm="2">
                <h2 className="text-white">Xr</h2>
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" placeholder={this.state.Xr} onChange={this.onChangeVariableXr} />
              </Col>
            </Form.Group>

            <div>
              <Button variant="success" onClick={this.onSubmit}>Enter</Button>
              <Button variant="secondary" href="/bisection">Reset</Button>
              <Button variant="danger" onClick={this.onExample}>Test</Button>
            </div>

          </Form>
          {this.state.check === true ? <Card
            title={"Output"}
            bordered={true}
            style={tablestyle}
            id="outputCard"
          >
            <Table columns={columns} dataSource={data} bodyStyle={body}
            ></Table>
          </Card>
            : ''}
          {this.state.check === true ? <LineChart
            width={800}
            height={600}
            data={data}
            margin={{
              top: 50, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="iteration" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="error" stroke="#8884d8" />
          </LineChart>
            : ''}

        </Content>
      </Layout>
    )
  }
}
var Textstyle = {
  textAlign: 'center',
  textDecorationLine: 'underline'
}
var tablestyle =
{
  width: "100%", background: "#2196f3", color: "#2196f3", float: "inline-start", marginBlockStart: "2%"
}
var body = {
  fontWeight: "bold", fontSize: "18px", color: "white"
}
const columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "kiteration"
  },
  {
    title: "XL",
    dataIndex: "xl",
    key: "kxl"
  },
  {
    title: "XR",
    dataIndex: "xr",
    key: "kxr"
  },
  {
    title: "Xm",
    dataIndex: "xm",
    key: "kxm"
  },
  {
    title: "Error",
    key: "kerror",
    dataIndex: "error"
  }
];
export default bisection