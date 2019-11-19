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
import { removeEmpty } from '../helpers';
import CategoryService from '../services/category';

class Category {
  getCategoryList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const {
        type,
        workspace_id,
        order_by_direction = 'desc',
        order_by_key = 'id',
      } = req.query;

      const where = removeEmpty({
        type,
        workspace_id,
      });

      const order = [[order_by_key, order_by_direction]]; // todo add array

      const data = await CategoryService.getList({
        json: true,
        where,
        order,
      });

      return res.status(STATUS_CODES.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getCategorySingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { category_id } = req.params;
      const category = await CategoryService.getSingle(category_id, { json: true, });

      if (!category) {
        return res.status(STATUS_CODES.NOT_FOUND).send()
      }

      return res.status(STATUS_CODES.OK).json(category);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createCategory = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { name, description, workspace_id, type, } = req.body;

      await CategoryService.create({ name, description, workspace_id, type, });

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.USER_CREATED
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteCategory = async (req, res) => {
    const { category_id } = req.params;

    try {
      const categoryDelete = await CategoryService.delete(category_id);

      if (categoryDelete === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      return res.status(STATUS_CODES.NO_CONTENT).json();
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  editCategory = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { category_id } = req.params;
      const { name, description, workspace_id, type, } = req.body;

      const data = await CategoryService.edit(category_id, { name, description, workspace_id, type, });

      return res.status(STATUS_CODES.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Category();
