// trilium-instance-identity.js
// Author: Br0kenSilos
// Assistance: ChatGPT
// License: MIT
//
// This script adds a clear per-instance visual identity to Trilium Notes by:
// - Prefixing the browser tab title with a bold instance label
// - Optionally generating a custom favicon (color + letter)
// - Optionally drawing a colored border around the app
//
// It is intended for users who run multiple Trilium instances in the same
// browser and want to quickly distinguish which tab belongs to which instance.
//
// Installation & configuration: see README.md in this repository.
//
// You must change the INSTANCE NAME below the PREFIX_TEXT section to whatever the name of your instance is. 
// The Instance Name can be what you want and DOES NOT have to match instancename from the config.ini of the instance
// Then you MUST set the Owned Attribute to: #run=frontendStartup to get it to apply. Note that you cannot always
// get away with just copying an pasting "#run=frontendStartup" into the attributes. 
// Sometimes Trilium is fickle about this so you 
// 
// Installation Steps
//
// 1) Create a new note and set the type to "JS frontEnd"
// 2) Add "#run=frontendStartup" properly.
// This is the “make it run automatically” step, and it’s the picky one.
//
// With the script note selected, open Owned Attributes.
// Click Add attribute → Label.
// In Name, type: run
// In Value, type: frontendStartup
// Save / close.


// ==== CONFIG PER INSTANCE ====
// Type this in NORMAL letters. Script will bold it for you.
const PLAIN_PREFIX_TEXT = "INSTANCE NAME";   // will show as [𝗜𝗡𝗦𝗧𝗔𝗡𝗖𝗘 𝗡𝗔𝗠𝗘] in the tab
const COLOR             = "#1e88e5";       // border + favicon background
const LETTER            = "C";               // favicon letter (ASCII)
const LETTER_COLOR      = "#ffffff";       // favicon letter color
const USE_FAVICON       = true;              // false = keep Trilium's default icon
const USE_BORDER        = true;              // false = no border
const BORDER_THICKNESS  = 6;                 // border thickness in pixels
// =============================

// Map A–Z to bold Unicode versions. This section converts the plain text lettering of the Instance Name to BOLD lettering.
const BOLD_MAP = {
  "A":"𝗔","B":"𝗕","C":"𝗖","D":"𝗗","E":"𝗘","F":"𝗙","G":"𝗚",
  "H":"𝗛","I":"𝗜","J":"𝗝","K":"𝗞","L":"𝗟","M":"𝗠","N":"𝗡",
  "O":"𝗢","P":"𝗣","Q":"𝗤","R":"𝗥","S":"𝗦","T":"𝗧","U":"𝗨",
  "V":"𝗩","W":"𝗪","X":"𝗫","Y":"𝗬","Z":"𝗭",
  "a":"𝗮","b":"𝗯","c":"𝗰","d":"𝗱","e":"𝗲","f":"𝗳","g":"𝗴",
  "h":"𝗵","i":"𝗶","j":"𝗷","k":"𝗸","l":"𝗹","m":"𝗺","n":"𝗻",
  "o":"𝗼","p":"𝗽","q":"𝗾","r":"𝗿","s":"𝘀","t":"𝘁","u":"𝘂",
  "v":"𝘃","w":"𝘄","x":"𝘅","y":"𝘆","z":"𝘇",
  "0":"𝟬","1":"𝟭","2":"𝟮","3":"𝟯","4":"𝟰",
  "5":"𝟱","6":"𝟲","7":"𝟳","8":"𝟴","9":"𝟵"
};

function toBold(str) {
  return String(str || "")
    .split("")
    .map(ch => BOLD_MAP[ch] || ch)
    .join("");
}

// This is what actually gets shown in the tab:
const PREFIX_TEXT = toBold(PLAIN_PREFIX_TEXT);

(function () {

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // --- Create favicon (ASCII-safe) ---
  function setFavicon(bgColor, letter, letterColor) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <rect width="64" height="64" fill="${bgColor}"/>
        <text x="50%" y="50%" font-size="42"
              fill="${letterColor}"
              text-anchor="middle" dy=".35em"
              font-family="Arial, Helvetica, sans-serif"
              font-weight="900">
          ${letter}
        </text>
      </svg>
    `;
    const url = "data:image/svg+xml;base64," + btoa(svg);

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;
  }

  // --- Add colored border overlay ---
  function addBorderOverlay(color, thickness) {
    const id = "instance-border-overlay";
    if (document.getElementById(id)) return;

    const overlay = document.createElement("div");
    overlay.id = id;

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      border: `${thickness}px solid ${color}`,
      pointerEvents: "none",
      zIndex: "9999",
      boxSizing: "border-box"
    });

    document.body.appendChild(overlay);
  }

  // --- Title handling ---
  const clean = (t) => {
    t = String(t || "");
    // remove any existing [XYZ] prefix
    t = t.replace(/^\[[^\]]+\]\s+/, "");
    // strip duplicate plain prefix if user named notes like "CSG NOTES ...":
    const regexPlain = new RegExp("^" + PLAIN_PREFIX_TEXT + "\\s*", "i");
    t = t.replace(regexPlain, "");
    // remove trailing " - Trilium", etc.
    t = t.replace(/\s*[-–—|]\s*Trilium(?:\s*(?:Notes|Next))?\s*$/i, "");
    return t.trim();
  };

  const desc = Object.getOwnPropertyDescriptor(Document.prototype, "title");
  const origGet = desc && desc.get;
  const origSet = desc && desc.set;

  if (desc && desc.configurable && origGet && origSet) {
    Object.defineProperty(document, "title", {
      get() { return origGet.call(this); },
      set(v) {
        const bare = clean(v);
        const want = `[${PREFIX_TEXT}] ` + bare;
        if (origGet.call(this) !== want) {
          origSet.call(this, want);
        }
      },
      configurable: true
    });

    // Apply prefix immediately
    const bareInit = clean(origGet.call(document));
    origSet.call(document, `[${PREFIX_TEXT}] ` + bareInit);
  }

  // Apply favicon + border after DOM loads
  onReady(() => {
    if (USE_FAVICON) setFavicon(COLOR, LETTER, LETTER_COLOR);
    if (USE_BORDER)  addBorderOverlay(COLOR, BORDER_THICKNESS);
  });

})();
