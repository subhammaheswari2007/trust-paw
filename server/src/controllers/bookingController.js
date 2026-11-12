import { v4 as uuidv4 } from 'uuid';
import {
  createBooking,
  findBookingsByUserId,
  createPet,
  findPetsByUserId,
  findProviderById,
} from '../models/schema.js';
import { sendBookingAlertEmail } from '../utils/email.js';

/**
 * Attach provider/doctor contact details (phone, email, clinic) to a booking record.
 */
function enrichBooking(booking) {
  if (!booking) return booking;
  const provId = booking.provider_id || booking.providerId;
  const provider = findProviderById(provId);

  return {
    ...booking,
    bookingDate: booking.booking_date || booking.bookingDate,
    timeSlot: booking.time_slot || booking.timeSlot,
    serviceType: booking.service_type || booking.serviceType,
    providerName: provider?.name || 'Pet Care Specialist',
    clinicName: provider?.clinicName || '',
    providerPhone: provider?.phone || '',
    providerEmail: provider?.email || '',
    providerCity: provider?.city || '',
    providerArea: provider?.area || '',
    providerAddress: provider?.address || '',
    providerImage: provider?.imageUrl || '',
  };
}

// ─── POST /api/v1/bookings ─────────────────────────────────────────────────

export async function createNewBooking(req, res, next) {
  try {
    const { providerId, petId, serviceType, bookingDate, timeSlot, notes } = req.body;

    // Validate provider exists
    const provider = findProviderById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    const booking = createBooking({
      id: uuidv4(),
      userId: req.user.userId,
      petId: petId || null,
      providerId,
      serviceType: serviceType || provider.category,
      bookingDate,
      timeSlot,
      notes: notes || null,
    });

    const enriched = enrichBooking(booking);

    // Notify doctor / facility via email if available
    if (provider.email) {
      sendBookingAlertEmail(provider.email, enriched).catch((err) => {
        console.error('Email alert dispatch error:', err.message);
      });
    }

    res.status(201).json({ success: true, booking: enriched, provider });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/bookings ───────────────────────────────────────────────────

export async function listBookings(req, res, next) {
  try {
    const rawBookings = findBookingsByUserId(req.user.userId);
    const bookings = (rawBookings || []).map(enrichBooking);
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
