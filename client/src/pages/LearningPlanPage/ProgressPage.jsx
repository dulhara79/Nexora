// import React, { useState, useEffect, useContext } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';
// import { AuthContext } from '../../context/AuthContext';

// const API_BASE = 'http://localhost:5000';

// const ProgressPage = () => {
//   const { user, token, loading } = useContext(AuthContext);
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const [ongoingPlans, setOngoingPlans] = useState([]);
//   const [completedPlans, setCompletedPlans] = useState([]);

//   useEffect(() => {
//     if (!loading && !user) navigate('/login');
//   }, [loading, user, navigate]);

//   useEffect(() => {
//     if (!user || !token) return;

//     // 1) Ongoing plans
//     fetch(`${API_BASE}/api/users/${user.id}/learning-plans`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
//       .then(plans => {
//         const withFlags = plans.map(plan => ({
//           ...plan,
//           recipes: plan.recipes.map(r => ({
//             ...r,
//             isDone: r.isDone ?? false
//           }))
//         }));
//         setOngoingPlans(withFlags);
//       })
//       .catch(console.error);

//     // 2) Completed plans
//     fetch(`${API_BASE}/api/users/${user.id}/completed-plans`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(r => (r.ok ? r.json() : []))
//       .then(data => setCompletedPlans(Array.isArray(data) ? data : []))
//       .catch(err => {
//         console.error(err);
//         setCompletedPlans([]);
//       });
//   }, [user, token]);

//   return (
//     <>
//       <NavbarLP />
//       <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 p-10">
//         <h1 className="text-5xl font-extrabold mb-12 text-center text-blue-800">
//           🌟 My Culinary Journey 🌟
//         </h1>

//         {/* Ongoing Section */}
//         <section className="mb-16">
//           <h2 className="text-3xl font-bold mb-6 text-blue-600">Ongoing Adventures</h2>
//           {ongoingPlans.length === 0 ? (
//             <p className="text-center text-gray-600">No cuisines in progress yet!</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {ongoingPlans.map(plan => {
//                 const doneCount = plan.recipes.filter(r => r.isDone).length;
//                 const total = plan.recipes.length;
//                 const progress = Math.round((doneCount / total) * 100);
//                 return (
//                   <div key={plan.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
//                     <h3 className="text-2xl font-semibold text-gray-800 mb-2">{plan.cuisineName}</h3>
//                     <p className="text-gray-600 mb-4">{doneCount}/{total} Recipes Mastered</p>
//                     <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                       <div
//                         className="bg-blue-500 h-3 rounded-full transition-all duration-300"
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         {/* Completed Section */}
//         <section>
//           <h2 className="text-3xl font-bold mb-6 text-green-600">Triumphs</h2>
//           {completedPlans.length === 0 ? (
//             <p className="text-center text-gray-600">No cuisines completed yet—keep cooking!</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {completedPlans.map(plan => (
//                 <div key={plan.id} className="bg-green-100 p-6 rounded-xl shadow-md flex items-center space-x-4">
//                   <span className="text-3xl">🏆</span>
//                   <div>
//                     <h3 className="text-xl font-medium text-green-800">{plan.cuisineName}</h3>
//                     <p className="text-green-600">Mastered!</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </>
//   );
// };

// export default ProgressPage;







import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';
import Navbar from "../../components/common/NewPageHeader";

import { AuthContext } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000';

const ProgressPage = () => {
  const { user, token, loading } = useContext(AuthContext);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [ongoingPlans, setOngoingPlans] = useState([]);
  const [completedPlans, setCompletedPlans] = useState([]);

  // helper to unwrap Spring HATEOAS payloads
  const extractEmbedded = (data) => {
    const embedded = data._embedded || {};
    const key = Object.keys(embedded)[0];
    return embedded[key] ?? [];
  };

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user || !token) return;

    // 1) Ongoing plans
    fetch(`${API_BASE}/api/users/${user.id}/learning-plans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(raw => {
        // raw is a HATEOAS envelope
        const list = extractEmbedded(raw);
        const withFlags = list.map(plan => ({
          ...plan,
          recipes: plan.recipes.map(r => ({
            ...r,
            isDone: r.isDone ?? false
          }))
        }));
        setOngoingPlans(withFlags);
      })
      .catch(console.error);

    // 2) Completed plans
    fetch(`${API_BASE}/api/users/${user.id}/completed-plans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(raw => {
        const list = extractEmbedded(raw);
        setCompletedPlans(list);
      })
      .catch(err => {
        console.error(err);
        setCompletedPlans([]);
      });
  }, [user, token]);

  return (
    <>
      {/* <NavbarLP /> */}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 p-10">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-blue-800">
          🌟 My Culinary Journey 🌟
        </h1>

        {/* Ongoing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-blue-600">Ongoing Adventures</h2>
          {ongoingPlans.length === 0 ? (
            <p className="text-center text-gray-600">No cuisines in progress yet!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingPlans.map(plan => {
                const doneCount = plan.recipes.filter(r => r.isDone).length;
                const total = plan.recipes.length;
                const progress = Math.round((doneCount / total) * 100);
                return (
                  <div key={plan.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{plan.cuisineName}</h3>
                    <p className="text-gray-600 mb-4">{doneCount}/{total} Recipes Mastered</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Completed Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-green-600">Triumphs</h2>
          {completedPlans.length === 0 ? (
            <p className="text-center text-gray-600">No cuisines completed yet—keep cooking!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {completedPlans.map(plan => (
                <div key={plan.id} className="bg-green-100 p-6 rounded-xl shadow-md flex items-center space-x-4">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <h3 className="text-xl font-medium text-green-800">{plan.cuisineName}</h3>
                    <p className="text-green-600">Mastered!</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ProgressPage;
