import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GiChefToque } from 'react-icons/gi';
import recipes from './recipes.json';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [recipeResult, setRecipeResult] = useState(null);

  const toggleChatbot = () => {
    setOpen(!open);
    setMessage('');
    setRecipeResult(null);
  };

  const handleSubmit = () => {
    if (!message.trim()) return;

    const foundRecipe = recipes.recipes.find(
      (r) => r.name.toLowerCase() === message.trim().toLowerCase()
    );

    if (foundRecipe) {
      setRecipeResult(foundRecipe);
    } else {
      setRecipeResult({ error: 'No recipe found for the search.' });
    }
    setMessage('');
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
      {/* Floating Chef Icon */}
      <motion.div
        onClick={toggleChatbot}
        style={{
          background: open ? '#ef4444' : 'linear-gradient(45deg, #3b82f6, #06b6d4)',
          borderRadius: '50%',
          padding: 12,
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
        whileTap={{ scale: 0.9 }}
      >
        <GiChefToque size={30} color="#fff" />
      </motion.div>

      {open && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: 0,
            width: '350px',
            height: '450px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            padding: '16px',
            overflowY: 'auto',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with title and close button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ color: '#3b82f6', fontSize: '1.25rem' }}>
              🤖 Recipe Bot
            </h3>
            <motion.button
              onClick={toggleChatbot}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: '#4b5563',
              }}
              aria-label="Close chat"
            >
              ✖
            </motion.button>
          </div>

          <p style={{ color: '#4b5563', marginBottom: '12px' }}>
            Ask for a Challenge Help (e.g., "Pasta Perfection")!
          </p>

          {/* Input area */}
          <div style={{ display: 'flex', marginBottom: '12px' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a challenge name..."
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #bfdbfe',
                borderRadius: '4px 0 0 4px',
                background: 'rgba(255, 255, 255, 0.8)',
                outline: 'none',
                color: '#1f2937',
              }}
            />
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: '#fff',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Send
            </motion.button>
          </div>

          {/* Result area */}
          {recipeResult && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: 'rgba(243, 244, 246, 0.8)', borderRadius: '6px' }}>
              {recipeResult.error ? (
                <p style={{ color: '#ef4444' }}>{recipeResult.error}</p>
              ) : (
                <>
                  <h4 style={{ color: '#3b82f6', fontSize: '1.125rem' }}>{recipeResult.name}</h4>
                  <h5 style={{ color: '#1f2937', fontWeight: 600, marginTop: 8 }}>Ingredients:</h5>
                  <ul style={{ listStyleType: 'disc', paddingLeft: 20, marginBottom: 16 }}>
                    {recipeResult.ingredients.map((item, idx) => (
                      <li key={idx} style={{ color: '#4b5563' }}>{item}</li>
                    ))}
                  </ul>
                  <h5 style={{ color: '#1f2937', fontWeight: 600 }}>Instructions:</h5>
                  <ol style={{ listStyleType: 'decimal', paddingLeft: 20 }}>
                    {recipeResult.instructions.map((step, idx) => (
                      <li key={idx} style={{ color: '#4b5563', marginBottom: 4 }}>{step}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
