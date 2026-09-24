/**
 * Screen `index` is in focus at progress index / (count - 1). The parallax scene
 * and the Work caption both read this, so the name shown always matches the
 * sharp screen. Lives apart from the scene so the caption doesn't pull three.js
 * into the main bundle.
 */
export const focusedIndex = (progress: number, count: number) =>
  Math.round(Math.min(1, Math.max(0, progress)) * Math.max(count - 1, 0));
