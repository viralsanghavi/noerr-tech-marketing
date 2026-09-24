import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useState} from "react";
import Container from "~/components/Container";
import Wordmark from "~/components/Wordmark";
import type {NavLinkItem} from "~/data/types";
import {cn} from "~/lib/utils";

type NavProps = {links: NavLinkItem[]};

const Nav = ({links}: NavProps) => {
  const {scrollY} = useScroll();
  const [lifted, setLifted] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setLifted(latest > 10);
  });

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", href);
        return;
      }
      
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <motion.header
      initial={{y: -70}}
      animate={{y: 0}}
      transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
      className={cn(
        "sticky left-0 right-0 top-0 z-50 bg-paper/85 backdrop-blur-md transition-colors duration-500",
        lifted ? "border-b border-rule-soft" : "border-b border-transparent"
      )}
    >
      <Container className="flex h-[70px] items-center justify-between gap-6">
        <a href="#top" aria-label="no.err — home" onClick={(e) => handleScroll(e, "#top")}>
          <Wordmark className="h-10 sm:h-12 w-auto" />
        </a>

        <nav className="flex items-center gap-7">
          {links.map(({id, name, href, variant}) =>
            variant === "button" ? (
              <a
                key={id}
                href={href}
                onClick={(e) => handleScroll(e, href)}
                className="rounded-sm border border-ink px-[18px] py-[9px] font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
              >
                {name}
              </a>
            ) : (
              <a
                key={id}
                href={href}
                onClick={(e) => handleScroll(e, href)}
                className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink sm:block"
              >
                {name}
              </a>
            )
          )}
        </nav>
      </Container>
    </motion.header>
  );
};

export default Nav;
