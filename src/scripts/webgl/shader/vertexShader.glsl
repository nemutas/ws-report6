precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform vec2 uCenter;

varying vec3 vNormal;

#define PI 3.141592653589793

float wave(vec3 pos, vec2 center, float amp, float freq, float phase, float speed) {
  float dist = distance(pos.xz, center);
  float neibourCenter = smoothstep(0.0, 0.1, dist);
  float decay = 1.0 - smoothstep(0.1, 0.3, dist);
  return amp * sin(dist * freq + phase - uTime * speed) * neibourCenter * decay;
}

vec3 displace(vec3 pos) {
  vec3 result = pos;
  result.y += wave(pos, uCenter, 0.01, 80.0, 0.0, 5.0);
  result.y += wave(pos, vec2(-0.15, 0.0), 0.01, 80.0, PI, 5.0);
  return result;
}

#include '../glsl/transpose.glsl'
#include '../glsl/inverse.glsl'
#include '../glsl/recalcNormal.glsl'

void main() {
  vec3 pos = displace(position);
  vec3 norm = recalcNormal(pos);

  mat4 normalMatrix = inverse(transpose(modelMatrix));
  vNormal = (normalMatrix * vec4(norm, 0.0)).xyz;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}