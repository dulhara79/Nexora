//NOT RESTFUL

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Confetti from 'react-confetti';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';

// const RecipePage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { cuisine, level } = location.state || {};
//   const [recipes, setRecipes] = useState(cuisine?.recipes || []);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

//   useEffect(() => {
//     if (cuisine?.recipes) setRecipes(cuisine.recipes);
//     const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [cuisine]);

//   const handleMarkAsDone = (index) => {
//     const updated = [...recipes];
//     updated[index].isCompleted = !updated[index].isCompleted;
//     setRecipes(updated);
//   };

//   const calculateProgress = () => {
//     const total = recipes.length;
//     const done = recipes.filter((r) => r.isCompleted).length;
//     const percent = total ? Math.round((done / total) * 100) : 0;
//     if (percent === 100 && !showConfetti) {
//       setShowConfetti(true);
//       setTimeout(() => setShowConfetti(false), 6000);
//     }
//     return percent;
//   };

//   // Add this cuisine (with all its recipes) to the user's plan
//   const handleAddPlan = async () => {
//     const userId = 'demoUser'; // TODO: replace with real authenticated user ID
//     await fetch('http://localhost:5000/api/learningplan', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId,
//         cuisineName: cuisine.name,
//         level,
//         description: cuisine.description,
//         image: cuisine.image,
//         recipes
//       })
//     });
//     navigate(`/userplan?userId=${userId}`);
//   };

//   const theme = {
//     beginner: { color: 'blue', ring: 'ring-blue-300', text: 'text-blue-800', border: 'border-blue-500', progressBar: 'bg-blue-500' },
//     intermediate: { color: 'yellow', ring: 'ring-yellow-300', text: 'text-yellow-800', border: 'border-yellow-500', progressBar: 'bg-yellow-500' },
//     advanced: { color: 'red', ring: 'ring-red-300', text: 'text-red-800', border: 'border-red-500', progressBar: 'bg-red-500' }
//   }[level] || {};

//   const progress = calculateProgress();

//   return (
//     <>
//       <NavbarLP />
//       <div className="max-w-7xl mx-auto p-10">
//         <div className="text-right mb-6">
//           <button
//             onClick={handleAddPlan}
//             className={`px-4 py-2 rounded-full bg-${theme.color}-500 text-white hover:bg-${theme.color}-600`}
//           >
//             ➕ Add This Cuisine to My Plan
//           </button>
//         </div>

//         <div className={`min-h-screen bg-gradient-to-br from-${theme.color}-50 to-white p-10`}>
//           {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
//           <h1 className={`text-4xl font-bold text-center mb-10 ${theme.text}`}>
//             {cuisine?.name}
//           </h1>
//           {progress === 100 && (
//             <div className="text-center mb-10 animate-bounce">
//               <h2 className="text-3xl font-bold text-blue-600 drop-shadow-md">🎉 You Did It, Master Chef! 🎉</h2>
//               <p className="text-gray-600 mt-2">Every recipe completed. Go treat yourself to dessert 😋</p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
//             {recipes.map((recipe, idx) => (
//               <div
//                 key={idx}
//                 className={`w-full max-w-7xl bg-white shadow-lg rounded-xl p-8 border-l-8 ${theme.border} flex flex-col items-center text-center hover:shadow-xl transition-all`}
//               >
//                 <img
//                   src={recipe.image || 'https://via.placeholder.com/400x200.png?text=Yummy+Dish'}
//                   alt={recipe.name}
//                   className="w-full h-100 object-cover rounded-lg mb-4"
//                 />
//                 <h2 className={`text-3xl font-bold mb-5 ${theme.text}`}>{recipe.name}</h2>
//                 <div className="mb-3">
//                   <span className="text-sm text-gray-800">⏱️ Time:</span>{' '}
//                   <span className="font-medium text-gray-700">{recipe.time || '30 mins'}</span>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold mb-1 text-gray-700">🧂 Ingredients</h4>
//                   <ul className="list-disc list-inside text-gray-600 text-sm">
//                     {recipe.ingredients?.length
//                       ? recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)
//                       : <li>Coming soon...</li>}
//                   </ul>
//                 </div>
//                 <div className="mt-3">
//                   <h4 className="font-semibold mb-1 text-gray-700">👩‍🍳 Method</h4>
//                   <p className="text-sm text-gray-600 whitespace-pre-line">
//                     {recipe.method || 'Method details will be available soon.'}
//                   </p>
//                 </div>
//                 {/* <div className="flex items-center mt-4">
//                   <input
//                     type="checkbox"
//                     checked={recipe.isCompleted}
//                     onChange={() => handleMarkAsDone(idx)}
//                     className={`accent-${theme.color}-600 w-4 h-4 mr-2`}
//                   />
//                   <span className="text-sm text-gray-700">Mark as Done</span>
//                 </div> */}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RecipePage;











//AFTER REST


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Confetti from 'react-confetti';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';

