import React, { Component } from "react";
import {
  Form,
  Layout,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Table,
  Pagination,
  DatePicker,
  message,
  Card,
  Menu,
  Switch,
  Tabs
} from "antd";

import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import reqwest from "reqwest";
import cod from "../asserts/css/cod.css";
import "../asserts/css/index.css";
import "../asserts/css/antd.min.css";
import $ from "jquery";
import qs from "qs";

const { Header, Footer, Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const { SubMenu } = Menu;
const { TabPane } = Tabs;
class ImageList extends Component {
  state = {
    pagination: {
      total: 0
    },
    loading: false,
    columns: [
      {
        title: "缩略图",
        dataIndex: "Xray1Path",
        key: "xray1Path",
        render: text => (
          <a onClick={this.ImageProcessing.bind(this, text)}>
            {/* <Link to={`/webgl`}> */}
            <img style={{ width: "80px", height: "40px" }} src={text} />
            {/* </Link> */}
          </a>
        )
      },
      {
        title: "制造商",
        dataIndex: "Manufacturer",
        key: "manufacturer"
      },
      {
        title: "扫描时间",
        dataIndex: "ScanTime",
        key: "scanTime"
        // render: ScanTime => `${ScanTime.first} ${ScanTime.last}`,
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        render: (text, record, index) => (
          <Button onClick={this.imageDetails.bind(this, record)}>详情</Button>
        )
      }
    ],
    data: [
      // {
      //     "ScanTime": "2016-07-19 15:45:54",
      //     "Xray1Path": "http://ip:port/Image/tempImage/55FAF9DB-0BA4-47CA-95C2-8D8B9557EF9B.jpg",
      //     "Manufacturer": "Nuctech3"
      // },
    ],
    openKeys: ["sub1"],
    tabPosition: "left"
  };
  rootSubmenuKeys = ["sub1", "sub2", "sub4"];

  componentDidMount() {
    this.getImagsList();
  }

  getImagsList = (obj = {}) => {
    console.log("obj:", obj);
    let params = {
      pageSize: obj.results,
      pageNumber: obj.page
    };
    // http://127.0.0.1:8000
    // http://10.44.161.217:8000
    axios
      .post("http://10.44.161.217:8000/WebIPS/TaskList", params)
      .then(res => {
        let resultData = res.data.resultData.imageInfo;
        let totalSize = res.data.resultData.totoalSize;
        this.setState({
          data: resultData,
          pagination: {
            total: totalSize
          }
        });
      })
      .catch(function(error) {
        console.log("err");
      });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.getImagsList({
      results: 10,
      page: pagination.current - 1
      // total: this.state.pagination.total
      // sortField: sorter.field,
      // sortOrder: sorter.order,
      // ...filters,
    });
  };

  ImageProcessing = path => {
    let history = this.props.history;
    history.push({
      pathname: "/imageList/webgl",
      state: { path }
    });
    console.log(path);
  };

  Search = () => {
    // e.preventDefault();
    // let userInfo = this.props.form.getFieldsValue();
    // console.log(userInfo)
    this.props.form.validateFields((err, values) => {
      console.log("Received values of form: ", values);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  StartEndTime = (date, dateString) => {
    console.log(date, dateString);
  };

  imageDetails = tex => {
    let path = tex.Xray1Path;
    console.log("tex---", path);
    let history = this.props.history;
    history.push({
      pathname: "/imageList/details",
      state: { path }
    });
  };

  OpenNavigation = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { tabPosition } = this.state;
    return (
      <div>
        <Tabs tabPosition={tabPosition}>
          <TabPane tab={<span><Icon type="mail" />Process</span>} key="1">
            <Layout>
              <Sider className="leftBox">
                <Row>
                  <Col span={24}>
                    {" "}
                    <h2
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        height: "60px",
                        lineHeight: "60px"
                      }}
                    >
                      图像浏览
                    </h2>
                  </Col>
                </Row>
                <Row>
                  <Col className="leftBoxContent" span={24}>
                    <Menu
                      defaultSelectedKeys={["1"]}
                      defaultOpenKeys={["1"]}
                      openKeys={this.state.openKeys}
                      onOpenChange={this.OpenNavigation}
                      mode="inline"
                      theme="dark"
                    >
                      <Menu.Item key="1" title="待 查 验">
                        <Icon type="mail" />
                        待 查 验
                        {/* <NavLink to="//aa"> <Icon type="mail" />待 查 验</NavLink> */}
                      </Menu.Item>
                      <Menu.Item key="2">
                        <Icon type="appstore" />
                        历 史
                      </Menu.Item>
                      <Menu.Item key="3">
                        <Icon type="setting" />
                        本 地
                      </Menu.Item>
                    </Menu>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: "center" }} />
                </Row>
              </Sider>
              <Layout className="RightBox">
                {this.props.children}
                <Header className="topHeader">
                  <h2>图像浏览</h2>
                </Header>
                <Content className="Content-sty">
                  <Card>
                    <Form
                      layout="inline"
                      className="ant-advanced-search-form"
                      onSubmit={this.Search}
                    >
                      <Row>
                        <Col span={24}>
                          <Form.Item label="车牌号">
                            {getFieldDecorator("input1", {
                              initialValue: "",
                              rules: []
                            })(<Input />)}
                          </Form.Item>
                          <Form.Item label="车型">
                            {getFieldDecorator("input2", {
                              initialValue: "",
                              rules: []
                            })(<Input />)}
                          </Form.Item>
                          <Form.Item label="报关单号">
                            {getFieldDecorator("input3", {
                              initialValue: "",
                              rules: []
                            })(<Input />)}
                          </Form.Item>
                          <Form.Item label="集装箱号">
                            {getFieldDecorator("input5", {
                              initialValue: "",
                              rules: []
                            })(<Input />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Form.Item label="任务类型">
                            {getFieldDecorator("input4", {
                              initialValue: "",
                              rules: []
                            })(<Input />)}
                          </Form.Item>
                          <Form.Item label="扫描起止时间">
                            {getFieldDecorator("input8", {
                              initialValue: "",
                              rules: []
                            })(<RangePicker onChange={this.StartEndTime} />)}
                          </Form.Item>
                          {/* <RangePicker onChange={this.onChange} /> */}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24} style={{ textAlign: "right" }}>
                          <Button type="primary" htmlType="submit">
                            查询
                          </Button>
                          <Button
                            style={{ marginLeft: 8 }}
                            onClick={this.handleReset}
                          >
                            清除
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card>

                  <Card>
                    <Table
                      columns={this.state.columns}
                      dataSource={this.state.data}
                      pagination={this.state.pagination}
                      onChange={this.handleTableChange}
                    />
                  </Card>
                </Content>
                {/* <Footer>Footer</Footer> */}
              </Layout>
            </Layout>
          </TabPane>
          <TabPane tab={<span><Icon type="appstore" />History</span>} key="2">
            history
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Form.create()(ImageList);
