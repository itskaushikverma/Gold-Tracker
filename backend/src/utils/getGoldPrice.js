import axios from 'axios';

const TROY_OUNCE_IN_GRAMS = 31.1034768;
const MG_PER_GRAM = 1000;

export const getGoldPrice = async () => {
  try {
    const { data } = await axios.get('https://api.gold-api.com/price/XAU/INR');

    const xauPrice = data.price;

    const marketPricePerMg = xauPrice / TROY_OUNCE_IN_GRAMS / MG_PER_GRAM;

    const premiumPercent = 9.38;

    const priceWithoutGST = marketPricePerMg * (1 + premiumPercent / 100);

    const priceWithGST = priceWithoutGST * 1.03;

    return {
      success: true,
      message: 'Gold price fetched successfully',
      data: {
        priceWithoutGST,
        priceWithGST,
        currency: 'INR',
        unit: 'mg',
        updatedAt: data.updatedAt,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};
