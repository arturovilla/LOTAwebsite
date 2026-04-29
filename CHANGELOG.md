# Changelog

All notable changes to the LOTA project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.2.1] - 2026-04-29

### Added

- **First-launch onboarding** — `PermissionsIntroView` shows on first cold launch with an app logo, brief copy, four per-permission rows (camera, microphone, speech recognition, location), a green privacy reassurance card explaining LOTA doesn't track or store data, and a Continue button that fires the four OS permission dialogs in sequence. Apple HIG calls for a pre-prompt explainer before the OS dialog cascade — higher grant rates and clearer expectations than firing them cold. Skipped on subsequent launches via `@AppStorage("lota.hasRequestedPermissionsOnce")`
- **Custom logo asset slot** — drop a `LotaLogo` image set into `Assets.xcassets/LotaLogo.imageset/` and the intro screen displays it clipped to a `RoundedRectangle(cornerRadius: 21, style: .continuous)` (Apple's app-icon "squircle" superellipse). Falls back to an SF Symbol if the asset isn't present
- **Background SpeechTranscriber asset prefetch** — once speech permission is granted, `PermissionsBootstrapper.prefetchSpeechModel()` fires a detached `Task` that runs `AssetInventory.assetInstallationRequest(supporting: [transcriber])` and `downloadAndInstall()` for the user's locale. By the time the user opens transcription mode the model is on disk; the previous flow downloaded it lazily on first transcription-mode entry, which delayed first captions and required network at that exact moment. `TranscriptionEngine.startAudioEngineAndTranscriber` keeps its lazy install path as a fallback
- **9-step guided tour** — `TutorialController` + `TutorialOverlay` + `TutorialStep`. Hybrid welcome card → spotlight tour: starts with a centered glass card on the middle page, then dims the live UI and highlights actual elements with a yellow outline + caption pill that flips above/below depending on anchor position. Tap-anywhere advances; Skip button bottom-leading mirrors the transmit button position. Programmatically swipes between pages and switches modes (e.g. enters depth mode for the per-mode-settings step) so the user sees the real UI in context. Auto-runs after the permissions intro on first launch
- **Tour steps**: welcome card → mode picker → mode settings (auto-switches to depth so the button appears) → status bar (transmissions explanation) → performance note about enabling all four protocols → swipe-left ARKit page → swipe-right Capture page → transmit button → end card
- **Replay Tutorial button** — new `Section("Help")` at the bottom of `TransmissionSettingsView` with a `Replay Tutorial` button. Dismisses the sheet, waits 350 ms for the dismiss animation, then calls `tutorial.start()`. Wired through `@EnvironmentObject TutorialController`
- **TutorialAnchor preference key** (`Onboarding/TutorialAnchor.swift`) — `enum TutorialAnchor: Hashable { .modePicker, .modeSettings, .statusBar, .transmitButton }` plus a `.tutorialAnchor(_:)` view modifier that publishes the view's global frame via `TutorialAnchorPreference: PreferenceKey`. The overlay reads anchor frames via `.onPreferenceChange` set on the root TabView in `ContentView`. Anchors are attached to the picker, status pill, mode-settings button, and transmit button on `CameraView` and `ARKitTrackingView`; `GaussianCaptureView` carries the picker anchor for future extension
- **Per-mode settings buttons** — every mode that has mode-specific settings shows a glass `<Mode> Settings` pill (sliders icon + label) just under the status bar. Middle page: Depth, Point Cloud, Blob Track, Transcription, Motion, Audio. ARKit page: Body, Face, Hands. Color and Mono have no per-mode settings, so no button is shown. Driven by `CaptureMode.settingsKind` / `TrackingMode.settingsKind` and presented via a single `.sheet(item: $activeModeSettings)` per page
- **Eight new focused settings sheets** in `Onboarding/ModeSpecificSettings.swift` — `DepthSettingsView`, `PointCloudSettingsView`, `BlobTrackingSettingsView`, `TranscriptionModeSettingsView`, `MotionSettingsView`, `AudioSettingsView`, `BodyTrackingSettingsView`, `FaceTrackingSettingsView`, `HandsTrackingSettingsView`. Each contains only the section(s) relevant to that mode, lifted from the old monolithic Settings sheet
- **TransmissionSettingsView** — new focused sheet with only Receiver, Transport, NDI, OSC, Point Cloud Stream, and Protocol Info sections. Surfaced by tapping the floating status bar pill on the middle or left page (entire pill is now a button via the new `onTap:` parameter on `StatusOverlayView`). Lets the operator verify or adjust receiver IP and per-protocol toggles without wading through the full settings tree
- **EndpointSummary** view (`Views/EndpointSummary.swift`) — small dim monospaced caption block at the bottom of the middle and left pages showing one row per active transmission (`OSC  192.168.1.100:8000`, `TCP  …:9847`, `PLY  …:9848`, `NDI  Broadcasting`). Renders only when streaming is on and at least one of the four protocols is enabled, so the operator can confirm at a glance their settings are pointed at the right machine. Hidden completely when streaming is off
- **TransmissionChips** (`Views/TransmissionChips.swift`) — reusable per-protocol chip strip embedded inside `StatusOverlayView` (middle page) and `trackingStatusView` (left page). One chip per enabled transmission, color-coded: dim white when configured-but-idle, statusLive (red) when actively streaming, statusError (orange) when streaming with a connection problem. The PLY chip is hidden on the ARKit page because tracking-mode forces `.color` and the renderer never enters the point-cloud compute path that fires `onPointCloudFrame`
- **Custom dot-grid mode picker** (`Views/ModePicker.swift`) — `ModePickerTrigger` is a compact glass capsule containing the active mode's SF Symbol next to a `square.grid.3x2.fill` glyph, mirroring the iOS Camera app's "more controls" affordance. Tap opens `ModePickerPanel`, a glass-material rounded panel with a `LazyVGrid` of circular icon buttons (yellow when active, dimmed when disabled, e.g. LiDAR-required modes on a non-LiDAR device). Same pattern across all three pages: 2×4 grid for the 8 capture modes (middle), 1×3 row for the 3 tracking modes (left), 2×3 grid for the 5 export formats (right). Tap-outside-to-dismiss backdrop. No `Menu` or `.popover` involved, so this surface adds zero `_UIReparentingView` warnings
- **NSCameraUsageDescription** added to `Info.plist`. The explicit `AVCaptureDevice.requestAccess(for: .video)` call from `PermissionsBootstrapper` requires the key (ARKit historically tolerated its absence)

### Changed

- **Status bar redesigned as a floating pill on the middle page** (`StatusOverlayView`) — was a full-width bar with FPS on the left and LiDAR on the right separated by a `Spacer()`. Now an auto-sized HStack of `Label` chips with rounded `.a11yBackground` (matches the right-page counter pill), centered horizontally and growing as more transmission protocols are enabled. Shows FPS, LiDAR status, mode-conditional chips (LISTENING / IMU / AUDIO / blob count), and one chip per enabled transmission protocol
- **Mode picker positioned consistently across all three pages** — the picker is now the first VStack child on every page (was below `StatusOverlayView` on the middle page). When you swipe between pages the picker stays at the same Y coordinate, which feels seamless
- **Material Settings button moved up** — was inside `MaterialCaptureContent` (rendered lower in the screen with the plane-status icon and Lock Plane button). Moved to the top of `GaussianCaptureView`'s VStack, just below the status pill and above the "Point at a flat surface…" tip text. Same `ModeSettingsButton` style as every other mode now uses
- **Bottom-left gear button removed** from middle and left pages. Settings are now reachable via two routes: tap the status bar (transmission protocols) or tap the per-mode settings button (mode-specific settings). The full monolithic `SettingsView` is unreachable, so its file was deleted
- **Every existing dropdown replaced with the new dot-grid picker pattern** — three `Menu`-based dropdowns (one per page) removed in favor of `ModePickerTrigger` + `ModePickerPanel`. Per-mode caption text below the trigger removed (the active mode's icon in the trigger pill carries that information, and the mode picker's panel cells carry their own labels)
- **Audio mode lane positions** — audio waveforms (BASS/MID/HIGH) had their baselines at lane bottoms with HIGH cut off behind the bottom UI buttons. The graph renderer maps a value to a Y position via the lane's value range; IMU ranges are symmetric (`-2..2` for accel) so a still device's `0` lands at lane center, but audio ranges were unipolar (`0..1`) so silent input (`0`) landed at lane bottom. Changed all audio ranges (`BASS`, `MID`, `HIGH`, `DL`, `DM`, `DH`, `BURST`) and the FFT-band fallback from `(0, 1)` to `(-1, 1)`. Silent baseline now sits at lane center matching IMU; loud peaks still grow upward to lane top; the bottom half of each lane becomes unused headroom (audio is non-negative)
- **`enterTrackingMode()` now routes through `setMode(.color, haptic: false)`** — the renderer state (mono/depth/point cloud/blob/transcription/motion/audio) used to bleed through to the ARKit tracking page and sit underneath the skeleton/face/hand overlays. Worse, mic-driven modes (transcription/motion/audio) kept their engines running across the page swipe. Routing through `setMode` resets the renderer to color and tears down any auxiliary engine via the existing per-mode lifecycle teardown branches
- **`setMode` gains an optional `haptic: Bool = true` parameter** so internal callers (`enterTrackingMode`, tutorial mode-switch side effects) can suppress the haptic that fires on explicit dropdown selection
- **Transmission chip color logic** — chips now render dim white at 55% opacity when configured-but-idle and switch to `Color.statusLive` (red) when streaming starts, or `Color.statusError` (orange) on connection error. Previously the chips stayed full opacity and a separate red `LIVE / statusText` chip appeared at the end of the bar — duplicate signal. The standalone live chip and `streamingStatusLabel` helper were removed
- **`ContentView` now hosts the tutorial overlay and permissions cover** — `@StateObject TutorialController`, `@AppStorage` flags for `hasRequestedPermissionsOnce` and `hasSeenTutorial`, `@State anchorFrames` populated via `.onPreferenceChange(TutorialAnchorPreference.self)`. `.fullScreenCover` for the permissions intro on cold launch, `.overlay { TutorialOverlay(...) }` driven by `tutorial.isActive`, `.environmentObject(tutorial)` so `TransmissionSettingsView` can find it. `.onChange(of: tutorial.isActive) { wasActive, isActive in }` flips `hasSeenTutorial` to true the first time the tour dismisses (skip or completion both qualify; force-quitting mid-tour leaves the flag false so the next cold launch re-presents it)
- **`TutorialController.stop()` resets to `.color` mode on dismissal** so the user lands somewhere predictable; the mode-settings tutorial step (which auto-switches to depth) doesn't leave the app in an unexpected state when skipped

### Fixed

- **Renderer flicker on dropped depth frames** — Depth, Point Cloud, and Blob Track modes flickered back to color whenever ARKit dropped a frame's `.sceneDepth` (common for the first 1–10 frames after any `arSession.run(config)` reconfigure, and occasionally under thermal/CPU pressure). The four `drawDepth` / `drawPointCloud` (×2) / `drawBlobTracking` paths in `MetalRenderer` had `drawCamera` fallbacks that visibly flashed the color feed in place of the expected visualization. Replaced with a plain `return` — the previously presented frame stays on screen for that tick. At 60 Hz a single skipped frame is invisible; no risk of leaking drawables since Metal handles unpresented drawables on its own. Also removed a redundant `renderer?.captureMode = .color` from the `.face` branch of `reconfigureSession` — `enterTrackingMode`'s new `setMode(.color)` call covers it
- **PLY transmission visibly suppressed on the ARKit page** — the PLY chip is hidden in the status bar (`TransmissionChips` takes a `showPLY: Bool` flag) and the PLY row is hidden in the bottom endpoint summary (`plyStreamEnabled: false` passed in from the left-page call site). PLY data was already not transmitted on the tracking page (since `setMode(.color)` keeps the renderer out of the point-cloud compute path that fires `onPointCloudFrame`), but the UI implied it was

### Removed

- **`Views/SettingsView.swift`** — deleted. The old monolithic Settings sheet is replaced by `TransmissionSettingsView` (transmission protocols only, opened by tapping the status bar) plus per-mode focused sheets (`DepthSettingsView`, `PointCloudSettingsView`, `BlobTrackingSettingsView`, `TranscriptionModeSettingsView`, `MotionSettingsView`, `AudioSettingsView`, `BodyTrackingSettingsView`, `FaceTrackingSettingsView`, `HandsTrackingSettingsView`, opened via the per-mode `ModeSettingsButton`). The bottom-left gear button on the middle and left pages goes away with it; the bottom-bar HStack on those pages is now just the streaming/transmit button on the right (and the small tracking-mode label centered on the left page)

---

## [1.2.0] - 2026-04-23

### Added

- **Material Capture mode**: New `.material` option in the Gaussian Capture page's format dropdown (sits alongside COLMAP, Nerfstudio, Nerfstudio + Depth, Point Cloud). Captures a flat surface from one flash photo pair + LiDAR depth, runs through Apple's GPU compute pipeline, and exports a complete PBR material set as a single ZIP — ready to drop into Substance Designer/Painter, Blender, Unreal, Unity, TouchDesigner, or any PBR-aware DCC. Requires LiDAR
- **PBR map set in the export ZIP** (5 PNGs + manifest):
  - `basecolor.png` — sRGB 8-bit albedo, white-balanced and de-lit via flash-pair specular subtraction
  - `normal.png` — linear 8-bit tangent-space normal from depth gradient (OpenGL or DirectX convention selectable)
  - `height.png` — linear 16-bit, plane-relative ±25 mm range mapped to UInt16
  - `ao.png` — linear 8-bit horizon-based ambient occlusion baked from height
  - `roughness.png` — linear 8-bit per-texel estimate from flash-pair specular sharpness, with user-adjustable scale slider
  - `preview.png` — sRGB 8-bit Cook-Torrance BRDF sphere render of the captured material
  - `material.json` — manifest carrying `planeMeters`, `tilingHintFor1mSquare`, normal convention, roughness method + userScale, metallic uniform value, device hardware identifier, LiDAR generation, capture date, gyro drift between flash pair
- **Five Metal compute kernels in `Shaders.metal`** (~210 lines): `delightFlashPair` (basecolor + intermediate specular), `roughnessFromSpecular` (local sharpness heuristic), `normalFromDepth` (central-difference depth gradient), `aoBake` (horizon-based AO), `pbrSpherePreview` (Cook-Torrance BRDF sphere via screen-space ray-sphere intersection). Plus `orthoSampleHomography` for orthorectifying the framing patch and a `jointBilateralUpsample` helper. All dispatched in a single command buffer (~220 ms total at 1024² with 64 AO samples on iPhone 15/16 Pro)
- **Closed-form 4-point homography solver** — `Homography.fromUnitSquare(toQuad:)` in `PBRMapBaker.swift` projects the framing rect's 4 corners into image pixel space and solves the 3×3 mapping in pure Swift, no Accelerate dependency
- **Plane lock UX**: ARKit raycast detects horizontal and vertical planes; tap **Lock Plane** to snap to the candidate. Auto-installs a 20 cm screen-aligned square patch centered on the camera's look-point (raycast camera-forward → plane intersection), oriented so output "right" = camera's right and output "top" = away from camera
- **Material Settings sheet** (gear button on the capture page) — output resolution (512/1024/2048), AO sample count (32/64/128), normal convention (OpenGL/DirectX), delight strength slider, roughness scale slider; all persisted via `UserDefaults`
- **Material Save Summary sheet** — embedded PBR sphere preview on a clear background, metallic toggle (manifest-only in v1.2), file-size estimate, Save button with a phase machine (configuring → saving → saved/failed), 1.5 s auto-dismiss after successful save
- **Autofocus locked during the flash-pair grab** — `AVCaptureDevice.focusMode = .locked` before the flash-off frame, restored to `.continuousAutoFocus` after the flash-on frame, so the two grabs share the same focal distance and the delight + roughness signals stay registered
- **Haptic feedback on shutter tap** — `UIImpactFeedbackGenerator(style: .medium)` so the capture feels acknowledged before the bake spinner appears
- **`MaterialRecorder.swift`** — state machine (searching → detected → locked → framed → capturing → baking), torch sequencing, depth+pose snapshot at the flash-on instant, gyro drift check via quaternion difference between the two camera poses
- **`PBRMapBaker.swift`** — nonisolated orchestrator that runs the full bake off the main actor (~220 ms at 1024² / 64 AO). Polling-based command-buffer completion (5 ms `cb.status` poll) since `addCompletedHandler` was unreliable in this environment
- **`PBRMapExporter.swift`** — encodes 6 PNGs (preserving 16-bit depth for the height map), builds the JSON manifest with device + capture metadata, bundles into ZIP via ZIPFoundation
- **`PBRSphereView.swift`** — lightweight `Image`-based sphere preview that composites onto whatever background it's embedded in (clear by design, so the summary sheet's background shows through)
- **`MaterialState.swift`** — transient ObservableObject sibling to `GaussianRecorder`. Owned by `CaptureManager`, observed by `GaussianCaptureView`, so plane status / framing rect / baked maps don't leak between `MaterialRecorder` and the view layer
- **`MaterialCaptureContent.swift`** — material-mode subview of `GaussianCaptureView` with status icon, plane-status-driven action area (Lock Plane / Unlock), Material Settings sheet trigger, baking progress chip
- **`LOTABinaryPLYReceiverV2.tox`** TouchDesigner component — simpler drop-in receiver for binary PLY streaming. The original `LOTABinaryPLYReceiver` required manual configuration of frame parsing parameters; v2 auto-detects the binary header and exposes only the receiver port and Script TOP target. Available at the [LOTA docs page](https://lidarota.app)

### Changed

- `ExportFormat` enum gains `.material` case + new `isSingleShot: Bool` flag (cleaner than overloading `needsPoses` for capture-mode UX branching — also leaves room for future single-shot formats like SHARP Splat in v1.3)
- `GaussianRecorder` defensively rejects `.material` in `startRecording` and `stopRecording` — material capture goes through `MaterialRecorder` + `PBRMapBaker`, never `GaussianRecorder`
- `GaussianCaptureView` body branches on `exportFormat == .material`: format-aware top counter row (keyframe/point counters for 3D-scene formats, plane-status chip + framing dimensions for material), bottom button morphs between red toggle-record and a shutter button keyed on `format.isSingleShot`. `.onChange(of: exportFormat)` resets material state on every format switch
- ARKit world-tracking config now always enables `[.horizontal, .vertical]` plane detection (used by Material; ignored by other modes — minor CPU cost on modern A-chips)
- `MetalRenderer` gains 7 new pipeline slots (delight, roughness, normalFromDepth, aoBake, jointBilateralUpsample, orthoHomography, pbrSphere render). Internal access so `PBRMapBaker` can dispatch them
- `StreamingSettings` gains 6 persisted material-capture properties (resolution, normal convention, AO sample count, delight strength, roughness scale, default metallic) plus a `NormalMapConvention` enum
- `CaptureManager` holds `materialState` + `materialRecorder` + `pbrMapBaker`. New `setTorch(_:)` and `setAutoFocus(_:)` helpers wire `AVCaptureDevice` configuration to closures injected on `MaterialRecorder`. New `nextFrame()` async helper resolves a continuation from the next session-delegate callback, gated on `hasPendingFrameAwaiter` so we don't dispatch a Task per ARFrame
- **Binary PLY format is now the recommended path.** The user guide and TouchDesigner companion documentation only document the binary receiver going forward (see Deprecated)

### Fixed

- **Page swipes are now blocked while streaming is active.** Previously, swiping the TabView mid-stream could tear down the active session and leave receivers stuck. Now matches the existing UX where the Settings button is also disabled while streaming
- **ARFrame retention warnings during Material capture.** The session delegate's per-frame `Task { @MainActor }` dispatches were piling up faster than the main actor could drain them, tripping ARKit's "delegate is retaining N ARFrames" backpressure warning and eventually causing the camera to stop delivering frames (followed by `<<<< FigCaptureSourceRemote >>>>` errors and SIGKILL). Three layered fixes: (1) extract plane info into a value-type `DetectedPlaneInfo` instead of holding `ARPlaneAnchor` refs in pending Tasks; (2) only publish `state.lockedPlaneTransform` / `lockedPlaneExtent` on actual state transitions, not on every frame; (3) `MaterialRecorder.processFrame` early-returns synchronously when the locked plane is still in `frame.anchors` — no Task hop, no main-actor work. The steady state during a Material capture (locked → framed → baking) now does zero per-frame main-actor dispatches
- **Bake hung at `addCompletedHandler`.** The completion handler reliably failed to fire even after `cb.status` reached `.completed` — verified by polling. Replaced with a 5 ms `cb.status` polling loop in `waitForCompletion`. Bake now reliably completes in ~220 ms
- **`PBRMapBaker` is nonisolated**, not `@MainActor`. The `CIContext.render` YUV→BGRA conversions (~100–200 ms each at 1920×1440) and command-buffer encoding were blocking the main actor synchronously, causing the ARFrame retention buildup above. New `PBRBakeParams` value struct gets pulled from `StreamingSettings` on the main actor before the nonisolated bake runs
- **Depth texture is now copied** into a fresh `MTLTexture` instead of CV-wrapped from ARKit's pool. The shared `CVPixelBuffer` caused implicit dependency on ARKit's depth-pool lifecycle, which prevented the GPU completion handler from firing. The ~200 KB copy at upload time decouples our pipeline entirely
- **Framing rect alignment in baked output.** The rect was previously inheriting ARKit's arbitrary plane-local axes, producing tilted output (wood planks at ~15° angles, etc.). Now the rect's two axes are computed from the camera's right + forward directions projected onto the plane and orthogonalized — so output "top" = away from camera, "right" = camera's right
- **Edge streaking in baked maps.** The 60% min-extent framing rect could project well beyond the camera's visible image area at oblique angles, causing `clamp_to_edge` sampling to repeat the rightmost/bottommost pixels as horizontal/vertical streaks. Now the rect is centered on the camera's look-point (raycast intersection) and capped at 20 cm side length, keeping the projected corners well inside the camera image
- **SF Symbol typo** `square.grid.3x3.square.fill` → `square.grid.3x3.square` in `MaterialCaptureContent`

### Deprecated

- **CSV (text) PLY streaming is deprecated and will be removed in a future update.** Binary PLY format is ~40% smaller, parses faster on the receiver, and the new `LOTABinaryPLYReceiverV2.tox` TouchDesigner component makes the binary path easier to integrate than the CSV one. Non-binary PLY remains functional for backwards compatibility but the user guide and TouchDesigner companion components only document the binary path going forward. The "Binary Format" toggle in Settings → Point Cloud Stream is the recommended setting for all new captures

---

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
- **Audio Beat Detection** — per-band onset detection with state-of-the-art algorithm combining log-magnitude spectral flux + one-pole smoothing (~15Hz cutoff) + peak-picking (local maxima) + variance-adaptive threshold (`mean + k·stddev` where `k` is inversely modulated by coefficient of variation) + 20th-percentile noise-floor tracking + silence energy gate + 50ms minimum inter-onset time. Output is a **binary switch (0 or 1)** that holds at 1.0 for 50ms after each hit — TouchDesigner-friendly for Trigger CHOP routing:
  - `/lota/audio/drums/low` — low-band beat trigger (kicks, bass hits)
  - `/lota/audio/drums/mid` — mid-band beat trigger (snares, claps, vocals)
  - `/lota/audio/drums/high` — high-band beat trigger (hi-hats, cymbals)
- **Audio Dynamics** — `/lota/audio/burst` — fast-vs-slow envelope difference, normalized 0–1, pulse-shaped output (rises instantly on transient, decays over ~200ms)
- **Audio FFT Spectrum** — 20 log-spaced frequency bands across 20–20,000 Hz, each normalized 0–1 via per-bin rolling max. `/lota/audio/fft/0` through `/lota/audio/fft/19`
- **Scrolling line graph visualization** for both Motion and Audio modes — TouchDesigner CHOP viewer aesthetic. One lane per active value, stacked vertically with dynamic sizing. Colored lines scroll left as new samples arrive. Each lane has a dim center line, separator line, and colored glyph label at the right edge following the line's current Y position. Metal-rendered, captured by NDI
- **Smooth sub-sample scroll animation**: classic oscilloscope trick — between sample arrivals, the graph slides left by a fractional sample-width based on elapsed time. Eliminates the "choppy steps" visible at 30Hz data + 60fps render. Works identically for Motion and Audio modes
- **Thread-safe ring buffer access** in Motion + Audio engines and renderer — `NSLock`-protected snapshots with generation counters so stale handler callbacks after mode switches or sensor toggles become no-ops (prevents data race crashes)
- **Debounced sensor toggle restarts** — when a user flips a sensor/channel toggle while in Motion or Audio mode, the engine restarts 50ms later so multiple rapid toggles produce a single restart (prevents crash-loop from rapid TCC requests)
- **Upfront permissions flow** — when the user selects Motion mode, location permission (for compass heading) is requested immediately via a system dialog. When the user selects Audio mode, microphone permission is requested immediately. If denied, a clear overlay with "Open Settings" deep-link appears. Prevents the mid-session permission prompts that happened when toggling individual sensors
- **`NSMotionUsageDescription`** and **`NSLocationWhenInUseUsageDescription`** added to `Info.plist` — fixes TCC-enforcement crash (`__abort_with_payload` on `com.apple.tcc.kTCCServiceMotion`) that occurred when `CMMotionManager.startDeviceMotionUpdates()` was called directly without the usage description (ARKit's internal CoreMotion use goes through a different TCC path, so initial launch worked; direct use on sensor toggle crashed)
- **`GlyphAtlas` character set expansion** — baked glyph set expanded from `#0123456789` to `#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ` so graph lane labels (`BASS`, `MID`, `HIGH`, `DL`, `DM`, `DH`, `BURST`, `F0`–`F19`, `AX`, `AY`, `AZ`, `GX`, `GY`, `GZ`, `HD`, `PR`, `AL`) render correctly. Atlas bake code unchanged — just a larger `characters:` string at the call site
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
