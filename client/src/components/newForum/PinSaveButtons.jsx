// src/components/newForum/PinSaveButtons.jsx
import React from "react";
import { MdPushPin, MdOutlineBookmarkAdd } from "react-icons/md";

export default function PinSaveButtons({ isPinned = false, onSave, onPin }) {
  return (
    <div className="flex gap-3 ml-auto">
      <button onClick={onSave} className="text-blue-500 hover:text-blue-700">
        <MdOutlineBookmarkAdd size={20} />
      </button>
      {isPinned && (
        <button onClick={onPin} className="text-purple-500 hover:text-purple-700">
          <MdPushPin size={20} />
        </button>
      )}
    </div>
  );
}