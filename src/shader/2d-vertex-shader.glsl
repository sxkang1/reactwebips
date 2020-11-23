attribute vec2 a_Position;   //顶点位置坐标
attribute vec2 a_TexCoord;   //纹理坐标
varying vec2 v_TexCoord;  //插值后纹理坐标

uniform vec2 u_resolution;
uniform vec2 u_translation;

uniform vec2 u_scale;

void main(){
    // Scale the position
    vec2 scaledPosition = a_Position * u_scale;

    // 加上平移量
    vec2 position = scaledPosition + u_translation;

    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = position/u_resolution;

    vec2 zeroToTwo = zeroToOne * 2.0;

    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace*vec2(1,-1),0,1);

    //gl_Position = a_Position; //逐顶点处理
    v_TexCoord = a_TexCoord;   //纹理坐标插值计算
    //关键字attribute声明的顶点数据赋值给varying关键字声明的变量，该顶点数据在顶点光栅化的时候会进行插值计算，内插出一系列和片元一一对应的数据，不论顶点的颜色数据，还是顶点的纹理坐标数据都会进行插值计算。
}