import DB from '../config/db';
import {
  errorFormatter,
  HttpError,
  setResponseError,
  setResponseErrorValidation,
  checkValidationErrors,
} from "../helpers/errorHandler";
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { validationResult } from 'express-validator/check';
import ContragentService from '../services/contragent';

class Contragent {
  getContragentList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const data = await ContragentService.getList({ json:true });

      return res.status(STATUS_CODES.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getContragentSingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { category_id } = req.params;
      const category = await ContragentService.getSingle(category_id, { json: true, });

      if (!category) {
        return res.status(STATUS_CODES.NOT_FOUND).send()
      }

      return res.status(STATUS_CODES.OK).json(category);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createContragent = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { name, description, workspace_id, type, } = req.body;

      await ContragentService.create({ name, description, workspace_id, type, });

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.USER_CREATED
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteContragent = async (req, res) => {
    const { category_id } = req.params;

    try {
      const categoryDelete = await ContragentService.delete(category_id);

      if (categoryDelete === 0) {
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

      const { category_id } = req.params;
      const { name, description, workspace_id, type, } = req.body;

      const data = await ContragentService.edit(category_id, { name, description, workspace_id, type, });

      return res.status(STATUS_CODES.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Contragent();
