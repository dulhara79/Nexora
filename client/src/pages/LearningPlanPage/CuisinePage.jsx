// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import CuisineCard from '../../components/LearningPlan/CuisineCard';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';

// const API_BASE = 'http://localhost:5000';

// const CuisinePage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [cuisinesByLevel, setCuisinesByLevel] = useState({
//     beginner: [],
//     intermediate: [],
//     advanced: []
//   });

//   useEffect(() => {
//     if (location.hash) {
//       const target = document.getElementById(location.hash.replace('#', ''));
//       if (target) {
//         setTimeout(() => {
//           target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }, 100);
//       }
//     }
//   }, [location]);

//   useEffect(() => {
//     const fetchCuisines = async () => {
//       try {
//         const levels = ['beginner', 'intermediate', 'advanced'];
//         const results = await Promise.all(
//           levels.map(level =>
//             fetch(`${API_BASE}/api/cuisines?level=${level}`)
//               .then(res => {
//                 if (!res.ok) throw new Error(`Failed to fetch cuisines for level ${level}`);
//                 return res.json();
//               })
//           )
//         );
//         setCuisinesByLevel({
//           beginner: results[0],
//           intermediate: results[1],
//           advanced: results[2]
//         });
//       } catch (err) {
//         console.error('Error loading cuisines:', err);
//       }
//     };

//     fetchCuisines();
//   }, []);

//   const handleSelectCuisine = (cuisine, level) => {
//     navigate(`/recipe/${cuisine.name}`, {
//       state: { cuisine, level }
//     });
//   };

//   const renderCuisineCards = (category, color) => (
//     <div className="scroll-smooth">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {cuisinesByLevel[category]?.map((cuisine, index) => (
//           <CuisineCard
//             key={index}
//             cuisine={cuisine}
//             onSelectCuisine={() => handleSelectCuisine(cuisine, category)}
//             color={color}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <NavbarLP />
//       <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-10">
//         <div className="max-w-7xl mx-auto -space-y-8 -mt-20">
//           <section>
//             <h2 id="beginner" className="text-3xl font-extrabold text-blue-800 text-center mb-8 animate-glowIn">🥄 Beginner Level</h2>
//             {renderCuisineCards('beginner', 'blue')}
//           </section>
//           <section>
//             <h2 id="intermediate" className="text-3xl font-extrabold text-yellow-800 text-center mb-8 animate-glowIn">🍝 Intermediate Level</h2>
//             {renderCuisineCards('intermediate', 'yellow')}
//           </section>
//           <section>
//             <h2 id="advanced" className="text-3xl font-extrabold text-red-800 text-center mb-8 animate-glowIn">🍽️ Advanced Level</h2>
//             {renderCuisineCards('advanced', 'red')}
//           </section>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CuisinePage;












import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CuisineCard from '../../components/LearningPlan/CuisineCard';
import NavbarLP from '../../components/LearningPlan/NavbarLP';

const API_BASE = 'http://localhost:5000';

const CuisinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cuisinesByLevel, setCuisinesByLevel] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });

  // helper to unwrap Spring HATEOAS payloads
  const extractEmbedded = (data) => {
    const embedded = data._embedded || {};
    const key = Object.keys(embedded)[0];
    return embedded[key] ?? [];
  };

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const results = await Promise.all(
          levels.map(level =>
            fetch(`${API_BASE}/api/cuisines?level=${level}`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch cuisines for level ${level}`);
                return res.json();
              })
          )
        );
        setCuisinesByLevel({
          beginner: extractEmbedded(results[0]),
          intermediate: extractEmbedded(results[1]),
          advanced: extractEmbedded(results[2])
        });
      } catch (err) {
        console.error('Error loading cuisines:', err);
      }
    };

    fetchCuisines();
  }, []);

  const handleSelectCuisine = (cuisine, level) => {
    navigate(`/recipe/${cuisine.name}`, {
      state: { cuisine, level }
    });
  };

  const renderCuisineCards = (category, color) => (
    <div className="scroll-smooth">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cuisinesByLevel[category]?.map((cuisine, index) => (
          <CuisineCard
            key={index}
            cuisine={cuisine}
            onSelectCuisine={() => handleSelectCuisine(cuisine, category)}
            color={color}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <NavbarLP />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-10">
        <div className="max-w-7xl mx-auto -space-y-8 -mt-20">
          <section>
            <h2 id="beginner" className="text-3xl font-extrabold text-blue-800 text-center mb-8 animate-glowIn">🥄 Beginner Level</h2>
            {renderCuisineCards('beginner', 'blue')}
          </section>
          <section>
            <h2 id="intermediate" className="text-3xl font-extrabold text-yellow-800 text-center mb-8 animate-glowIn">🍝 Intermediate Level</h2>
            {renderCuisineCards('intermediate', 'yellow')}
          </section>
          <section>
            <h2 id="advanced" className="text-3xl font-extrabold text-red-800 text-center mb-8 animate-glowIn">🍽️ Advanced Level</h2>
            {renderCuisineCards('advanced', 'red')}
          </section>
        </div>
      </div>
    </>
  );
};

export default CuisinePage;




