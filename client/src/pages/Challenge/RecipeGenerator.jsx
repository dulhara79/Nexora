import React, { useState } from 'react';
import { motion } from 'framer-motion';
import recipes from '../../components/recipes.json';

const RecipeGenerator = () => {
  const [dishName, setDishName] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setError('');
    setRecipe(null);

    setTimeout(() => {
      const found = recipes.recipes.find(
        (r) => r.name.toLowerCase() === dishName.trim().toLowerCase()
      );
      if (found) setRecipe(found);
      else setError('Sorry, no recipe found for this dish. Try another!');
      setIsLoading(false);
    }, 500);
  };

  // Inline style objects
  const styles = {
    container: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f0f4ff 100%)',
      minHeight: '100vh',
      padding: '2rem',
      boxSizing: 'border-box',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#3b82f6',
      marginBottom: '1.5rem',
      fontFamily: 'Orbitron, sans-serif',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #93c5fd',
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255,255,255,0.8)',
      fontSize: '1rem',
      marginBottom: '1rem',
      transition: 'background 0.3s, box-shadow 0.3s',
      outline: 'none',
    },
    button: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
      color: '#fff',
      border: 'none',
      borderRadius: '0.75rem',
      fontWeight: 600,
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.6 : 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    error: {
      color: '#dc2626',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(8px)',
      border: '1px solid #bfdbfe',
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      marginTop: '2rem',
    },
    cardTitle: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#1e3a8a',
      marginBottom: '1rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '0.5rem',
    },
    list: {
      color: '#4b5563',
      marginLeft: '1rem',
      marginBottom: '1rem',
    },
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={styles.title}>Recipe Generator</h1>

      <div>
        <input
          type="text"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          placeholder="Enter a dish name (e.g., Spaghetti Carbonara)"
          style={styles.input}
        />
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(37,99,235,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerate}
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? 'Loading...' : 'Generate Recipe'}
        </motion.button>
      </div>

      {error && (
        <motion.p
          style={styles.error}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {recipe && (
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={styles.cardTitle}>{recipe.name}</h2>

          <h3 style={styles.sectionTitle}>Ingredients:</h3>
          <ul style={styles.list}>
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3 style={styles.sectionTitle}>Instructions:</h3>
          <ol style={styles.list}>
            {recipe.instructions.map((step, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {step}
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecipeGenerator;
