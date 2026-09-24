import type {MotionValue} from "framer-motion";
import {useEffect, useRef} from "react";
import type {MountScene, Pointer, SceneHandle} from "~/components/three/types";

type UseThreeSceneOptions<Data> = {
  /** Lazy import of the scene, so three.js ships in its own chunk. Must be stable. */
  loadScene: () => Promise<MountScene<Data>>;
  /** Passed to the scene once. Must be stable — a new identity rebuilds the scene. */
  data: Data;
  progress: MotionValue<number>;
  /** Called if the scene can't load or WebGL is unavailable. */
  onUnavailable: () => void;
};

/**
 * Mounts a three.js scene on a canvas and keeps it in step with scroll.
 *
 * Owns everything outside React: the renderer's lifetime, a frame loop that
 * only runs while the canvas is near the viewport, the pointer listener, and
 * teardown of all of it. Scroll progress is read from the motion value each
 * frame, so scrolling never re-renders the component.
 */
export const useThreeScene = <Data>({
  loadScene,
  data,
  progress,
  onUnavailable,
}: UseThreeSceneOptions<Data>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const onUnavailableRef = useRef(onUnavailable);

  useEffect(() => {
    onUnavailableRef.current = onUnavailable;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const labels = labelsRef.current;
    if (!canvas || !labels) return;

    let cancelled = false;
    let handle: SceneHandle | null = null;
    let frameId = 0;
    let nearViewport = false;
    const pointer: Pointer = {x: 0, y: 0};
    const startedAt = performance.now();

    const tick = () => {
      frameId = 0;
      if (!handle || !nearViewport) return;
      handle.frame({
        progress: progress.get(),
        time: (performance.now() - startedAt) / 1000,
        pointer,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      });
      frameId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!frameId) frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        nearViewport = entries.some((entry) => entry.isIntersecting);
        if (nearViewport) startLoop();
      },
      {rootMargin: "200px 0px"},
    );
    observer.observe(canvas);

    const trackPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", trackPointer, {passive: true});

    // Wait for the webfonts so text drawn into textures isn't set in a fallback.
    Promise.all([loadScene(), document.fonts.ready])
      .then(([mount]) => {
        if (cancelled) return;
        handle = mount({canvas, labels}, data);
        startLoop();
      })
      .catch(() => {
        if (!cancelled) onUnavailableRef.current();
      });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("pointermove", trackPointer);
      if (frameId) cancelAnimationFrame(frameId);
      handle?.dispose();
      labels.replaceChildren();
    };
  }, [loadScene, data, progress]);

  return {canvasRef, labelsRef};
};
