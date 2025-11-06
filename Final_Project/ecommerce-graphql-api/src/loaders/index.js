const DataLoader = require('dataloader');
const Category = require('../models/Category');
const User = require('../models/User');

// Batch function for categories
const batchCategories = async (categoryIds) => {
  console.log('BATCH: Fetching categories for IDs:', categoryIds);

  // Find all categories with IDs in the 'categoryIds' array
  const categories = await Category.find({ _id: { $in: categoryIds } });

  // Return them in the *exact same order* as the IDs were provided.
  // This is a strict requirement for DataLoader.
  const categoryMap = new Map();
  categories.forEach(cat => {
    categoryMap.set(cat._id.toString(), cat);
  });

  return categoryIds.map(id => categoryMap.get(id.toString()));
};

// Batch function for users (e.g., for Orders)
const batchUsers = async (userIds) => {
  console.log('BATCH: Fetching users for IDs:', userIds);
  const users = await User.find({ _id: { $in: userIds } });
  const userMap = new Map();
  users.forEach(user => {
    userMap.set(user._id.toString(), user);
  });
  return userIds.map(id => userMap.get(id.toString()));
};


// This function is called in index.js on *every request*
const createLoaders = () => ({
  categoryLoader: new DataLoader(batchCategories),
  userLoader: new DataLoader(batchUsers),
});

module.exports = { createLoaders };