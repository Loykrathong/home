import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Card, Row, Table } from 'antd'
import { Form, Button, Col } from 'react-bootstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
const { Content } = Layout;
var data = [];

class secant extends Component {
  componentDidMount() {
    fetch("/secant")
      .then(res => res.json())
      .then(json => {
        this.setState({ items: json });
      });
  }
  constructor() {
    super();
    this.state = { items: [], check: false, Xold: 0, Xnew: 0, function: " " }
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
    this.setState({ Xold: event.target.value })
  }
  onChangeVariableXl = (event) => {
    this.setState({ Xnew: event.target.value })
  }
  onExample() {
    this.componentDidMount();
    this.setState(this.setState({
      function: this.state.items.Function,
      Xold: this.state.items.XOLD,
      Xnew: this.state.items.XNEW
    }))
  }

  onSubmit() {
    if (this.state.Xold < this.state.Xnew) {
      var sum = parseFloat(1)
      var n = 0
      var xold = this.state.Xold, xnew = this.state.Xnew
      var fxold,fxnew
      var inputy = []
      inputy['xold'] = []
      inputy['xnew'] = []
      inputy['xnew2'] = []
      inputy['error'] = []
      inputy['xold'][n] = parseFloat(xold)
      inputy['xnew'][n] = parseFloat(xnew)
      fxold = this.funcChange(xold)
      fxnew = this.funcChange(xnew)
      inputy['xnew2'][n] = inputy['xnew'][n]-(((fxnew*inputy['xnew'][n])-(fxnew*inputy['xold'][n]))/(fxnew-fxold))
      sum = this.funcError( inputy['xnew2'][n],inputy['xnew'][n])
      inputy['error'][n] = sum

      do {
        n++;
        xold = parseFloat(inputy['xnew'][n-1])
        xnew = parseFloat(inputy['xnew2'][n-1])
        inputy['xold'][n] = xold
        inputy['xnew'][n] = xnew
        fxold = this.funcChange(['xold'][n])
        fxnew = this.funcChange(['xnew'][n])
        inputy['xnew2'][n] = inputy['xnew'][n]-(((fxnew*inputy['xnew'][n])-(fxnew*inputy['xold'][n]))/(fxnew-fxold))
        sum = this.funcError( inputy['xnew2'][n],inputy['xnew'][n])
        inputy['error'][n] = sum
      } while (sum > 0.000001)
      this.setState({ check: true })
      this.createTable(inputy['xold'], inputy['xnew'], inputy['xnew2'], inputy['error']);
    }
    else {

    }


  }
  funcChange = (X) => { let scope = { x: parseFloat(X) }; var expr = compile(this.state.function); return expr.evaluate(scope) }
  funcError = (Xnew, Xold) => { return abs((Xnew - Xold) / Xnew) }
  createTable(xold, xnew, xnew2, error) {
    for (var i = 0; i < error.length; i++) {
      data.push({
        iteration: i,
        xold: xold[i],
        xnew: xnew[i],
        xnew2: xnew2[i],
        error: error[i],
      });
    }
  }

  render() {

    return (
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Secant</Breadcrumb.Item>
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
                <h2 className="text-white">X</h2>
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" placeholder={this.state.Xold} onChange={this.onChangeVariableXl} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="VariableXlBisection">
              <Form.Label column sm="2">
                <h2 className="text-white">X+1</h2>
              </Form.Label>
              <Col sm="2">
                <Form.Control type="text" placeholder={this.state.Xnew} onChange={this.onChangeVariableXr} />
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
    title: "xi",
    dataIndex: "xold",
    key: "kxold"
  },
  {
    title:  "xi+1",
    dataIndex: "xnew",
    key: "kxnew"
  },
  {
    title: "xi+2",
    dataIndex: "xnew2",
    key: "kxm"
  },
  {
    title: "Error",
    key: "kerror",
    dataIndex: "error"
  }
];
export default secant