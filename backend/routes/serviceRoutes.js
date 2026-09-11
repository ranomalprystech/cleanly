const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const defaultAddons = [
    { name: 'Clean Oven', price: 25 },
    { name: 'Clean Windows', price: 20 },
    { name: 'Clean Fridge', price: 20 }
];

router.get('/', async (req, res) => {
    try {
        let serviceConfig = await Service.findOne();

        if (!serviceConfig) {
        serviceConfig = await Service.create({
                cleaningTypes: {
                    standard: { perRoomRate: 50, perBathRate: 60, addons: defaultAddons },
                    deep: { perRoomRate: 75, perBathRate: 85, addons: defaultAddons },
                    moveInOut: { perRoomRate: 100, perBathRate: 110, addons: defaultAddons }
                },
        frequencyDiscounts: { oneTime: 0, weekly: 25, biWeekly: 15, monthly: 10 }
        });
        }
        res.json({ success: true, serviceConfig });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/config', verifyToken, requireAdmin, async (req, res) => {
    try {
        const updatedConfig = await Service.findOneAndUpdate(
        {},
                {
                    $set: { ...req.body },
                    $unset: {
                        baseTypes: '',
                        perRoomRate: '',
                        perBathRate: '',
                        addons: ''
                    }
                },
        { returnDocument: 'after', upsert: true, runValidators: true }
        );

        res.json({success: true, message: 'Pricing configuration updated successfully', serviceConfig: updatedConfig});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;