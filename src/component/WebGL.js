import React, { Component } from 'react'
import $, { event } from 'jquery'
import axios from 'axios';
import '../asserts/css/index.css'
import '../asserts/css/antd.min.css'
import { Button, Row, Col, Icon, Slider, Select } from 'antd'
import Detector from '../model/Detector'
import { GLSLLoader } from '../model/GLSLLoader'
import * as WebglUtils from '../model/WebglUtils'
// import { SyncOutlined } from '@ant-design/icons';
const { Option } = Select;
export default class WebGl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //操作;
            operationList: [
                {
                    name: 'Reverse',
                    using: false,
                    programCategory: 'reverse',
                    btnState: " "
                },
                {
                    name: 'Emboss',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'Sharpness',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'Revert',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'EdgeEnhance1',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'EdgeEnhance2',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                // {
                //     name: 'EdgeEnhance2',
                //     using: false,
                //     programCategory: 'kernel',
                //     btnState: " "
                // },
                {
                    name: 'EdgeEnhance3',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'Gray',
                    using: false,
                    programCategory: 'gray',
                    btnState: " "
                },
                {
                    name: 'Smooth1',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'Smooth2',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'Smooth3',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'GrayImage',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'histogram',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'gray',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'mist',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'oasis',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'settingsun',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'grape',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'ocean',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'pavonine',
                    using: false,
                    programCategory: '',
                    btnState: " "
                }


            ],
            operationHistory: "",
            brightVal: 50,
            contrastVal: 50,
            nGrayMin: 0,
            nGrayMax: 255,
            histogramPath: ""

        };
        this.imagesPath = "";
        this.oldImagePath = "";
        this.currentImageIndex = 0;
        this.webgl = "";
        this.dragging = false;
        this.flag = false;
        this.lMouseDownX = -1;
        this.lMouseDownY = -1;

        this.prevMouseDownX = -1;
        this.prevMouseDownY = -1;

        this.currentMouseX = -1;
        this.currentMouseY = -1;

        this.image = null;
        this.canvas = null;
        this.shaderVarray = null;
        this.originalProgram = {};
        this.brightVal = 50;
        this.contrastVal = 50;

        this.originalProgram = new Object();
        this.kernelProgram = new Object();
        this.reverseProgram = new Object();
        this.grayProgram = new Object();
        this.grayImageProgram = new Object();
        this.logEdgeEnhanceProgram = new Object();
        this.cosEdgeEnhanceProgram = new Object();
        this.suspectProgram = new Object();

        this.offsetX = 0;
        this.offsetY = 0;

        // 创建两个纹理绑定到帧缓冲
        this.textures = [];
        this.framebuffers = [];
        

        this.kernels = {
            normal: [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ],
            Smooth1: [
                0.045, 0.122, 0.045,
                0.122, 0.332, 0.122,
                0.045, 0.122, 0.045,
            ],
            Smooth2: [
                1, 2, 1,
                2, 4, 2,
                1, 2, 1,
            ],
            Smooth3: [
                0, 1, 0,
                1, 1, 1,
                0, 1, 0,
            ],
            unsharpen: [
                -1, -1, -1,
                -1, 9, -1,
                -1, -1, -1,
            ],
            Sharpness: [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0,
            ],
            sharpen: [
                -1, -1, -1,
                -1, 16, -1,
                -1, -1, -1,
            ],
            edgeDetect: [
                -0.125, -0.125, -0.125,
                -0.125, 1, -0.125,
                -0.125, -0.125, -0.125,
            ],
            edgeDetect2: [
                -1, -1, -1,
                -1, 8, -1,
                -1, -1, -1,
            ],
            edgeDetect3: [
                -5, 0, 0,
                0, 0, 0,
                0, 0, 5,
            ],
            EdgeEnhance1: [
                -1, -1, -1,
                -1, 11, -1,
                -1, -1, -1,
            ],
            EdgeEnhance2: [
                -1, -1, -1,
                -1, 10, -1,
                -1, -1, -1,
            ],
            EdgeEnhance3: [
                -1, -1, -1,
                -1, 9, -1,
                -1, -1, -1,
            ],
            sobelHorizontal: [
                1, 2, 1,
                0, 0, 0,
                -1, -2, -1,
            ],
            sobelVertical: [
                1, 0, -1,
                2, 0, -2,
                1, 0, -1,
            ],
            previtHorizontal: [
                1, 1, 1,
                0, 0, 0,
                -1, -1, -1,
            ],
            previtVertical: [
                1, 0, -1,
                1, 0, -1,
                1, 0, -1,
            ],
            boxBlur: [
                0.111, 0.111, 0.111,
                0.111, 0.111, 0.111,
                0.111, 0.111, 0.111,
            ],
            triangleBlur: [
                0.0625, 0.125, 0.0625,
                0.125, 0.25, 0.125,
                0.0625, 0.125, 0.0625,
            ],
            Emboss: [
                -2, -1, 0,
                -1, 1, 1,
                0, 1, 2,
            ],
        };

        this.AlgorithmServicesList = {
            "histogram": false,
            "PseudoColor": false
        };

        this.ListSuspects = [];
        this.bDrawSuspect = false;
        this.bMouseDown = false;
        this.originalTranslate = {x:0,y:0};//图像初始位移；
        this.originalImageRatio = 1.0;//图像相比原图缩放比例；
    }

    //获取历史操作列表;
    GetOperationHistory = () => {
        let operaions = ""
        this.state.operationList.forEach((item) => {
            if (item.using) {
                if (operaions.length === 0) {
                    operaions = item.name;
                }
                else {
                    operaions += "+" + item.name;
                }
            }
        });
        this.setState({ operationHistory: operaions });
    }

    btnStyle = (operaionType) => {
        let operaions = this.state.operationList;
        if (operaionType === 'Revert') {
            operaions.forEach((item) => {
                item.using = false;
                item.btnState = " ";

                $(".btn").css("border", "0px solid white")
            });
            this.imagesPath = this.oldImagePath;
            this.flag = false;
        } else if (operaionType === 'gray') {
            operaions.forEach((item) => {
                if (item.name == "gray") {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                    this.flag = item.using;
                }
                if (item.name == 'mist') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'oasis') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'settingsun') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'grape') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'ocean') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'pavonine') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'mist') {
            operaions.forEach((item) => {
                if (item.name == "gray") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'mist') {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                    this.flag = item.using;
                }
                if (item.name == 'oasis') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'settingsun') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'grape') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'ocean') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'pavonine') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'oasis') {
            operaions.forEach((item) => {
                if (item.name == "gray") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'mist') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'oasis') {

                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                    this.flag = item.using;
                }
                if (item.name == 'settingsun') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'grape') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'ocean') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'pavonine') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'settingsun') {
            operaions.forEach((item) => {
                if (item.name == "gray") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'mist') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'oasis') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'settingsun') {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                    this.flag = item.using;
                }
                if (item.name == 'grape') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'ocean') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'pavonine') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'grape') {
            operaions.forEach((item) => {
                if (item.name == "gray") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'mist') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'oasis') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'settingsun') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'grape') {

                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                    this.flag = item.using;
                }
                if (item.name == 'ocean') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'pavonine') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'ocean') {
            operaions.forEach((item) => {
                if (item.name == "gray") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'mist') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'oasis') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'settingsun') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'grape') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");

                }
                if (item.name == 'ocean') {

                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                    this.flag = item.using;
                }
                if (item.name == 'pavonine') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'pavonine') {
            operaions.forEach((item) => {
                if (item.name == "gray") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'mist') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'oasis') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'settingsun') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'grape') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");

                }
                if (item.name == 'ocean') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'pavonine') {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                    this.flag = item.using;
                }
            });
        }
        else if (operaionType === 'EdgeEnhance1') {
            operaions.forEach((item) => {
                if (item.name == "EdgeEnhance1") {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                }
                if (item.name == 'EdgeEnhance2') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'EdgeEnhance3') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'EdgeEnhance2') {
            operaions.forEach((item) => {
                if (item.name === 'EdgeEnhance1') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name === 'EdgeEnhance2') {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                }
                if (item.name === 'EdgeEnhance3') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'EdgeEnhance3') {
            operaions.forEach((item) => {
                if ('EdgeEnhance1' === item.name) {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if ('EdgeEnhance2' === item.name) {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if ('EdgeEnhance3' === item.name) {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                }
            });
        } else if (operaionType === 'Smooth1') {
            operaions.forEach((item) => {
                if (item.name == "Smooth1") {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                }
                if (item.name == 'Smooth2') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'Smooth3') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'Smooth2') {
            operaions.forEach((item) => {
                if (item.name == "Smooth1") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'Smooth2') {

                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                }
                if (item.name == 'Smooth3') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
            });
        } else if (operaionType === 'Smooth3') {
            operaions.forEach((item) => {
                if (item.name == "Smooth1") {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'Smooth2') {
                    item.using = false;
                    item.btnState = " "
                    $(".btn-" + item.name).css("border", "0px solid white");
                }
                if (item.name == 'Smooth3') {

                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;
                }
            });
        }
        else {
            operaions.forEach((item) => {
                if (operaionType === item.name) {
                    if (item.btnState === " ") {
                        item.btnState = "primary";
                        $(".btn-" + item.name).css("border", "4px solid #40a9ff")
                    }
                    else {
                        item.btnState = " ";
                        $(".btn-" + item.name).css("border", '0px solid white')
                    }
                    item.using = !item.using;

                }
            });
        }
        this.setState({ operationList: operaions });
        this.GetOperationHistory();
    }

    handleBtnClick = (operaionType) => {
        this.btnStyle(operaionType)
        this.DrawScene(this.shaderVarray);
    }

    handleBtnAlgorithmServices = (operaionType) => { //例如："histogram"
        this.btnStyle(operaionType);
        this.setState({ histogramLoading: true })
        console.log('this.operaionType---', operaionType)
        this.AlgorithmServicesList[operaionType] = !this.AlgorithmServicesList[operaionType];
        //    console.log(this.AlgorithmServicesList[operaionType])
        console.log(this.state.operationList[12].btnState == 'primary' ? true : false)
        let params = {
            'imagePath': this.oldImagePath,
            'operators': {
                'histogram': this.state.operationList[12].btnState == 'primary' ? true : false,
                'PseudoColorize': {
                    'IsEnabled': this.flag,
                    'Options': operaionType == 'histogram' && this.flag == true ? "gray" : operaionType
                },

            }
        }
        // console.log(params)
        // http://127.0.0.1:8000    http://10.44.161.217:8000
        axios.post('http://10.44.161.217:8000/WebIPS/GetOperationsJPG',
            params
        ).then((res) => {
            if (res.data.resultCode == 200) {
                console.log(res.data.resultData.imagePath)
                this.imagesPath = res.data.resultData.imagePath;
                this.setState({ histogramLoading: false })
                this.DrawScene(this.shaderVarray);
            }
        })
            .catch(function (error) {
                console.log("err");
            });
        this.setState({ histogramLoading: false })
    }


    componentDidMount() {
        let recvParam;
        if (this.props.location.state) {//判断当前有参数
            recvParam = this.props.location.state.path;
            sessionStorage.setItem('data', recvParam);// 存入到sessionStorage中
            //平移矩阵和缩放矩阵恢复默认；
            Detector.scaleMatrix = [1, 1];
            Detector.translationMatrix = [0, 0];
        } else {
            recvParam = sessionStorage.getItem('data');// 当state没有参数时，取sessionStorage中的参数
        }
        if (this.shaderVarray == null) {
            var GLSLLoaderTemp = new GLSLLoader();
            GLSLLoaderTemp.loadArrays(Detector.shaders, this.DrawScene);
        }
        let str = recvParam;
        let index = str.lastIndexOf(".")
        str = str.substring(0, index);
        this.setState({
            histogramPath: str + "-hist.jpg"
        });
        this.imagesPath = recvParam;
        this.oldImagePath = recvParam;
        this.GetOperationHistory();
    }


    computeKernelWeight = (kernel) => {
        var weight = kernel.reduce(function (prev, curr) {
            return prev + curr;
        });
        return weight <= 0 ? 1 : weight;
    }

    InitWebGLProgram = () => {
        // 创建两个纹理绑定到帧缓冲
        for (var ii = 0; ii < 2; ++ii) {
            var texture = WebglUtils.createAndSetupTexture(this.webgl);
            this.textures.push(texture);

            // 设置纹理大小和图像大小一致
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, this.image.width, this.image.height, 0,
                this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, null);

            // 创建一个帧缓冲
            var fbo = this.webgl.createFramebuffer();
            this.framebuffers.push(fbo);
            this.webgl.bindFramebuffer(this.webgl.FRAMEBUFFER, fbo);

            // 绑定纹理到帧缓冲
            this.webgl.framebufferTexture2D(this.webgl.FRAMEBUFFER, this.webgl.COLOR_ATTACHMENT0, this.webgl.TEXTURE_2D, texture, 0);
        }

        //kernel
        var vsSource = this.shaderVarray.findShader('2d-vertex-shader-kernel');
        var fsSource = this.shaderVarray.findShader('2d-fragment-shader-kernel');
        this.kernelProgram.program = WebglUtils.initProgram(this.webgl, vsSource, fsSource);
        this.kernelProgram.a_Position = this.webgl.getAttribLocation(this.kernelProgram.program, 'a_position');//返回顶点着色器中顶点变量的索引地址
        this.kernelProgram.a_TexCoord = this.webgl.getAttribLocation(this.kernelProgram.program, 'a_texCoord');
        this.kernelProgram.imageLocation = this.webgl.getUniformLocation(this.kernelProgram.program, "u_image");
        this.kernelProgram.resolutionLocation = this.webgl.getUniformLocation(this.kernelProgram.program, "u_resolution");
        this.kernelProgram.translationLocation = this.webgl.getUniformLocation(this.kernelProgram.program, "u_translation");
        this.kernelProgram.scaleLocation = this.webgl.getUniformLocation(this.kernelProgram.program, "u_scale");
        this.kernelProgram.kernelLocation = this.webgl.getUniformLocation(this.kernelProgram.program, "u_kernel[0]");
        this.kernelProgram.kernelWeightLocation = this.webgl.getUniformLocation(this.kernelProgram.program, "u_kernelWeight");


        //反色
        vsSource = this.shaderVarray.findShader('2d-vertex-shader');
        fsSource = this.shaderVarray.findShader('2d-fragment-shader-reverse');
        this.reverseProgram.program = WebglUtils.initProgram(this.webgl, vsSource, fsSource);
        this.reverseProgram.a_Position = this.webgl.getAttribLocation(this.reverseProgram.program, 'a_Position');//返回顶点着色器中顶点变量的索引地址
        this.reverseProgram.a_TexCoord = this.webgl.getAttribLocation(this.reverseProgram.program, 'a_TexCoord');
        this.reverseProgram.resolutionLocation = this.webgl.getUniformLocation(this.reverseProgram.program, "u_resolution");
        this.reverseProgram.translationLocation = this.webgl.getUniformLocation(this.reverseProgram.program, "u_translation");
        this.reverseProgram.scaleLocation = this.webgl.getUniformLocation(this.reverseProgram.program, "u_scale");


        //灰窗调节
        vsSource = this.shaderVarray.findShader('2d-vertex-shader');
        fsSource = this.shaderVarray.findShader('2d-fragment-shader-gray');
        this.grayProgram.program = WebglUtils.initProgram(this.webgl, vsSource, fsSource);
        this.grayProgram.a_Position = this.webgl.getAttribLocation(this.grayProgram.program, 'a_Position');//返回顶点着色器中顶点变量的索引地址
        this.grayProgram.a_TexCoord = this.webgl.getAttribLocation(this.grayProgram.program, 'a_TexCoord');
        this.grayProgram.resolutionLocation = this.webgl.getUniformLocation(this.grayProgram.program, "u_resolution");
        this.grayProgram.translationLocation = this.webgl.getUniformLocation(this.grayProgram.program, "u_translation");
        this.grayProgram.scaleLocation = this.webgl.getUniformLocation(this.grayProgram.program, "u_scale");
        this.grayProgram.grayValue = this.webgl.getUniformLocation(this.grayProgram.program, "u_grayValue");

        //灰度图
        vsSource = this.shaderVarray.findShader('2d-vertex-shader');
        fsSource = this.shaderVarray.findShader('2d-fragment-shader-grayImage');
        this.grayImageProgram.program = WebglUtils.initProgram(this.webgl, vsSource, fsSource);
        this.grayImageProgram.a_Position = this.webgl.getAttribLocation(this.grayImageProgram.program, 'a_Position');//返回顶点着色器中顶点变量的索引地址
        this.grayImageProgram.a_TexCoord = this.webgl.getAttribLocation(this.grayImageProgram.program, 'a_TexCoord');
        this.grayImageProgram.resolutionLocation = this.webgl.getUniformLocation(this.grayImageProgram.program, "u_resolution");
        this.grayImageProgram.translationLocation = this.webgl.getUniformLocation(this.grayImageProgram.program, "u_translation");
        this.grayImageProgram.scaleLocation = this.webgl.getUniformLocation(this.grayImageProgram.program, "u_scale");

        //log边缘增强2
        vsSource = this.shaderVarray.findShader('2d-vertex-shader-kernel');
        fsSource = this.shaderVarray.findShader('2d-fragment-shader-LogEdgeEnhance');
        this.logEdgeEnhanceProgram.program = WebglUtils.initProgram(this.webgl, vsSource, fsSource);
        this.logEdgeEnhanceProgram.a_Position = this.webgl.getAttribLocation(this.logEdgeEnhanceProgram.program, 'a_position');//返回顶点着色器中顶点变量的索引地址
        this.logEdgeEnhanceProgram.a_TexCoord = this.webgl.getAttribLocation(this.logEdgeEnhanceProgram.program, 'a_texCoord');
        this.logEdgeEnhanceProgram.imageLocation = this.webgl.getUniformLocation(this.logEdgeEnhanceProgram.program, "u_image");
        this.logEdgeEnhanceProgram.resolutionLocation = this.webgl.getUniformLocation(this.logEdgeEnhanceProgram.program, "u_resolution");
        this.logEdgeEnhanceProgram.translationLocation = this.webgl.getUniformLocation(this.logEdgeEnhanceProgram.program, "u_translation");
        this.logEdgeEnhanceProgram.scaleLocation = this.webgl.getUniformLocation(this.logEdgeEnhanceProgram.program, "u_scale");


        //cos边缘增强1
        vsSource = this.shaderVarray.findShader('2d-vertex-shader-kernel');
        fsSource = this.shaderVarray.findShader('2d-fragment-shader-cosEdgeEnhance');
        this.cosEdgeEnhanceProgram.program = WebglUtils.initProgram(this.webgl, vsSource, fsSource);
        this.cosEdgeEnhanceProgram.a_Position = this.webgl.getAttribLocation(this.cosEdgeEnhanceProgram.program, 'a_position');//返回顶点着色器中顶点变量的索引地址
        this.cosEdgeEnhanceProgram.a_TexCoord = this.webgl.getAttribLocation(this.cosEdgeEnhanceProgram.program, 'a_texCoord');
        this.cosEdgeEnhanceProgram.imageLocation = this.webgl.getUniformLocation(this.cosEdgeEnhanceProgram.program, "u_image");
        this.cosEdgeEnhanceProgram.resolutionLocation = this.webgl.getUniformLocation(this.cosEdgeEnhanceProgram.program, "u_resolution");
        this.cosEdgeEnhanceProgram.translationLocation = this.webgl.getUniformLocation(this.cosEdgeEnhanceProgram.program, "u_translation");
        this.cosEdgeEnhanceProgram.scaleLocation = this.webgl.getUniformLocation(this.cosEdgeEnhanceProgram.program, "u_scale");

        //SUSPECT
        vsSource = this.shaderVarray.findShader('2d-vertex-suspect-shader');
        fsSource = this.shaderVarray.findShader('2d-fragment-suspect-shader');
        this.suspectProgram.program = WebglUtils.initProgram(this.webgl, vsSource, fsSource);
        this.suspectProgram.a_Position = this.webgl.getAttribLocation(this.suspectProgram.program, "a_position");
        this.suspectProgram.resolutionLocation = this.webgl.getUniformLocation(this.suspectProgram.program, "u_resolution");
        this.suspectProgram.translationLocation = this.webgl.getUniformLocation(this.suspectProgram.program, "u_translation");
        this.suspectProgram.scaleLocation = this.webgl.getUniformLocation(this.suspectProgram.program, "u_scale");
    }

    SetPositionLocation = (xBegin, yBegin, positionLocation) => {
        var data = new Float32Array([
            xBegin, yBegin,//左上角——v0
            xBegin, yBegin + this.image.height,//左下角——v1
            xBegin + this.image.width, yBegin,//右上角——v2
            xBegin + this.image.width, yBegin + this.image.height //右下角——v3
        ]);

        var positionBuffer = this.webgl.createBuffer(); //创建显存缓冲区 
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, positionBuffer); //绑定显存缓冲区
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, data, this.webgl.STATIC_DRAW);//数据转移，内存---》显存
        this.webgl.vertexAttribPointer(positionLocation, 2, this.webgl.FLOAT, false, 0, 0);//数据读取规则设置
    }

    //通过url把图片转为base64编码
    getUrlBase64 = (url, ext, callback) => {
        var canvas = document.createElement("canvas"); //创建canvas DOM元素
        var ctx = canvas.getContext("2d");
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function () {
            canvas.height = this.height; //指定画板的高度,自定义
            canvas.width = this.width; //指定画板的宽度，自定义
            ctx.drawImage(img, 0, 0, this.width, this.height); //参数可自定义
            var dataURL = canvas.toDataURL("image/" + ext);
            callback.call(this, dataURL); //回掉函数获取Base64编码
            canvas = null;
        };
    }

    DrawScene = (shaderVarray) => {
        this.canvas = document.getElementById("webgl");
        this.webgl = this.canvas.getContext('webgl2') || this.canvas.getContext("experimental-webgl");
        var image = new Image();
        image.onload = () => {
            this.renderMain(image, shaderVarray);
        };

        image.crossOrigin = "";   // 请求 CORS 许可
        image.src = this.imagesPath + "?timestamp=" + (new Date).getTime();  //加时间戳解决图片不刷新问题；


        // this.getUrlBase64(this.imagesPath,'jpeg',function (base64) {
        //     image.src = base64;
        // });


    }


    

    renderMain = (image, shaderVarray) => {
        if (!this.webgl) {
            console.log("not support webgl!");
        }

        this.image = image;
        this.shaderVarray = shaderVarray;

        WebglUtils.resizeCanvas(this.canvas);
        if (this.image.height > this.canvas.height) {
            this.originalImageRatio = this.canvas.height / this.image.height;
            
            this.image.height = this.canvas.height;
            this.image.width = this.image.width * this.originalImageRatio;

            var tempX = (this.canvas.width - Detector.scaleMatrix[0] * this.image.width) / 2;
            var tempY = (this.canvas.height - Detector.scaleMatrix[1] * this.image.height) / 2;

            var temp1 = this.windowTocanvas(tempX, tempY);

            this.originalTranslate.x = Detector.translationMatrix[0] = this.offsetX + temp1.x;
            this.originalTranslate.y = Detector.translationMatrix[1] = this.offsetY + temp1.y;

        }

        this.InitWebGLProgram();

        this.SetPositionLocation(0, 0, this.kernelProgram.a_Position);

        /**
         创建缓冲区textureBuffer，向顶点着色器传入顶点纹理坐标数据Detector.textureData
        **/
        var textureBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, textureBuffer);
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, Detector.textureData, this.webgl.STATIC_DRAW);//STATIC_DRAW：静态绘制模式 
        this.webgl.vertexAttribPointer(this.kernelProgram.a_TexCoord, 2, this.webgl.FLOAT, false, 0, 0);
        this.kernelProgram.originalImageTexture = WebglUtils.createAndSetupTexture(this.webgl);
        this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, image);

        this.DrawEffection();
        this.GetOperationHistory();
    }

    DrawEffection = () => {
        this.webgl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

        this.webgl.useProgram(this.kernelProgram.program); //调用程序对象，切换GPU上下文
        this.webgl.enableVertexAttribArray(this.kernelProgram.a_Position);//允许GPU读取数据
        this.webgl.enableVertexAttribArray(this.kernelProgram.a_TexCoord);
        this.webgl.activeTexture(this.webgl.TEXTURE0 + 0);
        this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.kernelProgram.originalImageTexture);
        this.webgl.uniform1i(this.kernelProgram.imageLocation, 0);
        //位移
        this.webgl.uniform2fv(this.kernelProgram.translationLocation, [0, 0]);
        //缩放
        this.webgl.uniform2fv(this.kernelProgram.scaleLocation, [1, 1]);

        var count = 0;
        this.state.operationList.forEach((item) => {
            if (item.using) {
                if (item.using === true && item.programCategory === 'kernel') {
                    // 使用两个帧缓冲中的一个
                    WebglUtils.setFramebuffer(this.webgl, this.framebuffers[count % 2], this.kernelProgram, this.image.width, this.image.height);
                    this.drawWithKernel(item.name);
                    // 下次绘制时使用刚才的渲染结果
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.textures[count % 2]);
                    ++count;
                }
                else if (item.name === 'Reverse' && item.using === true) {
                    // 使用两个帧缓冲中的一个
                    WebglUtils.setFramebuffer(this.webgl, this.framebuffers[count % 2], this.reverseProgram, this.image.width, this.image.height);
                    this.SetPositionLocation(0, 0, this.reverseProgram.a_Position);

                    /**
                     创建缓冲区textureBuffer，向顶点着色器传入顶点纹理坐标数据Detector.textureData
                    **/
                    var textureBuffer = this.webgl.createBuffer();
                    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, textureBuffer);
                    this.webgl.bufferData(this.webgl.ARRAY_BUFFER, Detector.textureData, this.webgl.STATIC_DRAW);//STATIC_DRAW：静态绘制模式 
                    this.webgl.vertexAttribPointer(this.reverseProgram.a_TexCoord, 2, this.webgl.FLOAT, false, 0, 0);

                    // this.webgl.useProgram(this.reverseProgram.program); //调用程序对象，切换GPU上下文


                    this.webgl.enableVertexAttribArray(this.reverseProgram.a_Position);//允许GPU读取数据
                    this.webgl.enableVertexAttribArray(this.reverseProgram.a_TexCoord);
                    // this.webgl.uniform2f(this.reverseProgram.resolutionLocation, this.canvas.width, this.canvas.height);

                    this.webgl.uniform2fv(this.reverseProgram.translationLocation, [0, 0]);
                    // Set the scale.
                    this.webgl.uniform2fv(this.reverseProgram.scaleLocation, [1, 1]);

                    this.webgl.clearColor(0, 0, 0, 0);
                    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);

                    this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);

                    // 下次绘制时使用刚才的渲染结果
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.textures[count % 2]);

                    ++count;
                }
                else if (item.name === 'Gray' && item.using === true) {
                    // 使用两个帧缓冲中的一个
                    WebglUtils.setFramebuffer(this.webgl, this.framebuffers[count % 2], this.grayProgram, this.image.width, this.image.height);
                    this.SetPositionLocation(0, 0, this.grayProgram.a_Position);

                    /**
                     创建缓冲区textureBuffer，向顶点着色器传入顶点纹理坐标数据Detector.textureData
                    **/
                    var textureBuffer = this.webgl.createBuffer();
                    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, textureBuffer);
                    this.webgl.bufferData(this.webgl.ARRAY_BUFFER, Detector.textureData, this.webgl.STATIC_DRAW);//STATIC_DRAW：静态绘制模式 
                    this.webgl.vertexAttribPointer(this.grayProgram.a_TexCoord, 2, this.webgl.FLOAT, false, 0, 0);

                    // this.webgl.useProgram(this.grayProgram.program); //调用程序对象，切换GPU上下文


                    this.webgl.enableVertexAttribArray(this.grayProgram.a_Position);//允许GPU读取数据
                    this.webgl.enableVertexAttribArray(this.grayProgram.a_TexCoord);
                    // this.webgl.uniform2f(this.grayProgram.resolutionLocation, this.canvas.width, this.canvas.height);

                    this.webgl.uniform2fv(this.grayProgram.translationLocation, [0, 0]);
                    // Set the scale.
                    this.webgl.uniform2fv(this.grayProgram.scaleLocation, [1, 1]);

                    this.webgl.uniform2fv(this.grayProgram.grayValue, [this.state.nGrayMin / 255.0, this.state.nGrayMax / 255.0]);


                    this.webgl.clearColor(0, 0, 0, 0);
                    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);

                    this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);

                    // 下次绘制时使用刚才的渲染结果
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.textures[count % 2]);

                    ++count;
                }
                else if (item.name === 'GrayImage' && item.using === true) {
                    // 使用两个帧缓冲中的一个
                    WebglUtils.setFramebuffer(this.webgl, this.framebuffers[count % 2], this.grayImageProgram, this.image.width, this.image.height);
                    this.SetPositionLocation(0, 0, this.grayImageProgram.a_Position);

                    /**
                     创建缓冲区textureBuffer，向顶点着色器传入顶点纹理坐标数据Detector.textureData
                    **/
                    var textureBuffer = this.webgl.createBuffer();
                    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, textureBuffer);
                    this.webgl.bufferData(this.webgl.ARRAY_BUFFER, Detector.textureData, this.webgl.STATIC_DRAW);//STATIC_DRAW：静态绘制模式 
                    this.webgl.vertexAttribPointer(this.grayImageProgram.a_TexCoord, 2, this.webgl.FLOAT, false, 0, 0);

                    // this.webgl.useProgram(this.grayProgram.program); //调用程序对象，切换GPU上下文


                    this.webgl.enableVertexAttribArray(this.grayImageProgram.a_Position);//允许GPU读取数据
                    this.webgl.enableVertexAttribArray(this.grayImageProgram.a_TexCoord);
                    // this.webgl.uniform2f(this.grayProgram.resolutionLocation, this.canvas.width, this.canvas.height);

                    this.webgl.uniform2fv(this.grayImageProgram.translationLocation, [0, 0]);
                    // Set the scale.
                    this.webgl.uniform2fv(this.grayImageProgram.scaleLocation, [1, 1]);


                    this.webgl.clearColor(0, 0, 0, 0);
                    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);

                    this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);

                    // 下次绘制时使用刚才的渲染结果
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.textures[count % 2]);

                    ++count;

                }
                else if (item.name === 'EdgeEnhance2' && item.using === true) {
                    // 使用两个帧缓冲中的一个

                    WebglUtils.setFramebuffer(this.webgl, this.framebuffers[count % 2], this.logEdgeEnhanceProgram, this.image.width, this.image.height);
                    this.SetPositionLocation(0, 0, this.logEdgeEnhanceProgram.a_Position);

                    /**
                     创建缓冲区textureBuffer，向顶点着色器传入顶点纹理坐标数据Detector.textureData
                    **/
                    var textureBuffer = this.webgl.createBuffer();
                    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, textureBuffer);
                    this.webgl.bufferData(this.webgl.ARRAY_BUFFER, Detector.textureData, this.webgl.STATIC_DRAW);//STATIC_DRAW：静态绘制模式 
                    this.webgl.vertexAttribPointer(this.logEdgeEnhanceProgram.a_TexCoord, 2, this.webgl.FLOAT, false, 0, 0);

                    // this.webgl.useProgram(this.grayProgram.program); //调用程序对象，切换GPU上下文


                    this.webgl.enableVertexAttribArray(this.logEdgeEnhanceProgram.a_Position);//允许GPU读取数据
                    this.webgl.enableVertexAttribArray(this.logEdgeEnhanceProgram.a_TexCoord);
                    // this.webgl.uniform2f(this.grayProgram.resolutionLocation, this.canvas.width, this.canvas.height);

                    this.webgl.uniform2fv(this.logEdgeEnhanceProgram.translationLocation, [0, 0]);
                    // Set the scale.
                    this.webgl.uniform2fv(this.logEdgeEnhanceProgram.scaleLocation, [1, 1]);


                    this.webgl.clearColor(0, 0, 0, 0);
                    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);

                    this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);

                    // 下次绘制时使用刚才的渲染结果
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.textures[count % 2]);

                    ++count;
                }
                else if (item.name === 'EdgeEnhance1' && item.using === true) {

                    // 使用两个帧缓冲中的一个
                    WebglUtils.setFramebuffer(this.webgl, this.framebuffers[count % 2], this.cosEdgeEnhanceProgram, this.image.width, this.image.height);
                    this.SetPositionLocation(0, 0, this.cosEdgeEnhanceProgram.a_Position);

                    /**
                     创建缓冲区textureBuffer，向顶点着色器传入顶点纹理坐标数据Detector.textureData
                    **/
                    var textureBuffer = this.webgl.createBuffer();
                    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, textureBuffer);
                    this.webgl.bufferData(this.webgl.ARRAY_BUFFER, Detector.textureData, this.webgl.STATIC_DRAW);//STATIC_DRAW：静态绘制模式 
                    this.webgl.vertexAttribPointer(this.cosEdgeEnhanceProgram.a_TexCoord, 2, this.webgl.FLOAT, false, 0, 0);

                    // this.webgl.useProgram(this.grayProgram.program); //调用程序对象，切换GPU上下文


                    this.webgl.enableVertexAttribArray(this.cosEdgeEnhanceProgram.a_Position);//允许GPU读取数据
                    this.webgl.enableVertexAttribArray(this.cosEdgeEnhanceProgram.a_TexCoord);
                    // this.webgl.uniform2f(this.grayProgram.resolutionLocation, this.canvas.width, this.canvas.height);

                    this.webgl.uniform2fv(this.cosEdgeEnhanceProgram.translationLocation, [0, 0]);
                    // Set the scale.
                    this.webgl.uniform2fv(this.cosEdgeEnhanceProgram.scaleLocation, [1, 1]);


                    this.webgl.clearColor(0, 0, 0, 0);
                    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);

                    this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);

                    // 下次绘制时使用刚才的渲染结果
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.textures[count % 2]);

                    ++count;
                }
            }
        });

        
        // 最后将结果绘制到画布
        //this.webgl.useProgram(this.kernelProgram.program);// //调用程序对象，切换GPU上下文
        this.SetPositionLocation(0, 0, this.kernelProgram.a_Position);

        //最终设置位移矩阵和缩放矩阵;
        this.webgl.uniform2fv(this.kernelProgram.translationLocation, Detector.translationMatrix);//设置位移
        this.webgl.uniform2fv(this.kernelProgram.scaleLocation, Detector.scaleMatrix);//设置缩放
        WebglUtils.setFramebuffer(this.webgl, null, this.kernelProgram, this.canvas.width, this.canvas.height);
        this.drawWithKernel('normal');

        //绘制嫌疑标记
        this.drawSuspect();

    }

    saveSuspect = () =>{
        var saveSuspect = [];
        this.ListSuspects.forEach((item) => {
            //canvas坐标转为图像坐标
            saveSuspect.push({
                'beginposx':(item.left - this.originalTranslate[0])*this.originalImageRatio,
                'beginposy':(item.top - this.originalTranslate[1])*this.originalImageRatio,
                'longaxis':(item.right-item.left)*this.originalImageRatio,
                'shortaxis':(item.bottom - item.top)*this.originalImageRatio,
                'shape':1,
                'description':'',
                'remark':'',
                'station':0,
                'faultageindex':'view0'
            });
        });
        return saveSuspect;
    }

    //获取历史图像嫌疑标记;
    getSuspect = (historySuspects) =>{
        this.ListSuspects = [];
        this.historySuspects.forEach((item) => {
            //图像坐标转为canvas坐标
            this.ListSuspects.push({
                // 'left':(item.beginposx/this.originalImageRatio) + this.originalTranslate[0],
                // 'top':(item.beginposy/this.originalImageRatio) + this.originalTranslate[1],

                'beginposx':(item.left - this.originalTranslate[0])*this.originalImageRatio,
                'beginposy':(item.top - this.originalTranslate[1])*this.originalImageRatio,
                'longaxis':(item.right-item.left)*this.originalImageRatio,
                'shortaxis':(item.bottom - item.top)*this.originalImageRatio,
                'shape':1,
                'description':'',
                'remark':'',
                'station':0,
                'faultageindex':'view0'
            });
        });
    }

    drawSuspect = ()=>{
        this.ListSuspects.forEach((item) => {
            var positionBuffer = this.webgl.createBuffer();

            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, positionBuffer);
            var positions = [
                item.left, item.top,
                item.left, item.bottom,
                item.right, item.bottom,
                item.right, item.top,
            ];
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(positions), this.webgl.STATIC_DRAW);
            //this.webgl.viewport(0, 0, this.webgl.canvas.width, this.webgl.canvas.height);
            this.webgl.useProgram(this.suspectProgram.program);
            this.webgl.enableVertexAttribArray(this.suspectProgram.positionLocation);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, positionBuffer);
            this.webgl.vertexAttribPointer(this.suspectProgram.positionLocation, 2, this.webgl.FLOAT, false, 0, 0);
            this.webgl.uniform2f(this.suspectProgram.resolutionLocation, this.webgl.canvas.width, this.webgl.canvas.height);
            //最终设置位移矩阵和缩放矩阵;
            this.webgl.uniform2fv(this.suspectProgram.translationLocation, Detector.translationMatrix);//设置位移
            this.webgl.uniform2fv(this.suspectProgram.scaleLocation, Detector.scaleMatrix);//设置缩放
            this.webgl.drawArrays(this.webgl.LINE_LOOP, 0, 4);
        });
    }


    drawWithKernel = (name) => {
        this.webgl.uniform1fv(this.kernelProgram.kernelLocation, this.kernels[name]);
        this.webgl.uniform1f(this.kernelProgram.kernelWeightLocation, this.computeKernelWeight(this.kernels[name]));


        this.webgl.clearColor(0, 0, 0, 0);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);

        this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);

    }

    getImageBundingRect = () => {
        var bbox = {x:0,y:0,width:this.image.width,height:this.image.height};
        bbox.x = Detector.translationMatrix[0];
        bbox.y = Detector.translationMatrix[1];
        bbox.width *= Detector.scaleMatrix[0];
        bbox.height *= Detector.scaleMatrix[1];
        return bbox;
    }

    checkInImageBundingRect = (checkCanvasPos) =>{
        var imagebunding = this.getImageBundingRect();
        if(checkCanvasPos.x > imagebunding.x+imagebunding.width)
        {
            checkCanvasPos.x = imagebunding.x+imagebunding.width;
        }
        if(checkCanvasPos.x < imagebunding.x)
        {
            checkCanvasPos.x = imagebunding.x;
        }
        if(checkCanvasPos.y > imagebunding.y+imagebunding.height)
        {
            checkCanvasPos.y = imagebunding.y+imagebunding.height;
        }
        if(checkCanvasPos.y < imagebunding.y)
        {
            checkCanvasPos.y = imagebunding.y;
        }
        return checkCanvasPos;
    }

    Brightness = value => {
        if (isNaN(value)) {
            return;
        }
        this.setState({
            brightVal: value,
        });
        this.brightVal = value * 2;
        $("#webgl").css("-webkit-filter", "brightness(" + this.brightVal + "%)");
        $("#webgl").css("filter", "brightness(" + this.brightVal + "%)");
    };
    BrightnessDefault = () => {
        this.setState({
            brightVal: 50,
        });
        this.brightVal = 50 * 2;
        $("#webgl").css("-webkit-filter", "brightness(" + this.brightVal + "%)");
        $("#webgl").css("filter", "brightness(" + this.brightVal + "%)");
        this.brightVal = 50;
    }
    addBrightness = () => {
        this.brightVal = this.brightVal + 5;
        let addBrightness = this.brightVal;
        this.setState({
            brightVal: addBrightness,
        });
        $("#webgl").css("-webkit-filter", "brightness(" + this.brightVal + "%)");
        $("#webgl").css("filter", "brightness(" + this.brightVal + "%)");
    }

    reduceBrightness = () => {
        this.brightVal = this.brightVal - 5;
        let reduceBrightness = this.brightVal;
        this.setState({
            brightVal: reduceBrightness,
        });
        $("#webgl").css("-webkit-filter", "brightness(" + this.brightVal + "%)");
        $("#webgl").css("filter", "brightness(" + this.brightVal + "%)");
    }
    Contrast = value => {
        if (isNaN(value)) {
            return;
        }
        this.setState({
            contrastVal: value,
        });
        this.contrastVal = value * 2;
        $("#webgl").css("-webkit-filter", "contrast(" + this.contrastVal + "%)");
        $("#webgl").css("filter", "contrast(" + this.contrastVal + "%)");
    };
    ContrastDefault = () => {
        this.setState({
            contrastVal: 50,
        });
        this.contrastVal = 50 * 2;
        $("#webgl").css("-webkit-filter", "contrast(" + this.contrastVal + "%)");
        $("#webgl").css("filter", "contrast(" + this.contrastVal + "%)");
        this.contrastVal = 50;
    }
    addContrast = () => {
        this.contrastVal = this.contrastVal + 5;
        let addContrast = this.contrastVal;
        this.setState({
            contrastVal: addContrast,
        });
        $("#webgl").css("-webkit-filter", "contrast(" + this.contrastVal + "%)");
        $("#webgl").css("filter", "contrast(" + this.contrastVal + "%)");
    }
    reduceContrast = () => {
        this.contrastVal = this.contrastVal - 5;
        let reduceContrast = this.contrastVal;
        this.setState({
            contrastVal: reduceContrast,
        });
        $("#webgl").css("-webkit-filter", "contrast(" + this.contrastVal + "%)");
        $("#webgl").css("filter", "contrast(" + this.contrastVal + "%)");
    }



    MouseDoubleClick = (event) => {
        event.preventDefault();
        var x = event.clientX;
        var y = event.clientY;
        var temp = this.windowTocanvas(x,y);
        temp.x = (temp.x-Detector.translationMatrix[0])/Detector.scaleMatrix[0];
        temp.y = (temp.y-Detector.translationMatrix[1])/Detector.scaleMatrix[1];
        var removeIndex = -1;
        this.ListSuspects.forEach((item,index) => {
            if(temp.x >= item.left && temp.x <= item.right 
                && temp.y >= item.top && temp.y<=item.bottom)
                {
                    removeIndex = index;
                }
        });
        if(removeIndex != -1)
        {
            let listdelete = this.ListSuspects;
            listdelete.splice(removeIndex,1);
            this.ListSuspects = listdelete;
            this.DrawEffection();
        }
        
    }

    MouseDown = (event) => {
        event.preventDefault();
        this.bMouseDown = true;
        // 鼠标点击位置
        this.currentMouseX = this.lMouseDownX = event.clientX;
        this.currentMouseY = this.lMouseDownY = event.clientY;
        if(!this.bDrawSuspect){
            this.dragging = true;
        }
        else if(this.bDrawSuspect){
            var temp = this.windowTocanvas(this.lMouseDownX,this.lMouseDownY);
            var imagebunding = this.getImageBundingRect();
            if(temp.x < imagebunding.x || temp.x > imagebunding.x+imagebunding.width
                || temp.y<imagebunding.y||temp.y>imagebunding.y+imagebunding.height)
                {
                    this.bDrawSuspect = false;
                }
                else
                {
                    //如果不加的话，会导致在mousemove画第二个嫌疑标记时pop了第一个嫌疑标记
                    var beginpos = this.windowTocanvas(this.lMouseDownX,this.lMouseDownY);
                    var endpos = beginpos;
                    endpos = this.checkInImageBundingRect(endpos);

                    this.ListSuspects.push({'left':(beginpos.x-Detector.translationMatrix[0])/Detector.scaleMatrix[0],
                                            'top':(beginpos.y-Detector.translationMatrix[1])/Detector.scaleMatrix[1],
                                            'right':(endpos.x-Detector.translationMatrix[0])/Detector.scaleMatrix[0],
                                            'bottom':(endpos.y-Detector.translationMatrix[1])/Detector.scaleMatrix[1]
                                        });
                }
        }
    }


    MouseUp = (event) => {
        event.preventDefault();
        this.dragging = false;
        this.bMouseDown = false;

        //绘制嫌疑区域
        if(this.bDrawSuspect){
            this.bDrawSuspect = false;
        }
    }

    MouseLeave = (event) => {
        event.preventDefault();
        this.dragging = false;
    }

    MouseMove = (event) => {
        event.preventDefault();

        var x = event.clientX;
        var y = event.clientY;
        
        //绘制嫌疑区域
        if(this.bDrawSuspect && this.bMouseDown){
            this.ListSuspects.pop();
            var beginpos = this.windowTocanvas(this.lMouseDownX,this.lMouseDownY);
            var endpos = this.windowTocanvas(x,y);
            //针对鼠标往左上角方向滑动的画
            if(beginpos.x>endpos.x || beginpos.y > endpos.y)
            {
                var temp = beginpos;
                beginpos = endpos;
                endpos = temp;
            }
            endpos = this.checkInImageBundingRect(endpos);

            this.ListSuspects.push({'left':(beginpos.x-Detector.translationMatrix[0])/Detector.scaleMatrix[0],
                                    'top':(beginpos.y-Detector.translationMatrix[1])/Detector.scaleMatrix[1],
                                    'right':(endpos.x-Detector.translationMatrix[0])/Detector.scaleMatrix[0],
                                    'bottom':(endpos.y-Detector.translationMatrix[1])/Detector.scaleMatrix[1]
                                });
            this.DrawEffection();

            
        }

        if (this.dragging) {

            var dx = x - this.currentMouseX;
            var dy = y - this.currentMouseY;

            this.offsetX += dx;
            this.offsetY += dy;

            Detector.translationMatrix[0] += dx;
            Detector.translationMatrix[1] += dy;
            this.DrawEffection();
        }

        this.currentMouseX = event.clientX;
        this.currentMouseY = event.clientY;

    }

    windowTocanvas = (x, y) => {
        var bbox = this.canvas.getBoundingClientRect();
        return {
            x: x - (this.canvas.width / bbox.width),
            y: y - (this.canvas.height / bbox.height)
        };
    }

    MouseWheel = (event) => {
        //min: -1/4, max: 4
        if (event.deltaY < 0) {
            Detector.scaleMatrix[0] += 0.1;
            Detector.scaleMatrix[1] += 0.1;
        }
        else {
            if (Detector.scaleMatrix[0] > 0.1) {
                Detector.scaleMatrix[0] -= 0.1;
                Detector.scaleMatrix[1] -= 0.1;
            }

        }
        if (Detector.scaleMatrix[0] < -1 / 4) {
            Detector.scaleMatrix[0] = -1 / 4;
            Detector.scaleMatrix[1] = -1 / 4;
        }
        if (Detector.scaleMatrix[0] > 4) {
            Detector.scaleMatrix[0] = 4;
            Detector.scaleMatrix[1] = 4;
        }
        var tempX = (this.canvas.width - Detector.scaleMatrix[0] * this.image.width) / 2;
        var tempY = (this.canvas.height - Detector.scaleMatrix[1] * this.image.height) / 2;

        var temp1 = this.windowTocanvas(tempX, tempY);

        Detector.translationMatrix[0] = this.offsetX + temp1.x;
        Detector.translationMatrix[1] = this.offsetY + temp1.y;


        this.DrawEffection();
        
        
    }
    addGrayWindow = () => {
        let grayVale = this.state.nGrayMax + 1;
        this.setState({
            nGrayMax: grayVale > 255 ? 255 : grayVale
        });
        this.DrawScene(this.shaderVarray);

    }

    reduceGrayWindow = () => {
        let grayVale = this.state.nGrayMin - 1;
        this.setState({
            nGrayMin: grayVale < 0 ? 0 : grayVale
        });
        this.DrawScene(this.shaderVarray);

    }

    revertGrayWindow = () => {
        let operaions = this.state.operationList;
        operaions.forEach((item) => {
            if ('Gray' === item.name) {
                item.using = false;
            }
        });
        this.setState(
            {
                operationList: operaions,
                nGrayMin: 0,
                nGrayMax: 255
            }
        );

        this.DrawScene(this.shaderVarray);
    }

    GrayWindowChange = (value) => {
        if (value[1] - value[0] <= 5) {
            value[0] = value[0] - 5;
            value[1] = value[1];
        }
        let operaions = this.state.operationList;
        operaions.forEach((item) => {
            if ('Gray' === item.name) {
                // item.using = true;
                if (value[0] != 0 || value[1] != 255) {
                    item.using = true;
                }
                else {
                    item.using = false;
                }
            }
        });
        this.setState(
            {
                operationList: operaions,
                nGrayMin: value[0],
                nGrayMax: value[1]
            }
        );
        this.DrawScene(this.shaderVarray);
    }

    ImageProcessing = (val) => {
        if ("sixTeen" == val) {
            $('.eightShow').hide()
            $(".sixTeenShow").show()
        } else {
            $(".sixTeenShow").hide()
            $('.eightShow').show()
        }
        // 切换图像处理方式 清空之前对图像的操作
        let operaions = this.state.operationList;
        operaions.forEach((item) => {
            item.using = false;
            item.btnState = " ";
            $(".btn").css("border", "0px solid white")
        });
        this.imagesPath = this.oldImagePath;
        this.flag = false;
        this.setState({ operationList: operaions });
        this.DrawScene(this.shaderVarray);
    }

    DrawSuspectRectangle = ()=>{
        this.bDrawSuspect = true;
    }

    render() {
        return (
            <div className="divBox">
                {/* <div className="icons-list">
                    <SyncOutlined/>
                </div> */}
                <Row className="headerBox">
                    <Col span={4} className="headerBoxOne"></Col>
                    <Col span={16} className="headers">
                        <Icon style={{ margin: '0 20px' }} type="star" />
                        {this.state.operationHistory}
                    </Col>
                    <Col span={4}></Col>
                </Row>

                <Row className="contents">
                    <Col>
                        <canvas id="webgl"  style={{ width: '100%', height: 'calc(77vh)' }}
                            onMouseDown={this.MouseDown}
                            onMouseLeave={this.MouseLeave}
                            onMouseMove={this.MouseMove}
                            onMouseUp={this.MouseUp}
                            onWheel={this.MouseWheel}
                            onDoubleClick={this.MouseDoubleClick}
                        ></canvas>
                        
                    </Col>
                </Row>

                <Row className="bootoms">
                    <Col span={5}>
                        <div className="ant-slider-div">
                            <div style={{ color: "#fff", height: '40px', lineHeight: '40px', display: "flex", margin: '7px 0' }}>
                                <div className="slide BrightnessBgm-icon"></div>
                                <div style={{ color: "#fff", height: '40px', lineHeight: '40px' }}>
                                    <h2 style={{ color: "#fff" }}>&nbsp; Brightness </h2>
                                </div>
                            </div>
                            <div style={{ display: 'flex', position: 'relative' }}>
                                <Icon type="minus" onClick={this.reduceBrightness} style={{ color: "#fff", marginTop: '12px' }} />
                                &nbsp;&nbsp;
                                <span style={{ display: "inline-block", color: '#fff', position: 'absolute', top: '-7px', left: '23px' }}>&nbsp;0&nbsp; </span>

                                <Slider
                                    style={{ width: 200 }}
                                    min={0}
                                    max={100}
                                    defaultValue={50}
                                    onChange={this.Brightness}
                                    value={typeof this.state.brightVal === 'number' ? this.state.brightVal : 0}
                                    step={5}
                                />
                                <span style={{ display: "inline-block", color: '#fff', position: 'absolute', top: '-7px', right: '62px' }}>&nbsp;100&nbsp; </span>
                                &nbsp;&nbsp;
                            <Icon type="plus" onClick={this.addBrightness} style={{ color: "#fff", marginTop: '12px' }} />
                                &nbsp;&nbsp;
                            <button onClick={this.BrightnessDefault} style={{ marginTop: '8px' }} size="small"><Icon type="reload" /></button>
                            </div>

                        </div>

                        <div className="ant-slider-div">
                            <div style={{ color: "#fff", height: '40px', lineHeight: '40px', display: "flex", margin: '7px 0' }}>
                                <div className="slide Contrast-icon"></div>
                                <div style={{ color: "#fff", height: '40px', lineHeight: '40px' }}>
                                    <h2 style={{ color: "#fff" }}>&nbsp; Contrast </h2>
                                </div>
                            </div>
                            <div style={{ display: 'flex', position: 'relative' }}>
                                <Icon type="minus" onClick={this.reduceContrast} style={{ color: "#fff", marginTop: '12px' }} />
                                &nbsp;&nbsp;
                                    <span style={{ display: "inline-block", color: '#fff', position: 'absolute', top: '-7px', left: '23px' }}>&nbsp;0&nbsp; </span>
                                <Slider
                                    style={{ width: 200 }}
                                    min={0}
                                    max={100}
                                    defaultValue={50}
                                    onChange={this.Contrast}
                                    value={typeof this.state.contrastVal === 'number' ? this.state.contrastVal : 0}
                                    step={5}
                                />
                                <span style={{ display: "inline-block", color: '#fff', position: 'absolute', top: '-7px', right: '62px' }}>&nbsp;100&nbsp; </span>
                                &nbsp;&nbsp;
                                <Icon type="plus" onClick={this.addContrast} style={{ color: "#fff", marginTop: '12px' }} />
                                &nbsp;&nbsp;
                                <button size="small" onClick={this.ContrastDefault} style={{ marginTop: '8px' }}><Icon type="reload" /></button>
                            </div>
                        </div>
                    </Col>
                    <Col span={5}>
                        <div style={{ height: '90px' }}>
                            <img style={{ width: '214px', height: '76px', marginTop: '15px' }} src={this.state.histogramPath} alt="" />
                        </div>

                        <div className="ant-slider-div">
                            <div style={{ color: "#fff", height: '40px', lineHeight: '40px', display: "flex", margin: '7px 0' }}>
                                <div className="slide Contrast-icon"></div>
                                <div style={{ color: "#fff", height: '40px', lineHeight: '40px' }}>
                                    <h2 style={{ color: "#fff" }}>&nbsp; GrayWindow </h2>
                                </div>
                            </div>
                            <div style={{ display: 'flex', position: 'relative' }}>
                                <Icon type="minus" style={{ color: "#fff", marginTop: '12px' }} onClick={this.reduceGrayWindow} />
                                &nbsp;&nbsp;
                            <span style={{ display: "inline-block", color: '#fff', position: 'absolute', top: '-7px', left: '23px' }}>&nbsp;0&nbsp; </span>
                                <Slider
                                    range
                                    style={{ width: 200 }}
                                    step={1}
                                    min={0}
                                    max={255}
                                    defaultValue={[0, 255]}
                                    value={[this.state.nGrayMin, this.state.nGrayMax]}
                                    onChange={this.GrayWindowChange}
                                />
                                <span style={{ display: "inline-block", color: '#fff', position: 'absolute', top: '-7px', right: '62px' }}>&nbsp;255&nbsp; </span>
                                &nbsp;&nbsp;
                            <Icon type="plus" style={{ color: "#fff", marginTop: '12px' }} onClick={this.addGrayWindow} />
                                &nbsp;&nbsp;
                            <button size="small" style={{ marginTop: '8px' }}><Icon type="reload" onClick={this.revertGrayWindow} /></button>
                            </div>
                        </div>
                    </Col>
                    <Col span={14} className="">
                        <Row style={{ marginTop: '12px' }}>
                            {/* <Col span={24} >
                                <Select defaultValue="eight" style={{ width: 130 }} onChange={this.ImageProcessing}>
                                    <Option value="eight">8位图像处理</Option>
                                    <Option value="sixTeen">16位图像处理</Option>
                                </Select>
                            </Col> */}
                        </Row>
                        <Row style={{ marginTop: '5px' }} >
                            <Col span={24} className="eightShow">
                                <Button className="btn btn-Reverse" title="Reverse" type={this.state.operationList[0].btnState} onClick={this.handleBtnClick.bind(this, 'Reverse')}></Button>
                                <Button className="btn btn-Emboss" title="Emboss" type={this.state.operationList[1].btnState} style={{ margin: '0 15px' }} onClick={this.handleBtnClick.bind(this, 'Emboss')}></Button>
                                <Button className="btn btn-Sharpness" title="Sharpness" type={this.state.operationList[2].btnState} onClick={this.handleBtnClick.bind(this, 'Sharpness')}></Button>
                                <Button className="btn btn-Smooth1" title="Smooth1" style={{ margin: '0 15px' }} type={this.state.operationList[8].btnState} onClick={this.handleBtnClick.bind(this, 'Smooth1')} ></Button>
                                <Button className="btn btn-Smooth2" title="Smooth2" type={this.state.operationList[9].btnState} onClick={this.handleBtnClick.bind(this, 'Smooth2')} ></Button>
                                <Button className="btn btn-Smooth3" title="Smooth3" style={{ margin: '0 15px' }} type={this.state.operationList[10].btnState} onClick={this.handleBtnClick.bind(this, 'Smooth3')}  ></Button>
                                <Button className="btn btn-gray" title="Gray" type={this.state.operationList[13].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'gray')}></Button>

                                <Button className="btn btn-mist" title="Mist" style={{ margin: '0 15px' }} type={this.state.operationList[14].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'mist')}></Button>
                                <Button className="btn btn-oasis" title="Oasis" type={this.state.operationList[15].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'oasis')}></Button>
                                <Button className="btn btn-settingsun" title="Settingsun" style={{ margin: '0 15px' }} type={this.state.operationList[16].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'settingsun')}></Button>

                            </Col>

                            <Col span={24} style={{ display: 'none' }} className="sixTeenShow">
                                <Button className="btn btn-Reverse" title="Reverse" type={this.state.operationList[0].btnState} onClick={this.handleBtnClick.bind(this, 'Reverse')}></Button>


                            </Col>
                        </Row>

                        <Row style={{ marginTop: '20px' }} >
                            <Col span={24} className="eightShow">

                                <Button className="btn btn-grape" title="Grape" type={this.state.operationList[17].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'grape')}></Button>
                                <Button className="btn btn-ocean" title="Ocean" style={{ margin: '0 15px' }} type={this.state.operationList[18].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'ocean')}></Button>
                                <Button className="btn btn-pavonine" title="Pavonine" type={this.state.operationList[19].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'pavonine')}></Button>

                                <Button className="btn btn-EdgeEnhance1" title="EdgeEnhance1" type={this.state.operationList[4].btnState} style={{ margin: '0 15px' }} onClick={this.handleBtnClick.bind(this, 'EdgeEnhance1')}></Button>
                                <Button className="btn btn-EdgeEnhance2" title="EdgeEnhance2" type={this.state.operationList[5].btnState} onClick={this.handleBtnClick.bind(this, 'EdgeEnhance2')}></Button>
                                <Button className="btn btn-EdgeEnhance3" title="EdgeEnhance3" type={this.state.operationList[6].btnState} style={{ margin: '0 15px' }} onClick={this.handleBtnClick.bind(this, 'EdgeEnhance3')}></Button>
                                <Button className="btn btn-GrayImage" title="GrayImage" type={this.state.operationList[11].btnState} onClick={this.handleBtnClick.bind(this, 'GrayImage')}></Button>
                                <Button className="btn btn-histogram" title="Histogram" loading={this.state.histogramLoading} style={{ margin: '0 15px' }} type={this.state.operationList[12].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'histogram')}></Button>

                                <Button className="btn btn-grape" title="SuspectRectangle" type={this.state.operationList[17].btnState} onClick={this.DrawSuspectRectangle.bind(this)}></Button>
                                <Button className="btn btn-Revert" title="Revert" type={this.state.operationList[3].btnState} onClick={this.handleBtnClick.bind(this, 'Revert')}></Button>
                            </Col>

                            <Col span={24} style={{ display: 'none' }} className="sixTeenShow">

                                <Button className="btn btn-grape" title="Grape" type={this.state.operationList[17].btnState} onClick={this.handleBtnAlgorithmServices.bind(this, 'grape')}></Button>
                                

                                <Button className="btn btn-Revert" title="Revert" style={{ margin: '0 15px' }} type={this.state.operationList[3].btnState} onClick={this.handleBtnClick.bind(this, 'Revert')}></Button>

                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}
