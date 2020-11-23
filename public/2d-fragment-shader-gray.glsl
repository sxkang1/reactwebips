precision highp float;        //所有float类型数据的精度是lowp

varying vec2 v_TexCoord;      //接收插值后的纹理坐标
uniform sampler2D u_image;  //纹理图片像素数据

uniform float nMin; //灰度值下限
uniform float nMax;//灰度值上限

uniform vec2 u_grayValue;

vec3 hsl2rgb( vec3 c ) {
    vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0, 4.0, 2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}



void main(){
    vec4 texture= texture2D(u_image,v_TexCoord);
    //采集纹素，逐片元赋值像素值
    float nMin = u_grayValue[0];
    float nMax = u_grayValue[1];

    float CMax = (max(texture.r, max(texture.g, texture.b)))/1.0;
    float CMin = (min(texture.r, min(texture.g, texture.b)))/1.0;
    float del_Max = CMax - CMin;

    //RGB最大值减去RGB最小值,除以2即为L
    float L = ((CMax + CMin) / 2.0);
    float H,S;

    if(del_Max == 0.0){
        H = 0.0;
        S = 0.0;
    }
    else{
        if(L < 0.5) S = del_Max/(CMax+CMin);
        else S = del_Max/(2.0-CMax-CMin);

        float del_R = (((CMax - texture.r) / 6.0) + (del_Max / 2.0)) / del_Max;
        float del_G = (((CMax - texture.g) / 6.0) + (del_Max / 2.0)) / del_Max;
        float del_B = (((CMax - texture.b) / 6.0) + (del_Max / 2.0)) / del_Max;

        if(texture.r == CMax) H = del_B - del_G;
        else if (texture.g == CMax) H = (1.0 / 3.0) + del_R - del_B;
        else if (texture.b == CMax) H = (2.0 / 3.0) + del_G - del_R;

        if (H < 0.0)  H = H + 1.0;
        if (H > 1.0)  H = H  - 1.0;
    }

    if(L <= nMin){
      L = 0.0;
    }else if(L >= nMax){
        L = 1.0;
    }
    else{
        L = (L-nMin)*1.0/(nMax - nMin);
    }

    vec3 color = hsl2rgb(vec3(H,S,L));


    gl_FragColor = vec4(color.x,color.y,color.z,texture.a);


    //gl_FragColor = texture;
}