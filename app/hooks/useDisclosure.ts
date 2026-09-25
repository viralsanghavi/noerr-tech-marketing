import {useCallback, useEffect, useState} from "react";

/**
 * Open/closed state for a menu or panel the visitor toggles. Escape closes it,
 * and the key listener only exists while it's open.
 */
export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return {isOpen, toggle, close};
};
