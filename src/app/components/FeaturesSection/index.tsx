"use client";

import { m } from "motion/react";

const features = [
  {
    emoji: "🧠",
    title: "Easy to learn and use",
    content: (
      <>
        We designed <span className="font-semibold text-white">SirenX</span>{" "}
        to be as simple as possible, so you can use it without any hassle.
        You don&apos;t need to be an expert to use it: just open the
        editor, import your{" "}
        <kbd><kbd>carcols.meta</kbd></kbd>{" "}
        file, or just start creating a new one.
      </>
    ),
  },
  {
    emoji: "⌛",
    title: "Save your time",
    content: (
      <>
        We know how time-consuming it is to manually create/edit vehicle
        light patterns.{" "}
        <span className="font-semibold text-white">SirenX</span> is here to
        save your time. You can edit your{" "}
        <kbd><kbd>carcols.meta</kbd></kbd>{" "}
        file in a few clicks, and download it back to your computer.
      </>
    ),
  },
  {
    emoji: "💰",
    title: "Absolutely free",
    content: (
      <>
        We believe that everyone should have access to the best tools, so
        we made <span className="font-semibold text-white">SirenX</span>{" "}
        absolutely free. You can use it as much as you want. If you like
        it, consider supporting us!
      </>
    ),
  },
  {
    emoji: "🔧",
    title: "Advanced features",
    content: (
      <>
        In addition to colors, we provide other options to customize your
        patterns, such as: direction, intensity and even multiples. We are
        constantly working on new features to make{" "}
        <span className="font-semibold text-white">SirenX</span> even better.
      </>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <m.h2
          className="mb-16 text-center font-bold text-3xl text-white/80 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Why choose{" "}
          <span className="text-white">
            Siren<span className="text-emerald-400">X</span>
          </span>
          ?
        </m.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              emoji={feature.emoji}
              title={feature.title}
              content={feature.content}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  emoji: string;
  title: string;
  content: React.ReactNode;
  index: number;
}

function FeatureCard({ emoji, title, content, index }: FeatureCardProps) {
  return (
    <m.div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-emerald-400/30 hover:bg-white/[0.07]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-emerald-400/0 to-emerald-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-emerald-400/5 group-hover:to-transparent" />

      <m.span
        className="mb-4 block text-4xl"
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
      >
        {emoji}
      </m.span>

      <h3 className="mb-3 font-bold text-lg text-white tracking-wide">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-white/50">
        {content}
      </p>
    </m.div>
  );
}
