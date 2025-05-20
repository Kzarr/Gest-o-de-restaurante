const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getAllOrders, 
  getOrderById, 
  updateOrder, 
  deleteOrder,
  getOrdersByTable,
  getOrdersByStatus 
} = require('../controllers/orders');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/table/:tableId', getOrdersByTable);
router.get('/status/:status', getOrdersByStatus);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;