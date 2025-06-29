import React from 'react';
import type { Place, PlaceCategory } from '../types';
import { CATEGORY_LABELS } from '../utils/constants';

interface PlacesListProps {
  places: Place[];
  loading: boolean;
  error: string | null;
  selectedCategory: PlaceCategory | null;
}

export const PlacesList: React.FC<PlacesListProps> = ({
  places,
  loading,
  error,
  selectedCategory
}) => {
  if (loading) {
    return (
      <div className="places-list loading">
        <div className="loading-spinner">⏳ Searching...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="places-list error">
        <div className="error-message">
          ❌ {error}
          <br />
          <small>Please check the backend API server</small>
        </div>
      </div>
    );
  }

  return (
    <div className="places-list">
      <div className="places-header">
        <h3>
          {selectedCategory 
            ? `${CATEGORY_LABELS[selectedCategory]}` 
            : '🌟 All Places'
          } ({places.length} places)
        </h3>
      </div>

      {places.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <div>No places found nearby</div>
          <small>Try selecting a different category or click on another location on the map</small>
        </div>
      ) : (
        <div className="places-grid">
          {places.map(place => (
            <div key={place.id} className="place-card">
              <div className="place-header">
                <div className="place-icon">
                  {CATEGORY_LABELS[place.category].charAt(0)}
                </div>
                <div className="place-info">
                  <h4 className="place-name">{place.name}</h4>
                  <div className="place-category">
                    {CATEGORY_LABELS[place.category]}
                  </div>
                </div>
                {place.rating && (
                  <div className="place-rating">
                    ⭐ {place.rating}
                  </div>
                )}
              </div>

              <div className="place-details">
                {place.address && (
                  <div className="place-detail">
                    📍 {place.address}
                  </div>
                )}
                
                {place.phoneNumber && (
                  <div className="place-detail">
                    📞 {place.phoneNumber}
                  </div>
                )}
              </div>

              <div className="place-actions">
                <button 
                  className="action-button"
                  onClick={() => {
                    const url = `https://maps.google.com/maps?q=${place.location.lat},${place.location.lng}`;
                    window.open(url, '_blank');
                  }}
                >
                  🗺️ Directions
                </button>
                
                {place.website && (
                  <button 
                    className="action-button"
                    onClick={() => window.open(place.website, '_blank')}
                  >
                    🌐 Website
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 