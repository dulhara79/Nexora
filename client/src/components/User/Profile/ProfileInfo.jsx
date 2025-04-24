import React from 'react';
import { Instagram, Twitter, Linkedin, MessageCircle } from 'lucide-react';

const ProfileInfo = ({ profileUser }) => (
  <div className="pt-20">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{profileUser?.name || "John Doe"}</h1>
        <p className="font-medium text-blue-600">@{profileUser?.username || "username"}</p>
      </div>
      <div className="flex space-x-2">
        <button className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-full shadow-md hover:bg-blue-700">
          Follow
        </button>
        <button className="p-3 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="flex items-center mt-4 space-x-3 text-gray-500">
      <a href="#" className="transition-colors hover:text-blue-600"><Instagram className="w-6 h-6" /></a>
      <a href="#" className="transition-colors hover:text-blue-600"><Twitter className="w-6 h-6" /></a>
      <a href="#" className="transition-colors hover:text-blue-600"><Linkedin className="w-6 h-6" /></a>
    </div>
  </div>
);

export default ProfileInfo;