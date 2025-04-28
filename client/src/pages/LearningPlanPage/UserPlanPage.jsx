// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';

// const UserPlanPage = () => {
//   const [params] = useSearchParams();
//   const userId = params.get('userId');
//   const navigate = useNavigate();
//   const [plans, setPlans] = useState([]);

//   // fetch user plans
//   useEffect(() => {
//     fetch(`http://localhost:5000/api/learningplan?userId=${userId}`)
//       .then(r => r.json())
//       .then(setPlans);
//   }, [userId]);

//   const handleRemoveRecipe = async (planId, recipeName) => {
//     const plan = plans.find(p=>p.id===planId);
//     const keep = plan.recipes.map(r=>r.name).filter(n=>n!==recipeName);
//     await fetch(`http://localhost:5000/api/learningplan/${planId}/recipes`, {
//       method:'PATCH',
//       headers:{'Content-Type':'application/json'},
//       body: JSON.stringify(keep)
//     });
//     setPlans(plans.map(p=>p.id===planId ? {...p, recipes: p.recipes.filter(r=>r.name!==recipeName)} : p));
//   };

//   const handleDeletePlan = async (planId) => {
//     await fetch(`http://localhost:5000/api/learningplan/${planId}`, { method:'DELETE' });
//     setPlans(plans.filter(p=>p.id!==planId));
//   };

//   return (
//     <>
//       <NavbarLP />
//       <div className="min-h-screen bg-gray-50 p-10">
//         <h1 className="text-4xl font-bold mb-8 text-center">My Learning Plan</h1>
//         {plans.length===0 && <p className="text-center">No cuisines added yet!</p>}
//         <div className="space-y-8">
//           {plans.map(plan => (
//             <div key={plan.id} className="bg-white p-6 rounded-xl shadow-lg">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-semibold">{plan.cuisineName}</h2>
//                 <button
//                   onClick={()=>handleDeletePlan(plan.id)}
//                   className="text-red-500 hover:underline"
//                 >Delete Cuisine</button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 {plan.recipes.map(r=>(
//                   <div key={r.name} className="border p-4 rounded-lg relative">
//                     <button
//                       onClick={()=>handleRemoveRecipe(plan.id, r.name)}
//                       className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
//                     >✕</button>
//                     <h3 className="font-semibold">{r.name}</h3>
//                     <p className="text-sm text-gray-600">⏱️ {r.time}</p>
//                     <img src={r.image} alt={r.name} className="w-full h-32 object-cover rounded-md my-2" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="text-center mt-10">
//           <button
//             onClick={()=>navigate('/cuisine')}
//             className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
//           >← Back to Cuisines</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserPlanPage;






// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';

// // const API = 'http://localhost:5000';

// const UserPlanPage = () => {
//   const [params] = useSearchParams();
//   const userId = params.get('userId');
//   const navigate = useNavigate();

//   const [plans, setPlans] = useState([]);
//   const [editingPlanId, setEditingPlanId] = useState(null);
//   const [candidateRecipes, setCandidateRecipes] = useState([]); // names only

//   // load user plans
//   useEffect(() => {
//     fetch(`http://localhost:5000/api/learningplan?userId=${userId}`)
//       .then(r => r.json())
//       .then(setPlans);
//   }, [userId]);

//   const startEditing = (plan) => {
//     setEditingPlanId(plan.id);
//     // seed candidate list with current names
//     setCandidateRecipes(plan.recipes.map(r => r.name));
//   };

//   const saveUpdates = async (planId) => {
//     await fetch(
//       `http://localhost:5000/api/learningplan/${planId}/recipes`,
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',            // if you need to send cookies
//         body: JSON.stringify(candidateRecipes)
//       }
//     );

//         // update local state
//         setPlans(plans.map(p =>
//             p.id === planId
//               ? { ...p, recipes: p.recipes.filter(r => candidateRecipes.includes(r.name)) }
//               : p
//           ));
//           setEditingPlanId(null);
//         };

