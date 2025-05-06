// CommunityCard.jsx
import { Link } from "react-router-dom";

export default function CommunityCard({ community }) {
  return (
    <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4 text-4xl">{community.icon}</div>
          <div>
            <h3 className="text-xl font-bold">{community.name}</h3>
            <span className="text-sm text-gray-500">{community.members} members</span>
          </div>
        </div>
        
        <p className="mb-4 text-gray-600">{community.description}</p>
        
        <Link 
          to={`/forum/communities/${community.id}`}
          className="inline-block mt-2 text-orange-500 hover:text-orange-600"
        >
          View Community
        </Link>
      </div>
    </div>
  );
}