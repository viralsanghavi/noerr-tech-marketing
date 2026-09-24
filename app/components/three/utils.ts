import {
  Line,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  Points,
  Sprite,
  SRGBColorSpace,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import type {Material, Object3D, Scene} from "three";

/** Mirrors the tokens in tailwind.css so 3D and CSS read as one palette. */
export const PALETTE = {
  accent: 0xed7d31,
  ink: 0xf2eee8,
  rule: 0x5a4d44,
  well: 0x1d1814,
  paper: 0x0b0a08,
} as const;

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
/** Where `progress` sits inside [start, end], clamped to 0 → 1. */
export const segment = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Throws when WebGL is unavailable; the caller falls back to the HTML layout. */
export const createRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({canvas, antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  return renderer;
};

const sizeProbe = new Vector2();

export const syncRendererSize = (renderer: WebGLRenderer, width: number, height: number) => {
  renderer.getSize(sizeProbe);
  if (sizeProbe.x !== width || sizeProbe.y !== height) renderer.setSize(width, height, false);
};

/**
 * Sizes an isometric camera. `shiftX`/`shiftY` slide the frustum so the model
 * sits right of (or below) centre, leaving room for the copy.
 */
export const fitOrthographic = (
  camera: OrthographicCamera,
  size: number,
  aspect: number,
  shiftX: number,
  shiftY: number,
) => {
  const halfWidth = size * aspect;
  camera.left = -halfWidth - shiftX * halfWidth;
  camera.right = halfWidth - shiftX * halfWidth;
  camera.top = size + shiftY * size;
  camera.bottom = -size + shiftY * size;
  camera.updateProjectionMatrix();
};

/** Same idea for a perspective camera, via a view offset. */
export const fitPerspective = (
  camera: PerspectiveCamera,
  width: number,
  height: number,
  shiftX: number,
) => {
  camera.aspect = width / height;
  camera.setViewOffset(width, height, -shiftX * width, 0, width, height);
  camera.updateProjectionMatrix();
};

type LabelTone = "tick" | "pill" | "faint" | "core";

const LABEL_INNER: Record<LabelTone, string> = {
  tick: "absolute grid -translate-y-1/2 gap-0.5 whitespace-nowrap pl-14 before:absolute before:left-0 before:top-1/2 before:w-11 before:border-t before:border-accent after:absolute after:-left-[3px] after:top-[calc(50%-3px)] after:h-1.5 after:w-1.5 after:rounded-full after:bg-accent",
  pill: "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-ink/15 bg-paper-lift/60 px-3 py-1 text-[13px] text-ink backdrop-blur-md",
  faint: "absolute -translate-x-1/2 -translate-y-[160%] whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft",
  core: "absolute -translate-x-1/2 whitespace-nowrap pt-2 font-display text-xl italic text-ink",
};

/**
 * Labels are plain DOM so they stay crisp and readable. Text goes in through
 * textContent — CMS copy never becomes markup.
 */
export const createLabel = (
  container: HTMLElement,
  tone: LabelTone,
  title: string,
  detail?: string,
) => {
  const outer = document.createElement("div");
  outer.className = "absolute left-0 top-0 opacity-0 will-change-transform";
  const inner = document.createElement("div");
  inner.className = LABEL_INNER[tone];

  const heading = document.createElement("span");
  heading.textContent = title;
  if (tone === "tick") heading.className = "font-display text-lg text-ink";
  inner.appendChild(heading);

  if (detail) {
    const sub = document.createElement("span");
    sub.className = "text-[12.5px] text-ink-soft";
    sub.textContent = detail;
    inner.appendChild(sub);
  }

  outer.appendChild(inner);
  container.appendChild(outer);
  return outer;
};

const projected = new Vector3();

export const placeLabel = (
  label: HTMLElement,
  world: Vector3,
  camera: OrthographicCamera | PerspectiveCamera,
  width: number,
  height: number,
  opacity: number,
) => {
  projected.copy(world).project(camera);
  const x = ((projected.x + 1) / 2) * width;
  const y = ((1 - projected.y) / 2) * height;
  label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  label.style.opacity = opacity.toFixed(3);
};

const disposeMaterial = (material: Material) => {
  Object.values(material).forEach((value) => {
    if (value instanceof Texture) value.dispose();
  });
  material.dispose();
};

/** Frees every GPU resource the scene graph holds. */
export const disposeScene = (scene: Scene) => {
  scene.traverse((node: Object3D) => {
    if (
      node instanceof Mesh ||
      node instanceof Line ||
      node instanceof Points ||
      node instanceof Sprite
    ) {
      node.geometry.dispose();
      const materials: Material[] = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach(disposeMaterial);
    }
  });
};
