# LOTA — LiDAR Over The Air

LOTA is an iOS application that transforms your iPhone into a professional-grade spatial capture tool. By tapping into the LiDAR scanner, camera array, and motion sensors already built into modern iPhones, LOTA bridges the gap between consumer hardware and the expensive, specialized cameras used in professional generative visual workflows.

## The Problem

Every day, millions of people carry a device packed with LiDAR, depth sensors, accelerometers, gyroscopes, and multi-lens camera systems — yet almost no applications actually harness this sensor array for creative and professional work. Meanwhile, achieving comparable spatial capture and depth-aware imagery traditionally requires camera rigs costing thousands of dollars.

LOTA exists to close that gap.

## What LOTA Does

LOTA lets users leverage the full sensor suite of their iPhone to capture rich spatial and visual data, then uses that data to enhance generative visual techniques — giving creators, designers, and developers access to capabilities that were previously locked behind prohibitively expensive hardware.

## Capabilities

### Capture Modes

- **Color** — Live RGB camera feed
- **Monochrome** — Grayscale camera feed
- **Depth** — LiDAR depth visualization with 9 selectable colormaps (Black & White, Blue Red, Deep Sea, Incandescent, Heated Metal, and more)
- **Point Cloud** — Real-time 3D point cloud with true RGB colors sampled from the camera image, configurable frame window (5–60 frames). GPU-accelerated via Metal compute shaders — every pixel of the 256×192 LiDAR depth map is unprojected in parallel for ~4× spatial density over previous versions. User-configurable Max Depth range (1–10 m) lets Gen 2 devices (iPhone 15/16 Pro) reach ~10 m

### ARKit Body & Face Tracking

- **Body Tracking** — Real-time 3D skeleton detection (91 joints) via the rear camera using `ARBodyTrackingConfiguration`. 18 key joints streamed over OSC at `/lota/body/skeleton`, `/lota/body/root`, `/lota/body/detected`. Live skeleton overlay draws bones and joint dots over the camera feed
- **Face Tracking** — Real-time facial motion capture (52 blend shapes) via the front camera using `ARFaceTrackingConfiguration`. Each blend shape is sent as its own named OSC address (e.g. `/lota/face/browDown_L`, `/lota/face/eyeSquint_R`) inside a single OSC bundle. Live bar graph overlay shows the top 8 most active blend shapes
- **ARKit Tracking Page** — Dedicated swipe-left page with Body/Face mode selector, live detection status badges, and transmit controls

### Streaming

- **NDI** — Industry-standard video-over-IP. Auto-discovered as "LOTA (iPhone)" by TouchDesigner, OBS, vMix, Resolume, and any NDI receiver. Sends whatever is on screen (all modes) as portrait BGRA video
- **TCP/UDP** — H.264 compressed video for color/mono modes, raw Float32 depth maps for depth/point cloud modes. Configurable host, port, and protocol
- **OSC** — Real-time sensor data sent as Open Sound Control messages over UDP:
  - `/lota/camera/position` (x, y, z) at ~30 Hz
  - `/lota/camera/rotation` (quaternion) at ~30 Hz
  - `/lota/camera/euler` (pitch, yaw, roll) at ~30 Hz
  - `/lota/body/*` — skeleton joints, root transform, detection state
  - `/lota/face/*` — 52 individually named blend shapes, head transform, detection state
  - `/lota/mode` and `/lota/fps` at 1 Hz
- **PLY Streaming** — Live point cloud data streamed over TCP in CSV text or packed binary format (~40 % smaller than CSV). Binary format uses a 4-byte LE count header + 15 bytes/point (3 floats + 3 uint8 RGB), toggleable in Settings

### Gaussian Splatting & Point Cloud Export

- **Gaussian Splat Capture** — Dedicated capture mode (swipe right). Records posed camera frames as JPEGs + ARKit camera intrinsics/extrinsics + LiDAR point cloud. Exports a COLMAP-compatible binary dataset (`cameras.bin`, `images.bin`, `points3D.bin`) ready for training with OpenSplat, Nerfstudio, or gsplat. Also supports Nerfstudio-native export
- **Point Cloud Export** — Standalone .ply file export with unlimited point accumulation across the entire recording session. Compatible with Blender, CloudCompare, MeshLab, and any PLY-compatible tool
- **iCloud Files Integration** — User selects an export folder via the system document picker. Captures sync to iCloud automatically

### GPU Pipeline & Performance

- **Metal Compute Shaders** — Depth unprojection runs entirely on the GPU. Dynamic ring buffer allocation adapts to any LiDAR hardware resolution at runtime
- **Compute Quality** — Three-tier setting (Full / Balanced / Efficient) controls GPU compute frame skip to balance fidelity and thermal load
- **Adaptive Thermal Throttle** — Automatically increases frame skip when FPS drops below 50 and recovers above 55, with hysteresis to prevent oscillation
- **Depth Change Detection** — Skips redundant compute dispatches when ARKit reuses the same depth buffer across interpolated frames (zero cost, zero quality loss)

### Settings & Customization

- All streaming transports are independently toggleable (TCP/UDP, NDI, OSC, PLY)
- Configurable receiver IP shared across all transports
- Per-transport port configuration
- Depth colormap selection (9 options)
- Max Depth range slider (1–10 m)
- Compute Quality picker (Full / Balanced / Efficient)
- Binary PLY format toggle
- Point cloud frame window slider
- Skeleton and Face overlay toggles
- Export folder selection for Gaussian/PLY captures

### Accessibility

- VoiceOver labels and hints across all views
- Voice Control input labels
- Differentiate Without Color support and high-contrast colors
- Reduced Motion preference support
- Debounced tracking announcements to prevent VoiceOver spam

### Receiver Tools

- `td_pointcloud_receiver.py` — High-performance TouchDesigner binary point cloud receiver using numpy bulk parsing, Script TOP textures, and GPU instancing. Handles 49K+ points at 60 fps with ~1–2 ms Python overhead
- `lota-receiver.swift` — Standalone Swift TCP receiver for raw frames

---

## Elevator Pitch

Your iPhone already has a LiDAR scanner, depth sensors, and a multi-lens camera array, LOTA is the app that actually puts them to work. It turns your phone into a real-time spatial capture rig: stream point clouds, depth maps, body skeletons, and facial motion capture straight into TouchDesigner, Nerfstudio, or any NDI/OSC receiver. Capture Gaussian Splat datasets on a walk through a room. Get 49K-point clouds at 60 fps over Wi-Fi. No thousand-dollar cameras, no tethered setups, just the phone in your pocket, a Metal-accelerated GPU pipeline, and a direct wire into your creative tools.
