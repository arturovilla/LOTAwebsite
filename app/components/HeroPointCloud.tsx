"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PerspectiveCamera,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  type BufferGeometry,
  type Group,
} from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

const POINT_CLOUD =
  "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/hero.ply";

// Static defaults baked from earlier tuning; these seed the debug sliders.
const DEFAULT_PITCH_DEG = 0;
const DEFAULT_YAW_DEG = -18;
const DEFAULT_ROLL_DEG = 0;
const DEFAULT_TRANSLATE_X = 3.05;
const DEFAULT_TRANSLATE_Y = 0.65;
const DEFAULT_POINT_SIZE = 0.002;

const DEFAULT_CAMERA_DIST_MUL = 1.8;
const DEFAULT_CAMERA_ELEVATION = 0.15;

// Responsive FOV: wider on small screens (more cloud visible at narrow
// aspect ratios), tighter on large desktops. Breakpoints follow Tailwind.
type ScreenSize = "small" | "medium" | "large";
const FOV_SMALL = 120;
const FOV_MEDIUM = 120;
const FOV_LARGE = 120;
const fovForScreen = (s: ScreenSize) =>
  s === "small" ? FOV_SMALL : s === "medium" ? FOV_MEDIUM : FOV_LARGE;
function detectScreenSize(): ScreenSize {
  if (typeof window === "undefined") return "large";
  if (window.matchMedia("(max-width: 767px)").matches) return "small";
  if (window.matchMedia("(max-width: 1023px)").matches) return "medium";
  return "large";
}

// Z animation defaults — the desktop range. Mobile range applies
// automatically below 768 px when the debug panel is hidden.
const DEFAULT_Z_MIN = -10;
const DEFAULT_Z_MAX = 15;
const DEFAULT_Z_SPEED = 0.15;
const Z_MIN_MOBILE = 0;
const Z_MAX_MOBILE = 20;

const DEFAULT_NOISE_SCALE = 0.4;
const DEFAULT_NOISE_AMPLITUDE = 0.05;
const DEFAULT_NOISE_SPEED = 0.25;

// Pulse defaults — a Gaussian "shockwave" travels along +Z and loops.
// Displacement is in Y (transverse) and only points within ~3 widths of
// the pulse center see meaningful motion. The glow lights up exactly the
// points being displaced — quiet cloud, bright pulse, no ambient glow.
const DEFAULT_PULSE_WIDTH = 0.7;      // m — Gaussian half-width
const DEFAULT_PULSE_SPEED = 4.0;      // m/s — pulse travels +Z this fast
const DEFAULT_PULSE_AMPLITUDE = 0.17; // m — peak Y displacement at center
const DEFAULT_GLOW_STRENGTH = 2.2;    // 0..4 multiplier on top of base color

// Flip to true to bring the live tuning panel back.
const SHOW_DEBUG_PANEL = false;

type Bounds = { size: Vector3; center: Vector3 };

/* ───────────── GLSL ───────────── */

