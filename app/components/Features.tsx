"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useVideoTexture,
} from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  ACESFilmicToneMapping,
  Box3,
  MeshBasicMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Mesh,
} from "three";

const MODEL = "/iphone_17_pro_max/scene.gltf";
const SCREEN_VIDEO =
  "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/fullFatMarketingVideo.MP4";
const SCREEN_MATERIAL_NAME = "17ProMax_Screen";
const FIT_MARGIN = 1.17;

// Stylization timing (in seconds within the video loop).
//
// Phone holds slid-left from PHONE_IN_END through PHONE_OUT_START on wide
// viewports. Ten panels share that window; each appears on the right of the
// canvas (wide) or stacked below it (narrow) using the same timing cues.
const PHONE_IN_START = 0.5;
const PHONE_IN_END = 2.0;
const PHONE_OUT_START = 100.0;
const PHONE_OUT_END = 101.5;

const NETWORKING_IN_START = 0.5;
const NETWORKING_IN_END = 2.0;
const NETWORKING_OUT_START = 21.5;
const NETWORKING_OUT_END = 22.5;

const MONO_IN_START = 23.0;
const MONO_IN_END = 24.0;
const MONO_OUT_START = 25.5;
const MONO_OUT_END = 26.5;

const DEPTH_IN_START = 27.0;
const DEPTH_IN_END = 28.5;
const DEPTH_OUT_START = 45.0;
const DEPTH_OUT_END = 46.5;

const POINT_CLOUD_IN_START = 47.0;
const POINT_CLOUD_IN_END = 48.0;
const POINT_CLOUD_OUT_START = 50.0;
const POINT_CLOUD_OUT_END = 51.0;

const BLOB_TRACK_IN_START = 51.5;
const BLOB_TRACK_IN_END = 52.5;
const BLOB_TRACK_OUT_START = 55.0;
const BLOB_TRACK_OUT_END = 56.5;

const TRANSCRIPTION_IN_START = 57.0;
const TRANSCRIPTION_IN_END = 58.5;
const TRANSCRIPTION_OUT_START = 65.0;
const TRANSCRIPTION_OUT_END = 66.5;

const MOTION_IN_START = 67.0;
const MOTION_IN_END = 68.5;
const MOTION_OUT_START = 73.0;
const MOTION_OUT_END = 74.5;

const AUDIO_IN_START = 75.0;
const AUDIO_IN_END = 76.5;
const AUDIO_OUT_START = 83.5;
const AUDIO_OUT_END = 85.0;

const ARKIT_IN_START = 89.0;
const ARKIT_IN_END = 90.0;
const ARKIT_OUT_START = 90.5;
const ARKIT_OUT_END = 91.5;

const RIGHTPAGE_IN_START = 92.0;
const RIGHTPAGE_IN_END = 93.5;
const RIGHTPAGE_OUT_START = 99.0;
const RIGHTPAGE_OUT_END = 100.0;

// Fraction of the phone's own width to slide left when a panel is open.
const SLIDE_FRACTION = 0.55;

function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

function computeProgress(
  t: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
): number {
  if (t < inStart) return 0;
  if (t < inEnd) return smoothstep((t - inStart) / (inEnd - inStart));
  if (t < outStart) return 1;
  if (t < outEnd) return 1 - smoothstep((t - outStart) / (outEnd - outStart));
  return 0;
}

