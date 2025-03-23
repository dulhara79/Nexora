import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    id: 1,
    content: "This platform has completely transformed my learning experience. The structured learning plans made it easy to pick up web development, and the community feedback helped me improve quickly.",
    author: "Sarah Johnson",
    role: "Graphic Designer turned Web Developer",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    content: "Being able to share my cooking techniques and get instant feedback has not only improved my skills but also connected me with other food enthusiasts around the world.",
    author: "Michael Chen",
    role: "Culinary Arts Student",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    id: 3,
    content: "The progress tracking feature keeps me motivated. I've been learning photography for 3 months, and seeing my growth visually through my timeline is incredibly rewarding.",
    author: "Emma Rodriguez",
    role: "Amateur Photographer",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Community Says</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of users who are sharing skills and accelerating their learning journey.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Quote icon */}
          <div className="absolute top-0 left-10 transform -translate-y-1/2">
            <svg className="h-20 w-20 text-indigo-100" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <img
                  className="h-20 w-20 rounded-full object-cover border-4 border-indigo-100 shadow-md mb-6"
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].author}
                />
                <p className="text-xl md:text-2xl text-gray-700 italic mb-8">"{testimonials[currentIndex].content}"</p>
                <h4 className="font-bold text-lg text-gray-900">{testimonials[currentIndex].author}</h4>
                <p className="text-indigo-600">{testimonials[currentIndex].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;