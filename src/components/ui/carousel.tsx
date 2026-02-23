"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title } = slide;

  return (
    <li
      ref={slideRef}
      className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out cursor-pointer"
      onClick={() => handleSlideClick(index)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          current !== index
            ? "scale(0.98) rotateX(8deg)"
            : "scale(1) rotateX(0deg)",
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        transformOrigin: "bottom",
        zIndex: current === index ? 2 : 1,
        opacity: current === index ? 1 : 0,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
        style={{
          transform:
            current === index
              ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
              : undefined,
        }}
      >
        <img
          className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
          style={{
            opacity: current === index ? 1 : 0.5,
          }}
          alt={title}
          src={src}
          onLoad={imageLoaded}
          loading="lazy"
        />
        {current === index && (
          <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
        )}
      </div>

      <article
        className={`absolute bottom-0 left-0 right-0 p-[4vmin] transition-opacity duration-1000 ease-in-out ${
          current === index ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative text-white">
          {title}
        </h2>
        <div className="flex justify-center">
          <button className="mt-4 flex items-center gap-2 px-6 py-3 text-sm rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm">
            {button}
            <IconArrowNarrowRight className="w-4 h-4" />
          </button>
        </div>
      </article>
    </li>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm mx-2 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-white w-5 h-5" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div className="relative w-[70vmin] h-[70vmin] mx-auto" style={{ perspective: "1200px" }}>
      <ul
        className="relative w-full h-full list-none m-0 p-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="flex justify-center mt-8 gap-2">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
