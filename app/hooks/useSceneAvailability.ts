import {useReducedMotion} from "framer-motion";
import {useCallback, useState} from "react";
import {useMediaQuery} from "~/hooks/useMediaQuery";

/**
 * Whether a section should render its 3D scene or its plain HTML layout.
 * Scenes are desktop-only, skipped for reduced motion, and switched off for
 * good if one fails to load (no WebGL, chunk error).
 */
export const useSceneAvailability = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);

  const markSceneUnavailable = useCallback(() => setFailed(true), []);

  return {
    sceneEnabled: isDesktop && !prefersReducedMotion && !failed,
    markSceneUnavailable,
  };
};
