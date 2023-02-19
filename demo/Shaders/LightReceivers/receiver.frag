#version 400

const int POINT_LIGHT       = 0;
const int DIRECTIONAL_LIGHT = 1;
const int SPOT_LIGHT        = 2;

// Structs
struct MaterialParameters
{
  vec3  ambient;    // Reflection coeficient
  vec3  diffuse;    // Reflection coeficient
  vec3  specular;   // Reflection coeficient
  float shininess;  // The exponent
};

struct LightSourceParameters
{
  // Basic properties 
  int   light_type;
  vec3  position;
  vec3  direction; 
  
  // Light intensities
  vec3  ambient;
  vec3  diffuse;
  vec3  specular;
  
  // Spot Light / Flashlight
  float spotExponent;
  float spotOuterAngle;
  float spotInnerAngle;
  
  // Attenuation / Point Light
  float constAttenuation;
  float linearAttenuation;
  float quadrAttenuation;
};

// DATA (This should be done through glUniform etc.)
const float PI = 3.141592;
const vec3 CamPos = vec3(0, 0, 0);

// Inputs / Outputs
out vec4 outputColor;

in vec2 uvs;
in vec3 mNormal;
in vec3 mFragPos;
in vec3 tColor;

uniform sampler2D 	tex_sampler;
uniform bool 		    use_texture;
uniform int         light_count;
uniform MaterialParameters        material;
uniform LightSourceParameters[8]  lights;

vec3 obj_color;

vec3 PointLight(LightSourceParameters light)
{
  // Diffuse
  vec3 N = normalize(mNormal);
  vec3 L = normalize(light.position - mFragPos);
	
  // Specular
  vec3 V = normalize(CamPos - mFragPos);
  vec3 R = 2 * dot(N, L) * N - L; 
  float specFactor = pow ( max( dot(R, V), 0 ), material.shininess);

  // Different light totals
  vec3 ambientTotal = material.ambient * light.ambient * obj_color;
  vec3 diffuseTotal = material.diffuse * light.diffuse * max( dot(N, L), 0 ) * obj_color;
  vec3 specularTotal = material.specular * light.specular * specFactor;
	
	// Point Light's (Attenuation)
	float dist = length(light.position - mFragPos);
	float attenuationFactor = min(1.0, 1.0 / ( light.constAttenuation + 
    light.linearAttenuation * dist + light.quadrAttenuation * dist * dist ));

  // Result / Addition
  return (ambientTotal + diffuseTotal + specularTotal) * attenuationFactor;
}

vec3 DirectionalLight(LightSourceParameters light)
{
  // Diffuse
  vec3 N = normalize(mNormal);
  vec3 L = normalize(-light.direction);					// Directional light
	
  // Specular
  vec3 V = normalize(CamPos - mFragPos);
  vec3 R = 2 * dot(N, L) * N - L; 
  float specFactor = pow ( max( dot(R, V), 0 ), material.shininess);

  // Different light totals
  vec3 ambientTotal = material.ambient * light.ambient * obj_color;
  vec3 diffuseTotal = material.diffuse * light.diffuse * max( dot(N, L), 0 ) * obj_color;
  vec3 specularTotal = material.specular * light.specular * specFactor;

  // Result / Addition
  return ambientTotal + diffuseTotal + specularTotal;
}

vec3 SpotLight(LightSourceParameters light)
{
  // Diffuse
  vec3 N = normalize(mNormal);
  vec3 L = normalize(light.position - mFragPos);			// Point Light
  //vec3 L = normalize(-light.direction);					// Directional light
	
  // Specular
  vec3 V = normalize(CamPos - mFragPos);
  vec3 R = 2 * dot(N, L) * N - L; 
  float specFactor = pow ( max( dot(R, V), 0 ), material.shininess);

  // Different light totals
  vec3 ambientTotal = material.ambient * light.ambient * obj_color;
  vec3 diffuseTotal = material.diffuse * light.diffuse * max( dot(N, L), 0 ) * obj_color;
  vec3 specularTotal = material.specular * light.specular * specFactor;
	
	// Point Light's (Attenuation)
	float dist = length(light.position - mFragPos);
	float attenuationFactor = min(1.0, 1.0 / ( light.constAttenuation + 
    light.linearAttenuation * dist + light.quadrAttenuation * dist * dist ));

	// Spot Light
	vec3 D = light.direction;
	float SpotFactor;
	if 		  ( dot(-L, D) < cos(light.spotOuterAngle) )  SpotFactor = 0.0f;
	else if ( dot(-L, D) > cos(light.spotInnerAngle) ) 	SpotFactor = 1.0f;
	else {
		SpotFactor = pow( (dot(-L, D) - cos(light.spotOuterAngle)) / (cos(light.spotInnerAngle) 
      - cos(light.spotOuterAngle)) , light.spotExponent );	
		SpotFactor = clamp(SpotFactor, 0.0f, 1.0f);
	}

  // Result / Addition
  return (ambientTotal + (diffuseTotal + specularTotal) * SpotFactor) * attenuationFactor;
}

vec3 ComputeLight(LightSourceParameters light)
{
  switch (light.light_type)
  {
    case POINT_LIGHT:
      return PointLight(light);
      break;
    case DIRECTIONAL_LIGHT:
      return DirectionalLight(light);
      break;
    case SPOT_LIGHT:
      return SpotLight(light);
      break;
  }
}

void main()
{
  obj_color = (use_texture ? vec3(texture(tex_sampler, uvs)) : vec3(uvs, 1));
  obj_color = tColor;

 // vec3 light_total = vec3(0,0,0);
 // for (int i = 0; i < light_count; ++i)
 // {
 //   light_total += ComputeLight(lights[i]);
 // }

  outputColor = vec4(obj_color, 1);
}
