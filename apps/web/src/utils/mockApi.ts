import type { SearchPlacesRequest, SearchPlacesResponse, Place } from '../types';
import { SEARCH_CONFIG } from './constants';

// Mock API Client
export const mockApiClient = {
  async searchPlaces({ location, category, radius }: SearchPlacesRequest): Promise<SearchPlacesResponse> {
    // Return mock data instead of actual API call
    await new Promise(resolve => setTimeout(resolve, SEARCH_CONFIG.LOADING_DELAY)); // Loading simulation
    
    const mockPlaces: Place[] = [
      {
        id: '1',
        name: 'Seoul National University Hospital',
        location: { lat: location.lat + 0.001, lng: location.lng + 0.001 },
        category: 'hospital',
        rating: 4.2,
        address: 'Jongno-gu, Seoul',
        phoneNumber: '02-2072-2114'
      },
      {
        id: '2',
        name: 'E-Mart Seongsu',
        location: { lat: location.lat - 0.002, lng: location.lng + 0.002 },
        category: 'supermarket',
        rating: 4.0,
        address: 'Seongdong-gu, Seoul'
      },
      {
        id: '3',
        name: 'Starbucks Gangnam Station',
        location: { lat: location.lat + 0.003, lng: location.lng - 0.001 },
        category: 'cafe',
        rating: 4.1,
        address: 'Gangnam-gu, Seoul'
      },
      {
        id: '4',
        name: 'Lotte Pharmacy',
        location: { lat: location.lat + 0.0015, lng: location.lng - 0.002 },
        category: 'pharmacy',
        rating: 4.3,
        address: 'Jung-gu, Seoul',
        phoneNumber: '02-1234-5678'
      },
      {
        id: '5',
        name: 'Hangang Park',
        location: { lat: location.lat - 0.001, lng: location.lng - 0.003 },
        category: 'park',
        rating: 4.5,
        address: 'Yongsan-gu, Seoul'
      },
      {
        id: '6',
        name: 'KB Kookmin Bank',
        location: { lat: location.lat + 0.002, lng: location.lng + 0.003 },
        category: 'bank',
        rating: 3.8,
        address: 'Gangnam-gu, Seoul',
        phoneNumber: '1588-9999'
      },
      {
        id: '7',
        name: 'Seoul Elementary School',
        location: { lat: location.lat - 0.003, lng: location.lng + 0.001 },
        category: 'school',
        rating: 4.0,
        address: 'Seocho-gu, Seoul'
      },
      {
        id: '8',
        name: 'The Place Restaurant',
        location: { lat: location.lat + 0.0025, lng: location.lng - 0.0015 },
        category: 'restaurant',
        rating: 4.4,
        address: 'Mapo-gu, Seoul',
        phoneNumber: '02-987-6543',
        website: 'https://example.com'
      }
    ];

    // Category filtering
    const filteredPlaces = category 
      ? mockPlaces.filter(place => place.category === category)
      : mockPlaces;

    return { places: filteredPlaces };
  }
}; 