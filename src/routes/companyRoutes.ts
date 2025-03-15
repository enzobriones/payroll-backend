import express from 'express';
import { createCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '../controllers/companyController';

const router = express.Router();

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.route('/:id')
  .get(getCompany)
  .patch(updateCompany)
  .delete(deleteCompany);

export default router;