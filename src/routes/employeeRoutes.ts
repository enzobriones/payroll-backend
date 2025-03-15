import express from 'express';
import { createEmployee, deleteEmployee, getEmployee, getEmployees, updateEmployee } from '../controllers/employeeController';

const router = express.Router();

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);


export default router;