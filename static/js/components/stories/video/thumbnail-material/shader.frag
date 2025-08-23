//module.exports = "#define GLSLIFY 1\nuniform float uInverse;\nuniform float uSaturation;\nuniform float uBrightness;\nuniform float uContrast;\nuniform float uWhiteOverlay;\nuniform float uTime;\nuniform float uTimeOffset;\nuniform float uRolloverStrength;\nuniform vec2 uOffset;\nuniform float uScale;\nuniform sampler2D tDiffuse;\nuniform sampler2D tAlpha;\nvarying vec2 vUv;\n\n/* const float scale = .93; */\nconst vec4 white = vec4(1.);\nconst vec4 yellow = vec4(250./255., 235./255., 175./255., 1.);\n\n" + require('glsl-blend/overlay.glsl') + " \n\nfloat map(float value, float min1, float max1, float min2, float max2) {\n  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);\n}\n\nvec4 invert(vec4 color) {\n    return vec4(1.0 - color.r, 1.0 -color.g, 1.0 -color.b, 1);\n}\n\nvec4 saturation(vec3 color, float strength) {\n    float desaturation = 1. - strength;\n\tvec3 grayXfer = vec3(0.3, 0.59, 0.11);\n\tvec3 gray = vec3(dot(grayXfer, color));\n\treturn vec4(mix(color, gray, desaturation), 1.0);\n}\n\nvec4 brightnessContrast(vec3 color, float brightness, float contrast) {\n    vec3 colorContrasted = color * contrast;\n\tvec3 bright = colorContrasted + vec3(brightness, brightness, brightness);\n    return vec4(bright, 1.);\n}\n\nvoid main() {\n    vec2 vUvScaled = (vUv - 0.5) * uScale + (0.5 /* * uScale */);\n    vec4 color = texture2D(tDiffuse, vUvScaled  + uOffset );\n    if (uInverse > 0.) {\n        vec4 colorInverse = invert(color);\n        color = mix(color, colorInverse, uInverse);\n    }\n    if (uSaturation < 1.) {\n        color = saturation(color.rgb, uSaturation);\n    }\n    color = brightnessContrast(color.rgb, uBrightness, uContrast);\n\n    if (uRolloverStrength > 0.) {\n        float s1 = map(sin(uTime * uRolloverStrength * 7. + 3. + uTimeOffset), -1., 1., 0., 1.) * uRolloverStrength * .3;\n        float s2 = map(sin(uTime * 1. + uTimeOffset), -1., 1., 0., 1.) * uRolloverStrength;\n        float s = (s1 + s2) *.5 * (1. - uInverse);\n        color = vec4(blendOverlay( color.rgb, yellow.rgb, s), color.a);\n    }\n\n    // this is not alpha anymore, it just cuts a white border arounnd the image\n    vec4 alpha = texture2D(tAlpha, vUv);\n    color = color + 1. - alpha.r;\n    color = mix(color, white, uWhiteOverlay);\n    \n    gl_FragColor = vec4(color.rgb, 1. );\n}";
uniform float uInverse;
uniform float uSaturation;
uniform float uBrightness;
uniform float uContrast;
uniform float uWhiteOverlay;
uniform float uTime;
uniform float uTimeOffset;
uniform float uRolloverStrength;
uniform vec2 uOffset;
uniform float uScale;
uniform sampler2D tDiffuse;
uniform sampler2D tAlpha;

varying vec2 vUv;

const vec4 white = vec4(1.0);
const vec4 yellow = vec4(250.0/255.0, 235.0/255.0, 175.0/255.0, 1.0);

// From glsl-blend/overlay
float blendOverlay(float base, float blend) {
    return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
    return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec4 invert(vec4 color) {
    return vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, 1.0);
}

vec4 saturation(vec3 color, float strength) {
    float desaturation = 1.0 - strength;
    vec3 grayXfer = vec3(0.3, 0.59, 0.11);
    vec3 gray = vec3(dot(grayXfer, color));
    return vec4(mix(color, gray, desaturation), 1.0);
}

vec4 brightnessContrast(vec3 color, float brightness, float contrast) {
    vec3 colorContrasted = color * contrast;
    vec3 bright = colorContrasted + vec3(brightness);
    return vec4(bright, 1.0);
}

void main() {
    vec2 vUvScaled = (vUv - 0.5) * uScale + 0.5;
    vec4 color = texture2D(tDiffuse, vUvScaled + uOffset);

    if (uInverse > 0.0) {
        vec4 colorInverse = invert(color);
        color = mix(color, colorInverse, uInverse);
    }

    if (uSaturation < 1.0) {
        color = saturation(color.rgb, uSaturation);
    }

    color = brightnessContrast(color.rgb, uBrightness, uContrast);

    if (uRolloverStrength > 0.0) {
        float s1 = map(sin(uTime * uRolloverStrength * 7.0 + 3.0 + uTimeOffset), -1.0, 1.0, 0.0, 1.0) * uRolloverStrength * 0.3;
        float s2 = map(sin(uTime * 1.0 + uTimeOffset), -1.0, 1.0, 0.0, 1.0) * uRolloverStrength;
        float s = (s1 + s2) * 0.5 * (1.0 - uInverse);
        color = vec4(blendOverlay(color.rgb, yellow.rgb, s), color.a);
    }

    // This is not alpha anymore, it just cuts a white border around the image
    vec4 alpha = texture2D(tAlpha, vUv);
    color = color + 1.0 - alpha.r;
    color = mix(color, white, uWhiteOverlay);

    gl_FragColor = vec4(color.rgb, 1.0);
}