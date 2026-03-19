const Settings = require('../models/settings.js');

// GET: Retrieve the single settings record
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        // If database is empty, return an empty object so UI can show defaults
        return res.json(settings || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Find and update the single record (or create it if it doesn't exist)
exports.findAndUpdateSettings = async (req, res) => {
    try {
        // {} matches the first available document
        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            req.body,
            {
                new: true,      // Return updated doc
                upsert: true,   // Create if missing
                runValidators: true
            }
        );
        return res.json(updatedSettings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};