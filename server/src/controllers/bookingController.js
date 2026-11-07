import { v4 as uuidv4 } from 'uuid';
import { createBooking, findBookingsByUserId, createPet, findPetsByUserId } from '../models/schema.js';
import { providers } from '../data/providers.js';

// ─── POST /api/v1/bookings ─────────────────────────────────────────────────

export async function createNewBooking(req, res, next) {
  try {
    const { providerId, petId, serviceType, bookingDate, timeSlot, notes } = req.body;

    // Validate provider exists
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const booking = createBooking({
      id: uuidv4(),
      userId: req.user.userId,
      petId: petId || null,
      providerId,
      serviceType,
      bookingDate,
      timeSlot,
      notes: notes || null,
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/bookings ───────────────────────────────────────────────────

export async function listBookings(req, res, next) {
  try {
    const bookings = findBookingsByUserId(req.user.userId);
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/v1/pets ──────────────────────────────────────────────────────

export async function createNewPet(req, res, next) {
  try {
    const { name, category, breed, age } = req.body;

    const pet = createPet({
      id: uuidv4(),
      userId: req.user.userId,
      name,
      category,
      breed: breed || null,
      age: age || null,
    });

    res.status(201).json({ success: true, pet });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/pets ───────────────────────────────────────────────────────

export async function listPets(req, res, next) {
  try {
    const pets = findPetsByUserId(req.user.userId);
    res.json({ success: true, count: pets.length, pets });
  } catch (err) {
    next(err);
  }
}
