import mongoose from 'mongoose';

const customPurchasePriceSchema = new mongoose.Schema(
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

const CustomPurchasePriceModel =
  mongoose.models.CustomPurchasePrice ||
  mongoose.model('CustomPurchasePrice', customPurchasePriceSchema);
export default CustomPurchasePriceModel;
