import validator from 'validator';
import { validateSellingPricePerformanceScope } from '../../../utils/validator.js';
import { getManualSellingPricePerformance } from './getManualSellingPricePerformance.js';
import { getSmartSellingPricePerformance } from './getSmartSellingPricePerformance.js';

const SCOPE_CONTROLLERS = {
  my: (req, res, { userId }) =>
    getManualSellingPricePerformance(req, res, {
      userId,
      successMessage: 'My selling price performance data fetched successfully',
    }),
  global: (req, res, { userId }) =>
    getManualSellingPricePerformance(req, res, {
      userId,
      successMessage: 'Global selling price performance data fetched successfully',
    }),
  smart: getSmartSellingPricePerformance,
};

const resolveUserId = (scope, authenticatedUserId) => {
  if (scope === 'global') {
    return process.env.GLOBAL_SELL_PRICE_OWNER_USER_ID;
  }

  return authenticatedUserId;
};

export const getSellingPricePerformance = async (req, res) => {
  try {
    const validated = validateSellingPricePerformanceScope({
      scope: req.query.scope,
    });

    if (validated?.success === false) {
      return res.status(validated.statusCode || 400).json({
        success: false,
        data: validated.data,
        message: validated.message,
      });
    }

    const { scope } = validated;
    const userId = resolveUserId(scope, req.user.id);

    if (!userId) {
      return res.status(500).json({
        success: false,
        data: null,
        message:
          scope === 'global'
            ? 'Global sell price owner is not configured.'
            : 'User not authenticated.',
      });
    }

    if (!validator.isMongoId(String(userId))) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid user id for selling price performance.',
      });
    }

    const controller = SCOPE_CONTROLLERS[scope];

    return controller(req, res, { userId });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch performance data.',
    });
  }
};
