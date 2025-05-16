// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const LearningPlanCreator = () => {
//   const navigate = useNavigate();

//   const levels = [
//     {
//       name: 'Beginner',
//       color: 'blue',
//       desc: 'This plan is for newbies ready to conquer the kitchen. Start with simple, soul-warming recipes.',
//       route: '/plan/beginner',
//     },
//     {
//       name: 'Intermediate',
//       color: 'yellow',
//       desc: 'You know your way around the stove. Now level up with bold flavors and new techniques.',
//       route: '/plan/intermediate',
//     },
//     {
//       name: 'Advanced',
//       color: 'red',
//       desc: 'Master Chef in the making? Let us test those skills with gourmet-level recipes.',
//       route: '/plan/advanced',
//     },
//   ];

//   return (
//     <div className="grid md:grid-cols-3 gap-8 mt-10">
//       {levels.map((level, idx) => (
//         <div
//           key={idx}
//           className={`p-6 bg-white shadow-xl rounded-xl border-l-8 border-${level.color}-500 flex flex-col justify-between`}
//         >
//           <div>
//             <h2 className={`text-2xl font-bold text-${level.color}-800 mb-2`}>📝 {level.name}</h2>
//             <p className="text-gray-600">{level.desc}</p>
//           </div>
//           <button
//             onClick={() => navigate(level.route)}
//             className={`mt-6 px-4 py-2 rounded-full bg-${level.color}-500 text-white font-semibold hover:bg-${level.color}-600 transition-all duration-300`}
//           >
//             Explore {level.name} Plan →
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LearningPlanCreator;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaFireAlt, FaUtensils, FaUserTie } from 'react-icons/fa';

// const LearningPlanCreator = () => {
//   const navigate = useNavigate();

//   const levels = [
//     {
//       name: 'Beginner',
//       icon: <FaUtensils size={30} className="text-blue-500" />,
//       bgImage: 'https://images.unsplash.com/photo-1543353071-087092ec393f', // soft kitchen starter
//       desc: 'Dip your toes in the culinary pool. Learn comfort classics and kitchen basics, one recipe at a time.',
//       color: 'blue',
//       route: '/plan/beginner',
//     },
//     {
//       name: 'Intermediate',
//       icon: <FaFireAlt size={30} className="text-yellow-500" />,
//       bgImage: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2', // vibrant kitchen action
//       desc: 'You’ve mastered boiling water. Let’s turn up the heat with bold spices, sauces, and sizzling techniques.',
//       color: 'yellow',
//       route: '/plan/intermediate',
//     },
//     {
//       name: 'Advanced',
//       icon: <FaUserTie size={30} className="text-red-500" />,
//       bgImage: 'https://images.unsplash.com/photo-1589307006485-d502f1f0c0f4',
//       desc: 'Refine, plate, impress. Craft gourmet magic that could make Gordon Ramsay blush. You’re the chef now.',
//       color: 'red',
//       route: '/plan/advanced',
//     },
    
//   ];

//   return (
//     <div className="grid md:grid-cols-3 gap-8 mt-10">
//       {levels.map((level, idx) => (
//         <div
//           key={idx}
//           className="relative group overflow-hidden shadow-xl rounded-xl bg-white border border-gray-200 transition-transform transform hover:scale-[1.02]"
//         >
//           {/* Background Image Overlay */}
//           <div
//             className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
//             style={{ backgroundImage: `url(${level.bgImage})` }}
//           ></div>

//           {/* Content */}
//           <div className="relative p-6 h-full flex flex-col justify-between z-10">
//             <div>
//               <div className="flex items-center space-x-2 mb-3">
//                 {level.icon}
//                 <h2 className={`text-xl font-bold text-${level.color}-800`}>
//                   {level.name} Plan
//                 </h2>
//               </div>
//               <p className="text-gray-700 text-sm">{level.desc}</p>
//             </div>
//             <button
//               onClick={() => navigate(level.route)}
//               className={`mt-6 px-4 py-2 self-start rounded-full bg-${level.color}-500 text-white font-semibold hover:bg-${level.color}-600 transition-all duration-300`}
//             >
//               Explore {level.name}
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LearningPlanCreator;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaSeedling, FaUtensils, FaCrown } from 'react-icons/fa'; // Icons for beginner > advanced

// const LearningPlanCreator = () => {
//   const navigate = useNavigate();

