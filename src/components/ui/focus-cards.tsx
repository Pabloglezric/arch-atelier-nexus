"use client";
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    expanded,
    setExpanded,
  }: {
    card: { title: string; src: string };
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    expanded: number | null;
    setExpanded: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const isExpanded = expanded === index;

    return (
      <>
        {/* Normal card */}
        <div
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setExpanded(index)}
          className={cn(
            "rounded-lg relative bg-neutral-900 overflow-hidden h-60 md:h-96 w-full cursor-pointer",
            "transition-all duration-300 ease-out",
            hovered === index && "scale-[1.05] shadow-2xl shadow-amber-500/10 z-10",
            hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
            isExpanded && "invisible"
          )}
        >
          <img
            src={card.src}
            alt={card.title}
            className="object-cover absolute inset-0 w-full h-full"
          />
          <div
            className={cn(
              "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
              hovered === index ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
              {card.title}
            </div>
          </div>
        </div>

        {/* Fullscreen overlay */}
        {isExpanded && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in cursor-pointer"
            onClick={() => setExpanded(null)}
          >
            <div
              className="relative w-[95vw] h-[90vh] max-w-[1400px] rounded-xl overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={card.src}
                alt={card.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <h3 className="text-2xl md:text-4xl font-bold text-white">
                  {card.title}
                </h3>
              </div>
              <button
                onClick={() => setExpanded(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);

Card.displayName = "Card";

type CardType = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: CardType[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && expanded !== null) {
        setExpanded(null);
      }
    },
    [expanded]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    if (expanded !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown, expanded]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ))}
    </div>
  );
}
