import {NavLink} from "@remix-run/react";
import CommonContainer from "../CommonContainer";
import {ContactForm} from "./ContactForm";

const Contact = () => {
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
            Contact to expert
          </h2>
        </div>
        <div className="pl-[40px] text-black z-10 bg-transparent mt-12 max-w-screen-xl">
          <h1 className="font-semibold text-4xl leading-tight tracking-wider mb-12">
            Two working days response time
          </h1>

          <div className="ml-[80px] space-y-6 text-[#CCCCCC] text-lg leading-relaxed max-w-screen-md">
            <p>If you want urgent meeting direct call to us..............</p>
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">Start a conversation</h1>
          <ContactForm />
        </div>
      </section>
    </CommonContainer>
  );
};

export default Contact;
