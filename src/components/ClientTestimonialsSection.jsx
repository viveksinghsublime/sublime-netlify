import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fallbackTestimonials = [
  {
    message:
      "Sublime Technocorp combines strong engineering ownership with a clear focus on business outcomes.",
    name: "Sublime Client",
    position: "Client Review",
    image: "/images/img_avatar_user_pic.png",
  },
];

const ClientTestimonialsSection = ({ testimonials = fallbackTestimonials }) => {
  return (
    <section className="bg-gray-100 py-12 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm uppercase font-ibmplex tracking-wide text-gray-600 mb-2">
          Real Experiences. Real Results
        </h2>
        <h3 className="text-4xl text-black   font-bold mb-10">
          What our clients say
        </h3>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2">
                <div className="p-2">
                  <div className="h-full bg-white p-6 rounded-xl shadow-sm relative">
                    <p className="text-gray-800 mb-6">{testimonial.message}</p>
                    <div className="flex items-center">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-black">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 text-gray-200 text-6xl leading-none">
                      ”
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden mt-6  md:flex justify-end text-black  gap-4">
            <CarouselPrevious className="static hover:bg-blue-400 hover:text-white translate-y-0" />
            <CarouselNext className="static hover:bg-blue-400 hover:text-white translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ClientTestimonialsSection;