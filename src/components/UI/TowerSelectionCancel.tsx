import React from 'react';
import { X } from 'lucide-react';

interface TowerSelectionCancelProps {
  isVisible: boolean;
  onCancel: () => void;
}

export const TowerSelectionCancel: React.FC<TowerSelectionCancelProps> = ({
  isVisible,
  onCancel
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <button
        onClick={onCancel}
        className="flex items-center justify-center w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-200 hover:scale-110"
        title="Cancel tower selection"
      >
        <X className="w-8 h-8" />
      </button>
    </div>
  );
};