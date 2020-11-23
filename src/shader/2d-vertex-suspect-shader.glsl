attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;

uniform vec2 u_scale;

void main() {
   // Scale the position
    vec2 scaledPosition = a_position * u_scale;

    // 加上平移量
    vec2 position = scaledPosition + u_translation;

    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = position/u_resolution;

    vec2 zeroToTwo = zeroToOne * 2.0;

    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace*vec2(1,-1),0,1);
}