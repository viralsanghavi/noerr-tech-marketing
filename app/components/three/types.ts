/**
 * The contract between a 3D scene module and the React side. Types only, so
 * importing this never pulls three.js into the main bundle.
 */

export type Pointer = {x: number; y: number};

export type FrameInput = {
  /** Scroll progress through the pinned section, 0 → 1, already smoothed. */
  progress: number;
  /** Seconds since the scene mounted, for idle motion. */
  time: number;
  /** Pointer position across the viewport, -1 → 1 on both axes. */
  pointer: Pointer;
  width: number;
  height: number;
};

export type SceneHandle = {
  frame: (input: FrameInput) => void;
  dispose: () => void;
};

export type SceneTarget = {
  canvas: HTMLCanvasElement;
  /** Empty layer above the canvas; the scene owns its children. */
  labels: HTMLElement;
};

export type MountScene<Data> = (target: SceneTarget, data: Data) => SceneHandle;
