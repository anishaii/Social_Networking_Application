import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} from '../controllers/postController.js';
import { protect } from '../middleware/authorized_middleware.js';
import { validate } from '../middleware/validate.js';
import { postSchema } from '../validators/postValidator.js';
import { commentSchema } from '../validators/commentValidator.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getAllPosts)
  .post(protect, upload.single('image'), validate(postSchema), createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, validate(postSchema), updatePost)
  .delete(protect, deletePost);

router.route('/:id/like') 
  .post(protect, toggleLike);

router.route('/:id/comment')
 .post(protect, validate(commentSchema), addComment);

export default router;