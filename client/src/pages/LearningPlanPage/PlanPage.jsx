// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
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
//   const { level } = useParams();
//   const navigate = useNavigate();
//   const [cuisines, setCuisines] = useState([]);

//   useEffect(() => {
//     fetch(`/api/cuisines?level=${level}`)
//       .then(res => res.json())
//       .then(data => setCuisines(data))
//       .catch(err => console.error(err));
//   }, [level]);

//   const handleSelectCuisine = cuisine => {
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



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import CuisineCard from '../../components/LearningPlan/CuisineCard';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';


// const PlanPage = () => {
//   const navigate = useNavigate();

//   const location = useLocation();

// useEffect(() => {
//   if (location.hash) {
//     const target = document.getElementById(location.hash.replace('#', ''));
//     if (target) {
//       target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }
// }, [location]);


//   const cuisines = {
//     beginner: [
//       {
//         name: 'Sri Lankan TasteHeaven',
//         description: 'A culinary treasure trove from the pearl of the Indian Ocean - think fiery curries and aromatic spices that dance on your tongue like a Kandyan drumming parade.',
//         image: 'https://travelseewrite.com/wp-content/uploads/2023/08/sl-food.jpeg',
//         recipes: [
//           {
//             name: 'Dhal Curry',
//             isCompleted: false,
//             time: '45 mins',
//             image: 'https://myloveofbaking.com/wp-content/uploads/2020/10/IMG_8497-1200x1200.jpg',
//             ingredients: [
//               '1 cup red lentils (mung dhal)',
//               '1 small onion, finely chopped',
//               '2 cloves garlic, minced',
//               '1 tsp grated ginger',
//               '1 green chili, sliced',
//               '½ tsp turmeric powder',
//               '4–5 curry leaves',
//               '1 tbsp coconut oil',
//               'Salt to taste',
//               '½ cup coconut milk (optional)'
//             ],
//             method:
//               '1. Rinse lentils until water runs clear. In a pot, combine lentils, turmeric & 2 cups water. Simmer—remove scum as needed—until soft (15–20 min).\n' +
//               '2. In a pan, heat coconut oil. Sauté onion, garlic, ginger, green chili & curry leaves until fragrant and golden.\n' +
//               '3. Add the cooked lentils (reserve the cooking liquid), stir to combine. If too thick, add a splash of reserved liquid.\n' +
//               '4. Simmer 5 min. Stir in coconut milk if using, adjust salt, and serve hot with rice or roti.',
//           },
//           {
//             name: 'Koththu',
//             isCompleted: false,
//             time: '40 mins',
//             image: 'https://cheapandcheerfulcooking.com/wp-content/uploads/2023/02/vegan-kottu-roti-1.jpg',
//             ingredients: [
//               '4 godhamba rotis (or parathas), shredded',
//               '1 onion, thinly sliced',
//               '2 cloves garlic, minced',
//               '1 carrot, julienned',
//               '½ cup shredded cabbage',
//               '2 eggs, beaten',
//               '2 tbsp soy sauce',
//               '1 tsp curry powder',
//               '2 tbsp oil',
//               'Salt & pepper to taste'
//             ],
//             method:
//               '1. Heat oil in a large wok. Sauté onion & garlic until translucent.\n' +
//               '2. Add carrot & cabbage, cook 2–3 min until slightly tender.\n' +
//               '3. Push veggies to side, pour in eggs—scramble gently.\n' +
//               '4. Add shredded roti, soy sauce, curry powder, salt & pepper. Stir-fry on high heat, tossing everything together until hot and slightly crispy edges form.\n' +
//               '5. Serve immediately with chili sambal.',
//           },
//           {
//             name: 'Egg Hoppers',
//             isCompleted: false,
//             time: '45 mins (+fermentation)',
//             image: 'https://www.jetwinghotels.com/islandinsider/wp-content/uploads/2017/09/23A8399-1219x812.jpg',
//             ingredients: [
//               '1 cup rice flour',
//               '½ cup thick coconut milk',
//               '¼ tsp instant yeast',
//               '½ tsp sugar',
//               '½ tsp salt',
//               '1 egg per hopper',
//               'Oil for greasing'
//             ],
//             method:
//               '1. Combine rice flour, coconut milk, yeast, sugar & salt. Whisk to a smooth batter. Let it ferment 3–4 hours at warm room temperature.\n' +
//               '2. Heat a small nonstick bowl/skillet, lightly grease. Pour a ladleful of batter and swirl to coat sides—form a bowl.\n' +
//               '3. Crack one egg into center, cover & cook until edges are crisp and egg is set.\n' +
//               '4. Gently lift and serve hot with sambal or curry.',
//           },
//           {
//             name: 'Fish Ambul Thiyal',
//             isCompleted: false,
//             time: '60 mins',
//             image: 'https://theperfectcurry.com/wp-content/uploads/2022/10/PXL_20221004_141950841.PORTRAIT.jpg',
//             ingredients: [
//               '500 g firm fish (tuna/swordfish), cubed',
//               '2 tbsp goraka (or 1 tbsp tamarind paste)',
//               '1 tsp turmeric powder',
//               '1 tbsp chili powder',
//               '1 tsp black pepper powder',
//               '1 tsp fenugreek seeds (optional)',
//               '4–5 curry leaves',
//               '2 cloves garlic, crushed',
//               'Salt to taste',
//               '2 tbsp oil',
//               '1 cup water'
//             ],
//             method:
//               '1. In a bowl, marinate fish with goraka, turmeric, chili powder, pepper, garlic & salt. Let sit 30 min.\n' +
//               '2. Heat oil in a casserole. Add fenugreek & curry leaves, sauté briefly.\n' +
//               '3. Add marinated fish and 1 cup water. Bring to gentle boil, then reduce heat.\n' +
//               '4. Simmer uncovered for 35–40 min, stirring occasionally, until gravy is almost dry and fish is coated in spices.\n' +
//               '5. Serve with rice or string hoppers.',
//           },
//           {
//             name: 'Coconut Roti',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://timesharesrilanka.com/wp-content/uploads/2022/02/roti-sri-lanka-lr.jpg',
//             ingredients: [
//               '2 cups all‑purpose flour',
//               '1 cup freshly grated coconut',
//               '½ tsp salt',
//               '1 green chili, finely chopped (optional)',
//               'Warm water (as needed)',
//               'Oil or ghee for cooking'
//             ],
//             method:
//               '1. Mix flour, coconut, salt & chili in a bowl. Add warm water little by little, knead into a soft dough.\n' +
//               '2. Divide into balls. Roll each out into a circle on a lightly floured surface.\n' +
//               '3. Heat skillet, cook each roti 1–2 min per side, brushing lightly with oil/ghee until golden spots appear.\n' +
//               '4. Serve hot with curry or sambal.',
//           },
//           {
//             name: 'Watalappan',
//             isCompleted: false,
//             time: '50 mins (+chill time)',
//             image: 'https://recipe30.com/wp-content/uploads/2018/10/Watalappam.jpg',
//             ingredients: [
//               '1 cup jaggery (or brown sugar), grated',
//               '1 cup thick coconut milk',
//               '3 eggs',
//               '¼ tsp ground cardamom',
//               'Pinch of nutmeg',
//               '1 tsp vanilla extract'
//             ],
//             method:
//               '1. In a saucepan, gently melt jaggery with 2 tbsp water until syrupy. Strain to remove impurities.\n' +
//               '2. Whisk eggs in a bowl. Add jaggery syrup, coconut milk, cardamom, nutmeg & vanilla—mix until smooth.\n' +
//               '3. Pour into a baking dish. Place dish in larger pan, pour hot water around (water bath).\n' +
//               '4. Bake at 180 °C (350 °F) for 30–35 min until set but still quivery.\n' +
//               '5. Chill 2 hours. Slice and serve garnished with crushed nuts.',
//           },
//         ],
//       },
//       {
//         name: 'Thai ZestRush',
//         description: 'An electrifying balance of sweet, sour, salty, and spicy - like a flavorful rollercoaster ride through fragrant herbs, silky curries, and wok-tossed perfection.',
//         image: 'https://static-content.owner.com/funnel/images/b893f8fa-e87a-446b-aff7-f38ad82c832f?v=1326925160.jpg',
//         recipes: [
//           {
//             name: 'Pad Thai',
//             isCompleted: false,
//             time: '30 mins',
//             image: 'https://images.squarespace-cdn.com/content/v1/60982df9899ff80ac258be5e/1652310608582-O0C9K9CJL206KQ94QTDO/IMG_0381.jpg',
//             ingredients: [
//               '200 g rice noodles',
//               '100 g shrimp or firm tofu',
//               '2 eggs',
//               '2 tbsp tamarind paste',
//               '2 tbsp fish sauce',
//               '1 tbsp sugar',
//               '1 garlic clove, minced',
//               '2 spring onions, chopped',
//               '½ cup bean sprouts',
//               '2 tbsp roasted peanuts, crushed',
//               '1 lime, cut into wedges',
//               '2 tbsp oil'
//             ],
//             method:
//               '1. Soak rice noodles in warm water until pliable, drain.\n' +
//               '2. Heat oil in wok. Sauté garlic, add shrimp/tofu, cook until just done.\n' +
//               '3. Push to side; add beaten eggs, scramble lightly.\n' +
//               '4. Add noodles, tamarind, fish sauce & sugar—toss well to coat.\n' +
//               '5. Stir in sprouts & spring onions. Plate, top with peanuts & lime wedges.',
//           },
//           {
//             name: 'Green Curry',
//             isCompleted: false,
//             time: '35 mins',
//             image: 'https://www.kitchensanctuary.com/wp-content/uploads/2019/06/Thai-Green-Curry-square-FS.jpg',
//             ingredients: [
//               '2 tbsp green curry paste',
//               '400 ml coconut milk',
//               '200 g chicken or tofu, sliced',
//               '1 cup Thai eggplant, quartered',
//               '4–5 kaffir lime leaves',
//               '1 tbsp fish sauce',
//               '1 tbsp palm sugar (or brown sugar)',
//               'Handful Thai basil leaves',
//               '2 tbsp oil'
//             ],
//             method:
//               '1. Heat oil in saucepan. Fry curry paste until aromatic.\n' +
//               '2. Add half coconut milk, simmer until oil separates.\n' +
//               '3. Add chicken/tofu, cook 3–4 min. Pour in remaining coconut milk.\n' +
//               '4. Add eggplant, lime leaves, fish sauce & sugar. Simmer until eggplant is tender.\n' +
//               '5. Stir in Thai basil, remove from heat, and serve with jasmine rice.',
//           },
//           {
//             name: 'Tom Yum Soup',
//             isCompleted: false,
//             time: '25 mins',
//             image: 'https://thai-foodie.com/wp-content/uploads/2025/02/chicken-tom-yum-soup-bowl.jpg',
//             ingredients: [
//               '4 cups water or chicken stock',
//               '2 stalks lemongrass, smashed',
//               '3 slices galangal or ginger',
//               '3–4 kaffir lime leaves',
//               '200 g shrimp, peeled',
//               '100 g mushrooms, sliced',
//               '2 tbsp fish sauce',
//               '1 tbsp lime juice',
//               '2–3 bird’s eye chilies, crushed',
//               'Cilantro for garnish'
//             ],
//             method:
//               '1. Bring stock/water to boil. Add lemongrass, galangal & lime leaves—simmer 5 min.\n' +
//               '2. Add mushrooms & shrimp—cook until shrimp turn pink.\n' +
//               '3. Season with fish sauce, lime juice & chilies. Taste & adjust.\n' +
//               '4. Serve hot, garnished with cilantro.',
//           },
//           {
//             name: 'Thai Fried Rice',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://www.chewoutloud.com/wp-content/uploads/2017/08/Thai-Fried-Rice-0.jpg',
//             ingredients: [
//               '2 cups cooked jasmine rice (day‑old)',
//               '1 egg',
//               '1 onion, chopped',
//               '2 garlic cloves, minced',
//               '2 tbsp fish sauce',
//               '1 tbsp soy sauce',
//               '½ cup mixed veggies (carrot, peas)',
//               '2 tbsp oil',
//               'Cucumber & tomato slices to serve'
//             ],
//             method:
//               '1. Heat oil, sauté onion & garlic until soft.\n' +
//               '2. Push aside, crack egg—scramble.\n' +
//               '3. Add rice & veggies, stir-fry 2 min.\n' +
//               '4. Season with fish sauce & soy sauce. Toss until well combined.\n' +
//               '5. Serve with cucumber & tomato.',
//           },
//           {
//             name: 'Larb Gai',
//             isCompleted: false,
//             time: '25 mins',
//             image: 'https://www.everylastbite.com/wp-content/uploads/2020/04/DSC_0129-2-scaled.jpg',
//             ingredients: [
//               '300g ground chicken',
//               '1 tbsp uncooked sticky rice',
//               '1 tbsp fish sauce',
//               '1 tbsp lime juice',
//               '1 tsp sugar',
//               '2 small shallots, thinly sliced',
//               '2 spring onions, chopped',
//               '2 tbsp chopped mint leaves',
//               '1 tbsp chopped cilantro',
//               '1 tsp chili flakes (adjust to taste)'
//             ],
//             method:
//               '1. Toast sticky rice in a dry pan until golden, then grind into coarse powder.\n' +
//               '2. In a pan, cook ground chicken over medium heat without oil until fully cooked.\n' +
//               '3. Remove from heat and mix in fish sauce, lime juice, sugar, chili flakes, and toasted rice powder.\n' +
//               '4. Stir in shallots, spring onions, mint, and cilantro.\n' +
//               '5. Serve warm or room temp with cabbage leaves or lettuce cups.'
//           },
//           {
//             name: 'Mango Sticky Rice',
//             isCompleted: false,
//             time: '35 mins',
//             image: 'https://takestwoeggs.com/wp-content/uploads/2021/07/Thai-Mango-Sticky-Rice-Takestwoeggs-Process-Final-sq.jpg',
//             ingredients: [
//               '1 cup glutinous (sticky) rice',
//               '1 cup coconut milk',
//               '½ cup sugar',
//               '¼ tsp salt',
//               '2 ripe mangoes, sliced',
//               'Sesame seeds for garnish'
//             ],
//             method:
//               '1. Rinse rice, soak 4 hours, steam until tender (20 min).\n' +
//               '2. Heat coconut milk, sugar & salt—don’t boil. Remove from heat.\n' +
//               '3. Pour half over hot rice, stir, let absorb 10 min.\n' +
//               '4. Serve rice with mango slices, drizzle remaining coconut sauce, sprinkle sesame.',
//           },
//         ],
//       },
//       {
//         name: 'Indian SpiceSaga',
//         description: 'A sensory explosion of color, aroma, and flavor - from street food chaos to royal thalis, every bite is a bold celebration of spice, tradition, and soul-warming comfort.',
//         image: 'https://chilliindia.com.au/wp-content/uploads/2024/01/Indian-cuisine-in-Melbourne.webp',
//         recipes: [
//           {
//             name: 'Masala Dosa',
//             isCompleted: false,
//             time: '50 mins (+ferment)',
//             image: 'https://foodhub.scene7.com/is/image/woolworthsltdprod/1908-masala-dosa?wid=1300&hei=1300&fmt=png-alpha',
//             ingredients: [
//               '2 cups rice',
//               '½ cup urad dal',
//               'Salt to taste',
//               '2 potatoes, boiled & mashed',
//               '1 onion, sliced',
//               '1 tsp mustard seeds',
//               '½ tsp turmeric powder',
//               '2 tbsp oil',
//               'Curry leaves & green chili in potato mix'
//             ],
//             method:
//               '1. Soak rice & dal separately 4–6 hrs. Grind with water to batter, ferment overnight.\n' +
//               '2. For potato filling: heat oil, mustard seeds, onion, chili, curry leaves, turmeric; add potatoes, mix.\n' +
//               '3. Heat dosa tawa, pour batter, swirl thin. Drizzle oil around edge. When edges lift, place filling, fold and serve with chutney.',
//           },
//           {
//             name: 'Poha',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://pipingpotcurry.com/wp-content/uploads/2020/12/Poha-Recipe-indori-Piping-Pot-Curry.jpg',
//             ingredients: [
//               '2 cups flattened rice (poha)',
//               '1 onion, chopped',
//               '1 potato, diced',
//               '1 green chili, chopped',
//               '½ tsp mustard seeds',
//               '10 curry leaves',
//               '½ tsp turmeric powder',
//               'Salt & sugar to taste',
//               '2 tbsp oil',
//               'Lemon & cilantro to garnish'
//             ],
//             method:
//               '1. Rinse poha, drain well.\n' +
//               '2. Heat oil, crackle mustard seeds & curry leaves. Add chili, onion, potato; sauté until potato is tender.\n' +
//               '3. Add turmeric, salt, sugar; stir in poha. Cook 2 min.\n' +
//               '4. Serve garnished with lemon juice & cilantro.',
//           },
//           {
//             name: 'Aloo Paratha',
//             isCompleted: false,
//             time: '30 mins',
//             image: 'https://sandhyahariharan.co.uk/wp-content/uploads/2009/10/aloo-methi-paratha-1.jpg',
//             ingredients: [
//               '2 cups whole wheat flour',
//               '2 potatoes, boiled & mashed',
//               '1 tsp chili powder',
//               '1 tsp garam masala',
//               'Salt to taste',
//               'Oil/ghee for cooking',
//               'Cilantro & green chili in filling'
//             ],
//             method:
//               '1. Knead flour + water + salt into soft dough.\n' +
//               '2. Mix potatoes with spices. Divide dough into balls, flatten, place filling, seal, roll out gently.\n' +
//               '3. Cook paratha on hot skillet with oil/ghee until golden on both sides. Serve hot with yogurt or pickle.',
//           },
//           {
//             name: 'Chana Chaat',
//             isCompleted: false,
//             time: '15 mins',
//             image: 'https://www.indianveggiedelight.com/wp-content/uploads/2022/01/kala-chana-chaat-recipe-featured.jpg',
//             ingredients: [
//               '2 cups boiled chickpeas',
//               '1 onion, chopped',
//               '1 tomato, chopped',
//               '1 green chili, chopped',
//               '1 tsp chaat masala',
//               '1 tsp cumin powder',
//               'Juice of 1 lemon',
//               'Salt to taste',
//               'Cilantro to garnish'
//             ],
//             method:
//               '1. In a bowl, combine chickpeas, onion, tomato, chili.\n' +
//               '2. Season with chaat masala, cumin, salt & lemon juice. Toss well.\n' +
//               '3. Garnish with cilantro and serve immediately.',
//           },
//           {
//             name: 'Vegetable Upma',
//             isCompleted: false,
//             time: '25 mins',
//             image: 'https://cdn.cdnparenting.com/articles/2020/03/03172331/VEG-UPMA.webp',
//             ingredients: [
//               '1 cup semolina (rava)',
//               '1 onion, chopped',
//               '1 carrot, diced',
//               '½ cup peas',
//               '1 tsp mustard seeds',
//               '10 curry leaves',
//               '2 green chilies, chopped',
//               '2 tbsp oil',
//               '2 cups water',
//               'Salt to taste'
//             ],
//             method:
//               '1. Dry roast semolina until light golden; set aside.\n' +
//               '2. Heat oil, crackle mustard seeds & curry leaves. Sauté onion, chilies, carrot & peas.\n' +
//               '3. Add water & salt; bring to boil. Lower heat, add semolina slowly, stirring to prevent lumps.\n' +
//               '4. Cook 2–3 min until water absorbed. Serve hot.',
//           },
//           {
//             name: 'Paneer Tikka',
//             isCompleted: false,
//             time: '40 mins',
//             image: 'https://spicecravings.com/wp-content/uploads/2020/10/Paneer-Tikka-Featured-1.jpg',
//             ingredients: [
//               '250 g paneer, cubed',
//               '½ cup yogurt',
//               '1 tbsp ginger-garlic paste',
//               '1 tsp chili powder',
//               '1 tsp garam masala',
//               '½ tsp turmeric powder',
//               '1 tbsp lemon juice',
//               'Salt to taste',
//               'Oil for grilling'
//             ],
//             method:
//               '1. Whisk yogurt with spices, paste, lemon juice & salt. Marinate paneer 30 min.\n' +
//               '2. Thread onto skewers, brush with oil. Grill or pan-fry each side until charred spots appear.\n' +
//               '3. Serve hot with mint chutney.',
//           },
//         ],
//       },
//     ],
//     intermediate: [
//       {
//         name: 'Mexican StreetSoul',
//         description: 'A fiesta in every bite - smoky, zesty, and comforting. From fresh guac to sizzling enchiladas, it is the kind of food that hugs your taste buds and shouts ¡Viva la vida!',
//         image: 'https://mexiconewsdaily.com/wp-content/uploads/2024/08/Traditional-Mexican-Dishes-1.jpg',
//         recipes: [
//           {
//             name: 'Chicken Enchiladas',
//             isCompleted: false,
//             time: '45 mins',
//             image: 'https://www.budgetbytes.com/wp-content/uploads/2025/02/Chicken-Enchiladas-Overhead.jpg',
//             ingredients: [
//               '8 corn tortillas',
//               '2 cups shredded cooked chicken',
//               '1 cup enchilada sauce',
//               '1 cup shredded cheddar',
//               '½ onion, diced',
//               '1 tsp ground cumin',
//               '1 tsp chili powder',
//               'Salt & pepper to taste',
//               'Oil for greasing'
//             ],
//             method:
//               '1. Preheat oven to 180°C (350°F). Lightly grease a baking dish.\n' +
//               '2. In a bowl, mix chicken, half the cheese, onion, cumin, chili powder, salt & pepper.\n' +
//               '3. Spoon a little enchilada sauce into each tortilla, fill with chicken mix, roll and place seam‑side down in dish.\n' +
//               '4. Pour remaining sauce over top, sprinkle with cheese.\n' +
//               '5. Bake 20‑25 min until cheese is melted and bubbly. Serve hot.'
//           },
//           {
//             name: 'Tacos',
//             isCompleted: false,
//             time: '30 mins',
//             image: 'https://cookingformysoul.com/wp-content/uploads/2024/04/feat-carne-asada-tacos-min.jpg',
//             ingredients: [
//               '8 small taco shells',
//               '500 g ground beef',
//               '1 packet taco seasoning',
//               '1 onion, chopped',
//               '2 cloves garlic, minced',
//               'Lettuce, tomato & cheese for topping',
//               'Sour cream & salsa to serve'
//             ],
//             method:
//               '1. In a skillet, cook beef, onion & garlic until beef is browned. Drain fat.\n' +
//               '2. Stir in taco seasoning with ¼ cup water; simmer 5 min.\n' +
//               '3. Warm taco shells per package instructions.\n' +
//               '4. Fill shells with beef mix, top with lettuce, tomato, cheese, sour cream & salsa.\n' +
//               '5. Serve immediately.'
//           },
//           {
//             name: 'Guacamole',
//             isCompleted: false,
//             time: '15 mins',
//             image: 'https://feelgoodfoodie.net/wp-content/uploads/2024/05/Simple-Guacamole-07.jpg',
//             ingredients: [
//               '3 ripe avocados',
//               '1 small tomato, diced',
//               '¼ red onion, finely chopped',
//               '1 jalapeño, seeded & minced',
//               'Juice of 1 lime',
//               '2 tbsp cilantro, chopped',
//               'Salt to taste'
//             ],
//             method:
//               '1. Halve and pit avocados; scoop flesh into a bowl.\n' +
//               '2. Mash lightly with fork, leaving some chunks.\n' +
//               '3. Fold in tomato, onion, jalapeño, lime juice, cilantro & salt.\n' +
//               '4. Taste and adjust seasoning. Serve with tortilla chips.'
//           },
//           {
//             name: 'Churros',
//             isCompleted: false,
//             time: '40 mins',
//             image: 'https://www.sunglowkitchen.com/wp-content/uploads/2022/11/vegan-churros-recipe-11.jpg',
//             ingredients: [
//               '1 cup water',
//               '2 tbsp sugar',
//               '2 tbsp oil',
//               '1 cup flour',
//               'Oil for frying',
//               '½ cup sugar + 1 tsp cinnamon (for coating)'
//             ],
//             method:
//               '1. In saucepan, bring water, sugar & oil to boil.\n' +
//               '2. Remove from heat, stir in flour until smooth dough forms.\n' +
//               '3. Heat oil in deep pan. Pipe strips of dough through a star nozzle into hot oil.\n' +
//               '4. Fry until golden, drain on paper towels.\n' +
//               '5. Roll in cinnamon‑sugar mixture. Serve warm.'
//           },
//           {
//             name: 'Quesadilla',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://cdn.loveandlemons.com/wp-content/uploads/2024/01/quesadilla-recipe.jpg',
//             ingredients: [
//               '4 large flour tortillas',
//               '2 cups shredded cheese (cheddar or Monterey Jack)',
//               '½ bell pepper, sliced',
//               '½ onion, sliced',
//               '2 tbsp oil',
//               'Salsa & sour cream to serve'
//             ],
//             method:
//               '1. Heat 1 tbsp oil in skillet; sauté pepper & onion until tender. Remove.\n' +
//               '2. Wipe pan, heat remaining oil. Place tortilla, sprinkle half the cheese, top with veggies and remaining cheese, cover with second tortilla.\n' +
//               '3. Cook 2–3 min per side until golden and cheese melts.\n' +
//               '4. Cut into wedges, serve with salsa & sour cream.'
//           },
//           {
//             name: 'Salsa Verde',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://www.cookingclassy.com/wp-content/uploads/2019/10/salsa-verde-04.jpg',
//             ingredients: [
//               '500 g tomatillos, husked & rinsed',
//               '1 small onion, quartered',
//               '2 jalapeños, stemmed',
//               '2 garlic cloves',
//               '½ cup cilantro leaves',
//               'Salt to taste',
//               'Juice of 1 lime'
//             ],
//             method:
//               '1. Boil tomatillos, onion, jalapeños & garlic 5–7 min until soft.\n' +
//               '2. Drain, transfer to blender; add cilantro & lime juice; blend until smooth.\n' +
//               '3. Season with salt. Chill or serve immediately with chips.'
//           }
//         ],
//       },
//       {
//         name: 'Chinese WokWhirl',
//         description: 'Bold flavors, wok magic, and nostalgic deliciousness - dumplings, sizzling stir-fries, and sweet-savory wonders that never miss the umami mark.',
//         image: 'https://images-cdn.welcomesoftware.com/Zz0zMDM2ZWM5NmQ5YjAxMWViODcwYmI5NWUzYmNlYzM0NA==/Zz01NTg2OGYyMmQ4MmYxMWViOGM4NjRkNDA4MzFmNzQ4OA%3D%3D.jpg',
//         recipes: [
//           {
//             name: 'Kung Pao Chicken',
//             isCompleted: false,
//             time: '30 mins',
//             image: 'https://www.chilipeppermadness.com/wp-content/uploads/2021/03/Kung-Pao-Chicken-SQ.jpg',
//             ingredients: [
//               '500 g chicken breast, diced',
//               '2 tbsp soy sauce',
//               '1 tbsp rice vinegar',
//               '1 tsp cornstarch',
//               '2 tbsp oil',
//               '3 dried red chilies',
//               '1 bell pepper, diced',
//               '½ cup roasted peanuts',
//               '2 cloves garlic, minced',
//               '1 tsp ginger, minced',
//               '1 tbsp sugar'
//             ],
//             method:
//               '1. Marinate chicken with soy sauce, vinegar & cornstarch 10 min.\n' +
//               '2. Heat oil, fry chilies until dark (don’t burn). Remove.\n' +
//               '3. Sauté garlic & ginger, add chicken; cook until white.\n' +
//               '4. Add bell pepper, sugar & peanuts; toss.\n' +
//               '5. Return chilies, stir-fry 1 min. Serve hot with rice.'
//           },
//           {
//             name: 'Spring Rolls',
//             isCompleted: false,
//             time: '30 mins',
//             image: 'https://redhousespice.com/wp-content/uploads/2021/12/whole-spring-rolls-and-halved-ones-scaled.jpg',
//             ingredients: [
//               '12 spring roll wrappers',
//               '200 g ground pork or shrimp',
//               '1 cup shredded cabbage',
//               '½ cup shredded carrot',
//               '2 tbsp soy sauce',
//               '1 tsp sesame oil',
//               '2 garlic cloves, minced',
//               'Oil for frying'
//             ],
//             method:
//               '1. Sauté garlic and meat until cooked. Add cabbage, carrot, soy sauce & sesame oil; cook 2 min.\n' +
//               '2. Cool filling. Place wrappers on damp cloth, add filling, roll and seal edges with water.\n' +
//               '3. Deep‑fry in 180°C oil until golden. Drain. Serve with sweet chili sauce.'
//           },
//           {
//             name: 'Dumplings',
//             isCompleted: false,
//             time: '60 mins',
//             image: 'https://images.squarespace-cdn.com/content/v1/55be995de4b071c106b3b4c0/6af0cbeb-8a58-4993-ab68-8e9919d6d04c/Salmon+Dumplings-6.jpg',
//             ingredients: [
//               '30 dumpling wrappers',
//               '300 g ground pork',
//               '½ cup finely chopped napa cabbage',
//               '2 tbsp soy sauce',
//               '1 tbsp sesame oil',
//               '2 garlic cloves, minced',
//               '1 tsp ginger, minced'
//             ],
//             method:
//               '1. Mix pork, cabbage, soy sauce, sesame oil, garlic & ginger.\n' +
//               '2. Place teaspoon of filling in wrapper center; fold and seal edges.\n' +
//               '3. Steam 10 min or pan‑fry bottom until crisp, then add water, cover & steam until done.\n' +
//               '4. Serve with soy dipping sauce.'
//           },
//           {
//             name: 'Sweet and Sour Pork',
//             isCompleted: false,
//             time: '45 mins',
//             image: 'https://pupswithchopsticks.com/wp-content/uploads/sweet-and-sour-pork-portrait4.jpg',
//             ingredients: [
//               '500 g pork loin, cubed',
//               '½ cup pineapple chunks',
//               '1 green bell pepper, sliced',
//               '½ onion, sliced',
//               '¼ cup ketchup',
//               '2 tbsp vinegar',
//               '2 tbsp sugar',
//               '2 tbsp soy sauce',
//               '1 tsp cornstarch',
//               'Oil for frying'
//             ],
//             method:
//               '1. Toss pork in cornstarch; deep‑fry until golden. Drain.\n' +
//               '2. In wok, combine ketchup, vinegar, sugar & soy sauce; bring to simmer.\n' +
//               '3. Add pork, pineapple, peppers & onion; toss until sauce thickens.\n' +
//               '4. Serve with steamed rice.'
//           },
//           {
//             name: 'Mapo Tofu',
//             isCompleted: false,
//             time: '25 mins',
//             image: 'https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2F2023-05-mapo-tofu%2Fmapo-tofu-017',
//             ingredients: [
//               '400 g soft tofu, cubed',
//               '100 g ground pork',
//               '2 tbsp doubanjiang (chili-bean paste)',
//               '1 tbsp soy sauce',
//               '1 tsp sugar',
//               '2 tbsp oil',
//               '2 cloves garlic, minced',
//               '1 tsp Sichuan peppercorns, toasted & ground',
//               '2 spring onions, sliced'
//             ],
//             method:
//               '1. Heat oil; fry peppercorns until fragrant, remove.\n' +
//               '2. Sauté garlic & doubanjiang, add pork; cook until brown.\n' +
//               '3. Add tofu, soy sauce, sugar & a splash of water; simmer 5 min.\n' +
//               '4. Garnish with spring onions. Serve with rice.'
//           },
//           {
//             name: 'Fried Rice',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://www.cookinwithmima.com/wp-content/uploads/2022/05/chinese-vegetarian-fried-rice.jpg',
//             ingredients: [
//               '2 cups cold cooked rice',
//               '1 egg, beaten',
//               '½ cup mixed veggies (peas, carrots)',
//               '2 tbsp soy sauce',
//               '1 tbsp sesame oil',
//               '2 tbsp oil',
//               '2 spring onions, chopped'
//             ],
//             method:
//               '1. Heat oil; scramble egg, remove.\n' +
//               '2. Sauté veggies until tender. Add rice, soy sauce & sesame oil; stir‑fry 2 min.\n' +
//               '3. Return egg, toss, garnish with spring onions. Serve hot.'
//           },
//         ],
//       },
//       {
//         name: 'French ButterMuse',
//         description: 'Refined, romantic, and effortlessly chic - buttery pastries, rich sauces, and dishes so delicate they practically whisper bonjour as you take a bite.',
//         image: 'https://ihmnotessite.com/wp-content/uploads/2020/04/FC1.jpg',
//         recipes: [
//           {
//             name: 'Quiche Lorraine',
//             isCompleted: false,
//             time: '1 hr (incl. bake)',
//             image: 'https://tasteofmissions.com/wp-content/uploads/2021/07/image.jpeg',
//             ingredients: [
//               '1 pie crust',
//               '200 g bacon, diced',
//               '3 eggs',
//               '1 cup heavy cream',
//               '1 cup grated Gruyère',
//               'Salt, pepper & nutmeg'
//             ],
//             method:
//               '1. Preheat oven to 180°C (350°F). Blind‑bake crust 10 min.\n' +
//               '2. Fry bacon until crisp; drain.\n' +
//               '3. Whisk eggs, cream, cheese, salt, pepper & nutmeg.\n' +
//               '4. Sprinkle bacon in crust, pour custard over. Bake 30–35 min until set.\n' +
//               '5. Cool slightly before slicing.'
//           },
//           {
//             name: 'Ratatouille',
//             isCompleted: false,
//             time: '1 hr',
//             image: 'https://www.tablemagazine.com/wp-content/uploads/2023/03/AnnetteAtwoodratatouilleTABLEMagazineBryce.jpg',
//             ingredients: [
//               '1 eggplant, sliced',
//               '1 zucchini, sliced',
//               '1 bell pepper, sliced',
//               '2 tomatoes, sliced',
//               '1 onion, chopped',
//               '2 cloves garlic, minced',
//               '2 tbsp olive oil',
//               'Herbes de Provence, salt & pepper'
//             ],
//             method:
//               '1. Preheat oven to 190°C (375°F). Sauté onion & garlic in oil until soft.\n' +
//               '2. Layer veggies in baking dish, season each layer with herbs, salt & pepper.\n' +
//               '3. Drizzle remaining oil, cover with foil. Bake 40 min. Uncover 10 min to brown.\n' +
//               '4. Serve hot or room temp.'
//           },
//           {
//             name: 'Beef Bourguignon',
//             isCompleted: false,
//             time: '3 hrs',
//             image: 'https://poshjournal.com/wp-content/uploads/2023/11/beef-bourguignon-recipe-17.jpg',
//             ingredients: [
//               '1 kg beef chuck, cubed',
//               '200 g bacon lardons',
//               '2 carrots, sliced',
//               '1 onion, chopped',
//               '2 cloves garlic, minced',
//               '2 tbsp flour',
//               '2 cups red wine',
//               '2 cups beef stock',
//               '2 tbsp tomato paste',
//               'Herbs (thyme, bay leaf)',
//               'Oil, salt & pepper'
//             ],
//             method:
//               '1. Preheat oven to 160°C (325°F). Brown bacon; set aside.\n' +
//               '2. Season beef, brown in bacon fat; remove.\n' +
//               '3. Sauté carrots, onion & garlic. Stir in flour & tomato paste.\n' +
//               '4. Return beef & bacon, pour wine & stock, add herbs.\n' +
//               '5. Cover and braise in oven 2½–3 hrs until tender.\n' +
//               '6. Skim fat, adjust seasoning, serve with potatoes.'
//           },
//           {
//             name: 'Crêpes',
//             isCompleted: false,
//             time: '30 mins',
//             image: 'https://www.nordicware.com/wp-content/uploads/2021/05/classic_crepes_1.jpg',
//             ingredients: [
//               '1 cup flour',
//               '2 eggs',
//               '1 cup milk',
//               '2 tbsp melted butter',
//               'Pinch of salt',
//               'Butter for cooking'
//             ],
//             method:
//               '1. Whisk flour, eggs, milk, butter & salt to smooth batter; rest 15 min.\n' +
//               '2. Heat nonstick pan, melt a little butter.\n' +
//               '3. Pour small ladle, swirl to coat thinly.\n' +
//               '4. Cook 1 min each side until golden. Serve sweet or savory.'
//           },
//           {
//             name: 'Macarons',
//             isCompleted: false,
//             time: '2 hrs (incl. rest)',
//             image: 'https://bakewithshivesh.com/wp-content/uploads/2020/10/IMG-9033-scaled.jpg',
//             ingredients: [
//               '100 g almond flour',
//               '100 g icing sugar',
//               '2 egg whites',
//               '25 g granulated sugar',
//               'Food coloring (optional)',
//               'Filling of choice'
//             ],
//             method:
//               '1. Sift almond flour & icing sugar.\n' +
//               '2. Beat egg whites to soft peaks; gradually add sugar to stiff peaks.\n' +
//               '3. Fold dry mix into whites until ribbon stage. Color if desired.\n' +
//               '4. Pipe rounds on baking sheet; rest 30 min until skin forms.\n' +
//               '5. Bake 150°C (300°F) 12–14 min. Cool, sandwich with filling.'
//           },
//           {
//             name: 'Tarte Tatin',
//             isCompleted: false,
//             time: '1.5 hrs',
//             image: 'https://images.squarespace-cdn.com/content/v1/5a51221e8a02c7e65800f1b7/1607438241733-2GUCBNPMWI792F3OK3HG/peartartetatin8.jpg',
//             ingredients: [
//               '6 apples, peeled & halved',
//               '½ cup sugar',
//               '4 tbsp butter',
//               '1 sheet puff pastry',
//               'Pinch of salt'
//             ],
//             method:
//               '1. Preheat oven to 190°C (375°F). In ovenproof skillet, melt sugar until amber, add butter.\n' +
//               '2. Arrange apple halves cut‑side up, cook 10 min on medium.\n' +
//               '3. Cover apples with puff pastry, tuck edges.\n' +
//               '4. Bake 25–30 min until pastry golden. Let cool 5 min, invert onto plate.\n' +
//               '5. Serve warm with cream or ice cream.'
//           },
//         ],
//       },
//     ],
//     advanced: [
//       {
//         name: 'Japanese ZenBite',
//         description: 'Where culinary art meets precision - minimalist, clean, and deeply soulful, every dish is a harmonious blend of flavor, culture, and centuries of craftsmanship.',
//         image: 'https://static.vecteezy.com/system/resources/thumbnails/049/000/669/small_2x/assorted-japanese-dishes-with-salmon-rice-and-vegetables-photo.jpg',
//         recipes: [
//           {
//             name: 'Sushi',
//             isCompleted: false,
//             time: '60 mins',
//             image: 'https://www.heinens.com/content/uploads/2023/06/Tuna-Sushi-Rolls-800x550-1.jpg',
//             ingredients: [
//               '2 cups sushi rice',
//               '2 tbsp rice vinegar',
//               '1 tbsp sugar',
//               'Pinch salt',
//               'Nori seaweed sheets',
//               '200 g fresh sashimi‑grade fish (tuna/salmon)',
//               'Wasabi & pickled ginger'
//             ],
//             method:
//               '1. Rinse rice until water runs clear. Cook with 2¼ cups water in rice cooker.\n' +
//               '2. Mix vinegar, sugar & salt; fold into hot rice, let cool.\n' +
//               '3. Place nori on bamboo mat, spread rice thinly, top with fish slices.\n' +
//               '4. Roll tightly, slice into pieces. Serve with wasabi & ginger.'
//           },
//           {
//             name: 'Ramen',
//             isCompleted: false,
//             time: '120 mins',
//             image: 'https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/20180323163421/Ramen.jpg',
//             ingredients: [
//               '4 cups chicken or pork broth',
//               '2 cups water',
//               '2 tbsp miso paste',
//               '1 tbsp soy sauce',
//               '200 g fresh ramen noodles',
//               '2 soft‑boiled eggs',
//               'Sliced pork belly',
//               'Green onions & nori for garnish'
//             ],
//             method:
//               '1. Simmer broth, water, miso & soy for 20 min.\n' +
//               '2. Boil noodles separately 3 min; drain.\n' +
//               '3. Divide noodles into bowls, ladle hot broth over.\n' +
//               '4. Top with eggs, pork, onions & nori. Serve immediately.'
//           },
//           {
//             name: 'Tempura',
//             isCompleted: false,
//             time: '40 mins',
//             image: 'https://twosleevers.com/wp-content/uploads/2023/03/Shrimp-Tempura-1.png',
//             ingredients: [
//               '200 g shrimp & assorted veg (sweet potato, zucchini)',
//               '1 cup tempura flour (or mix equal flour & cornstarch)',
//               '1 cup ice‑cold water',
//               'Oil for deep‑frying',
//               'Tempura dipping sauce'
//             ],
//             method:
//               '1. Heat oil to 175 °C (350 °F).\n' +
//               '2. Whisk flour & water lightly (batter should be lumpy).\n' +
//               '3. Dip shrimp/veg in batter, deep‑fry until pale golden.\n' +
//               '4. Drain on rack, serve hot with dipping sauce.'
//           },
//           {
//             name: 'Tonkatsu',
//             isCompleted: false,
//             time: '50 mins',
//             image: 'https://www.marionskitchen.com/wp-content/uploads/2021/08/20201110_Spicy-Pork-Tonkatsu-11-1200x1500.jpg',
//             ingredients: [
//               '4 pork cutlets',
//               'Salt & pepper',
//               '½ cup flour',
//               '1 egg, beaten',
//               '1 cup panko breadcrumbs',
//               'Oil for frying',
//               'Tonkatsu sauce'
//             ],
//             method:
//               '1. Season cutlets with salt & pepper.\n' +
//               '2. Dredge in flour, dip in egg, coat in panko.\n' +
//               '3. Fry in 170 °C oil until golden (3–4 min per side).\n' +
//               '4. Drain, slice & serve with cabbage & sauce.'
//           },
//           {
//             name: 'Mochi',
//             isCompleted: false,
//             time: '90 mins',
//             image: 'https://qeleg.com/cdn/shop/articles/20240411054015-peach-mochi.webp?v=1712814467',
//             ingredients: [
//               '1 cup glutinous rice flour',
//               '¾ cup water',
//               '¼ cup sugar',
//               'Cornstarch for dusting',
//               'Red bean paste (filling)'
//             ],
//             method:
//               '1. Mix flour, water & sugar; microwave 2 min, stir; microwave 1 min more until translucent.\n' +
//               '2. Dust surface with cornstarch, flatten mochi dough, cut into squares.\n' +
//               '3. Place filling in center, pinch edges to seal. Dust off excess starch.\n' +
//               '4. Chill and serve.'
//           },
//           {
//             name: 'Okonomiyaki',
//             isCompleted: false,
//             time: '50 mins',
//             image: 'https://www.heynutritionlady.com/wp-content/uploads/2013/06/Okonomiyaki-Japanese-Cabbage-Pancakes-1_SQ.jpg',
//             ingredients: [
//               '1 cup flour',
//               '2/3 cup dashi or water',
//               '1 egg',
//               '2 cups shredded cabbage',
//               '4 slices bacon',
//               'Okonomiyaki sauce & mayo',
//               'Bonito flakes & aonori'
//             ],
//             method:
//               '1. Mix flour, dashi & egg into batter. Fold in cabbage.\n' +
//               '2. Heat skillet, lay bacon slices, pour batter over, shape into pancake.\n' +
//               '3. Cook 5 min per side until golden.\n' +
//               '4. Drizzle sauce & mayo, top with bonito & aonori. Serve hot.'
//           },
//         ],
//       },
//       {
//         name: 'Spanish SizzleFlair',
//         description: 'Passionate, bold, and bursting with zest - tapas, sizzling seafood, and saffron-kissed paella that’ll make your taste buds flamenco across the plate.',
//         image: 'https://t3.ftcdn.net/jpg/01/99/21/38/360_F_199213830_3nPpEuLyGq0bq7fCNPiqqr2IOddloO2h.jpg',
//         recipes: [
//           {
//             name: 'Paella',
//             isCompleted: false,
//             time: '60 mins',
//             image: 'https://assets.epicurious.com/photos/63ef9f657c3e98834ec8645e/1:1/w_4225,h_4225,c_limit/Paella_RECIPE_021523_47427.jpg',
//             ingredients: [
//               '2 cups bomba or short‑grain rice',
//               '4 cups chicken or seafood broth',
//               '200 g mixed seafood (shrimp, mussels)',
//               '1 chicken thigh, diced',
//               '1 bell pepper, sliced',
//               '½ cup peas',
//               '1 onion, chopped',
//               '2 cloves garlic',
//               '1 tsp smoked paprika',
//               'Pinch saffron',
//               'Olive oil & salt'
//             ],
//             method:
//               '1. Sauté chicken, onion, garlic & pepper in oil until golden.\n' +
//               '2. Stir in rice, paprika & saffron. Add broth, bring to simmer.\n' +
//               '3. Arrange seafood & peas on top; cook uncovered 15–20 min until rice is al dente.\n' +
//               '4. Let rest 5 min. Serve straight from pan.'
//           },
//           {
//             name: 'Tortilla Española',
//             isCompleted: false,
//             time: '40 mins',
//             image: 'https://www.goya.com/wp-content/uploads/2023/10/tortilla-espanola-with-chorizo_pimientos-mushrooms.jpg',
//             ingredients: [
//               '4 potatoes, thinly sliced',
//               '1 onion, thinly sliced',
//               '5 eggs',
//               'Olive oil',
//               'Salt to taste'
//             ],
//             method:
//               '1. Fry potatoes & onion in oil gently until tender; drain.\n' +
//               '2. Beat eggs, mix in potatoes & onion.\n' +
//               '3. Pour back into skillet, cook low heat until set on bottom.\n' +
//               '4. Invert onto plate, slide back to cook top briefly.\n' +
//               '5. Slice and serve warm or at room temperature.'
//           },
//           {
//             name: 'Patatas Bravas',
//             isCompleted: false,
//             time: '35 mins',
//             image: 'https://mariefoodtips.com/wp-content/uploads/2022/07/patatas-bravas-scaled.jpg',
//             ingredients: [
//               '4 medium potatoes, peeled and diced',
//               '2 tbsp olive oil',
//               'Salt to taste',
//               '1 tsp smoked paprika',
//               '1/2 cup mayonnaise',
//               '1 tbsp tomato paste',
//               '1 tsp red wine vinegar',
//               '1 garlic clove, minced',
//               '1/2 tsp cayenne pepper (optional)',
//               'Chopped parsley (for garnish)'
//             ],
//             method:
//               '1. Boil diced potatoes in salted water for 5–7 minutes until just tender. Drain and let cool.\n' +
//               '2. Toss potatoes with olive oil, salt, and smoked paprika. Bake at 220°C (425°F) for 25–30 minutes until crispy.\n' +
//               '3. In a bowl, mix mayo, tomato paste, vinegar, garlic, and cayenne for the bravas sauce.\n' +
//               '4. Drizzle sauce generously over hot potatoes and sprinkle with parsley.\n' +
//               '5. Serve immediately while crispy and spicy 🔥.'
//           },
//           {
//             name: 'Gazpacho',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://www.sandravalvassori.com/wp-content/uploads/2023/07/Img3090-scaled.jpg',
//             ingredients: [
//               '4 ripe tomatoes',
//               '1 cucumber, peeled',
//               '1 green pepper',
//               '1 small onion',
//               '2 cloves garlic',
//               '3 tbsp olive oil',
//               '2 tbsp sherry vinegar',
//               'Salt & pepper'
//             ],
//             method:
//               '1. Blitz all ingredients in blender until smooth.\n' +
//               '2. Chill 2 hrs. Serve cold with croutons or diced veggies.'
//           },
//           {
//             name: 'Flan',
//             isCompleted: false,
//             time: '1 hr (incl. chill)',
//             image: 'https://spanishsabores.com/wp-content/uploads/2025/01/Pumpkin-Flan-Featured-01.jpg',
//             ingredients: [
//               '1 cup sugar',
//               '4 eggs',
//               '2 cups milk',
//               '1 tsp vanilla'
//             ],
//             method:
//               '1. Caramelize sugar in pan; pour into ramekins.\n' +
//               '2. Whisk eggs, milk & vanilla; strain over caramel.\n' +
//               '3. Bake in water bath at 160 °C 45 min.\n' +
//               '4. Chill, invert onto plate.'
//           },
//           {
//             name: 'Pisto',
//             isCompleted: false,
//             time: '45 mins',
//             image: 'https://radfoodie.com/wp-content/uploads/2022/11/Pisto-manchego-square1.jpg',
//             ingredients: [
//               '2 aubergines, diced',
//               '2 zucchini, diced',
//               '1 bell pepper, diced',
//               '1 onion, chopped',
//               '2 tomatoes, chopped',
//               'Olive oil, salt & pepper'
//             ],
//             method:
//               '1. Sauté onion & pepper in oil until soft.\n' +
//               '2. Add aubergine & zucchini, cook 10 min.\n' +
//               '3. Stir in tomatoes, simmer 20 min until thick.\n' +
//               '4. Season and serve with crusty bread.'
//           },
//         ],
//       },
//       {
//         name: 'Italian PastaPassion',
//         description: 'A love letter to carbs and cheese - rustic, romantic, and absolutely irresistible. Whether it is handmade pasta or tiramisu, Italian food just gets you.',
//         image: 'https://puertovallarta.hotelmousai.com/blog/assets/img/Top-10-Traditional-Foods-in-Italy.jpg',
//         recipes: [
//           {
//             name: 'Spaghetti Aglio e Olio',
//             isCompleted: false,
//             time: '20 mins',
//             image: 'https://www.the-pasta-project.com/wp-content/uploads/Spaghetti-aglio-e-olio-7.jpg',
//             ingredients: [
//               '400 g spaghetti',
//               '4 cloves garlic, sliced',
//               '½ cup olive oil',
//               '1 tsp red pepper flakes',
//               'Parsley & parmesan to garnish',
//               'Salt to taste'
//             ],
//             method:
//               '1. Cook spaghetti in salted water al dente.\n' +
//               '2. Sauté garlic & pepper flakes in oil until golden.\n' +
//               '3. Toss pasta in garlic oil, season.\n' +
//               '4. Plate, sprinkle parsley & cheese. Serve hot.'
//           },
//           {
//             name: 'Margherita Pizza',
//             isCompleted: false,
//             time: '1 hr 30 mins',
//             image: 'https://tmbidigitalassetsazure.blob.core.windows.net/wpconnatixthumbnailsprod/MargheritaPizza275515H_thumbnail.jpeg',
//             ingredients: [
//               'Pizza dough',
//               '½ cup tomato sauce',
//               '200 g fresh mozzarella',
//               'Basil leaves',
//               'Olive oil & salt'
//             ],
//             method:
//               '1. Preheat oven to 250 °C with pizza stone.\n' +
//               '2. Stretch dough, spread sauce, top with mozzarella.\n' +
//               '3. Bake 10–12 min until crust is blistered.\n' +
//               '4. Scatter basil, drizzle oil. Serve immediately.'
//           },
//           {
//             name: 'Bruschetta',
//             isCompleted: false,
//             time: '15 mins',
//             image: 'https://jennifercooks.com/wp-content/uploads/2024/07/tomate-and-mozzarella-bruschetta-with-balsamic-drizzle-recipe-jennifercooks_0155-scaled.jpeg',
//             ingredients: [
//               '1 baguette, sliced',
//               '2 tomatoes, diced',
//               '2 cloves garlic, minced',
//               'Basil & olive oil',
//               'Salt & pepper'
//             ],
//             method:
//               '1. Toast bread slices.\n' +
//               '2. Mix tomato, garlic, basil, oil, salt & pepper.\n' +
//               '3. Spoon topping onto bread. Serve immediately.'
//           },
//           {
//             name: 'Pesto Pasta',
//             isCompleted: false,
//             time: '25 mins',
//             image: 'https://feelgoodfoodie.net/wp-content/uploads/2024/05/Shrimp-Pesto-Pasta-12.jpg',
//             ingredients: [
//               '400 g pasta',
//               '2 cups fresh basil leaves',
//               '½ cup pine nuts',
//               '2 cloves garlic',
//               '½ cup parmesan',
//               '½ cup olive oil',
//               'Salt & pepper'
//             ],
//             method:
//               '1. Blend basil, nuts, garlic, cheese & oil to pesto.\n' +
//               '2. Cook pasta al dente, toss with pesto.\n' +
//               '3. Plate & garnish with extra cheese.'
//           },
//           {
//             name: 'Tiramisu',
//             isCompleted: false,
//             time: '4 hrs (+chill)',
//             image: 'https://i0.wp.com/www.foodfashionparty.com/wp-content/uploads/2023/05/iStock-1325617821-scaled.jpg?resize=1200%2C1200&ssl=1',
//             ingredients: [
//               '200 g ladyfingers',
//               '3 eggs, separated',
//               '½ cup sugar',
//               '250 g mascarpone',
//               '1 cup coffee, cooled',
//               'Cocoa powder'
//             ],
//             method:
//               '1. Beat yolks & sugar until pale, fold in mascarpone.\n' +
//               '2. Whip whites to soft peaks, gently fold into cream.\n' +
//               '3. Dip ladyfingers in coffee, layer in tray, spread cream.\n' +
//               '4. Repeat layers, dust cocoa. Chill 3 hrs before serving.'
//           },
//           {
//             name: 'Caprese Salad',
//             isCompleted: false,
//             time: '10 mins',
//             image: 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/07/Caprese-Salad-2-2.jpg',
//             ingredients: [
//               '2 large tomatoes, sliced',
//               '200 g fresh mozzarella, sliced',
//               'Fresh basil leaves',
//               'Olive oil, balsamic glaze',
//               'Salt & pepper'
//             ],
//             method:
//               '1. Alternate tomato & mozzarella slices on plate.\n' +
//               '2. Tuck basil leaves between.\n' +
//               '3. Drizzle oil & glaze, season. Serve immediately.'
//           },
//         ],
//       },
//     ],
//   };

