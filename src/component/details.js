import React, { Component, useState } from 'react';
import {
    Form, Layout, Row, Col, Input,
    Button, Icon, Table, Pagination,
    DatePicker, message, Card, Menu,
    Switch,
    Tabs,
    Radio,
    Carousel,
    Popconfirm
} from 'antd';

import axios from 'axios';
import '../asserts/css/index.css'
import '../asserts/css/antd.min.css'

const { TabPane } = Tabs;

class Details extends Component {
    constructor(props) {
       
        super(props);
        this.state = {
            value: 1,
            imagesUrl: [
                // "http://127.0.0.1:8080/Image/tempImage/04DAC1E7-98DD-4279-993F-C3FF38F0BB69.jpg",
                // "http://127.0.0.1:8080/Image/tempImage/23DD0293-FF88-4D3C-9C43-7AB3D6C4CE67.jpg",
                // "http://127.0.0.1:8080/Image/tempImage/55FAF9DB-0BA4-47CA-95C2-8D8B9557EF9B10.jpg",
                // "http://127.0.0.1:8080/Image/tempImage/55FAF9DB-0BA4-47CA-95C2-8D8B9557EF9B12.jpg",
                // "http://127.0.0.1:8080/Image/tempImage/2EFA8F72-87CE-4127-B52A-E83D28ECA351.jpg"
            ],
            haveData: false
        }
        
        this.FilePath = []
        this.slider = null;
        this.value = 1,
        this.Suspect = true,
        this.NoDoubt = false 
        
    }

    componentWillMount() {
        let recvParam;
        if (this.props.location.state) {//判断当前有参数
            recvParam = this.props.location.state.path;
            sessionStorage.setItem('data', recvParam);// 存入到sessionStorage中
            
        } else {
            recvParam = sessionStorage.getItem('data');// 当state没有参数时，取sessionStorage中的参数
        }
        let url = recvParam;
        let index = url.lastIndexOf("\/");
        let str = url.substring(index + 1,url.length);
        let index2 = str .lastIndexOf(".")
        str =str.substring(0,index2);
        // this.$nextTick(() => {})
        this.getDetailInfo(str)
    }

    // componentWillMount() {}
        
