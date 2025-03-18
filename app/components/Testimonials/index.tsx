import CommonContainer from "../CommonContainer";
import {Card} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import TestimonialItem from "./TestimonialItem";

const Testimonials = () => {
  return (
    <div>
      <CommonContainer>
        <section className="text-black relative py-10 flex gap-12">
          <div
            className="h-[320px] bg-noerr-red rounded-sm px-8 py-6 text-black flex items-center gap-4 justify-center"
            style={{writingMode: "vertical-rl"}}
          >
            <div className="bg-white h-full w-[1px]" />
            <h2 className="text-2xl font-medium tracking-wide transform h-full -rotate-180">
              Testimonials
            </h2>
          </div>
          <div>
            <div className="flex w-full flex-col pt-10 justify-center">
              <h1 className="font-semibold text-4xl leading-tight tracking-wider mb-4">
                Satisfied Client
              </h1>
              <p className="mb-8 ml-[80px] space-y-6 text-[#CCCCCC] text-lg leading-relaxed ">
                What say about us....................
              </p>
            </div>
            <Carousel className="w-full mx-12">
              <Card className="bg-transparent">
                <CarouselContent>
                  <TestimonialItem />
                  <TestimonialItem />
                  <TestimonialItem />
                </CarouselContent>
              </Card>
              <CarouselNext className="rounded-none" />
              <CarouselPrevious className="rounded-none" />
            </Carousel>
          </div>
        </section>
      </CommonContainer>
    </div>
  );
};

export default Testimonials;
