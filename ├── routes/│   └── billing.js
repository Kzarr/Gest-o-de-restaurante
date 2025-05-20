const express = require('express');
const router = express.Router();
const { 
  generateBill, 
  getAllBills, 
  getBillById, 
  updateBill, 
  deleteBill,
  getBillsByDate 
} = require('../controllers/billing');

router.post('/', generateBill);
router.get('/', getAllBills);
router.get('/:id', getBillById);
router.get('/date/:date', getBillsByDate);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);

module.exports = router;