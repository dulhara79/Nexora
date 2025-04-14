// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import CuisineCard from '../../components/LearningPlan/CuisineCard';

// const cuisines = {
//   beginner: [
//     {
//         name: 'Sri Lankan',
//         image: 'https://travelseewrite.com/wp-content/uploads/2023/08/sl-food.jpeg',
//         recipes: [
//           { name: 'Dhal Curry', isCompleted: false },
//           { name: 'Koththu', isCompleted: false },
//           { name: 'Egg Hoppers', isCompleted: false },
//           { name: 'Fish Ambul Thiyal', isCompleted: false },
//           { name: 'Coconut Roti', isCompleted: false },
//           { name: 'Watalappan', isCompleted: false },
//     ],
//     },
//     {
//       name: 'Indian',
//       image: 'https://chilliindia.com.au/wp-content/uploads/2024/01/Indian-cuisine-in-Melbourne.webp',
//       recipes: [
//         { name: 'Masala Dosa', isCompleted: false },
//         { name: 'Poha', isCompleted: false },
//         { name: 'Aloo Paratha', isCompleted: false },
//         { name: 'Chana Chaat', isCompleted: false },
//         { name: 'Vegetable Upma', isCompleted: false },
//         { name: 'Paneer Tikka', isCompleted: false },
//       ],
//     },
//     {
//       name: 'Thai',
//       image: 'https://static-content.owner.com/funnel/images/b893f8fa-e87a-446b-aff7-f38ad82c832f?v=1326925160.jpg',
//       recipes: [
//         { name: 'Pad Thai', isCompleted: false },
//         { name: 'Green Curry', isCompleted: false },
//         { name: 'Tom Yum Soup', isCompleted: false },
//         { name: 'Thai Fried Rice', isCompleted: false },
//         { name: 'Spring Rolls', isCompleted: false },
//         { name: 'Mango Sticky Rice', isCompleted: false },
//       ],
//     },
//   ],
//   intermediate: [
//     {
//       name: 'Mexican',
//       image: 'https://mexiconewsdaily.com/wp-content/uploads/2024/08/Traditional-Mexican-Dishes-1.jpg',
//       recipes: [
//         { name: 'Chicken Enchiladas', isCompleted: false },
//         { name: 'Tacos', isCompleted: false },
//         { name: 'Guacamole', isCompleted: false },
//         { name: 'Churros', isCompleted: false },
//         { name: 'Quesadilla', isCompleted: false },
//         { name: 'Salsa Verde', isCompleted: false },
//       ],
//     },
//     {
//         name: 'French',
//         image: 'https://ihmnotessite.com/wp-content/uploads/2020/04/FC1.jpg',
//         recipes: [
//           { name: 'Quiche Lorraine', isCompleted: false },
//           { name: 'Ratatouille', isCompleted: false },
//           { name: 'Beef Bourguignon', isCompleted: false },
//           { name: 'Crêpes', isCompleted: false },
//           { name: 'Macarons', isCompleted: false },
//           { name: 'Tarte Tatin', isCompleted: false },
//         ],
//       },
//     {
//       name: 'Chinese',
//       image: 'https://images-cdn.welcomesoftware.com/Zz0zMDM2ZWM5NmQ5YjAxMWViODcwYmI5NWUzYmNlYzM0NA==/Zz01NTg2OGYyMmQ4MmYxMWViOGM4NjRkNDA4MzFmNzQ4OA%3D%3D.jpg?width=1366',
//       recipes: [
//         { name: 'Kung Pao Chicken', isCompleted: false },
//         { name: 'Spring Rolls', isCompleted: false },
//         { name: 'Dumplings', isCompleted: false },
//         { name: 'Sweet and Sour Pork', isCompleted: false },
//         { name: 'Mapo Tofu', isCompleted: false },
//         { name: 'Fried Rice', isCompleted: false },
//       ],
//     },
//   ],
//   advanced: [
//     {
//       name: 'Japanese',
//       image: 'https://static.vecteezy.com/system/resources/thumbnails/049/000/669/small_2x/assorted-japanese-dishes-with-salmon-rice-and-vegetables-photo.jpg',
//       recipes: [
//         { name: 'Sushi', isCompleted: false },
//         { name: 'Ramen', isCompleted: false },
//         { name: 'Tempura', isCompleted: false },
//         { name: 'Tonkatsu', isCompleted: false },
//         { name: 'Mochi', isCompleted: false },
//         { name: 'Okonomiyaki', isCompleted: false },
//       ],
//     },
//     {
//         name: 'Italian',
//         image: 'https://puertovallarta.hotelmousai.com/blog/assets/img/Top-10-Traditional-Foods-in-Italy.jpg',
//         recipes: [
//           { name: 'Spaghetti Aglio e Olio', isCompleted: false },
//           { name: 'Margherita Pizza', isCompleted: false },
//           { name: 'Bruschetta', isCompleted: false },
//           { name: 'Pesto Pasta', isCompleted: false },
//           { name: 'Tiramisu', isCompleted: false },
//           { name: 'Caprese Salad', isCompleted: false },
//         ],
//     },
//     {
//       name: 'Spanish',
//       image: 'https://t3.ftcdn.net/jpg/01/99/21/38/360_F_199213830_3nPpEuLyGq0bq7fCNPiqqr2IOddloO2h.jpg',
//       recipes: [
//         { name: 'Paella', isCompleted: false },
//         { name: 'Tortilla Española', isCompleted: false },
//         { name: 'Churros', isCompleted: false },
//         { name: 'Gazpacho', isCompleted: false },
//         { name: 'Flan', isCompleted: false },
//         { name: 'Pisto', isCompleted: false },
//       ],
//     },
//   ],
// };

