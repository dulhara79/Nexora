// HomePage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import FallbackAvatar from '../components/common/FallbackAvatar';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const BASE_URL = "http://localhost:5000/api"; // Adjust this to your Spring Boot API URL

  useEffect(() => {
    // Fetch data from your Spring Boot APIs
    Promise.all([
      axios.get(`${BASE_URL}/posts`),
      axios.get(`${BASE_URL}/cuisines?level=beginner`),
      axios.get(`${BASE_URL}/challenges`),
      axios.get(`${BASE_URL}/questions`),
    ]).then(([postsRes, cuisinesRes, challengesRes, questionsRes]) => {
      console.log("Posts API Response:", postsRes.data);
      console.log("Cuisines API Response:", cuisinesRes.data);
      console.log("Challenges API Response:", challengesRes.data);
      console.log("Questions API Response:", questionsRes.data.questions);

      setPosts(postsRes.data.map(item => item.post || item));
      setCuisines(cuisinesRes.data);
      setChallenges(challengesRes.data);
      setQuestions(questionsRes.data.questions);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Navigation Tabs */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        {activeTab === "all" && (
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container px-4 py-8 mx-auto"
          >
            <AllContent
              posts={posts}
              cuisines={cuisines}
              challenges={challenges}
              questions={questions}
            />
          </motion.div>
        )}

        {activeTab === "posts" && <PostFeed key="posts" posts={posts} />}

        {activeTab === "learning" && (
          <LearningGrid key="learning" cuisines={cuisines} />
        )}

        {activeTab === "challenges" && (
          <ChallengeCarousel key="challenges" challenges={challenges} />
        )}

        {activeTab === "forum" && (
          <ForumHighlights key="forum" questions={questions} />
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <FloatingCTA />
    </div>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <div className="relative py-16 overflow-hidden text-white bg-gradient-to-r from-orange-500 to-pink-500 md:py-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-white rounded-full -top-10 -right-10 w-72 h-72 opacity-10 animate-pulse"></div>
        <div className="absolute w-64 h-64 delay-1000 bg-white rounded-full top-1/2 left-10 opacity-5 animate-pulse"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Master Culinary Arts with Nexora
          </h1>
          <p className="mb-8 text-xl">
            Connect, Learn, and Share Your Cooking Journey with the World
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 font-semibold text-orange-600 transition-all transform bg-white rounded-full hover:bg-opacity-90 hover:scale-105">
              Start Learning
            </button>
            <button className="px-8 py-3 font-semibold text-white transition-all border-2 border-white rounded-full hover:bg-white hover:text-orange-600">
              Explore Recipes
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = ["all", "posts", "learning", "challenges", "forum"];

  return (
    <div className="container px-4 mx-auto mt-8">
      <div className="flex pb-2 space-x-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Add this component above AllContent
function ChallengeCard({ challenge, delay }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl"
    >
      <img
        src={challenge.image}
        alt={challenge.title}
        className="object-cover w-full h-48"
      />
      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold">{challenge.title}</h3>
        <p className="mb-4 text-gray-600">{challenge.description}</p>
        <button className="w-full py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
          Join
        </button>
      </div>
    </motion.div>
  );
}

// All Content Component
function AllContent({ posts, cuisines, challenges, questions }) {
  return (
    <div className="space-y-16">
      <section>
        <h2 className="mb-6 text-3xl font-bold">Recent Culinary Creations</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(posts) && posts.slice(0, 3).map((post, index) => (
            <PostCard key={post.id || index} post={post} delay={index * 0.1} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">Learning Paths</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.isArray(cuisines) && cuisines.slice(0, 3).map((cuisine, index) => (
            <CuisineCard key={cuisine.id} cuisine={cuisine} delay={index * 0.1} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">Ongoing Challenges</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.isArray(challenges) && challenges.slice(0, 3).map((challenge, index) => (
            <ChallengeCard key={challenge.challengeId} challenge={challenge} delay={index * 0.1} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">Community Forum</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.isArray(questions) && questions.slice(0, 2).map((question, index) => (
            <ForumCard key={question.id} question={question} delay={index * 0.1} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Post Card Component
function PostCard({ post, delay }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="overflow-hidden transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
    >
      <img
        src={post.imageUrl}
        alt={post.description}
        className="object-cover w-full h-48"
      />
      <div className="p-5">
        <div className="flex items-center mb-2">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-8 h-8 mr-2 rounded-full"
          />
          <span className="font-medium">{post.userName}</span>
        </div>
        <p className="mb-3 text-gray-700">{post.description}</p>
        <div className="flex items-center justify-between">
          <button className="flex items-center text-gray-500 transition-colors hover:text-red-500">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {post.likes}
          </button>
          <span className="text-sm text-gray-400">{post.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Cuisine Card Component
function CuisineCard({ cuisine, delay }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="overflow-hidden transition-all duration-300 transform bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1"
    >
      <img
        src={cuisine.image}
        alt={cuisine.name}
        className="object-cover w-full h-48"
      />
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{cuisine.name}</h3>
          <span className="px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
            {cuisine.level}
          </span>
        </div>
        <p className="mb-4 text-gray-600">{cuisine.description}</p>
        <button className="w-full py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
          Learn More
        </button>
      </div>
    </motion.div>
  );
}

// Challenge Carousel Component
function ChallengeCarousel({ challenges }) {
  return (
    <section className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-3xl font-bold">Ongoing Cooking Challenges</h2>
      <div className="relative">
        <div className="flex pb-4 space-x-4 overflow-x-auto scrollbar-hide">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[300px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <img
                src={challenge.image}
                alt={challenge.title}
                className="object-cover w-full h-48"
              />
              <div className="p-5">
                <h3 className="mb-2 text-xl font-bold">{challenge.title}</h3>
                <p className="mb-4 text-gray-600">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-500">
                    {challenge.theme}
                  </span>
                  <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
                    Join
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Forum Card Component
// function ForumCard({ question, delay }) {
//   return (
//     <motion.div
//       initial={{ y: 20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ delay }}
//       className="p-5 transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
//     >
//       <div className="flex items-center mb-3">
//         <img
//           src={question.author.avatar}
//           alt={question.authorUsername}
//           className="w-10 h-10 mr-3 rounded-full"
//         />
//         <div>
//           <h3 className="font-bold">{question.title}</h3>
//           <p className="text-sm text-gray-500">{question.author.name}</p>
//         </div>
//       </div>
//       <p className="mb-4 text-gray-700">{question.content}</p>
//       <div className="flex items-center justify-between text-sm text-gray-500">
//         <span>{question.tags.join(", ")}</span>
//         <div className="flex items-center">
//           <svg
//             className="w-4 h-4 mr-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
//             />
//           </svg>
//           {question.comments.length} Comments
//         </div>
//       </div>
//     </motion.div>
//   );
// }

function ForumCard({ question, delay }) {
  const authorName = question.author?.name || 'Anonymous';
  const avatarUrl = question.author?.avatar;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="p-5 transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
    >
      <div className="flex items-center mb-3">
        <FallbackAvatar 
          src={avatarUrl} 
          name={authorName} 
          size={10} 
        />
        <div className="ml-3">
          <h3 className="font-bold">{question.title}</h3>
          <p className="text-sm text-gray-500">{authorName}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-700">{question.content}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{question.tags?.join(', ') || 'Uncategorized'}</span>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {question.comments?.length || 0} Comments
        </div>
      </div>
    </motion.div>
  );
}

// Floating Action Button Component
function FloatingCTA() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="fixed z-50 bottom-6 right-6"
    >
      <button className="p-4 text-white transition-colors transform bg-orange-500 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 hover:scale-110">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
    </motion.div>
  );
}
