#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

// we need to declare an output for the fragment shader
out vec4 outColor;

vec3 hsl2rgb( vec3 c ) {
    vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0, 4.0, 2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

vec3 rgb2hsl(vec3 c){
    float CMax = (max(c.x, max(c.y, c.z)))/1.0;
    float CMin = (min(c.x, min(c.y, c.z)))/1.0;
    float del_Max = CMax - CMin;
    float H= 0.0,S = 0.0,L = 0.0;
    L = (CMax+CMin)/2.0;
    if(del_Max == 0.0){
        H = 0.0;
        S = 0.0;
    }else{
        if(L < 0.5) S = del_Max/(CMax+CMin);
        else S = del_Max/(2.0-CMax-CMin);

        float del_R = (((CMax - c.x) / 6.0) + (del_Max / 2.0)) / del_Max;
        float del_G = (((CMax - c.y) / 6.0) + (del_Max / 2.0)) / del_Max;
        float del_B = (((CMax - c.z) / 6.0) + (del_Max / 2.0)) / del_Max;

        if(c.x == CMax) H = del_B - del_G;
        else if (c.y == CMax) H = (1.0 / 3.0) + del_R - del_B;
        else if (c.z == CMax) H = (2.0 / 3.0) + del_G - del_R;

        if (H < 0.0)  H = H + 1.0;
        if (H > 1.0)  H = H  - 1.0;

    }
    return vec3(H,S,L);
}


void main() {
  vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));
  float mediumL = 0.0,minValue = 20000.0,maxValue = -1.0;
  float nThreshold = 4000.0/65535.0/255.0;
  vec3 colorSum;

  vec2 index[25];
  index[0] = vec2(0,0);
  index[1] = vec2(0,-1);
  index[2] = vec2(-1,-1);
  index[3] = vec2(-1,0);
  index[4] = vec2(-1,1);
  index[5] = vec2(0,1);
  index[6] = vec2(1,1);
  index[7] = vec2(1,0);
  index[8] = vec2(1,-1);
  index[9] = vec2(1,-2);
  index[10] = vec2(0,-2);
  index[11] = vec2(-1,-2);
  index[12] = vec2(-2,-2);
  index[13] = vec2(-2,-1);
  index[14] = vec2(-2,0);
  index[15] = vec2(-2,1);
  index[16] = vec2(-2,2);
  index[17] = vec2(-1,2);
  index[18] = vec2(0,2);
  index[19] = vec2(1,2);
  index[20] = vec2(2,2);
  index[21] = vec2(2,1);
  index[22] = vec2(2,0);
  index[23] = vec2(2,-1);
  index[24] = vec2(2,-2);

  
  if(rgb2hsl((texture(u_image, v_texCoord + onePixel * vec2(0,0))).rgb).z<1.0){
      float nNum = 9.0;
      for(int i =0; i<9;i++){
            vec3 tex = (texture(u_image, v_texCoord + onePixel * index[i])).rgb;
            float tempL = rgb2hsl(tex).z;
            if (tempL < minValue){
                minValue = tempL;
            }
            if(tempL>maxValue){
                maxValue = tempL;
            }
            mediumL += tempL;
        }

        if(maxValue-minValue<=nThreshold){
            for(int i = 9; i < 25; i++){
                vec3 tex = (texture(u_image, v_texCoord + onePixel * index[i])).rgb;
                float tempL = rgb2hsl(tex).z;
                mediumL += tempL;
            }
            nNum = 25.0;
        }

        mediumL = mediumL/nNum;
        float aa = 3.0;          //300.0!!!!!!!
        float Div = exp(1.0+aa);
        float p1 = mediumL;
        p1 = p1*p1;
        float p2 = pow(p1*1.43,2.0);
        float dd1 = 1.3/(1.0+p2);
        
      
        vec3 tex = (texture(u_image, v_texCoord + onePixel * vec2(0,0))).rgb;
        vec3 hsl = rgb2hsl(tex);
        float tempL = hsl.z;
        
        float Diff = (tempL-mediumL);
        if(Diff < 0.0){
            float It = exp(1.0-aa*Diff)/Div;
            tempL = mediumL-dd1*It;
        }
        else{
            float It = exp(1.0+aa*Diff)/Div;
            tempL = mediumL + dd1*It;
        }

        tempL = clamp(tempL,0.0,1.0);
        colorSum = vec3(hsl.x,hsl.y,tempL);
        colorSum = hsl2rgb(colorSum);
  }

  

  //outColor = vec4((texture(u_image, v_texCoord)).rgb, 1);
  outColor = vec4(colorSum.xyz, 1);
}