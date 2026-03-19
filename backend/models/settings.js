const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    brandProfile: {
        name: { type: String, default: "TitanFit Co." },
        plan: { type: String, enum: ["Free", "Pro Plan", "Enterprise"], default: "Pro Plan" },
        industry: { type: String, default: "Fitness & Wellness" },
        website: { type: String, trim: true },
        location: { type: String },
        description: { type: String, maxLength: 1000 }
    },
    account: {
        email: { type: String, required: true, lowercase: true },
        phoneNumber: { type: String },
        timezone: { type: String, default: "Pacific Time (PT)" }
    },
    notifications: {
        channels: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            sms: { type: Boolean, default: false }
        },
        activity: {
            projectUpdates: { type: Boolean, default: true },
            paymentActivity: { type: Boolean, default: true },
            newMessages: { type: Boolean, default: true },
            weeklySummary: { type: Boolean, default: true }
        }
    },
   // ADDED SECURITY SECTION
    security: {
        twoFactorEnabled: { type: Boolean, default: false },
        loginAlerts: { type: Boolean, default: true },
        passwordLastChanged: { type: Date, default: Date.now }
    },
    billing: {
        currentPlan: { type: String, default: "Pro Plan" },
        price: { type: Number, default: 49 },
        billingCycle: { type: String, default: "monthly" },
        paymentMethod: {
            cardType: { type: String },
            lastFour: { type: String },
            expiry: { type: String }
        }
    }
}, {
    timestamps: true
});

// Use module.exports for compatibility with require()
module.exports = mongoose.model("Settings", SettingsSchema);