"use client";

import { faEdit, faHourglass2 } from "@fortawesome/free-regular-svg-icons";
import { faAngleDoubleDown, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Hero({ heroBackgroundClass }) {
  useEffect(() => {
    const handleScroll = () => {
      const heroBackground = document.querySelector(`.${heroBackgroundClass}`);
      if (heroBackground) {
        const scroll = window.scrollY;
        const scrollMax = 260;

        let target = scroll * 0.6;
        if (target > scrollMax) target = scrollMax;
        heroBackground.style.transform = `translateY(${target}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroBackgroundClass]);

  return (
    <section className={"relative h-[90vh] w-full"}>
      <div className={"z-40 mx-auto flex w-full items-center justify-between gap-32 lg:my-32 xl:px-56"}>
        <div className="z-50 flex flex-col items-center justify-center xl:block">
          <span className="rounded-full border border-emerald-400 px-4 py-0.5 text-[13px] text-emerald-400 leading-none">
            <FontAwesomeIcon icon={faHourglass2} className="mr-2" />
            Save your time
          </span>
          <h1 className="mt-1 mb-4 font-bold text-[72px] leading-none">
            <span className="animate-siren text-white [animation-delay:0.70s]">Siren</span>
            <span className="animate-siren2 text-white">X</span>
          </h1>

          <p className="text-center text-white/45 text-xl tracking-wide xl:text-left">
            Ease, simplicity and time-saving. <br />
            Your brand new and time-saving{" "}
            <span className="font-semibold text-gradient-primary">carcols.meta</span>{" "}
            editor.
            <br />
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="#features"
              className="flex flex-nowrap items-center text-nowrap rounded-md bg-emerald-500 px-8 py-2 font-semibold text-sm text-white uppercase tracking-wide transition-all hover:bg-emerald-600"
            >
              <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
              Features
            </Link>
            <Link
              href="/editor"
              className="flex flex-nowrap items-center text-nowrap rounded-md bg-white px-8 py-2 font-semibold text-black text-sm uppercase tracking-wide transition-all hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Open Editor
            </Link>
          </div>
        </div>

        <div>
          <Image
            unoptimized
            src={"/images/screenshot.png"}
            alt="Screenshot"
            className="hidden w-full min-w-[500px] rounded-lg border border-gray-700/70 bg-gray-500/20 p-2 opacity-80 xl:block xl:max-w-[800px] 2xl:max-w-[900px]"
          />
        </div>
      </div>

      <div className="absolute right-0 bottom-24 left-0 flex justify-center gap-4">
        <Link href="#features" className="animate-bounce text-white">
          <FontAwesomeIcon icon={faAngleDoubleDown} size="2x" />
        </Link>
      </div>
    </section>
  );
}
