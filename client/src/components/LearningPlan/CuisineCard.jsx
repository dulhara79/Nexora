// import React from 'react';

// const CuisineCard = ({ cuisine, onSelectCuisine }) => {
//   return (
//     <div
//       onClick={() => onSelectCuisine(cuisine)}
//       className="cursor-pointer bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden transition-transform hover:scale-105"
//     >
//       <img
//         src={cuisine.image}
//         alt={cuisine.name}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-xl font-semibold text-blue-800">{cuisine.name}</h3>
//         <p className="text-sm text-gray-500">{cuisine.recipes.length} recipes inside</p>
//       </div>
//     </div>
//   );
// };

// export default CuisineCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const CuisineCard = ({ cuisine, onSelectCuisine }) => {
  const navigate = useNavigate();

  const handleAddToPlan = () => {
    navigate(`/progress/${cuisine.name}`, { state: { cuisine } });
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer">
      <img className="w-full h-48 object-cover" src={cuisine.image} alt={cuisine.name} />
      <div className="p-4">
        <h3 className="text-xl font-bold text-blue-900">{cuisine.name}</h3>
        <p className="text-gray-600 text-sm">{cuisine.description}</p>
        <button 
          onClick={handleAddToPlan} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
        >
          + Add to My Plan
        </button>
      </div>
    </div>
  );
};

export default CuisineCard;
