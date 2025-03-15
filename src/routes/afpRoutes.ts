import express from 'express';
import { createAfp, deleteAfp, getAfp, getAfps, updateAfp } from '../controllers/afpController';

const router = express.Router();

router.route('/')
  .get(getAfps)
  .post(createAfp);

router.route('/:id')
  .get(getAfp)
  .patch(updateAfp)
  .delete(deleteAfp);

export default router;