function Phone({
  onMeasure,
  onVideoReady,
  slideEnabled,
}: {
  onMeasure: (size: Vector3) => void;
  onVideoReady: (video: HTMLVideoElement) => void;
  slideEnabled: boolean;
}) {
  const ref = useRef<Group>(null);
  const slideAmountRef = useRef(0);
  const { scene: gltfScene } = useGLTF(MODEL);
  // Clone the GLTF scene so this Phone instance has its own object tree.
  // useGLTF returns a shared scene; mounting it into a second <Canvas>
  // would steal it from the first.
  const scene = useMemo(() => gltfScene.clone(true), [gltfScene]);
  const videoTexture = useVideoTexture(SCREEN_VIDEO, {
    muted: true,
    loop: true,
    playsInline: true,
    crossOrigin: "anonymous",
  });

  useEffect(() => {
    videoTexture.flipY = false;
    videoTexture.colorSpace = SRGBColorSpace;
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as { name?: string };
      if (mat?.name === SCREEN_MATERIAL_NAME) {
        mesh.material = new MeshBasicMaterial({
          map: videoTexture,
          toneMapped: false,
          depthTest: false,
          depthWrite: false,
        });
        mesh.renderOrder = 999;
      }
    });
  }, [scene, videoTexture]);

  useEffect(() => {
    const video = videoTexture.image as HTMLVideoElement | null;
    if (video) onVideoReady(video);
  }, [videoTexture, onVideoReady]);

  const offset = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    slideAmountRef.current = size.x * SLIDE_FRACTION;
    onMeasure(size);
    return center.clone().negate();
  }, [scene, onMeasure]);

  useFrame(() => {
    if (!ref.current) return;
    if (!slideEnabled) {
      ref.current.position.x = 0;
      return;
    }
    const video = videoTexture.image as HTMLVideoElement | null;
    if (!video || video.readyState < 2) return;
    const progress = computeProgress(
      video.currentTime,
      PHONE_IN_START,
      PHONE_IN_END,
      PHONE_OUT_START,
      PHONE_OUT_END
    );
    ref.current.position.x = -slideAmountRef.current * progress;
  });

  return (
    <group ref={ref} rotation={[0, Math.PI, 0]}>
      <group position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function FitCamera({ modelSize }: { modelSize: Vector3 | null }) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!modelSize) return;
    if (!(camera instanceof PerspectiveCamera)) return;
    const aspect = size.width / size.height;
    const fov = (camera.fov * Math.PI) / 180;
    const fitHeightDistance = modelSize.y / (2 * Math.tan(fov / 2));
    const fitWidthDistance = modelSize.x / aspect / (2 * Math.tan(fov / 2));
    const distance = FIT_MARGIN * Math.max(fitHeightDistance, fitWidthDistance);
    camera.position.set(0, 0, distance);
    camera.near = Math.max(0.01, distance / 100);
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  }, [camera, size, modelSize]);
  return null;
}

useGLTF.preload(MODEL);

/* ───────────── Panel content (shared between wide + narrow renderings) ───────────── */

const NETWORKING_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Networking
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">
        Stream over your local network.
      </h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Every enabled transport sends simultaneously, on the same Wi-Fi
        or a wired USB hotspot.
      </p>
    </div>
    <ul className="flex flex-col gap-3.5 text-sm">
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <div>
          <span className="text-white font-semibold">NDI</span>{" "}
          <span className="text-zinc-500">
            Auto-discovered as <code className="text-zinc-300 font-mono text-xs">LOTA - &lt;label&gt;</code> in TouchDesigner, OBS, vMix, Resolume. Per-device labels keep multi-phone rigs distinguishable.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        <div>
          <span className="text-white font-semibold">TCP / UDP</span>{" "}
          <span className="text-zinc-500">
            H.264 video for color and mono, raw <code className="text-zinc-300 font-mono text-xs">Float32</code> depth maps for depth, point cloud, and blob modes.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-sky-400" />
        <div>
          <span className="text-white font-semibold">OSC</span>{" "}
          <span className="text-zinc-500">
            Camera pose, 18-joint body skeleton, 52 face blend shapes, 21 per-hand landmarks, motion sensors, audio levels, beats, and a 20-band FFT.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-violet-400" />
        <div>
          <span className="text-white font-semibold">PLY</span>{" "}
          <span className="text-zinc-500">
            Live point cloud as packed binary, 15 bytes per point. Drag-and-drop TouchDesigner receiver included.
          </span>
        </div>
      </li>
    </ul>
  </>
);

const MONO_CONTENT = (
  <>
    <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
      Capture mode
    </p>
    <h3 className="text-2xl font-bold text-white leading-tight">Mono.</h3>
    <p className="text-sm text-zinc-500 leading-relaxed">
      A clean grayscale feed at 60 fps. Strips chromatic noise from the
      camera so depth visualizations and tracking overlays read cleaner
      downstream. Works on every iPhone.
    </p>
  </>
);

