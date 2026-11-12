import mongoose from 'mongoose';

const customSellPriceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const CustomSellPriceModel =
  mongoose.models.CustomSellPrice || mongoose.model('CustomSellPrice', customSellPriceSchema);
export default CustomSellPriceModel;
