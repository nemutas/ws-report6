precision highp float;

varying vec3 vNormal;

const vec3 Light = vec3(1, 1, 0);

void main() {
  float intensity = dot(normalize(vNormal), normalize(Light));
  intensity = intensity * 0.5 + 0.5;

  vec3 color = vec3(1.0);
  color *= intensity;

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(vNormal, 1.0);
}