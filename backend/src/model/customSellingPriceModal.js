import mongoose from 'mongoose';

const customSellingPriceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const CustomSellingPriceModel =
  mongoose.models.CustomSellingPrice || mongoose.model('CustomSellingPrice', customSellingPriceSchema);
export default CustomSellingPriceModel;
