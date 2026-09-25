import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {Menu, X} from "lucide-react";
import {useState} from "react";
import Container from "~/components/Container";
import Wordmark from "~/components/Wordmark";
import type {NavLinkItem} from "~/data/types";
import {useDisclosure} from "~/hooks/useDisclosure";
import {cn} from "~/lib/utils";

type NavProps = {links: NavLinkItem[]};

const MOBILE_MENU_ID = "mobile-menu";

/** In-page links scroll smoothly and keep the hash in the address bar. */
const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  const targetId = href.substring(1);

  if (targetId === "top") {
    window.scrollTo({top: 0, behavior: "smooth"});
    window.history.pushState(null, "", href);
    return;
  }

  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({behavior: "smooth"});
    window.history.pushState(null, "", href);
  }
};

const Nav = ({links}: NavProps) => {
  const {scrollY} = useScroll();
  const [lifted, setLifted] = useState(false);
  const menu = useDisclosure();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setLifted(latest > 10);
  });

  return (
    <motion.header
      initial={{y: -70}}
      animate={{y: 0}}
      transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
      className={cn(
        "sticky left-0 right-0 top-0 z-50 bg-paper/85 backdrop-blur-md transition-colors duration-500",
        lifted || menu.isOpen ? "border-b border-rule-soft" : "border-b border-transparent"
      )}
    >
      <Container className="flex h-[70px] items-center justify-between gap-6">
        <a href="#top" aria-label="no.err — home" onClick={(e) => scrollToAnchor(e, "#top")}>
          <Wordmark className="h-10 sm:h-12 w-auto" />
        </a>

        <nav className="flex items-center gap-3 sm:gap-7">
          {links.map(({id, name, href, variant}) =>
            variant === "button" ? (
              <a
                key={id}
                href={href}
                onClick={(e) => scrollToAnchor(e, href)}
                className="rounded-sm border border-ink px-[18px] py-[9px] font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
              >
                {name}
              </a>
            ) : (
              <a
                key={id}
                href={href}
                onClick={(e) => scrollToAnchor(e, href)}
                className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink sm:block"
              >
                {name}
              </a>
            )
          )}

          <button
            type="button"
            onClick={menu.toggle}
            aria-expanded={menu.isOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={menu.isOpen ? "Close menu" : "Open menu"}
            className="-mr-2.5 flex h-11 w-11 items-center justify-center text-ink sm:hidden"
          >
            {menu.isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </nav>
      </Container>

      <MobileMenu
        links={links}
        isOpen={menu.isOpen}
        onLinkChosen={(e, href) => {
          menu.close();
          scrollToAnchor(e, href);
        }}
      />
    </motion.header>
  );
};

export default Nav;

type MobileMenuProps = {
  links: NavLinkItem[];
  isOpen: boolean;
  onLinkChosen: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
};

/**
 * Phones only. Absolutely placed under the bar, so opening and closing it never
 * shifts the page — an anchor jump lands where it would with the menu shut.
 */
const MobileMenu = ({links, isOpen, onLinkChosen}: MobileMenuProps) => (
  <nav
    id={MOBILE_MENU_ID}
    aria-label="Sections"
    hidden={!isOpen}
    className="absolute inset-x-0 top-full border-b border-rule-soft bg-paper sm:hidden"
  >
    <Container>
      <ul className="m-0 list-none p-0 py-2">
        {links.map(({id, name, href}) => (
          <li key={id} className="border-b border-rule-soft last:border-b-0">
            <a
              href={href}
              onClick={(e) => onLinkChosen(e, href)}
              className="flex min-h-12 items-center font-mono text-[13px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </Container>
  </nav>
);
