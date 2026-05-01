"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
  useVideoTexture,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ACESFilmicToneMapping,
  Box3,
  MeshBasicMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  Vector3,
  type Mesh,
} from "three";

const MODEL = "/iphone_17_pro_max/scene.gltf";
const SCREEN_VIDEO =
  "https://pub-42e3bdd794c24301bd74d193c44417c6.r2.dev/fullFatMarketingVideo.MP4";
const SCREEN_MATERIAL_NAME = "17ProMax_Screen";
const FIT_MARGIN = 1.17;

function Phone({ onMeasure }: { onMeasure: (size: Vector3) => void }) {
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

  // Same screen-material swap as Features so the looping marketing video
  // shows on the iPhone display. toneMapped: false keeps the
  // display-referred video out of the ACES filmic curve.
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

  const offset = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    onMeasure(size);
    return center.clone().negate();
  }, [scene, onMeasure]);

  return (
    <group rotation={[0, Math.PI, 0]}>
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

type UseCase = {
  id: string;
  label: string;
  headline: string;
  body: string;
  tools: string;
};

const USE_CASES: UseCase[] = [
  {
    id: "live",
    label: "Live performance",
    headline: "Phone clipped to a performer.",
    body: "Stream body skeleton, face blend shapes, hand landmarks, IMU, audio analysis, and live camera over Wi-Fi to your show control rig. No tethers, no calibration plates, no lighting setup.",
    tools:
      "TouchDesigner, Resolume, vMix, Notch, OBS, and any NDI or OSC receiver.",
  },
  {
    id: "touchdesigner",
    label: "TouchDesigner",
    headline: "Drop-in receivers for every transport.",
    body: "Auto-discovered NDI, OSC channels that map 1:1 to a CHOP, and binary PLY + speech receivers ready to drag into your network. No frame parsing, no manual port config.",
    tools:
      "OSC In CHOP / DAT, NDI In TOP, plus LOTABinaryPLYReceiverV2.tox, LOTASpeechTCP.tox, LOTASpeechUDP.tox.",
  },
  {
    id: "notch",
    label: "Notch",
    headline: "Real-time graphics, fed from the phone.",
    body: "NDI camera plus LiDAR or AI depth side-by-side, OSC pose, and per-axis motion sensors all land in Notch as native inputs. Build depth-aware effects and sound-reactive blocks driven by what the phone is actually seeing.",
    tools:
      "Notch NDI In, OSC In, and depth-aware nodes that read the side-by-side fallback on every iPhone.",
  },
  {
    id: "resolume",
    label: "Resolume",
    headline: "VJ rig that talks to your phone.",
    body: "NDI shows up natively in Resolume's source list: drop the live camera feed, side-by-side depth, or any of the scrolling-graph visualizations straight into a layer. Pipe LOTA's audio levels and beat triggers into clip parameters via OSC for visuals driven by the room.",
    tools:
      "Resolume Arena and Avenue, NDI sources, OSC In, parameter mapping for sound-reactive clips.",
  },
  {
    id: "unreal",
    label: "Unreal Engine",
    headline: "Virtual production from a pocket rig.",
    body: "Live Link OSC bridges take the phone's body skeleton, face blend shapes, and camera pose straight into Sequencer for previs and real-time mocap. NDI In feeds the live camera into Composure for in-camera VFX.",
    tools:
      "Live Link OSC plugin, NDI Tools for Unreal, Composure, Sequencer, MetaHuman.",
  },
  {
    id: "houdini",
    label: "Houdini",
    headline: "Point clouds and motion data into your scene.",
    body: "Bake LOTA's PLY stream or Gaussian Capture point cloud into Houdini for FX, sim driving, or as reference geometry. IMU and Audio Trace exports give you per-sample CSV data for channel-driven workflows.",
    tools:
      "File SOP, Table Import SOP, Channel SOP, and any importer that ingests CSV or PLY.",
  },
  {
    id: "mocap",
    label: "Motion capture",
    headline: "Body, face, and hands without a stage.",
    body: "ARKit's 91-joint skeleton, 52 facial blend shapes, and 21 per-hand landmarks streamed live as OSC bundles. Per-channel naming means each blend shape is its own line in your DCC, not a flat anonymous array.",
    tools:
      "Blender, Maya, MotionBuilder, Cinema 4D, Unreal Live Link via OSC bridges, TouchDesigner.",
  },
  {
    id: "splatting",
    label: "Gaussian splatting",
    headline: "Walk a scene, train a splat.",
    body: "Record a COLMAP, Nerfstudio, or Nerfstudio + Depth dataset directly on the phone. ARKit intrinsics + extrinsics + LiDAR point cloud baked in. Drop the ZIP into your training pipeline and start splatting.",
    tools:
      "OpenSplat, gsplat, Nerfstudio / splatfacto, Instant-NGP, plus Blender or CloudCompare for the raw point clouds.",
  },
];

export default function UseCases() {
  const [modelSize, setModelSize] = useState<Vector3 | null>(null);
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const active = USE_CASES.find((uc) => uc.id === activeId) ?? USE_CASES[0];

  return (
    <section id="use-cases" className="py-28 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-pixel-line text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Use cases
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Your stage. Your studio. Your pipeline.
          </h2>
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
              <Environment
                files="/monochrome_studio_02_1k.exr"
                background={false}
              />
              <directionalLight position={[5, 8, 5]} intensity={0.6} />
              <Phone onMeasure={setModelSize} />
              <FitCamera modelSize={modelSize} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Tab bar: centered when it fits, horizontal scroll on overflow,
            active tab underlined. */}
        <div className="mt-12 border-b border-white/[0.08]">
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-8 sm:gap-12 w-fit mx-auto">
              {USE_CASES.map((uc) => {
                const isActive = uc.id === activeId;
                return (
                  <button
                    key={uc.id}
                    onClick={() => setActiveId(uc.id)}
                    className={`relative shrink-0 pb-4 text-sm sm:text-base font-medium tracking-tight transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {uc.label}
                    <span
                      className={`absolute left-0 right-0 -bottom-px h-px bg-white transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active use case description. */}
        <div className="mt-10 max-w-3xl mx-auto text-center">
          <p className="text-base sm:text-lg leading-relaxed">
            <span className="text-white font-semibold">{active.headline}</span>{" "}
            <span className="text-zinc-500">{active.body}</span>
          </p>
          <p className="mt-4 text-sm text-zinc-600">{active.tools}</p>
        </div>
      </div>
    </section>
  );
}
