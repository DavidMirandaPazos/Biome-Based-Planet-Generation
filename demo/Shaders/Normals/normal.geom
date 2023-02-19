#version 400

layout(triangles) in;
layout(line_strip, max_vertices = 6) out;

const	float length = 4.0;

in NORMAL_INFO {
	vec4 mNormal;
} gs_in[];

void main()
{
	gl_Position = gl_in[0].gl_Position;
	EmitVertex();
	gl_Position = gl_in[0].gl_Position + gs_in[0].mNormal * length;
	EmitVertex();
	EndPrimitive();
	gl_Position = gl_in[1].gl_Position;
	EmitVertex();
	gl_Position = gl_in[1].gl_Position + gs_in[1].mNormal * length;
	EmitVertex();
	EndPrimitive();
	gl_Position = gl_in[2].gl_Position;
	EmitVertex();
	gl_Position = gl_in[2].gl_Position + gs_in[2].mNormal * length;
	EmitVertex();
	EndPrimitive();
}