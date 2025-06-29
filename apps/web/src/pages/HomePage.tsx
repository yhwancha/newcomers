import React, { useState, useEffect } from 'react';
import { GoogleMap } from '../components/GoogleMap';
import { PlacesList } from '../components/PlacesList';
import { CategoryFilter } from '../components/CategoryFilter';
import type { Location, Place, PlaceCategory } from '../types';
import { DEFAULT_LOCATION, SEARCH_CONFIG } from '../utils/constants';
import { mockApiClient } from '../utils/mockApi';

export const HomePage: React.FC = () => {
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
            address: 'Current Location'
          });
        },
        (error) => {
          console.error('Unable to get location information:', error);
          // Use default location
          setCurrentLocation(DEFAULT_LOCATION);
        }
      );
    } else {
      // Geolocation not supported
      setCurrentLocation(DEFAULT_LOCATION);
    }
  }, []);

  // Search for places when location or category changes
  useEffect(() => {
    const searchPlaces = async () => {
      if (!currentLocation) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await mockApiClient.searchPlaces({
          location: currentLocation,
          category: selectedCategory || undefined,
          radius: SEARCH_CONFIG.DEFAULT_RADIUS
        });
        setPlaces(result.places);
      } catch (err) {
        setError('Failed to load place information.');
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
  );
}; 