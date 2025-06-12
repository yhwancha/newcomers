import React from 'react';
import { PlaceCategory } from '@newcomers/types';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@newcomers/shared';

interface CategoryFilterProps {
  selectedCategory: PlaceCategory | null;
  onCategoryChange: (category: PlaceCategory | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories = Object.values(PlaceCategory);

  return (
    <div className="category-filter">
      <h3>카테고리 선택</h3>
      <div className="category-buttons">
        <button
          className={`category-button ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          🌟 전체
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>
    </div>
  );
}; 