    getDetailInfo = (obj = {}) => {
        let params =  {  
            'Img_Id': obj
        }
        // http://127.0.0.1:8000
        // http://10.44.161.217:8000
        axios.post('http://10.44.161.217:8000/WebIPS/DetailInfo',
            params
        ).then((res) => {
            if (res.status == 200 && res.data.resultData != "") {
  
                let data = res.data.resultData;
                // *****************第一个组合框
                this.props.form.setFieldsValue({input1:data.Analysis.TimeStamp});
                this.props.form.setFieldsValue({ContainerNum:data.Target.ContainerNum});
                // 收货方信息 
                this.props.form.setFieldsValue({ConsigneeName: data.Target.Declaration.Consignee.Company.Name});
                this.props.form.setFieldsValue({ReceivingCompanyCountry: data.Target.Declaration.Consignee.Company.Address.Country});
                this.props.form.setFieldsValue({ConsigneeProvince: data.Target.Declaration.Consignee.Company.Address.State});
                this.props.form.setFieldsValue({ConsigneeCity: data.Target.Declaration.Consignee.Company.Address.City});
                this.props.form.setFieldsValue({FirstName: data.Target.Declaration.Consignee.Person.FirstName});
                this.props.form.setFieldsValue({ConsigneeLastName: data.Target.Declaration.Consignee.Person.LastName});
                this.props.form.setFieldsValue({ConsigneeCountry: data.Target.Declaration.Consignee.Person.Address.Country});
                this.props.form.setFieldsValue({ReceivingProvince: data.Target.Declaration.Consignee.Person.Address.State});
                this.props.form.setFieldsValue({ReceivingCity: data.Target.Declaration.Consignee.Person.Address.City});

                // 发货方
                this.props.form.setFieldsValue({ReceivingCompany: data.Target.Declaration.Shipper.Name})
                this.props.form.setFieldsValue({ShippingCountry: data.Target.Declaration.Shipper.Address.Country})
                this.props.form.setFieldsValue({ReceivingCapital: data.Target.Declaration.Shipper.Address.State})
                this.props.form.setFieldsValue({ShippingCity: data.Target.Declaration.Shipper.Address.City})
                this.props.form.setFieldsValue({ShipperCompany: data.Target.Declaration.Owner.Company.Name})
                this.props.form.setFieldsValue({ShipperCountry: data.Target.Declaration.Owner.Company.Address.Country})
                this.props.form.setFieldsValue({ShipperProvince: data.Target.Declaration.Owner.Company.Address.State})
                this.props.form.setFieldsValue({ShipperCity: data.Target.Declaration.Owner.Company.Address.City})

                // HSCode  货物描述
                this.props.form.setFieldsValue({HSCode: data.Target.Declaration.GoodsDescription.HSCode})
                this.props.form.setFieldsValue({Description: data.Target.Declaration.GoodsDescription.Description})
                

                // *****************第二个组合框
                // 车辆信息
                this.props.form.setFieldsValue({FrontPlateNum: data.Target.FrontPlateNum})
                this.props.form.setFieldsValue({RearPlateNum: data.Target.RearPlateNum})
                // 司机信息
                this.props.form.setFieldsValue({DriverName: data.Target.Driver.FirstName})
                this.props.form.setFieldsValue({DriverLastname: data.Target.Driver.LastName})
                this.props.form.setFieldsValue({CountryOfDriver: data.Target.Driver.Address.Country})
                this.props.form.setFieldsValue({DriverState: data.Target.Driver.Address.State})
                this.props.form.setFieldsValue({DriversCity: data.Target.Driver.Address.City})
                this.props.form.setFieldsValue({VehicleType: data.Target.VehicleType})
                // 厂家信息
                this.props.form.setFieldsValue({Manufacturer: data.InspectionSystem.InspectionSystem.Manufacturer})
                this.props.form.setFieldsValue({ModelName: data.InspectionSystem.InspectionSystem.ModelName})
                this.props.form.setFieldsValue({SerialNumber: data.InspectionSystem.InspectionSystem.SerialNumber})
                this.props.form.setFieldsValue({Country: data.InspectionSystem.InspectionSystem.Country})

                // *****************第三个组合框
                // 嫌疑结论
                this.props.form.setFieldsValue({Comment: data.Analysis.Comment})
                this.props.form.setFieldsValue({TimeStamp: data.Analysis.TimeStamp})
                this.props.form.setFieldsValue({ "radio-group":  data.Analysis.Suspicion})
                // image缩略图片
                // 图片类型1
                let imageType1 = [];
                let imageType2 = [];
                let imageArray = data.FilePath.OutputFile;
                for (let n = 0; n < imageArray.length; n++) {
                    for (let m = 0; m < imageArray[n].URI.length; m++) {
                        this.FilePath.push(imageArray[n].URI[m])
                    }
                }
                this.setState({haveData:true});
                console.log('this.FilePath--',this.FilePath)
            }
        })
        .catch(function (error) {
            console.log("err");
        });
    }

