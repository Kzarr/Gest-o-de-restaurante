const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  tableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Table', 
    required: true 
  },
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0.23 }, // IVA 23%
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mbway', 'card', 'transfer'],
    required: true
  },
  nif: String // Para faturação em Portugal
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);