// Stefan Gustavson / Ian McEwan / Ashima Arts simplex 3D noise.
// MIT-licensed reference implementation. https://github.com/stegu/webgl-noise
const SNOISE_GLSL = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const VERTEX_SHADER = /* glsl */ `
${SNOISE_GLSL}

uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseAmplitude;
uniform float uNoiseSpeed;
uniform float uPulseWidth;
uniform float uPulseSpeed;
uniform float uPulseAmplitude;
uniform float uPointSize;
uniform float uPixelRatio;
uniform float uViewportHeight;

varying vec3 vColor;
varying float vGlow;

void main() {
  // Organic noise displacement — always-on ambient shimmer. Does NOT
  // contribute to the glow; that's reserved for the pulse alone.
  vec3 noiseInput = position * uNoiseScale - vec3(0.0, 0.0, uTime * uNoiseSpeed);
  vec3 noiseDisp = vec3(
    snoise(noiseInput),
    snoise(noiseInput + vec3(13.1, 17.7, 19.3)),
    snoise(noiseInput + vec3(101.5, 103.7, 107.9))
  ) * uNoiseAmplitude;

  // Pulse: a Gaussian band of energy that traverses the cloud along +Z
  // and loops. The pulse center walks from -20 m to +40 m and wraps —
  // the cloud's actual extent is well inside this range, so the wrap
  // happens off-camera and isn't visible.
  const float PULSE_Z_START = -20.0;
  const float PULSE_Z_RANGE = 60.0;
  float pulseCenterZ = mod(uTime * uPulseSpeed, PULSE_Z_RANGE) + PULSE_Z_START;
  float dz = position.z - pulseCenterZ;
  float pulseAmp = exp(-(dz * dz) / max(uPulseWidth * uPulseWidth, 0.0001));
  vec3 pulseDisp = vec3(0.0, pulseAmp * uPulseAmplitude, 0.0);

  vec3 displaced = position + noiseDisp + pulseDisp;
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uPointSize * uPixelRatio * (uViewportHeight * 0.5) / -mvPosition.z;

  // Glow tracks the pulse only — points outside the Gaussian envelope
  // stay at their original color.
  vGlow = pulseAmp;

  vColor = color;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform float uGlowStrength;

varying vec3 vColor;
varying float vGlow;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  if (dot(c, c) > 0.25) discard;

  // Brighten the point's own color where displacement is strong. Pure
  // multiplicative — preserves hue, just adds intensity at peaks.
  vec3 lit = vColor * (1.0 + vGlow * uGlowStrength);
  gl_FragColor = vec4(lit, 1.0);
}
`;

/* ───────────── React ───────────── */

type CloudProps = {
  onMeasure: (b: Bounds) => void;
  rotationDeg: [number, number, number];
  translateX: number;
  translateY: number;
  zMin: number;
  zMax: number;
  zSpeed: number;
  pointSize: number;
  noiseAmplitude: number;
  noiseScale: number;
  noiseSpeed: number;
  pulseWidth: number;
  pulseSpeed: number;
  pulseAmplitude: number;
  glowStrength: number;
};

function PointCloud({
  onMeasure,
  rotationDeg,
  translateX,
  translateY,
  zMin,
  zMax,
  zSpeed,
  pointSize,
  noiseAmplitude,
  noiseScale,
  noiseSpeed,
  pulseWidth,
  pulseSpeed,
  pulseAmplitude,
  glowStrength,
}: CloudProps) {
  const geometry = useLoader(PLYLoader, POINT_CLOUD) as BufferGeometry;
  const groupRef = useRef<Group>(null);
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseScale: { value: noiseScale },
      uNoiseAmplitude: { value: noiseAmplitude },
      uNoiseSpeed: { value: noiseSpeed },
      uPulseWidth: { value: pulseWidth },
      uPulseSpeed: { value: pulseSpeed },
      uPulseAmplitude: { value: pulseAmplitude },
      uGlowStrength: { value: glowStrength },
      uPointSize: { value: pointSize },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
      uViewportHeight: { value: 1 },
    }),
    // Uniforms object only needs to be created once; values are mutated
    // imperatively via the effect + useFrame hooks below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Push tunable uniform values when they change.
  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uNoiseScale.value = noiseScale;
    matRef.current.uniforms.uNoiseAmplitude.value = noiseAmplitude;
    matRef.current.uniforms.uNoiseSpeed.value = noiseSpeed;
    matRef.current.uniforms.uPulseWidth.value = pulseWidth;
    matRef.current.uniforms.uPulseSpeed.value = pulseSpeed;
    matRef.current.uniforms.uPulseAmplitude.value = pulseAmplitude;
    matRef.current.uniforms.uGlowStrength.value = glowStrength;
    matRef.current.uniforms.uPointSize.value = pointSize;
  }, [
    noiseScale,
    noiseAmplitude,
    noiseSpeed,
    pulseWidth,
    pulseSpeed,
    pulseAmplitude,
    glowStrength,
    pointSize,
  ]);

  useEffect(() => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return;
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    onMeasure({ size, center });
  }, [geometry, onMeasure]);

  const zPeriod = (zMax - zMin) / Math.max(zSpeed, 0.001);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      matRef.current.uniforms.uViewportHeight.value = state.size.height;
    }
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      const phase = (t % zPeriod) / zPeriod; // 0..1
      groupRef.current.position.z = zMin + phase * (zMax - zMin);
    }
  });

  const rotationRad: [number, number, number] = [
    (rotationDeg[0] * Math.PI) / 180,
    (rotationDeg[1] * Math.PI) / 180,
    (rotationDeg[2] * Math.PI) / 180,
  ];

  return (
    <group
      ref={groupRef}
      position={[translateX, translateY, zMin]}
      rotation={rotationRad}
    >
      <points geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          vertexColors
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function FitCamera({
  bounds,
  distMul,
  elevationFrac,
  fov,
}: {
  bounds: Bounds | null;
  distMul: number;
  elevationFrac: number;
  fov: number;
}) {
  const { camera, size: viewport } = useThree();
  useEffect(() => {
    if (!bounds) return;
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.fov = fov;
    const aspect = viewport.width / viewport.height;
    const fovRad = (camera.fov * Math.PI) / 180;
    const fitHeight = bounds.size.y / (2 * Math.tan(fovRad / 2));
    const fitWidth = bounds.size.x / aspect / (2 * Math.tan(fovRad / 2));
    const distance = distMul * Math.max(fitHeight, fitWidth);
    camera.position.set(
      bounds.center.x,
      bounds.center.y + bounds.size.y * elevationFrac,
      bounds.center.z + distance,
    );
    camera.lookAt(bounds.center);
    camera.near = 0.01;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
  }, [camera, viewport, bounds, distMul, elevationFrac, fov]);
  return null;
}

/* ───────────── DEBUG PANEL — remove when done tuning ───────────── */

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  decimals = 0,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  unit?: string;
  decimals?: number;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1 text-[11px]">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white tabular-nums">
          {value.toFixed(decimals)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-white"
      />
    </div>
  );
}

