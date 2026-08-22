import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authorized_middleware.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/userValidator.js';

const router = express.Router();

router.route('/:id')
  .get(getUser)
  .put(protect, validate(updateProfileSchema), updateUser);

export default router;