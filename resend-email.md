Subject: What's new in LOTA — Docs, TouchDesigner component, ARKit & more

---

Hey there,

Thank you for being part of the LOTA beta. Your feedback has been incredibly insightful and has directly shaped the direction of the app.

Here's what's new:

### Documentation

The site now has a full **docs page** covering capture modes, streaming setup, TouchDesigner integration, 3D export workflows, and accessibility features. If you've ever wondered how to wire things up — it's all there now.

[Read the docs →](https://lidarota.app/docs)

### LOTAPoints.tox — Drop-in TouchDesigner Component

We built a custom TouchDesigner component called **LOTAPoints.tox** that handles PLY point cloud streaming out of the box. Drop it into any project — it defaults to port **9848** and just works. No scripting, no manual DAT wiring.

Available for download on the docs page under the TouchDesigner section.

[Download LOTAPoints.tox →](https://lidarota.app/docs#touchdesigner)

### ARKit Body & Face Tracking (Coming Soon)

The site now showcases an upcoming feature: **ARKit integration** with real-time body tracking (91 joints) and face capture (52 blend shapes), all streamed over OSC. This should be available to beta testers soon — pending Apple review.

[See it on the site →](https://lidarota.app/#arkit)

### Changelog

We've added a **changelog** to the site so you can follow every update as it ships. New features, changes, and fixes — all in one place.

[View the changelog →](https://lidarota.app/changelog)

---

Thanks again for testing LOTA and helping us make it better. More updates coming soon.

— Arturo

[Instagram](https://instagram.com/YOUR_HANDLE) · [Patreon](https://patreon.com/YOUR_HANDLE) · [Reddit](https://reddit.com/r/YOUR_SUBREDDIT)

---

---

Subject: LOTA 1.0.4 — GPU point clouds, binary streaming & full App Store release coming mid-April

---

Hey there,

Big update — LOTA 1.0.4 is here, and it's the biggest performance jump since launch. This build will be available to beta testers in the next few days.

We're also targeting a **full App Store release in mid-April**. If you've been following along, this is the home stretch.

Here's what's in 1.0.4:

### GPU-Accelerated Point Clouds

Point cloud unprojection has moved from the CPU to a **Metal compute shader**. Every pixel of the 256x192 LiDAR depth map is now processed in parallel — that's a **~4x increase in spatial density** compared to previous builds, which sampled every 2nd pixel and discarded ~75% of depth data.

### Max Depth Control

The old "Max Points" slider is gone. In its place: a **Max Depth setting** (1–10m) that lets you control how far the LiDAR reaches. Gen 2 devices (iPhone 15/16 Pro) can push out to ~10m. Applies to both live point cloud and Gaussian capture.

### Binary PLY Streaming

A new optional **binary wire format** for PLY streaming — 4-byte header + 15 bytes per point (3 floats + 3 uint8 RGB). ~40% smaller than the CSV text format. Toggle it on in Settings → Point Cloud Stream → Binary Format.

### New TouchDesigner Receiver

**LOTABinaryPLYReciever.tox** — a high-performance binary point cloud receiver that uses numpy bulk parsing, Script TOP textures, and GPU instancing. Handles **49K+ points at 60fps** with ~1–2ms Python overhead. Available for download on the docs page.

[Download LOTABinaryPLYReciever.tox →](https://lidarota.app/docs#touchdesigner)

### Smart Thermal Management

New **Compute Quality** picker (Full / Balanced / Efficient) to control GPU frame skip, plus an **adaptive thermal throttle** that automatically backs off when the device gets hot and recovers when it cools down. No more manual tuning.

### Depth Change Detection

LOTA now detects when ARKit reuses the same depth buffer between frames (LiDAR runs at 30fps, ARKit interpolates to 60fps) and skips redundant compute dispatches. Zero quality loss, less heat.

[Full changelog →](https://lidarota.app/changelog)

---

**Want to join the beta?** DM me directly and I'll send a TestFlight link. Looking for people working with TouchDesigner, live visuals, 3D capture, or motion tracking who want to push this forward.

**Already in the beta?** 1.0.4 will land in TestFlight in the next few days. Keep the feedback coming — it's been shaping every release.

Thanks for being part of this.

— Arturo

[Instagram](https://instagram.com/hyprtexture) · [Patreon](https://patreon.com/hyprtexture) · [Reddit](https://www.reddit.com/user/lpyonderboy/) ·
[lidarota.app](https://lidarota.app) · [Docs](https://lidarota.app/docs) · [Changelog](https://lidarota.app/changelog)
