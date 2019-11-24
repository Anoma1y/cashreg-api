import {
  setResponseError,
  checkValidationErrors,
} from "../helpers/errorHandler";
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { removeEmpty } from '../helpers';
import CategoryService from '../services/category';

class Category {
  static CategoryData = (req) => ({
    workspace_id: req.params.workspace_id,
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
  });

  getCategoryList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;

      const {
        type,
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

      const { workspace_id, category_id } = req.params;
      const category = await CategoryService.getSingle(category_id, { json: true, });

      if (!category) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      if (parseInt(category.workspace_id) !== parseInt(workspace_id)) {
        return res.status(STATUS_CODES.FORBIDDEN).send();
      }

      return res.status(STATUS_CODES.OK).json(category);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createCategory = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const createCategory = await CategoryService.create(Category.CategoryData(req));

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.CATEGORY_CREATED,
        data: createCategory,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteCategory = async (req, res) => {
    const { category_id } = req.params;
    const { workspace_id } = req.params;

    try {
      const categoryDelete = await CategoryService.delete(category_id, workspace_id);

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

      const data = await CategoryService.edit(req.params.category_id, Category.CategoryData(req));

      return res.status(STATUS_CODES.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Category();
