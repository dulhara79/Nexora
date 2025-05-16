import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/NewPageHeader";

const API_BASE = "http://localhost:5000";

// 🔍 Categorize each ingredient based on keywords
const categorizeIngredient = (ingredient) => {
  const lower = ingredient.toLowerCase();
  const categories = [
    {
      type: "Produce 🥬",
      keywords: [
        "onion",
        "garlic",
        "tomato",
        "chili",
        "pepper",
        "zucchini",
        "cucumber",
        "carrot",
        "lettuce",
        "eggplant",
        "potato",
        "cabbage",
        "spinach",
        "basil",
        "mint",
      ],
    },
    {
      type: "Spices & Condiments 🌶️",
      keywords: [
        "salt",
        "pepper",
        "chili",
        "turmeric",
        "curry",
        "powder",
        "masala",
        "sauce",
        "vinegar",
        "soy",
        "fish sauce",
        "chaat",
        "ginger",
        "mustard",
        "fenugreek",
        "cumin",
      ],
    },
    {
      type: "Dairy 🧀",
      keywords: [
        "milk",
        "butter",
        "cream",
        "cheese",
        "mozzarella",
        "yogurt",
        "mascarpone",
      ],
    },
    {
      type: "Grains & Flour 🍞",
      keywords: [
        "rice",
        "flour",
        "roti",
        "semolina",
        "bread",
        "noodle",
        "tortilla",
        "pasta",
        "dough",
        "batter",
      ],
    },
    {
      type: "Protein 🍖",
      keywords: [
        "egg",
        "chicken",
        "beef",
        "pork",
        "tofu",
        "shrimp",
        "fish",
        "lentil",
        "paneer",
        "chickpea",
        "mutton",
      ],
    },
    {
      type: "Sweets & Baking 🍭",
      keywords: [
        "sugar",
        "jaggery",
        "vanilla",
        "chocolate",
        "syrup",
        "cocoa",
        "honey",
      ],
    },
  ];

  for (let cat of categories) {
    if (cat.keywords.some((k) => lower.includes(k))) return cat.type;
  }

  return "Misc 🧂";
};

const ShoppingListPage = () => {
  const [cuisines, setCuisines] = useState([]);

  const extractEmbedded = (data) => {
    const emb = data._embedded || {};
    const key = Object.keys(emb)[0];
    return emb[key] ?? [];
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const lvls = ["beginner", "intermediate", "advanced"];
        const results = await Promise.all(
          lvls.map((lvl) =>
            fetch(`${API_BASE}/api/cuisines?level=${lvl}`).then((res) =>
              res.ok ? res.json() : Promise.reject()
            )
          )
        );
        const all = results.flatMap((r) => extractEmbedded(r));
        setCuisines(all);
      } catch (err) {
        console.error("Could not load cuisines:", err);
      }
    };
    fetchAll();
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-50 pb-16">
      <Navbar />

      {/* 🔥 Hero */}
      <header className="relative h-48 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 mb-8">
        <h1 className="text-3xl md:text-5xl text-white font-extrabold drop-shadow-lg">
          🛒 Everything you need!
        </h1>
        <button
          onClick={handlePrint}
          className="absolute right-8 top-6 px-4 py-2 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition"
        >
          🖨️ Print the Ingredients List
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {cuisines.map((cuisine, ci) => (
          <section
            key={ci}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="px-6 py-6 bg-gradient-to-r from-red-500 to-orange-400">
              <h2 className="text-3xl font-bold text-white">{cuisine.name}</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {(cuisine.recipes || []).map((r, ri) => {
                const categorized = {};

                (r.ingredients || []).forEach((ing) => {
                  const type = categorizeIngredient(ing);
                  if (!categorized[type]) categorized[type] = [];

                  // Strip amount/measurement and keep only the ingredient name
                  const shortName = ing
                    .replace(/^(\d+\s?[\w/.,()]+)?\s*/i, "")
                    .trim();

                  // Avoid duplicates
                  if (!categorized[type].includes(shortName)) {
                    categorized[type].push(shortName);
                  }
                });

                return (
                  <div key={ri} className="px-6 py-6">
                    <h3 className="text-2xl font-semibold text-red-600 mb-4">
                      🍽️ {r.name}
                    </h3>
                    {Object.entries(categorized).map(([cat, ings], i) => (
                      <div key={i} className="mb-4">
                        <h4 className="text-lg font-semibold text-orange-500 mb-2">
                          {cat}
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {ings.map((item, ii) => (
                            <li key={ii}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {cuisines.length === 0 && (
          <p className="text-center text-gray-500">
            Loading ingredients… 🍅🧄🫑
          </p>
        )}

        <p className="text-center text-gray-600 text-sm mt-8">
          Ingredients grouped by type for easier shopping. You’re welcome. 😌
        </p>
      </div>
    </div>
  );
};

export default ShoppingListPage;
