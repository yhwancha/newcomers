import React from 'react';
import type { PlaceCategory } from '../types';
import { CATEGORY_LABELS } from '../utils/constants';

interface CategoryFilterProps {
  selectedCategory: PlaceCategory | null;
  onCategoryChange: (category: PlaceCategory | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories: PlaceCategory[] = ['hospital', 'pharmacy', 'supermarket', 'restaurant', 'cafe', 'bank', 'school', 'park'];

  return (
    <div className="category-filter">
      <h3>Select Category</h3>
      <div className="category-buttons">
        <button
          className={`category-button ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          🌟 All
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>
    </div>
  );
}; 