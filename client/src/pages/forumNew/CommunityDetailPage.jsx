// CommunityDetailPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import QuestionCard from "../../components/newForum/QuestionCard";
import Header from "../../components/common/NewPageHeader"

const BASE_URL = "http://localhost:5000";

export default function CommunityDetailPage({ match }) {
  const [community, setCommunity] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchCommunityDetails();
    fetchCommunityQuestions();
  }, []);

  const fetchCommunityDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL }/api/communities/${match.params.communityId}`);
      setCommunity(res.data);
    } catch (error) {
      console.error("Error fetching community:", error);
    }
  };

  const fetchCommunityQuestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL }/api/questions?communityId=${match.params.communityId}`);
      setQuestions(res.data);
    } catch (error) {
      console.error("Error fetching community questions:", error);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <Header />
      <div className="container px-4 mx-auto">
        {/* Community Header */}
        {community && (
          <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
            <div className="flex items-start mb-4">
              <div className="mr-4 text-3xl">{community.icon}</div>
              <div>
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <p className="text-gray-600">{community.description}</p>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">{community.members} members</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 mt-4 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
              Join Community
            </button>
          </div>
        )}

        {/* Community Questions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {questions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}