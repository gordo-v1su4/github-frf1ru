import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors duration-200 shadow-md"
    >
      <CheckCircle size={24} />
    </button>
  );
};

export default SaveButton;