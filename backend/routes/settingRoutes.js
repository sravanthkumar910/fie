const express = require('express');
const router = express.Router();
const {findAndUpdateSettings, getSettings} = require('../controllers/settings.controller.js');

router.get('/', getSettings);

router.post('/info', findAndUpdateSettings);

module.exports = router;