import {useScroll, useSpring} from "framer-motion";
import type {MotionValue} from "framer-motion";
import type {ReactNode} from "react";
import {useRef} from "react";
import type {MountScene} from "~/components/three/types";
import {useThreeScene} from "~/hooks/useThreeScene";

/** Enough lag to feel weighted, not so much that the scene trails the thumb. */
const SCRUB = {stiffness: 120, damping: 30, restDelta: 0.0005};

type ThreeStageProps<Data> = {
  loadScene: () => Promise<MountScene<Data>>;
  data: Data;
  /** How many viewport-heights of scroll the scene plays over. */
  screens: number;
  onUnavailable: () => void;
  /** The HTML over the scene. Gets the same smoothed progress the scene uses. */
  children: (progress: MotionValue<number>) => ReactNode;
};

/**
 * A pinned, scroll-driven 3D section: a tall track with a sticky viewport
 * holding the canvas, its projected labels, and the section's own copy on top.
 * Only rendered on desktop with motion allowed — callers own the fallback.
 */
const ThreeStage = <Data,>({loadScene, data, screens, onUnavailable, children}: ThreeStageProps<Data>) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target: trackRef, offset: ["start start", "end end"]});
  const progress = useSpring(scrollYProgress, SCRUB);
  const {canvasRef, labelsRef} = useThreeScene({loadScene, data, progress, onUnavailable});

  return (
    <div ref={trackRef} style={{height: `${screens * 100}vh`}} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
        <div ref={labelsRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]" />
        <div className="relative z-[2] h-full">{children(progress)}</div>
      </div>
    </div>
  );
};

export default ThreeStage;