//   const levels = [
//     {
//       name: 'Beginner',
//       icon: <FaSeedling className="text-4xl text-blue-500 mb-4" />,
//       color: 'blue',
//       statement: '“I’ve never cooked before, but I’m curious!”',
//       desc: 'We’ll walk you through every step. Think easy, fun recipes that boost your kitchen confidence.',
//       route: '/plan/beginner',
//     },
//     {
//       name: 'Intermediate',
//       icon: <FaUtensils className="text-4xl text-yellow-500 mb-4" />,
//       color: 'yellow',
//       statement: '“I’ve tried some recipes… now I want to get better!”',
//       desc: 'Explore global flavors, sharpen your techniques, and build your own signature dishes.',
//       route: '/plan/intermediate',
//     },
//     {
//       name: 'Advanced',
//       icon: <FaCrown className="text-4xl text-red-500 mb-4" />,
//       color: 'red',
//       statement: '“Cooking is my art — I want to master it.”',
//       desc: 'Time to boss up. Dive into gourmet territory with complex dishes and pro-level plating.',
//       route: '/plan/advanced',
//     },
//   ];

//   return (
//     <div className="grid md:grid-cols-3 gap-8 mt-10">
//       {levels.map((level, idx) => (
//         <div
//           key={idx}
//           className={`p-6 bg-white shadow-xl rounded-xl border-l-8 border-${level.color}-500 flex flex-col justify-between`}
//         >
//           <div>
//             {level.icon}
//             <h2 className={`text-xl font-semibold text-${level.color}-700 mb-2`}>{level.statement}</h2>
//             <p className="text-gray-600 mb-3">{level.desc}</p>
//           </div>
//           <button
//             onClick={() => navigate(level.route)}
//             className={`mt-auto px-4 py-2 rounded-full bg-${level.color}-500 text-white font-semibold hover:bg-${level.color}-600 transition-all duration-300`}
//           >
//             Explore {level.name} Plan →
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LearningPlanCreator;


// import React from 'react';
// import { FaSeedling, FaUtensils, FaCrown } from 'react-icons/fa'; // Icons remain fabulous

// const LearningPlanCreator = () => {
//   const levels = [
//     {
//       name: 'Beginner',
//       greeting: 'Hi Beginner Cook 👩‍🍳',
//       icon: <FaSeedling className="text-5xl text-blue-500 mb-4 animate-pulse" />,
//       color: 'blue',
//       statement: '“I’ve never cooked before, but I’m curious!”',
//       desc: 'We’ll walk you through every step. Think easy, fun recipes that boost your kitchen confidence.',
//     },
//     {
//       name: 'Intermediate',
//       greeting: 'Hey Intermediate Chef 👨‍🍳',
//       icon: <FaUtensils className="text-5xl text-yellow-500 mb-4 animate-bounce" />,
//       color: 'yellow',
//       statement: '“I’ve tried some recipes… now I want to get better!”',
//       desc: 'Explore global flavors, sharpen your techniques, and build your own signature dishes.',
//     },
//     {
//       name: 'Advanced',
//       greeting: 'Hello Advanced Master 👑',
//       icon: <FaCrown className="text-5xl text-red-500 mb-4 animate-wiggle" />,
//       color: 'red',
//       statement: '“Cooking is my art — I want to master it.”',
//       desc: 'Time to boss up. Dive into gourmet territory with complex dishes and pro-level plating.',
//     },
//   ];

//   return (
//     <div className="grid md:grid-cols-3 gap-8 mt-12">
//       {levels.map((level, idx) => (
//         <div
//           key={idx}
//           className="p-6 bg-white shadow-xl rounded-2xl border relative transition-transform duration-300 hover:scale-[1.015]"
//         >
//           {/* Left Accent Border */}
//           <div className={`absolute top-0 left-0 h-full w-2 bg-${level.color}-500 rounded-l-xl`} />
          
//           <div className="flex flex-col items-start pl-4">
//             <span className="uppercase tracking-widest text-xs text-gray-400 mb-1">{level.name} Level</span>
//             {level.icon}
//             <h2 className={`text-xl font-bold text-${level.color}-800 mb-1`}>
//               {level.greeting}
//             </h2>
//             <p className="italic text-gray-700 mb-2">💬 {level.statement}</p>
//             <p className="text-sm text-gray-600">{level.desc}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LearningPlanCreator;


