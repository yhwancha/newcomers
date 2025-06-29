// Location interface
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// Place category type
export type PlaceCategory = 'hospital' | 'pharmacy' | 'supermarket' | 'restaurant' | 'cafe' | 'bank' | 'school' | 'park';

// Place interface
export interface Place {
  id: string;
  name: string;
  location: Location;
  category: PlaceCategory;
  rating?: number;
  address?: string;
  phoneNumber?: string;
  website?: string;
}

// API Response types
export interface SearchPlacesRequest {
  location: Location;
  category?: PlaceCategory;
  radius: number;
}

export interface SearchPlacesResponse {
  places: Place[];
} 