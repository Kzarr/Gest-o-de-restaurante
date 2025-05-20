const Bill = require('../models/Bill');
const Order = require('../models/Order');
const Table = require('../models/Table');

exports.generateBill = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Calculate total amount (simplified - in real app you'd calculate from order items)
    const totalAmount = req.body.totalAmount || 100; // Example value
    const taxAmount = totalAmount * 0.1; // 10% tax
    
    const bill = new Bill({
      ...req.body,
      orderId: order._id,
      tableId: order.tableId,
      totalAmount,
      taxAmount
    });
    
    await bill.save();
    
    // Update order status
    order.status = 'completed';
    await order.save();
    
    // Update table status
    const table = await Table.findById(order.tableId);
    if (table) {
      table.status = 'available';
      await table.save();
    }
    
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Implement other billing controller methods similar to tables.js
// getAllBills, getBillById, updateBill, deleteBill, getBillsByDate