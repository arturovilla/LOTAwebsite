"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useVideoTexture } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box3,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Mesh,
} from "three";

const MODEL = "/iphone_17_pro_max/scene.gltf";
const SCREEN_VIDEO =
  "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/materialCapturePhonePOV.mp4";
const SCREEN_MATERIAL_NAME = "17ProMax_Screen";
const FIT_MARGIN = 1.4586;

// Tilt timeline (seconds, relative to video currentTime):
//   0 – 6    still
//   6 – 8    tilt top away from screen to 50° (2s ease)
//   8 – 11   hold at 50°
//  11 – 11.5 return to 0° (0.5s ease)
//  11.5 – 17 hold at 0°
const TILT_ANGLE = (50 * Math.PI) / 180;
const TILT_START = 6;
const TILT_IN_END = 8;
const TILT_HOLD_END = 11;
const TILT_OUT_END = 11.5;

function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

function Phone({
  onMeasure,
  onReady,
  play,
}: {
  onMeasure: (size: Vector3) => void;
  onReady: () => void;
  play: boolean;
}) {
  const ref = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL);
  const videoTexture = useVideoTexture(SCREEN_VIDEO, {
    muted: true,
    loop: true,
    start: false, // do not autostart; parent coordinates
    playsInline: true,
    crossOrigin: "anonymous",
  });

  // Swap screen material once
  useEffect(() => {
    videoTexture.flipY = false;
    videoTexture.colorSpace = SRGBColorSpace;
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as MeshStandardMaterial;
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

  // Report ready when enough data buffered
  useEffect(() => {
    const video = videoTexture.image as HTMLVideoElement;
    if (!video) return;
    if (video.readyState >= 3) {
      onReady();
      return;
    }
    const handler = () => {
      if (video.readyState >= 3) onReady();
    };
    video.addEventListener("canplaythrough", handler);
    video.addEventListener("canplay", handler);
    return () => {
      video.removeEventListener("canplaythrough", handler);
      video.removeEventListener("canplay", handler);
    };
  }, [videoTexture, onReady]);

  // Start playback in lockstep when parent says "go"
  useEffect(() => {
    if (!play) return;
    const video = videoTexture.image as HTMLVideoElement;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [play, videoTexture]);

  const offset = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    onMeasure(size);
    return center.clone().negate();
  }, [scene, onMeasure]);

  useFrame(() => {
    if (!tiltRef.current) return;
    const video = videoTexture.image as HTMLVideoElement;
    if (!video || video.readyState < 2) return;
    const t = video.currentTime;

    let angle: number;
    if (t < TILT_START) {
      angle = 0;
    } else if (t < TILT_IN_END) {
      angle = TILT_ANGLE * smoothstep((t - TILT_START) / (TILT_IN_END - TILT_START));
    } else if (t < TILT_HOLD_END) {
      angle = TILT_ANGLE;
    } else if (t < TILT_OUT_END) {
      angle = TILT_ANGLE * (1 - smoothstep((t - TILT_HOLD_END) / (TILT_OUT_END - TILT_HOLD_END)));
    } else {
      angle = 0;
    }

    tiltRef.current.rotation.x = angle;
  });

  return (
    <group ref={ref} rotation={[0, Math.PI, 0]}>
      <group ref={tiltRef}>
        <group position={offset}>
          <primitive object={scene} />
        </group>
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

export default function Test3Page() {
  const [modelSize, setModelSize] = useState<Vector3 | null>(null);
  const [started, setStarted] = useState(false);

  const handlePhoneReady = useCallback(() => setStarted(true), []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <div className="absolute top-0 left-0 z-10 px-6 pt-16 max-w-[1800px]">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
          Scratchpad
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold mb-6">
          3D iPhone sandbox
        </h1>
      </div>

      <div className="absolute inset-0 border border-white">
        <Canvas camera={{ position: [0, 0, 5], fov: 30 }} dpr={[1, 2]}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[20, 20, 20]} intensity={1.2} />
          <Suspense fallback={null}>
            <Phone
              onMeasure={setModelSize}
              onReady={handlePhoneReady}
              play={started}
            />
            <FitCamera modelSize={modelSize} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </main>
  );
}
