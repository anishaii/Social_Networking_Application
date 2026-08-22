import express from 'express';
import { getUser, updateUser, getAllUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authorized_middleware.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/userValidator.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .get(getUser)
  .put(protect, upload.single('profilePicture'), validate(updateProfileSchema), updateUser);

export default router;