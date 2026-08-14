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
import Work from "~/components/Work";

export const meta: MetaFunction = () => [
  {title: "no.err — product studio"},
  {
    name: "description",
    content:
      "Noerr Tech is a product studio in Mumbai. Design and engineering in one team — web, mobile, backend and payments, shipped and maintained.",
  },
];

export default function Index() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Manifesto />
        <Capabilities />
        <Method />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
