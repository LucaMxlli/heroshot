# Heroshot

Drop a screenshot onto a photoreal 3D device and export a high-resolution PNG.

Everything runs in the browser. No backend, no upload — your screenshots never leave your machine.

**Live:** https://heroshot.lucamalli.com

## What it does

- **Five devices**, all built from Three.js geometry at real-world measurements: a 14-inch laptop (31.26 × 22.12 × 1.55 cm), a phone, a watch, a 24-inch all-in-one and a standalone display.
- **Two devices in one shot** — put a phone or watch next to the main device, drag it into place directly in the preview, and give it its own screenshot.
- **26 ready-made scenes** with matching camera angles, plus six one-click looks for background, shadow and finish.
- **Your screenshot renders 1:1** — the display is purely emissive with tone mapping off, so the exported pixels match what you uploaded.
- **Adaptive displays** — the screen can take on the aspect ratio of your image instead of letterboxing it.
- **Export** to Full HD, 2K, 4K, square or a custom size. Transparent backgrounds keep their alpha channel. No editor interface ends up in the image.
- **Scene presets** save and load as JSON so you can reuse or share a setup.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Stack

Next.js, React, TypeScript, Tailwind CSS, Three.js via React Three Fiber and drei, Zustand for state.

## A note on the device models

Every device is generated procedurally from Three.js geometry — rounded extrusions for the bodies, instanced meshes for the keycaps, canvas textures for the key legends and demo screens. Nothing is imported from a third-party 3D model, and no manufacturer logos or wordmarks are reproduced. Proportions follow published product dimensions.

## Licence

MIT
