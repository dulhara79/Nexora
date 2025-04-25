import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorks from '../components/sections/HowItWorks';
import Testimonials from '../components/sections/Testimonials';
import Footer from '../components/layout/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/LandingPage.css'
// test merge to develop/api branch
const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;