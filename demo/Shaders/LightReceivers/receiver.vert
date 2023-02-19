#version 400

layout (location = 0) in vec3 mPos;
layout (location = 1) in vec2 mUVs;
layout (location = 2) in vec3 mVtxNormal;
layout (location = 3) in vec3 mAvgNormal;
layout (location = 4) in vec3 mColor;

uniform mat4 Model2Proj;
uniform mat4 Model2View;
uniform mat4 NormalsM2V;

uniform bool vtx_normals;

out vec2 uvs;
out vec3 mNormal;
out vec3 mFragPos;
out vec3 tColor;

void main()
{
    uvs = mUVs;
	
    gl_Position = Model2Proj * vec4(mPos, 1);
	mFragPos	= vec3(Model2View * vec4(mPos, 1));
		
	vec3 normal = vtx_normals ? mVtxNormal : mAvgNormal;
	mNormal = mat3(NormalsM2V) * normal;
    
    tColor = mColor;
}