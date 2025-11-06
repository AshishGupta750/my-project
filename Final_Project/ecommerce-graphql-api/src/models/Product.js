const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Use Decimal128 for real money, but Number is ok for experiment
    inStock: { type: Boolean, default: true },
    // This is the link to the Category model
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

// Add a text index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);