//   // const handleSelectCuisine = (cuisine) => {
//   //   navigate(`/progress/${cuisine.name}`, { state: { cuisine } });
//   // };

//   const handleSelectCuisine = (cuisine, level) => {
//     navigate(`/progress/${cuisine.name}`, {
//       state: { cuisine, level } // 💥 Pass the level here!
//     });
//   };
  

//   const renderCuisineCards = (category, color) => (
//     <div className="scroll-smooth">

//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//       {cuisines[category].map((cuisine, index) => (
//         <div
//           key={index}
//           className={`bg-white rounded-xl shadow-xl border-t-8 border-${color}-500 p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300`}
//         >
//           <img
//             src={cuisine.image}
//             alt={cuisine.name}
//             className="w-full h-60 object-cover rounded-lg mb-5"
//           />
//           <div className="text-center">
//             <h3 className={`text-2xl font-semibold text-${color}-700 mb-4`}>
//               {cuisine.name}
//             </h3>
//             <p className="text-gray-600 text-sm mb-4">{cuisine.description}</p>
//             <button
//               onClick={() => handleSelectCuisine(cuisine)}
//               className={`mt-2 px-5 py-2 rounded-full bg-${color}-500 hover:bg-${color}-600 text-white font-semibold transition`}
//             >
//               Add to My Plan
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//     </div>
//   );

