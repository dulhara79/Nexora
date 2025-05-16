import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';
import Header from "../../components/common/NewPageHeader";

const CompletedChallenges = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header />
    <motion.div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #ffffff, #f3f4f6)',
        padding: '48px 16px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('https://www.transparenttextures.com/patterns/light-wool.png')",
          opacity: 0.1,
          animation: 'pulse 10s infinite',
        }}
      ></div>
      <div style={{ maxWidth: '896px', margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <motion.h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'transparent',
            background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            textShadow: '0 0 10px rgba(0, 0, 255, 0.2)',
            marginBottom: '24px',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          No Completed Challenges Yet
        </motion.h1>
        <motion.p
          style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            marginBottom: '32px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          You haven't completed any challenges yet. Jump into some cooking challenges to showcase your skills!
        </motion.p>
        <motion.button
          onClick={() => navigate('/challenges')}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '9999px',
            fontWeight: '600',
            boxShadow: '0 0 10px rgba(0, 0, 255, 0.2)',
            cursor: 'pointer',
            border: 'none',
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 0, 255, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Challenges
        </motion.button>
      </div>
    </motion.div>
    </>
  );
};

export default CompletedChallenges;