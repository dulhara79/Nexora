import React from "react";
import Header from "../../common/NewPageHeader";

const QuizResult = ({ quiz }) => {
  const calculateResults = () => {
    const totalParticipants = Object.keys(quiz.participantScores).length;
    const correctAnswers = Object.values(quiz.participantScores).filter(
      (score) => score === 1
    ).length;
    const percentageCorrect =
      totalParticipants > 0
        ? ((correctAnswers / totalParticipants) * 100).toFixed(0)
        : 0;
    const answerDistribution = {};
    quiz.options.forEach((option) => {
      answerDistribution[option] = Object.values(
        quiz.participantAnswers
      ).filter((ans) => ans === option).length;
    });
    return {
      totalParticipants,
      correctAnswers,
      percentageCorrect,
      answerDistribution,
    };
  };

  const {
    totalParticipants,
    correctAnswers,
    percentageCorrect,
    answerDistribution,
  } = calculateResults();

  return (
    <>
      <Header />
      <div className="container max-w-2xl p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          {quiz.question}
        </h1>
        <p className="text-gray-600">
          By {quiz.authorUsername} | Ended:{" "}
          {new Date(quiz.deadline).toLocaleString("en-US", {
            timeZone: "Asia/Colombo",
          })}
        </p>
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Quiz Results
          </h2>
          <p className="text-gray-700">Correct Answer: {quiz.correctAnswer}</p>
          <p className="text-gray-700">
            Total Participants: {totalParticipants}
          </p>
          <p className="text-gray-700">Correct Answers: {correctAnswers}</p>
          <p className="text-gray-700">
            Percentage Correct: {percentageCorrect}%
          </p>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            Answer Distribution
          </h3>
          {quiz.options.map((option, index) => (
            <p key={index} className="text-gray-700">
              {option}: {answerDistribution[option]} votes
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuizResult;
