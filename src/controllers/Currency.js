import {
  setResponseError,
  checkValidationErrors,
} from "../services/errors";
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import CurrencyService from '../services/currency';

class Currency {
  getCurrencyList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const data = await CurrencyService.getList({
        attributes: {
          exclude: [
            'created_at',
            'updated_at',
          ]
        },
        json:true,
      });

      return res.status(HTTP_STATUS.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getCurrencySingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { currency_id } = req.params;
      const currency = await CurrencyService.getSingle(currency_id, {
        attributes: {
          exclude: [
            'created_at',
            'updated_at',
          ]
        },
        json: true,
      });

      if (!currency) {
        return res.status(HTTP_STATUS.NOT_FOUND).send()
      }

      return res.status(HTTP_STATUS.OK).json(currency);

    } catch (err) {
      return setResponseError(res, err)
    }
  };
}

export default new Currency();
