import React from 'react';
import type { Place, PlaceCategory } from '@newcomers/types';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@newcomers/shared';

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
        <div className="loading-spinner">⏳ 검색 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="places-list error">
        <div className="error-message">
          ❌ {error}
          <br />
          <small>백엔드 API 서버를 확인해주세요</small>
        </div>
      </div>
    );
  }

  return (
    <div className="places-list">
      <div className="places-header">
        <h3>
          {selectedCategory 
            ? `${CATEGORY_ICONS[selectedCategory]} ${CATEGORY_LABELS[selectedCategory]}` 
            : '🌟 모든 장소'
          } ({places.length}개)
        </h3>
      </div>

      {places.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <div>근처에 해당하는 장소가 없습니다</div>
          <small>다른 카테고리를 선택하거나 지도에서 다른 위치를 클릭해보세요</small>
        </div>
      ) : (
        <div className="places-grid">
          {places.map(place => (
            <div key={place.id} className="place-card">
              <div className="place-header">
                <div className="place-icon">
                  {CATEGORY_ICONS[place.category]}
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
                {place.location.address && (
                  <div className="place-detail">
                    📍 {place.location.address}
                  </div>
                )}
                
                {place.phone && (
                  <div className="place-detail">
                    📞 {place.phone}
                  </div>
                )}
                
                {place.hours && (
                  <div className="place-detail">
                    🕒 {place.hours}
                  </div>
                )}
                
                {place.description && (
                  <div className="place-description">
                    {place.description}
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
                  🗺️ 길찾기
                </button>
                
                {place.website && (
                  <button 
                    className="action-button"
                    onClick={() => window.open(place.website, '_blank')}
                  >
                    🌐 웹사이트
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