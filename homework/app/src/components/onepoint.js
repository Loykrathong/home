import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Card, Row, Table } from 'antd'
import { Form, Button, Col } from 'react-bootstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'
const { Content } = Layout;
var fx = [];
var data = [];

class onepoint extends Component {
    componentDidMount() {
        fetch("/onepoint")
          .then(res => res.json())
          .then(json => {
            this.setState({ items: json });
          });
      }
    constructor() {
        super();
        this.state = { items: [], check: false, X: 0, function: " " }
        this.onChangefunction = this.onChangefunction.bind(this)
        this.onChangeVariableX = this.onChangeVariableX.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onExample = this.onExample.bind(this)
    }
    onChangefunction(func) {
        this.setState({ function: func.target.value })
    }
    onChangeVariableX = (event) => {
        this.setState({ X: event.target.value })
    }

    onExample() {
        this.componentDidMount();
        this.setState(this.setState({
          function: this.state.items.Function,
          X: this.state.items.X,
        }))
      }

    onSubmit() {
        if (this.state.function != " ") {
            var sum = parseFloat(0.000000)
            var n = 0
            var x = this.state.X, xnew
            var inputy = []
            inputy['x'] = []
            inputy['x+1'] = []
            inputy['error'] = []

            /* ทำทิ้งเปล่า 1 ครั้ง */
            inputy['x'][n] = parseFloat(x)
            inputy['x+1'][n] = this.funcChange(x)
            xnew = inputy['x+1'][n]
            inputy['error'][n] = 1
            n++;
            /* console.log("Iteration"+n+" "+"xl:"+data['xl'][n]+" "+"xr:"+data['xr'][n]+" "+"xm:"+data['xm'][n]+" "+"error:"+data['error'][n])*/

            /* loop ทำ Iteration*/
            do {
                inputy['x'][n] = xnew
                inputy['x+1'][n] = this.funcChange(xnew)
                xnew = inputy['x+1'][n]
                inputy['error'][n] = this.funcError(xnew, inputy['x'][n])
                sum = this.funcError(xnew, inputy['x'][n])
                n++;
            } while (sum > 0.000001)
            this.setState({ check: true })
            this.createTable(inputy['x'], inputy['x+1'], inputy['error']);
        }
        else {

        }
    }
    funcChange = (X) => { let scope = { x: parseFloat(X) }; var expr = compile(this.state.function); return expr.evaluate(scope) }
    funcError = (Xnew, Xold) => { return abs((Xnew - Xold) / Xnew) }
    createTable(x, x1, error) {
        for (var i = 0; i < x.length; i++) {
            data.push({
                iteration: i,
                x: x[i],
                x1: x1[i],
                error: error[i],
            });
        }
    }



    render() {

        return (
            
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Onepoint</Breadcrumb.Item>
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
                                <Form.Control type="text" placeholder={this.state.X} onChange={this.onChangeVariableX} />
                            </Col>
                        </Form.Group>

                        <div>
                            <Button variant="success" onClick={this.onSubmit}>Enter</Button>
                            <Button variant="secondary" href="/onepoint">Reset</Button>
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
        title: "X",
        dataIndex: "x",
        key: "kx"
    },
    {
        title: "X1",
        dataIndex: "x1",
        key: "kx1"
    },
    {
        title: "Error",
        key: "kerror",
        dataIndex: "error"
    }
];
export default onepoint