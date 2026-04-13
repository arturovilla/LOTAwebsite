# Changelog

All notable changes to the LOTA project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-04-12

### Added

- **Device Motion capture mode**: New `.deviceMotion` mode streams iPhone sensor data over OSC. Four individually-toggleable sensors, **Acceleration enabled by default** — Gyroscope, Compass Heading, and Barometric Pressure off by default. Update rate picker (30/60/100 Hz). All values stream as per-axis OSC addresses so each maps 1:1 to a TouchDesigner OSC In CHOP channel. Does not require LiDAR — works on every iPhone
- **Motion OSC channels** (all per-axis for clean TD CHOP mapping):
  - `/lota/motion/accel/x`, `/y`, `/z` — gravity-removed acceleration in G-force
  - `/lota/motion/gyro/x`, `/y`, `/z` — rotation rate in rad/s
  - `/lota/motion/heading` — compass heading in degrees (0–360)
  - `/lota/motion/pressure` — atmospheric pressure in kPa
  - `/lota/motion/altitude` — relative altitude in meters
- **Audio Analysis capture mode**: New `.audio` mode taps the microphone via `AVAudioEngine` and runs real-time DSP analysis using Apple's Accelerate/vDSP framework — no third-party dependencies. Streams analysis results over OSC for sound-reactive visuals. Four channel groups individually toggleable, **Levels (bass/mid/high) enabled by default**
- **Audio Levels** — continuous frequency-band energy normalized 0–1 with rolling auto-gain:
  - `/lota/audio/bass` — 20–200 Hz (kick, sub-bass, bass guitar fundamentals)
  - `/lota/audio/mid` — 200–2000 Hz (vocals, snare body, guitars, most instruments)
  - `/lota/audio/high` — 2000–8000 Hz (snare attack, hi-hats, vocal consonants, cymbals)
- **Audio Beat Detection** — per-band onset detection with log-magnitude spectral flux + one-pole smoothing (~15Hz cutoff) + peak-picking + variance-adaptive threshold + 20th-percentile noise-floor tracking + silence energy gate + 50ms minimum inter-onset time. Output is a **binary switch (0 or 1)** that holds at 1.0 for 50ms after each hit — TouchDesigner-friendly for Trigger CHOP routing:
  - `/lota/audio/drums/low` — low-band beat trigger (kicks, bass hits)
  - `/lota/audio/drums/mid` — mid-band beat trigger (snares, claps, vocals)
  - `/lota/audio/drums/high` — high-band beat trigger (hi-hats, cymbals)
- **Audio Dynamics** — `/lota/audio/burst` — fast-vs-slow envelope difference, normalized 0–1, pulse-shaped output (rises instantly on transient, decays over ~200ms)
- **Audio FFT Spectrum** — 20 log-spaced frequency bands across 20–20,000 Hz, each normalized 0–1 via per-bin rolling max. `/lota/audio/fft/0` through `/lota/audio/fft/19`
- **Scrolling line graph visualization** for both Motion and Audio modes — TouchDesigner CHOP viewer aesthetic. One lane per active value, stacked vertically with dynamic sizing. Colored lines scroll left as new samples arrive. Each lane has a dim center line, separator line, and colored glyph label at the right edge following the line's current Y position. Metal-rendered, captured by NDI
- **Smooth sub-sample scroll animation**: classic oscilloscope trick — between sample arrivals, the graph slides left by a fractional sample-width based on elapsed time. Eliminates the "choppy steps" visible at 30Hz data + 60fps render. Works identically for Motion and Audio modes
- **Thread-safe ring buffer access** in Motion + Audio engines and renderer — `NSLock`-protected snapshots with generation counters so stale handler callbacks after mode switches or sensor toggles become no-ops (prevents data race crashes)
- **Debounced sensor toggle restarts** — when a user flips a sensor/channel toggle while in Motion or Audio mode, the engine restarts 50ms later so multiple rapid toggles produce a single restart (prevents crash-loop from rapid TCC requests)
- **Upfront permissions flow** — when the user selects Motion mode, location permission (for compass heading) is requested immediately via a system dialog. When the user selects Audio mode, microphone permission is requested immediately. If denied, a clear overlay with "Open Settings" deep-link appears
- **`NSMotionUsageDescription`** and **`NSLocationWhenInUseUsageDescription`** added to `Info.plist` — fixes TCC-enforcement crash on direct `CMMotionManager.startDeviceMotionUpdates()` use
- **`GlyphAtlas` character set expansion** — baked glyph set expanded from `#0123456789` to `#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ` so graph lane labels (`BASS`, `MID`, `HIGH`, `DL`, `DM`, `DH`, `BURST`, `F0`–`F19`, `AX`, `AY`, `AZ`, `GX`, `GY`, `GZ`, `HD`, `PR`, `AL`) render correctly
- **`GlyphAtlas` UV bleed fix** — expanded the per-glyph bounding rect by 1px in each direction so anti-aliasing fringe pixels aren't clipped. Labels render crisply
- **FFT band gradient colors** — F0 (lowest freq) through F19 (highest freq) use HSV hue sweep from red → blue so operators can visually track which band is which