// //   // remove a single recipe
// //   const handleRemoveRecipe = async (planId, recipeName) => {
// //     const plan = plans.find(p => p.id === planId);
// //     const keep = plan.recipes.map(r => r.name).filter(n => n !== recipeName);
// //     await fetch(`${API}/api/learningplan/${planId}/recipes`, {
// //       method: 'PATCH',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(keep)
// //     });
// //     setPlans(plans.map(p => 
// //       p.id === planId 
// //         ? { ...p, recipes: p.recipes.filter(r => r.name !== recipeName) } 
// //         : p
// //     ));
// //   };

//   // delete a whole cuisine plan
//   const handleDeletePlan = async (planId) => {
//     await fetch(`${API}/api/learningplan/${planId}`, { method: 'DELETE' });
//     setPlans(plans.filter(p => p.id !== planId));
//   };

//   // start editing: fetch full cuisine by name
//   const openEditor = async (plan) => {
//     const { cuisineName } = plan;
//     const res = await fetch(`${API}/api/cuisines/by-name?name=${encodeURIComponent(cuisineName)}`);
//     const full = await res.json();
//     setEditingPlan(plan);
//     setAllRecipes(full.recipes);
//     setSelectedNames(plan.recipes.map(r => r.name));
//   };

//   // toggle recipe in the checkbox list
//   const toggleName = (name) => {
//     setSelectedNames(names =>
//       names.includes(name)
//         ? names.filter(n => n !== name)
//         : [...names, name]
//     );
//   };

// //   // save updates back to server
// //   const saveUpdates = async () => {
// //     const planId = editingPlan.id;
// //     await fetch(`${API}/api/learningplan/${planId}/recipes`, {
// //       method: 'PATCH',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(selectedNames)
// //     });
// //     // update local
// //     setPlans(plans.map(p =>
// //       p.id === planId
// //         ? { ...p, recipes: allRecipes.filter(r => selectedNames.includes(r.name)) }
// //         : p
// //     ));
// //     setEditingPlan(null);
// //   };

//   return (
//     <>
//       <NavbarLP />
//       <div className="min-h-screen bg-gray-50 p-10">
//         <h1 className="text-4xl font-bold mb-8 text-center">My Learning Plan</h1>
//         {plans.length === 0 && <p className="text-center">No cuisines added yet!</p>}

//         <div className="space-y-8">
//           {plans.map(plan => (
//             <div key={plan.id} className="bg-white p-6 rounded-xl shadow-lg">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-semibold">{plan.cuisineName}</h2>
//                 <div className="space-x-4">
//                   <button
//                     onClick={() => openEditor(plan)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Update Cuisine
//                   </button>
//                   <button
//                     onClick={() => handleDeletePlan(plan.id)}
//                     className="text-red-500 hover:underline"
//                   >
//                     Delete Cuisine
//                   </button>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 {plan.recipes.map(r => (
//                   <div key={r.name} className="border p-4 rounded-lg relative">
//                     <button
//                       onClick={() => handleRemoveRecipe(plan.id, r.name)}
//                       className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
//                     >
//                       ✕
//                     </button>
//                     <h3 className="font-semibold">{r.name}</h3>
//                     <p className="text-sm text-gray-600">⏱️ {r.time}</p>
//                     <img
//                       src={r.image}
//                       alt={r.name}
//                       className="w-full h-32 object-cover rounded-md my-2"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-10">
//           <button
//             onClick={() => navigate('/cuisine')}
//             className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
//           >
//             ← Back to Cuisines
//           </button>
//         </div>
//       </div>

//       {/* ——— Editor Modal ——— */}
//       {editingPlan && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
//             <h2 className="text-xl font-bold">
//               Edit {editingPlan.cuisineName}
//             </h2>
//             <div className="max-h-64 overflow-auto border p-2 rounded">
//               {allRecipes.map(r => (
//                 <label key={r.name} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedNames.includes(r.name)}
//                     onChange={() => toggleName(r.name)}
//                     className="mr-2"
//                   />
//                   <span>{r.name}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end space-x-4 mt-4">
//               <button
//                 onClick={() => setEditingPlan(null)}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveUpdates}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserPlanPage;






// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';
// import Confetti from 'react-confetti';

// const API_BASE = 'http://localhost:5000';

// const UserPlanPage = () => {
//   const [params] = useSearchParams();
//   const userId = params.get('userId');
//   const navigate = useNavigate();

//   // your existing state
//   const [plans, setPlans] = useState([]);
//   const [editingPlan, setEditingPlan] = useState(null);
//   const [allRecipes, setAllRecipes] = useState([]);
//   const [selectedNames, setSelectedNames] = useState([]);

