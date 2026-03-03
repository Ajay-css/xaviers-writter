import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 143, label: "Years of Excellence" },
  { value: 3617, label: "Students Strength" },
  { value: 150, label: "Qualified Staff" },
  { value: 98, label: "Academic Success %" },
];

const About = () => {
  return (
    <section className="relative py-28 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-blue-100 via-white to-blue-200 overflow-hidden">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          About{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            St. Xavier's Higher Secondary School
          </span>
        </h2>

        <p className="mt-6 text-gray-700 text-lg leading-relaxed">
          St. Xavier’s Higher Secondary School stands as a symbol of discipline,
          academic excellence and holistic development. With a rich legacy of
          nurturing young minds, the institution focuses on character building,
          strong moral values and intellectual growth.
        </p>
      </div>

      {/* Circular Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-14 text-center">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="transparent"
                />
                <motion.circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#2563eb"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 60 -
                      (item.value / 100) * (2 * Math.PI * 60),
                  }}
                  transition={{ duration: 1.5 }}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.value}
                  {item.label.includes("%") && "%"}
                </h3>
              </div>
            </div>

            <p className="mt-6 text-gray-700 font-medium">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default About;
