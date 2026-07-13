// components/BoothControlPanel.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BoothControlPanel({ booths, onSelectBooth, selectedId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const filteredBooths = booths.filter(booth => {
    const matchesSearch = booth.boothId.includes(searchTerm) ||
      booth.companyDetails?.companyName?.includes(searchTerm);
    const matchesFilter = filter === 'all' || booth.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="absolute right-4 top-20 w-72 bg-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 z-10 max-h-[70vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-gray-950/90 pb-3">
        <h3 className="text-white font-bold text-sm mb-3">🎯 قائمة الأكشاك</h3>
        
        <input
          type="text"
          placeholder="🔍 بحث عن كشك..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        
        <div className="flex gap-1 mt-2">
          {['all', 'Available', 'Pending', 'Reserved'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 text-[8px] px-2 py-1 rounded-lg transition-all ${
                filter === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {type === 'all' ? 'الكل' : type === 'Available' ? 'متاح' : type === 'Pending' ? 'معلق' : 'محجوز'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {filteredBooths.map((booth) => (
            <motion.div
              key={booth.boothId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => onSelectBooth(booth)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                selectedId === booth.boothId
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/5 hover:border-white/20 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-xs font-bold">
                    #{booth.boothId}
                  </span>
                  <span className={`text-[8px] ml-2 ${
                    booth.status === 'Reserved' ? 'text-blue-400' : 
                    booth.status === 'Pending' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {booth.status === 'Reserved' ? '🔵' : booth.status === 'Pending' ? '🟡' : '⚪'}
                  </span>
                </div>
                <span className="text-[8px] text-gray-500">
                  {booth.companyDetails?.companyName || 'شاغر'}
                </span>
              </div>
              {booth.status === 'Reserved' && (
                <div className="mt-1 text-[8px] text-gray-600">
                  {booth.companyDetails?.category}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}