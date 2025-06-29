import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { Location, Place } from '../types';
import { CATEGORY_LABELS, DEFAULT_LOCATION } from '../utils/constants';

interface GoogleMapProps {
  center: Location | null;
  places: Place[];
  onLocationChange: (location: Location) => void;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ center, places, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center || DEFAULT_LOCATION,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        // Add click handler for map
        mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const newLocation: Location = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
              address: 'Selected Location'
            };
            onLocationChange(newLocation);
          }
        });

        setMap(mapInstance);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };

    initMap();
  }, [onLocationChange, center]);

  // Update map center when location changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
      map.setZoom(15);
    }
  }, [map, center]);

  // Update markers when places change
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    places.forEach(place => {
      const marker = new google.maps.Marker({
        position: place.location,
        map,
        title: place.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#4285f4" stroke="#fff" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" font-size="16" fill="white">
                ${CATEGORY_LABELS[place.category].charAt(0)}
              </text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${place.name}</h3>
            ${place.rating ? `<div style="margin-bottom: 4px;">⭐ ${place.rating}</div>` : ''}
            ${place.address ? `<div style="margin-bottom: 4px; color: #666; font-size: 12px;">${place.address}</div>` : ''}
            ${place.phoneNumber ? `<div style="margin-bottom: 4px; color: #666; font-size: 12px;">📞 ${place.phoneNumber}</div>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [map, places, isLoaded]);

  return (
    <div className="google-map-container">
      <div ref={mapRef} className="google-map" />
      {!isLoaded && (
        <div className="map-loading">
          <div>Loading map...</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
            Google Maps API key is required
          </div>
        </div>
      )}
    </div>
  );
}; 