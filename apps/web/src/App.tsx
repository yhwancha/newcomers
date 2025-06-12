import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleMap } from './components/GoogleMap';
import { PlacesList } from './components/PlacesList';
import { CategoryFilter } from './components/CategoryFilter';
import { apiClient } from '@newcomers/api-client';
import { CATEGORY_LABELS } from '@newcomers/shared';
import type { Location, Place, PlaceCategory } from '@newcomers/types';
import './App.css';

function App() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: '현재 위치'
          });
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          // Default to Seoul City Hall
          setCurrentLocation({
            lat: 37.5665,
            lng: 126.9780,
            address: '서울시청 (기본값)'
          });
        }
      );
    }
  }, []);

  // Search for places when location or category changes
  useEffect(() => {
    const searchPlaces = async () => {
      if (!currentLocation) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await apiClient.searchPlaces({
          location: currentLocation,
          category: selectedCategory || undefined,
          radius: 2000
        });
        setPlaces(result.places);
      } catch (err) {
        setError('장소 정보를 불러오는데 실패했습니다.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchPlaces();
  }, [currentLocation, selectedCategory]);

  const handleLocationChange = (location: Location) => {
    setCurrentLocation(location);
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>🏠 새로운 동네 가이드</h1>
          <p>이사한 곳 주변의 필수 시설들을 찾아보세요</p>
        </header>

        <Routes>
          <Route path="/" element={
            <main className="app-main">
              <div className="controls">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                {currentLocation && (
                  <div className="location-info">
                    📍 {currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
                  </div>
                )}
              </div>

              <div className="content">
                <div className="map-container">
                  <GoogleMap
                    center={currentLocation}
                    places={places}
                    onLocationChange={handleLocationChange}
                  />
                </div>
                
                <div className="places-container">
                  <PlacesList
                    places={places}
                    loading={loading}
                    error={error}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </div>
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
