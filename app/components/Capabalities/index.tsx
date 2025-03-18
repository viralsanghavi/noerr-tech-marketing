import CommonContainer from "../CommonContainer";

const Capabilities = () => {
  return (
    <CommonContainer>
      <section className="text-black relative py-10 flex gap-12">
        <div
          className="h-[320px] bg-noerr-red rounded-sm px-8 py-6 text-black flex items-center gap-4 justify-center"
          style={{writingMode: "vertical-rl"}}
        >
          <div className="bg-white h-full w-[1px]" />
          <h2 className="text-2xl font-medium tracking-wide transform h-full -rotate-180">
            Capabilities
          </h2>
        </div>
        <div>
          <div className="flex w-full flex-col justify-center">
            <h1 className="font-semibold text-4xl pt-12 leading-tight tracking-wider mb-4">
              Our solutions are carefully crafted
            </h1>
            <p className="mb-8 ml-[80px] space-y-6 text-[#CCCCCC] text-lg leading-relaxed ">
              We will expand your team bringing the expertise and leadership you
              need to further enable your company to grow
            </p>
          </div>
          <div className="grid grid-cols-4 pl-[80px] gap-12 my-8">
            {[
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gatsby/gatsby-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original-wordmark.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
              "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original-wordmark.svg",
            ].map((itm) => (
              <div  key={itm} className="border-white border-[1px] flex items-center justify-center p-8">
                <img src={itm} className="w-40 h-40" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </CommonContainer>
  );
};

export default Capabilities;