### Changed

- `CaptureMode` enum extended with `.deviceMotion` (`gyroscope` icon) and `.audio` (`waveform.and.magnifyingglass` icon) cases — both `requiresLiDAR = false`
- `ContentView` TabView restructured to handle the new modes' permission flows without breaking existing mode switching
- `MetalRenderer` extended with `motionGraphPipeline` + `motionCenterLinePipeline` (shared between motion and audio modes) and new `motionGraphTopInset` / `motionGraphBottomInset` properties so graph lanes don't draw behind SwiftUI overlays
- `StreamingSettings` gained 10 new persisted properties across motion and audio mode toggles
- `FrameEncoder.encode` routes `.deviceMotion` and `.audio` to `break` — both modes are OSC-only (no TCP/UDP video frames)
- Camera pose OSC (`/lota/camera/position`, `/rotation`, `/euler`) suppressed in Motion and Audio modes so the high-rate pose data doesn't drown out sensor/audio messages in OSC In CHOP

### Removed

- Early prototype `global_dynamic` audio channel — replaced by the cleaner `burst`-only Dynamics output after discovering the normalization math produced confusing stuck-at-0.67 values in most audio

---

## [1.0.9] - 2026-04-09

### Added
- **Blob Tracking capture mode**: New `.blobTracking` mode recreates the TouchDesigner Blob Track TOP look — single-color hairline rectangle outlines around connected regions of LiDAR depth pixels within a configurable depth slab, all rendered in Metal so the **NDI feed carries the complete visualization**. Depth-based detection means no background plate required, no lighting sensitivity, works on a moving camera. Requires LiDAR
- **Four base styles** for the underlying camera layer:
  - **Color** (default) — full live color camera feed; rectangles drawn over the natural scene
  - **Mono** — full grayscale camera feed
  - **Mask** — grayscale subject silhouette on black; everything outside the depth slab hidden
  - **Binary** — pure white-on-black silhouette (matches TD's Blob Track TOP authentic look)
- **`BlobTracker` with TD-matching lifecycle**: Connected-components labeling with union-find, 4-connectivity, confidence filtering, and owned scratch buffers (zero per-frame allocation). Full lifecycle state machine matching TD's `onBlobStateChange`: `new → lost → revived → expired`. Nearest-centroid ID assignment with configurable `maxMoveDistance`. Lost blobs are kept for `reviveTime` seconds and revived with the same ID if they reappear within `reviveDistance`. Age tracked in seconds via `CFAbsoluteTimeGetCurrent()`
- **Detection runs off the ARKit delegate thread** on a dedicated `blobQueue` with drop-on-busy semantics. The delegate callback only captures depth `CVPixelBuffer` references and dispatches — never blocked by CCL or texture upload. At most one ARFrame is pinned in-flight via the dispatch closure, eliminating ARKit's "delegate retaining N ARFrames" backpressure warning. LiDAR duplicate-frame skip via unretained pointer comparison halves CPU work at 30 Hz
- **Three-pass Metal rendering pipeline** in `drawBlobTracking`:
  - **Pass A**: base layer (Color/Mono/Mask/Binary) via `blobBaseFragment`, reusing `cameraVertex` for portrait rotation + aspect-fill
  - **Pass B**: instanced 1-pixel hairline rectangle outlines via `rectVertex`/`rectFragment` — single user-set RGB color, axis-aligned, integer pixel snap
  - **Pass C** (optional): instanced glyph quads sampled from a baked CoreText atlas via `glyphVertex`/`glyphFragment` — `#id` labels positioned just outside each bbox at the top-right corner
  - All three passes encode in a single `MTLRenderCommandEncoder` and are captured by `captureForNDI` so the NDI receiver sees the complete composition
- **`GlyphAtlas`**: New `LOTA/Capture/GlyphAtlas.swift` — bakes a small `r8Unorm` atlas containing `#0123456789` once at startup using `CoreText` + `CGContext`. Stores per-glyph metrics (UV rect, advance, bearing) for runtime cursor-walk layout. Sized at `11pt × screenScale` so labels render crisp at 1:1 on retina displays. Per-frame cost is just the cursor walk (~0.1 ms CPU); GPU draws the labels in a single instanced call
- **TD-matching OSC output**: Field names match `blobtrackTOP_Class` verbatim. One `OSCBundle` per frame, padded to 10 slots for stable TouchDesigner CHOP channel counts:
  - `/lota/blob/count` (int) — active blob count
  - `/lota/blob/ids` (10 ints) — stable tracker IDs, 0 for empty slots
  - `/lota/blob/u`, `/lota/blob/v` (10 floats each) — normalized centroid position
  - `/lota/blob/width`, `/lota/blob/height` (10 floats each) — normalized bbox size
  - `/lota/blob/tx`, `/lota/blob/ty` (10 ints each) — pixel centroid in depth-map space
  - `/lota/blob/age` (10 floats) — seconds the blob has been tracked
  - `/lota/blob/state` (10 ints) — `0=new, 1=revived, 2=lost, 3=expired`
- **Blob tracking settings** organized into subsections mirroring TD's parameter pages:
  - **Detection** — Base Style picker (Color/Mono/Mask/Binary), Draw Blob Bounds toggle, Show ID Labels toggle, Color picker for rectangle outlines
  - **Depth** — Min/Max Depth sliders, Min Confidence picker
  - **Constraints** — Min/Max Blob Size sliders, Max Move Distance slider
  - **Revival** — Revive Blobs toggle, Revive Time, Revive Distance, Include Lost/Expired toggles
- **Blob count + depth range in status HUD**: `StatusOverlayView` shows `"N blob(s)"` with a hex-grid icon when the mode is active. The current depth range (e.g. `"0.5m – 3.0m"`) appears under the mode dropdown so operators can see the active slab without opening Settings
- **`@Published blobCount` dedupe**: Only dispatches a main-actor update when the count actually changes, preventing per-frame SwiftUI body re-runs in `CameraView` while the count is stable

### Changed
- `CaptureMode` enum extended with `.blobTracking` case — `circle.hexagongrid` icon, "Depth-based blob detection and tracking" description, `requiresLiDAR = true`
- `MetalRenderer` gained three new pipeline states (`blobBasePipeline`, `rectPipeline`, `glyphPipeline`), `glyphAtlas` reference, rect instance buffer, glyph instance buffer, and the 3-pass `drawBlobTracking` method. Exposes `metalDevice` computed property and a `makeBlobLabelTexture(width:height:)` factory
- `StreamingSettings` gained blob-tracking properties across detection, constraints, revival, and visual categories
- `SettingsView` blob section restructured into four subsections (Detection, Depth, Constraints, Revival) mirroring TD's Blob Track TOP parameter pages. `ColorPicker` for rectangle outline color. Protocol Info row updated to `"Blob OSC: /lota/blob/* (TD-compat, 10 slots)"`
- `FrameEncoder.encode` routes `.blobTracking` to `encodeDepth` — TCP/UDP receivers get raw `Float32` depth frames in blob mode (identical to `.depth` mode), and the structured blob metadata is OSC-only
- `ContentView` restructured: `CameraPreviewView` is now applied as a `.background` modifier on the `TabView` instead of being a `ZStack` sibling, reducing SwiftUI hosting-controller hierarchy conflicts when popovers (Menus) are presented inside the page-style TabView

---

## [1.0.8] - 2026-04-08

### Added
- **Live Transcription capture mode**: New `.transcription` mode in the capture dropdown. Uses iOS 26's `SpeechAnalyzer` + `SpeechTranscriber` framework for fully on-device, real-time speech-to-text. No internet required. Does not require LiDAR — works on every iPhone. New `TranscriptionEngine` class wraps `AVAudioEngine` microphone capture + SpeechAnalyzer pipeline with Swift concurrency (`AsyncStream<AnalyzerInput>`)
- **Mirrored bar waveform visualization**: When transcription mode is active, the camera view is replaced with a black canvas and a 200-bar white mirrored waveform driven by live microphone RMS amplitude. Rendered in Metal (new `waveformVertex`/`waveformFragment` shaders) so it streams through NDI automatically
- **Live transcript SwiftUI overlay**: Recognized words appear on-screen as large centered captions while speaking. Updates on partial results (as words arrive) and finalized sentences
- **Speech model auto-download**: First-time use downloads the language model via `AssetInventory.assetInstallationRequest` in the background. User sees a brief delay on first recognition session per language
- **Microphone + Speech Recognition permission flow**: Requests both permissions on first entry to transcription mode. If denied, shows a clear "Enable in Settings" message with a deep-link button to the app's settings page
- **Transcription OSC output**: Streams recognized speech as OSC messages when OSC streaming is enabled:
  - `/lota/speech/word` (string) — each recognized word
  - `/lota/speech/word_count` (int) — incrementing counter, visible in OSC In CHOP
  - `/lota/speech/partial` (string) — running partial transcript
  - `/lota/speech/final` (string) — finalized sentence
  - Sent via existing OSC transport, same pattern as face blend shapes
- **Transcription TCP/UDP streaming**: New `FrameType.speechText = 4` wire format. `FrameEncoder.encodeSpeechText(_:kind:wordIndex:timestamp:)` builds a 24-byte `FrameHeader` + UTF-8 payload. Header's `width` field repurposed for speech kind (0=word, 1=partial, 2=final), `height` for word index. Uses the existing TCP/UDP transports — no new networking code. Dedicated `transcriptionStartTime` / `transcriptionRelativeTimestamp()` helper since transcription mode doesn't have an `ARFrame.timestamp` source
- **Drag-and-drop TouchDesigner components**: Two custom TD components are now available on the [LOTA docs page](https://lidarota.app) for receiving speech data:
  - **LOTASpeechTCP** — TCP/IP DAT + callback script that parses LOTA's binary frame format and writes parsed words/partials/finals to a `speech_log` Table DAT. Handles stream buffering for partial frame arrivals
  - **LOTASpeechUDP** — UDP In DAT + callback script using "One Per Message" mode. Simpler than TCP (no buffering needed — each datagram is a complete frame)
  - OSC and NDI continue to work as before for users who prefer those transports
- **Per-channel OSC output toggles**: New "Transcription" section in Settings with three toggles (Send Per-Word, Send Partial, Send Final). Users can pick which transcription OSC addresses to send. Defaults to all on. Toggles apply to both OSC and TCP/UDP paths
- **Listening indicator in status bar**: Pulsing `mic.fill` icon + "LISTENING" label appears next to the FPS counter when the transcription engine is actively capturing audio. Uses SwiftUI `animation(.repeatForever)` for the pulse

### Changed
- **Camera position OSC suppressed in transcription mode**: `/lota/camera/position`, `/lota/camera/rotation`, and `/lota/camera/euler` are no longer sent when the capture mode is `.transcription` — prevents the high-rate pose data from drowning out speech messages in OSC In DAT
- `StatusOverlayView` gained an `isListening: Bool` parameter (default false) and an animated microphone indicator
- `CaptureMode` enum extended with `.transcription` case — `mic.fill` icon, "Live speech-to-text" description, `requiresLiDAR = false`
- `CaptureManager.setMode()` starts/stops the transcription engine on mode enter/exit — engine never runs in the background
- `StreamingProtocol.FrameType` extended with `speechText = 4` for the new text wire format
- `StreamingSettings` gained three persisted toggles: `transcriptionSendWords`, `transcriptionSendPartial`, `transcriptionSendFinal`

### Fixed
- Waveform amplitude ring buffer sized to 200 samples (was 128) for finer horizontal resolution without performance cost

---

## [1.0.7] - 2026-04-07

### Changed
- **Unified mode selector**: Camera/Streaming page mode picker replaced with a top dropdown menu matching the Gaussian Capture and ARKit Tracking pages. All three pages now use the same dropdown pattern — icon, label, chevron, description per option
- Camera page bottom bar simplified to Settings (left) and Streaming toggle (right)

### Removed
- `ModePickerView.swift` — replaced by inline dropdown in CameraView

---

## [1.0.6] - 2026-04-07

### Added
- **ARKit mesh wireframe overlay**: During Gaussian Splatting and Point Cloud capture, ARKit scene reconstruction renders a semi-transparent mesh overlay on the camera feed showing scanned surfaces building up in real time. Mesh triangles are colored by depth (cyan near, purple far). Uses `ARMeshAnchor` geometry rendered via a dedicated Metal pipeline with alpha blending
- **Keyframe selection**: Intelligent frame filtering during capture — only saves frames where the camera has moved at least 5cm or rotated ~5 degrees since the last saved frame. Reduces dataset size by ~90% while maintaining spatial coverage. A typical 30-second capture produces ~80 well-distributed keyframes instead of ~900 redundant frames
- **Blur detection**: Laplacian variance sharpness filter rejects motion-blurred frames before JPEG encoding. Runs on the Y (luminance) plane at 1/4 resolution for minimal overhead (<1ms). Blurry frames from fast camera movement are automatically discarded
- **Auto focus lock**: Autofocus is automatically disabled when recording starts and restored when recording stops. Prevents focal length drift that would invalidate the single-intrinsics assumption in COLMAP/Nerfstudio datasets. Uses ARKit's official `isAutoFocusEnabled` API — no tracking interruption
- **ZIP export**: Capture sessions are compressed into a single `.zip` file after recording. The original folder is deleted after successful compression. File size is shown in the save summary (e.g. "12.4 MB"). Uses ZIPFoundation (SPM)
- **Recording timer**: Live elapsed time display (mm:ss format) shown during capture alongside frame and point counters
- **Haptic feedback on keyframe capture**: Subtle tap via `UIImpactFeedbackGenerator` each time a frame passes the keyframe + blur gates and is saved to the dataset
- **Rolling accumulation buffer**: When the Metal accumulation buffer reaches 5M points, the oldest 25% are evicted via `memmove` and new points continue accumulating. Prevents the visual stall that occurred in 1.0.5 during long recordings

### Changed
- Gaussian Capture page now shows live camera feed (was point cloud) with mesh wireframe overlay during recording, replacing the previous point cloud accumulation view. Dramatically reduces GPU load (~1ms vs ~5-8ms per frame)
- Frame counter label changed from "frames" to "keyframes" to reflect the filtering behavior
- `GaussianRecorder.recordFrame()` restructured: points are only accumulated from frames that pass both keyframe and blur gates (was: all frames accumulated, causing memory exhaustion on long recordings)
- `stopRecording()` return type changed from `URL?` to `(URL, Int64)?` to include zip file size
- `SaveSummaryView` now shows file size and updated iCloud message ("Your capture is ready to transfer via iCloud or AirDrop")
- Save progress indicator shows two phases: "Saving..." then "Compressing..."

### Removed
- Point cloud accumulation as the default capture visualization — replaced by camera + mesh overlay
- Depth overlay / coverage painting system (depthOverlayFragment shader, updateCoverage compute kernel, coverage texture) — replaced by ARKit mesh wireframe

---

## [1.0.5] - 2026-04-04

### Added
- **Depth confidence filtering**: GPU compute kernel now filters depth pixels by ARKit confidence level before unprojection. Three-level segmented picker in Settings (All / Medium+ / High Only). Default Medium+ removes noisy edge pixels with zero performance cost. Also applied to GaussianRecorder's CPU-side point extraction during capture
- **NDI depth side-by-side streaming**: New toggle in NDI settings sends a 2x-wide frame — left half is the current camera view (any mode), right half is the depth colormap. Standard format expected by TouchDesigner and Notch artists (popularized by iDepth NDI). Uses a separate Metal render pass for the depth visualization, blitted into a double-wide IOSurface
- **Hand tracking via Vision framework**: New "Hands" mode on the ARKit Tracking page (swipe left). Detects up to 2 hands simultaneously using `VNDetectHumanHandPoseRequest` on the rear camera. 21 landmarks per hand streamed over OSC, organized by finger (`/lota/hand/left/thumb`, `/lota/hand/left/index`, etc.). Color-coded overlay: left hand = teal, right hand = orange
- **2D/3D hand coordinate toggle**: Default 2D mode streams normalized screen-space coordinates (works on all iPhones). Opt-in 3D mode projects landmarks into world space using LiDAR depth (greyed out on non-LiDAR devices). `is3d` OSC flag tells receivers which coordinate space is active
- **Hand overlay view**: Real-time bone + joint dot visualization drawn over camera feed using SwiftUI Canvas. Five finger chains from wrist to fingertip per hand, with aspect-fill crop correction for accurate alignment

### Changed
- Tracking settings sections consolidated from separate "Body Tracking" and "Face Tracking" into unified "Tracking" section with Skeleton Overlay, Face Overlay, Hand Overlay, and 3D Hand Coordinates toggles
- `TrackingMode` enum extended with `.hands` case, added to visible mode picker alongside Body and Face
- Hand detection runs on existing Vision dispatch queue (throttled every 2nd frame for ~30fps updates), uses `ARWorldTrackingConfiguration` with `.sceneDepth` to keep LiDAR available
- Video transports (NDI, TCP, UDP, PLY) disconnected in hand mode for consistency with body/face tracking — OSC only on tracking page
- Hand OSC data organized by finger: `/lota/hand/{side}/wrist` (3 floats), `/lota/hand/{side}/thumb` (12 floats), `/lota/hand/{side}/index` (12 floats), `/lota/hand/{side}/middle` (12 floats), `/lota/hand/{side}/ring` (12 floats), `/lota/hand/{side}/pinky` (12 floats)

---

## [1.0.4] - 2026-04-03

### Added
- **Metal compute shader for depth unprojection**: Replaced CPU-side nested loop with a GPU compute kernel (`unprojectDepth`) that processes every depth pixel in parallel. Dispatches over actual depth texture dimensions — no hardcoded resolution assumptions
- **Dynamic ring buffer allocation**: Point cloud ring buffer is lazy-allocated on first depth frame using the actual depth map resolution (`CVPixelBufferGetWidth * Height`). Automatically adapts to any LiDAR hardware without code changes
- **Full depth map sampling**: Every pixel of the 256x192 depth map is now unprojected (previously sampled every 2nd pixel in both axes, discarding ~75% of depth data). ~4x spatial density increase
- **Max Depth setting**: User-configurable maximum LiDAR depth range (1–10m, default 5m) replaces the hardcoded 5.0m filter. Gen 2 devices (iPhone 15/16 Pro, IMX591) can extend to ~10m. Applies to both live point cloud and Gaussian capture
- **Binary PLY encoding**: Optional packed binary wire format for PLY streaming — 4-byte LE count header + 15 bytes/point (3 floats + 3 uint8 RGB). ~40% smaller than CSV text format. Toggle in Settings → Point Cloud Stream → Binary Format (default off)
- **Compute Quality setting**: Segmented picker (Full / Balanced / Efficient) controlling GPU compute frame skip. Full = every frame, Balanced = every 2nd, Efficient = every 3rd. Defaults to Balanced to reduce thermal load
- **Adaptive thermal throttle**: Automatically increases compute frame skip (max 4) when measured FPS drops below 50, recovers when FPS exceeds 55. Hysteresis gap prevents oscillation. Only active in Point Cloud mode
- **Depth change detection**: Compares `CVPixelBuffer` identity between frames to skip redundant compute dispatches. LiDAR hardware runs at 30fps but ARKit interpolates to 60fps — half the frames reuse the same depth buffer. Zero-cost check, zero quality loss
- **TouchDesigner binary receiver**: `tools/td_pointcloud_receiver.py` — high-performance binary point cloud receiver using numpy bulk parsing + Script TOP textures + GPU instancing. Handles 49K+ points at 60fps with ~1–2ms Python overhead

### Changed
- Point cloud unprojection moved from CPU (`writePointsToSlot`) to Metal compute shader (`computePointsGPU`), enabling full depth map sampling at interactive frame rates
- Frame throttle removed from both `MetalRenderer` (was every 3rd frame) and `GaussianRecorder` (was every 3rd frame) — every ARKit frame is now processed
- `GaussianRecorder.extractPoints` now samples every depth pixel (step=1, was step=2)
- `pointCloudMaxPoints` setting removed (was 500–12,500 slider) — replaced by full depth map sampling with Max Depth range control
- Ring buffer slot offset calculation uses dynamic `depthMapPixelCount` instead of hardcoded `pointsPerFrame` constant
- PLY encoder (`PLYEncoder.swift`) now supports both CSV text (`encode`) and packed binary (`encodeBinary`) formats
- Settings UI: "Max Points" slider replaced with "Max Depth" slider; added "Compute Quality" segmented picker; added "Binary Format" toggle under Point Cloud Stream
- Deprecated `td_ply_receiver.py` (CSV/Script SOP) in favor of `td_pointcloud_receiver.py` (binary/GPU instancing)

### Removed
- `pointsPerFrame` hardcoded constant (12,500) — buffer capacity is now derived from depth map resolution at runtime
- `activeMaxPoints` property and `setMaxPoints()` — no longer needed with full depth map sampling
- `pointCloudFrameCounter` — replaced by thermal management frame skip system
- `recordFrameCounter` in `GaussianRecorder` — frame throttle removed

---

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
