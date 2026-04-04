LOTA 1.0.4 — the biggest performance update yet.

Point cloud unprojection now runs on a Metal compute shader. Every pixel of the LiDAR depth map is processed in parallel — that's a ~4x increase in spatial density over previous builds.

What's new:
- GPU-accelerated point clouds via Metal compute
- Max Depth control (1–10m) replacing the old Max Points slider
- Binary PLY streaming — ~40% smaller than text format
- New high-performance TouchDesigner receiver (49K+ points at 60fps)
- Smart thermal management with adaptive throttling
- Depth change detection to skip redundant frames

Full App Store release coming mid-April.

Want to join the beta? DM me and I'll send a TestFlight link — looking for people working with TouchDesigner, live visuals, 3D capture, or motion tracking.

Already in the beta? 1.0.4 lands in TestFlight in the next few days.

Full changelog: https://lidarota.app/changelog
Docs + TouchDesigner downloads: https://lidarota.app/docs#touchdesigner
Site: https://lidarota.app
