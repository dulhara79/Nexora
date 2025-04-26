import React from "react";
import { useNavigate } from "react-router-dom";
import LearningPlanCreator from "../../components/LearningPlan/LearningPlanCreator.jsx";
import NavbarLP from "../../components/LearningPlan/NavbarLP.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  const levels = [
    {
      name: "Beginner",
      route: "/cuisine/beginner",
      description:
        "Start with simple recipes to build your kitchen confidence. Enjoy easy-to-follow recipes and begin your culinary journey!",
      borderClass: "border-blue-600",
      textClass: "text-blue-800",
      buttonClass: "bg-blue-500 hover:bg-blue-600",
      image:
        "https://www.baltana.com/files/wallpapers-28/Cupcake-Unicorn-Desktop-Wallpaper-85046.jpg",
    },
    {
      name: "Intermediate",
      route: "/cuisine/intermediate",
      description:
        "Take your skills up a notch with diverse and challenging dishes. Perfect for those who have mastered the basics and are ready for more adventure!",
      borderClass: "border-yellow-600",
      textClass: "text-yellow-800",
      buttonClass: "bg-yellow-500 hover:bg-yellow-600",
      image:
        "https://www.baltana.com/files/wallpapers-25/Spaghetti-Wallpaper-1332x850-68239.jpg",
    },
    {
      name: "Advanced",
      route: "/cuisine/advanced",
      description:
        "Master your craft with complex recipes and advanced techniques. For the seasoned cook looking to refine every detail.",
      borderClass: "border-red-600",
      textClass: "text-red-800",
      buttonClass: "bg-red-500 hover:bg-red-600",
      image:
        "https://www.baltana.com/files/wallpapers-27/Fried-Hamburger-Background-HD-Wallpapers-84170.jpg",
    },
  ];

  const handleSelectLevel = (level) => {
    navigate(`${level.route}#${level.name.toLowerCase()}`);
  };

  return (
    <>
      <NavbarLP />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-6 drop-shadow-md animate-fade-in">
            Ready For Your Cooking Journey?
          </h1>

          <div className="w-full py-7 text-center bg-blue-950 text-white rounded-xl shadow-lg mb-8 mt-9">
            <h1 className="text-3xl font-extrabold tracking-wide text-white animate__animated animate__fadeInUp">
              From Zero to Hero - Pick Your Level!
            </h1>
          </div>

          <LearningPlanCreator />

          {/* Join Nexora Banner */}
          <div className="w-full py-7 text-center bg-blue-950 text-white rounded-xl shadow-lg mb-8 mt-9">
            <h1 className="text-3xl font-extrabold tracking-wide text-white animate__animated animate__fadeInUp">
              Join Nexora Today and Cook Like a Pro!
            </h1>
          </div>

          {/* Downward pointing arrow with bounce animation */}
          <div className="flex justify-center mt-4 mb-6">
            <div className="animate-bounce text-4xl text-blue-700 drop-shadow-md">
              ⬇️
            </div>
          </div>

          <div className="flex flex-col space-y-8 mt-10">
            {levels.map((level, idx) => (
              <div
                key={idx}
                className={`p-6 bg-white shadow-xl rounded-xl border-4 ${level.borderClass} hover:scale-[1.015] transition-transform duration-300`}
              >
                <div className="flex flex-col items-center text-center">
                  <h2 className={`text-2xl font-bold ${level.textClass} mb-4`}>
                    {level.name}
                  </h2>
                  <p className="text-gray-600 mb-8">{level.description}</p>
                  <img
                    src={level.image}
                    alt={level.name}
                    className="w-full h-100 object-cover rounded-md mb-8 transition-transform transform hover:scale-105"
                  />
                  <button
                    onClick={() => handleSelectLevel(level)}
                    className={`px-6 py-2 rounded-full ${level.buttonClass} text-white font-semibold transition-all duration-300`}
                  >
                    Explore {level.name} Plan →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