//   // new confetti state
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight
//   });

//   // keep confetti canvas sized
//   useEffect(() => {
//     const onResize = () =>
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     window.addEventListener('resize', onResize);
//     return () => window.removeEventListener('resize', onResize);
//   }, []);

//   // **FETCH PLANS** and inject isDone:false on every recipe
//   useEffect(() => {
//     fetch(`${API_BASE}/api/learningplan?userId=${userId}`, {
//       credentials: 'include'
//     })
//       .then(r => r.json())
//       .then(raw => {
//         const withFlags = raw.map(plan => ({
//           ...plan,
//           recipes: plan.recipes.map(r => ({ ...r, isDone: false }))
//         }));
//         setPlans(withFlags);
//       })
//       .catch(console.error);
//   }, [userId]);

//   // DELETE a whole cuisine
//   const handleDeletePlan = async (planId) => {
//     await fetch(`${API_BASE}/api/learningplan/${planId}`, {
//       method: 'DELETE',
//       credentials: 'include'
//     });
//     setPlans(plans.filter(p => p.id !== planId));
//   };

//   // OPEN edit modal
//   const startEditing = (plan) => {
//     setEditingPlan(plan);
//     fetch(
//       `${API_BASE}/api/cuisines/by-name?name=${encodeURIComponent(plan.cuisineName)}`,
//       { credentials: 'include' }
//     )
//       .then(r => r.json())
//       .then(cuisine => {
//         setAllRecipes(cuisine.recipes);
//         setSelectedNames(plan.recipes.map(r => r.name));
//       })
//       .catch(console.error);
//   };

//   // TOGGLE in edit modal
//   const toggleName = (name) => {
//     setSelectedNames(ns =>
//       ns.includes(name) ? ns.filter(n => n !== name) : [...ns, name]
//     );
//   };

//   // SAVE edit modal updates
//   const saveUpdates = async () => {
//     const planId = editingPlan.id;
//     await fetch(`${API_BASE}/api/learningplan/${planId}/recipes`, {
//       method: 'PUT',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(selectedNames)
//     });
//     setPlans(plans.map(p =>
//       p.id === planId
//         ? { ...p, recipes: p.recipes.filter(r => selectedNames.includes(r.name)) }
//         : p
//     ));
//     setEditingPlan(null);
//   };

//   // **MARK AS DONE** and if all done → DELETE + CONFETTI
//   const handleRecipeDone = (planId, recipeName) => {
//     setPlans(prev => {
//       // toggle that one recipe
//       const toggled = prev.map(p => {
//         if (p.id !== planId) return p;
//         return {
//           ...p,
//           recipes: p.recipes.map(r =>
//             r.name === recipeName ? { ...r, isDone: !r.isDone } : r
//           )
//         };
//       });

//       // check if that plan is now 100% done
//       const donePlan = toggled.find(p => p.id === planId);
//       if (donePlan && donePlan.recipes.every(r => r.isDone)) {
//         // fire off a DELETE so it won't come back on reload
//         fetch(`${API_BASE}/api/learningplan/${planId}`, {
//           method: 'DELETE',
//           credentials: 'include'
//         }).catch(console.error);

//         // show confetti & hide after 6s
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 6000);

//         // remove it from local immediately
//         return toggled.filter(p => p.id !== planId);
//       }

//       return toggled;
//     });
//   };

//   return (
//     <>
//       {/* 🎉 Confetti + Banner */}
//       {showConfetti && (
//         <>
//           <Confetti width={windowSize.width} height={windowSize.height} />
//           <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
//             <h2 className="text-4xl font-bold text-green-600 bg-white bg-opacity-80 p-4 rounded-lg">
//               🎉 Cuisine Completed! 🎉
//             </h2>
//           </div>
//         </>
//       )}

//       <NavbarLP />
//       <div className="min-h-screen bg-gray-50 p-10">
//         <h1 className="text-4xl font-bold mb-8 text-center">My Learning Plan</h1>
//         {plans.length === 0 && <p className="text-center">No cuisines added yet!</p>}

