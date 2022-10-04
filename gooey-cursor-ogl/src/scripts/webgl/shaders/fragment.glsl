precision highp float;

uniform sampler2D uMap;
uniform sampler2D uMapBW;
uniform sampler2D uMapNoise;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;

varying vec2 vUv;

vec3 Rectangle(in vec2 size, in vec2 st, in vec2 p, in vec3 c) {
  float top = step(1. - (p.y + size.y), 1. - st.y);
  float right = step(1. - (p.x + size.x), 1. - st.x);
  float bottom = step(p.y, st.y);
  float left = step(p.x, st.x);
  return top * right * bottom * left * c;
}

#include ./noises/perlin3d.glsl;
#include ./noises/cnoise.glsl;

void main() {
  vec4 noiseTexture = texture2D(uMapNoise, vUv);
  vec2 noiseRecOffset = noiseTexture.rb * 0.1;
  float noiseMultiplier = 0.05;
  float noise = cnoise(vec3(vUv, uTime * 0.005) * 10.0);
  float noiseRect = perlin3d(vec3(vUv + noiseRecOffset, uTime * 0.01) * 15.0);

  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 newUV = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec2 maskUV = vec2(
    newUV.x + 0.15,
    newUV.y + 0.15
  );

  maskUV.x += noiseRect * 0.1;
  maskUV.y += noiseRect * 0.1;

  vec2 maskSize = vec2(0.3, 0.3);
  vec2 maskPosition = uMouse;
  vec3 maskColor = vec3(1.0);
  vec3 mask = Rectangle(maskSize, maskUV, maskPosition, maskColor);

  vec2 fontImageUV = vec2(newUV.x, newUV.y);

  fontImageUV.x += noise * noiseMultiplier;
  fontImageUV.y += noise * noiseMultiplier;

  vec4 tex = texture2D(uMap, fontImageUV);
  vec4 texBW = texture2D(uMapBW, newUV);

  vec3 frontImage = tex.rgb * mask;
  vec3 backImage = texBW.rgb * (1.0 - mask);

  gl_FragColor.rgb = backImage + frontImage;
  gl_FragColor.a = 1.;
}
