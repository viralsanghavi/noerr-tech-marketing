import type {MetaFunction} from "@remix-run/node";
import Capabilities from "~/components/Capabilities";
import Clients from "~/components/Clients";
import Contact from "~/components/Contact";
import Footer from "~/components/Footer";
import Hero from "~/components/Hero";
import Manifesto from "~/components/Manifesto";
import Marquee from "~/components/Marquee";
import Method from "~/components/Method";
import Nav from "~/components/Nav";
import TrustBand from "~/components/TrustBand";
import Work from "~/components/Work";
import {
  ALSO_SHIPPED,
  CAPABILITIES,
  CLIENT_NAMES,
  CONTACT_EMAIL,
  CONTACT_FACTS,
  MARQUEE_ITEMS,
  METHOD_STEPS,
  NAV_LINKS,
  PROJECTS,
  RESPONSE_TIME,
  STATS,
  TESTIMONIALS,
} from "~/data/site";

const APPROVED_TESTIMONIAL = TESTIMONIALS.find(({approved}) => approved);
/** Studio order decides which client site the hero opens with. */
const HERO_SHOWCASE = PROJECTS[0];

export const meta: MetaFunction = () => [
  {title: "no.err — product studio"},
  {
    name: "description",
    content:
      "Noerr Tech is a product studio in Mumbai. Design and engineering in one team — web, mobile, backend and payments, shipped and maintained.",
  },
];

/**
 * This route is the one place that reads the content module; everything below
 * takes plain props, so the sections stay presentational.
 */
export default function Index() {
  return (
    <>
      <Nav links={NAV_LINKS} />
      <main>
        {HERO_SHOWCASE ? (
          <Hero showcase={HERO_SHOWCASE} clients={CLIENT_NAMES} responseTime={RESPONSE_TIME} />
        ) : null}
        <TrustBand
          stats={STATS}
          testimonial={APPROVED_TESTIMONIAL}
          responseTime={RESPONSE_TIME}
        />
        <Marquee items={MARQUEE_ITEMS} />
        <Work projects={PROJECTS} alsoShipped={ALSO_SHIPPED} />
        <Manifesto />
        <Capabilities capabilities={CAPABILITIES} clients={CLIENT_NAMES} />
        <Method steps={METHOD_STEPS} />
        <Clients testimonials={TESTIMONIALS} />
        <Contact email={CONTACT_EMAIL} facts={CONTACT_FACTS} />
      </main>
      <Footer />
    </>
  );
}
