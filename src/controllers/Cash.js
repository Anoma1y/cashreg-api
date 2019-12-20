import { redisSetAsync } from '../config/redis';
import {
  setResponseError,
  checkValidationErrors,
} from "../services/errors";
import { HTTP_STATUS } from '../constants';
import { removeEmpty } from '../helpers';
import CashService from '../services/cash';

class Cash {
  getCash = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        query: {
          currency_id,
          category_id,
          contragent_id,
          type,
          date_from,
          date_to,
        },
        params: {
          workspace_id,
        },
      } = req;

      let cash = [];

      const isFilter = Object.keys(removeEmpty({
        currency_id,
        category_id,
        contragent_id,
        type,
        date_from,
        date_to
      })).length !== 0;

      if (isFilter) {
        cash = await CashService.getCash(workspace_id, req.query); // todo fix
      } else {
        const cacheCash = null; /*await redisGetAsync(`cash:${workspace_id}`);*/

        if (cacheCash) {
          cash = JSON.parse(cacheCash);
        } else {
          cash = await CashService.getCash(workspace_id);

          await redisSetAsync(`cash:${workspace_id}`, JSON.stringify(cash), 'EX', 3600);
        }
      }

      return res.status(HTTP_STATUS.OK).json(cash);
    } catch (err) {
      return setResponseError(res, err)
    }
  };
}

export default new Cash();
