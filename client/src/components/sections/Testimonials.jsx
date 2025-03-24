import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Photography Enthusiast',
      avatar: '/api/placeholder/80/80',
      content: 'This platform has completely transformed how I learn photography. The structured learning plans and feedback from the community have helped me improve faster than I ever thought possible.',
      rating: 5
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Web Developer',
      avatar: '/api/placeholder/80/80',
      content: 'As someone who teaches coding, I love how easy it is to share my knowledge here. The ability to upload short tutorials and track my students\' progress has been invaluable.',
      rating: 5
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Culinary Arts Student',
      avatar: '/api/placeholder/80/80',
      content: 'I\'ve learned more about cooking in three months on this platform than I did in a year of trying to learn on my own. The community is supportive and the feedback is incredibly helpful.',
      rating: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">What Our Users Say</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">Join thousands of satisfied users</p>
        </div>
        
        <div 
          data-aos="fade-up" 
          data-aos-delay="100"
          className="max-w-4xl mx-auto"
        >
          <div className="relative p-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="p-8 bg-white shadow-xl rounded-2xl"
              >
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="object-cover w-20 h-20 border-4 border-indigo-100 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-3 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="mb-6 text-lg italic text-gray-700">
                      "{testimonials[currentIndex].content}"
                    </blockquote>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{testimonials[currentIndex].name}</h4>
                      <p className="text-indigo-600">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-indigo-600 w-6' : 'bg-gray-300 hover:bg-indigo-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;