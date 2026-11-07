import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateCreateBooking, validateCreatePet } from '../middleware/validation.js';
import {
  createNewBooking,
  listBookings,
  createNewPet,
  listPets,
} from '../controllers/bookingController.js';

const router = Router();

// Bookings
router.post('/',  authenticate, validateCreateBooking, createNewBooking);
router.get('/',   authenticate,                        listBookings);

// Pets (nested under bookings router for simplicity, or can be separate)
// We'll mount pets separately in index.js — but expose helpers here.

export default router;

// Pets mini-router (re-exported for mounting in index.js)
export const petsRouter = Router();
petsRouter.post('/',  authenticate, validateCreatePet, createNewPet);
petsRouter.get('/',   authenticate,                    listPets);
