#version 400

layout (location = 0) in vec3 mPos;
layout (location = 1) in vec2 mUVs;
layout (location = 2) in vec3 mVtxNormal;
layout (location = 3) in vec3 mAvgNormal;

out NORMAL_INFO {
	vec4 mNormal;
} mInfo;

uniform mat4 Model2Proj;
uniform mat4 NormalsMtx;
uniform mat4 View2Proj;

uniform bool vtx_normals;

void main()
{
  gl_Position = Model2Proj * vec4(mPos, 1);
	
	vec3 normal = vtx_normals ? mVtxNormal : mAvgNormal;
	mInfo.mNormal = View2Proj * normalize(vec4(mat3(NormalsMtx) * normal, 0.0));
}