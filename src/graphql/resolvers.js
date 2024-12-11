const { searchPlaces } = require('../services/yelpService');
const logger = require('../utils/logger');

const resolvers = {
  Query: {
    //fetching pizza places here
    searchPizza: async (_, { location }) => {
      if (!location) {
        logger.warn('Location is missing in searchPizza query');
        throw new Error("Location is required");
      }

      try {
        logger.info(`Fetching pizza places for location: ${location}`);
        const pizzaPlaces = await searchPlaces('pizza', location);
        logger.info(`Successfully fetched ${pizzaPlaces.length} pizza places`);
        return pizzaPlaces;
      } catch (error) {
        logger.error(`Error fetching pizza places: ${error.message}`, { stack: error.stack });
        throw new Error("Failed to fetch pizza places");
      }
    },

    // Fetch juice places based on location
    searchJuice: async (_, { location }) => {
      if (!location) {
        logger.warn('Location is missing in searchJuice query');
        throw new Error("Location is required");
      }

      try {
        logger.info(`Fetching juice places for location: ${location}`);
        const juicePlaces = await searchPlaces('juice', location);
        logger.info(`Successfully fetched ${juicePlaces.length} juice places`);
        return juicePlaces;
      } catch (error) {
        logger.error(`Error fetching juice places: ${error.message}`, { stack: error.stack });
        throw new Error("Failed to fetch juice places");
      }
    },

    // Fetch both pizza and juice places based on location
    searchCombo: async (_, { location }) => {
      if (!location) {
        logger.warn('Location is missing in searchCombo query');
        throw new Error("Location is required");
      }

      try {
        logger.info(`Fetching combo places (pizza and juice) for location: ${location}`);
        const [pizzaPlaces, juicePlaces] = await Promise.all([
          searchPlaces('pizza', location),
          searchPlaces('juice', location),
        ]);
        logger.info(
          `Successfully fetched ${pizzaPlaces.length} pizza places and ${juicePlaces.length} juice places`
        );
        return [...pizzaPlaces, ...juicePlaces];
      } catch (error) {
        logger.error(`Error fetching combo places: ${error.message}`, { stack: error.stack });
        throw new Error("Failed to fetch combo places");
      }
    },
  },
};

module.exports = { resolvers };
