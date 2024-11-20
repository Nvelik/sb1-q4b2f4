import React from 'react';

interface AdSpaceProps {
  position: 'side' | 'bottom';
}

export default function AdSpace({ position }: AdSpaceProps) {
  const containerClasses = {
    side: 'w-64 h-[600px] bg-gray-100',
    bottom: 'w-full h-32 bg-gray-100',
  };

  return (
    <div className={`${containerClasses[position]} rounded-lg p-4 flex flex-col items-center justify-center`}>
      <p className="text-gray-500 text-sm text-center">Advertisement Space</p>
      <p className="text-xs text-gray-400 mt-2">Earn rewards while you play!</p>
    </div>
  );
}