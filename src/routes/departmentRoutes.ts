import express from 'express';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from '../controllers/departmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getDepartments)
  .post(protect, createDepartment);

router.route('/:id')
  .get(getDepartment)
  .patch(protect, updateDepartment)
  .delete(protect, deleteDepartment);

export default router;
