import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CollaborationHub = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, id: Date.now() }]);
      setInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Collaboration Hub</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg border border-blue-300">
          <h2 className="text-xl text-blue-500">Live Chat</h2>
          <div className="h-40 overflow-y-auto">
            {messages.map((msg) => (
              <motion.p key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {msg.text}
              </motion.p>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 mt-2 border border-blue-300 rounded"
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg border border-blue-300">
          <h2 className="text-xl text-blue-500">Shared Canvas</h2>
          <div className="h-40">Canvas content goes here...</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollaborationHub;