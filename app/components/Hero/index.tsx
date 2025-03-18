import {Button} from "~/components/ui/button";
import CommonContainer from "../CommonContainer";

const Hero = () => {
  return (
    <section className="relative text-white h-[650px]">
      <div className="absolute z-0 h-[650px] overflow-hidden">
        <img
          src="hero-bg.jpg"
          className="brightness-[10%] h-full w-screen z-[10]"
        />
      </div>
      <CommonContainer>
        <div className="flex items-center justify-center bg-green-300 gap-8 h-full">
          <div className="flex-[0.6] z-10">
            <h1 className="font-semibold text-4xl leading-tight tracking-wider mb-4">
              Leading website development company in the India
            </h1>
            <h4 className="mb-8 text-sm">
              We combine technical expertise, years of experience, and deep
              understanding of operating system architecture to span the full
              development cycle.
            </h4>
            <Button variant="destructive" className="bg-noerr-red mb-2">
              Contact Us
            </Button>
            <p className="text-white text-sm">
              <span className="text-noerr-red">⭐️</span> Rated 4.9 out of 5 on
              Google
            </p>
          </div>
          <div className="flex-[0.4] z-10">
            <img src="hero.png" className="object-contain w-full h-full" />
          </div>
        </div>
      </CommonContainer>
    </section>
  );
};

export default Hero;
