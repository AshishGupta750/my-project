const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { GraphQLDateTime } = require('graphql-scalar-datetime');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating tokens

module.exports = {
  // Custom Scalar Resolver
  DateTime: GraphQLDateTime,

  Query: {
    // Resolver for: product(id: ID!)
    product: async (parent, { id }, context) => {
      return context.models.Product.findById(id);
    },

    // Resolver for: products(...)
    products: async (parent, { filter, sort, limit, offset }, context) => {
      const mongoFilter = {};
      if (filter) {
        if (filter.categoryId) mongoFilter.category = filter.categoryId;
        if (filter.inStock) mongoFilter.inStock = true;
        if (filter.priceMin || filter.priceMax) {
          mongoFilter.price = {};
          if (filter.priceMin) mongoFilter.price.$gte = filter.priceMin;
          if (filter.priceMax) mongoFilter.price.$lte = filter.priceMax;
        }
        if (filter.searchText) {
          mongoFilter.$text = { $search: filter.searchText };
        }
      }

      const mongoSort = {};
      if (sort) {
        mongoSort[sort.field] = sort.order === 'ASC' ? 1 : -1;
      } else {
        mongoSort.createdAt = -1; // Default sort
      }

      const nodes = await context.models.Product.find(mongoFilter)
        .sort(mongoSort)
        .skip(offset)
        .limit(limit);

      const totalCount = await context.models.Product.countDocuments(mongoFilter);

      return { nodes, totalCount };
    },

    // --- New Query ---
    me: (parent, args, context) => {
      // We get the user from the context, which was set in index.js
      if (!context.user) {
        throw new AuthenticationError('You are not authenticated');
      }
      return context.user;
    },
  },

  Mutation: {
    createProduct: async (parent, { input }, context) => {
      // Auth check (now works!)
      if (!context.user || !context.user.isAdmin) {
        throw new AuthenticationError('You must be an Admin to create a product.');
      }
      const { name, description, price, categoryId, inStock } = input;
      const product = new context.models.Product({
        name,
        description,
        price,
        category: categoryId,
        inStock,
      });
      await product.save();
      return product;
    },

    // --- New Mutations ---

    register: async (parent, { input }, context) => {
      const { email, password } = input;

      // 1. Check if user already exists
      const existingUser = await context.models.User.findOne({ email });
      if (existingUser) {
        throw new UserInputError('Email already in use');
      }

      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds is a good salt

      // 3. Create and save the new user
      const user = new context.models.User({
        email,
        password: hashedPassword,
        isAdmin: false, // Default to false
      });
      await user.save();

      // 4. Create a JWT
      const token = jwt.sign(
        { userId: user.id }, // Payload: what we want to store in the token
        process.env.JWT_SECRET, // The secret from your .env file
        { expiresIn: '1d' } // Token expires in 1 day
      );

      // 5. Return the token and user
      return { token, user };
    },

    login: async (parent, { input }, context) => {
      const { email, password } = input;

      // 1. Find the user by email
      const user = await context.models.User.findOne({ email });
      if (!user) {
        throw new UserInputError('Invalid credentials'); // Use a generic error
      }

      // 2. Compare the provided password with the stored hash
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new UserInputError('Invalid credentials'); // Use a generic error
    }

      // 3. Password is correct, create a JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // 4. Return the token and user
      return { token, user };
    },
  },

  // --- Field Resolvers ---
  Product: {
    category: (parent, args, context) => {
      return context.loaders.categoryLoader.load(parent.category);
    },
  },

  Category: {
    products: (parent, args, context) => {
      return context.models.Product.find({ category: parent.id });
    },
  },
};