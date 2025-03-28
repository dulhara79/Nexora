import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Sign up using your social media accounts and customize your profile.",
      icon: "fas fa-user-plus",
    },
    {
      number: "02",
      title: "Share Your Skills",
      description:
        "Upload photos or videos showcasing your skills and talents.",
      icon: "fas fa-share-square",
    },
    {
      number: "03",
      title: "Connect With Others",
      description:
        "Follow other users and engage with their content through likes and comments.",
      icon: "fas fa-users",
    },
    {
      number: "04",
      title: "Track Your Progress",
      description: "Update your learning journey and see how far you've come.",
      icon: "fas fa-chart-line",
    },
  ];

  return (
    <section className="py-24 bg-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50" id="how-it-works">
      <hr className="mx-auto mb-10 border-2 border-indigo-200 max-w-7xl" />
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          How It Works
        </h2>
        <p className="text-lg text-gray-600">Get started in just a few simple steps</p>
      </div>

      <div className="relative max-w-5xl px-5 mx-auto">
        {steps.map((step, index) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.2,
          });

          return (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={
                inView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
              }
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative z-10 flex items-center p-6 mb-16 transition-all duration-300 bg-white border-2 border-transparent shadow-xl hover:border-indigo-200 rounded-2xl group"
            >
              <div className="relative mr-6">
                <div className="absolute transition-all duration-300 bg-indigo-100 rounded-full opacity-50 -inset-3 group-hover:opacity-75"></div>
                <div className="relative z-10 flex items-center justify-center w-20 h-20">
                  <span className="text-5xl font-black text-transparent transition-all duration-300 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 opacity-80 group-hover:opacity-100">
                    {step.number}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 mr-6 transition-all duration-300 transform shadow-lg rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:rotate-6 group-hover:scale-110">
                <i className={`${step.icon} text-3xl text-white drop-shadow-md`}></i>
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-2xl font-bold text-gray-800 transition-colors group-hover:text-indigo-600">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute rotate-90 right-1/2 -bottom-10">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <path
                      d="M20 0 L40 20 L20 40"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-2xl px-8 py-12 mx-auto mt-10 text-center bg-white shadow-2xl rounded-3xl"
      >
        <h3 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Ready to start your journey?
        </h3>
        <a className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1" href="/signup">
          Join Now
        </a>
      </motion.div>
    </section>
  );
};

export default HowItWorks;