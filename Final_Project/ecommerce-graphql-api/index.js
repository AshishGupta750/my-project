const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// --- Import your GraphQL Schema ---
const typeDefs = require('./src/schema/typeDefs');
const resolvers = require('./src/schema/resolvers');

// --- Import Mongoose Models ---
const Product = require('./src/models/Product');
const User = require('./src/models/User');
const Order = require('./src/models/Order');
const Category = require('./src/models/Category');

// --- Import DataLoaders ---
const { createLoaders } = require('./src/loaders');

// --- Import Auth Helper ---
const { getUserFromToken } = require('./src/utils/auth'); // Added this line

const startServer = async () => {
  const app = express();

  // --- This is the updated ApolloServer block ---
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // The context is now an async function to handle auth
    context: async ({ req }) => {
      // 1. Get the user ID from the token (returns null if invalid/not found)
      const userId = getUserFromToken(req);

      // 2. Create new loaders for *this specific request*
      const loaders = createLoaders();

      // 3. Find the user (if they provided a valid token)
      let user = null;
      if (userId) {
        // We use the userLoader to efficiently fetch the user
        // This will also cache the user if it's loaded multiple times
        user = await loaders.userLoader.load(userId);
      }

      // 4. Return the context object available to all resolvers
      return {
        models: {
          Product,
          User,
          Order,
          Category,
        },
        loaders,
        user, // Attach the authenticated user object (or null)
      };
    },
  });
  // --- End of updated block ---

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
};

startServer();