//         <div className="space-y-8">
//           {plans.map(plan => (
//             <div key={plan.id} className="bg-white p-6 rounded-xl shadow-lg">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-semibold">{plan.cuisineName}</h2>
//                 <div className="space-x-4">
//                   <button
//                     onClick={() => startEditing(plan)}
//                     className="text-blue-500 hover:underline"
//                   >
//                     Update Cuisine
//                   </button>
//                   <button
//                     onClick={() => handleDeletePlan(plan.id)}
//                     className="text-red-500 hover:underline"
//                   >
//                     Delete Cuisine
//                   </button>
//                 </div>
//               </div>

//               {/* Display Mode + Mark-As-Done */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 {plan.recipes.map(r => (
//                   <div key={r.name} className="border p-4 rounded-lg">
//                     <h3 className="font-semibold">{r.name}</h3>
//                     <p className="text-sm text-gray-600">⏱️ {r.time}</p>
//                     <img
//                       src={r.image}
//                       alt={r.name}
//                       className="w-full h-32 object-cover rounded-md my-2"
//                     />
//                     <button
//                       onClick={() => handleRecipeDone(plan.id, r.name)}
//                       className={`mt-2 px-4 py-1 rounded text-white ${
//                         r.isDone
//                           ? 'bg-green-300'
//                           : 'bg-green-600 hover:bg-green-700'
//                       }`}
//                     >
//                       {r.isDone ? '✅ Done' : 'Mark as Done'}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-10">
//           <button
//             onClick={() => navigate('/cuisine')}
//             className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
//           >
//             ← Back to Cuisines
//           </button>
//         </div>
//       </div>

//       {/* ——— Edit Modal ——— */}
//       {editingPlan && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
//             <h2 className="text-xl font-bold">
//               Edit {editingPlan.cuisineName}
//             </h2>
//             <div className="max-h-64 overflow-auto border p-2 rounded">
//               {allRecipes.map(r => (
//                 <label key={r.name} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedNames.includes(r.name)}
//                     onChange={() => toggleName(r.name)}
//                     className="mr-2"
//                   />
//                   <span>{r.name}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end space-x-4 mt-4">
//               <button
//                 onClick={() => setEditingPlan(null)}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveUpdates}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserPlanPage;











































// import React, { useState, useEffect, useContext } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';
// import Confetti from 'react-confetti';
// import { AuthContext } from '../../context/AuthContext';

// const API_BASE = 'http://localhost:5000';

// const UserPlanPage = () => {
//   const { user, token, loading } = useContext(AuthContext);
//   const [params] = useSearchParams();
//   const navigate = useNavigate();

//   const [plans, setPlans] = useState([]);
//   const [editingPlan, setEditingPlan] = useState(null);
//   const [allRecipes, setAllRecipes] = useState([]);
//   const [selectedNames, setSelectedNames] = useState([]);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

//   useEffect(() => {
//     if (!loading && !user) navigate('/login');
//   }, [loading, user, navigate]);

//   useEffect(() => {
//     if (!user || !token) return;
//     fetch(`${API_BASE}/api/users/${user.id}/learning-plans`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
//       .then(raw => {
//         const withFlags = raw.map(plan => ({
//           ...plan,
//           recipes: plan.recipes.map(r => ({ ...r, isDone: r.isDone ?? false }))
//         }));
//         setPlans(withFlags);
//       })
//       .catch(console.error);
//   }, [user, token]);

//   const handleDeletePlan = async planId => {
//     await fetch(`${API_BASE}/api/users/${user.id}/learning-plans/${planId}`, {
//       method: 'DELETE',
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setPlans(plans.filter(p => p.id !== planId));
//   };

//   const startEditing = plan => {
//     setEditingPlan(plan);
//     fetch(`${API_BASE}/api/cuisines/${encodeURIComponent(plan.cuisineName)}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
//       .then(cuisine => {
//         setAllRecipes(cuisine.recipes);
//         setSelectedNames(plan.recipes.map(r => r.name));
//       })
//       .catch(console.error);
//   };

//   const toggleName = name =>
//     setSelectedNames(ns => (ns.includes(name) ? ns.filter(n => n !== name) : [...ns, name]));

