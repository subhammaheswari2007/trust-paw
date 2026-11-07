import { providers } from '../data/providers.js';
import { haversineDistance } from '../utils/haversine.js';

// ─── GET /api/v1/providers ──────────────────────────────────────────────────

export async function listProviders(req, res, next) {
  try {
    const { category, city, lat, lng, sort } = req.query;

    let results = [...providers];

    // Filter by category
    if (category) {
      results = results.filter((p) => p.category === category.toLowerCase());
    }

    // Filter by city (case-insensitive)
    if (city) {
      results = results.filter((p) => p.city.toLowerCase() === city.toLowerCase());
    }

    // Calculate distance if lat/lng provided
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    if (!isNaN(userLat) && !isNaN(userLng)) {
      results = results.map((p) => ({
        ...p,
        distance: Math.round(haversineDistance(userLat, userLng, p.lat, p.lng) * 100) / 100,
      }));
    }

    // Sort
    if (sort === 'distance' && !isNaN(userLat)) {
      results.sort((a, b) => a.distance - b.distance);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'price') {
      results.sort((a, b) => {
        const aMin = a.pricing ? Object.values(a.pricing)[0]?.min ?? Infinity : Infinity;
        const bMin = b.pricing ? Object.values(b.pricing)[0]?.min ?? Infinity : Infinity;
        return aMin - bMin;
      });
    }

    res.json({ success: true, count: results.length, providers: results });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/providers/emergency ────────────────────────────────────────

export async function emergencyProviders(req, res, next) {
  try {
    const { lat, lng } = req.query;

    let results = providers.filter((p) => p.isEmergency && p.is24x7 && p.category === 'veterinary');

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (!isNaN(userLat) && !isNaN(userLng)) {
      results = results.map((p) => ({
        ...p,
        distance: Math.round(haversineDistance(userLat, userLng, p.lat, p.lng) * 100) / 100,
      }));
      results.sort((a, b) => a.distance - b.distance);
    }

    res.json({ success: true, count: results.length, providers: results });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/providers/:id ──────────────────────────────────────────────

export async function getProvider(req, res, next) {
  try {
    const provider = providers.find((p) => p.id === req.params.id);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    res.json({ success: true, provider });
  } catch (err) {
    next(err);
  }
}
