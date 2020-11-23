precision highp float;        //所有float类型数据的精度是lowp

varying vec2 v_TexCoord;      //接收插值后的纹理坐标
uniform sampler2D u_image;  //纹理图片像素数据

vec3 hsl2rgb( vec3 c ) {
    vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0, 4.0, 2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}


void main(){
    vec4 texture= texture2D(u_image,v_TexCoord);

    float L = ((max(texture.r, max(texture.g, texture.b)) + min(texture.r, min(texture.g, texture.b))) / 2.0);


    //RGB最大值减去RGB最小值,除以2即为L
    float H = 170.0/255.0;
    float S = 0.0;

    vec3 color = hsl2rgb(vec3(H,S,L));

    gl_FragColor = vec4(color.x,color.y,color.z,texture.a);
    //gl_FragColor = texture;
}