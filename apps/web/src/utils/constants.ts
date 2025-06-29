import type { PlaceCategory } from '../types';

// Category labels with emoji icons
export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  hospital: '🏥 Hospital',
  pharmacy: '💊 Pharmacy',
  supermarket: '🛒 Supermarket',
  restaurant: '🍽️ Restaurant',
  cafe: '☕ Cafe',
  bank: '🏦 Bank',
  school: '🏫 School',
  park: '🌳 Park'
};

// Default location (Seoul City Hall)
export const DEFAULT_LOCATION = {
  lat: 37.5665,
  lng: 126.9780,
  address: 'Seoul City Hall (Default)'
};

// Search configuration
export const SEARCH_CONFIG = {
  DEFAULT_RADIUS: 2000, // meters
  LOADING_DELAY: 1000   // milliseconds
}; 