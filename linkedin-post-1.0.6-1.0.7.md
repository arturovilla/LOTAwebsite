LOTA 1.0.6 + 1.0.7: Smarter capture, cleaner UI.

Gaussian Capture got a complete rework. Instead of dumping every frame into a dataset, LOTA now watches how you move — only saving keyframes where the camera has shifted at least 5cm or rotated ~5 degrees. Blurry frames are automatically rejected. A 30-second scan produces ~80 well-distributed views instead of ~900 redundant ones.

What's new:

Capture intelligence (1.0.6):
- Keyframe selection — only saves frames that matter for 3D reconstruction
- Blur detection — Laplacian variance filter rejects motion-blurred frames automatically
- Auto focus lock — focal length stays fixed during recording so camera intrinsics don't drift
- ARKit mesh wireframe — see scanned surfaces build up in real time as semi-transparent triangles (cyan near, purple far)
- ZIP export — captures compress into a single .zip, ready for iCloud sync or AirDrop
- Haptic feedback on every keyframe capture
- Live recording timer + keyframe/point counters

Unified UI (1.0.7):
- Mode selector is now a consistent dropdown across all three pages
- Bottom bar simplified to Settings (left) and Streaming toggle (right)

Full App Store release coming mid-April.

Want to join the beta? DM me and I'll send a TestFlight link — looking for people working with 3D scanning, Gaussian Splatting, NeRFs, or spatial capture workflows.

Already in the beta? 1.0.6 + 1.0.7 land in TestFlight in the next few days.

Full changelog: https://lidarota.app/changelog
Docs: https://lidarota.app/docs
Site: https://lidarota.app
