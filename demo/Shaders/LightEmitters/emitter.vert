#version 400

layout (location = 0) in vec3 mPos;

uniform mat4 Model2Proj;

void main()
{
  gl_Position = Model2Proj * vec4(mPos, 1);
}