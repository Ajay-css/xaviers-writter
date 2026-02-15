import React from "react";
import { motion } from "framer-motion";
import { Feather, FileText, Globe, PenTool } from "lucide-react";
import f1 from "../../assets/f1.svg";
import f2 from "../../assets/f2.svg";
import f3 from "../../assets/f3.svg";
import f4 from "../../assets/f4.svg";

const featuresList = [
  "Real-time Collaboration",
  "Modern UI/UX Design",
  "Secure Authentication",
  "Fast Performance",
  "Responsive Layout",
  "SEO Optimized",
  "Cloud Deployment Ready",
  "Scalable Architecture",
];

const features = [
  {
    title: "Creative Workspace",
    desc: "A distraction-free environment designed to help you focus deeply and write without interruptions.",
    icon: Feather,
    image: f1,
  },
  {
    title: "Elegant Formatting",
    desc: "Craft visually stunning documents with clean typography and structured layouts.",
    icon: FileText,
    image: f2,
  },
  {
    title: "Publish Everywhere",
    desc: "Share your writing across multiple platforms instantly with seamless export.",
    icon: Globe,
    image: f3,
  },
  {
    title: "Version History",
    desc: "Track revisions, restore drafts and manage your creative journey with ease.",
    icon: PenTool,
    image: f4,
  },
];

const Features = () => {
  return (
    <section className="relative py-32 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">

      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/20 rounded-full blur-[140px]"></div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
          Powerful{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Capabilities
          </span>
        </h2>
        <p className="mt-6 text-gray-600 text-lg">
          Everything you need to build, publish and scale your ideas effortlessly.
        </p>
      </div>

      {/* ===== Premium Double Marquee ===== */}
      <div className="relative mb-32">

        {/* Fade Edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Row 1 */}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="flex gap-16 marquee-left">
            {[...featuresList, ...featuresList].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-700 text-lg font-medium">
                <div className="relative flex size-3.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping duration-300"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-green-600"></span>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 Reverse */}
        <div className="overflow-hidden whitespace-nowrap mt-6">
          <div className="flex gap-16 marquee-right">
            {[...featuresList, ...featuresList].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-700 text-lg font-medium">
                <div className="relative flex size-3.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping duration-300"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-green-600"></span>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Feature Cards ===== */}
      <div className="space-y-40">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
            >

              {/* Text */}
              <div className="flex-1">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-lg border border-blue-100 text-blue-600 mb-8">
                  <Icon size={28} />
                </div>

                <h3 className="text-4xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
                  {feature.desc}
                </p>

                <button className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-105 transition">
                  Explore Feature
                </button>
              </div>

              {/* Image Card */}
              <motion.div
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="flex-1 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 blur-2xl rounded-3xl"></div>

                <div className="relative bg-white border border-blue-100 rounded-3xl p-12 shadow-2xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full max-w-md mx-auto"
                  />
                </div>
              </motion.div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
};

export default Features;
