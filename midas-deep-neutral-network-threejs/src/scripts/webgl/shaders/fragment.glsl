precision highp float;

uniform sampler2D uDiffuse;
uniform sampler2D uNormal;
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform bool uActivePointLight;

varying vec2 vUv;

void main() {
  // all maps
  vec4 diffuse = texture2D(uDiffuse, vUv);
  vec4 normal = texture2D(uNormal, vUv);
  vec4 depth = texture2D(uDepth, vUv);

  // light
  float lightSize = 1.;
  float dist = lightSize - distance(uMouse, vUv);
  dist = smoothstep(.0, lightSize, dist);

  float _factor = (.3 + depth.r * .6) + dist;
  float ptl = dot(normalize(vec3(uMouse, .1)), normal.rgb) * _factor;

  // mix with light
  diffuse.rgb *= ptl;

  // compute indicator position
  float pos = distance(uMouse, vUv);
  pos = smoothstep(.1, .0, pos);
  if (uActivePointLight) {
    diffuse.rgb += vec3(pos);
  }

  gl_FragColor.rgb = diffuse.rgb;
  gl_FragColor.a = 1.;
}
