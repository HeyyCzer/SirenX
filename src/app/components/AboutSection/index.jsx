"use client";

import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-12 pb-16">
      <div>
        <motion.h2
          className="mb-12 text-center font-bold text-3xl text-gray-400"
          initial={{ scale: 0.0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          What is{" "}
          <span className="mr-0.5 text-white">
            Siren<span className="text-gradient-primary">X</span>
          </span>
          ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center text-white/60 text-xl"
        >
          <span className="font-bold text-white">SirenX</span> is a web-based{" "}
          <span className="font-bold text-gradient-primary">carcols.meta</span>{" "}
          editor, designed to make it easier to create and edit vehicle light
          patterns for{" "}
          <span className="font-bold text-gradient-primary">Grand Theft Auto V</span>{" "}
          and <span className="font-bold text-gradient-primary">FiveM</span>{" "}
          servers. We offer a simple and intuitive interface, so you can
          create your patterns in a few clicks.
        </motion.p>
      </div>
    </section>
  );
}
