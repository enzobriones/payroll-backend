import express from 'express';
import { createHealthPlan, deleteHealthPlan, getHealthPlanById, getHealthPlans, updateHealthPlan } from '../controllers/healthPlanController';

const router = express.Router();

router.route('/')
  .get(getHealthPlans)
  .post(createHealthPlan);

router.route('/:id')
  .get(getHealthPlanById)
  .patch(updateHealthPlan)
  .delete(deleteHealthPlan);

export default router;