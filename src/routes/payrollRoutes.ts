import express from 'express';
import { createPayroll, deletePayroll, generatePayrolls, getPayroll, getPayrolls, updatePayroll } from '../controllers/payrollController';

const router = express.Router();

router.route('/')
  .get(getPayrolls)
  .post(createPayroll);

router.route('/:id')
  .get(getPayroll)
  .patch(updatePayroll)
  .delete(deletePayroll);

router.post('/generate', generatePayrolls);

export default router;