//   const saveUpdates = async () => {
//     const planId = editingPlan.id;
//     await fetch(`${API_BASE}/api/users/${user.id}/learning-plans/${planId}/recipes`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(selectedNames)
//     });
//     setPlans(plans.map(p =>
//       p.id === planId
//         ? { ...p, recipes: p.recipes.filter(r => selectedNames.includes(r.name)) }
//         : p
//     ));
//     setEditingPlan(null);
//   };

//   const handleRecipeDone = async (planId, recipeName) => {
//     const plan = plans.find(p => p.id === planId);
//     const recipe = plan.recipes.find(r => r.name === recipeName);
//     const newIsDone = !recipe.isDone;

//     // Optimistic UI
//     setPlans(prev => {
//       const toggled = prev.map(p => {
//         if (p.id !== planId) return p;
//         return {
//           ...p,
//           recipes: p.recipes.map(r => r.name === recipeName ? { ...r, isDone: newIsDone } : r)
//         };
//       });

//       const donePlan = toggled.find(p => p.id === planId);
//       if (donePlan && donePlan.recipes.every(r => r.isDone)) {
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 6000);
//         return toggled.filter(p => p.id !== planId);
//       }

//       return toggled;
//     });

//     // Persist
//     await fetch(`${API_BASE}/api/users/${user.id}/learning-plans/${planId}/recipes/${encodeURIComponent(recipeName)}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({ isDone: newIsDone })
//     }).catch(console.error);
//   };

//   useEffect(() => {
//     const onResize = () =>
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     window.addEventListener('resize', onResize);
//     return () => window.removeEventListener('resize', onResize);
//   }, []);

//   return (
//     <>
//       {showConfetti && (
//         <>
//           <Confetti width={windowSize.width} height={windowSize.height} />
//           <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
//             <h2 className="text-4xl font-bold text-green-600 bg-white bg-opacity-80 p-4 rounded-lg">
//               🎉 Cuisine Completed! 🎉
//             </h2>
//           </div>
//         </>
//       )}
//       <NavbarLP />
//       <div className="min-h-screen bg-gray-50 p-10">
//         <h1 className="text-4xl font-bold mb-8 text-center">My Learning Plan</h1>
//         {!plans.length && <p className="text-center">No cuisines added yet!</p>}
//         <div className="space-y-8">
//           {plans.map(plan => (
//             <div key={plan.id} className="bg-white p-6 rounded-xl shadow-lg">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-semibold">{plan.cuisineName}</h2>
//                 <div className="space-x-4">
//                   <button onClick={() => startEditing(plan)} className="text-blue-500 hover:underline">
//                     Update Cuisine
//                   </button>
//                   <button onClick={() => handleDeletePlan(plan.id)} className="text-red-500 hover:underline">
//                     Delete Cuisine
//                   </button>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                 {plan.recipes.map(r => (
//                   <div key={r.name} className="border p-4 rounded-lg">
//                     <h3 className="font-semibold">{r.name}</h3>
//                     <p className="text-sm text-gray-600">⏱️ {r.time}</p>
//                     <img src={r.image} alt={r.name} className="w-full h-32 object-cover rounded-md my-2" />
//                     <button
//                       onClick={() => handleRecipeDone(plan.id, r.name)}
//                       className={`mt-2 px-4 py-1 rounded text-white ${
//                         r.isDone ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
//                       }`}
//                     >
//                       {r.isDone ? '✅ Done' : 'Mark as Done'}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="text-center mt-10">
//           <button onClick={() => navigate('/cuisine')} className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
//             ← Back to Cuisines
//           </button>
//         </div>
//       </div>

//       {editingPlan && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
//             <h2 className="text-xl font-bold">Edit {editingPlan.cuisineName}</h2>
//             <div className="max-h-64 overflow-auto border p-2 rounded">
//               {allRecipes.map(r => (
//                 <label key={r.name} className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     checked={selectedNames.includes(r.name)}
//                     onChange={() => toggleName(r.name)}
//                     className="mr-2"
//                   />
//                   <span>{r.name}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-end space-x-4 mt-4">
//               <button onClick={() => setEditingPlan(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
//                 Cancel
//               </button>
//               <button onClick={saveUpdates} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserPlanPage;





















import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavbarLP from '../../components/LearningPlan/NavbarLP';
import Confetti from 'react-confetti';
import { AuthContext } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000';

