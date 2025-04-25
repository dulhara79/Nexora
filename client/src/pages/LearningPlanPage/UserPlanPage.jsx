import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavbarLP from '../../components/LearningPlan/NavbarLP';

const UserPlanPage = () => {
  const [params] = useSearchParams();
  const userId = params.get('userId');
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  // fetch user plans
  useEffect(() => {
    fetch(`http://localhost:5000/api/learningplan?userId=${userId}`)
      .then(r => r.json())
      .then(setPlans);
  }, [userId]);

  const handleRemoveRecipe = async (planId, recipeName) => {
    const plan = plans.find(p=>p.id===planId);
    const keep = plan.recipes.map(r=>r.name).filter(n=>n!==recipeName);
    await fetch(`http://localhost:5000/api/learningplan/${planId}/recipes`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(keep)
    });
    setPlans(plans.map(p=>p.id===planId ? {...p, recipes: p.recipes.filter(r=>r.name!==recipeName)} : p));
  };

  const handleDeletePlan = async (planId) => {
    await fetch(`http://localhost:5000/api/learningplan/${planId}`, { method:'DELETE' });
    setPlans(plans.filter(p=>p.id!==planId));
  };

  return (
    <>
      <NavbarLP />
      <div className="min-h-screen bg-gray-50 p-10">
        <h1 className="text-4xl font-bold mb-8 text-center">My Learning Plan</h1>
        {plans.length===0 && <p className="text-center">No cuisines added yet!</p>}
        <div className="space-y-8">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{plan.cuisineName}</h2>
                <button
                  onClick={()=>handleDeletePlan(plan.id)}
                  className="text-red-500 hover:underline"
                >Delete Cuisine</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {plan.recipes.map(r=>(
                  <div key={r.name} className="border p-4 rounded-lg relative">
                    <button
                      onClick={()=>handleRemoveRecipe(plan.id, r.name)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >✕</button>
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-gray-600">⏱️ {r.time}</p>
                    <img src={r.image} alt={r.name} className="w-full h-32 object-cover rounded-md my-2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={()=>navigate('/cuisine')}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >← Back to Cuisines</button>
        </div>
      </div>
    </>
  );
};

export default UserPlanPage;
