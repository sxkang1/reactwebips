precision highp float;        //所有float类型数据的精度是lowp

varying vec2 v_TexCoord;      //接收插值后的纹理坐标
uniform sampler2D u_image;  //纹理图片像素数据
uniform float u_brightness;


void main(){
    vec4 texture= texture2D(u_image,v_TexCoord);

    texture += vec4(u_brightness,u_brightness,u_brightness,0);

    //float luminance = 0.299*texture.r+0.587*texture.g+0.114*texture.b;
    //采集纹素，逐片元赋值像素值

    //gl_FragColor = vec4(r,g,b,5);
    gl_FragColor = vec4(texture.r,texture.g,texture.b,5);
}