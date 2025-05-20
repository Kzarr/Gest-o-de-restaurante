const express = require('express');
const router = express.Router();
const {
  generateBill,
  getAllBills,
  getBillById,
  updateBill,
  generateSAFTFile,
  getBillsByPeriod
} = require('../controllers/billing');

router.post('/', generateBill);
router.get('/', getAllBills);
router.get('/:id', getBillById);
router.put('/:id', updateBill);
router.get('/saft', generateSAFTFile);
router.get('/period', getBillsByPeriod);

module.exports = router;