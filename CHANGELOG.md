# Changelog

All notable changes to the LOTA project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.3] - 2026-04-01

### Fixed
- **Face blend shape OSC channels now use descriptive names**: TouchDesigner OSC In CHOP previously showed generic numbered channels (`lota/face/blendshapes1`, `blendshapes2`, …) because all 52 blend shapes were packed into a single OSC message. Each blend shape is now sent as its own named OSC address (e.g. `/lota/face/browDown_L`, `/lota/face/eyeSquint_R`), matching the labels shown in the app's face overlay.

### Changed
- Face blend shapes sent as an OSC bundle (one UDP datagram containing 52 individually addressed messages) instead of a single flat message with anonymous float arguments
- Added `OSCBundle` struct to `OSCEncoder.swift` implementing the OSC 1.0 bundle wire format (`#bundle\0` + timetag + size-prefixed messages)

---

## [1.0.2] - 2026-03-31

### Added
- **ARKit Body Tracking**: Real-time 3D skeleton detection (91 joints) via rear camera using `ARBodyTrackingConfiguration`, streamed as 18 key joints over OSC at `/lota/body/skeleton`, `/lota/body/root`, `/lota/body/detected`
- **ARKit Face Tracking**: Real-time facial motion capture (52 blend shapes) via front camera using `ARFaceTrackingConfiguration`, streamed over OSC at `/lota/face/<blendShapeName>`, `/lota/face/transform`, `/lota/face/detected`
- **ARKit Tracking page**: New swipe-left page with Body/Face mode selector, live detection status badges, settings and transmit controls — mirrors the existing camera and Gaussian capture page pattern
- **Skeleton overlay**: Real-time bone + joint dot visualization drawn over the camera feed in Body mode, projecting 3D skeleton joints to 2D screen coordinates via `ARCamera.projectPoint`
- **Face blend shape overlay**: Live bar graph display of the top 8 most active facial blend shapes in Face mode
- **Overlay settings**: Skeleton Overlay and Face Overlay toggles in Settings with UserDefaults persistence
- **Mocap mode** (implemented but hidden): Simultaneous face + body tracking using Vision framework body detection on rear camera with LiDAR depth projection for approximate 3D joints — can be re-enabled by changing `TrackingMode.visibleCases`
- `TrackingMode` enum (`LOTA/Models/TrackingMode.swift`) with body/face/mocap modes, device capability checks
- `ARKitTrackingView` (`LOTA/Views/ARKitTrackingView.swift`) with full accessibility: VoiceOver labels, Voice Control input labels, Differentiate Without Color support, high-contrast colors, combined accessibility elements
- `SkeletonOverlayView` (`LOTA/Views/SkeletonOverlayView.swift`) for body skeleton rendering
- `FaceOverlayView` (`LOTA/Views/FaceOverlayView.swift`) for blend shape visualization
- Debounced VoiceOver tracking announcements (500ms) to prevent spam from noisy detection at frame edges
- Protocol info in Settings now shows Body OSC and Face OSC entries

### Changed
- `ContentView` extended to three-page TabView: ARKit Tracking (left) <- Camera (center) -> Gaussian Capture (right)
- Page transitions now track `previousPage` to handle fast swipes that skip intermediate pages
- Page transitions blocked while Gaussian recording is active to prevent session reconfiguration mid-capture
- `previousStreamingMode` only saved when leaving the camera page (prevents overwrite from other pages)
- `CaptureManager` handles ARKit session reconfiguration: `enterTrackingMode()` switches to body/face config and disconnects video transports (OSC stays alive); `exitTrackingMode()` restores world tracking without `.resetTracking` to preserve world map continuity
- Video transports (TCP/UDP/NDI/PLY) disconnected from renderer when entering tracking mode (incompatible frame format), reconnected on return
- `isReconfiguring` state drives a loading indicator and disables streaming toggles during ~0.5s session switch window
- Settings navigation title changed from "Streaming" to "Settings"
- `OSCMessage` and `OSCArg` marked `Sendable`, `encoded()` marked `nonisolated` — resolves 18 actor isolation warnings
- `dlog` marked `nonisolated` — resolves main actor isolation warning
- Replaced deprecated `UIScreen.main.nativeScale` with `UITraitCollection.current.displayScale`

### Planned
- Mesh export and point cloud settings enhancements

---

## [0.3.0] - 2026-03-25

### Added
- Enhanced Gaussian Splat capture workflow with improved recording controls
- Nerfstudio exporter (`NerfstudioExporter.swift`) for alternative 3D reconstruction pipelines
- ARKit body tracking plan for future implementation
- ARKit Gaussian Splat enhancement plan
- NDI SDK vendor headers and static library (`Vendor/NDI/`) to resolve Xcode Cloud build failures

### Changed
- Improved `GaussianRecorder` with extended capture capabilities
- Enhanced `MetalRenderer` with additional rendering features
- Updated `GaussianCaptureView` UI for better capture workflow
- Updated `CaptureManager` with new capture options

---

## [0.2.0] - 2026-03-24

### Added
- Accessibility features: Voice Control support and Reduced Motion preferences
- `AccessibilityHelpers.swift` utility for centralized accessibility support
- Accessibility labels and hints across all views (`CameraView`, `GaussianCaptureView`, `ModePickerView`, `StatusOverlayView`)
- UI test suite (`LOTAUITests.swift`)

### Changed
- Improved `ModePickerView` with accessible navigation
- Enhanced `StatusOverlayView` with VoiceOver support
- Updated `SettingsView` with accessibility considerations

---

## [0.1.0] - 2026-03-22

### Added
- Initial project build and app structure
- **Capture system**: `CaptureManager`, `GaussianRecorder`, `COLMAPExporter`, `LiDARCapability`
- **Rendering pipeline**: `MetalRenderer`, Metal shaders (`Shaders.metal`), `DepthColorMap`, `CameraPreviewView`
- **Streaming**: Full streaming stack — `StreamingService`, `FrameEncoder`, `NDITransport`, `TCPTransport`, `UDPTransport`, `OSCTransport`, `OSCEncoder`, `PLYEncoder`
- **Views**: `CameraView`, `GaussianCaptureView`, `ModePickerView`, `SettingsView`, `StatusOverlayView`, `FolderPickerView`
- **Models**: `CaptureMode`, `StreamingSettings`
- App icon (light and dark variants)
- `ContentView` as main navigation hub
- Receiver tools: `lota-receiver.swift` and `td_ply_receiver.py`
- README with project overview

---

## [0.0.1] - 2026-03-18

### Added
- Initial commit — project scaffolding and Xcode project setup
