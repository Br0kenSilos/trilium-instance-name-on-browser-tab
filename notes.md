# Developer Notes — Trilium Instance Name on Browser Tab

This file contains internal notes, design choices, future ideas, and known quirks encountered during development of the script.

This file is not required for end users and is meant primarily for the project author (Br0kenSilos).

---

## Purpose of This Script

This script was created to solve one specific problem:

> When running multiple Trilium server instances in different browser tabs, it's difficult to tell which tab belongs to which instance.

This script provides:
- A clear bold prefix in the tab title
- An optional border around the app
- An optional custom favicon

It is intentionally simple, browser-side only, and easy to customize.

---

## Known Quirks / Behavior Notes

### 1. Attribute Must Be Created Via the "+" Button
Typing `#run=frontendStartup` into the note body does **not** always work.  
The attribute must be created using the Attributes sidebar:

- Name: `run`  
- Value: `frontendStartup`

Users may run into this issue; clarified in the README.

---

### 2. Desktop App Also Shows Border
When using the Trilium **desktop client** connected to a remote server instance where this script is installed:

- The border appears around the desktop window too  
- This is because the script runs inside the embedded Chromium engine

Possible mitigations:
- Disable the border for that instance (`USE_BORDER = false`)
- Create a desktop-specific variant of the config

Noted in the README.

---

## Feature Ideas / Future Enhancements (Optional)

These are not commitments—just thoughts for later:

- Add screenshots to README after spinning up mock instances
- Optional icon pack instead of the generated favicon
- Allow per-window corner “accent marker” instead of full border
- Add a debug mode that logs errors or events to console
- Combine the color prefix and favicon into a single config object
- Create a hosted demo or GIF preview

---

## Version Notes

### v1.0.0
- Initial public release
- Tab prefix, border, and favicon all implemented
- README + LICENSE + full instructions created

---

## Development Notes (Internal)

- Script is intentionally browser-only (frontend), no server code
- Keeping code modular makes it easy to extend later
- Script avoids external dependencies for portability
- Favicon is dynamically generated via data URI SVG
- All bold text conversion is Unicode-based to avoid font issues

---

## Misc Thoughts

- Script works across multiple browsers (Chrome, Firefox, Edge)
- User feedback may require simple troubleshooting updates
- Could eventually submit to Trilium community scripts if desired
