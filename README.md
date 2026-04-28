# Krut AI — Ad Creative Agents MVP (Frontend)

> AI-powered creative studio web application for generating product images, AI models, and ad creatives. Built with React, TypeScript, and Vite, featuring three specialized studios — Product Studio, Model Studio, and Ad Creative Studio.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Pages & Routing](#pages--routing)
- [AI Tools](#ai-tools)
- [Canvas System](#canvas-system)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build & Deploy](#build--deploy)
- [Environment Configuration](#environment-configuration)
- [Key Libraries](#key-libraries)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Krut AI Frontend is a full-featured creative studio web application that provides users with AI-powered tools to generate, edit, and design professional ad creatives. The application consists of three major studios, each purpose-built for a specific creative workflow:

- **Product Studio** — Generate professional product photography with AI-powered backgrounds, styles, and layouts. Upload product images, select styles, and let AI create stunning visuals.
- **Model Studio** — Create AI-generated model images by combining custom faces and poses with product images. Includes a harmonizer for blending models with products.
- **Ad Creative Studio** — A Polotno-powered full design editor for creating ad creatives with drag-and-drop, templates, icons, shapes, QR codes, and multi-format export.

The frontend communicates with the [Krut AI Backend](https://github.com/rakshit176/Ad-Creative_agents-MVP) for all API operations and AI microservice calls.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Krut AI Frontend                          │
│                  (React + TypeScript + Vite :5173)               │
├──────────────┬──────────────────┬────────────────────────────────┤
│  Product     │    Model         │       Ad Creative              │
│  Studio      │    Studio        │       Studio                   │
│ ┌──────────┐ │ ┌──────────────┐ │ ┌────────────────────────────┐ │
│ │Fabric.js │ │ │  Fabric.js   │ │ │  Polotno Design Editor    │ │
│ │ Canvas   │ │ │  Canvas      │ │ │  (MobX State)             │ │
│ └──────────┘ │ └──────────────┘ │ └────────────────────────────┘ │
│ ┌──────────┐ │ ┌──────────────┐ │ ┌────────────────────────────┐ │
│ │  SAM     │ │ │  Model       │ │ │  Sidebar: Templates,      │ │
│ │ (Konva + │ │ │  Generate    │ │ │  Icons, Shapes, Quotes,   │ │
│ │  ONNX)   │ │ │  Canvas      │ │ │  QR Codes, My Designs     │ │
│ └──────────┘ │ └──────────────┘ │ └────────────────────────────┘ │
├──────────────┴──────────────────┴────────────────────────────────┤
│                     Redux Toolkit (Global State)                  │
├──────────────────────────────────────────────────────────────────┤
│                     API Service Layer (Axios)                     │
├──────────────────────────────────────────────────────────────────┤
│   Krut AI Backend    │   ML API    │   Polotno API   │  Unsplash │
│   (api.krut.ai)      │(genai.krut) │ (api.polotno)   │  (proxy)  │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input (Sidebar) → Redux State → Canvas Component → API Call (Axios)
    → ML Backend → Response Images → Redux Update → Canvas Re-render

Fabric.js Canvas → toDataURL() → FormData → Backend API → AI Service
    → Generated Images → Redux → Canvas Display

Polotno Store → Auto-save (5s debounce) → localforage/Puter.js → Design Gallery
```

---

## Tech Stack

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2.0 | UI framework |
| **TypeScript** | 5.2.2 | Type safety |
| **Vite** | 5.1.4 | Build tool & dev server |
| **React Router DOM** | 6.22.2 | Client-side routing |

### Canvas & Image Processing

| Technology | Version | Purpose |
|---|---|---|
| **Fabric.js** | 5.3.0 | Product/Model Studio canvas (image editing, layers) |
| **Konva** + **react-konva** | 9.3.6 | SAM segmentation canvas |
| **Polotno** | 2.4.22 | Ad Creative Studio design editor |
| **ONNX Runtime Web** | 1.17.1 | Client-side SAM model inference (WASM/SIMD) |

### State Management

| Technology | Purpose |
|---|---|
| **Redux Toolkit** | Global state (canvas, user, tools) |
| **React-Redux** | Redux bindings |
| **MobX** | Polotno/AdCreative local state |

### UI & Styling

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **BlueprintJS** | (via Polotno) | Dialog, Menu, Slider components |
| **React DaisyUI** | 5.0.0 | Additional UI components |
| **SweetAlert2** | 11.10.7 | Custom modals (gender selection, etc.) |
| **React Hot Toast** | 2.4.1 | Toast notifications |
| **React Modal** | 3.16.1 | Modal dialogs |

### Data & Storage

| Technology | Purpose |
|---|---|
| **Axios** | HTTP requests to backend API |
| **localforage** | Client-side storage (IndexedDB/WebSQL fallback) |
| **IndexedDB** (native) | Canvas state persistence per studio |
| **JSZip** | ZIP export for multi-page designs |

### Monitoring & Analytics

| Technology | Purpose |
|---|---|
| **Sentry** | Error tracking |
| **React GA4** | Google Analytics 4 |

---

## Project Structure

```
Ad-Creative_agents-MVP_frontend/
├── public/                              # Static assets
│   ├── images/                          # App images (logos, backgrounds, products)
│   │   ├── backgrounds/                 # Background assets
│   │   │   ├── platform/                # Platform-style backgrounds
│   │   │   ├── hands_with_product/      # Hands-with-product backgrounds
│   │   │   ├── normal_background/       # Standard backgrounds
│   │   │   └── solid_background/        # Solid color backgrounds
│   │   ├── model_faces/                 # AI model face references
│   │   ├── model_poses/                 # AI model pose references
│   │   ├── products/                    # Sample product images
│   │   └── visuals/                     # Visual assets (liquid effects, etc.)
│   ├── styles/                          # Style reference images for generation
│   │   └── product/                     # Product style samples
│   ├── icons/                           # Platform/format icons (Facebook, Instagram, etc.)
│   ├── videos/                          # Demo/tutorial videos
│   ├── assets/                          # General assets (SVGs, gallery images)
│   ├── sam_h.onnx                       # SAM model (ONNX format)
│   ├── sam_onnx_quantized.onnx         # Quantized SAM model
│   └── interactive_module_*.onnx        # SAM interactive module
│
├── src/
│   ├── App.tsx                          # Root component with routing
│   ├── main.tsx                         # Entry point
│   ├── index.css                        # Global styles
│   │
│   ├── pages/                           # Page components
│   │   ├── Login.tsx                    # Authentication page
│   │   ├── Dashboard.tsx                # Studio selection hub
│   │   ├── ProductStudio.tsx            # Product studio page
│   │   ├── ModelStudio.tsx              # Model studio page
│   │   └── AdStudio.tsx                 # Ad creative studio page
│   │
│   ├── components/                      # Reusable components
│   │   ├── Header.tsx                   # App header with credits & profile
│   │   ├── ToolsBar.tsx                 # Vertical tool selector
│   │   ├── AdCreativeSideBar.tsx        # Product studio sidebar
│   │   ├── ProductSideBar.tsx           # Product-specific sidebar
│   │   ├── ModelSideBar.tsx             # Model-specific sidebar
│   │   ├── ComparisonSlider.tsx         # Before/after image comparison
│   │   ├── KrutLoader.tsx               # Loading spinner
│   │   ├── KrutLoaderModal.tsx          # Loading modal overlay
│   │   ├── ReferUser.tsx                # Referral dialog
│   │   ├── RemoveProductBgModal.tsx     # BG removal modal
│   │   ├── Error404.tsx                 # 404 page
│   │   ├── Error401.tsx                 # 401 page
│   │   │
│   │   ├── Canvas/                      # Canvas components
│   │   │   ├── CanvasSection.tsx        # Core Fabric.js canvas
│   │   │   ├── GeneratorCanvas.tsx      # Generated images display
│   │   │   ├── BackgroundRemoverCanvas.tsx  # BG removal comparison
│   │   │   ├── UpscalarCanvas.tsx       # Upscale comparison slider
│   │   │   ├── OutpaintCanvas.tsx       # Outpainting canvas
│   │   │   ├── SamCanvas.tsx            # SAM segmentation (Konva)
│   │   │   └── ModelGenerateCanvas.tsx  # Model generation panel
│   │   │
│   │   ├── SidebarSections/             # Sidebar tool panels
│   │   │   ├── AdLayout.tsx             # Aspect ratio presets
│   │   │   ├── Assets.tsx               # Product/background/model assets
│   │   │   ├── Visuals.tsx              # Visual assets panel
│   │   │   ├── ProductGenerateSection.tsx   # Product generation controls
│   │   │   ├── ModelGenerateSection.tsx     # Model generation controls
│   │   │   ├── Upscaler.tsx             # Upscaler controls
│   │   │   ├── OutPaint.tsx             # Outpainting controls
│   │   │   ├── BgRemover.tsx            # BG removal controls
│   │   │   ├── MagicTool.tsx            # Magic remove/replace
│   │   │   ├── ShapesAndIcons.tsx       # Shapes & icon search
│   │   │   ├── Templates.tsx            # Template search
│   │   │   └── CustomSize.tsx           # Custom canvas size
│   │   │
│   │   ├── AdCreative/                  # Ad Creative Studio (Polotno)
│   │   │   ├── App.tsx                  # Main Polotno layout
│   │   │   ├── AdCtreative.tsx          # Entry point (store + context)
│   │   │   ├── api.ts                   # Storage abstraction (Puter/localforage)
│   │   │   ├── project.ts              # Design CRUD & auto-save
│   │   │   ├── credits.ts              # Daily credit system
│   │   │   ├── blob.ts                 # Blob/dataURL utilities
│   │   │   ├── file.ts                 # File loading (JSON/images)
│   │   │   ├── background-remover.tsx  # Polotno BG remover
│   │   │   ├── cloud-warning.tsx       # Cloud storage warning
│   │   │   ├── topbar/                 # Top bar components
│   │   │   │   ├── topbar.tsx           # Header + export
│   │   │   │   ├── download-button.tsx  # Multi-format export
│   │   │   │   ├── subscription-modal.tsx  # Subscription prompt
│   │   │   │   ├── file-menu.tsx       # File operations
│   │   │   │   └── user-menu.tsx       # User profile menu
│   │   │   ├── sections/               # Polotno sidebar sections
│   │   │   │   ├── my-designs-section.tsx  # Design gallery
│   │   │   │   ├── icons-section.tsx    # Icon search (IconFinder)
│   │   │   │   ├── shapes-section.tsx   # Shape library
│   │   │   │   ├── quotes-section.tsx   # Quote search
│   │   │   │   ├── qr-section.tsx      # QR code generator
│   │   │   │   ├── gallery-section.tsx  # Image gallery
│   │   │   │   └── stable-diffusion-section.tsx  # AI image gen
│   │   │   └── translations/            # i18n JSON files
│   │   │
│   │   └── Sam/                         # Segment Anything Model
│   │       └── helpers/
│   │           ├── modelAPI.tsx          # SAM model API calls
│   │           ├── Interface.tsx         # TypeScript interfaces
│   │           ├── ImageHelper.tsx       # Image scaling utilities
│   │           ├── mask_utils.tsx        # RLE mask & SVG tracing
│   │           ├── CanvasHelper.tsx      # Canvas rendering
│   │           ├── custom_tracer.tsx     # Custom SVG path tracing
│   │           ├── getFile.tsx           # File fetching
│   │           ├── colors.tsx            # Color definitions
│   │           ├── metaTheme.tsx         # Meta theme config
│   │           └── photos.tsx            # Photo sample data
│   │
│   ├── services/                        # API & utility services
│   │   ├── APIservice.ts                # All backend API calls
│   │   └── canvasMethods.ts             # Canvas manipulation methods
│   │
│   ├── redux/                           # Redux state management
│   │   ├── canvasSlice.ts               # Canvas state (25+ fields)
│   │   └── userSlice.ts                 # User & auth state
│   │
│   ├── utils/                           # Utility modules
│   │   ├── DBConfig.tsx                 # IndexedDB operations
│   │   └── links.ts                     # API endpoint URLs
│   │
│   └── assets/                          # Tool definitions & assets
│       └── tools.ts                     # Tool configurations per studio
│
├── index.html                           # HTML entry point
├── vite.config.ts                       # Vite build configuration
├── tsconfig.json                        # TypeScript configuration
├── tsconfig.node.json                   # Node TypeScript config
├── tailwind.config.js                   # Tailwind CSS configuration
├── vercel.json                          # Vercel deployment config
├── package.json                         # Dependencies & scripts
└── yarn.lock                            # Yarn lockfile
```

---

## Features

### Product Studio
- **Ad Layout** — Canvas with aspect ratio presets (1:1, 4:3, 3:4, 16:9, 9:16) and custom sizes up to 3000px
- **Asset Management** — Upload product/background/model images, search Unsplash, browse sample assets
- **Visual Library** — Upload PNG/SVG visuals or choose from built-in visual effects (liquid, etc.)
- **AI Product Generation** — Auto-generate optimized prompts from styles, generate product images with AI
- **Image Upscaler** — 2x and 4x upscaling with Detailed/Smooth quality modes
- **SAM (Segment Anything)** — Client-side, browser-based image segmentation using ONNX Runtime — click to segment, multi-mask mode, magic erase
- **Auto Fill (Outpaint)** — Expand images beyond their original boundaries with AI
- **Background Remover** — AI-powered background removal with Hard/Soft mode selection
- **Layer Management** — Visibility toggle, reordering, drag-and-drop on Fabric.js canvas
- **Cross-Studio Export** — Send designs directly to Ad Creative Studio

### Model Studio
- **AI Model Generation** — Select face and pose references, generate AI model images
- **Harmonizer** — Blend/harmonize product images with generated model images
- **Same Tool Suite** — Upscaler, Auto Fill, Background Remover (shared with Product Studio)

### Ad Creative Studio
- **Full Design Editor** — Polotno-powered drag-and-drop canvas with text, images, shapes
- **Template Library** — Searchable design templates for quick starts
- **Icon Search** — Integrated IconFinder search for icons
- **Shape Library** — Basic shapes for design composition
- **Quote Generator** — Search quotes by keyword, add as text elements
- **QR Code Generator** — URL-to-QR code creation, add as SVG element
- **Image Background Remover** — One-click AI background removal within the editor
- **Multi-Format Export** — PNG, JPEG, PDF, HTML, GIF, and ZIP (multi-page)
- **Design Persistence** — Auto-save every 5 seconds, design gallery, cloud storage (Puter.js)
- **Cross-Studio Export** — Send designs to Product Studio tools (Upscaler, Auto Fill, BG Remover)

### Shared Features
- **Authentication** — Email/password login with JWT tokens stored in localStorage
- **Credits Display** — Real-time credit usage tracking in header
- **Canvas Persistence** — IndexedDB auto-saves canvas state per studio
- **Data Backup** — Automatic backup to MongoDB on logout
- **Error Tracking** — Sentry integration for production error monitoring
- **Analytics** — Google Analytics 4 integration

---

## Pages & Routing

| Route | Page | Description |
|---|---|---|
| `/` | Login | Email/password authentication with animated backgrounds |
| `/dashboard` | Dashboard | Studio selection hub with video previews and credits display |
| `/productStudio` | ProductStudio | AI product image generation workspace |
| `/modelStudio` | ModelStudio | AI model generation workspace |
| `/adCreative` | AdStudio | Polotno-powered design editor |
| `/unauthorized` | Error401 | Unauthorized access page |
| `*` | Error404 | Not found page |

Tool selection within studios is handled via URL query parameters: `?tool_id=X&tool=Name`.

---

## AI Tools

### Tool Configuration by Studio

**Product Studio:**
| Tool ID | Tool Name | Canvas Component |
|---|---|---|
| 1-3 | Canvas (various) | `CanvasSection` (Fabric.js) |
| 4 | AI Generate | `GeneratorCanvas` |
| 5 | Upscaler | `UpscalarCanvas` |
| 6 | SAM Segment | `SamCanvas` (Konva + ONNX) |
| 7 | Auto Fill | `OutpaintCanvas` |
| 8 | BG Remover | `BackgroundRemoverCanvas` |

**Model Studio:**
| Tool ID | Tool Name | Canvas Component |
|---|---|---|
| 1 | Canvas | `CanvasSection` |
| 2 | AI Generate | `ModelGenerateCanvas` + `CanvasSection` |
| 3 | Upscaler | `UpscalarCanvas` |
| 4 | Auto Fill | `OutpaintCanvas` |
| 5 | BG Remover | `BackgroundRemoverCanvas` |

---

## Canvas System

The application uses a **dual canvas library** approach:

### Fabric.js (Product & Model Studios)
- Full image editing with layers, drag-and-drop, and transformations
- Keyboard shortcuts: `Delete` (remove), `Ctrl+Z` (zoom), click to deselect
- Image extraction for API calls: `toDataURL()` for base64, mask image extraction
- Auto-scaling and centering for added images
- IndexedDB persistence: canvas JSON state saved/restored per studio

### Polotno (Ad Creative Studio)
- Professional design editor with drag-and-drop, text editing, and multi-page support
- MobX-based store with auto-save (5-second debounce)
- Custom sidebar sections for templates, icons, shapes, quotes, and QR codes
- Background remover integration via Polotno proxy API
- Design persistence via localforage or Puter.js cloud storage

### Konva + ONNX Runtime (SAM)
- Client-side **Segment Anything Model** inference in the browser
- ONNX Runtime configured for WASM + SIMD + multi-threading
- Click-to-segment: user clicks on image, model returns segmentation mask
- Multi-mask mode for selecting multiple segments
- Magic erase: remove selected segments from the image
- SVG path tracing for mask visualization

---

## State Management

### Redux (Global State)

**`canvasSlice.ts`** — 25+ fields managing the canvas workspace:
- `activeTool`, `activeToolName`, `selectedStudio` — current tool/studio selection
- `editor` — Fabric.js instance reference
- `uploadedImage`, `generatedImage`, `maskImage`, `backgroundImage` — image states
- `upscaledImage`, `outpaintedImage`, `bgRemovedImage` — tool output states
- `magicRemovedImage`, `magicReplacedImage` — magic tool outputs
- `generatedImageList`, `generatedModelsList` — batch generation results
- `isModelGenerate`, `modelFace`, `modelPose`, `modelGeneratePrompt` — model studio state
- `canvasScaleFactor`, `isBrushMaskApplied`, `brushSize` — canvas settings
- `adCreativeImport`, `adCreativeExport` — cross-studio transfer

**`userSlice.ts`** — User authentication and credit state:
- `userData`, `userCredit`, `totalCredits`
- Login persists token + user info to localStorage

---

## API Integration

### Base URLs

| Service | URL |
|---|---|
| Backend API | `https://api.krut.ai/` |
| ML API | `https://genai.krut.ai/` |
| SAM Model API | `https://model-zoo.metademolab.com/predictions/` |
| Polotno API | `https://api.polotno.com/api/` |
| Unsplash (via Polotno) | Polotno proxy |

### API Service Functions

| Function | Endpoint | Purpose |
|---|---|---|
| `userLoginAPI` | `/api/v1/auth/login` | User authentication |
| `generateProductPromptAPI` | `/krut_ai/generate_prompt_product` | Generate product prompt |
| `generateProductAPI` | `/krut_ai/product_studio` | Generate product images |
| `upscaleImageAPI` | `/krut_ai/upscale` | Image upscaling |
| `outpaintImageAPI` | `/krut_ai/outpaint` | Image outpainting |
| `bgRemoveAPI` | `/krut_ai/removebg` | Background removal |
| `magicRemoveAPI` | `/krut_ai/magic_remover` | Object removal |
| `magicReplaceAPI` | `/krut_ai/magic_replace` | Object replacement |
| `generateModelPromptAPI` | `/krut_ai/generate_prompt` | Generate model prompt |
| `modelStudioAPI` | `/krut_ai/model_studio` | Generate model images |
| `modelStudioHarmonizeAPI` | `/krut_ai/harmonizer` | Harmonize model + product |
| `backupToDataBaseAPI` | `/api/v1/backup/save` | Backup user session data |

---

## Getting Started

### Prerequisites

- **Node.js** 16+ and **npm** or **yarn**
- The [Krut AI Backend](https://github.com/rakshit176/Ad-Creative_agents-MVP) running and accessible

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rakshit176/Ad-Creative_agents-MVP_frontend.git
   cd Ad-Creative_agents-MVP_frontend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure API endpoints:**
   Update `src/utils/links.ts` with your backend API URLs if not using the default production endpoints.

### Development

Start the development server:

```bash
yarn dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build & Deploy

**Build for production:**
```bash
yarn build
# or
npm run build
```

**Preview the production build:**
```bash
yarn preview
# or
npm run preview
```

**Deploy to Vercel:**
The project includes a `vercel.json` configured for SPA routing. Simply connect the repository to Vercel for automatic deployments.

---

## Environment Configuration

### API Endpoints (`src/utils/links.ts`)

Configure the following base URLs to point to your backend services:

```typescript
ML_API_BASE = "https://genai.krut.ai/";
BACKEND_API_BASE = "https://api.krut.ai/";
SAM_MODEL_API = "https://model-zoo.metademolab.com/predictions/";
POLOTNO_API = "https://api.polotno.com/api/";
```

### Tailwind Custom Theme (`tailwind.config.js`)

The project uses a custom color palette:

| Color | Hex | Usage |
|---|---|---|
| `violetBg` | #097CAD | Primary background |
| `violetTxt` | #3292BB | Primary text |
| `highLightBg` | — | Highlight elements |
| `canvasBg` | — | Canvas background |
| `samHighlight` | — | SAM selection highlight |
| `samCutOutBorder` | — | SAM cutout border |

### ONNX Runtime (SAM)

The SAM model runs entirely in the browser using ONNX Runtime Web with the following configuration:
- **Backend**: WASM with SIMD support
- **Threading**: Multi-threaded via Web Workers
- **Model Files**: Located in `public/` directory
  - `sam_h.onnx` — SAM encoder model
  - `sam_onnx_quantized.onnx` — Quantized SAM model
  - `interactive_module_*.onnx` — Interactive segmentation module

---

## Key Libraries

### Fabric.js (v5.3.0)
Used in Product and Model Studios for the main canvas. Supports image layers, transformations, drag-and-drop, and export to various formats. Canvas state is persisted to IndexedDB between sessions.

### Polotno (v2.4.22)
Used in Ad Creative Studio as a full-featured design editor. Provides drag-and-drop, text editing, templates, shapes, and multi-page support. Uses MobX for reactive state management with auto-save.

### ONNX Runtime Web (v1.17.1)
Enables client-side inference of the Segment Anything Model directly in the browser using WebAssembly with SIMD and multi-threading support. No server-side calls needed for segmentation.

### Konva + react-konva (v9.3.6)
Used specifically for the SAM canvas component, providing performant 2D canvas rendering for segmentation masks and interactive click-based selection.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is proprietary software. All rights reserved.