const UserPlanPage = () => {
  const { user, token, loading } = useContext(AuthContext);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user || !token) return;
    fetch(`${API_BASE}/api/users/${user.id}/learning-plans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(raw => {
        const withFlags = raw.map(plan => ({
          ...plan,
          recipes: plan.recipes.map(r => ({ ...r, isDone: r.isDone ?? false }))
        }));
        setPlans(withFlags);
      })
      .catch(console.error);
  }, [user, token]);

  const handleDeletePlan = async planId => {
    await fetch(`${API_BASE}/api/users/${user.id}/learning-plans/${planId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setPlans(plans.filter(p => p.id !== planId));
  };

  const startEditing = plan => {
    setEditingPlan(plan);
    fetch(`${API_BASE}/api/cuisines/${encodeURIComponent(plan.cuisineName)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(cuisine => {
        setAllRecipes(cuisine.recipes);
        setSelectedNames(plan.recipes.map(r => r.name));
      })
      .catch(console.error);
  };

  const toggleName = name =>
    setSelectedNames(ns => (ns.includes(name) ? ns.filter(n => n !== name) : [...ns, name]));

  const saveUpdates = async () => {
    const planId = editingPlan.id;
    await fetch(`${API_BASE}/api/users/${user.id}/learning-plans/${planId}/recipes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(selectedNames)
    });
    setPlans(plans.map(p =>
      p.id === planId
        ? { ...p, recipes: p.recipes.filter(r => selectedNames.includes(r.name)) }
        : p
    ));
    setEditingPlan(null);
  };

  const handleRecipeDone = async (planId, recipeName) => {
    const plan = plans.find(p => p.id === planId);
    const recipe = plan.recipes.find(r => r.name === recipeName);
    const newIsDone = !recipe.isDone;

    // Optimistic UI
    setPlans(prev => {
      const toggled = prev.map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          recipes: p.recipes.map(r => r.name === recipeName ? { ...r, isDone: newIsDone } : r)
        };
      });

      const donePlan = toggled.find(p => p.id === planId);
      if (donePlan && donePlan.recipes.every(r => r.isDone)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 6000);
        return toggled.filter(p => p.id !== planId);
      }

      return toggled;
    });

    // Persist
    await fetch(`${API_BASE}/api/users/${user.id}/learning-plans/${planId}/recipes/${encodeURIComponent(recipeName)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isDone: newIsDone })
    }).catch(console.error);
  };

  useEffect(() => {
    const onResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {showConfetti && (
        <>
          <Confetti width={windowSize.width} height={windowSize.height} />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-4xl font-bold text-green-600 bg-white bg-opacity-80 p-4 rounded-lg">
              🎉 Cuisine Completed! 🎉
            </h2>
          </div>
        </>
      )}
      <NavbarLP />
      <div className="min-h-screen bg-gray-50 p-10">
        <h1 className="text-4xl font-bold mb-8 text-center">My Learning Plan</h1>
        {!plans.length && <p className="text-center">No cuisines added yet!</p>}
        <div className="space-y-8">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{plan.cuisineName}</h2>
                <div className="space-x-4">
                  <button onClick={() => startEditing(plan)} className="text-blue-500 hover:underline">
                    Update Cuisine
                  </button>
                  <button onClick={() => handleDeletePlan(plan.id)} className="text-red-500 hover:underline">
                    Delete Cuisine
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {plan.recipes.map(r => (
                  <div key={r.name} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-gray-600">⏱️ {r.time}</p>
                    <img src={r.image} alt={r.name} className="w-full h-32 object-cover rounded-md my-2" />
                    <button
                      onClick={() => handleRecipeDone(plan.id, r.name)}
                      className={`mt-2 px-4 py-1 rounded text-white ${
                        r.isDone ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {r.isDone ? '✅ Done' : 'Mark as Done'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => navigate('/cuisine')} className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            ← Back to Cuisines
          </button>
        </div>
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">Edit {editingPlan.cuisineName}</h2>
            <div className="max-h-64 overflow-auto border p-2 rounded">
              {allRecipes.map(r => (
                <label key={r.name} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedNames.includes(r.name)}
                    onChange={() => toggleName(r.name)}
                    className="mr-2"
                  />
                  <span>{r.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => setEditingPlan(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={saveUpdates} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPlanPage;