// import React from 'react';
// import { FaSeedling, FaUtensils, FaCrown } from 'react-icons/fa';

// const LearningPlanCreator = () => {
//   const levels = [
//     {
//       name: 'Beginner',
//       greeting: 'Hi Beginner Cook 👩‍🍳',
//       icon: <FaSeedling className="text-5xl text-blue-500 mb-4 animate-pulse" />,
//       borderColor: 'border-black-500',
//       textColor: 'text-blue-800',
//       bg: 'bg-blue-50/40',
//       statement: '“I’ve never cooked before, but I’m curious to learn how to cook!”',
//     },
//     {
//       name: 'Intermediate',
//       greeting: 'Hey Intermediate Chef 👨‍🍳',
//       icon: <FaUtensils className="text-5xl text-yellow-500 mb-4 animate-pulse" />,
//       borderColor: 'border-black-500',
//       textColor: 'text-yellow-800',
//       bg: 'bg-yellow-50/40',
//       statement: '“I’ve tried some recipes before… now I want to get even better!”',
//     },
//     {
//       name: 'Advanced',
//       greeting: 'Hello Advanced Master 👑',
//       icon: <FaCrown className="text-5xl text-red-500 mb-4 animate-pulse" />,
//       borderColor: 'border-black-500',
//       textColor: 'text-red-800',
//       bg: 'bg-red-50/40',
//       statement: '“Cooking is my art and my passion- I want to master it.”',
//     },
//   ];

//   return (
//     <div className="grid md:grid-cols-3 gap-8 mt-12">
//       {levels.map((level, idx) => (
//         <div
//           key={idx}
//           className={`p-6 rounded-2xl shadow-xl border-4 ${level.borderColor} ${level.bg}
//             hover:scale-[1.015] transition-transform duration-300 text-center flex flex-col justify-center items-center h-full`}
//         >
//           {level.icon}
//           <h2 className={`text-xl font-bold ${level.textColor} mb-2`}>
//             {level.greeting}
//           </h2>
//           <p className="italic text-gray-700 mb-3">💬 {level.statement}</p>
//           <p className="text-sm text-gray-600">{level.desc}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LearningPlanCreator;


import React from 'react';
import { FaSeedling, FaUtensils, FaCrown } from 'react-icons/fa';

const LearningPlanCreator = () => {
  const levels = [
    {
      name: 'Beginner',
      // greeting: 'Hi Beginner Cook',
      icon: <FaSeedling className="text-6xl text-yellow-400 mb-4 animate-pulse drop-shadow-md" />,
      // gradient: 'from-blue-100 to-blue-50',
      borderColor: 'border-l-8 border-yellow-400',
      textColor: 'text-yellow-800',
      statement: '“I’ve never cooked before, but I’m curious to learn how to cook!”',
    },
    {
      name: 'Intermediate',
      // greeting: 'Hey Intermediate Chef',
      icon: <FaUtensils className="text-6xl text-orange-400 mb-4 animate-pulse drop-shadow-md" />,
      // gradient: 'from-yellow-100 to-yellow-50',
      borderColor: 'border-l-8 border-orange-400',
      textColor: 'text-orange-800',
      statement: '“I’ve tried some recipes before… now I want to get even better!”',
    },
    {
      name: 'Advanced',
      // greeting: 'Hello Advanced Master',
      icon: <FaCrown className="text-6xl text-red-500 mb-4 animate-pulse drop-shadow-md" />,
      // gradient: 'from-red-100 to-red-10',
      borderColor: 'border-l-8 border-red-500',
      textColor: 'text-red-800',
      statement: '“Cooking is my art and my passion- I want to master it.”',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 mt-16">
      {levels.map((level, idx) => (
        <div
          key={idx}
          className={`
            bg-gradient-to-br ${level.gradient}
            shadow-xl ${level.borderColor}
            rounded-xl p-6 flex flex-col items-center justify-center text-center
            hover:scale-[1.03] transition-transform duration-300
          `}
        >
          {level.icon}
          <h2 className={`text-2xl font-extrabold mb-2 ${level.textColor}`}>
            {level.greeting}
          </h2>
          <p className="italic text-gray-700 text-base mb-3">💬 {level.statement}</p>
          <div className="h-[2px] w-12 bg-gray-300 my-2 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default LearningPlanCreator;

