const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  notes: String
});

const OrderSchema = new mongoose.Schema({
  tableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Table', 
    required: true 
  },
  items: [OrderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'completed', 'cancelled'],
    default: 'pending'
  },
  waiter: String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);