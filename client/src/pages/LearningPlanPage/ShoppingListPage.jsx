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





























// import React, { useState, useEffect } from 'react';
// import Navbar from '../../components/common/NewPageHeader';

// const API_BASE = 'http://localhost:5000';

// const ShoppingListPage = () => {
//   const [cuisines, setCuisines] = useState([]);

//   // Helper to unwrap HATEOAS payloads
//   const extractEmbedded = data => {
//     const emb = data._embedded || {};
//     const key = Object.keys(emb)[0];
//     return emb[key] ?? [];
//   };

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const lvls = ['beginner','intermediate','advanced'];
//         const results = await Promise.all(
//           lvls.map(lvl =>
//             fetch(`${API_BASE}/api/cuisines?level=${lvl}`)
//               .then(res => res.ok ? res.json() : Promise.reject())
//           )
//         );
//         // Flatten into one array of cuisines
//         const all = results.flatMap(r => extractEmbedded(r));
//         setCuisines(all);
//       } catch(err) {
//         console.error('Could not load cuisines:', err);
//       }
//     };
//     fetchAll();
//   }, []);

//   const handlePrint = () => window.print();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-50 pb-16">
//       <Navbar />

//       {/* Hero */}
//       <header className="relative h-48 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 mb-8">
//         <h1 className="text-3xl md:text-5xl text-white font-extrabold drop-shadow-lg">
//           🛒 Shopping List
//         </h1>
//         <button
//           onClick={handlePrint}
//           className="absolute right-8 top-6 px-4 py-2 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition"
//         >
//           🖨️ Print the Ingredients List
//         </button>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 space-y-8">
//         {cuisines.map((cuisine, ci) => (
//           <section key={ci} className="bg-white shadow-lg rounded-lg overflow-hidden">
//             {/* Cuisine Header */}
//             <div className="px-6 py-6 bg-gradient-to-r from-red-500 to-orange-400">
//               <h2 className="text-3xl font-bold text-white">{cuisine.name}</h2>
//             </div>

//             {/* Recipes */}
//             <div className="divide-y divide-gray-200">
//               {(cuisine.recipes || []).map((r, ri) => (
//                 <div key={ri} className="px-6 py-4">
//                   <h3 className="text-xl font-semibold text-red-600 mb-2">
//                      {r.name} <span className="text-sm text-gray-500"></span>
//                   </h3>
//                   <ul className="list-disc list-inside text-gray-700 space-y-1">
//                     {(r.ingredients || []).map((ing, ii) => (
//                       <li key={ii}>{ing}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </section>
//         ))}

//         {cuisines.length === 0 && (
//           <p className="text-center text-gray-500">Loading ingredients… hold tight!</p>
//         )}

//         <p className="text-center text-gray-600 text-sm">
//           Happy Cooking!
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ShoppingListPage;





import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/NewPageHeader';

const API_BASE = 'http://localhost:5000';

// 🧠 Mini database: ingredient → cost, category, nutrition
const INGREDIENT_DB = {
  "1 cup red lentils": { category: "Grains", cost: 0.5, cal: 230, protein: 18, carbs: 40, fat: 1 },
  "1 small onion": { category: "Produce", cost: 0.3, cal: 45, protein: 1, carbs: 11, fat: 0 },
  "2 cloves garlic": { category: "Produce", cost: 0.2, cal: 10, protein: 0.5, carbs: 2, fat: 0 },
  // ➕ Add more mappings like above...
};

const ShoppingListPage = () => {
  const [cuisines, setCuisines] = useState([]);
  const [scale, setScale] = useState(1); // multiplier
  const [checkedItems, setCheckedItems] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const levels = ['beginner', 'intermediate', 'advanced'];
      const all = await Promise.all(levels.map(level =>
        fetch(`${API_BASE}/api/cuisines?level=${level}`).then(res => res.json())
      ));
      const embed = obj => obj._embedded ? obj._embedded[Object.keys(obj._embedded)[0]] || [] : [];
      setCuisines(all.flatMap(res => embed(res)));
    };
    fetchData();
  }, []);

  const handleCheck = (item) => {
    setCheckedItems(prev =>
      prev.has(item) ? new Set([...prev].filter(i => i !== item)) : new Set(prev.add(item))
    );
  };

  // 🔥 Ingredient grouping
  const groupedIngredients = {};
  let totalCost = 0, totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

  cuisines.forEach(c => {
    (c.recipes || []).forEach(r => {
      (r.ingredients || []).forEach(raw => {
        const key = raw.trim();
        const meta = INGREDIENT_DB[key] || {
          category: "Other", cost: 1, cal: 50, protein: 1, carbs: 5, fat: 1
        };
        if (!groupedIngredients[meta.category]) groupedIngredients[meta.category] = [];
        groupedIngredients[meta.category].push({ name: key, recipe: r.name, cuisine: c.name });

        totalCost += meta.cost * scale;
        totalCal += meta.cal * scale;
        totalProtein += meta.protein * scale;
        totalCarbs += meta.carbs * scale;
        totalFat += meta.fat * scale;
      });
    });
  });

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-50 pb-20">
      <Navbar />

      {/* Header */}
      <header className="h-48 bg-gradient-to-r from-red-500 to-yellow-400 flex items-center justify-center text-white text-4xl font-bold">
        🍅 Ultimate Shopping List
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">

        {/* Serving Size Slider */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-red-600">Portion Multiplier</p>
            <p className="text-sm text-gray-500">Adjust based on how many you're cooking for!</p>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={scale}
            onChange={e => setScale(Number(e.target.value))}
            className="w-full sm:w-60 accent-orange-500"
          />
          <span className="text-lg font-semibold text-orange-600">{scale}x</span>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-yellow-50 border-l-8 border-yellow-400 p-6 rounded shadow-md">
          <h3 className="text-xl font-bold mb-2 text-orange-600">Nutrition Snapshot (est.)</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-800">
            <li>🔥 Calories: <strong>{Math.round(totalCal)}</strong></li>
            <li>💪 Protein: <strong>{Math.round(totalProtein)} g</strong></li>
            <li>🍞 Carbs: <strong>{Math.round(totalCarbs)} g</strong></li>
            <li>🧈 Fat: <strong>{Math.round(totalFat)} g</strong></li>
            <li>💰 Estimated Cost: <strong>${totalCost.toFixed(2)}</strong></li>
          </ul>
        </div>

        {/* Ingredient Lists by Aisle */}
        {Object.entries(groupedIngredients).map(([category, items], idx) => (
          <section key={idx} className="bg-white rounded-lg shadow p-6">
            <h4 className="text-2xl font-bold text-red-500 mb-4">🛒 {category}</h4>
            <ul className="space-y-2">
              {items.map(({ name, recipe, cuisine }, i) => (
                <li key={`${name}-${i}`} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={checkedItems.has(name)}
                    onChange={() => handleCheck(name)}
                    className="mt-1"
                  />
                  <div className={checkedItems.has(name) ? "line-through text-gray-400" : ""}>
                    <span className="font-medium text-gray-800">{name}</span>
                    <span className="ml-2 text-sm text-gray-500 italic">
                      ({recipe} • {cuisine})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Print Button */}
        <div className="text-center">
          <button
            onClick={handlePrint}
            className="px-6 py-2 mt-6 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition"
          >
            🖨️ Print This List
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShoppingListPage;
