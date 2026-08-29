# Comprehensive UI/UX Design System Specification (`uiissue.md`)

**Role**: Principal UI/UX & Design Systems Architect  
**Design Paradigm**: High-Precision Enterprise Brutalism & Swiss International Typographic Style  
**Core Rules**: $0\text{px}$ Border Radius (`rounded-none`), Mathematical 8pt Grid, High-Contrast Monochromatic Canvas with 4 Strict Functional Pipeline Accents, Fluid GSAP Animation Choreography.

---

## 1. Executive UI/UX Audit & Layout Diagnosis

### 1.1 Structural Layout Diagnosis

```
+---------------------------------------------------------------------------------------------------------+
| [HEADER BAR] 64px Height | Brand + 101-Node Badge | Search | 5 Filter Pills | New Campaign | Dashboard  |
+------------------------------------------------------------------------------------+--------------------+
|                                                                                    |                    |
|  [LAYOUT TOGGLE] Top-Left 16px Floating Dock                                       | [LIVE EVENT STREAM]|
|                                                                                    | 360px Fixed Width  |
|                       +-----------------------------------+                        | Top-to-Bottom Feed |
|                       |    ADMIN INTELLIGENCE MASTER      |                        | 100% Height        |
|                       |    Centered X=1476, Y=60 (420px)  |                        | Solid 2px Border   |
|                       +-----------------+-----------------+                        |                    |
|                                         |                                          |                    |
|      +----------------------------------+----------------------------------+       |                    |
|      |                  |                               |                  |       |                    |
|  +-------+          +-------+                       +-------+          +-------+   |                    |
|  | 30 ML |          |30 PYT |                       |30 GROQ|          |10 QML |   |                    |
|  | (3x10)|          | (3x10)|                       | (3x10)|          | (2x5) |   |                    |
|  +-------+          +-------+                       +-------+          +-------+   |                    |
|                                                                                    |                    |
|  [SIMULATION DOCK] Bottom Center Floating: [RUN SIM] [STEP] [TICK: 0] [SPEED: 1x]  |                    |
|  [MINIMAP & CONTROLS] Bottom Corners                                               |                    |
+------------------------------------------------------------------------------------+--------------------+
```

### 1.2 Identified UI/UX Deficiencies & Design Solutions

| Deficiency Area | Root Cause | Design System Solution |
| :--- | :--- | :--- |
| **Node Overlap & Clutter** | Hardcoded row step ($110\text{px}$) smaller than card height ($142\text{px}$). | Standardized on **$170\text{px}$ Row Pitch** ($142\text{px}$ card height + $28\text{px}$ gap) and **$284\text{px}$ Col Pitch** ($256\text{px}$ card width + $28\text{px}$ gap). |
| **Admin Node Off-Center** | Static $X=1380\text{px}$ offset left-skewed above Column 2. | Calculated exact grid midpoint ($\frac{60 + 3312}{2} = 1686\text{px}$) placing the $420\text{px}$ Admin Master at exact center ($X = 1476\text{px}$). |
| **Washed-Out Controls** | White-on-white text in toggle dock and simulation buttons. | Enforced high-contrast button tokens (`.btn-primary`, `.btn-secondary`) with solid $2\text{px}$ black borders and dark text. |
| **Missing Network Threads** | Missing `target` handles on Admin Node prevented React Flow edge rendering. | Added universal dual-direction Top/Bottom handles and rendered high-contrast animated color-coded streaming pulses. |
| **Unstructured CSS** | Ad-hoc inline Tailwind utility strings causing visual discrepancies across cards. | Created modular CSS design token architecture (`tokens.css`, `buttons.css`, `nodes.css`, `graph.css`). |

---

## 2. Color Theory & Strict Chromatic Hierarchy

All colors adhere strictly to **WCAG AAA Contrast ($> 7:1$)** against pure white `#FFFFFF` and canvas `#F1F5F9`.

