// import React, { useState } from 'react';
// import ProgressBar from '../../components/LearningPlan/ProgressBar.jsx';
// import Timeline from '../../components/LearningPlan/Timeline.jsx';
// import RecipeCard from '../../components/LearningPlan/RecipeCard.jsx';

// const ProgressPage = () => {
//   const [plan, setPlan] = useState({
//     level: 'beginner',
//     cuisines: [
//       {
//         name: 'Indian Beginner',
//         recipes: [
//           { name: 'Masala Dosa', isCompleted: false },
//           { name: 'Poha', isCompleted: false },
//           { name: 'Aloo Paratha', isCompleted: false },
//           { name: 'Chana Chaat', isCompleted: false },
//           { name: 'Vegetable Upma', isCompleted: false },
//         ],
//       },
//       {
//         name: 'Italian Beginner',
//         recipes: [
//           { name: 'Spaghetti Aglio e Olio', isCompleted: false },
//           { name: 'Margherita Pizza', isCompleted: false },
//           { name: 'Bruschetta', isCompleted: false },
//           { name: 'Pesto Pasta', isCompleted: false },
//           { name: 'Tiramisu', isCompleted: false },
//         ],
//       },
//       {
//         name: 'Thai Beginner',
//         recipes: [
//           { name: 'Pad Thai', isCompleted: false },
//           { name: 'Green Curry', isCompleted: false },
//           { name: 'Tom Yum Soup', isCompleted: false },
//           { name: 'Thai Fried Rice', isCompleted: false },
//           { name: 'Spring Rolls', isCompleted: false },
//         ],
//       },
//     ],
//   });

//   const handleToggleRecipe = (cuisineIndex, recipeIndex) => {
//     const newPlan = { ...plan };
//     const recipe = newPlan.cuisines[cuisineIndex].recipes[recipeIndex];
//     recipe.isCompleted = !recipe.isCompleted;
//     setPlan(newPlan);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-10">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">
//           🔥 Your Current Progress
//         </h2>
//         <ProgressBar plan={plan} />
//         <Timeline cuisines={plan.cuisines} />

//         <div className="mt-12">
//           <h2 className="text-2xl font-bold text-blue-800 mb-4">📋 Your Recipes</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {plan.cuisines.map((cuisine, cIdx) =>
//               cuisine.recipes.map((recipe, rIdx) => (
//                 <RecipeCard
//                   key={`${cIdx}-${rIdx}`}
//                   recipe={recipe}
//                   onToggle={() => handleToggleRecipe(cIdx, rIdx)}
//                 />
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProgressPage;

// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';

// const levelStyles = {
//   beginner: {
//     color: 'text-blue-800',
//     border: 'border-blue-600',
//     accent: 'bg-blue-100',
//     shadow: 'shadow-blue-200',
//   },
//   intermediate: {
//     color: 'text-yellow-800',
//     border: 'border-yellow-600',
//     accent: 'bg-yellow-100',
//     shadow: 'shadow-yellow-200',
//   },
//   advanced: {
//     color: 'text-red-800',
//     border: 'border-red-600',
//     accent: 'bg-red-100',
//     shadow: 'shadow-red-200',
//   },
// };

// const ProgressPage = () => {
//   const location = useLocation();
//   const { cuisine, level } = location.state || {};
//   const [recipes, setRecipes] = useState(cuisine ? cuisine.recipes : []);

//   const style = levelStyles[level?.toLowerCase()] || levelStyles.beginner;

//   if (!cuisine) return <div>Loading...</div>;

//   const handleMarkAsDone = (index) => {
//     const updated = [...recipes];
//     updated[index].isCompleted = !updated[index].isCompleted;
//     setRecipes(updated);
//   };

//   const calculateCuisineProgress = () => {
//     const completed = recipes.filter((r) => r.isCompleted).length;
//     return Math.round((completed / recipes.length) * 100);
//   };

