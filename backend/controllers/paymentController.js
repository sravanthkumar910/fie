const Payment = require('../models/Payment.js');

exports.createPayment = async (req, res) => {
    try {
        const { creator, project, amount, method, status, note } = req.body;

        const newPayment = new Payment({
            creator,
            project,
            amount, // Formatting to match your UI display
            method,
            status,
            // Note is optional but good to save if you add it to your schema
            note 
        });

        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ message: "Failed to process payment record" });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};