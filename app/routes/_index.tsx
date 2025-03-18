import type {MetaFunction} from "@remix-run/node";
import {motion} from "framer-motion";
import Capabilities from "~/components/Capabalities";
import Contact from "~/components/Contact";
import Hero from "~/components/Hero";
import MainLayout from "~/components/main-layout";
import Showcase from "~/components/Showcase";
import Testimonials from "~/components/Testimonials";
export const meta: MetaFunction = () => {
  return [
    {title: "Noerr Tech"},
    {name: "description", content: "IT services at your finger tips!"},
  ];
};

export default function Index() {
  return (
    <MainLayout>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-primary"
      >
        <Hero />
        <Showcase />
        <Capabilities />
        <Testimonials />
        <Contact />
      </motion.div>
    </MainLayout>
  );
}
