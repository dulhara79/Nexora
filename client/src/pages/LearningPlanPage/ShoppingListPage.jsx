// // src/pages/ShoppingListPage.jsx

// import React, { useState, useEffect } from 'react';
// import Navbar from '../../components/common/NewPageHeader';

// const API_BASE = 'http://localhost:5000';

// const ShoppingListPage = () => {
//   const [masterList, setMasterList] = useState([]);

//   // Helper for Spring HATEOAS payloads
//   const extractEmbedded = data => {
//     const emb = data._embedded || {};
//     const key = Object.keys(emb)[0];
//     return emb[key] ?? [];
//   };

//   useEffect(() => {
//     const fetchAllCuisines = async () => {
//       try {
//         const levels = ['beginner', 'intermediate', 'advanced'];
//         const results = await Promise.all(
//           levels.map(level =>
//             fetch(`${API_BASE}/api/cuisines?level=${level}`)
//               .then(res => res.ok ? res.json() : Promise.reject())
//           )
//         );
//         // flatten all recipes across all cuisines
//         const cuisines = results.flatMap(r => extractEmbedded(r));
//         const allIngredients = new Set();
//         cuisines.forEach(c => {
//           (c.recipes || []).forEach(r => {
//             (r.ingredients || []).forEach(i => allIngredients.add(i));
//           });
//         });
//         setMasterList(Array.from(allIngredients));
//       } catch (err) {
//         console.error('Failed to load shopping list:', err);
//       }
//     };
//     fetchAllCuisines();
//   }, []);

//   const handlePrint = () => window.print();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white pb-16">
//       <Navbar />

//       {/* Hero Header */}
//       <header className="relative h-48 flex items-center justify-center bg-gray-800 mb-8">
//         <h1 className="text-3xl text-white font-extrabold drop-shadow">
//           🛒 Global Shopping List
//         </h1>
//       </header>

//       <div className="max-w-3xl mx-auto px-4">
//         {/* Intro & Print */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//           <p className="text-gray-700 mb-4 sm:mb-0">
//             Here’s every ingredient you’ll ever need—pulled from all cuisines in our app:
//           </p>
//           <button
//             onClick={handlePrint}
//             className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
//           >
//             🖨️ Print List
//           </button>
//         </div>

//         {/* Master Ingredient List */}
//         <section className="bg-white shadow-md rounded-lg p-6 mb-8 print:bg-transparent print:shadow-none print:p-0">
//           <h2 className="text-2xl font-bold mb-4">📝 Ingredients Index</h2>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//             {masterList.map((ing, idx) => (
//               <li key={idx} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={`item-${idx}`}
//                   className="mr-2 h-4 w-4"
//                 />
//                 <label htmlFor={`item-${idx}`} className="select-none">
//                   {ing}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </section>

//         {/* Footer Note */}
//         <p className="text-center text-gray-500 text-sm">
//           This list is generated automatically from all cuisines (beginner → advanced).
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ShoppingListPage;

// src/pages/ShoppingListPage.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/NewPageHeader';

const API_BASE = 'http://localhost:5000';

const ShoppingListPage = () => {
  const [cuisines, setCuisines] = useState([]);

  // Helper to unwrap HATEOAS payloads
  const extractEmbedded = data => {
    const emb = data._embedded || {};
    const key = Object.keys(emb)[0];
    return emb[key] ?? [];
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const lvls = ['beginner','intermediate','advanced'];
        const results = await Promise.all(
          lvls.map(lvl =>
            fetch(`${API_BASE}/api/cuisines?level=${lvl}`)
              .then(res => res.ok ? res.json() : Promise.reject())
          )
        );
        // Flatten into one array of cuisines
        const all = results.flatMap(r => extractEmbedded(r));
        setCuisines(all);
      } catch(err) {
        console.error('Could not load cuisines:', err);
      }
    };
    fetchAll();
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-50 pb-16">
      <Navbar />

      {/* Hero */}
      <header className="relative h-48 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 mb-8">
        <h1 className="text-3xl md:text-5xl text-white font-extrabold drop-shadow-lg">
          🛒 Shopping List
        </h1>
        <button
          onClick={handlePrint}
          className="absolute right-8 top-6 px-4 py-2 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition"
        >
          🖨️ Print
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {cuisines.map((cuisine, ci) => (
          <section key={ci} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Cuisine Header */}
            <div className="px-6 py-6 bg-gradient-to-r from-red-500 to-orange-400">
              <h2 className="text-3xl font-bold text-white">{cuisine.name}</h2>
            </div>

            {/* Recipes */}
            <div className="divide-y divide-gray-200">
              {(cuisine.recipes || []).map((r, ri) => (
                <div key={ri} className="px-6 py-4">
                  <h3 className="text-xl font-semibold text-red-600 mb-2">
                     {r.name} <span className="text-sm text-gray-500"></span>
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {(r.ingredients || []).map((ing, ii) => (
                      <li key={ii}>{ing}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}

        {cuisines.length === 0 && (
          <p className="text-center text-gray-500">Loading ingredients… hold tight!</p>
        )}

        <p className="text-center text-gray-600 text-sm">
          Generated from all cuisines (beginner ↔ advanced) in the app.
        </p>
      </div>
    </div>
  );
};

export default ShoppingListPage;
