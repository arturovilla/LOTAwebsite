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
- **Point Cloud** — Real-time 3D point cloud with true RGB colors sampled from the camera image, configurable frame window (5–60 frames) and point density (500–12,500 points per frame)

### Streaming

- **NDI** — Industry-standard video-over-IP. Auto-discovered as "LOTA (iPhone)" by TouchDesigner, OBS, vMix, Resolume, and any NDI receiver. Sends whatever is on screen (all modes) as portrait BGRA video
- **TCP/UDP** — H.264 compressed video for color/mono modes, raw Float32 depth maps for depth/point cloud modes. Configurable host, port, and protocol
- **OSC** — Real-time camera tracking data sent as Open Sound Control messages over UDP:
  - `/lota/camera/position` (x, y, z) at ~30 Hz
  - `/lota/camera/rotation` (quaternion) at ~30 Hz
  - `/lota/camera/euler` (pitch, yaw, roll) at ~30 Hz
  - `/lota/mode` and `/lota/fps` at 1 Hz
- **PLY Streaming** — Live point cloud data streamed over TCP as CSV frames for TouchDesigner. Received via TCP/IP DAT with a Python callback that populates a Table DAT in real-time

### Gaussian Splatting & Point Cloud Export

- **Gaussian Splat Capture** — Dedicated capture mode (swipe right). Records posed camera frames as JPEGs + ARKit camera intrinsics/extrinsics + LiDAR point cloud. Exports a COLMAP-compatible binary dataset (`cameras.bin`, `images.bin`, `points3D.bin`) ready for training with OpenSplat, Nerfstudio, or gsplat
- **Point Cloud Export** — Standalone .ply file export with unlimited point accumulation across the entire recording session. Compatible with Blender, CloudCompare, MeshLab, and any PLY-compatible tool
- **iCloud Files Integration** — User selects an export folder via the system document picker. Captures sync to iCloud automatically

### Settings & Customization

- All streaming transports are independently toggleable (TCP/UDP, NDI, OSC, PLY)
- Configurable receiver IP shared across all transports
- Per-transport port configuration
- Depth colormap selection (9 options)
- Point cloud frame window and density sliders
- Export folder selection for Gaussian/PLY captures
