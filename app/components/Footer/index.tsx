import Container from "~/components/Container";
import Wordmark from "~/components/Wordmark";

const Footer = () => (
  <footer className="border-t border-rule-well bg-well text-well-muted">
    <Container className="flex flex-wrap items-center justify-between gap-5 py-[26px]">
      <a href="#top" aria-label="no.err — back to top">
        <Wordmark className="h-8 sm:h-10 w-auto opacity-90 grayscale contrast-125" />
      </a>
      <span className="label text-well-muted">
        © {new Date().getFullYear()} Noerr Tech — built without the err
      </span>
    </Container>
  </footer>
);

export default Footer;
