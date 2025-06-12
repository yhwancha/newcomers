import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Location, Place, PlaceCategory, SearchParams } from '@newcomers/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock data for development
const mockPlaces: Place[] = [
  {
    id: '1',
    name: '서울대학교병원',
    category: PlaceCategory.HOSPITAL,
    location: { lat: 37.5665, lng: 126.9780, address: '서울특별시 종로구 대학로 101' },
    rating: 4.5,
    phone: '02-2072-2114'
  },
  {
    id: '2', 
    name: '이마트 종로점',
    category: PlaceCategory.GROCERY,
    location: { lat: 37.5701, lng: 126.9914, address: '서울특별시 종로구 청계천로 400' },
    rating: 4.2,
    hours: '10:00-23:00'
  },
  {
    id: '3',
    name: '신한은행 종로지점',
    category: PlaceCategory.BANK,
    location: { lat: 37.5685, lng: 126.9786, address: '서울특별시 종로구 종로 69' },
    rating: 4.0,
    phone: '02-2020-4000'
  }
];

// Calculate distance between two coordinates (rough approximation)
function getDistance(loc1: Location, loc2: Location): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Search places API
app.get('/api/places/search', (req, res) => {
  try {
    const { lat, lng, category, radius = '2000', query } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const searchLocation: Location = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string)
    };

    let filteredPlaces = mockPlaces;

    // Filter by category
    if (category) {
      filteredPlaces = filteredPlaces.filter(place => place.category === category);
    }

    // Filter by search query
    if (query) {
      const searchQuery = (query as string).toLowerCase();
      filteredPlaces = filteredPlaces.filter(place => 
        place.name.toLowerCase().includes(searchQuery) ||
        place.description?.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by radius and sort by distance
    const maxRadius = parseInt(radius as string);
    const placesWithDistance = filteredPlaces
      .map(place => ({
        ...place,
        distance: getDistance(searchLocation, place.location)
      }))
      .filter(place => place.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...place }) => place); // Remove distance from final result

    res.json({
      places: placesWithDistance,
      total: placesWithDistance.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
}); 