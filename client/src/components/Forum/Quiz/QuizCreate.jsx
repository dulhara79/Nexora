import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../common/NewPageHeader";

console.log("QuizCreate component loaded");

const QuizCreate = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    deadline: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e, index) => {
    if (e.target.name === "options") {
      const newOptions = [...formData.options];
      newOptions[index] = e.target.value;
      setFormData({ ...formData, options: newOptions });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/quizzes",
        {
          ...formData,
          options: formData.options.filter((opt) => opt.trim() !== ""),
          deadline: new Date(formData.deadline).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/forum/quizzes");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create quiz");
    }
  };

  return (
    <>
      <Header />
      <div className="container max-w-2xl p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Create Cooking Trivia Quiz
        </h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Question
              </label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="block w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              {formData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  name="options"
                  value={option}
                  onChange={(e) => handleChange(e, index)}
                  className="block w-full p-3 mt-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Option ${index + 1}`}
                  required={index < 2}
                />
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correct Answer
              </label>
              <select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="block w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select correct answer</option>
                {formData.options
                  .filter((opt) => opt.trim() !== "")
                  .map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="block w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Quiz
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuizCreate;
