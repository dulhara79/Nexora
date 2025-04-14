import React from 'react';

const RecentActivity = () => (
  <div className="p-6 bg-white shadow-xl rounded-2xl">
    <h3 className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</h3>
    <div className="space-y-3">
      {['Liked a post', 'Commented on photo', 'Started following you'].map((activity, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">{activity}</span>
        </div>
      ))}
    </div>
  </div>
);

export default RecentActivity;