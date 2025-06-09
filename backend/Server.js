const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded images

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
const InvoiceRoutes = require('./routes/InvoiceRoutes');
const companyRoutes = require('./routes/companyRoutes');
app.use('/api/invoice', InvoiceRoutes);
app.use('/api', companyRoutes);
app.use('/uploads', express.static('uploads'));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));