//   return (
//     <>
//       <NavbarLP />
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-10">
//       <div className="max-w-7xl mx-auto -space-y-8 -mt-20">
//         <section>
//           <h2 id="beginner" className="text-3xl font-extrabold text-blue-800 text-center mb-8 animate-glowIn">🥄 Beginner Level</h2>
//           {renderCuisineCards('beginner', 'blue')}
//         </section>
//         <section>
//           <h2 id="intermediate" className="text-3xl font-extrabold text-yellow-800 text-center mb-8 animate-glowIn">🍝 Intermediate Level</h2>
//           {renderCuisineCards('intermediate', 'yellow')}
//         </section>
//         <section>
//           <h2 id="advanced" className="text-3xl font-extrabold text-red-800 text-center mb-8 animate-glowIn">🍽️ Advanced Level</h2>
//           {renderCuisineCards('advanced', 'red')}
//         </section>
//       </div>
//     </div>
//     </>
//   );
// };

// export default PlanPage;









import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CuisineCard from '../../components/LearningPlan/CuisineCard';
import NavbarLP from '../../components/LearningPlan/NavbarLP';

const PlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cuisinesByLevel, setCuisinesByLevel] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.replace('#', ''));
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
        const API_BASE = 'http://localhost:5000';
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
          beginner: results[0],
          intermediate: results[1],
          advanced: results[2]
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

