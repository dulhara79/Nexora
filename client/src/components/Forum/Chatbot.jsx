// src/components/FAQChatbot.jsx
import React, { useState } from 'react';
import '../../styles/FAQChatbot.css';

const faqData = [
  {
    id: 1,
    question: "How do I convert oven temperatures for convection vs regular ovens?",
    answer: "Reduce temperature by 25°F (15°C) when using convection. Example: 375°F regular oven = 350°F convection. Always check food 5-10 minutes earlier."
  },
  {
    id: 2,
    question: "What's the best substitute for eggs in baking?",
    answer: "For 1 egg: use 1/4 cup applesauce, 1 mashed banana, or 1 tbsp ground flaxseed + 3 tbsp water. For binding, 3 tbsp aquafaba (chickpea liquid) works well."
  },
  {
    id: 3,
    question: "How can I prevent my cake from sinking in the middle?",
    answer: "Ensure proper oven temperature, don't open oven during first 3/4 baking time, and mix batter just until combined. Check doneness with toothpick before removing."
  },
  {
    id: 4,
    question: "How do I properly season a cast iron skillet?",
    answer: "Clean with coarse salt, rinse/dry thoroughly, rub with thin layer of vegetable oil, and bake upside-down at 375°F (190°C) for 1 hour. Repeat 2-3 times for best results."
  },
  {
    id: 5,
    question: "Why does my homemade bread have dense texture?",
    answer: "Common causes: over-flouring during shaping, insufficient kneading/rising time, or expired yeast. Ensure proper proofing (doubled in size) and fresh ingredients."
  },
  {
    id: 6,
    question: "How can I thicken a sauce without cornstarch?",
    answer: "Use roux (equal parts butter + flour), make a beurre manié (kneaded butter-flour), or reduce sauce by simmering. Arrowroot or potato starch also work as alternatives."
  },
  {
    id: 7,
    question: "What's the best way to store fresh herbs?",
    answer: "For leafy herbs: trim stems, place in jar with water (like flowers), cover loosely with plastic bag. For woody herbs: wrap in damp paper towel in airtight container."
  },
  {
    id: 8,
    question: "How do I prevent vegetables from getting soggy when roasting?",
    answer: "Pat dry thoroughly, space evenly on preheated sheet pan, and avoid overcrowding. Roast at high heat (400-425°F) and flip halfway through cooking."
  },
  {
    id: 9,
    question: "Can I freeze cookie dough? How long does it last?",
    answer: "Yes! Portion dough into balls, freeze on baking sheet, then transfer to airtight bag. Use within 3 months. Bake frozen - add 1-2 minutes to cooking time."
  },
  {
    id: 10,
    question: "How do I clean burnt food from pots without scratching?",
    answer: "Make a paste with baking soda + vinegar, let sit 15 minutes. Gently scrub with nylon brush. For stubborn stains, boil water with 2 tbsp cream of tartar, then scrub."
  }
];

// const faqData = [
//   // General Questions Section (3)
//   {
//     id: 1,
//     category: "General",
//     question: "How do I reset my forum account password?",
//     answer: "Click 'Forgot Password' on the login page, enter your registered email, and follow the reset link sent to your inbox. Check spam folder if not received within 5 minutes."
//   },
//   {
//     id: 2,
//     category: "General",
//     question: "Can I change my forum username?",
//     answer: "Usernames can be changed once every 90 days through Profile Settings > Account Information. Previous username remains visible on old posts."
//   },
//   {
//     id: 3,
//     category: "General",
//     question: "How do I report inappropriate content?",
//     answer: "Click the flag icon (⚑) on any post/message. Our moderation team reviews reports within 24 hours. Do not engage with problematic content."
//   },

//   // Cooking-Related Questions Section (5)
//   {
//     id: 4,
//     category: "Cooking Related",
//     question: "How do I fix over-salted soup?",
//     answer: "Add peeled raw potatoes (absorbs salt), dilute with unsalted broth, or balance with acid like lemon juice/vinegar. Taste after each adjustment."
//   },
//   {
//     id: 5,
//     category: "Cooking Related",
//     question: "What's the difference between baking powder and baking soda?",
//     answer: "Baking soda needs acid (buttermilk, yogurt) to activate. Baking powder contains its own acid. Use 3x baking powder to replace 1x baking soda."
//   },
//   {
//     id: 6,
//     category: "Cooking Related",
//     question: "How do I prevent pasta from sticking?",
//     answer: "Use 4-6 quarts water per pound of pasta, add salt after boiling, stir frequently during first 2 minutes. Never add oil to cooking water."
//   },
//   {
//     id: 7,
//     category: "Cooking Related",
//     question: "Why won't my whipped cream stiffen?",
//     answer: "Ensure bowl/utensils are chilled, use cream with 30%+ fat content, and whip at medium speed. Add 1 tbsp cornstarch per cup if humidity is high."
//   },
//   {
//     id: 8,
//     category: "Cooking Related",
//     question: "How do I core a tomato quickly?",
//     answer: "Use a paring knife to cut shallow X on bottom. Scoop from top with melon baller or spoon, or slice tomato horizontally and remove core sections."
//   }
// ];

const FAQChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState(null);
  const [showBackButton, setShowBackButton] = useState(false);

  const handleQuestionClick = (answer) => {
    setActiveAnswer(answer);
    setShowBackButton(true);
  };

  const handleBackClick = () => {
    setActiveAnswer(null);
    setShowBackButton(false);
  };

  return (
    <>
      <div className="chatbot-icon" onClick={() => setIsOpen(!isOpen)}>
        <div className="chatbot-icon-inner">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white"/>
            <path d="M12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14Z" fill="white"/>
            <path d="M12 16C9.67 16 8 14.33 8 12C8 9.67 9.67 8 12 8C14.33 8 16 9.67 16 12C16 14.33 14.33 16 12 16ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z" fill="white"/>
          </svg>
        </div>
        <span className="chatbot-tooltip">FAQ</span>
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="bot-avatar">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 11.5C13.93 11.5 15.5 9.93 15.5 8C15.5 6.07 13.93 4.5 12 4.5C10.07 4.5 8.5 6.07 8.5 8C8.5 9.93 10.07 11.5 12 11.5ZM12 13.5C9.33 13.5 4 15.04 4 18V20H20V18C20 15.04 14.67 13.5 12 13.5Z" fill="#e94e31"/>
              </svg>
            </div>
            <span>Nexora Assistant</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-body">
            {activeAnswer ? (
              <div className="answer-display">
                <button 
                  className="back-btn"
                  onClick={handleBackClick}
                  style={{ display: showBackButton ? 'flex' : 'none' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="#e94e31"/>
                  </svg>
                  Back
                </button>
                <div className="answer-content">{activeAnswer}</div>
              </div>
            ) : (
              <div className="question-list">
                <h3>Common Questions</h3>
                {faqData.map((faq) => (
                  <button 
                    key={faq.id}
                    className="question-btn"
                    onClick={() => handleQuestionClick(faq.answer)}
                  >
                    {faq.question}
                  </button>
                ))}
                <div className="chatbot-footer">
                  <p>Need more help? Try asking:</p>
                  <ul>
                    <li>"How do I upload recipes?"</li>
                    <li>"Where are community guidelines?"</li>
                    <li>"How to join cooking challenges?"</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FAQChatbot;