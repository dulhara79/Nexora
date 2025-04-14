import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Edit } from 'lucide-react';

const QuickActions = ({ userId }) => (
  <div className="p-6 bg-white shadow-xl rounded-2xl">
    <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
    <div className="grid grid-cols-3 gap-4">
      <button className="flex flex-col items-center p-3 transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
        <Camera className="w-6 h-6 mb-2 text-blue-600" />
        <span className="text-xs text-gray-600">New Post</span>
      </button>
      <button className="flex flex-col items-center p-3 transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
        <MessageCircle className="w-6 h-6 mb-2 text-blue-600" />
        <span className="text-xs text-gray-600">Message</span>
      </button>
      <Link to={`/edit/${userId}`}>
        <button className="flex flex-col items-center p-3 transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
          <Edit className="w-6 h-6 mb-2 text-blue-600" />
          <span className="text-xs text-gray-600">Edit</span>
        </button>
      </Link>
    </div>
  </div>
);

export default QuickActions;