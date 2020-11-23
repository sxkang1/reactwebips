import React, { Component } from 'react'
import $ from 'jquery'
import '../asserts/css/index.css'
import '../asserts/css/antd.min.css'
import { Button, Row, Col, Icon, Slider } from 'antd'
import Detector from '../model/Detector'
import { GLSLLoader } from '../model/GLSLLoader'
import * as WebglUtils from '../model/WebglUtils'
import axios from '../model/Axios'


export default class WebGl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //操作;
            operationList: [
                // {
                //     name:'Color',
                //     using:true,
                //     programCategory:''
                // },
                // {
                //     name:'Color1',
                //     using:true,
                //     programCategory:''
                // },
                {
                    name: 'Reverse',
                    using: false,
                    programCategory: 'reverse',
                    btnState: " "
                },
                {
                    name: 'emboss',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'sharpness',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'revert',
                    using: false,
                    programCategory: '',
                    btnState: " "
                },
                {
                    name: 'edgeDetect4',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'edgeDetect5',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'edgeDetect6',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'edgeDetect',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'edgeDetect1',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'edgeDetect2',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                },
                {
                    name: 'edgeDetect3',
                    using: false,
                    programCategory: 'kernel',
                    btnState: " "
                }


            ],
            operationHistory: "",
            brightVal: 50,
            contrastVal: 50,
           
        };
        this.imageList = [];
        this.imagesPath = "";
        this.currentImageIndex = 0;
        this.webgl = "";
        this.dragging = false;
        this.lMouseDownX = -1;
        this.lMouseDownY = -1;
        this.image = null;
        this.shaderVarray = null;
        this.originalProgram = {};
        this.brightVal = 50;
        this.contrastVal = 50;

        this.offsetx = 0;
        this.offsety = 0;

        this.originalProgram = new Object();
        this.kernelProgram = new Object();
        this.reverseProgram = new Object();

        // 创建两个纹理绑定到帧缓冲
        this.textures = [];
        this.framebuffers = [];

        this.kernels = {
            normal: [
                0, 0, 0,
                0, 1, 0,
                0, 0, 0,
            ],
            gaussianBlur: [
                0.045, 0.122, 0.045,
                0.122, 0.332, 0.122,
                0.045, 0.122, 0.045,
            ],
            gaussianBlur2: [
                1, 2, 1,
                2, 4, 2,
                1, 2, 1,
            ],
            gaussianBlur3: [
                0, 1, 0,
                1, 1, 1,
                0, 1, 0,
            ],
            unsharpen: [
                -1, -1, -1,
                -1, 9, -1,
                -1, -1, -1,
            ],
            sharpness: [
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
            edgeDetect4: [
                -1, -1, -1,
                0, 0, 0,
                1, 1, 1,
            ],
            edgeDetect5: [
                -1, -1, -1,
                2, 2, 2,
                -1, -1, -1,
            ],
            edgeDetect6: [
                -5, -5, -5,
                -5, 39, -5,
                -5, -5, -5,
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
            emboss: [
                -2, -1, 0,
                -1, 1, 1,
                0, 1, 2,
            ],
        };


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

    handleBtnClick = (operaionType) => {
        let operaions = this.state.operationList;
        if (operaionType === 'revert') {
            operaions.forEach((item) => {
                item.using = false;
                item.btnState = " ";
                $(".btn").css("border", "0px solid white")
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
        this.DrawScene(this.shaderVarray);
    }

    componentWillMount() {
        // this.getImagsData()

        // console.log(this.props.location.state)
        // const {dispatch,location}=this.props;


    }

    componentDidMount() {
        $('.prevs').css('display', 'none');
        $('.next').css('display', 'block');

        if (this.shaderVarray == null) {
            var GLSLLoaderTemp = new GLSLLoader();
            GLSLLoaderTemp.loadArrays(Detector.shaders, this.DrawScene);
        }

        let recvParam;

        if (this.props.location.state) {//判断当前有参数
            recvParam = this.props.location.state.path;
            sessionStorage.setItem('data', recvParam);// 存入到sessionStorage中
        } else {
            recvParam = sessionStorage.getItem('data');// 当state没有参数时，取sessionStorage中的参数
        }
        
        this.imageList.push(recvParam)
        this.imagesPath = recvParam
        console.log('recvParam1---', this.imageList)
        console.log('imagesPath---', this.imagesPath)
        this.GetOperationHistory();
    }


    computeKernelWeight = (kernel) => {
        var weight = kernel.reduce(function (prev, curr) {
            return prev + curr;
        });
        return weight <= 0 ? 1 : weight;
    }

    InitWebGLProgram = () => {
        // var xCenter = (this.refs.canvas.width - this.image.width) / 2;
        // var yCenter = (this.refs.canvas.height - this.image.height) / 2;
        // Detector.translationMatrix = [xCenter,yCenter];
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

    DrawScene = (shaderVarray) => {
        const canvas = this.refs.canvas;
        this.webgl = canvas.getContext('webgl2') || canvas.getContext("experimental-webgl");
        var image = new Image();
        console.log("this.imageList----",this.imageList)
         //image.src = require(this.imageList[this.currentImageIndex]);
        //image.src = "http://payposter.com/poster_preview/wallpaper-palm-trees-boat-tropical-sea-beach-sand-clouds-1920x1200-hd-picture-image-26053259.jpg";
        
        // image.src = this.imageList[this.currentImageIndex];
        image.src = this.imagesPath;
        console.log('image.src-----',image.src)
        image.onload = () => {
            this.renderMain(image, shaderVarray);
        };
    }

    renderMain = (image, shaderVarray) => {
        if (!this.webgl) {
            console.log("not support webgl!");
        }

        this.image = image;
        this.shaderVarray = shaderVarray;

        WebglUtils.resizeCanvas(this.refs.canvas);

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
        // 将图像上传到纹理  http://www.jq22.com/web-skill78
        this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, image);

        this.DrawEffection();

        this.GetOperationHistory();
    }

    DrawEffection = () => {
        this.webgl.viewport(0, 0, this.refs.canvas.width, this.refs.canvas.height);
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
                    // this.webgl.uniform2f(this.reverseProgram.resolutionLocation, this.refs.canvas.width, this.refs.canvas.height);

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
            }
        });

        // 最后将结果绘制到画布
        this.webgl.useProgram(this.kernelProgram.program);// //调用程序对象，切换GPU上下文

        //最终显示正确的初始位置;
        var xBegin = (this.refs.canvas.width - this.image.width) / 2;
        var yBegin = (this.refs.canvas.height - this.image.height) / 2;
        // if( this.lMouseDownX != -1 && this.lMouseDownY != -1){
        //     xCenter = this.lMouseDownX;
        //     yCenter = this.lMouseDownY;
        //     Detector.translationMatrix = [0,0];
        // }

        this.SetPositionLocation(xBegin, yBegin, this.kernelProgram.a_Position);
        // this.SetPositionLocation(0, 0, this.kernelProgram.a_Position);


        //最终设置位移矩阵和缩放矩阵;
        this.webgl.uniform2fv(this.kernelProgram.translationLocation, Detector.translationMatrix);//设置位移
        this.webgl.uniform2fv(this.kernelProgram.scaleLocation, Detector.scaleMatrix);//设置缩放
        WebglUtils.setFramebuffer(this.webgl, null, this.kernelProgram, this.refs.canvas.width, this.refs.canvas.height);
        this.drawWithKernel('normal');

    }

    drawWithKernel = (name) => {
        this.webgl.uniform1fv(this.kernelProgram.kernelLocation, this.kernels[name]);
        this.webgl.uniform1f(this.kernelProgram.kernelWeightLocation, this.computeKernelWeight(this.kernels[name]));


        this.webgl.clearColor(0, 0, 0, 0);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);

        this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);

    }

    getImagsData() {
        axios.get('https://www.easy-mock.com/mock/5b4eb12d56c59c6f56266215/api/order_list')
            .then((response) => {
                this.imageList = response.data;
                // this.setState({
                //     image: response.data,
                //     delay: 2000
                // })
            })
            .catch(function (error) {
                // console.log(error);
            });

    }
    next = () => {
        this.currentImageIndex++;
        if (this.currentImageIndex === this.imageList.length) {
            this.currentImageIndex--;
        }

        if (this.currentImageIndex === this.imageList.length - 1) {
            $('.next').css('display', 'none');
            $('.prevs').css('display', 'block');

        }
        this.DrawScene(this.shaderVarray);

    }
    prevs = () => {
        this.currentImageIndex--;
        if (this.currentImageIndex === -1) {
            this.currentImageIndex = 0;
        }
        if (this.currentImageIndex === 0) {
            $('.prevs').css('display', 'none');
            $('.next').css('display', 'block');
        }
        this.DrawScene(this.shaderVarray);
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
    MouseDown = (event) => {
        event.preventDefault();
        // 鼠标点击位置
        this.lMouseDownX = event.clientX;
        this.lMouseDownY = event.clientY;
        this.dragging = true;
    }


    MouseUp = (event) => {
        event.preventDefault();
        // this.lMouseDownX = -1;
        // this.lMouseDownY = -1;
        this.dragging = false;
    }

    MouseLeave = (event) => {
        event.preventDefault();
        this.dragging = false;
    }

    MouseMove = (event) => {
        event.preventDefault();

        var x = event.clientX, y = event.clientY;
        this.offsetx = x;
        this.offsety = y;

        if (this.dragging) {

            var dx = x - this.lMouseDownX;
            var dy = y - this.lMouseDownY;

            Detector.translationMatrix[0] += dx;
            Detector.translationMatrix[1] += dy;
            this.DrawEffection();

        }

        this.lMouseDownX = x;
        this.lMouseDownY = y;
    }


    MouseWheel = (event) => {
        //min: -1/4, max: 4
        var originalScaleMatrix = [Detector.scaleMatrix[0], Detector.scaleMatrix[1]];
        if (event.deltaY < 0) {
            Detector.scaleMatrix[0] += 0.1;
            Detector.scaleMatrix[1] += 0.1;
        }
        else {
            Detector.scaleMatrix[0] -= 0.1;
            Detector.scaleMatrix[1] -= 0.1;
        }
        if (Detector.scaleMatrix[0] < -1 / 4) {
            Detector.scaleMatrix[0] = -1 / 4;
            Detector.scaleMatrix[1] = -1 / 4;
        }
        if (Detector.scaleMatrix[0] > 4) {
            Detector.scaleMatrix[0] = 4;
            Detector.scaleMatrix[1] = 4;
        }
        //以图像中心为中心进行缩放;
        var width = this.image.width * (Detector.scaleMatrix[0] - originalScaleMatrix[0]);
        var height = this.image.height * (Detector.scaleMatrix[1] - originalScaleMatrix[1]);
        // if(this.lMouseDownX != -1 && this.lMouseDownY != -1){
        //     var xBegin =((this.refs.canvas.width - this.image.width)/2)*originalScaleMatrix[0];
        //     var yBegin = (this.refs.canvas.height - this.image.height) / 2;
        //     width = (this.lMouseDownX-xBegin)*(Detector.scaleMatrix[0]-originalScaleMatrix[0]);
        //     height = (this.lMouseDownY-yBegin)*(Detector.scaleMatrix[1]-originalScaleMatrix[1]);
        // }

        Detector.translationMatrix = [Detector.translationMatrix[0] - width, Detector.translationMatrix[1] - height / 2];
        this.DrawEffection();
    }



    render() {
        return (
            <div className="divBox">
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
                        <canvas id="webgl" ref="canvas" style={{ width: '100%', height: 'calc(70vh)' }}
                            onMouseDown={this.MouseDown}
                            onMouseLeave={this.MouseLeave}
                            onMouseMove={this.MouseMove}
                            onMouseUp={this.MouseUp}
                            onWheel={this.MouseWheel}
                        ></canvas>

                        <Icon className="prevs" type="double-left" onClick={this.prevs} />
                        <Icon className="next" type="double-right" onClick={this.next} />
                    </Col>
                </Row>

                <Row className="bootoms">
                    <Col span={12}>
                        <div className="ant-slider-div">
                            <div style={{ color: "#fff", height: '40px', lineHeight: '40px', display: "flex", margin: '10px 0' }}>
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
                                    style={{ width: 300 }}
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
                            <div style={{ color: "#fff", height: '40px', lineHeight: '40px', display: "flex", margin: '10px 0' }}>
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
                                    style={{ width: 300 }}
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

                    <Col span={12} className="">
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <Button className="btn btn-Reverse" title="Reverse" type={this.state.operationList[0].btnState} onClick={this.handleBtnClick.bind(this, 'Reverse')}></Button>
                                <Button className="btn btn-emboss" title="Emboss" type={this.state.operationList[1].btnState} style={{ margin: '0 30px' }} onClick={this.handleBtnClick.bind(this, 'emboss')}></Button>
                                <Button className="btn btn-sharpness" title="Sharpness" type={this.state.operationList[2].btnState} onClick={this.handleBtnClick.bind(this, 'sharpness')}></Button>
                                <Button className="btn btn-revert" title="Revert" type={this.state.operationList[3].btnState} style={{ margin: '0 30px' }} onClick={this.handleBtnClick.bind(this, 'revert')}></Button>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <Button className="btn btn-edgeDetect4" title="edgeDetect1" type={this.state.operationList[4].btnState} onClick={this.handleBtnClick.bind(this, 'edgeDetect4')}></Button>
                                <Button className="btn btn-edgeDetect5" title="edgeDetect2" type={this.state.operationList[5].btnState} style={{ margin: '0 30px' }} onClick={this.handleBtnClick.bind(this, 'edgeDetect5')}></Button>
                                <Button className="btn btn-edgeDetect6" title="edgeDetect3" type={this.state.operationList[6].btnState} onClick={this.handleBtnClick.bind(this, 'edgeDetect6')}></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}