const DEPTH_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Depth
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">
        Two depth pipelines.
      </h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Same nine colormaps. Different sources for different phones.
      </p>
    </div>
    <ul className="flex flex-col gap-3.5 text-sm">
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <div>
          <span className="text-white font-semibold">LiDAR Depth</span>{" "}
          <span className="text-zinc-500">
            Hardware time-of-flight on iPhone Pro. Cleanest signal under controlled lighting; reliable to ~5 m on Gen 1 (12–14 Pro), ~10 m on Gen 2 (15–16 Pro).
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
        <div>
          <span className="text-white font-semibold">Neural Depth</span>{" "}
          <span className="text-zinc-500">
            Depth Anything V2 Small running on the Apple Neural Engine at ~30 ms / frame. Works on every iPhone, no LiDAR required. Picks up where the sensor struggles: bright sun, very long range, glass, mirrors.
          </span>
        </div>
      </li>
    </ul>
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Settings
      </p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Both modes share a{" "}
        <span className="text-white font-semibold">Color Map</span>{" "}
        picker: Black &amp; White, Blue Red, Deep Sea, Heated Metal,
        Visible Spectrum, and four more presets. Open via the{" "}
        <code className="text-zinc-300 font-mono text-xs bg-white/[0.06] px-1.5 py-0.5 rounded">
          &lt;Mode&gt; Settings
        </code>{" "}
        button below the status bar. Neural Depth Settings also surfaces
        an <em>About the Model</em> section crediting ByteDance Research
        and Apple, confirming inference runs fully on-device.
      </p>
    </div>
  </>
);

const POINT_CLOUD_CONTENT = (
  <>
    <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
      Capture mode
    </p>
    <h3 className="text-2xl font-bold text-white leading-tight">
      Point Cloud.
    </h3>
    <p className="text-sm text-zinc-500 leading-relaxed">
      Real-time 3D points with true RGB colors sampled from the camera.
      The full 256&times;192 LiDAR depth map unprojected on the GPU each
      frame, streamed live to TouchDesigner over PLY at 60 fps.
    </p>
  </>
);

const BLOB_TRACK_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Capture mode
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">
        Blob Track.
      </h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Replaces a Kinect + Blob Track TOP chain with a single iPhone.
        Carves a configurable depth slab out of the LiDAR scan, finds
        connected regions, assigns each a stable ID across frames, and
        streams the result as OSC with field names matching
        TouchDesigner&apos;s{" "}
        <code className="text-zinc-300 font-mono text-xs">
          blobtrackTOP_Class
        </code>{" "}
        verbatim.
      </p>
    </div>
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Settings
      </p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Four subsections mirror TouchDesigner&apos;s parameter pages:{" "}
        <span className="text-white font-semibold">Detection</span>{" "}
        (Color / Mono / Mask / Binary base styles, ID labels, outline
        color),{" "}
        <span className="text-white font-semibold">Depth</span>{" "}
        (slab range, confidence filter),{" "}
        <span className="text-white font-semibold">Constraints</span>{" "}
        (min / max blob size, max move distance), and{" "}
        <span className="text-white font-semibold">Revival</span>{" "}
        (re-identify lost blobs by time and distance).
      </p>
    </div>
  </>
);

const TRANSCRIPTION_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Capture mode
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">
        Transcription.
      </h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Live on-device speech-to-text. No internet, no cloud.
      </p>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        iOS 26&apos;s{" "}
        <code className="text-zinc-300 font-mono text-xs">SpeechAnalyzer</code>{" "}
        running on the phone. The first-launch flow prefetches the speech
        model for your locale, so captions appear instantly the first
        time you open the mode. A 200-bar mirrored waveform replaces the
        camera, recognized words show as live captions, and the whole
        composition streams through NDI as a black-and-white video source.
      </p>
    </div>
    <ul className="flex flex-col gap-2 text-sm">
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-rose-400" />
        <div>
          <code className="text-white font-mono text-xs">/lota/speech/word</code>
          <span className="text-zinc-500">: per-word, trigger-friendly.</span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-rose-400" />
        <div>
          <code className="text-white font-mono text-xs">/lota/speech/partial</code>
          <span className="text-zinc-500">: running transcript as words arrive.</span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-rose-400" />
        <div>
          <code className="text-white font-mono text-xs">/lota/speech/final</code>
          <span className="text-zinc-500">: finalized sentences when the recognizer commits.</span>
        </div>
      </li>
    </ul>
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Settings
      </p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Three toggles in Transcription Settings (
        <span className="text-white font-semibold">Send Per-Word</span>,{" "}
        <span className="text-white font-semibold">Send Partial</span>,{" "}
        <span className="text-white font-semibold">Send Final</span>)
        apply simultaneously to OSC and TCP/UDP transports. Drop-in
        TouchDesigner components{" "}
        <code className="text-zinc-300 font-mono text-xs">LOTASpeechTCP</code>{" "}
        and{" "}
        <code className="text-zinc-300 font-mono text-xs">LOTASpeechUDP</code>{" "}
        parse the binary frame format automatically.
      </p>
    </div>
  </>
);

