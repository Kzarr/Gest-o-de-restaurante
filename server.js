require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const tableRoutes = require('./routes/tables');
const orderRoutes = require('./routes/orders');
const billingRoutes = require('./routes/billing');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/billing', billingRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Restaurant Management API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});