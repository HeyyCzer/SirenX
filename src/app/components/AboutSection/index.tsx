"use client";

import { m } from "motion/react";

export default function AboutSection() {
  return (
    <section id="about" className="relative mx-auto max-w-4xl px-6 py-24 lg:px-12">
      <m.div
        className="text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <m.h2
          className="mb-8 font-bold text-3xl text-white/80 md:text-4xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          What is{" "}
          <span className="text-white">
            Siren<span className="text-emerald-400">X</span>
          </span>
          ?
        </m.h2>

        <m.p
          className="mx-auto max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="font-semibold text-white">SirenX</span> is a web-based{" "}
          <span className="font-semibold text-emerald-400">carcols.meta</span>{" "}
          editor, designed to make it easier to create and edit vehicle light
          patterns for{" "}
          <span className="font-semibold text-emerald-400">Grand Theft Auto V</span>{" "}
          and <span className="font-semibold text-emerald-400">FiveM</span>{" "}
          servers. We offer a simple and intuitive interface, so you can
          create your patterns in a few clicks.
        </m.p>
      </m.div>
    </section>
  );
}
