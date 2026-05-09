import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
      trim: true,
    },
    investedValue: {
      type: Number,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isSell: {
      status: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Number,
        default: 0,
        trim: true,
      }
    },
  },
  { timestamps: true },
);

const InvestmentModel =
  mongoose.models.Investment || mongoose.model('Investment', investmentSchema);
export default InvestmentModel;
