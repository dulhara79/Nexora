import React from "react";
import Navbar from "../../components/common/NewPageHeader";

const KitchenWisdomPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-50 pb-16">
      <Navbar />

      {/* Hero */}
      <header className="relative h-30 flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl text-white font-extrabold drop-shadow-xl">
          Kitchen Wisdom
        </h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 space-y-12">

        {/* Tips Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-red-400">
          <h2 className="text-3xl font-bold text-red-600 mb-6">👩‍🍳 Timeless Cooking Tips</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-4 text-lg">
            <li><strong>Salt Smart:</strong> Always taste as you go. Salt can’t be un-shaken, bestie.</li>
            <li><strong>Knife Confidence:</strong> Keep your knives sharp – it’s safer AND you’ll feel like a warrior.</li>
            <li><strong>Heat Patience:</strong> Let your pan heat up *before* adding anything. Cold pan = sad food.</li>
            <li><strong>Don't Crowd the Pan:</strong> Give your food space. It’s not a party, it’s a sear.</li>
            <li><strong>Prep Before You Flex:</strong> Read the recipe once. Then again. *Then* cook. ✨Mise en place✨ baby.</li>
            <li><strong>Clean as You Go:</strong> Future You will cry tears of gratitude (and not from onions).</li>
            <li><strong>Taste {'>'} Perfect:</strong> Focus on flavor, not aesthetics. You're feeding humans, not the algorithm.</li>
          </ul>
        </section>

        {/* Motivation Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-400">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">💪 Motivation for Your Inner Chef</h2>
          <div className="space-y-6 text-lg text-gray-800 italic">
            <p>✨ "Even Gordon Ramsay started somewhere. So did your grandma. So can you." 👵❤️</p>
            <p>✨ "Burnt toast is not a failure. It’s a lesson in heat control." 🔥</p>
            <p>✨ "Don’t aim for Michelin stars. Aim for *mmm, this is good!*"</p>
            <p>✨ "You’re not just cooking food. You’re crafting memories, smells, and bite-sized love." 🍽️</p>
            <p>✨ "The mess in the kitchen is the art of someone who tried." 🎨</p>
            <p>✨ "Add a little more garlic. No one ever regretted that." 🧄</p>
          </div>
        </section>

        {/* Bonus Section */}
        <section className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-yellow-400">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6">🌟 Little Hacks, Big Impact</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-4 text-lg">
            <li><strong>Keep lemons fresh:</strong> Store them in water in the fridge!</li>
            <li><strong>Revive stale bread:</strong> Sprinkle with water and bake for 5 minutes!</li>
            <li><strong>Herbs going limp?</strong> Chop & freeze them in olive oil in an ice tray.</li>
            <li><strong>No rolling pin?</strong> Use a clean wine bottle. 🍷</li>
            <li><strong>Need buttermilk?</strong> Add 1 tbsp vinegar to 1 cup milk and wait 5 mins. BOOM.</li>
          </ul>
        </section>

        {/* Footer message */}
        <p className="text-center text-sm text-gray-600 italic pt-8">
          You got this. Your kitchen is your lab, your therapy, your stage. Own it. 🔥🫶
        </p>
      </main>
    </div>
  );
};

export default KitchenWisdomPage;