const Bill = require('../models/Bill');
const Order = require('../models/Order');
const Table = require('../models/Table');
const { generateSAFT } = require('../utils/saft');

// Gerar fatura
exports.generateBill = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Cálculos simulados (substitua por sua lógica real)
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotal * 0.23; // IVA 23% em Portugal
    const totalAmount = subtotal + taxAmount;

    const bill = new Bill({
      ...req.body,
      orderId: order._id,
      tableId: order.tableId,
      totalAmount,
      taxAmount,
      paymentStatus: 'pending'
    });

    await bill.save();

    // Atualizar status do pedido
    order.status = 'completed';
    await order.save();

    // Liberar a mesa
    await Table.findByIdAndUpdate(
      order.tableId,
      { status: 'available' }
    );

    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todas as faturas
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('orderId tableId')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter fatura por ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('orderId tableId');
    if (!bill) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar fatura (ex: marcar como paga)
exports.updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!bill) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }
    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Gerar arquivo SAFT-PT (ex: /api/billing/saft)
exports.generateSAFTFile = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('orderId tableId');
    const saftXML = generateSAFT(bills);

    res.set('Content-Type', 'application/xml');
    res.set('Content-Disposition', 'attachment; filename="saft.xml"');
    res.send(saftXML);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar faturas por período (ex: /api/billing/period?start=2025-01-01&end=2025-01-31)
exports.getBillsByPeriod = async (req, res) => {
  try {
    const { start, end } = req.query;
    const bills = await Bill.find({
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).populate('orderId tableId');

    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};