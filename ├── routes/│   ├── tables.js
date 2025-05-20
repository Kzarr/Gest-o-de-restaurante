const express = require('express');
const router = express.Router();
const { 
  createTable, 
  getAllTables, 
  getTableById, 
  updateTable, 
  deleteTable,
  getTablesByStatus 
} = require('../controllers/tables');

router.post('/', createTable);
router.get('/', getAllTables);
router.get('/:id', getTableById);
router.get('/status/:status', getTablesByStatus);
router.put('/:id', updateTable);
router.delete('/:id', deleteTable);

module.exports = router;