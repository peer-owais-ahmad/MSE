const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const logger = require('./src/utils/logger');  // Importing logger from utils
const { typeDefs } = require('./src/graphql/schema');
const { resolvers } = require('./src/graphql/resolvers');
const searchRoutes = require('./src/controllers/searchController');
const rateLimit = require('express-rate-limit'); // Import the rate-limit middleware
require('dotenv').config();

const app = express();

// Rate Limiting Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." },
});

// Apply rate limiting to all routes
app.use(apiLimiter);

// RESTful Endpoints
app.use('/search', searchRoutes);

// GraphQL Endpoint
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
