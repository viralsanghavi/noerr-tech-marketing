import {NavLink} from "@remix-run/react";
import CommonContainer from "../CommonContainer";

const Showcase = () => {
  return (
    <CommonContainer>
      <section className="relative py-20 flex">
        {/* Narrower orange sidebar */}
        <div
          className="h-[320px] bg-noerr-red rounded-sm px-8 py-6 text-black flex items-center gap-4 justify-center"
          style={{writingMode: "vertical-rl"}}
        >
          <div className="bg-white h-full w-[1px]" />
          <h2 className="text-2xl font-medium tracking-wide transform h-full -rotate-180">
            Our Team
          </h2>
        </div>
        <div className="pl-[40px] text-black z-10 bg-transparent mt-12 max-w-screen-xl">
          <h1 className="font-semibold text-4xl leading-tight tracking-wider mb-12">
            Our solutions are carefully crafted by a team of experts in website
            development
          </h1>

          <div className="ml-[80px] space-y-6 text-[#CCCCCC] text-lg leading-relaxed max-w-screen-md">
            <p>
              We are a team of expert web developers who build software using
              Ruby, Rust, Elixir, and Javascript, with vast experience in Agile
              methodologies and leadership coaching.
            </p>
            <p>
              For more than 15 years we&apos;ve been developing software for
              successful startups in Silicon Valley and New York while
              contributing to many Open Source projects in the Rails, Rust and
              Ember communities.
            </p>

            {/* Learn more link with exact styling */}
            <NavLink
              to="#"
              className="inline-block mt-4 text-noerr-red hover:text-noerr-red/90 
                          text-lg font-medium transition-colors duration-200"
            >
              Learn more
            </NavLink>
          </div>
        </div>
      </section>
    </CommonContainer>
  );
};

export default Showcase;
