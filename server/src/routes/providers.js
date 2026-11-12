import { Router } from 'express';
import {
  validateProviderQuery,
  validateEmergencyQuery,
  validateProviderId,
} from '../middleware/validation.js';
import {
  listProviders,
  emergencyProviders,
  getProvider,
  adminVerifyPasscode,
  adminSaveProvider,
  adminDeleteProvider,
} from '../controllers/providerController.js';

const router = Router();

// ─── Admin Endpoints (Passcode Protected) ──────────────────────────────────
router.post('/admin/verify', adminVerifyPasscode);
router.post('/admin/save',   adminSaveProvider);
router.delete('/admin/:id',  adminDeleteProvider);

// ─── Public Endpoints ──────────────────────────────────────────────────────
router.get('/',           validateProviderQuery,  listProviders);
router.get('/emergency',  validateEmergencyQuery, emergencyProviders);
router.get('/:id',        validateProviderId,     getProvider);

export default router;