const MOTION_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Capture mode
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">Motion.</h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Phone as a wireless motion-sensor OSC source. Reads the device
        IMU and streams every value as a per-axis OSC channel, so each
        sensor maps 1:1 to a TouchDesigner CHOP channel. Each active
        sensor renders as a scrolling line graph lane, and the whole
        composition streams through NDI.
      </p>
    </div>
    <ul className="flex flex-col gap-2 text-sm">
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-orange-400" />
        <div>
          <code className="text-white font-mono text-xs">/lota/motion/accel/x,y,z</code>
          <span className="text-zinc-500">: gravity-removed acceleration, G-force.</span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-orange-400" />
        <div>
          <code className="text-white font-mono text-xs">/lota/motion/gyro/x,y,z</code>
          <span className="text-zinc-500">: rotation rate, rad/s.</span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-orange-400" />
        <div>
          <code className="text-white font-mono text-xs">/lota/motion/heading</code>
          <span className="text-zinc-500">: compass heading, 0–360°.</span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-orange-400" />
        <div>
          <code className="text-white font-mono text-xs">/lota/motion/pressure, /altitude</code>
          <span className="text-zinc-500">: barometric kPa + relative meters.</span>
        </div>
      </li>
    </ul>
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Settings
      </p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Toggle each sensor independently in Motion Settings:{" "}
        <span className="text-white font-semibold">Acceleration</span>{" "}
        on by default; Gyroscope, Compass, and Barometric Pressure off.
        The <span className="text-white font-semibold">Update Rate</span>{" "}
        picker offers 30 / 60 / 100 Hz; 30 Hz matches ARKit, 100 Hz is
        for latency-critical controllers.
      </p>
    </div>
  </>
);

const AUDIO_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Capture mode
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">Audio.</h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Real-time on-device audio analysis as OSC. Taps the mic via{" "}
        <code className="text-zinc-300 font-mono text-xs">AVAudioEngine</code>{" "}
        and runs DSP using Apple&apos;s{" "}
        <code className="text-zinc-300 font-mono text-xs">Accelerate/vDSP</code>{" "}
        framework, with no third-party dependencies. Active channels
        render as scrolling graph lanes and stream through NDI.
      </p>
    </div>
    <ul className="flex flex-col gap-2 text-sm">
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-lime-400" />
        <div>
          <span className="text-white font-semibold">Levels</span>{" "}
          <span className="text-zinc-500">
            <code className="text-zinc-300 font-mono text-xs">/lota/audio/&#123;bass,mid,high&#125;</code>:
            continuous 0–1 energy per band, rolling auto-gain.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-lime-400" />
        <div>
          <span className="text-white font-semibold">Beats</span>{" "}
          <span className="text-zinc-500">
            <code className="text-zinc-300 font-mono text-xs">/lota/audio/drums/&#123;low,mid,high&#125;</code>:
            binary 0/1 onset triggers, drop straight into a TD Trigger CHOP.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-lime-400" />
        <div>
          <span className="text-white font-semibold">Dynamics</span>{" "}
          <span className="text-zinc-500">
            <code className="text-zinc-300 font-mono text-xs">/lota/audio/burst</code>:
            fast transient detector, pulse-shaped 0–1.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-lime-400" />
        <div>
          <span className="text-white font-semibold">FFT</span>{" "}
          <span className="text-zinc-500">
            <code className="text-zinc-300 font-mono text-xs">/lota/audio/fft/0</code>{" "}
            through{" "}
            <code className="text-zinc-300 font-mono text-xs">/19</code>:
            20 log-spaced bands, red→blue gradient.
          </span>
        </div>
      </li>
    </ul>
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Settings
      </p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Toggle each group independently in Audio Settings:{" "}
        <span className="text-white font-semibold">Levels</span> on by
        default; Beats, Dynamics, and FFT off. The{" "}
        <span className="text-white font-semibold">Update Rate</span>{" "}
        picker offers 30 / 60 Hz, decimated from internal ~86 Hz analysis.
      </p>
    </div>
  </>
);