    submitInfo = () => {
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            console.log('111111111111--',values.ContainerNum)
        });
    }
    onChange = (a, b, c) => {
        // console.log(a, b, c);
    }
    prevs = () => {
        this.slider.prev();
    }
    next = () => {
        this.slider.next();
    }
    goTo = (index) => {
        this.slider && this.slider.innerSlider.slickGoTo(index) //跳到指定页面 0 开始
    }

    Suspect = e => {
        console.log('radio checked', e.target.value);
        this.setState({
          value: e.target.value,
        });
      };


      getEdi = () => {
        document.getElementById('ediDisplay').style.display = "block";
        axios.get('./ediInfo.xml',{headers: {
            'Cache-Control': 'no-cache'
          }}).then((res) => {
            // alert(1)   .selectNodes("/IDR_SIIG/IDR_SII_EDI_TOTAL");   /IDR_SIIG/IDR_SII_EDI_TOTAL	
            let data = res;
            let xmlDoc = new DOMParser().parseFromString(res.data, "text/xml");

            // **********edi 信息项
            let CONTA_ID = xmlDoc.getElementsByTagName('CONTA_ID')[0].innerHTML;
            let ENTRY_ID = xmlDoc.getElementsByTagName('ENTRY_ID')[0].innerHTML;
            let DISC_PORT = xmlDoc.getElementsByTagName('DISC_PORT')[0].innerHTML;
            let DEST_INFO = xmlDoc.getElementsByTagName('DEST_INFO')[0].innerHTML;
            let CNTRY_DISP_C = xmlDoc.getElementsByTagName('CNTRY_DISP_C')[0].innerHTML;
            let D_DATE = xmlDoc.getElementsByTagName('D_DATE')[0].innerHTML;
            let PACK_TYPE = xmlDoc.getElementsByTagName('PACK_TYPE')[0].innerHTML;
            let PACK_MARK = xmlDoc.getElementsByTagName('PACK_MARK')[0].innerHTML;
            let PACK_AMOUNT = xmlDoc.getElementsByTagName('PACK_AMOUNT')[0].innerHTML;
            let GROSS_WT = xmlDoc.getElementsByTagName('GROSS_WT')[0].innerHTML;
            let LADING_BILL_NO = xmlDoc.getElementsByTagName('LADING_BILL_NO')[0].innerHTML;
            let IDR_SII_EDI_ENTRY_ITEM = xmlDoc.getElementsByTagName('IDR_SII_EDI_ENTRY_ITEM');


            this.props.form.setFieldsValue({CONTA_ID: CONTA_ID})
            this.props.form.setFieldsValue({ENTRY_ID: ENTRY_ID})
             console.log(IDR_SII_EDI_ENTRY_ITEM)
            
        })
        .catch(function (error) {
            // alert(2)
            console.log("err");
        });
      };

     
    render() {

        console.log('状态---',this.state.haveData);
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="divBox" style={{ backgroundColor: '#fff',position: "relative"}}>
                 {/* <Row>
                    <Col span={24}> <h1 style={{ textAlign: 'center', height: "60px", lineHeight: "60px"}}>Customs Declaration Information</h1></Col>
                </Row> */}
                <div style={{height: "20px"}}></div>
                <Tabs defaultActiveKey="1" type="card" style={{ backgroundColor: '#fff'}}>
                    <TabPane
                        tab={
                            <span>
                                报关单
                        </span>
                        }
                        key="1"
                    >

                        <Form
                            layout='inline'
                            onSubmit={this.submitInfo}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center',backgroundColor: '#fff',  width: '97%'}}>
                                <fieldset style={{ width: '30%',height: "100%" }}>
                                    <legend >
                                        <h2 style={{ color: 'blue' }}>Cargo Information</h2>
                                    </legend>
                                    <Row>
                                        <Col span={24} >
                                            <Form.Item label="ContainerNum" style={{}}>
                                                {
                                                    getFieldDecorator('ContainerNum', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Consignee Name" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ConsigneeName', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>

                                        <Col span={24} >
                                            <Form.Item label="Company Location" style={{}}>
                                                {
                                                    getFieldDecorator('ReceivingCompanyCountry', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Consignee Province" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ConsigneeProvince', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Consignee City" style={{}}>
                                                {
                                                    getFieldDecorator('ConsigneeCity', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }

                                            </Form.Item>
                                            <Form.Item label="First Name" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('FirstName', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Consignee LastName" style={{}}>
                                                {
                                                    getFieldDecorator('ConsigneeLastName', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Consignee country" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ConsigneeCountry', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Receiving Province" style={{}}>
                                                {
                                                    getFieldDecorator('ReceivingProvince', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Receiving City" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ReceivingCity', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Receiving company" style={{}}>
                                                {
                                                    getFieldDecorator('ReceivingCompany', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Shipping country" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ShippingCountry', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Receiving capital" style={{}}>
                                                {
                                                    getFieldDecorator('ReceivingCapital', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Receiving City" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ShippingCity', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Shipper company" style={{}}>
                                                {
                                                    getFieldDecorator('ShipperCompany', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Shipper country" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ShipperCountry', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Shipper Province" style={{}}>
                                                {
                                                    getFieldDecorator('ShipperProvince', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Shipper City" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ShipperCity', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>


                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="HSCode" style={{}}>
                                                {
                                                    getFieldDecorator('HSCode', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Description" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('Description', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>
                                </fieldset>

                                <div style={{ width: '30px' }}></div>

                                <fieldset style={{ width: '30%' ,height: "100%"}}>
                                    <legend >
                                        <h2 style={{ color: 'blue' }}>Vehicle Information</h2>
                                    </legend>
                                    <Row>
                                        <Col span={24} >
                                            <Form.Item label="FrontPlateNum" style={{}}>
                                                {
                                                    getFieldDecorator('FrontPlateNum', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="RearPlateNum" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('RearPlateNum', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Driver name" style={{}}>
                                                {
                                                    getFieldDecorator('DriverName', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Driver's last name" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('DriverLastname', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Country of driver" style={{}}>
                                                {
                                                    getFieldDecorator('CountryOfDriver', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Driver state" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('DriverState', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Driver's city" style={{}}>
                                                {
                                                    getFieldDecorator('DriversCity', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Vehicle Type" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('VehicleType', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="Manufacturer" style={{}}>
                                                {
                                                    getFieldDecorator('Manufacturer', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="ModelName" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ModelName', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="SerialNumber" style={{}}>
                                                {
                                                    getFieldDecorator('SerialNumber', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="Country" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('Country', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>
                                </fieldset>

                                <div style={{ width: '30px' }}></div>

                                <div style={{ width: '30%',height: "100%" }}>
                                <fieldset style={{ width: '100%',height: "100%" }}>
                                    <legend >
                                        <h2 style={{ color: 'blue' }}>Conclusion Information</h2>
                                    </legend>
                                    <Row>
                                        <Col span={24} >
                                            <Form.Item name="radio-group" label="Result" style={{}}>
                                                {
                                                    getFieldDecorator('radio-group', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Radio.Group>
                                                            <Radio value={this.NoDoubt}>No Suspect</Radio>
                                                            <Radio value={this.Suspect}>With Suspect</Radio>
                                                           
                                                        </Radio.Group>
                                                        )
                                                }

                                            </Form.Item>
                                            <Form.Item label="Comment" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('Comment', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input.TextArea />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "30px" }}>
                                        <Col span={24} >
                                            <Form.Item label="TimeStamp" style={{}}>
                                                {
                                                    getFieldDecorator('TimeStamp', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            

                                        </Col>
                                    </Row>
                                    <Row style={{height: "50px",backgroundColor: '#fff'}}>
                                <Col span={10}></Col>
                                <Col span={4}>
                                    <Form.Item >
                                        {/* <Button style={{width: "200px"}} type="primary"   htmlType="submit"></Button> */}
                                        
                                        
                                    </Form.Item>
                                </Col>
                                <Col span={10}></Col>
                            </Row>
                                    {/* <Row>
                            <Col span={10}></Col>
                            <Col span={4}>
                                <Form.Item >
                                    <Button type="primary" size="large"  htmlType="submit">Submit</Button>
                                </Form.Item>
                            </Col>
                            <Col span={10}></Col>
                        </Row> */}
                                </fieldset>



                                <fieldset style={{ width: '100%',height: "100%" }}>
                                    <legend >
                                        <h2 style={{ color: 'blue' }}>EDI Information</h2>
                                    </legend>
                                    <Row>
                                        <Col span={24} >

                                            <Button onClick={this.getEdi} type="primary" style={{ marginBottom: 16 }}>
                                                Get Edi
                                            </Button> 

                                         </Col>   
                                    </Row>

                                   <div id='ediDisplay' style={{display: 'none'}}>
                                       
                                    <Row style={{ marginTop: "30px" }}>

                                        <Col span={24} >
                                            <Form.Item label="CONTA_ID" style={{}}>
                                                {
                                                    getFieldDecorator('CONTA_ID', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item>
                                            <Form.Item label="ENTRY_ID" style={{ textAlign: "right" }}>
                                                {
                                                    getFieldDecorator('ENTRY_ID', {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input placeholder="input placeholder" />
                                                        )
                                                }
                                            </Form.Item><br />
                                        </Col>
                                    </Row>
                                   </div>
                                </fieldset>
                                </div>
                            </div>
                            <Button className="btn btn-submint"  htmlType="submit" style={{position: 'absolute',top: "43px",right: '5px'}}/>
                             
                        </Form>

                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                缩略图
                            </span>
                        }
                        key="2"
                    >
                        <div style={{position:"relative"}}>
                            <Carousel ref={el => (this.slider = el)} afterChange={this.onChange} >
                                {  
                                     this.FilePath.map((item, index) => {
                                        console.log(item)
                                       
                                        return <div key={index} style={{display: 'flex', justifyContent: 'center'}}><img src={item} width="" height="" className="imageSty" style={{display: "inline-block"}} alt="现场照片" ></img></div>
                                    
                                    })
                                }
                            </Carousel>

                            <Icon className="prevs" type="double-left" onClick={this.prevs} />
                            <Icon className="next" type="double-right" onClick={this.next} />
                        </div>

                        <div style={{  display: 'flex', justifyContent: 'center', marginTop: "50px" }}>
                            {
                                this.FilePath.map((item, index) => {
                                    {/* console.log(index) */}
                                    return <div key={index} style={{ marginLeft: "10px" }}><img src={item} width="200px" height="100px" alt="现场照片" onClick={this.goTo.bind(this, index)} /></div>
                                })
                            }
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Form.create()(Details);
