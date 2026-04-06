LOTA 1.0.5: Hand tracking.

Detect both hands in real time using Apple's Vision framework. 21 landmarks per hand, every finger joint, knuckle, and wrist, streamed over OSC at 30 Hz. Just point your iPhone's rear camera at your hands.

What's new:
- Hand tracking — 2 hands, 21 landmarks each, organized by finger (/lota/hand/left/thumb, /index, etc.)
- 2D/3D coordinate toggle — 2D works on all iPhones, 3D projects into world space using LiDAR depth
- Live hand overlay with color-coded bones (teal = left, orange = right)
- Depth confidence filtering — GPU compute kernel filters noisy edge pixels before unprojection
- NDI depth side-by-side streaming — camera + depth colormap in a single 2x-wide frame for TouchDesigner and Notch

Full App Store release coming mid-April.

Want to join the beta? DM me and I'll send a TestFlight link, looking for people working with TouchDesigner, live visuals, interactive installations, or gesture-driven interfaces.

Already in the beta? 1.0.5 lands in TestFlight in the next few days.

Full changelog: https://lidarota.app/changelog
Docs + TouchDesigner downloads: https://lidarota.app/docs#touchdesigner
Site: https://lidarota.app
