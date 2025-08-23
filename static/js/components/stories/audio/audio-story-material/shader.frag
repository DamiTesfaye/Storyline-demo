uniform float uTime;
uniform float uDistortionStrength;
uniform float uPixelationStrength;
uniform float uOpacityStrength;
uniform float uInterlaceStrength;
uniform vec2 uResolution;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    float d2 = map(sin(vUv.y * 5.0 + uTime * 20.0), -0.5, 0.5, 0.0, 1.0) * 0.15;
    d2 = floor(d2 / 0.033) * 0.033;

    if (mod(gl_FragCoord.y, uInterlaceStrength) > 2.0) discard;

    vec2 distortion = vec2(vUv.x + d2 * uDistortionStrength, vUv.y);
    vec4 color = texture2D(tDiffuse, distortion);

    // The original shader had a commented-out #ifdef for alphaTest.
    // This is the active path, which correctly handles transparency.
    gl_FragColor = vec4(color.rgb, color.a * uOpacityStrength);
}