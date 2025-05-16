import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  Check,
  Clock,
  HelpCircle,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const QuizCreate = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    category: "general",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
      },
    ],
    deadline: "",
    allowComments: true,
    isPublic: true,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { value: "general", label: "General Cooking" },
    { value: "baking", label: "Baking & Pastry" },
    { value: "cuisine", label: "World Cuisines" },
    { value: "techniques", label: "Cooking Techniques" },
    { value: "ingredients", label: "Ingredient Knowledge" },
  ];

  const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Challenging" },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.deadline) newErrors.deadline = "Deadline is required";
    } else if (step === 1) {
      const questionData = formData.questions[currentStep - 1];
      if (!questionData.question.trim())
        newErrors.question = "Question is required";

      const filledOptions = questionData.options.filter(
        (opt) => opt.trim() !== ""
      );
      if (filledOptions.length < 2)
        newErrors.options = "At least 2 options are required";

      if (!questionData.correctAnswer)
        newErrors.correctAnswer = "Correct answer must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length <= 1) return;

    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);

    setFormData({
      ...formData,
      questions: newQuestions,
    });

    if (currentStep > newQuestions.length) {
      setCurrentStep(newQuestions.length);
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleQuestionChange = (e, questionIndex, optionIndex = null) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];

    if (name === "options" && optionIndex !== null) {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    } else {
      updatedQuestions[questionIndex][name] = value;
    }

    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Format the data for API
      const formattedData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        deadline: new Date(formData.deadline).toISOString(),
        allowComments: formData.allowComments,
        isPublic: formData.isPublic,
        questions: formData.questions.map((q) => ({
          question: q.question,
          options: q.options.filter((opt) => opt.trim() !== ""),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
      };

      await axios.post("http://localhost:5000/api/quizzes", formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/forum/quizzes");
      }, 2000);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.error || "Failed to create quiz",
      });
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  // Get current step content
  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <motion.div
          key="basic-info"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Quiz Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleBasicInfoChange}
              placeholder="Enter an engaging title for your cooking quiz"
              className={`block w-full p-3 bg-white bg-opacity-10 backdrop-blur-sm border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleBasicInfoChange}
              placeholder="Describe what participants will learn from this quiz"
              rows={3}
              className={`block w-full p-3 bg-white bg-opacity-10 backdrop-blur-sm border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleBasicInfoChange}
                className="block w-full p-3 transition-all bg-white border border-gray-300 rounded-lg bg-opacity-10 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {difficultyLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                      formData.difficulty === level.value
                        ? "bg-blue-600 text-white"
                        : "bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, difficulty: level.value })
                    }
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <Clock className="inline w-4 h-4 mr-1" />
              Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleBasicInfoChange}
              className={`block w-full p-3 bg-white bg-opacity-10 backdrop-blur-sm border ${
                errors.deadline ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 md:flex-row md:items-center"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowComments"
                name="allowComments"
                checked={formData.allowComments}
                onChange={handleBasicInfoChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="allowComments"
                className="ml-2 text-sm text-gray-700"
              >
                Allow comments on this quiz
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleBasicInfoChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                Make this quiz public
              </label>
            </div>
          </motion.div>
        </motion.div>
      );
    } else {
      const questionIndex = currentStep - 1;
      const questionData = formData.questions[questionIndex];

      return (
        <motion.div
          key={`question-${questionIndex}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <h3 className="text-lg font-medium">
              Question {questionIndex + 1}
            </h3>
            {formData.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
                className="p-1.5 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Remove question"
              >
                <Trash2 size={18} />
              </button>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <HelpCircle className="inline w-4 h-4 mr-1" />
              Question
            </label>
            <input
              type="text"
              name="question"
              value={questionData.question}
              onChange={(e) => handleQuestionChange(e, questionIndex)}
              placeholder="Ask a cooking-related question"
              className={`block w-full p-3 bg-white bg-opacity-10 backdrop-blur-sm border ${
                errors.question ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-500">{errors.question}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Answer Options
            </label>
            {errors.options && (
              <p className="mt-1 mb-2 text-sm text-red-500">{errors.options}</p>
            )}

            <div className="space-y-3">
              {questionData.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <div className="flex-grow">
                    <div className="relative">
                      <input
                        type="text"
                        name="options"
                        value={option}
                        onChange={(e) =>
                          handleQuestionChange(e, questionIndex, optIndex)
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className={`block w-full pl-3 pr-10 py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      />
                      {option && questionData.correctAnswer === option && (
                        <span className="absolute text-green-500 -translate-y-1/2 right-3 top-1/2">
                          <Check size={18} />
                        </span>
                      )}
                    </div>
                  </div>

                  {option && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const updated = { ...prev };
                          updated.questions[questionIndex].correctAnswer =
                            option;
                          return updated;
                        });
                      }}
                      className={`p-2 rounded-lg ${
                        questionData.correctAnswer === option
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      Mark Correct
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.correctAnswer && (
              <p className="mt-2 text-sm text-red-500">
                {errors.correctAnswer}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Explanation (Optional)
            </label>
            <textarea
              name="explanation"
              value={questionData.explanation}
              onChange={(e) => handleQuestionChange(e, questionIndex)}
              placeholder="Explain why the correct answer is right (will be shown after quiz completion)"
              rows={2}
              className="block w-full p-3 transition-all bg-white border border-gray-300 rounded-lg bg-opacity-10 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </motion.div>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl px-4 py-8 mx-auto md:px-6">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Create Cooking Quiz
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Share your culinary knowledge with the Nexora community. Create
            engaging quizzes to challenge and educate fellow cooking
            enthusiasts.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentStep === 0
                ? "Basic Information"
                : `Question ${currentStep} of ${formData.questions.length}`}
            </span>
            <span className="text-sm text-gray-500">
              {currentStep === 0 ? "1" : currentStep + 1} of{" "}
              {formData.questions.length + 1} steps
            </span>
          </div>
          <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((currentStep + 1) / (formData.questions.length + 1)) * 100
                }%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 bg-white shadow-lg bg-opacity-70 backdrop-blur-md rounded-xl md:p-8">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            {errors.submit && (
              <div className="p-3 mt-4 text-red-600 border border-red-200 rounded-lg bg-red-50">
                {errors.submit}
              </div>
            )}

            {/* Form Navigation */}
            <div className="flex flex-col items-center justify-between gap-4 mt-8 md:flex-row">
              <div>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 &&
                  currentStep === formData.questions.length && (
                    <motion.button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center gap-1 px-4 py-2 text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlusCircle size={16} />
                      Add Question
                    </motion.button>
                  )}

                {currentStep < formData.questions.length ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-1 px-6 py-2 bg-green-600 rounded-lg text-white ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-green-700"
                    } transition-colors`}
                    whileHover={isSubmitting ? {} : { scale: 1.03 }}
                    whileTap={isSubmitting ? {} : { scale: 0.98 }}
                  >
                    <Save size={16} />
                    {isSubmitting ? "Saving..." : "Create Quiz"}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="w-full max-w-md p-8 mx-4 text-center bg-white shadow-2xl rounded-xl"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800">
                Quiz Created!
              </h3>
              <p className="mb-6 text-gray-600">
                Your cooking quiz has been successfully created and is now
                available on the forum.
              </p>
              <div className="flex justify-center">
                <motion.div
                  className="h-1.5 w-full bg-gray-200 rounded-full max-w-xs mx-auto overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                >
                  <div className="h-full bg-green-500"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizCreate;
