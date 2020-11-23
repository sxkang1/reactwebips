#version 300 es

in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
uniform vec2 u_resolution;

uniform vec2 u_translation;

uniform vec2 u_scale;


// all shaders have a main function
void main() {
  // 缩放
  vec2 scaledPosition = a_position * u_scale;

  // 加上平移量
  vec2 position = scaledPosition + u_translation;

  vec2 zeroToOne = position / u_resolution;

  vec2 zeroToTwo = zeroToOne * 2.0;

  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  v_texCoord = a_texCoord;
}