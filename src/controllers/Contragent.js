import {
  setResponseError,
  checkValidationErrors,
} from "../helpers/errorHandler";
import { removeEmpty } from '../helpers';
import { getWhere } from '../helpers/sql';
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import ContragentService from '../services/contragent';
import StructuredDataService from '../services/structuredData';

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

      const where = getWhere(
        req.query,
        {
          queryList: ['type', 'active', 'search'],
          maybeMultipleQuery: ['type'],
        }
      );

      where['workspace_id'] = workspace_id;

      const data = await StructuredDataService.withoutPagination(req, where, ContragentService.getList);

      return res.status(STATUS_CODES.OK).json(data);
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
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      return res.status(STATUS_CODES.OK).json(data);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createContragent = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;

      const createData = await ContragentService.create(workspace_id, Contragent.ContragentData(req));

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.CATEGORY_CREATED,
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
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      return res.status(STATUS_CODES.NO_CONTENT).json();
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  editContragent = async (req, res) => {
    try {
      await checkValidationErrors(req);
      const { workspace_id, contragent_id } = req.params;

      const data = await ContragentService.edit(contragent_id, workspace_id, Contragent.ContragentData(req));

      return res.status(STATUS_CODES.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Contragent();
