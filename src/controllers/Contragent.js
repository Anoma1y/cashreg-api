import {
  setResponseError,
  checkValidationErrors,
} from "../helpers/errorHandler";
import { removeEmpty } from '../helpers';
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import ContragentService from '../services/contragent';

class Contragent {
  static ContragentData = (req) => ({
    workspace_id: req.params.workspace_id,
    title: req.body.title,
    longTitle: req.body.longTitle,
    description: req.body.description,
    inn: req.body.inn,
    kpp: req.body.kpp,
    payment_info: req.body.payment_info,
    active: req.body.active,
  });

  getContragentList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;

      const {
        order_by_direction = 'desc',
        order_by_key = 'id',
      } = req.query;

      const where = removeEmpty({
        workspace_id,
      });

      const order = [[order_by_key, order_by_direction]]; // todo add array

      const data = await ContragentService.getList({
        json: true,
        where,
        order,
      });

      return res.status(STATUS_CODES.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getContragentSingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id, contragent_id } = req.params;

      const contragent = await ContragentService.getSingle(contragent_id, { json: true, });

      if (!contragent) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      if (parseInt(contragent.workspace_id) !== parseInt(workspace_id)) {
        return res.status(STATUS_CODES.FORBIDDEN).send();
      }

      return res.status(STATUS_CODES.OK).json(contragent);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createContragent = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const createContragent = await ContragentService.create(Contragent.ContragentData(req));

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.CONTRAGENT_CREATED,
        data: createContragent
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteContragent = async (req, res) => {
    const { workspace_id, contragent_id } = req.params;

    try {
      const contragentDelete = await ContragentService.delete(contragent_id, workspace_id);

      if (contragentDelete === 0) {
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

      const data = await ContragentService.edit(req.params.contragent_id, Contragent.ContragentData(req));

      return res.status(STATUS_CODES.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Contragent();