// const API_BASE = 'http://localhost:5000';

// const RecipePage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { cuisine, level } = location.state || {};
//   const [recipes, setRecipes] = useState(cuisine?.recipes || []);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

//   useEffect(() => {
//     if (cuisine?.recipes) setRecipes(cuisine.recipes);
//     const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [cuisine]);

//   const handleMarkAsDone = (index) => {
//     const updated = [...recipes];
//     updated[index].isCompleted = !updated[index].isCompleted;
//     setRecipes(updated);
//   };

//   const calculateProgress = () => {
//     const total = recipes.length;
//     const done = recipes.filter((r) => r.isCompleted).length;
//     const percent = total ? Math.round((done / total) * 100) : 0;
//     if (percent === 100 && !showConfetti) {
//       setShowConfetti(true);
//       setTimeout(() => setShowConfetti(false), 6000);
//     }
//     return percent;
//   };

//   // Add this cuisine (with all its recipes) to the user's plan
//   const handleAddPlan = async () => {
//     const userId = 'demoUser'; // TODO: replace with real authenticated user ID
//     await fetch(`${API_BASE}/api/users/${userId}/learning-plans`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         // userId is set in the backend from the path param
//         cuisineName: cuisine.name,
//         level,
//         description: cuisine.description,
//         image: cuisine.image,
//         recipes
//       })
//     });
//     navigate(`/userplan?userId=${userId}`);
//   };

//   const theme = {
//     beginner: { color: 'blue', ring: 'ring-blue-300', text: 'text-blue-800', border: 'border-blue-500', progressBar: 'bg-blue-500' },
//     intermediate: { color: 'yellow', ring: 'ring-yellow-300', text: 'text-yellow-800', border: 'border-yellow-500', progressBar: 'bg-yellow-500' },
//     advanced: { color: 'red', ring: 'ring-red-300', text: 'text-red-800', border: 'border-red-500', progressBar: 'bg-red-500' }
//   }[level] || {};

//   const progress = calculateProgress();

//   return (
//     <>
//       <NavbarLP />
//       <div className="max-w-7xl mx-auto p-10">
//         <div className="text-right mb-6">
//           <button
//             onClick={handleAddPlan}
//             className={`px-4 py-2 rounded-full bg-${theme.color}-500 text-white hover:bg-${theme.color}-600`}
//           >
//             ➕ Add This Cuisine to My Plan
//           </button>
//         </div>

//         <div className={`min-h-screen bg-gradient-to-br from-${theme.color}-50 to-white p-10`}>
//           {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
//           <h1 className={`text-4xl font-bold text-center mb-10 ${theme.text}`}>
//             {cuisine?.name}
//           </h1>
//           {progress === 100 && (
//             <div className="text-center mb-10 animate-bounce">
//               <h2 className="text-3xl font-bold text-blue-600 drop-shadow-md">🎉 You Did It, Master Chef! 🎉</h2>
//               <p className="text-gray-600 mt-2">Every recipe completed. Go treat yourself to dessert 😋</p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
//             {recipes.map((recipe, idx) => (
//               <div
//                 key={idx}
//                 className={`w-full max-w-7xl bg-white shadow-lg rounded-xl p-8 border-l-8 ${theme.border} flex flex-col items-center text-center hover:shadow-xl transition-all`}
//               >
//                 <img
//                   src={recipe.image || 'https://via.placeholder.com/400x200.png?text=Yummy+Dish'}
//                   alt={recipe.name}
//                   className="w-full h-100 object-cover rounded-lg mb-4"
//                 />
//                 <h2 className={`text-3xl font-bold mb-5 ${theme.text}`}>{recipe.name}</h2>
//                 <div className="mb-3">
//                   <span className="text-sm text-gray-800">⏱️ Time:</span>{' '}
//                   <span className="font-medium text-gray-700">{recipe.time || '30 mins'}</span>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold mb-1 text-gray-700">🧂 Ingredients</h4>
//                   <ul className="list-disc list-inside text-gray-600 text-sm">
//                     {recipe.ingredients?.length
//                       ? recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)
//                       : <li>Coming soon...</li>}
//                   </ul>
//                 </div>
//                 <div className="mt-3">
//                   <h4 className="font-semibold mb-1 text-gray-700">👩‍🍳 Method</h4>
//                   <p className="text-sm text-gray-600 whitespace-pre-line">
//                     {recipe.method || 'Method details will be available soon.'}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RecipePage;








import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { AuthContext } from '../../context/AuthContext';
import jsPDF from "jspdf";


const API_BASE = 'http://localhost:5000';