// const PlanPage = () => {
//   const navigate = useNavigate();

//   const handleSelectCuisine = (cuisine) => {
//     navigate(`/progress/${cuisine.name}`, { state: { cuisine } });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-10">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">🍳 Beginner Level Cuisines</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {cuisines.beginner.map((cuisine, index) => (
//             <CuisineCard key={index} cuisine={cuisine} onSelectCuisine={() => handleSelectCuisine(cuisine)} />
//           ))}
//         </div>

//         <h2 className="text-3xl font-extrabold text-blue-800 mt-12 mb-8 text-center">🍝 Intermediate Level Cuisines</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {cuisines.intermediate.map((cuisine, index) => (
//             <CuisineCard key={index} cuisine={cuisine} onSelectCuisine={() => handleSelectCuisine(cuisine)} />
//           ))}
//         </div>

//         <h2 className="text-3xl font-extrabold text-blue-800 mt-12 mb-8 text-center">🍽️ Advanced Level Cuisines</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {cuisines.advanced.map((cuisine, index) => (
//             <CuisineCard key={index} cuisine={cuisine} onSelectCuisine={() => handleSelectCuisine(cuisine)} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanPage;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import CuisineCard from '../../components/LearningPlan/CuisineCard';
import NavbarLP from '../../components/LearningPlan/NavbarLP';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const PlanPage = () => {
  const navigate = useNavigate();

  const location = useLocation();

useEffect(() => {
  if (location.hash) {
    const target = document.getElementById(location.hash.replace('#', ''));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}, [location]);


  const cuisines = {
    beginner: [
      {
        name: 'Sri Lankan TasteHeaven',
        description: 'A culinary treasure trove from the pearl of the Indian Ocean - think fiery curries and aromatic spices that dance on your tongue like a Kandyan drumming parade.',
        image: 'https://travelseewrite.com/wp-content/uploads/2023/08/sl-food.jpeg',
        recipes: [
          { name: 'Dhal Curry', isCompleted: false },
          { name: 'Koththu', isCompleted: false },
          { name: 'Egg Hoppers', isCompleted: false },
          { name: 'Fish Ambul Thiyal', isCompleted: false },
          { name: 'Coconut Roti', isCompleted: false },
          { name: 'Watalappan', isCompleted: false },
        ],
      },
      {
        name: 'Thai ZestRush',
        description: 'An electrifying balance of sweet, sour, salty, and spicy - like a flavorful rollercoaster ride through fragrant herbs, silky curries, and wok-tossed perfection.',
        image: 'https://static-content.owner.com/funnel/images/b893f8fa-e87a-446b-aff7-f38ad82c832f?v=1326925160.jpg',
        recipes: [
          { name: 'Pad Thai', isCompleted: false },
          { name: 'Green Curry', isCompleted: false },
          { name: 'Tom Yum Soup', isCompleted: false },
          { name: 'Thai Fried Rice', isCompleted: false },
          { name: 'Spring Rolls', isCompleted: false },
          { name: 'Mango Sticky Rice', isCompleted: false },
        ],
      },
      {
        name: 'Indian SpiceSaga',
        description: 'A sensory explosion of color, aroma, and flavor - from street food chaos to royal thalis, every bite is a bold celebration of spice, tradition, and soul-warming comfort.',
        image: 'https://chilliindia.com.au/wp-content/uploads/2024/01/Indian-cuisine-in-Melbourne.webp',
        recipes: [
          { name: 'Masala Dosa', isCompleted: false },
          { name: 'Poha', isCompleted: false },
          { name: 'Aloo Paratha', isCompleted: false },
          { name: 'Chana Chaat', isCompleted: false },
          { name: 'Vegetable Upma', isCompleted: false },
          { name: 'Paneer Tikka', isCompleted: false },
        ],
      },
    ],
    intermediate: [
      {
        name: 'Mexican StreetSoul',
        description: 'A fiesta in every bite - smoky, zesty, and comforting. From fresh guac to sizzling enchiladas, it is the kind of food that hugs your taste buds and shouts ¡Viva la vida!',
        image: 'https://mexiconewsdaily.com/wp-content/uploads/2024/08/Traditional-Mexican-Dishes-1.jpg',
        recipes: [
          { name: 'Chicken Enchiladas', isCompleted: false },
          { name: 'Tacos', isCompleted: false },
          { name: 'Guacamole', isCompleted: false },
          { name: 'Churros', isCompleted: false },
          { name: 'Quesadilla', isCompleted: false },
          { name: 'Salsa Verde', isCompleted: false },
        ],
      },
      {
        name: 'Chinese WokWhirl',
        description: 'Bold flavors, wok magic, and nostalgic deliciousness - dumplings, sizzling stir-fries, and sweet-savory wonders that never miss the umami mark.',
        image: 'https://images-cdn.welcomesoftware.com/Zz0zMDM2ZWM5NmQ5YjAxMWViODcwYmI5NWUzYmNlYzM0NA==/Zz01NTg2OGYyMmQ4MmYxMWViOGM4NjRkNDA4MzFmNzQ4OA%3D%3D.jpg',
        recipes: [
          { name: 'Kung Pao Chicken', isCompleted: false },
          { name: 'Spring Rolls', isCompleted: false },
          { name: 'Dumplings', isCompleted: false },
          { name: 'Sweet and Sour Pork', isCompleted: false },
          { name: 'Mapo Tofu', isCompleted: false },
          { name: 'Fried Rice', isCompleted: false },
        ],
      },
      {
        name: 'French ButterMuse',
        description: 'Refined, romantic, and effortlessly chic - buttery pastries, rich sauces, and dishes so delicate they practically whisper bonjour as you take a bite.',
        image: 'https://ihmnotessite.com/wp-content/uploads/2020/04/FC1.jpg',
        recipes: [
          { name: 'Quiche Lorraine', isCompleted: false },
          { name: 'Ratatouille', isCompleted: false },
          { name: 'Beef Bourguignon', isCompleted: false },
          { name: 'Crêpes', isCompleted: false },
          { name: 'Macarons', isCompleted: false },
          { name: 'Tarte Tatin', isCompleted: false },
        ],
      },
    ],
    advanced: [
      {
        name: 'Japanese ZenBite',
        description: 'Where culinary art meets precision - minimalist, clean, and deeply soulful, every dish is a harmonious blend of flavor, culture, and centuries of craftsmanship.',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/049/000/669/small_2x/assorted-japanese-dishes-with-salmon-rice-and-vegetables-photo.jpg',
        recipes: [
          { name: 'Sushi', isCompleted: false },
          { name: 'Ramen', isCompleted: false },
          { name: 'Tempura', isCompleted: false },
          { name: 'Tonkatsu', isCompleted: false },
          { name: 'Mochi', isCompleted: false },
          { name: 'Okonomiyaki', isCompleted: false },
        ],
      },
      {
        name: 'Spanish SizzleFlair',
        description: 'Passionate, bold, and bursting with zest - tapas, sizzling seafood, and saffron-kissed paella that’ll make your taste buds flamenco across the plate.',
        image: 'https://t3.ftcdn.net/jpg/01/99/21/38/360_F_199213830_3nPpEuLyGq0bq7fCNPiqqr2IOddloO2h.jpg',
        recipes: [
          { name: 'Paella', isCompleted: false },
          { name: 'Tortilla Española', isCompleted: false },
          { name: 'Churros', isCompleted: false },
          { name: 'Gazpacho', isCompleted: false },
          { name: 'Flan', isCompleted: false },
          { name: 'Pisto', isCompleted: false },
        ],
      },
      {
        name: 'Italian PastaPassion',
        description: 'A love letter to carbs and cheese - rustic, romantic, and absolutely irresistible. Whether it is handmade pasta or tiramisu, Italian food just gets you.',
        image: 'https://puertovallarta.hotelmousai.com/blog/assets/img/Top-10-Traditional-Foods-in-Italy.jpg',
        recipes: [
          { name: 'Spaghetti Aglio e Olio', isCompleted: false },
          { name: 'Margherita Pizza', isCompleted: false },
          { name: 'Bruschetta', isCompleted: false },
          { name: 'Pesto Pasta', isCompleted: false },
          { name: 'Tiramisu', isCompleted: false },
          { name: 'Caprese Salad', isCompleted: false },
        ],
      },
    ],
  };

  // const handleSelectCuisine = (cuisine) => {
  //   navigate(`/progress/${cuisine.name}`, { state: { cuisine } });
  // };

  const handleSelectCuisine = (cuisine, level) => {
    navigate(`/progress/${cuisine.name}`, {
      state: { cuisine, level } // 💥 Pass the level here!
    });
  };
  

  const renderCuisineCards = (category, color) => (
    <div className="scroll-smooth">

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cuisines[category].map((cuisine, index) => (
        <div
          key={index}
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
              onClick={() => handleSelectCuisine(cuisine)}
              className={`mt-2 px-5 py-2 rounded-full bg-${color}-500 hover:bg-${color}-600 text-white font-semibold transition`}
            >
              Add to My Plan
            </button>
          </div>
        </div>
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

export default PlanPage;
