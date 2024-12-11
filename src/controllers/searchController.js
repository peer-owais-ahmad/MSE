const express = require('express');
const { searchPlaces } = require('../services/yelpService');
const logger = require('../utils/logger');
const router = express.Router();

// Mockable search function
const fetchPlaces = async (term, location) => {
    try {
        return await searchPlaces(term, location);
    } catch (error) {
        throw new Error(`Failed to fetch places for term ${term} and location ${location}`);
    }
};

// Route for Pizza Shops
router.get('/pizza', async (req, res) => {
    const { location } = req.query;
    if (!location) {
        logger.warn('Location is missing in the pizza request');
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        logger.info(`Fetching pizza shops for location: ${location}`);
        const places = await fetchPlaces('pizza', location);
        logger.info(`Successfully fetched ${places.length} pizza shops`);
        res.json(places);
    } catch (error) {
        logger.error(`Error fetching pizza shops: ${error.message}`, { stack: error.stack });
        res.status(500).json({ error: 'Failed to fetch pizza shops' });
    }
});

// Juice Shops Route
router.get('/juice', async (req, res) => {
    const { location } = req.query; 
    if (!location) {
        logger.warn('Location is missing in the juice request');
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        logger.info(`Fetching juice shops for location: ${location}`);
        const places = await fetchPlaces('juice', location);
        logger.info(`Successfully fetched ${places.length} juice shops`);
        res.json(places);
    } catch (error) {
        logger.error(`Error fetching juice shops: ${error.message}`, { stack: error.stack });
        res.status(500).json({ error: 'Failed to fetch juice shops' });
    }
});

// Route fetching combo
router.get('/combo', async (req, res) => {
    const { location } = req.query;
    if (!location) {
        logger.warn('Location is missing in the combo request');
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        logger.info(`Fetching combo shops for location: ${location}`);
        const places = await fetchPlaces(null, location);
        logger.info(`Successfully fetched ${places.length} combo shops`);
        res.json(places);
    } catch (error) {
        logger.error(`Error fetching combo shops: ${error.message}`, { stack: error.stack });
        res.status(500).json({ error: 'Failed to fetch combo shops' });
    }
});

module.exports = router;
