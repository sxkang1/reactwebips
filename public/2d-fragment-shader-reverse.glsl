precision highp float;        //所有float类型数据的精度是lowp

varying vec2 v_TexCoord;      //接收插值后的纹理坐标
uniform sampler2D u_image;  //纹理图片像素数据


void main(){
    vec4 texture= texture2D(u_image,v_TexCoord);
        //采集纹素，逐片元赋值像素值
    //gl_FragColor = texture;
    gl_FragColor = vec4(1.0-texture.r,1.0-texture.g,1.0-texture.b,texture.a);
}