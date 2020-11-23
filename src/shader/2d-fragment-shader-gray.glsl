precision highp float;        //所有float类型数据的精度是lowp

varying vec2 v_TexCoord;      //接收插值后的纹理坐标
uniform sampler2D u_image;  //纹理图片像素数据

uniform float nMin; //灰度值下限
uniform float nMax;//灰度值上限

uniform vec2 u_grayValue;

void main(){
    vec4 texture= texture2D(u_image,v_TexCoord);
    //采集纹素，逐片元赋值像素值
    float nMin = u_grayValue[0];
    float nMax = u_grayValue[1];
    if(texture.r<nMin){
      texture.r = texture.g = texture.b = nMin;
    }else if(texture.r > nMax){
        texture.r = texture.g = texture.b = nMax;
    }
    else{
        texture.r = texture.g = texture.b = (texture.r-nMin)*nMax/(nMax - nMin);
    }
    gl_FragColor = texture;
}