```
================================================================================
PALETTE DOMAIN         HEX CODE       TAILWIND TOKEN      APPLICATION
================================================================================
Base Surface (Card)    #FFFFFF        bg-white            Card bodies, modals, popovers
Canvas Background      #F1F5F9        bg-slate-100        React Flow infinite grid
Primary Ink (Text)     #0F172A        text-slate-950      Primary headings, values, labels
Secondary Metadata     #475569        text-slate-600      Timestamps, descriptions, IDs
Structural Border      #0F172A / #33  border-slate-950    Outer bounding boxes (2px/4px)
Grid Matrix Dots       #64748B        color-slate-500     React Flow canvas dot grid
--------------------------------------------------------------------------------
FUNCTIONAL PIPELINE HUES (4-QUADRANT HARMONY):
--------------------------------------------------------------------------------
1. Classical ML        #0284C7        sky-600 / sky-100   RandomForest & KMeans Nodes
2. PyTrends Google     #D97706        amber-600 / amber-100 Search Momentum & Velocity
3. Groq LLM Reasoning  #059669        emerald-600 / emerald-100 Persona & Copy Critiques
4. PennyLane QML       #DB2777        pink-600 / pink-100 Quantum Hilbert Entanglement
5. Admin Orchestrator  #7C3AED        indigo-600 / indigo-100 Bayesian Consensus Master
================================================================================
```

---

## 3. Typography Hierarchy & Rhythm

The typography utilizes **Inter** for UI labels and **JetBrains Mono** for all quantitative values, IDs, parameters, and telemetry feeds.

| Level | Font Family | Size | Weight | Line Height | Letter Spacing | Target Elements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Title** | Inter | 14px | 900 (Black) | 1.2 | `0.05em` | Brand, Modal Titles, Section Headers |
| **Subhead / Category** | JetBrains Mono | 10px | 900 (Black) | 1.0 | `0.1em` | Pipeline Badges, Admin Category |
| **Card Title** | Inter | 12px | 900 (Black) | 1.2 | `-0.01em` | Agent Name, Campaign Title |
| **Body Text** | Inter | 11px | 500 (Medium) | 1.4 | `0.00em` | Descriptions, Critiques, Evidence |
| **Telemetry / Data** | JetBrains Mono | 11px | 900 (Black) | 1.0 | `0.02em` | ROAS, Scores, Percentages, Timestamps |
| **Micro Badge** | JetBrains Mono | 8px–9px | 800 (ExtraBold) | 1.0 | `0.05em` | `TRANSMITTING`, `LIVE FEED`, `#ID` |

---

## 4. GSAP 3.x Animation Choreography

```javascript
// 1. Sliding Analytics Dashboard (Drawer Slide-In)
gsap.to(drawerRef.current, {
  x: "0%",
  duration: 0.35,
  ease: "power3.out"
});
gsap.fromTo(
  contentRef.current.children,
  { y: 16, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.25, stagger: 0.04, delay: 0.08, ease: "power2.out" }
);

// 2. Active Node Transmitting Pulse
gsap.to(".node-transmitting", {
  boxShadow: "0 0 15px rgba(15, 23, 42, 0.4)",
  scale: 1.02,
  duration: 0.2,
  yoyo: true,
  repeat: 1,
  ease: "sine.inOut"
});

// 3. Campaign Dispatch Modal Scale-In
gsap.fromTo(
  modalRef.current,
  { scale: 0.95, opacity: 0, y: 12 },
  { scale: 1, opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }
);
```

---

## 5. Modular CSS File Structure Architecture

To ensure total code uniformity, standard classes are modularized in `apps/web/src/styles/`:

```
apps/web/src/styles/
├── tokens.css      # Standard CSS Variables (Colors, Spacing, Borders, Shadows)
├── buttons.css     # Universal Button & Pill Classes (.btn-primary, .btn-secondary, etc.)
├── nodes.css       # Agent & Admin Node Cards, Handles, Left Accent Bars
├── graph.css       # React Flow Canvas, Controls, Minimap, Edge Glows
└── dashboard.css   # Sliding Drawer, Charts, Feed Items, Modals
```
