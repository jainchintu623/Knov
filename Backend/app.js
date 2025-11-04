const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./src/routes/auth');
const vendorRoutes = require('./src/routes/vendor');
const productRoutes = require('./routes/products');
const orderRoutes = require('./src/routes/orders');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

module.exports = app;
