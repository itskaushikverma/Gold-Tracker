import axios from 'axios';

const TROY_OUNCE = 31.1034768;
const MG_PER_GRAM = 1000;
const IMPORT_DUTY = 6.0;
const PLATFORM_MARKUP = 3.38;
const GST = 3.0;
const SELL_SPREAD = 4.21;

export const getGoldPrice = async () => {
  try {
    const { data } = await axios.get('https://api.gold-api.com/price/XAU/INR');

    const xauPrice = data.price;

    const spotPricePerMg = xauPrice / TROY_OUNCE / MG_PER_GRAM;

    const premiumPercent = IMPORT_DUTY + PLATFORM_MARKUP;

    let priceWithoutGST = spotPricePerMg * (1 + premiumPercent / 100);

    let priceWithGST = priceWithoutGST * (1 + GST / 100);

    let sellingPrice = priceWithoutGST * (1 - SELL_SPREAD / 100);

    priceWithoutGST = Number(priceWithoutGST.toFixed(2));
    priceWithGST = Number(priceWithGST.toFixed(2));
    sellingPrice = Number(sellingPrice.toFixed(2));

    return {
      success: true,
      message: 'Gold price fetched successfully',
      data: {
        priceWithoutGST,
        priceWithGST,
        sellingPrice,
        currency: data.currency,
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