//   return (
//     <div className={`min-h-screen ${style.accent} p-10`}>
//       <div className="max-w-7xl mx-auto">
//         <h1 className={`text-4xl font-extrabold ${style.color} mb-6 text-center drop-shadow`}>
//           My Plan: {cuisine.name} <span className="text-lg font-medium">({level})</span>
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {recipes.map((recipe, index) => (
//             <div
//               key={index}
//               className={`relative p-6 bg-white rounded-xl border-l-8 ${style.border} ${style.shadow} shadow-xl hover:scale-[1.015] transition-transform`}
//             >
//               <img
//                 src={recipe.image || 'https://via.placeholder.com/400x200.png?text=Delicious+Dish'}
//                 alt={recipe.name}
//                 className="rounded-lg w-full h-40 object-cover mb-4"
//               />
//               <h2 className={`text-xl font-bold mb-2 ${style.color}`}>
//                 🍽️ {recipe.name}
//               </h2>

//               <div className="text-gray-700 text-sm mb-2">
//                 <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500 mb-2">
//                   ⏱️ Prep Time: {recipe.time || '30 mins'}
//                 </span>

//                 <h4 className="font-semibold mt-2">🧂 Ingredients:</h4>
//                 <ul className="list-disc ml-5 mb-2">
//                   {(recipe.ingredients || ['Salt', 'Love', 'Magic']).map((item, idx) => (
//                     <li key={idx}>{item}</li>
//                   ))}
//                 </ul>

//                 <h4 className="font-semibold mt-2">👩‍🍳 Method:</h4>
//                 <p className="text-sm text-gray-600">
//                   {recipe.method || 'Combine ingredients, cook with care, and enjoy!'}
//                 </p>
//               </div>

//               <div className="mt-4 flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={recipe.isCompleted}
//                   onChange={() => handleMarkAsDone(index)}
//                   className="mr-2 w-4 h-4 accent-current"
//                 />
//                 <span className="text-gray-600 text-sm">Mark as Done</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-12 text-center">
//           <h3 className={`text-2xl font-bold ${style.color}`}>
//             Cuisine Progress: {calculateCuisineProgress()}%
//           </h3>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProgressPage;





import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';

const ProgressPage = () => {
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
      
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold text-center mb-10 ${theme.text}`}>
          🍽️ My Plan – <span className="capitalize">{cuisine?.name}</span>
        </h1>

        {progress === 100 && (
          <div className="text-center mb-10 animate-bounce">
            <h2 className="text-3xl font-bold text-green-600 drop-shadow-md">🎉 You Did It, Master Chef! 🎉</h2>
            <p className="text-gray-600 mt-2">Every recipe completed. Go treat yourself to dessert 😋</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-10">
          <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>
            Progress: {progress}%
          </h3>
          <div className="w-full h-4 bg-gray-200 rounded-full">
            <div
              className={`${theme.progressBar} h-4 rounded-full transition-all`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, idx) => (
            <div
              key={idx}
              className={`bg-white shadow-lg rounded-xl p-5 border-l-8 ${theme.border} hover:shadow-xl transition-all`}
            >
              <img
                src={recipe.image || 'https://via.placeholder.com/400x200.png?text=Yummy+Dish'}
                alt={recipe.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className={`text-lg font-bold mb-2 ${theme.text}`}>{recipe.name}</h2>

              <div className="mb-3">
                <span className="text-sm text-gray-500">⏱️ Time:</span>{' '}
                <span className="font-medium text-gray-700">{recipe.time || '30 mins'}</span>
              </div>

              <div>
                <h4 className="font-semibold mb-1 text-gray-700">🧂 Ingredients</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {recipe.ingredients?.length ? (
                    recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)
                  ) : (
                    <li>Coming soon...</li>
                  )}
                </ul>
              </div>

              <div className="mt-3">
                <h4 className="font-semibold mb-1 text-gray-700">👩‍🍳 Method</h4>
                <p className="text-sm text-gray-600">
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

export default ProgressPage;