const RecipePage = () => {

const generatePDF = () => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  // 1. Draw Header Banner
  const bannerHeight = 80;
  doc.setFillColor(255, 204, 102);            // warm yellow
  doc.rect(0, 0, pageWidth, bannerHeight, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(80, 40, 10);                // dark brown
  doc.text(cuisine.name || "Cuisine", pageWidth / 2, bannerHeight / 2 + 8, { align: 'center' });
  y = bannerHeight + 20;

  // 2. Cuisine Image (if available)
  if (cuisine.image) {
    doc.addImage(cuisine.image, 'JPEG', pageWidth - 140, 10, 120, 60, undefined, 'FAST');
  }

  // 3. Level & Description on colored box
  doc.setFillColor(240, 240, 240);             // light grey
  doc.rect(30, y - 10, pageWidth - 60, 50, 'F');
  doc.setFontSize(12);
  doc.setTextColor(30);
  y += 70;

  // 4. Recipes Section Title
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(18);
  doc.setTextColor(200, 30, 30);               // deep red
  doc.text("Recipes", 40, y);
  y += 24;

  // 5. Loop through recipes with colored subheaders
  recipes.forEach((recipe, idx) => {
    if (y > 750) {
      doc.addPage();
      y = 40;
    }

    // Subheader background
    doc.setFillColor(255, 240, 230);           // pale peach
    doc.rect(30, y - 16, pageWidth - 60, 24, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(120, 40, 20);
    doc.text(`${idx + 1}. ${recipe.name}`, 40, y);
    y += 30;

    // Time
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`Time: ${recipe.time || '—'}`, 40, y);
    y += 20;

    // Ingredients label
    doc.setFont('helvetica', 'bold');
    doc.text("Ingredients:", 40, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    (recipe.ingredients || []).forEach((ing) => {
      if (y > 750) {
        doc.addPage();
        y = 40;
      }
      doc.text(`• ${ing}`, 50, y);
      y += 14;
    });

    // Method label
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text("Method:", 40, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(recipe.method || '—', pageWidth - 100);
    lines.forEach((line) => {
      if (y > 750) {
        doc.addPage();
        y = 40;
      }
      doc.text(line, 50, y);
      y += 14;
    });

    y += 24; // space before next recipe
  });

  // 6. Footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });
  }

  // 7. Save & Download
  doc.save(`${(cuisine.name || 'Cuisine').replace(/\s+/g, '_')}_Recipe_Book.pdf`);
};




  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { cuisine, level } = location.state || {};
  const [recipes, setRecipes] = useState(cuisine?.recipes || []);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Redirect while loading or if not authenticated
  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (cuisine?.recipes) setRecipes(cuisine.recipes);
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cuisine]);

  const calculateProgress = () => {
    const total = recipes.length;
    const done = recipes.filter((r) => r.isCompleted).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    if (percent === 100 && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
    return percent;
  };

  const handleAddPlan = async () => {
    if (!user || !token) return;
    await fetch(`${API_BASE}/api/users/${user.id}/learning-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        cuisineName: cuisine.name,
        level,
        description: cuisine.description,
        image: cuisine.image,
        recipes
      })
    });
    navigate(`/userplan?userId=${user.id}`);
  };

  const theme = {
    beginner: { color: 'yellow', ring: 'ring-yellow-300', text: 'text-yellow-800', border: 'border-yellow-500', progressBar: 'bg-yellow-500' },
    intermediate: { color: 'orange', ring: 'ring-orange-300', text: 'text-orange-800', border: 'border-orange-500', progressBar: 'bg-orange-500' },
    advanced: { color: 'red', ring: 'ring-red-300', text: 'text-red-800', border: 'border-red-500', progressBar: 'bg-red-500' }
  }[level] || {};

  const progress = calculateProgress();

  return (
    <>
      <div className="max-w-8xl mx-auto p-10">
        <div className="text-right mb-6 space-x-4">
          <button
            onClick={handleAddPlan}
            className={`px-4 py-2 rounded-full bg-${theme.color}-500 text-white hover:bg-${theme.color}-600`}
          >
            🪄 Add This Cuisine to My Plan
          </button>
          <button
                  onClick={generatePDF}
                  className={`mt-4 px-4 py-2 rounded-full bg-${theme.color}-500 text-white hover:bg-${theme.color}-600`}
                >
                  📄 Generate PDF
                </button>
        </div>
        <div className={`min-h-screen bg-gradient-to-br from-${theme.color}-50 to-white p-10`}>
          {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
          <h1 className={`text-4xl font-bold text-center mb-10 ${theme.text}`}>{cuisine?.name}</h1>
          {progress === 100 && (
            <div className="text-center mb-10 animate-bounce">
              <h2 className="text-3xl font-bold text-blue-600 drop-shadow-md">🎉 You Did It, Master Chef! 🎉</h2>
              <p className="text-gray-600 mt-2">Every recipe completed. Go treat yourself to dessert 😋</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
            {recipes.map((recipe, idx) => (
              <div
                key={idx}
                className={`w-full max-w-7xl bg-white shadow-lg rounded-xl p-8 border-l-8 ${theme.border} flex flex-col items-center text-center hover:shadow-xl transition-all`}
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
                
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipePage;