type PanelProps = {
  rotX: number; setRotX: (n: number) => void;
  rotY: number; setRotY: (n: number) => void;
  rotZ: number; setRotZ: (n: number) => void;
  transX: number; setTransX: (n: number) => void;
  transY: number; setTransY: (n: number) => void;
  zMin: number; setZMin: (n: number) => void;
  zMax: number; setZMax: (n: number) => void;
  zSpeed: number; setZSpeed: (n: number) => void;
  distMul: number; setDistMul: (n: number) => void;
  elevationFrac: number; setElevationFrac: (n: number) => void;
  fov: number; setFov: (n: number) => void;
  pointSize: number; setPointSize: (n: number) => void;
  noiseAmplitude: number; setNoiseAmplitude: (n: number) => void;
  noiseScale: number; setNoiseScale: (n: number) => void;
  noiseSpeed: number; setNoiseSpeed: (n: number) => void;
  pulseWidth: number; setPulseWidth: (n: number) => void;
  pulseSpeed: number; setPulseSpeed: (n: number) => void;
  pulseAmplitude: number; setPulseAmplitude: (n: number) => void;
  glowStrength: number; setGlowStrength: (n: number) => void;
};

function DebugPanel(p: PanelProps) {
  return (
    <div className="absolute top-20 right-4 z-40 w-72 max-h-[calc(100vh-6rem)] overflow-y-auto p-4 bg-black/85 backdrop-blur-xl border border-white/[0.1] rounded-xl space-y-3 pointer-events-auto select-none">
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-white text-xs font-semibold tracking-wide">
          Cloud Tuning
        </div>
        <div className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">
          DEBUG
        </div>
      </div>

      <Slider label="Pitch (X)" value={p.rotX} min={-180} max={180} step={1} unit="°" onChange={p.setRotX} />
      <Slider label="Yaw (Y)" value={p.rotY} min={-180} max={180} step={1} unit="°" onChange={p.setRotY} />
      <Slider label="Roll (Z)" value={p.rotZ} min={-180} max={180} step={1} unit="°" onChange={p.setRotZ} />

      <div className="border-t border-white/[0.08] pt-3" />

      <Slider label="Translate X" value={p.transX} min={-10} max={10} step={0.05} decimals={2} unit=" m" onChange={p.setTransX} />
      <Slider label="Translate Y" value={p.transY} min={-10} max={10} step={0.05} decimals={2} unit=" m" onChange={p.setTransY} />

      <div className="border-t border-white/[0.08] pt-3" />

      <Slider label="Z min" value={p.zMin} min={-30} max={30} step={0.5} decimals={1} unit=" m" onChange={p.setZMin} />
      <Slider label="Z max" value={p.zMax} min={-30} max={30} step={0.5} decimals={1} unit=" m" onChange={p.setZMax} />
      <Slider label="Z speed" value={p.zSpeed} min={0.01} max={2} step={0.01} decimals={2} unit=" m/s" onChange={p.setZSpeed} />

      <div className="border-t border-white/[0.08] pt-3" />

      <Slider label="Camera distance ×" value={p.distMul} min={0.5} max={5} step={0.05} decimals={2} onChange={p.setDistMul} />
      <Slider label="Camera elevation" value={p.elevationFrac} min={-1} max={1} step={0.01} decimals={2} onChange={p.setElevationFrac} />
      <Slider label="FOV" value={p.fov} min={20} max={120} step={1} unit="°" onChange={p.setFov} />

      <div className="border-t border-white/[0.08] pt-3" />

      <Slider label="Point size" value={p.pointSize} min={0.001} max={0.05} step={0.001} decimals={3} onChange={p.setPointSize} />

      <div className="border-t border-white/[0.08] pt-3" />

      <Slider label="Noise amplitude" value={p.noiseAmplitude} min={0} max={0.5} step={0.005} decimals={3} unit=" m" onChange={p.setNoiseAmplitude} />
      <Slider label="Noise scale" value={p.noiseScale} min={0.05} max={3} step={0.05} decimals={2} onChange={p.setNoiseScale} />
      <Slider label="Noise speed" value={p.noiseSpeed} min={0} max={2} step={0.01} decimals={2} onChange={p.setNoiseSpeed} />

      <div className="border-t border-white/[0.08] pt-3" />

      <Slider label="Pulse amplitude" value={p.pulseAmplitude} min={0} max={0.5} step={0.005} decimals={3} unit=" m" onChange={p.setPulseAmplitude} />
      <Slider label="Pulse width" value={p.pulseWidth} min={0.2} max={6} step={0.1} decimals={1} unit=" m" onChange={p.setPulseWidth} />
      <Slider label="Pulse speed" value={p.pulseSpeed} min={0} max={10} step={0.1} decimals={1} unit=" m/s" onChange={p.setPulseSpeed} />
      <Slider label="Glow strength" value={p.glowStrength} min={0} max={4} step={0.05} decimals={2} onChange={p.setGlowStrength} />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────── */

export default function HeroPointCloud() {
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [screenSize, setScreenSize] = useState<ScreenSize>(() =>
    detectScreenSize(),
  );

  // Tuning state — copy these back into the DEFAULT_* constants when done.
  const [rotX, setRotX] = useState(DEFAULT_PITCH_DEG);
  const [rotY, setRotY] = useState(DEFAULT_YAW_DEG);
  const [rotZ, setRotZ] = useState(DEFAULT_ROLL_DEG);
  const [transX, setTransX] = useState(DEFAULT_TRANSLATE_X);
  const [transY, setTransY] = useState(DEFAULT_TRANSLATE_Y);
  const [zMin, setZMin] = useState(DEFAULT_Z_MIN);
  const [zMax, setZMax] = useState(DEFAULT_Z_MAX);
  const [zSpeed, setZSpeed] = useState(DEFAULT_Z_SPEED);
  const [distMul, setDistMul] = useState(DEFAULT_CAMERA_DIST_MUL);
  const [elevationFrac, setElevationFrac] = useState(DEFAULT_CAMERA_ELEVATION);
  const [fov, setFov] = useState(() => fovForScreen(detectScreenSize()));
  const [fovTouched, setFovTouched] = useState(false);
  const [pointSize, setPointSize] = useState(DEFAULT_POINT_SIZE);
  const [noiseAmplitude, setNoiseAmplitude] = useState(DEFAULT_NOISE_AMPLITUDE);
  const [noiseScale, setNoiseScale] = useState(DEFAULT_NOISE_SCALE);
  const [noiseSpeed, setNoiseSpeed] = useState(DEFAULT_NOISE_SPEED);
  const [pulseWidth, setPulseWidth] = useState(DEFAULT_PULSE_WIDTH);
  const [pulseSpeed, setPulseSpeed] = useState(DEFAULT_PULSE_SPEED);
  const [pulseAmplitude, setPulseAmplitude] = useState(DEFAULT_PULSE_AMPLITUDE);
  const [glowStrength, setGlowStrength] = useState(DEFAULT_GLOW_STRENGTH);

  // Track viewport size: drives the Z range mobile override and the
  // responsive FOV defaults.
  useEffect(() => {
    const update = () => setScreenSize(detectScreenSize());
    const mqSmall = window.matchMedia("(max-width: 767px)");
    const mqMedium = window.matchMedia("(max-width: 1023px)");
    mqSmall.addEventListener("change", update);
    mqMedium.addEventListener("change", update);
    return () => {
      mqSmall.removeEventListener("change", update);
      mqMedium.removeEventListener("change", update);
    };
  }, []);

  // Auto-update the FOV to match the screen size, unless the user has
  // dragged the slider (in which case their value wins).
  useEffect(() => {
    if (!fovTouched) setFov(fovForScreen(screenSize));
  }, [screenSize, fovTouched]);

  const handleSetFov = useCallback((n: number) => {
    setFovTouched(true);
    setFov(n);
  }, []);

  const isMobile = screenSize === "small";

  const usingDesktopZDefaults =
    zMin === DEFAULT_Z_MIN && zMax === DEFAULT_Z_MAX;
  const effectiveZMin =
    isMobile && usingDesktopZDefaults ? Z_MIN_MOBILE : zMin;
  const effectiveZMax =
    isMobile && usingDesktopZDefaults ? Z_MAX_MOBILE : zMax;

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          outputColorSpace: SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <PointCloud
            onMeasure={setBounds}
            rotationDeg={[rotX, rotY, rotZ]}
            translateX={transX}
            translateY={transY}
            zMin={effectiveZMin}
            zMax={effectiveZMax}
            zSpeed={zSpeed}
            pointSize={pointSize}
            noiseAmplitude={noiseAmplitude}
            noiseScale={noiseScale}
            noiseSpeed={noiseSpeed}
            pulseWidth={pulseWidth}
            pulseSpeed={pulseSpeed}
            pulseAmplitude={pulseAmplitude}
            glowStrength={glowStrength}
          />
          <FitCamera
            bounds={bounds}
            distMul={distMul}
            elevationFrac={elevationFrac}
            fov={fov}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            target={bounds?.center ?? undefined}
          />
        </Suspense>
      </Canvas>

      {SHOW_DEBUG_PANEL && (
        <DebugPanel
          rotX={rotX} setRotX={setRotX}
          rotY={rotY} setRotY={setRotY}
          rotZ={rotZ} setRotZ={setRotZ}
          transX={transX} setTransX={setTransX}
          transY={transY} setTransY={setTransY}
          zMin={zMin} setZMin={setZMin}
          zMax={zMax} setZMax={setZMax}
          zSpeed={zSpeed} setZSpeed={setZSpeed}
          distMul={distMul} setDistMul={setDistMul}
          elevationFrac={elevationFrac} setElevationFrac={setElevationFrac}
          fov={fov} setFov={handleSetFov}
          pointSize={pointSize} setPointSize={setPointSize}
          noiseAmplitude={noiseAmplitude} setNoiseAmplitude={setNoiseAmplitude}
          noiseScale={noiseScale} setNoiseScale={setNoiseScale}
          noiseSpeed={noiseSpeed} setNoiseSpeed={setNoiseSpeed}
          pulseWidth={pulseWidth} setPulseWidth={setPulseWidth}
          pulseSpeed={pulseSpeed} setPulseSpeed={setPulseSpeed}
          pulseAmplitude={pulseAmplitude} setPulseAmplitude={setPulseAmplitude}
          glowStrength={glowStrength} setGlowStrength={setGlowStrength}
        />
      )}
    </div>
  );
}
