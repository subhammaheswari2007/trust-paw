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
} from '../controllers/providerController.js';

const router = Router();

router.get('/',           validateProviderQuery,  listProviders);
router.get('/emergency',  validateEmergencyQuery, emergencyProviders);
router.get('/:id',        validateProviderId,     getProvider);

export default router;