export default PlanPage;






















// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import CuisineCard from '../../components/LearningPlan/CuisineCard';
// import NavbarLP from '../../components/LearningPlan/NavbarLP';

// const PlanPage = () => {
//   const { level } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [allCuisines, setAllCuisines] = useState({ beginner: [], intermediate: [], advanced: [] });

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
//     const levels = ['beginner', 'intermediate', 'advanced'];
//     Promise.all(
//       levels.map(lvl =>
//         fetch(`/api/cuisines?level=${lvl}`)
//           .then(res => res.json())
//           .then(data => ({ [lvl]: data }))
//       )
//     )
//       .then(results => {
//         const cuisinesMap = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
//         setAllCuisines(cuisinesMap);
//       })
//       .catch(err => console.error('Error loading cuisines:', err));
//   }, []);

//   const handleSelectCuisine = (cuisine, level) => {
//     navigate(`/progress/${cuisine.name}`, {
//       state: { cuisine, level }
//     });
//   };

//   const renderCuisineCards = (category, color) => (
//     <div className="scroll-smooth">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {allCuisines[category].map((cuisine, index) => (
//           <div
//             key={index}
//             className={`bg-white rounded-xl shadow-xl border-t-8 border-${color}-500 p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300`}
//           >
//             <img
//               src={cuisine.image}
//               alt={cuisine.name}
//               className="w-full h-60 object-cover rounded-lg mb-5"
//             />
//             <div className="text-center">
//               <h3 className={`text-2xl font-semibold text-${color}-700 mb-4`}>
//                 {cuisine.name}
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">{cuisine.description}</p>
//               <button
//                 onClick={() => handleSelectCuisine(cuisine, category)}
//                 className={`mt-2 px-5 py-2 rounded-full bg-${color}-500 hover:bg-${color}-600 text-white font-semibold transition`}
//               >
//                 Add to My Plan
//               </button>
//             </div>
//           </div>
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

// export default PlanPage;
