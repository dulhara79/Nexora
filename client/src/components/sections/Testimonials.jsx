import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Photography Enthusiast',
      avatar: '/assets/avatar-1.jpg',
      content: 'This platform has completely transformed how I learn photography. The structured learning plans and feedback from the community have helped me improve faster than I ever thought possible.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Web Developer',
      avatar: '/assets/avatar-2.jpg',
      content: 'As someone who teaches coding, I love how easy it is to share my knowledge here. The ability to upload short tutorials and track my students\' progress has been invaluable.',
      rating: 5
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Culinary Arts Student',
      avatar: '/assets/avatar-3.jpg',
      content: 'I\'ve learned more about cooking in three months on this platform than I did in a year of trying to learn on my own. The community is supportive and the feedback is incredibly helpful.',
      rating: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 bg-gray-100" id="testimonials" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-2 text-3xl font-bold">What Our Users Say</h2>
        <p className="text-gray-600">Join thousands of satisfied users</p>
      </motion.div>

      <div className="max-w-3xl px-5 mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative p-10 mb-8 bg-white shadow-lg rounded-xl"
          >
            <div className="absolute z-0 top-5 left-5">
              <i className="text-4xl text-gray-300 fas fa-quote-left"></i>
            </div>
            <p className="relative z-10 mb-5 text-lg leading-relaxed text-gray-600">
              {testimonials[currentIndex].content}
            </p>
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star ${
                    i < testimonials[currentIndex].rating 
                      ? 'text-amber-400' 
                      : 'text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            <div className="flex items-center">
              <div className="mr-4 overflow-hidden border-indigo-100 rounded-full w-14 h-14 border-3">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h4 className="mb-1 text-lg font-bold text-gray-800">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-sm text-indigo-500">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                ${index === currentIndex 
                  ? 'bg-indigo-500 transform scale-125' 
                  : 'bg-gray-300'}`}
              onClick={() => handleDotClick(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;