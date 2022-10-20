precision highp float;

uniform sampler2D uMap;
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;

varying vec2 vUv;

vec2 mirrored(vec2 v) {
  vec2 m = mod(v, 2.0);
  return mix(m, 2.0 - m, step(1.0, m));
}

void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 newUV = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec4 tex = texture2D(uDepth, mirrored(newUV));
  vec2 fake3d = vec2(newUV.x + (tex.r - 0.5) * uMouse.x / 75.0, newUV.y + (tex.r - 0.5) * uMouse.y / 65.0);

  gl_FragColor = texture2D(uMap, mirrored(fake3d));
}
