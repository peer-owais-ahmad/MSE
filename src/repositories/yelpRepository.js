const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

const YELP_API_KEY = process.env.YELP_API_KEY;
const BASE_URL = 'https://api.yelp.com/v3/businesses/search';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${YELP_API_KEY}` },
});

const searchYelp = async (term, location = 'San Francisco') => {
  try {
    logger.info(`Fetching Yelp data for term: ${term}, location: ${location}`);
    const response = await axiosInstance.get('', {
      params: { term, location },
    });
    logger.info(`Successfully fetched ${response.data.businesses.length} businesses for term: ${term}`);
    return response.data.businesses;
  } catch (error) {
    logger.error(`Error fetching Yelp data for term: ${term}, location: ${location}`, {
      message: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to fetch Yelp data");
  }
};

// Fetch businesses offering both pizza and juice
const searchYelpForCombo = async (location = 'San Francisco') => {
  try {
    logger.info(`Fetching Yelp combo data (pizza and juice) for location: ${location}`);
    const pizzaPlaces = await searchYelp('pizza', location);
    const juicePlaces = await searchYelp('juice', location);

    if (!pizzaPlaces.length || !juicePlaces.length) {
      logger.warn('No pizza or juice places found, returning an empty list');
      return [];
    }

    // Find common places bases on id's
    const pizzaIds = new Set(pizzaPlaces.map((place) => place.id));
    const commonPlaces = juicePlaces.filter((place) => pizzaIds.has(place.id));

    logger.info(
      `Found ${commonPlaces.length} common businesses for pizza and juice in location: ${location}`
    );
    return commonPlaces;
  } catch (error) {
    logger.error(`Error fetching Yelp combo data for location: ${location}`, {
      message: error.message,
      stack: error.stack,
    });
    return [];
  }
};

module.exports = { searchYelp, searchYelpForCombo };
