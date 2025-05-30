"use client";

import { motion } from "motion/react";

export default function FeaturesSection() {
  return (
    <section id="features" className="px-12 py-16 xl:px-20">
      <h2 className="mb-12 text-center font-bold text-3xl text-gray-400">
        Why should you choose{" "}
        <span className="mr-0.5 text-white">
          Siren<span className="text-gradient-primary">X</span>
        </span>
        ?
      </h2>

      <div className="grid grid-cols-2 gap-12 2xl:grid-cols-4">
        <FeatureCard
          emoji="🧠"
          title="Easy to learn and use"
          delay={0.25}
          content={
            <>
              We designed <span className="font-bold text-white">SirenX</span>{" "}
              to be as simple as possible, so you can use it without any hassle.
              You don&apos;t need to be an expert to use it: just open the
              editor, import your{" "}
              <kbd>
                <kbd>carcols.meta</kbd>
              </kbd>{" "}
              file, or just start creating a new one.
            </>
          }
        />
        
        <FeatureCard
          emoji="⌛"
          title="Save your time"
          delay={0.5}
          content={
            <>
              We know how time-consuming it is to manually create/edit vehicle
              light patterns.{" "}
              <span className="font-bold text-white">SirenX</span> is here to
              save your time. You can edit your{" "}
              <kbd>
                <kbd>carcols.meta</kbd>
              </kbd>{" "}
              file in a few clicks, and download it back to your computer. Spend
              your time on more important things.
            </>
          }
        />
        
        <FeatureCard
          emoji="💰"
          title="Absolutely free"
          delay={0.75}
          content={
            <>
              We believe that everyone should have access to the best tools, so
              we made <span className="font-bold text-white">SirenX</span>{" "}
              absolutely free. You can use it as much as you want. If you like
              it, you can support us by sharing it with your friends or using
              the support button (on all pages footer or in the right-corner on
              the editor page)
            </>
          }
        />
        
        <FeatureCard
          emoji="🔧"
          title="Advanced features"
          delay={1.0}
          content={
            <>
              In addition to colors, we provide other options to customize your
              patterns, such as: direction, intensity and even multiples. We are
              constantly working on new features to make{" "}
              <span className="font-bold text-white">SirenX</span> even better.
              If you have any suggestions, feel free to contact us.
            </>
          }
        />
      </div>
    </section>
  );
}

function FeatureCard({ emoji, title, content, delay }) {
  return (
    <motion.div
      viewport={{ once: true, margin: "-100px" }}
      initial={{ scale: 0.0 }}
      whileInView={{ scale: 1.0 }}
      transition={{ delay }}
      className="h-auto rounded-lg border border-gray-700/70 bg-gray-500/20 px-8 py-6 text-center"
    >
      <h1 className="text-[32px]">{emoji}</h1>

      <h2 className="font-bold text-white tracking-wider">{title}</h2>

      <p className="mt-4 text-white/60">{content}</p>
    </motion.div>
  );
}
