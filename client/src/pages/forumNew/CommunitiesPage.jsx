// CommunitiesPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import CommunityCard from "../../components/newForum/CommunityCard";
import Header from "../../components/common/NewPageHeader"

const BASE_URL = "http://localhost:5000";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await axios.get(`${BASE_URL }/api/communities`);
      setCommunities(res.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <Header />
      {/* Header Section */}
      <div className="container px-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Community Forums</h1>
        
        {/* Create Community Button */}
        <div className="flex justify-end mb-6">
          <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600">
            Create New Community
          </button>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map(community => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </div>
    </div>
  );
}