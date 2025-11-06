const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // We need this to hash the admin password

// --- Load Models ---
// We import the models directly from their files
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const User = require('../src/models/User');

// --- Configure dotenv ---
// This is a CRUCIAL step. By default, 'dotenv' looks for '.env' in the
// *current* folder ('scripts'). We must tell it to look one level up
// in the root folder.
dotenv.config({ path: '../.env' });

// --- Main Seed Function ---
const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    // We use the MONGO_URI from the .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // 2. Clear Existing Data
    // We wipe all collections to start fresh.
    console.log('🧹 Clearing old data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    // Note: You would also delete Orders here if you had them

    // 3. Create Categories
    console.log('Creating categories...');
    const techCategory = new Category({ name: 'Electronics' });
    const bookCategory = new Category({ name: 'Books' });
    const apparelCategory = new Category({ name: 'Apparel' });

    await techCategory.save();
    await bookCategory.save();
    await apparelCategory.save();

    // 4. Create Products
    console.log('Creating products...');
    const products = [
      {
        name: 'MacBook Pro 14"',
        description: 'The latest Apple laptop with M3 chip.',
        price: 1999.99,
        inStock: true,
        category: techCategory.id, // We use the .id from the object we just saved
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'The best mouse for productivity.',
        price: 99.99,
        inStock: true,
        category: techCategory.id,
      },
      {
        name: 'Learning GraphQL',
        description: 'A book on building modern APIs.',
        price: 39.99,
        inStock: true,
        category: bookCategory.id,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'A comfortable 100% cotton t-shirt.',
        price: 19.99,
        inStock: true,
        category: apparelCategory.id,
      },
    ];

    // insertMany is much faster than saving one by one
    await Product.insertMany(products);

    // 5. Create an Admin User
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12); // Hash the password

    const adminUser = new User({
      email: 'admin@ecoshop.com',
      password: hashedPassword,
      isAdmin: true, // Set the admin flag to true
    });
    await adminUser.save();

    // 6. All Done!
    console.log('✅ Database seeded successfully!');
    console.log('Admin User: admin@ecoshop.com');
    console.log('Admin Pass: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // 7. Disconnect from MongoDB
    // This is important so the script doesn't hang
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB.');
  }
};

// --- Run the Function ---
seedDatabase();