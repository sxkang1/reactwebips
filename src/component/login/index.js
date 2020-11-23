import React, { Component } from "react";
import { Button, Row, Col, Icon, Input, Form, Card, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import $ from "jquery";
import "./index.css";

const FormItem = Form.Item;
class Login extends Component {
  state = {};
  constructor() {
    super();
  }
  componentDidMount() {
    $(document).ready(function() {
      if (window.history && window.history.pushState) {
        $(window).on("popstate", function() {
          // 当点击浏览器的 后退和前进按钮 时才会被触发，
          window.history.pushState("forward", null, "");
          window.history.forward(1);
        });
      }
      window.history.pushState("forward", null, ""); //在IE中必须得有这两行
      window.history.forward(1);
    });
  }
  handleSubmit = e => {
    //提交之前判断输入的字段是否有错误
    e.preventDefault();
    let userInfo = this.props.form.getFieldsValue();
    let params = {
      username: userInfo.userName,
      password: userInfo.userPwd
    };
    let data = qs.stringify(params);
    let url = "http://10.44.161.217:5050/WebIPS/Login";
    console.log(typeof data);

    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      })
      .then(res => {
        console.log(res);
        console.log(res.data.resultCode);

        if (res.data.resultCode === 200 && res.data.resultDesc === "success!") {
          let history = this.props.history;
          this.props.form.validateFields((err, values) => {
            if (!err) {
              message.success(`${userInfo.userName} 恭喜你，登录成功`);
              history.push({
                pathname: "/imageList",
                state: { name: userInfo.userName }
              });
            }
          });
        } else {
          message.error(`${userInfo.userName} 请输入正确的用户名密码`);
        }
      })
      .catch(function(error) {
        console.log("err");
        message.error(`${userInfo.userName} 请输入正确的用户名密码`);
      });

    console.log(userInfo.userName);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="backgroun">
        <Row className="loginBox">
          <Col>
            <Card title={<h2>Image Processing</h2>}>
              <Form layout="horizontal" className="inpsty">
                <FormItem>
                  {getFieldDecorator("userName", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "用户名不能为空"
                      },
                      {
                        min: 1,
                        max: 6,
                        message: "长度不在范围"
                      }
                    ]
                  })(
                    <Input prefix={<Icon type="user" />} placeholder="请输入用户名" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator("userPwd", {
                    initialValue: "",
                    rules: [
                      {
                        required: true,
                        message: "密码不能为空"
                      },
                      {
                        min: 1,
                        max: 6,
                        message: "长度不在范围"
                      }
                    ]
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      type="password"
                      placeholder="请输入密码"
                    />
                  )}
                  {/* <Input/> */}
                </FormItem>
                <br />

                <FormItem layout="horizontal">
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    onClick={this.handleSubmit}
                  >
                    Login In
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

let Logins = Form.create()(Login);
export default Logins;
