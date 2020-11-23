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

import { NavLink, Link,Route} from "react-router-dom";
import { UserOutlined,LogoutOutlined } from "@ant-design/icons";
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
        title: "Image",
        dataIndex: "jpg_path",
        key: "xray1Path",
        render: (text,record,index) => (
          <a onClick={this.ImageProcessing.bind(this,text,record,index)}>          
            <img style={{ width: "80px", height: "40px" }} src={text} />
          </a>
        )
      },
      {
        title: "plate_number",
        dataIndex: "unitid",
        key: "plate_number",
        
      },
      {
        title: "picno",
        dataIndex: "picno",
        key: "picno",
       
      },
      {
        title: "扫描时间",
        dataIndex: "scan_time",
        key: "scanTime"
        // render: ScanTime => `${ScanTime.first} ${ScanTime.last}`,
      },
      // {
      //   title: "操作",
      //   dataIndex: "",
      //   key: "action",
      //   render: (text, record, index) => (
      //     <Button onClick={this.imageDetails.bind(this, record)}>详情</Button>
      //   )
      // }
    ],
    columnsHist: [
      {
        title: "Image",
        dataIndex: "jpg_path",
        key: "xray1Path",
        render: (text,record,index) => (
          <a onClick={this.ImageProcessing.bind(this,text,record,index)}>
            
            <img style={{ width: "80px", height: "40px" }} src={text} />
            
          </a>
        )
      },
      {
        title: "plate_number",
        dataIndex: "plate_number",
        key: "plate_number",
        
      },
      {
        title: "picno",
        dataIndex: "picno",
        key: "picno",
       
      },
      {
        title: "扫描时间",
        dataIndex: "scan_time",
        key: "scanTime"
        // render: ScanTime => `${ScanTime.first} ${ScanTime.last}`,
      },
    ],
    data: [],
    dataHist: [],
    openKeys: ["sub1"],
    tabPosition: "left",
    username:'',
    qzTime0:'',
    qzTime1:'',
    inputVal1:''
  };
  rootSubmenuKeys = ["sub1", "sub2", "sub4"];

  componentDidMount() {
   
    this.getImagsList();
    this.getImagsListHist();
  }

  getImagsList = (obj = {}) => {
    console.log("obj:", obj);
    // console.log( "123456789---",this.props.location.state.name);
    let history = this.props.history;
    if (this.props.location.state == undefined) {
      // if (this.props.location.state.name != ) {

      // }
      //history.push({ pathname: "/" });
    } else {
      this.setState({
        username: this.props.location.state.name
      })
    }

    let params = {
      pageSize: obj.results,
      pageNumber: obj.page
    };
    // http://127.0.0.1:8000
    // http://10.44.161.217:8000
    axios
      .post("http://10.44.161.217:5050/WebIPS/GetTask")
      .then(res => {
        // let resultData = res.data.resultData.imageInfo;
        let resultData = res.data.resultData;
        let totalSize = res.data.resultData.totoalSize;
        this.setState({
          data: resultData,
          // pagination: {
          //   total: totalSize
          // }
        });
      })
      .catch(function(error) {
        console.log("err");
      });
  };

  getImagsListHist = (obj) => {
    console.log("objHist--:", obj);
    // console.log( "123456789---",this.props.location.state.name);
    let history = this.props.history;
    if (this.props.location.state == undefined) {
      // if (this.props.location.state.name != ) {
      // }
     // history.push({ pathname: "/" });
    } else {
      this.setState({
        username: this.props.location.state.name
      })
    }

    console.log(this.state.qzTime0)
    let params = {
      // pageSize: obj.results,
      // pageNumber: obj.page,
      condition: this.state.inputVal1,
      time_from: this.state.qzTime0,
      time_to: this.state.qzTime1,
      pageNum: obj == undefined?"0":obj.page,
      pageSize:"10"
    };
    // http://127.0.0.1:8000
    // http://10.44.161.217:8000
    axios
      .post("http://10.44.161.217:5050/WebIPS/SearchHistory",params,{
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      })
      .then(res => {
        // let resultData = res.data.resultData.imageInfo;
        let resultData = res.data.resultData;
        let totalSize = res.data.totalSize;
        this.setState({
          dataHist: resultData,
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
    // this.getImagsList({
    //   results: 10,
    //   page: pagination.current - 1
      
    // });
  };
 
  handleTableChangeHist = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.getImagsListHist({
      results: 10,
      page: pagination.current - 0
      // total: this.state.pagination.total
      // sortField: sorter.field,
      // sortOrder: sorter.order,
      // ...filters,
    });
  };

  ImageProcessings = pathss => {
    console.log('picon--------',pathss)
  }

  ImageProcessing = (paths,name,name2) => {
    //this.ImageProcessings();
    console.log('=======',paths)
    console.log('=======',name.picno)

    console.log('=======',name2)
    let history = this.props.history;
    history.push({
      pathname: "/imageList/webgl",
      state: { path: name.picno, username: this.state.username }
    });

  };

  toLogin = () => {
    let history = this.props.history;
    history.push({
      pathname: "/",
      // state: { path: paths, name: "200" }
    });
  }

  historySear = (e) => {
     e.preventDefault();
    // let userInfo = this.props.form.getFieldsValue();
    // console.log(userInfo)
    this.props.form.validateFields((err, values) => {
      console.log("Received values of form: ", values.input1);
      // this.setState({
        this.state.inputVal1= values.input1
      // })
      this.getImagsListHist()
    });
   
    
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  StartEndTime = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      qzTime0: dateString[0],
      qzTime1: dateString[1]
    })
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
        <div
          style={{
            background: "#698cc2",
            lineHeight: "calc(5vh)",
            padding: "0 25px"
          }}
        >
          <span style={{ color: "#fff",display:'inline-block',lineHeight:'50px',fontSize:'28px'}}>IMAGE ANALYZE SYSTEM</span>
          <span style={{ color: "#fff",display:'inline-block',lineHeight:'50px',fontSize:'25px',float: 'right'}}>
             
             <span style={{ color: "#fff",display:'inline-block',lineHeight:'50px',width:'100px'}}>
               <UserOutlined />
               <span style={{ color: "#fff",display:'inline-block',lineHeight:'50px',width:'10px'}}></span>
                {this.state.username}
               </span>  
               <LogoutOutlined  onClick={this.toLogin}/>
            {/* <Button onClick={this.toLogin}>Drop out</Button> */}
          </span>
        </div>

        <Tabs tabPosition={tabPosition}>
          <TabPane
            tab={
              <div style={{ width: "100%" }}>
                <Icon type="mail" />Process
              </div>
            }
            key="1"
          >
            <Layout>
              <Layout className="RightBox">
                {this.props.children}
                <Header className="topHeader">
                  <h2>图像浏览</h2>
                </Header>
                <Content className="Content-sty">
                  <Card>
                    <Table
                      columns={this.state.columns}
                      dataSource={this.state.data}
                      pagination={this.state.pagination}
                      onChange={this.handleTableChange}
                      style={{fontSize: '20px'}}
                    />
                  </Card>
                </Content>
                {/* <Footer>Footer</Footer> */}
              </Layout>
            </Layout>
          </TabPane>
          <TabPane
            tab={
              <div>
                <Icon type="appstore" />History
              </div>
            }
            key="2"
          >
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
                    onSubmit={this.historySear}
                  >
                    <Row>
                      <Col>
                        <Form.Item label="">
                          {getFieldDecorator("input1", {
                            initialValue: "",
                            rules: []
                          })(<Input placeholder="Please enter serial number" style={{ width: "500px" }}/>)}
                        </Form.Item>
                        {/* <Form.Item label="车型">
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
                        </Form.Item> */}
                        <Form.Item label="">
                          {getFieldDecorator("input8", {
                            initialValue: "",
                            rules: []
                          })(<RangePicker onChange={this.StartEndTime} />)}
                        </Form.Item>
                        <Button type="primary" htmlType="submit" style={{marginTop: '3px'}}>
                          查询
                        </Button>
                        <Button
                          style={{ marginTop: 3,marginLeft:5 }}
                          onClick={this.handleReset}
                        >
                          清除
                        </Button> 
                      </Col>
                    </Row>
                    {/* <Row>
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
                        
                      </Col>
                    </Row> */}
                    {/* <Row> */}
                      {/* <Col span={24} style={{ textAlign: "right" }}> */}
                        {/* <Button type="primary" htmlType="submit">
                          查询
                        </Button>
                        <Button
                          style={{ marginLeft: 8 }}
                          onClick={this.handleReset}
                        >
                          清除
                        </Button> */}
                      {/* </Col> */}
                    {/* </Row> */}
                  </Form>
                </Card>

                <Card>
                  <Table
                    columns={this.state.columnsHist}
                    dataSource={this.state.dataHist}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChangeHist}
                    style={{fontSize: '20px'}}
                  />
                </Card>
              </Content>
              {/* <Footer>Footer</Footer> */}
            </Layout>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Form.create()(ImageList);
