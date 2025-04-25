import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';

const RecipePage = () => {
  const location = useLocation();
  const { cuisine, level } = location.state || {};
  const [recipes, setRecipes] = useState(cuisine?.recipes || []);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (cuisine?.recipes) {
      setRecipes(cuisine.recipes);
    }

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cuisine]);

  const handleMarkAsDone = (index) => {
    const updated = [...recipes];
    updated[index].isCompleted = !updated[index].isCompleted;
    setRecipes(updated);
  };

  const calculateProgress = () => {
    const total = recipes.length;
    const done = recipes.filter((r) => r.isCompleted).length;
    const percent = Math.round((done / total) * 100);
    if (percent === 100 && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000); // confetti lasts 6 seconds
    }
    return percent;
  };

  const theme = {
    beginner: {
      color: 'blue',
      ring: 'ring-blue-300',
      text: 'text-blue-800',
      border: 'border-blue-500',
      progressBar: 'bg-blue-500',
    },
    intermediate: {
      color: 'yellow',
      ring: 'ring-yellow-300',
      text: 'text-yellow-800',
      border: 'border-yellow-500',
      progressBar: 'bg-yellow-500',
    },
    advanced: {
      color: 'red',
      ring: 'ring-red-300',
      text: 'text-red-800',
      border: 'border-red-500',
      progressBar: 'bg-red-500',
    },
  }[level] || {};

  const progress = calculateProgress();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${theme.color}-50 to-white p-10`}>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold text-center mb-10 ${theme.text}`}>
          <span className="capitalize">{cuisine?.name}</span>
        </h1>

        {progress === 100 && (
          <div className="text-center mb-10 animate-bounce">
            <h2 className="text-3xl font-bold text-blue-600 drop-shadow-md">🎉 You Did It, Master Chef! 🎉</h2>
            <p className="text-gray-600 mt-2">Every recipe completed. Go treat yourself to dessert 😋</p>
          </div>
        )}

{/* Progress Bar
<div className="mb-10">
  <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>
    Progress: {progress}%
  </h3>
  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
    <div
      className={`
        h-4 rounded-full transition-all
        ${progress === 100 ? 'bg-blue-500' : theme.progressBar}
      `}
      style={{ width: `${progress}%` }}
    ></div>
  </div>
</div> */}

{/* Progress Bar
<div className="mb-10">
  <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>
    Progress: {progress}%
  </h3>
  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
    <div
      className={`
        h-full rounded-full
        transition-[width] duration-500 ease-out
        ${`bg-${theme.color}-500`}
      `}
      style={{ width: `${progress}%` }}
    />
  </div>
</div> */}

{/* Progress Bar
<div className="mb-10">
  <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>
    Progress: {progress}%
  </h3>
  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
</div> */}

{/* Recipes Grid */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
  {recipes.map((recipe, idx) => (
    <div
      key={idx}
      className={`
        w-full max-w-7xl
        bg-white shadow-lg rounded-xl p-8
        border-l-8 ${theme.border}
        flex flex-col items-center text-center
        hover:shadow-xl transition-all
      `}
    >
      <img
        src={recipe.image || 'https://via.placeholder.com/400x200.png?text=Yummy+Dish'}
        alt={recipe.name}
        className="w-full h-100 object-cover rounded-lg mb-4"
      />
      <h2 className={`text-3xl font-bold mb-5 ${theme.text}`}>{recipe.name}</h2>

      <div className="mb-3">
        <span className="text-sm text-gray-800">⏱️ Time:</span>{' '}
        <span className="font-medium text-gray-700">{recipe.time || '30 mins'}</span>
      </div>

      <div>
        <h4 className="font-semibold mb-1 text-gray-700">🧂 Ingredients</h4>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          {recipe.ingredients?.length
            ? recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)
            : <li>Coming soon...</li>}
        </ul>
      </div>

      <div className="mt-3">
        <h4 className="font-semibold mb-1 text-gray-700">👩‍🍳 Method</h4>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {recipe.method || 'Method details will be available soon.'}
        </p>
      </div>

      {/* Mark as Done */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={recipe.isCompleted}
          onChange={() => handleMarkAsDone(idx)}
          className={`accent-${theme.color}-600 w-4 h-4 mr-2`}
        />
        <span className="text-sm text-gray-700">Mark as Done</span>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};

export default RecipePage;

