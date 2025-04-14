import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const RecipeCard = ({ recipe, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${recipe.isCompleted ? 'bg-green-50 border-green-400 border-2' : 'bg-white'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-blue-800">{recipe.name}</h3>
        </div>
        <div>
          {recipe.isCompleted ? (
            <CheckCircle className="text-green-600 w-6 h-6" />
          ) : (
            <Circle className="text-gray-400 w-6 h-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