const ARKIT_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Swipe left
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">
        ARKit Tracking.
      </h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Three motion-capture modes, all OSC.
      </p>
    </div>
    <ul className="flex flex-col gap-2 text-sm">
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
        <div>
          <span className="text-white font-semibold">Body</span>{" "}
          <span className="text-zinc-500">
            18 key joints from a 91-joint ARKit skeleton on{" "}
            <code className="text-zinc-300 font-mono text-xs">/lota/body/skeleton</code>.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
        <div>
          <span className="text-white font-semibold">Face</span>{" "}
          <span className="text-zinc-500">
            52 named blend shapes via TrueDepth, each at{" "}
            <code className="text-zinc-300 font-mono text-xs">/lota/face/&lt;name&gt;</code>{" "}
            bundled in one UDP datagram.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
        <div>
          <span className="text-white font-semibold">Hands</span>{" "}
          <span className="text-zinc-500">
            21 landmarks per hand, up to 2 hands, organized by finger at{" "}
            <code className="text-zinc-300 font-mono text-xs">/lota/hand/&#123;left|right&#125;/&#123;finger&#125;</code>.
          </span>
        </div>
      </li>
    </ul>
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Settings
      </p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Per-mode Settings sheets toggle each overlay (Skeleton, Face,
        Hand), and{" "}
        <span className="text-white font-semibold">3D Hand Coordinates</span>{" "}
        opts in to LiDAR-projected world-space hand positions on Pro
        phones.
      </p>
    </div>
  </>
);

const RIGHTPAGE_CONTENT = (
  <>
    <div>
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-2">
        Swipe right
      </p>
      <h3 className="text-2xl font-bold text-white leading-tight">
        Gaussian Capture.
      </h3>
      <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
        Record datasets, materials, and traces.
      </p>
    </div>
    <ul className="flex flex-col gap-2.5 text-sm">
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div>
          <span className="text-white font-semibold">3D scenes</span>{" "}
          <span className="text-zinc-500">
            COLMAP, Nerfstudio, and Nerfstudio + Depth datasets for OpenSplat, gsplat, splatfacto, Instant-NGP. Optional 16-bit PNG depth maps for depth-supervised training.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div>
          <span className="text-white font-semibold">Material</span>{" "}
          <span className="text-zinc-500">
            Single-shot PBR map set ZIP: basecolor, normal, height (16-bit), AO, roughness, preview, manifest. Drops into Substance, Blender, Unreal, Unity, TouchDesigner. Requires LiDAR.
          </span>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div>
          <span className="text-white font-semibold">IMU / Audio Trace</span>{" "}
          <span className="text-zinc-500">
            Sensor or audio analysis frames over time as CSV / TSV +{" "}
            <code className="text-zinc-300 font-mono text-xs">manifest.json</code>{" "}
            + optional dark-theme PDF report. For Jupyter, Ableton MIDI, sensor-fusion training sets.
          </span>
        </div>
      </li>
    </ul>
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.15em] mb-2">
        Settings
      </p>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Per-format Settings sheets:{" "}
        <span className="text-white font-semibold">Material</span>{" "}
        (output resolution, AO sample count, OpenGL/DirectX normal
        convention, delight + roughness scale sliders); and{" "}
        <span className="text-white font-semibold">Trace</span>{" "}
        (channel selection, CSV/TSV format, optional PDF report,
        auto-stop duration cap 5–600 s).
      </p>
    </div>
  </>
);

/* ───────────── PanelWrapper helper ─────────────
   Renders the same content in either:
   - wide layout (lg+): absolute right of the canvas, vertically centered,
     slides in from the right
   - narrow layout (< lg): absolute inset-0 of the below-canvas container,
     stacks at top, slides in from below */

