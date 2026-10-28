const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');

const bookRoutes = require('./routes/books');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes Mount Points
app.use('/books', bookRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`System database schema synchronized. Web REST server running on port ${PORT}`);
  });
});