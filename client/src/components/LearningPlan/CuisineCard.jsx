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

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const CuisineCard = ({ cuisine, onSelectCuisine }) => {
//   const navigate = useNavigate();

//   const handleAddToPlan = () => {
//     navigate(`/progress/${cuisine.name}`, { state: { cuisine } });
//   };

//   return (
//     <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white cursor-pointer">
//       <img className="w-full h-48 object-cover" src={cuisine.image} alt={cuisine.name} />
//       <div className="p-4">
//         <h3 className="text-xl font-bold text-blue-900">{cuisine.name}</h3>
//         <p className="text-gray-600 text-sm">{cuisine.description}</p>
//         <button 
//           onClick={handleAddToPlan} 
//           className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
//         >
//           + Add to My Plan
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CuisineCard;



const CuisineCard = ({ cuisine, onSelectCuisine, color = 'blue' }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-xl border-t-8 border-${color}-500 p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300`}
    >
      <img
        src={cuisine.image}
        alt={cuisine.name}
        className="w-full h-60 object-cover rounded-lg mb-5"
      />
      <div className="text-center">
        <h3 className={`text-2xl font-semibold text-${color}-700 mb-4`}>
          {cuisine.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{cuisine.description}</p>
        <button
          onClick={onSelectCuisine}
          className={`mt-2 px-5 py-2 rounded-full bg-${color}-500 hover:bg-${color}-600 text-white font-semibold transition`}
        >
          View Recipes
        </button>
      </div>
    </div>
  );
};
export default CuisineCard;