function PanelWrapper({
  panelRef,
  isWide,
  gap,
  children,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  isWide: boolean;
  gap: string;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={panelRef}
      className={
        isWide
          ? `hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 w-[44%] max-w-[520px] flex-col ${gap} pl-8 pr-2 pointer-events-none`
          : `lg:hidden absolute inset-0 flex flex-col ${gap} px-4 pointer-events-none`
      }
      style={{
        opacity: 0,
        transform: isWide ? "translateX(24px)" : "translateY(12px)",
        transition: "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ───────────── Features section ───────────── */

export default function Features() {
  const [modelSize, setModelSize] = useState<Vector3 | null>(null);
  const [isWide, setIsWide] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Wide-layout panel refs (overlaid on the right of the canvas).
  const networkingRef = useRef<HTMLDivElement | null>(null);
  const monoRef = useRef<HTMLDivElement | null>(null);
  const depthRef = useRef<HTMLDivElement | null>(null);
  const pointCloudRef = useRef<HTMLDivElement | null>(null);
  const blobTrackRef = useRef<HTMLDivElement | null>(null);
  const transcriptionRef = useRef<HTMLDivElement | null>(null);
  const motionRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLDivElement | null>(null);
  const arkitRef = useRef<HTMLDivElement | null>(null);
  const rightPageRef = useRef<HTMLDivElement | null>(null);

  // Narrow-layout panel refs (stacked below the canvas on < lg).
  const networkingNarrowRef = useRef<HTMLDivElement | null>(null);
  const monoNarrowRef = useRef<HTMLDivElement | null>(null);
  const depthNarrowRef = useRef<HTMLDivElement | null>(null);
  const pointCloudNarrowRef = useRef<HTMLDivElement | null>(null);
  const blobTrackNarrowRef = useRef<HTMLDivElement | null>(null);
  const transcriptionNarrowRef = useRef<HTMLDivElement | null>(null);
  const motionNarrowRef = useRef<HTMLDivElement | null>(null);
  const audioNarrowRef = useRef<HTMLDivElement | null>(null);
  const arkitNarrowRef = useRef<HTMLDivElement | null>(null);
  const rightPageNarrowRef = useRef<HTMLDivElement | null>(null);

  // Track viewport for the phone slide. Below lg the phone stays centered.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    videoRef.current = video;
  }, []);

  // rAF loop drives every panel directly off video.currentTime; no React
  // state in the hot path. Both wide and narrow refs get the same progress
  // so timing cues stay identical, only the entry transform differs.
  useEffect(() => {
    const apply = (
      panel: HTMLDivElement | null,
      progress: number,
      axis: "X" | "Y",
      offset: number,
    ) => {
      if (!panel) return;
      panel.style.opacity = String(progress);
      panel.style.transform = `translate${axis}(${(1 - progress) * offset}px)`;
    };
    const applyBoth = (
      wide: HTMLDivElement | null,
      narrow: HTMLDivElement | null,
      progress: number,
    ) => {
      apply(wide, progress, "X", 24);
      apply(narrow, progress, "Y", 12);
    };

    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const t = video.currentTime;
        applyBoth(
          networkingRef.current,
          networkingNarrowRef.current,
          computeProgress(t, NETWORKING_IN_START, NETWORKING_IN_END, NETWORKING_OUT_START, NETWORKING_OUT_END),
        );
        applyBoth(
          monoRef.current,
          monoNarrowRef.current,
          computeProgress(t, MONO_IN_START, MONO_IN_END, MONO_OUT_START, MONO_OUT_END),
        );
        applyBoth(
          depthRef.current,
          depthNarrowRef.current,
          computeProgress(t, DEPTH_IN_START, DEPTH_IN_END, DEPTH_OUT_START, DEPTH_OUT_END),
        );
        applyBoth(
          pointCloudRef.current,
          pointCloudNarrowRef.current,
          computeProgress(t, POINT_CLOUD_IN_START, POINT_CLOUD_IN_END, POINT_CLOUD_OUT_START, POINT_CLOUD_OUT_END),
        );
        applyBoth(
          blobTrackRef.current,
          blobTrackNarrowRef.current,
          computeProgress(t, BLOB_TRACK_IN_START, BLOB_TRACK_IN_END, BLOB_TRACK_OUT_START, BLOB_TRACK_OUT_END),
        );
        applyBoth(
          transcriptionRef.current,
          transcriptionNarrowRef.current,
          computeProgress(t, TRANSCRIPTION_IN_START, TRANSCRIPTION_IN_END, TRANSCRIPTION_OUT_START, TRANSCRIPTION_OUT_END),
        );
        applyBoth(
          motionRef.current,
          motionNarrowRef.current,
          computeProgress(t, MOTION_IN_START, MOTION_IN_END, MOTION_OUT_START, MOTION_OUT_END),
        );
        applyBoth(
          audioRef.current,
          audioNarrowRef.current,
          computeProgress(t, AUDIO_IN_START, AUDIO_IN_END, AUDIO_OUT_START, AUDIO_OUT_END),
        );
        applyBoth(
          arkitRef.current,
          arkitNarrowRef.current,
          computeProgress(t, ARKIT_IN_START, ARKIT_IN_END, ARKIT_OUT_START, ARKIT_OUT_END),
        );
        applyBoth(
          rightPageRef.current,
          rightPageNarrowRef.current,
          computeProgress(t, RIGHTPAGE_IN_START, RIGHTPAGE_IN_END, RIGHTPAGE_OUT_START, RIGHTPAGE_OUT_END),
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="features" className="py-28 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-4">
            The hardware you already have
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Three pages. Stream, track, record.
          </h2>
          <p className="text-zinc-500 mt-5 max-w-xl mx-auto leading-relaxed">
            Swipe between live camera streaming, ARKit motion capture, and
            3D dataset recording. Each page hosts its own set of modes,
            tapping a different combination of sensors your iPhone already
            ships with: LiDAR, cameras, IMU, and microphone.
          </p>
        </div>

        <div className="relative h-[60vh] min-h-[420px] w-full">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 30 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
          >
            <Suspense fallback={null}>
              <Environment files="/monochrome_studio_02_1k.exr" background={false} />
              <directionalLight position={[5, 8, 5]} intensity={0.6} />
              <Phone
                onMeasure={setModelSize}
                onVideoReady={handleVideoReady}
                slideEnabled={isWide}
              />
              <FitCamera modelSize={modelSize} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>

          {/* Wide-layout panels: overlaid on the right of the canvas. */}
          <PanelWrapper panelRef={networkingRef} isWide gap="gap-5">
            {NETWORKING_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={monoRef} isWide gap="gap-3">
            {MONO_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={depthRef} isWide gap="gap-5">
            {DEPTH_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={pointCloudRef} isWide gap="gap-3">
            {POINT_CLOUD_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={blobTrackRef} isWide gap="gap-4">
            {BLOB_TRACK_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={transcriptionRef} isWide gap="gap-4">
            {TRANSCRIPTION_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={motionRef} isWide gap="gap-4">
            {MOTION_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={audioRef} isWide gap="gap-4">
            {AUDIO_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={arkitRef} isWide gap="gap-4">
            {ARKIT_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={rightPageRef} isWide gap="gap-4">
            {RIGHTPAGE_CONTENT}
          </PanelWrapper>
        </div>

        {/* Narrow-layout panels: stacked under the canvas, only visible
            below lg. All ten share the same absolute slot; opacity-driven
            transition picks which one is on screen at any moment. */}
        <div className="lg:hidden relative min-h-[600px] mt-10">
          <PanelWrapper panelRef={networkingNarrowRef} isWide={false} gap="gap-5">
            {NETWORKING_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={monoNarrowRef} isWide={false} gap="gap-3">
            {MONO_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={depthNarrowRef} isWide={false} gap="gap-5">
            {DEPTH_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={pointCloudNarrowRef} isWide={false} gap="gap-3">
            {POINT_CLOUD_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={blobTrackNarrowRef} isWide={false} gap="gap-4">
            {BLOB_TRACK_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={transcriptionNarrowRef} isWide={false} gap="gap-4">
            {TRANSCRIPTION_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={motionNarrowRef} isWide={false} gap="gap-4">
            {MOTION_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={audioNarrowRef} isWide={false} gap="gap-4">
            {AUDIO_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={arkitNarrowRef} isWide={false} gap="gap-4">
            {ARKIT_CONTENT}
          </PanelWrapper>
          <PanelWrapper panelRef={rightPageNarrowRef} isWide={false} gap="gap-4">
            {RIGHTPAGE_CONTENT}
          </PanelWrapper>
        </div>
      </div>
    </section>
  );
}
