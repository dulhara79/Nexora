import React from 'react';

const ProgressBar = ({ plan }) => {
  const totalRecipes = plan.cuisines.reduce((acc, cuisine) => acc + cuisine.recipes.length, 0);
  const completedRecipes = plan.cuisines.reduce(
    (acc, cuisine) => acc + cuisine.recipes.filter(r => r.isCompleted).length,
    0
  );
  const percentage = totalRecipes === 0 ? 0 : Math.round((completedRecipes / totalRecipes) * 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
      <div
        className="h-full text-white text-sm font-semibold text-center flex items-center justify-center bg-blue-600"
        style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}>
        {percentage}% Complete
      </div>
    </div>
  );
};

export default ProgressBar;