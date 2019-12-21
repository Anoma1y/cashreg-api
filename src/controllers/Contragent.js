import DB from '../config/db';
import {
  setResponseError,
  checkValidationErrors,
} from "../services/errors";
import { removeEmpty } from '../helpers';
import { getWhere, getOrder } from '../helpers/sql';
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import ContragentService from '../services/contragent';

class Contragent {
  static ContragentData = (req) => removeEmpty({
    title: req.body.title,
    longTitle: req.body.longTitle,
    description: req.body.description,
    inn: req.body.inn,
    kpp: req.body.kpp,
    type: req.body.type,
    payment_info: req.body.payment_info,
    active: req.body.active,
  });

  getContragentList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;
      const { page, num_on_page } = req.query;

      const where = getWhere(
        req.query,
        {
          queryList: ['type', 'active', 'search'],
          maybeMultipleQuery: ['type'],
        }
      );

      where['workspace_id'] = workspace_id;

      const options = {
        page,
        num_on_page,
        where,
        order: getOrder(req.query),
      };

      const data = await DB.Contragent.paginate(options);

      return res.status(HTTP_STATUS.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getContragentSingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id, contragent_id } = req.params;

      const data = await ContragentService.getSingle(contragent_id, workspace_id, { json: true, });

      if (!data) {
        return res.status(HTTP_STATUS.NOT_FOUND).send();
      }

      return res.status(HTTP_STATUS.OK).json(data);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createContragent = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;

      const createData = await ContragentService.create(workspace_id, Contragent.ContragentData(req));

      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.CATEGORY_CREATED,
        data: createData,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteContragent = async (req, res) => {
    try {
      const { workspace_id, contragent_id } = req.params;

      const deleteData = await ContragentService.delete(contragent_id, workspace_id);

      if (deleteData === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).send();
      }

      return res.status(HTTP_STATUS.NO_CONTENT).json();
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  editContragent = async (req, res) => {
    try {
      await checkValidationErrors(req);
      const { workspace_id, contragent_id } = req.params;

      const data = await ContragentService.edit(contragent_id, workspace_id, Contragent.ContragentData(req));

      return res.status(HTTP_STATUS.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Contragent();
