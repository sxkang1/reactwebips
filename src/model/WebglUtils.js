// 辅助方法：初始化着色器
export function initShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('error occured compiling the shaders:' + gl.getShaderInfoLog(shader));
        return null;
    }
    
    return shader;
}


// 辅助方法：初始化着色器程序
export function initProgram(gl, vsource, fsource) {
    let vShader = initShader(gl, gl.VERTEX_SHADER, vsource);
    let fShader = initShader(gl, gl.FRAGMENT_SHADER, fsource);
    // 创建WebGL程序
    let program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    // 判断是否创建成功
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('unable to initialize!');
        return;
    }
    //gl.useProgram(program);
    return program;
}


export function createAndSetupTexture(webgl) {
    var texture = webgl.createTexture();//创建纹理图像缓冲区
    webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, true); //纹理图片上下反转
    //Detector.webgl.activeTexture(Detector.webgl.TEXTURE0);//激活0号纹理单元TEXTURE0
    webgl.bindTexture(webgl.TEXTURE_2D, texture);

    // 设置参数，让我们可以绘制任何尺寸的图像
    // working with pixels.
    //设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    //设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
    //Detector.webgl.texParameteri(Detector.webgl.TEXTURE_2D, Detector.webgl.TEXTURE_MIN_FILTER, Detector.webgl.NEAREST);
    //Detector.webgl.texParameteri(Detector.webgl.TEXTURE_2D, Detector.webgl.TEXTURE_MAG_FILTER, Detector.webgl.NEAREST);
    return texture;
}


export function setFramebuffer(webgl,framebuffer,program, width, height) {
    // make this the framebuffer we are rendering to.
    webgl.bindFramebuffer(webgl.FRAMEBUFFER, framebuffer);

    // Tell the shader the resolution of the framebuffer.
    webgl.useProgram(program.program);// //调用程序对象，切换GPU上下文
    webgl.uniform2f(program.resolutionLocation, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    webgl.viewport(0, 0, width, height);
}


export function resizeCanvas(canvas) {
    // 获取浏览器中画布的显示尺寸
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // console.log(displayWidth);
    // console.log(displayHeight);
    
    // 检尺寸是否相同
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {
        // 设置为相同的尺寸
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }
}