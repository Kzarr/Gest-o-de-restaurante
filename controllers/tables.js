const Table = require('../models/Table');

// Criar mesa
exports.createTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todas as mesas
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obter mesa por ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ error: 'Mesa não encontrada' });
    }
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar mesa
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!table) {
      return res.status(404).json({ error: 'Mesa não encontrada' });
    }
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar mesa
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ error: 'Mesa não encontrada' });
    }
    res.json({ message: 'Mesa deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar mesas por status (ex: /api/tables/status/available)
exports.getTablesByStatus = async (req, res) => {
  try {
    const tables = await Table.find({ status: req.params.status });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};