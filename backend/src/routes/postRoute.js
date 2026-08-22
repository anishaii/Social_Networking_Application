import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authorized_middleware.js';
import { validate } from '../middleware/validate.js';
import { postSchema } from '../validators/postValidator.js';

const router = express.Router();

router.route('/')
  .get(getAllPosts)
  .post(protect, validate(postSchema), createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, validate(postSchema), updatePost)
  .delete(protect, deletePost);

export default router;