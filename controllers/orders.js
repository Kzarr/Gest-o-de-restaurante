const Order = require('../models/Order');
const Table = require('../models/Table');

exports.createOrder = async (req, res) => {
  try {
    // Check if table exists and is available
    const table = await Table.findById(req.body.tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    if (table.status !== 'available') {
      return res.status(400).json({ error: 'Table is not available' });
    }
    
    const order = new Order(req.body);
    await order.save();
    
    // Update table status
    table.status = 'occupied';
    await table.save();
    
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Implement other order controller methods similar to tables.js
// getAllOrders, getOrderById, updateOrder, deleteOrder, getOrdersByTable, getOrdersByStatus