import React from 'react'

interface StoryboardImageProps {
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}

const StoryboardImage: React.FC<StoryboardImageProps> = ({ imageUrl, isSelected, onSelect }) => {
  return (
    <div
      className={`relative rounded-lg overflow-hidden cursor-pointer ${
        isSelected
          ? 'ring-4 ring-selected-border' // Bright green border for selected images
          : 'hover:ring-2 hover:ring-gray-300' // Hover effect for unselected images
      }`}
      onClick={onSelect}
    >
      <img src={imageUrl} alt="Storyboard frame" className="w-full h-auto" />
    </div>
  );
};

export default StoryboardImage