require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5001;
const ProjectRouter = require('./routes/projectRoutes.js');
const SettingsRouter = require('./routes/settingRoutes.js');
const PaymentRouter = require('./routes/paymentRoutes.js');
const authRouter = require('./routes/authRoutes.js');

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/projects', ProjectRouter);
app.use('/api/settings', SettingsRouter);
app.use('/api/payments', PaymentRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
