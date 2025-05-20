const Order = require('../models/Order');
const Table = require('../models/Table');

// Criar pedido
exports.createOrder = async (req, res) => {
  try {
    const table = await Table.findById(req.body.tableId);
    if (!table) {
      return res.status(404).json({ error: 'Mesa não encontrada' });
    }
    if (table.status === 'occupied') {
      return res.status(400).json({ error: 'Mesa já está ocupada' });
    }

    const order = new Order({
      ...req.body,
      status: 'pending'
    });
    await order.save();

    table.status = 'occupied';
    await table.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todos os pedidos
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('tableId', 'number capacity')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('tableId');
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar pedido
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar pedido
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Liberar a mesa associada
    await Table.findByIdAndUpdate(
      order.tableId,
      { status: 'available' }
    );

    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar pedidos por status (ex: /api/orders/status/pending)
exports.getOrdersByStatus = async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status })
      .populate('tableId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar pedidos de uma mesa específica (ex: /api/orders/table/123)
exports.getOrdersByTable = async (req, res) => {
  try {
    const orders = await Order.find({ tableId: req.params.tableId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};