import React from 'react';

const Timeline = ({ cuisines }) => {
  return (
    <div className="mt-10 border-l-4 border-blue-300 pl-6">
      {cuisines.map((cuisine, idx) => {
        const completed = cuisine.recipes.filter(r => r.isCompleted).length;
        const total = cuisine.recipes.length;
        const isDone = completed === total;

        return (
          <div key={idx} className="mb-6">
            <div className="text-blue-800 font-bold text-lg">{cuisine.name}</div>
            <div className="text-gray-600 text-sm">{completed} of {total} recipes completed</div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mt-1">
              <div className={`h-full ${isDone ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${(completed / total) * 100}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;